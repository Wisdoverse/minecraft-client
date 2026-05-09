#!/usr/bin/env node

const mineflayer = require('mineflayer');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');
const { Vec3 } = require('vec3');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const WebSocket = require('ws');

// ============================================================
// Command Line Arguments
// ============================================================

const args = process.argv.slice(2);
const params = {};
for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith('--')) {
    const key = args[i].slice(2);
    const value = args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true;
    params[key] = value;
    if (value !== true) i++;
  }
}

if (!params.host || !params.username) {
  console.error(JSON.stringify({
    success: false,
    error: 'Missing required parameters: --host and --username are required'
  }, null, 2));
  process.exit(1);
}

const connectionId = crypto.randomUUID().slice(0, 8);

// ============================================================
// Observer Platform Configuration
// ============================================================

const observerConfig = {
  wsUrl: process.env.OBSERVER_WS_URL || params['observer-ws'] || null,
  token: process.env.OBSERVER_TOKEN || params['observer-token'] || null,
  enabled: !!(process.env.OBSERVER_WS_URL || params['observer-ws']),
  statusInterval: 30000,
  snapshotInterval: 60000,
  reconnectInterval: 5000
};

let observerWs = null;
let statusTimer = null;
let snapshotTimer = null;
let reconnectTimer = null;
let intentionalDisconnect = false;
let reconnectAttempts = 0;
const MAX_RECONNECT_ATTEMPTS = 5;
const agentId = `minecraft-client-${connectionId}`;

// ============================================================
// Event Type Mapping (to observer platform spec)
// ============================================================

const ACTION_TO_EVENT = {
  'move': 'moved',
  'jump': 'jumped',
  'chat': 'chat_sent',
  'chat:received': 'chat_received',
  'break': 'block_broken',
  'place': 'block_placed',
  'equip': 'inventory_changed',
  'attack': 'attacked',
  'drop': 'item_dropped',
  'use': 'item_used',
  'eat': 'item_used',
  'look': 'moved',
  'sleep': 'custom',
  'wake': 'custom',
  'fish': 'item_used',
  'open-chest': 'chest_opened',
  'craft': 'item_crafted',
  'smelt': 'item_smelted',
  'smelt:complete': 'item_smelted',
  'chest:store': 'item_deposited',
  'chest:withdraw': 'item_withdrawn',
  'chest:list': 'chest_opened',
  'sleep:auto': 'custom',
  'swim': 'moved',
  'goto': 'moved',
  'collect': 'item_picked_up',
  'monitor': 'custom',
  'inventory:list': 'inventory_changed',
  'inventory:move': 'inventory_changed',
  'status': 'custom',
  'entity:spawn': 'world_changed',
  'entity:despawn': 'world_changed',
  'health:decrease': 'damaged',
  'health:increase': 'custom',
  'connected': 'connected',
  'disconnected': 'disconnected',
  'disconnect:requested': 'disconnected',
  'kicked': 'disconnected',
  'error': 'custom',
  'respawn': 'respawned',
  'died': 'died',
  'boat:enter': 'custom',
  'boat:exit': 'custom',
  'minecart:enter': 'custom',
  'minecart:exit': 'custom',
  'furnace:cleared': 'custom',
  'whitelist:add': 'custom',
  'whitelist:remove': 'custom',
  'fish:bite': 'custom',
  'fish:reeled': 'item_picked_up'
};

function mapEventType(action) {
  return ACTION_TO_EVENT[action] || 'custom';
}

// Items that should never be dropped by default
const DROP_WHITELIST = new Set([
  "diamond_sword", "diamond_pickaxe", "diamond_axe", "diamond_shovel",
  "netherite_sword", "netherite_pickaxe", "netherite_axe", "netherite_shovel",
  "shield", "bow", "crossbow", "trident",
  "elytra", "horse_armor_diamond", "horse_armor_iron",
]);

// Standard error codes for structured error responses
const ERROR_CODES = {
  INSUFFICIENT_MATERIALS: { message: "Not enough materials in inventory", suggestion: "Collect more materials before crafting" },
  NO_FURNACE_FOUND: { message: "No furnace found nearby", suggestion: "Place a furnace within 5 blocks or specify a position" },
  CHEST_FULL: { message: "Target chest is full", suggestion: "Find another chest or clear some items first" },
  NO_BED_FOUND: { message: "No bed found nearby", suggestion: "Place a bed within 10 blocks" },
  NOT_SLEEPING: { message: "Player is not currently sleeping", suggestion: "Find a bed and use sleep command first" },
  ALREADY_SLEEPING: { message: "Player is already sleeping", suggestion: "Use wake command to get up" },
  NO_TARGET: { message: "No valid target specified", suggestion: "Specify a target entity or position" },
  OUT_OF_RANGE: { message: "Target is out of range", suggestion: "Move closer to the target" },
  INVALID_ITEM: { message: "Invalid item name or ID", suggestion: "Check the item name and try again" },
  BLOCK_NOT_FOUND: { message: "Target block not found", suggestion: "Verify the position or search nearby area" },
  ENTITY_NOT_FOUND: { message: "Target entity not found", suggestion: "Look for the entity or wait for it to spawn" },
  PATHFIND_FAILED: { message: "Cannot reach destination", suggestion: "Check for obstacles or try a different route" },
};

// ============================================================
// Observer Platform WebSocket Functions
// ============================================================

function connectToObserver() {
  if (!observerConfig.wsUrl) {
    console.error(JSON.stringify({ success: false, error: 'Observer WebSocket URL not configured' }, null, 2));
    return;
  }

  try {
    observerWs = new WebSocket(observerConfig.wsUrl, {
      headers: observerConfig.token ? { 'Authorization': `Bearer ${observerConfig.token}` } : {}
    });

    observerWs.on('open', () => {
      console.error(JSON.stringify({ success: true, message: 'Connected to observer platform' }, null, 2));
      reconnectAttempts = 0; // Reset on successful connection
      registerAgent();
      startStatusUpdates();
      startSnapshotUpdates();
    });

    observerWs.on('message', (data) => {
      try {
        const message = JSON.parse(data);
        handleObserverMessage(message);
      } catch (err) {
        console.error('Failed to parse observer message:', err.message);
      }
    });

    observerWs.on('close', () => {
      console.error('Observer WebSocket closed, reconnecting...');
      stopStatusUpdates();
      stopSnapshotUpdates();
      if (!intentionalDisconnect) {
        scheduleReconnect();
      }
    });

    observerWs.on('error', (err) => {
      console.error('Observer WebSocket error:', err.message);
    });

  } catch (err) {
    console.error('Failed to connect to observer:', err.message);
    scheduleReconnect();
  }
}

function registerAgent() {
  if (!observerWs || observerWs.readyState !== WebSocket.OPEN) return;

  sendToObserver({
    type: 'agent:register',
    payload: {
      agentId: agentId,
      username: params.username,
      serverHost: params.host,
      serverPort: parseInt(params.port) || 25565
    }
  });
}

// ============================================================
// Status Update (matches platform spec exactly)
// ============================================================

function sendStatusUpdate() {
  if (!bot || !bot.entity || !observerWs || observerWs.readyState !== WebSocket.OPEN) return;

  // Build inventory array
  const inventory = bot.inventory.items().map(item => ({
    slot: item.slot,
    name: 'minecraft:' + item.name,
    displayName: item.displayName || item.name,
    count: item.count
  }));

  // Build equipment object
  const equipment = {};
  const headSlot = bot.inventory.slots[5];
  const chestSlot = bot.inventory.slots[6];
  const legsSlot = bot.inventory.slots[7];
  const feetSlot = bot.inventory.slots[8];

  if (headSlot) equipment.head = { slot: -1, name: 'minecraft:' + headSlot.name, displayName: headSlot.displayName || headSlot.name, count: headSlot.count };
  if (chestSlot) equipment.chest = { slot: -2, name: 'minecraft:' + chestSlot.name, displayName: chestSlot.displayName || chestSlot.name, count: chestSlot.count };
  if (legsSlot) equipment.legs = { slot: -3, name: 'minecraft:' + legsSlot.name, displayName: legsSlot.displayName || legsSlot.name, count: legsSlot.count };
  if (feetSlot) equipment.feet = { slot: -4, name: 'minecraft:' + feetSlot.name, displayName: feetSlot.displayName || feetSlot.name, count: feetSlot.count };
  if (bot.heldItem) equipment.mainhand = { slot: -1, name: 'minecraft:' + bot.heldItem.name, displayName: bot.heldItem.displayName || bot.heldItem.name, count: bot.heldItem.count };

  const statusMsg = {
    type: 'agent:status:update',
    payload: {
      agentId: agentId,
      status: {
        id: agentId,
        username: params.username,
        connected: true,
        position: {
          x: Math.floor(bot.entity.position.x),
          y: Math.floor(bot.entity.position.y),
          z: Math.floor(bot.entity.position.z)
        },
        health: bot.health,
        maxHealth: 20,
        food: bot.food,
        saturation: bot.foodSaturation,
        gamemode: bot.game.gameMode,
        inventory: inventory,
        equipment: equipment,
        world: params.host,
        dimension: bot.game.dimension,
        yaw: Math.round(bot.entity.yaw * 100) / 100,
        pitch: Math.round(bot.entity.pitch * 100) / 100,
        isOnGround: bot.entity.onGround,
        isSleeping: bot.isSleeping,
        isSprinting: bot.controlState.sprint,
        isSneaking: bot.controlState.sneak,
        lastUpdated: Date.now()
      }
    }
  };

  sendToObserver(statusMsg);
}

// ============================================================
// World Snapshot (matches platform spec exactly)
// ============================================================

function sendWorldSnapshot() {
  if (!bot || !bot.entity || !observerWs || observerWs.readyState !== WebSocket.OPEN) return;

  // Build blocks array (scan nearby area - limited range for performance)
  const blocks = [];
  const range = 3;
  const py = Math.floor(bot.entity.position.y);
  for (let x = -range; x <= range; x++) {
    for (let z = -range; z <= range; z++) {
      for (let y = -1; y <= 2; y++) {  // Only scan ground level + 2 layers
        const block = bot.blockAt(bot.entity.position.offset(x, y - Math.floor(bot.entity.position.y) + py, z));
        if (block && block.name !== 'air') {
          blocks.push({
            position: {
              x: Math.round(bot.entity.position.x + x),
              y: py + y,
              z: Math.round(bot.entity.position.z + z)
            },
            type: block.name,
            name: block.displayName || block.name,
            light: (block.skyLight || 0) + (block.blockLight || 0)
          });
        }
      }
    }
  }

  // Build entities array
  const entities = Object.values(bot.entities)
    .filter(e => e.position && e.name && bot.entity.position.distanceTo(e.position) <= 64)
    .map(e => ({
      id: e.id,
      type: e.name || e.type,
      name: e.displayName || e.name || e.type,
      position: {
        x: Math.round(e.position.x * 10) / 10,
        y: Math.round(e.position.y * 10) / 10,
        z: Math.round(e.position.z * 10) / 10
      },
      distance: Math.round(bot.entity.position.distanceTo(e.position) * 10) / 10
    }));

  const snapshotMsg = {
    type: 'agent:world:snapshot',
    payload: {
      agentId: agentId,
      snapshot: {
        blocks: blocks,
        entities: entities,
        timestamp: Date.now()
      }
    }
  };

  sendToObserver(snapshotMsg);
}

// ============================================================
// Event (matches platform spec exactly)
// ============================================================

function sendEvent(action, data) {
  if (!observerWs || observerWs.readyState !== WebSocket.OPEN) return;

  const eventType = mapEventType(action);

  // Generate description based on action
  let description = '';
  switch (action) {
    case 'move': description = `Moved ${data.direction || 'forward'}`; break;
    case 'jump': description = 'Jumped'; break;
    case 'chat': description = `Sent chat: ${data.message || ''}`; break;
    case 'chat:received': description = `Received chat from ${data.from || 'unknown'}: ${data.message || ''}`; break;
    case 'break': description = `Broke block at (${data.position ? data.position.x + ',' + data.position.y + ',' + data.position.z : '?'})`; break;
    case 'place': description = `Placed block at (${data.position ? data.position.x + ',' + data.position.y + ',' + data.position.z : '?'})`; break;
    case 'equip': description = `Equipped item to ${data.destination || 'hand'}`; break;
    case 'attack': description = `Attacked ${data.entity || 'entity'}`; break;
    case 'drop': description = `Dropped ${data.count || 1} item(s) from slot ${data.slot}`; break;
    case 'use': description = `Used item in slot ${data.slot}`; break;
    case 'eat': description = 'Ate food'; break;
    case 'look': description = `Looked at ${data.yaw !== undefined ? 'yaw=' + data.yaw + ' pitch=' + data.pitch : 'position'}`; break;
    case 'sleep': description = 'Went to sleep'; break;
    case 'wake': description = 'Woke up'; break;
    case 'fish': description = 'Fishing'; break;
    case 'open-chest': description = `Opened chest with ${data.itemCount || 0} items`; break;
    case 'goto': description = `Moving to (${data.position ? data.position.x + ',' + data.position.y + ',' + data.position.z : '?'})`; break;
    case 'collect': description = `Collecting ${data.itemType || 'items'}`; break;
    case 'connected': description = 'Connected to server'; break;
    case 'disconnected': description = `Disconnected: ${data.reason || 'unknown'}`; break;
    case 'disconnect:requested': description = 'Disconnecting from server'; break;
    case 'kicked': description = `Kicked from server: ${data.reason || 'unknown'}`; break;
    case 'health:decrease': description = `Damaged (health: ${data.health})`; break;
    case 'health:increase': description = `Healed (health: ${data.health})`; break;
    case 'died': description = 'Died'; break;
    case 'respawn': description = 'Respawned'; break;
    case 'inventory:list': description = `Checked inventory (${data.itemCount || 0} items)`; break;
    case 'entity:spawn': description = `Entity spawned: ${data.name || data.type || 'unknown'}`; break;
    case 'entity:despawn': description = `Entity despawned: ${data.type || 'unknown'}`; break;
    case 'inventory:move': description = `Moved item from slot ${data.from} to ${data.to}`; break;
    case 'craft': description = `Crafted ${data.amount || 1}x ${data.item || 'item'}`; break;
    case 'smelt': description = `Started smelting ${data.amount || 1}x ${data.item || 'item'}`; break;
    case 'smelt:complete': description = `Finished smelting ${data.outputItem || 'item'}`; break;
    case 'chest:store': description = `Stored ${data.amount || 1}x ${data.item || 'item'} in chest`; break;
    case 'chest:withdraw': description = `Withdrew ${data.amount || 1}x ${data.item || 'item'} from chest`; break;
    case 'chest:list': description = 'Listed chest contents'; break;
    case 'sleep:auto': description = 'Went to sleep (auto-found bed)'; break;
    case 'swim': description = 'Started swimming'; break;
    default: description = action;
  }

  const eventMsg = {
    type: 'agent:event',
    payload: {
      agentId: agentId,
      event: {
        type: eventType,
        description: description,
        data: data
      }
    }
  };

  sendToObserver(eventMsg);
}

function sendToObserver(message) {
  if (!observerWs || observerWs.readyState !== WebSocket.OPEN) return;
  try {
    if (params.debug) console.error(`[OBSERVER-OUT] ${JSON.stringify(message)}`);
    observerWs.send(JSON.stringify(message));
  } catch (err) {
    console.error('Failed to send to observer:', err.message);
  }
}

function handleObserverMessage(message) {
  switch (message.type) {
    case 'agent:register:ack':
      console.error('Observer registration confirmed:', JSON.stringify(message.payload));
      break;
    case 'server:request:world:snapshot':
      sendWorldSnapshot();
      break;
    case 'server:command':
      handleServerCommand(message.payload);
      break;
    default:
      console.error('Unknown observer message type:', message.type);
  }
}

function handleServerCommand(data) {
  console.error('Received server command:', JSON.stringify(data));
}

function startStatusUpdates() {
  if (statusTimer) clearInterval(statusTimer);
  sendStatusUpdate();
  statusTimer = setInterval(() => {
    sendStatusUpdate();
  }, observerConfig.statusInterval);
}

function stopStatusUpdates() {
  if (statusTimer) { clearInterval(statusTimer); statusTimer = null; }
}

function startSnapshotUpdates() {
  if (snapshotTimer) clearInterval(snapshotTimer);
  setTimeout(() => sendWorldSnapshot(), 3000);
  snapshotTimer = setInterval(() => {
    sendWorldSnapshot();
  }, observerConfig.snapshotInterval);
}

function stopSnapshotUpdates() {
  if (snapshotTimer) { clearInterval(snapshotTimer); snapshotTimer = null; }
}

function scheduleReconnect() {
  if (intentionalDisconnect) return;
  if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
    console.error('Max reconnect attempts reached, giving up observer connection');
    return;
  }
  if (reconnectTimer) clearTimeout(reconnectTimer);
  reconnectAttempts++;
  const delay = observerConfig.reconnectInterval * reconnectAttempts; // Backoff
  console.error(`Reconnecting observer in ${delay}ms (attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})...`);
  reconnectTimer = setTimeout(() => {
    connectToObserver();
  }, delay);
}

function disconnectObserver() {
  intentionalDisconnect = true;
  stopStatusUpdates();
  stopSnapshotUpdates();
  if (reconnectTimer) clearTimeout(reconnectTimer);
  if (observerWs) {
    try {
      if (observerWs.readyState === 1) {
        observerWs.send(JSON.stringify({
          type: 'agent:disconnect',
          payload: { agentId: agentId, reason: 'bot_shutdown' }
        }));
      }
    } catch (e) { /* ignore */ }
    observerWs.close();
    observerWs = null;
  }
}

// ============================================================
// Bot Creation & Event Handlers
// ============================================================

const socketPath = `/tmp/minecraft-bot-${connectionId}.sock`;
const botConfig = {
  host: params.host,
  port: params.port || 25565,
  username: params.username,
  auth: params.auth || 'offline',
  password: params.password || null
};

const bot = mineflayer.createBot(botConfig);
bot.loadPlugin(pathfinder);

let connectionState = 'connecting';
let connectionSocket = null;
let chatHistory = [];
let nearEntities = {};
let lastHealth = 20;

// Chat messages
bot.on('chat', (username, message) => {
  if (username !== bot.username) {
    chatHistory.push({ username, message, timestamp: Date.now() });
    if (chatHistory.length > 50) chatHistory.shift();
    sendEvent('chat:received', { from: username, message: message });
  }
});

// Entity spawns/despawns (throttled: skip common ambient/passive entities)
const ENTITY_EVENT_THROTTLE = {};
const ENTITY_THROTTLE_MS = 30000; // 30s throttle per entity type
bot.on('entitySpawn', (entity) => {
  nearEntities[entity.id] = { id: entity.id, type: entity.name || entity.type, position: entity.position };
  // Skip bats, ambient entities, and passive mobs to reduce noise
  if (entity.name === 'bat' || entity.type === 'ambient' || entity.name === 'item' || entity.name === 'arrow' || entity.name === 'experience_orb') return;
  // Throttle per entity type
  const key = 'spawn:' + (entity.name || entity.type);
  const now = Date.now();
  if (ENTITY_EVENT_THROTTLE[key] && (now - ENTITY_EVENT_THROTTLE[key]) < ENTITY_THROTTLE_MS) return;
  ENTITY_EVENT_THROTTLE[key] = now;
  sendEvent('entity:spawn', { id: entity.id, type: entity.name || entity.type, name: entity.displayName || entity.name });
});

bot.on('entityGone', (entity) => {
  delete nearEntities[entity.id];
  if (entity.name === 'bat' || entity.type === 'ambient' || entity.name === 'item' || entity.name === 'arrow' || entity.name === 'experience_orb') return;
  const key = 'despawn:' + (entity.name || entity.type);
  const now = Date.now();
  if (ENTITY_EVENT_THROTTLE[key] && (now - ENTITY_EVENT_THROTTLE[key]) < ENTITY_THROTTLE_MS) return;
  ENTITY_EVENT_THROTTLE[key] = now;
  sendEvent('entity:despawn', { id: entity.id, type: entity.name || entity.type });
});

// Health changes
bot.on('health', () => {
  if (bot.health < lastHealth) {
    sendEvent('health:decrease', { health: bot.health, food: bot.food });
  } else if (bot.health > lastHealth) {
    sendEvent('health:increase', { health: bot.health, food: bot.food });
  }
  lastHealth = bot.health;
});

// Death
bot.on('death', () => {
  sendEvent('died', { position: { x: Math.floor(bot.entity.position.x), y: Math.floor(bot.entity.position.y), z: Math.floor(bot.entity.position.z) } });
});

// Respawn
bot.on('respawn', () => {
  sendEvent('respawn', { position: { x: Math.floor(bot.entity.position.x), y: Math.floor(bot.entity.position.y), z: Math.floor(bot.entity.position.z) } });
});

// Connect
bot.on('connect', () => {
  connectionState = 'connected';
  console.log(JSON.stringify({
    success: true, connectionId: connectionId, status: 'connected', message: 'Successfully connected to server'
  }, null, 2));

  // Pathfinder setup
  setTimeout(() => {
    try {
      const mcData = require('minecraft-data')(bot.version);
      if (mcData && mcData.blocksByName) {
        const defaultMove = new Movements(bot, mcData);
        bot.pathfinder.setMovements(defaultMove);
      }
    } catch (err) { /* pathfinder setup failed, bot can still work without it */ }
  }, 1000);

  // Connect to observer when bot spawns
  bot.once('spawn', () => {
    console.log(JSON.stringify({ success: true, message: 'Bot spawned successfully' }, null, 2));
    sendEvent('connected', { serverHost: params.host, serverPort: parseInt(params.port) || 25565 });
    if (observerConfig.enabled) {
      connectToObserver();
    }
  });

  // Start socket server for IPC
  try {
    const net = require('net');
    connectionSocket = net.createServer((socket) => {
      socket.on('data', (data) => {
        try {
          const command = JSON.parse(data.toString());
          handleBotCommand(command, socket);
        } catch (err) {
          socket.write(JSON.stringify({ success: false, error: 'Invalid command format' }));
        }
      });
    });

    connectionSocket.listen(socketPath, () => {
      fs.chmodSync(socketPath, 0o777);
      console.log(JSON.stringify({ success: true, message: 'Socket server started', socketPath: socketPath }, null, 2));
    });
  } catch (err) {
    console.log(JSON.stringify({ success: false, message: 'Socket server failed', error: err.message }, null, 2));
  }
});

bot.on('error', (err) => {
  connectionState = 'error';
  console.error(JSON.stringify({ success: false, connectionId: connectionId, error: err.message, errorType: err.code }, null, 2));
  sendEvent('error', { error: err.message, code: err.code });
  disconnectObserver();
  cleanup();
  process.exit(1);
});

bot.on('end', () => {
  connectionState = 'disconnected';
  console.log(JSON.stringify({ success: false, connectionId: connectionId, message: 'Connection ended', state: connectionState }, null, 2));
  sendEvent('disconnected', { reason: 'connection_ended' });
  disconnectObserver();
  cleanup();
  process.exit(0);
});

bot.on('kicked', (reason) => {
  console.log(JSON.stringify({ success: false, connectionId: connectionId, message: 'Kicked from server', reason: reason }, null, 2));
  sendEvent('kicked', { reason: reason });
  disconnectObserver();
  cleanup();
  process.exit(0);
});

// ============================================================
// Command Handlers
// ============================================================

async function handleBotCommand(command, socket) {
  try {
    switch (command.type) {
      case 'move': handleMove(command, socket); break;
      case 'use': handleUse(command, socket); break;
      case 'break': handleBreak(command, socket); break;
      case 'place': handlePlace(command, socket); break;
      case 'chat': handleChat(command, socket); break;
      case 'jump': handleJump(command, socket); break;
      case 'equip': handleEquip(command, socket); break;
      case 'attack': handleAttack(command, socket); break;
      case 'drop': handleDrop(command, socket); break;
      case 'look': handleLook(command, socket); break;
      case 'eat': handleEat(socket); break;
      case 'sleep': handleSleep(command, socket); break;
      case 'wake': handleWake(socket); break;
      case 'fish': handleFish(socket); break;
      case 'boat': handleBoat(command, socket); break;
      case 'minecart': handleMinecart(command, socket); break;
      case 'block': handleBlock(command, socket); break;
      case 'open-chest': handleOpenChest(command, socket); break;
      case 'status': handleStatus(socket); break;
      case 'disconnect':
        socket.write(JSON.stringify({ success: true, message: 'Disconnecting' }));
        sendEvent('disconnect:requested', {});
        cleanup();
        bot.quit();
        break;
      case 'goto': handleGoto(command, socket); break;
      case 'collect': handleCollect(command, socket); break;
      case 'monitor': handleMonitor(command, socket); break;
      case 'inventory': handleInventory(command, socket); break;
      case 'craft': handleCraft(command, socket); break;
      case 'smelt': handleSmelt(command, socket); break;
      case 'chest': handleChest(command, socket); break;
      case 'sleep-auto': handleSleepAuto(command, socket); break;
      case 'swim': handleSwim(command, socket); break;
      case 'query': handleQuery(command, socket); break;
      case 'farm': handleFarm(command, socket); break;
      case 'trade': handleTrade(command, socket); break;
      case 'vision': handleVision(command, socket); break;
      case 'build': await handleBuild(command, socket); break;
      case 'events': handleEvents(command, socket); break;
      case 'multi': handleMulti(command, socket); break;
      default:
        socket.write(JSON.stringify({ success: false, error: 'Unknown command type: ' + command.type }));
    }
  } catch (err) {
    socket.write(JSON.stringify({ success: false, error: err.message, stack: err.stack }));
  }
}

function handleMove(command, socket) {
  const direction = command.direction || 'forward';
  const control = bot.controlState;
  switch (direction) {
    case 'forward': control.forward = true; break;
    case 'backward': control.back = true; break;
    case 'left': control.left = true; break;
    case 'right': control.right = true; break;
  }
  socket.write(JSON.stringify({ success: true, action: 'move', direction: direction }));
  sendEvent('move', { direction: direction });
}

function handleUse(command, socket) {
  const slot = command.slot !== undefined ? parseInt(command.slot) : bot.heldItemSlot;
  if (isNaN(slot) || slot < 0) {
    socket.write(JSON.stringify({ success: false, error: 'Invalid slot number' }));
    return;
  }
  bot.setQuickBarSlot(slot);
  bot.activateItem();
  socket.write(JSON.stringify({ success: true, action: 'use', slot: slot }));
  sendEvent('use', { slot: slot });
}

function handleBreak(command, socket) {
  const pos = parsePosition(command.position);
  if (!pos) {
    socket.write(JSON.stringify({ success: false, error: 'Invalid position format' }));
    return;
  }
  const target = bot.blockAt(pos);
  if (target) {
    bot.dig(target).then(() => {
      socket.write(JSON.stringify({ success: true, action: 'break', position: pos }));
      sendEvent('break', { blockType: target.name, position: { x: pos.x, y: pos.y, z: pos.z } });
    }).catch((err) => {
      socket.write(JSON.stringify({ success: false, error: err.message }));
    });
  } else {
    socket.write(JSON.stringify({ success: false, error: 'No block at position' }));
  }
}

function handlePlace(command, socket) {
  const pos = parsePosition(command.position);
  if (!pos) {
    socket.write(JSON.stringify({ success: false, error: 'Invalid position format' }));
    return;
  }
  const target = bot.blockAt(pos);
  if (target) {
    bot.placeBlock(target, new Vec3(0, 1, 0)).then(() => {
      socket.write(JSON.stringify({ success: true, action: 'place', position: pos }));
      sendEvent('place', { blockType: target.name, position: { x: pos.x, y: pos.y, z: pos.z } });
    }).catch((err) => {
      socket.write(JSON.stringify({ success: false, error: err.message }));
    });
  } else {
    socket.write(JSON.stringify({ success: false, error: 'No block at position' }));
  }
}

function handleChat(command, socket) {
  const message = command.message || '';
  bot.chat(message);
  socket.write(JSON.stringify({ success: true, action: 'chat', message: message }));
  sendEvent('chat', { message: message });
}

function handleJump(command, socket) {
  bot.setControlState('jump', true);
  setTimeout(() => { bot.setControlState('jump', false); }, 500);
  socket.write(JSON.stringify({ success: true, action: 'jump' }));
  sendEvent('jump', {});
}

function handleEquip(command, socket) {
  const slot = command.slot !== undefined ? parseInt(command.slot) : null;
  const destination = command.destination || 'hand';
  if (slot === null) {
    socket.write(JSON.stringify({ success: false, error: 'Slot parameter is required for equip' }));
    return;
  }
  bot.equip(bot.inventory.slots[slot], destination).then(() => {
    socket.write(JSON.stringify({ success: true, action: 'equip', slot: slot, destination: destination }));
    sendEvent('equip', { slot: slot, destination: destination });
  }).catch((err) => {
    socket.write(JSON.stringify({ success: false, error: err.message }));
  });
}

function handleAttack(command, socket) {
  let target = null;
  if (command['entity-uuid']) {
    target = Object.values(bot.entities).find(e => e.uuid === command['entity-uuid']);
  } else if (command['entity-name']) {
    target = Object.values(bot.entities).find(e => e.name === command['entity-name']);
  }
  if (target) {
    bot.attack(target).then(() => {
      socket.write(JSON.stringify({ success: true, action: 'attack', entity: target.name }));
      sendEvent('attack', { entity: target.name, entityId: target.id });
    }).catch((err) => {
      socket.write(JSON.stringify({ success: false, error: err.message }));
    });
  } else {
    socket.write(JSON.stringify({ success: false, error: 'Entity not found' }));
  }
}

	function handleDrop(command, socket) {
	  const itemName = command.item;
	  const slot = command.slot !== undefined ? parseInt(command.slot) : bot.heldItemSlot;
	  const count = command.count !== undefined ? parseInt(command.count) : null;

	  // Handle whitelist management
	  if (command.action === 'whitelist:add' && itemName) {
	    DROP_WHITELIST.add(itemName);
	    socket.write(JSON.stringify({ success: true, action: 'whitelist:add', item: itemName, whitelist: Array.from(DROP_WHITELIST) }));
	    return;
	  }
	  if (command.action === 'whitelist:remove' && itemName) {
	    DROP_WHITELIST.delete(itemName);
	    socket.write(JSON.stringify({ success: true, action: 'whitelist:remove', item: itemName, whitelist: Array.from(DROP_WHITELIST) }));
	    return;
	  }
	  if (command.action === 'whitelist:list') {
	    socket.write(JSON.stringify({ success: true, action: 'whitelist:list', whitelist: Array.from(DROP_WHITELIST) }));
	    return;
	  }

	  // Check whitelist before dropping
	  if (itemName && DROP_WHITELIST.has(itemName)) {
	    const errCode = ERROR_CODES.ITEM_PROTECTED || { message: "Item is protected by whitelist", suggestion: "Remove from whitelist first using whitelist:remove" };
	    socket.write(JSON.stringify({ success: false, error: { code: 'ITEM_PROTECTED', message: errCode.message, details: { item: itemName }, suggestions: [errCode.suggestion] } }));
	    return;
	  }

	  // Get item to drop
	  const itemToDrop = command.item
	    ? bot.inventory.items().find(i => i.name === itemName)
	    : bot.inventory.slots[slot];

	  if (!itemToDrop) {
	    const errCode = ERROR_CODES.INVALID_ITEM || { message: "Item not found in inventory", suggestion: "Check if you have the item" };
	    socket.write(JSON.stringify({ success: false, error: { code: 'INVALID_ITEM', message: errCode.message, details: { item: itemName }, suggestions: [errCode.suggestion] } }));
	    return;
	  }

	  bot.toss(itemToDrop, null, count).then(() => {
	    socket.write(JSON.stringify({ success: true, action: 'drop', item: itemToDrop.name, displayName: itemToDrop.displayName, count: count || itemToDrop.count }));
	    sendEvent('drop', { item: itemToDrop.name, count: count || itemToDrop.count });
	  }).catch((err) => {
	    socket.write(JSON.stringify({ success: false, error: { code: 'DROP_FAILED', message: err.message, suggestions: ["Check if inventory is open", "Try again"] } }));
	  });
	}

function handleLook(command, socket) {
  if (command.yaw !== undefined && command.pitch !== undefined) {
    bot.look(parseFloat(command.yaw), parseFloat(command.pitch));
    socket.write(JSON.stringify({ success: true, action: 'look', yaw: command.yaw, pitch: command.pitch }));
    sendEvent('look', { yaw: command.yaw, pitch: command.pitch });
  } else if (command.position) {
    const pos = parsePosition(command.position);
    if (pos) {
      bot.lookAt(pos);
      socket.write(JSON.stringify({ success: true, action: 'look', position: pos }));
      sendEvent('look', { position: { x: pos.x, y: pos.y, z: pos.z } });
    } else {
      socket.write(JSON.stringify({ success: false, error: 'Invalid position format' }));
    }
  } else {
    socket.write(JSON.stringify({ success: false, error: 'Either yaw/pitch or position is required' }));
  }
}

function handleEat(socket) {
  if (bot.food < 20) {
    bot.eat().then(() => {
      socket.write(JSON.stringify({ success: true, action: 'eat' }));
      sendEvent('eat', { food: bot.food });
    }).catch((err) => {
      socket.write(JSON.stringify({ success: false, error: err.message }));
    });
  } else {
    socket.write(JSON.stringify({ success: false, error: 'Already full' }));
  }
}

function handleSleep(command, socket) {
  const pos = parsePosition(command.position);
  if (!pos) {
    socket.write(JSON.stringify({ success: false, error: 'Invalid position format' }));
    return;
  }
  const bedBlock = bot.blockAt(pos);
  if (bedBlock) {
    bot.sleep(bedBlock).then(() => {
      socket.write(JSON.stringify({ success: true, action: 'sleep', position: pos }));
      sendEvent('sleep', { position: { x: pos.x, y: pos.y, z: pos.z } });
    }).catch((err) => {
      socket.write(JSON.stringify({ success: false, error: err.message }));
    });
  } else {
    socket.write(JSON.stringify({ success: false, error: 'No block at position' }));
  }
}

function handleWake(socket) {
  try {
    bot.wake();
    socket.write(JSON.stringify({ success: true, action: 'wake' }));
    sendEvent('wake', {});
  } catch (err) {
    socket.write(JSON.stringify({ success: false, error: err.message }));
  }
}

function handleFish(socket) {
  bot.fish().then(() => {
    socket.write(JSON.stringify({ success: true, action: 'fish', result: 'caught' }));
    sendEvent('fish', { result: 'caught' });
  }).catch((err) => {
    socket.write(JSON.stringify({ success: false, error: err.message }));
  });
}

function handleBoat(command, socket) {
  const action = command.action || 'enter';
  const pos = command.position ? parsePosition(command.position) : null;

  if (action === 'enter') {
    if (pos) {
      // Go to specific boat position and enter
      bot.pathfinder.setGoal(new GoalNear(pos.x, pos.y, pos.z, 0.5), true);
      bot.once('goal_reached', () => {
        tryEnterVehicle(socket);
      });
      bot.once('path_update', (failed) => {
        if (failed) {
          socket.write(JSON.stringify({ success: false, error: 'Could not reach boat' }));
        }
      });
    } else {
      tryEnterVehicle(socket);
    }
  } else if (action === 'exit') {
    bot.dismount().then(() => {
      socket.write(JSON.stringify({ success: true, action: 'boat:exit' }));
      sendEvent('boat:exit', {});
    }).catch((err) => {
      socket.write(JSON.stringify({ success: false, error: err.message }));
    });
  } else {
    socket.write(JSON.stringify({ success: false, error: 'Invalid action, use enter or exit' }));
  }
}

function tryEnterVehicle(socket) {
  // Try to enter nearest boat or vehicle
  const vehicle = bot.nearestEntity(e => e.type === 'object' && ['boat', 'minecart', 'hopper_minecart', 'chest_minecart', 'furnace_minecart', 'tnt_minecart', 'spawner_minecart'].includes(e.objectType));
  if (vehicle) {
    bot.mount(vehicle).then(() => {
      socket.write(JSON.stringify({ success: true, action: 'boat:enter', vehicle: vehicle.name || vehicle.entityType, position: { x: vehicle.position.x, y: vehicle.position.y, z: vehicle.position.z } }));
      sendEvent('boat:enter', { vehicle: vehicle.name || vehicle.entityType, position: { x: vehicle.position.x, y: vehicle.position.y, z: vehicle.position.z } });
    }).catch((err) => {
      socket.write(JSON.stringify({ success: false, error: err.message }));
    });
  } else {
    // No vehicle nearby, try using stand on block to mount
    bot.activateBlock(bot.blockAt(bot.entity.position.offset(0, -1, 0))).then(() => {
      socket.write(JSON.stringify({ success: true, action: 'boat:enter' }));
      sendEvent('boat:enter', {});
    }).catch((err) => {
      socket.write(JSON.stringify({ success: false, error: 'No vehicle nearby to enter' }));
    });
  }
}

function handleMinecart(command, socket) {
  // Alias for boat - handles both minecart and boat
  handleBoat(command, socket);
}

function handleBlock(command, socket) {
  const action = command.action || 'enable';

  if (action === 'enable' || action === 'start') {
    // Enable shield blocking - equip shield and hold right click
    const shield = bot.inventory.items().find(i => i.name === 'shield');
    if (!shield) {
      socket.write(JSON.stringify({ success: false, error: 'No shield in inventory' }));
      return;
    }
    bot.equip(mcData.itemsByName['shield'].id, 'hand').then(() => {
      bot.setControlState('right', true);
      socket.write(JSON.stringify({ success: true, action: 'block:start', item: 'shield' }));
      sendEvent('block:start', { item: 'shield' });
    }).catch((err) => {
      socket.write(JSON.stringify({ success: false, error: err.message }));
    });
  } else if (action === 'disable' || action === 'stop') {
    bot.setControlState('right', false);
    socket.write(JSON.stringify({ success: true, action: 'block:stop' }));
    sendEvent('block:stop', {});
  } else {
    socket.write(JSON.stringify({ success: false, error: 'Invalid action, use enable/disable' }));
  }
}


function handleOpenChest(command, socket) {
  const pos = parsePosition(command.position);
  if (!pos) {
    socket.write(JSON.stringify({ success: false, error: 'Invalid position format' }));
    return;
  }
  const chestBlock = bot.blockAt(pos);
  if (chestBlock) {
    bot.openChest(chestBlock).then((window) => {
      const items = window.containerItems().map(item => ({
        name: item.name, count: item.count, slot: item.slot
      }));
      socket.write(JSON.stringify({ success: true, action: 'open-chest', items: items }));
      sendEvent('open-chest', { position: { x: pos.x, y: pos.y, z: pos.z }, itemCount: items.length });
    }).catch((err) => {
      socket.write(JSON.stringify({ success: false, error: err.message }));
    });
  } else {
    socket.write(JSON.stringify({ success: false, error: 'No block at position' }));
  }
}

function handleGoto(command, socket) {
  const pos = parsePosition(command.position);
  if (!pos) {
    socket.write(JSON.stringify({ success: false, error: 'Invalid position format' }));
    return;
  }
  const goal = new goals.GoalBlock(pos.x, pos.y, pos.z);
  bot.pathfinder.setGoal(goal);
  socket.write(JSON.stringify({ success: true, action: 'goto', position: pos, message: 'Moving to target' }));
  sendEvent('goto', { position: { x: pos.x, y: pos.y, z: pos.z } });
}

function handleCollect(command, socket) {
  const itemType = command['item-type'];
  const radius = command.radius !== undefined ? parseInt(command.radius) : 32;
  if (!itemType) {
    socket.write(JSON.stringify({ success: false, error: 'item-type parameter is required' }));
    return;
  }
  const droppedItems = Object.values(bot.entities).filter(entity => {
    return entity.name === 'item' &&
           entity.metadata && entity.metadata[8] &&
           entity.metadata[8].itemId === itemType &&
           bot.entity.position.distanceTo(entity.position) <= radius;
  });
  if (droppedItems.length > 0) {
    const target = droppedItems[0];
    const goal = new goals.GoalNear(target.position.x, target.position.y, target.position.z, 1);
    bot.pathfinder.setGoal(goal);
    socket.write(JSON.stringify({ success: true, action: 'collect', itemType: itemType, targetId: target.id }));
    sendEvent('collect', { itemType: itemType, targetId: target.id });
  } else {
    socket.write(JSON.stringify({ success: false, error: 'No items of type ' + itemType + ' found nearby' }));
  }
}

function handleMonitor(command, socket) {
  const type = command.monitorType || 'entities';
  const radius = command.radius !== undefined ? parseInt(command.radius) : 50;
  let result = { success: true, type: type };

  if (type === 'entities') {
    const entities = Object.values(bot.entities)
      .filter(entity => bot.entity.position.distanceTo(entity.position) <= radius)
      .map(entity => ({
        id: entity.id, name: entity.name || entity.type, type: entity.type,
        position: { x: Math.round(entity.position.x), y: Math.round(entity.position.y), z: Math.round(entity.position.z) },
        distance: Math.round(bot.entity.position.distanceTo(entity.position))
      }));
    result.entities = entities;
  } else if (type === 'blocks') {
    const blocks = [];
    const range = Math.min(radius, 10);
    for (let x = -range; x <= range; x++) {
      for (let y = -range; y <= range; y++) {
        for (let z = -range; z <= range; z++) {
          const block = bot.blockAt(bot.entity.position.offset(x, y, z));
          if (block && block.name !== 'air') {
            blocks.push({
              name: block.name,
              position: { x: Math.round(bot.entity.position.x + x), y: Math.round(bot.entity.position.y + y), z: Math.round(bot.entity.position.z + z) }
            });
          }
        }
      }
    }
    result.blocks = blocks;
  } else if (type === 'chat') {
    result.chatHistory = chatHistory.slice(-20);
  } else {
    result.success = false;
    result.error = 'Unknown monitor type. Supported: entities, blocks, chat';
  }

  socket.write(JSON.stringify(result, null, 2));
  sendEvent('monitor', { monitorType: type, radius: radius });
}

function handleInventory(command, socket) {
  const action = command.action || 'list';
  if (action === 'list') {
    const items = bot.inventory.items().map(item => ({
      name: item.name, count: item.count, slot: item.slot, type: item.type
    }));
    socket.write(JSON.stringify({ success: true, action: 'inventory', items: items }));
    sendEvent('inventory:list', { itemCount: items.length });
  } else if (action === 'move') {
    const sourceSlot = parseInt(command['source-slot']);
    const destSlot = parseInt(command['dest-slot']);
    bot.moveSlotItem(sourceSlot, destSlot).then(() => {
      socket.write(JSON.stringify({ success: true, action: 'inventory-move', from: sourceSlot, to: destSlot }));
      sendEvent('inventory:move', { from: sourceSlot, to: destSlot });
    }).catch((err) => {
      socket.write(JSON.stringify({ success: false, error: err.message }));
    });
  } else {
    socket.write(JSON.stringify({ success: false, error: 'Unknown inventory action. Supported: list, move' }));
  }
}

function handleStatus(socket) {
  const status = {
    success: true, type: 'status',
    payload: {
      position: { x: Math.round(bot.entity.position.x), y: Math.round(bot.entity.position.y), z: Math.round(bot.entity.position.z) },
      health: bot.health, food: bot.food,
      heldItem: bot.heldItem ? bot.heldItem.name : null,
      gameMode: bot.game.gameMode, dimension: bot.game.dimension,
      inventorySize: bot.inventory.slots.length
    }
  };
  socket.write(JSON.stringify(status, null, 2));
  sendEvent('status', { position: status.payload.position, health: bot.health, food: bot.food });
}

// ============================================================
// Craft Handler
// ============================================================

function handleCraft(command, socket) {
  const itemName = command.item;
  const amount = parseInt(command.amount) || 1;
  const useWorkbench = command['use-workbench'] === true || command['use-workbench'] === 'true';

  if (!itemName) {
    socket.write(JSON.stringify({
      success: false, error: { code: 'MISSING_PARAMETER', message: 'item parameter is required' },
      suggestions: ['Specify an item name, e.g. --item diamond_pickaxe']
    }));
    return;
  }

  // Find item in registry
  const mcData = require('minecraft-data')(bot.version);
  const itemData = mcData.itemsByName[itemName] || mcData.blocksByName[itemName];
  if (!itemData) {
    socket.write(JSON.stringify({
      success: false, error: { code: 'UNKNOWN_ITEM', message: `Unknown item: ${itemName}` },
      suggestions: [`Check item name spelling`, `Use query.js to search for items`]
    }));
    return;
  }

  // Find recipes
  const recipes = bot.recipesFor(itemData.id, null, amount, null);
  if (recipes.length === 0) {
    // Check if workbench needed
    const recipesWithTable = bot.recipesFor(itemData.id, null, amount, true);
    if (recipesWithTable.length > 0) {
      socket.write(JSON.stringify({
        success: false, error: { code: 'NEED_WORKBENCH', message: 'This item requires a crafting table' },
        suggestions: ['Add --use-workbench true and --position x,y,z near a crafting table']
      }));
    } else {
      socket.write(JSON.stringify({
        success: false, error: { code: 'INSUFFICIENT_MATERIALS', message: 'No valid recipe found or insufficient materials' },
        suggestions: ['Check if you have the required materials', 'Use query.js --action crafting_plan --item ' + itemName]
      }));
    }
    return;
  }

  const recipe = recipes[0];
  const craftingTable = useWorkbench ? bot.findBlock({ matching: mcData.blocksByName.crafting_table.id, maxDistance: 4 }) : null;

  if (useWorkbench && !craftingTable) {
    socket.write(JSON.stringify({
      success: false, error: { code: 'NO_WORKBENCH_FOUND', message: 'No crafting table found nearby' },
      suggestions: ['Place a crafting table nearby', 'Or use --position to specify its location']
    }));
    return;
  }

  bot.craft(recipe, amount, craftingTable).then(() => {
    // Calculate materials used
    const materialsUsed = (recipe.delta || [])
      .filter(d => d.count < 0)
      .map(d => {
        const matItem = mcData.items[d.id] || mcData.blocks[d.id];
        return { name: matItem ? matItem.name : String(d.id), displayName: matItem ? (matItem.displayName || matItem.name) : String(d.id), required: Math.abs(d.count) * amount, used: Math.abs(d.count) * amount };
      });

    const result = {
      success: true, agentId: agentId, connectionId: connectionId,
      data: {
        action: 'craft',
        result: {
          item: itemName,
          displayName: itemData.displayName || itemName,
          amount: amount,
          crafted: true
        },
        materialsUsed: materialsUsed,
        craftingLocation: craftingTable ? 'workbench' : 'inventory',
        position: { x: Math.floor(bot.entity.position.x), y: Math.floor(bot.entity.position.y), z: Math.floor(bot.entity.position.z) },
        timestamp: new Date().toISOString()
      },
      observerEvents: [
        { type: 'item_crafted', description: `Crafted ${amount}x ${itemData.displayName || itemName}`, data: { item: itemName, count: amount, location: craftingTable ? 'workbench' : 'inventory' } }
      ]
    };
    socket.write(JSON.stringify(result));
    sendEvent('craft', { item: itemName, amount: amount, location: craftingTable ? 'workbench' : 'inventory' });
  }).catch((err) => {
    socket.write(JSON.stringify({
      success: false, agentId: agentId, connectionId: connectionId,
      error: { code: 'CRAFT_FAILED', message: err.message },
      suggestions: ['Check if you have the required materials', 'Make sure you are near a crafting table if needed']
    }));
  });
}

// ============================================================
// Smelt Handler
// ============================================================

function handleSmelt(command, socket) {
  const action = command.action || 'smelt';
  const mcData = require('minecraft-data')(bot.version);

  // Handle clear action - withdraw all items from furnace
  if (action === 'clear') {
    let furnacePos = null;
    if (command['furnace-position']) {
      furnacePos = parsePosition(command['furnace-position']);
    }
    if (!furnacePos) {
      const furnaceBlock = bot.findBlock({ matching: [mcData.blocksByName.furnace.id, mcData.blocksByName.blast_furnace.id, mcData.blocksByName.smoker.id].filter(Boolean), maxDistance: 5 });
      if (furnaceBlock) furnacePos = furnaceBlock.position;
    }

    if (!furnacePos) {
      socket.write(JSON.stringify({
        success: false, agentId: agentId, connectionId: connectionId,
        error: { code: 'NO_FURNACE_FOUND', message: 'No furnace found nearby to clear' },
        suggestions: ['Place a furnace nearby or specify --furnace-position']
      }));
      return;
    }

    const furnaceBlock = bot.blockAt(furnacePos);
    if (!furnaceBlock) {
      socket.write(JSON.stringify({ success: false, error: { code: 'INVALID_POSITION', message: 'No block at specified furnace position' } }));
      return;
    }

    bot.openFurnace(furnaceBlock).then((furnace) => {
      const inputItems = furnace.inputItems();
      const fuelItems = furnace.fuelItems();
      const outputItem = furnace.outputItem();
      const withdrawnItems = [];
      const withdrawPromises = [];

      if (inputItems) inputItems.forEach(item => {
        if (item && item.count > 0) withdrawPromises.push(furnace.withdraw(item.type, null, item.count).then(() => withdrawnItems.push({ name: item.name, count: item.count, type: 'input' })));
      });
      if (fuelItems) fuelItems.forEach(item => {
        if (item && item.count > 0) withdrawPromises.push(furnace.withdraw(item.type, null, item.count).then(() => withdrawnItems.push({ name: item.name, count: item.count, type: 'fuel' })));
      });
      if (outputItem && outputItem.count > 0) {
        withdrawPromises.push(furnace.withdraw(outputItem.type, null, outputItem.count).then(() => withdrawnItems.push({ name: outputItem.name, count: outputItem.count, type: 'output' })));
      }

      Promise.all(withdrawPromises).then(() => {
        socket.write(JSON.stringify({
          success: true, agentId: agentId, connectionId: connectionId,
          data: { action: 'furnace:clear', result: { furnacePosition: { x: furnacePos.x, y: furnacePos.y, z: furnacePos.z }, withdrawnItems: withdrawnItems, totalItems: withdrawnItems.length }, timestamp: new Date().toISOString() },
          observerEvents: [{ type: 'furnace_cleared', description: `Cleared furnace at (${furnacePos.x}, ${furnacePos.y}, ${furnacePos.z})`, data: { items: withdrawnItems, position: { x: furnacePos.x, y: furnacePos.y, z: furnacePos.z } } }]
        }));
        sendEvent('furnace:cleared', { items: withdrawnItems, furnacePosition: { x: furnacePos.x, y: furnacePos.y, z: furnacePos.z } });
        setTimeout(() => { try { furnace.close(); } catch(e) {} }, 300);
      }).catch((err) => {
        socket.write(JSON.stringify({ success: false, error: { code: 'FURNACE_CLEAR_FAILED', message: err.message }, suggestions: ['Try again when furnace is accessible'] }));
        setTimeout(() => { try { furnace.close(); } catch(e) {} }, 300);
      });
    }).catch((err) => {
      socket.write(JSON.stringify({ success: false, error: { code: 'FURNACE_OPEN_FAILED', message: err.message }, suggestions: ['Make sure you are close enough to the furnace'] }));
    });
    return;
  }

  // Standard smelting action
  const itemName = command.item;
  const amount = parseInt(command.amount) || 1;
  const fuelType = command.fuel || 'coal';

  if (!itemName) {
    socket.write(JSON.stringify({ success: false, error: { code: 'MISSING_PARAMETER', message: 'item parameter is required' }, suggestions: ['Specify an input item, e.g. --item iron_ore'] }));
    return;
  }

  // Find furnace nearby
  let furnacePos = null;
  if (command['furnace-position']) {
    furnacePos = parsePosition(command['furnace-position']);
  }
  if (!furnacePos) {
    const furnaceBlock = bot.findBlock({ matching: [mcData.blocksByName.furnace.id, mcData.blocksByName.blast_furnace.id, mcData.blocksByName.smoker.id].filter(Boolean), maxDistance: 5 });
    if (furnaceBlock) furnacePos = furnaceBlock.position;
  }

  if (!furnacePos) {
    socket.write(JSON.stringify({ success: false, agentId: agentId, connectionId: connectionId, error: { code: 'NO_FURNACE_FOUND', message: 'No furnace found nearby', details: { searchRadius: 5 } }, suggestions: ['Place a furnace nearby', 'A furnace can be crafted with 8 cobblestone'] }));
    return;
  }

  const furnaceBlock = bot.blockAt(furnacePos);
  if (!furnaceBlock) {
    socket.write(JSON.stringify({ success: false, error: { code: 'INVALID_POSITION', message: 'No block at specified furnace position' } }));
    return;
  }

  // Find fuel in inventory
  const fuelItem = bot.inventory.items().find(i => i.name === fuelType || i.name === fuelType.replace('minecraft:', ''));
  if (!fuelItem) {
    socket.write(JSON.stringify({ success: false, agentId: agentId, connectionId: connectionId, error: { code: 'NO_FUEL', message: `No ${fuelType} found in inventory for fuel`, details: { fuelType: fuelType } }, suggestions: [`Collect some ${fuelType} for fuel`, 'Common fuels: coal, charcoal, wood'] }));
    return;
  }

  // Find input item in inventory
  const inputItem = bot.inventory.items().find(i => i.name === itemName || i.name === itemName.replace('minecraft:', ''));
  if (!inputItem) {
    socket.write(JSON.stringify({ success: false, agentId: agentId, connectionId: connectionId, error: { code: 'INSUFFICIENT_MATERIALS', message: `No ${itemName} found in inventory`, details: { item: itemName } }, suggestions: [`Collect some ${itemName} first`] }));
    return;
  }

  const actualAmount = Math.min(amount, inputItem.count);

  bot.openFurnace(furnaceBlock).then((furnace) => {
    return furnace.putFuel(fuelItem.type, null, Math.min(fuelItem.count, Math.ceil(actualAmount / 8) + 1)).then(() => furnace.putInput(inputItem.type, null, actualAmount)).then(() => {
      const outputItemName = itemName.replace('_ore', '_ingot').replace('sand', 'glass').replace('cobblestone', 'stone').replace('cactus', 'green_dye').replace('potato', 'baked_potato');
      socket.write(JSON.stringify({
        success: true, agentId: agentId, connectionId: connectionId,
        data: { action: 'smelt', result: { inputItem: itemName, inputDisplayName: inputItem.displayName || itemName, outputItem: outputItemName, outputDisplayName: outputItemName, amountScheduled: actualAmount, fuelItem: fuelType, fuelAvailable: fuelItem.count, estimatedTimeSeconds: actualAmount * 10, furnacePosition: { x: furnacePos.x, y: furnacePos.y, z: furnacePos.z } }, position: { x: Math.floor(bot.entity.position.x), y: Math.floor(bot.entity.position.y), z: Math.floor(bot.entity.position.z) }, timestamp: new Date().toISOString() },
        observerEvents: [{ type: 'item_smelted', description: `Started smelting ${actualAmount}x ${itemName}`, data: { inputItem: itemName, count: actualAmount, furnacePosition: { x: furnacePos.x, y: furnacePos.y, z: furnacePos.z } } }]
      }));
      sendEvent('smelt', { item: itemName, amount: actualAmount, furnacePosition: { x: furnacePos.x, y: furnacePos.y, z: furnacePos.z } });
      setTimeout(() => { try { furnace.close(); } catch(e) {} }, 500);
    });
  }).catch((err) => {
    socket.write(JSON.stringify({ success: false, agentId: agentId, connectionId: connectionId, error: { code: 'SMELT_FAILED', message: err.message }, suggestions: ['Make sure you are close enough to the furnace', 'Check fuel and input items'] }));
  });
}

// ============================================================
// Chest Handler (enhanced - replaces handleOpenChest)
// ============================================================

function handleChest(command, socket) {
  const action = command['chest-action'] || 'list';
  const pos = parsePosition(command.position);
  const itemName = command.item;
  const amount = command.amount !== undefined ? parseInt(command.amount) : null;

  if (!pos) {
    socket.write(JSON.stringify({
      success: false, error: { code: 'MISSING_PARAMETER', message: 'position parameter is required (x,y,z)' },
      suggestions: ['Specify chest position, e.g. --position 100,64,200']
    }));
    return;
  }

  if ((action === 'store' || action === 'withdraw') && !itemName) {
    socket.write(JSON.stringify({
      success: false, error: { code: 'MISSING_PARAMETER', message: `item parameter is required for ${action} action` },
      suggestions: ['Specify item name, e.g. --item diamond']
    }));
    return;
  }

  const chestBlock = bot.blockAt(pos);
  if (!chestBlock) {
    socket.write(JSON.stringify({ success: false, error: { code: 'INVALID_POSITION', message: 'No block at specified position' } }));
    return;
  }

  // Detect container type and open appropriate container
  const containerType = chestBlock.name;
  let openPromise;
  switch (containerType) {
    case 'minecraft:hopper':
    case 'minecraft:hopper_block':
      openPromise = bot.openContainer(chestBlock);
      break;
    case 'minecraft:dropper':
    case 'minecraft:dispenser':
      openPromise = bot.openDispenser(chestBlock);
      break;
    case 'minecraft:furnace':
    case 'minecraft:blast_furnace':
    case 'minecraft:smoker':
      openPromise = bot.openFurnace(chestBlock);
      break;
    case 'minecraft:barrel':
      openPromise = bot.openContainer(chestBlock);
      break;
    case 'minecraft:chest':
    case 'minecraft:trapped_chest':
    case 'minecraft:ender_chest':
    default:
      openPromise = bot.openChest(chestBlock);
  }

  openPromise.then((window) => {
    sendEvent('chest:list', { position: { x: pos.x, y: pos.y, z: pos.z }, action: action, containerType: containerType });

    if (action === 'list') {
      const items = window.containerItems().map(item => ({
        slot: item.slot, name: 'minecraft:' + item.name, displayName: item.displayName || item.name, count: item.count
      }));
      const result = {
        success: true, agentId: agentId, connectionId: connectionId,
        data: {
          action: 'list',
          result: {
            chestPosition: { x: pos.x, y: pos.y, z: pos.z },
            chestType: containerType,
            containerType: containerType,
            totalSlots: window.inventoryStart - window.containerStart,
            usedSlots: window.containerItems().length,
            items: items
          },
          timestamp: new Date().toISOString()
        },
        observerEvents: [
          { type: 'chest_opened', description: `Opened ${containerType} at (${pos.x}, ${pos.y}, ${pos.z})`, data: { position: { x: pos.x, y: pos.y, z: pos.z }, containerType: containerType } }
        ]
      };
      socket.write(JSON.stringify(result));
      setTimeout(() => { try { window.close(); } catch(e) {} }, 300);

    } else if (action === 'store') {
      // Find item in player inventory
      const invItem = bot.inventory.items().find(i => i.name === itemName || i.name === itemName.replace('minecraft:', ''));
      if (!invItem) {
        socket.write(JSON.stringify({
          success: false, agentId: agentId, connectionId: connectionId,
          error: { code: 'ITEM_NOT_FOUND', message: `No ${itemName} found in inventory` },
          suggestions: ['Check item name', 'Use inventory.js --action list to see your items']
        }));
        setTimeout(() => { try { window.close(); } catch(e) {} }, 300);
        return;
      }
      const storeAmount = amount || invItem.count;
      window.deposit(invItem.type, null, storeAmount).then(() => {
        const result = {
          success: true, agentId: agentId, connectionId: connectionId,
          data: {
            action: 'store',
            result: {
              item: itemName,
              displayName: invItem.displayName || itemName,
              amountRequested: storeAmount,
              amountStored: storeAmount,
              chestPosition: { x: pos.x, y: pos.y, z: pos.z },
              containerType: containerType
            },
            timestamp: new Date().toISOString()
          },
          observerEvents: [
            { type: 'item_deposited', description: `Stored ${storeAmount}x ${invItem.displayName || itemName}`, data: { item: itemName, count: storeAmount, position: { x: pos.x, y: pos.y, z: pos.z } } }
          ]
        };
        socket.write(JSON.stringify(result));
        sendEvent('chest:store', { item: itemName, amount: storeAmount, position: { x: pos.x, y: pos.y, z: pos.z } });
        setTimeout(() => { try { window.close(); } catch(e) {} }, 300);
      }).catch((err) => {
        socket.write(JSON.stringify({
          success: false, error: { code: 'CONTAINER_FULL', message: err.message || 'Container may be full' },
          suggestions: ['Find another container', 'Or withdraw some items first']
        }));
        setTimeout(() => { try { window.close(); } catch(e) {} }, 300);
      });

    } else if (action === 'withdraw') {
      // Find item in chest
      const chestItem = window.containerItems().find(i => i.name === itemName || i.name === itemName.replace('minecraft:', ''));
      if (!chestItem) {
        socket.write(JSON.stringify({
          success: false, agentId: agentId, connectionId: connectionId,
          error: { code: 'ITEM_NOT_IN_CONTAINER', message: `No ${itemName} found in container` },
          suggestions: ['Check item name', 'Use --action list to see container contents']
        }));
        setTimeout(() => { try { window.close(); } catch(e) {} }, 300);
        return;
      }
      const withdrawAmount = amount || chestItem.count;
      window.withdraw(chestItem.type, null, withdrawAmount).then(() => {
        const result = {
          success: true, agentId: agentId, connectionId: connectionId,
          data: {
            action: 'withdraw',
            result: {
              item: itemName,
              displayName: chestItem.displayName || itemName,
              amountRequested: withdrawAmount,
              amountWithdrawn: withdrawAmount,
              chestPosition: { x: pos.x, y: pos.y, z: pos.z },
              containerType: containerType
            },
            timestamp: new Date().toISOString()
          },
          observerEvents: [
            { type: 'item_withdrawn', description: `Withdrew ${withdrawAmount}x ${chestItem.displayName || itemName}`, data: { item: itemName, count: withdrawAmount, position: { x: pos.x, y: pos.y, z: pos.z } } }
          ]
        };
        socket.write(JSON.stringify(result));
        sendEvent('chest:withdraw', { item: itemName, amount: withdrawAmount, position: { x: pos.x, y: pos.y, z: pos.z } });
        setTimeout(() => { try { window.close(); } catch(e) {} }, 300);
      }).catch((err) => {
        socket.write(JSON.stringify({
          success: false, error: { code: 'WITHDRAW_FAILED', message: err.message },
          suggestions: ['Check item name and amount']
        }));
        setTimeout(() => { try { window.close(); } catch(e) {} }, 300);
      });

    } else {
      socket.write(JSON.stringify({
        success: false, error: { code: 'INVALID_ACTION', message: `Unknown chest action: ${action}. Supported: list, store, withdraw` }
      }));
      setTimeout(() => { try { window.close(); } catch(e) {} }, 300);
    }
  }).catch((err) => {
    socket.write(JSON.stringify({
      success: false, error: { code: 'CONTAINER_OPEN_FAILED', message: err.message },
      suggestions: ['Make sure you are close enough to the container', 'Check the position is correct']
    }));
  });
}

// ============================================================
// Sleep Auto Handler (auto-find nearby bed)
// ============================================================

function handleSleepAuto(command, socket) {
  const mcData = require('minecraft-data')(bot.version);

  // Find all bed block types
  const bedBlocks = Object.keys(mcData.blocksByName)
    .filter(name => name.includes('bed') && name !== 'bedrock')
    .map(name => mcData.blocksByName[name].id)
    .filter(Boolean);

  const bed = bot.findBlock({ matching: bedBlocks, maxDistance: 10 });

  if (!bed) {
    socket.write(JSON.stringify({
      success: false, agentId: agentId, connectionId: connectionId,
      error: { code: 'NO_BED_FOUND', message: 'No bed found within 10 blocks', details: { searchRadius: 10 } },
      suggestions: ['Place a bed nearby', 'Beds can be crafted with 3 wool + 3 planks']
    }));
    return;
  }

  bot.sleep(bed).then(() => {
    const result = {
      success: true, agentId: agentId, connectionId: connectionId,
      data: {
        action: 'sleep',
        result: {
          bedPosition: { x: bed.position.x, y: bed.position.y, z: bed.position.z },
          bedType: bed.name
        },
        position: { x: Math.floor(bot.entity.position.x), y: Math.floor(bot.entity.position.y), z: Math.floor(bot.entity.position.z) },
        timestamp: new Date().toISOString()
      },
      observerEvents: []
    };
    socket.write(JSON.stringify(result));
    sendEvent('sleep:auto', { bedPosition: { x: bed.position.x, y: bed.position.y, z: bed.position.z }, bedType: bed.name });
  }).catch((err) => {
    socket.write(JSON.stringify({
      success: false, agentId: agentId, connectionId: connectionId,
      error: { code: 'SLEEP_FAILED', message: err.message },
      suggestions: ['You can only sleep at night or during thunderstorms', 'Make sure the bed is accessible']
    }));
  });
}

// ============================================================
// Swim Handler
// ============================================================

function handleSwim(command, socket) {
  const action = command['swim-action'] || 'start';

  if (action === 'start') {
    // Check if in water
    const blockBelow = bot.blockAt(bot.entity.position.offset(0, -1, 0));
    const blockAt = bot.blockAt(bot.entity.position);
    const inWater = (blockBelow && blockBelow.name === 'water') || (blockAt && blockAt.name === 'water');

    if (inWater) {
      bot.setControlState('jump', true);
      bot.setControlState('sprint', false);
      const result = {
        success: true, agentId: agentId, connectionId: connectionId,
        data: {
          action: 'swim',
          result: { status: 'swimming', position: { x: Math.floor(bot.entity.position.x), y: Math.floor(bot.entity.position.y), z: Math.floor(bot.entity.position.z) } },
          timestamp: new Date().toISOString()
        },
        observerEvents: []
      };
      socket.write(JSON.stringify(result));
      sendEvent('swim', { position: result.data.result.position });
    } else {
      socket.write(JSON.stringify({
        success: false, agentId: agentId, connectionId: connectionId,
        error: { code: 'NOT_IN_WATER', message: 'Not in water - cannot start swimming' },
        suggestions: ['Move to water first', 'Use move/look commands to navigate to water']
      }));
    }
  } else if (action === 'stop') {
    bot.setControlState('jump', false);
    socket.write(JSON.stringify({
      success: true, agentId: agentId, connectionId: connectionId,
      data: { action: 'swim', result: { status: 'stopped' }, timestamp: new Date().toISOString() },
      observerEvents: []
    }));
  } else {
    socket.write(JSON.stringify({
      success: false, error: { code: 'INVALID_ACTION', message: `Unknown swim action: ${action}. Supported: start, stop` }
    }));
  }
}

// ============================================================
// Query Handler (crafting plan, craftable items, nearby info)
// ============================================================

function handleQuery(command, socket) {
  const queryAction = command['query-action'] || 'craftable';
  const mcData = require('minecraft-data')(bot.version);

  if (queryAction === 'craftable') {
    // List items that can be crafted with current inventory
    const craftable = [];
    for (const [name, item] of Object.entries(mcData.itemsByName)) {
      const recipes = bot.recipesFor(item.id, null, 1, null);
      if (recipes.length > 0) {
        craftable.push({ name: name, displayName: item.displayName || name });
      }
    }
    // Also check with crafting table
    const craftableWithTable = [];
    for (const [name, item] of Object.entries(mcData.itemsByName)) {
      const recipes = bot.recipesFor(item.id, null, 1, true);
      if (recipes.length > 0 && !craftable.find(c => c.name === name)) {
        craftableWithTable.push({ name: name, displayName: item.displayName || name });
      }
    }
    socket.write(JSON.stringify({
      success: true, agentId: agentId, connectionId: connectionId,
      data: {
        action: 'craftable',
        result: { craftableInInventory: craftable.slice(0, 50), craftableWithTable: craftableWithTable.slice(0, 50) },
        timestamp: new Date().toISOString()
      },
      observerEvents: []
    }));

  } else if (queryAction === 'crafting_plan') {
    const itemName = command.item;
    const targetAmount = parseInt(command.amount) || 1;

    if (!itemName) {
      socket.write(JSON.stringify({
        success: false, error: { code: 'MISSING_PARAMETER', message: 'item parameter is required for crafting_plan' }
      }));
      return;
    }

    const itemData = mcData.itemsByName[itemName];
    if (!itemData) {
      socket.write(JSON.stringify({
        success: false, error: { code: 'UNKNOWN_ITEM', message: `Unknown item: ${itemName}` }
      }));
      return;
    }

    const recipes = bot.recipesFor(itemData.id, null, targetAmount, null);
    const recipesWithTable = bot.recipesFor(itemData.id, null, targetAmount, true);

    if (recipes.length === 0 && recipesWithTable.length === 0) {
      socket.write(JSON.stringify({
        success: true, agentId: agentId, connectionId: connectionId,
        data: {
          action: 'crafting_plan',
          result: { targetItem: itemName, targetAmount: targetAmount, craftable: false, reason: 'No recipe found or insufficient materials' },
          timestamp: new Date().toISOString()
        },
        observerEvents: []
      }));
      return;
    }

    const recipe = recipes[0] || recipesWithTable[0];
    const needsTable = recipes.length === 0;

    // Build steps
    const materialsUsed = (recipe.delta || [])
      .filter(d => d.count < 0)
      .map(d => {
        const matItem = mcData.items[d.id] || mcData.blocks[d.id];
        const available = bot.inventory.items().filter(i => i.type === d.id).reduce((sum, i) => sum + i.count, 0);
        return {
          name: matItem ? matItem.name : String(d.id),
          displayName: matItem ? (matItem.displayName || matItem.name) : String(d.id),
          required: Math.abs(d.count) * targetAmount,
          available: available
        };
      });

    const missingMaterials = materialsUsed.filter(m => m.available < m.required);

    socket.write(JSON.stringify({
      success: true, agentId: agentId, connectionId: connectionId,
      data: {
        action: 'crafting_plan',
        result: {
          targetItem: itemName,
          targetAmount: targetAmount,
          craftable: missingMaterials.length === 0,
          needsTable: needsTable,
          steps: [{ step: 1, action: 'craft', item: itemName, amount: targetAmount, materials: materialsUsed }],
          missingMaterials: missingMaterials.map(m => ({ name: m.name, required: m.required - m.available }))
        },
        timestamp: new Date().toISOString()
      },
      observerEvents: []
    }));

  } else if (queryAction === 'nearby_blocks') {
    const range = parseInt(command.range) || 16;
    const blocks = [];
    const pos = bot.entity.position;
    const r = Math.min(range, 16);
    for (let x = -r; x <= r; x += 2) {
      for (let y = -r; y <= r; y += 2) {
        for (let z = -r; z <= r; z += 2) {
          const block = bot.blockAt(pos.offset(x, y, z));
          if (block && block.name !== 'air' && block.name !== 'cave_air') {
            blocks.push({
              name: block.name, displayName: block.displayName || block.name,
              position: { x: Math.round(pos.x + x), y: Math.round(pos.y + y), z: Math.round(pos.z + z) },
              distance: Math.round(Math.sqrt(x*x + y*y + z*z))
            });
          }
        }
      }
    }
    socket.write(JSON.stringify({
      success: true, agentId: agentId, connectionId: connectionId,
      data: { action: 'nearby_blocks', result: { blocks: blocks.slice(0, 200), count: blocks.length }, timestamp: new Date().toISOString() },
      observerEvents: []
    }));

  } else if (queryAction === 'nearby_entities') {
    const range = parseInt(command.range) || 16;
    const entities = Object.values(bot.entities)
      .filter(e => e.position && bot.entity.position.distanceTo(e.position) <= range && e.name !== 'item' && e.name !== 'arrow' && e.name !== 'experience_orb')
      .map(e => ({
        id: e.id, type: e.name || e.type, name: e.displayName || e.name || e.type,
        position: { x: Math.round(e.position.x * 10) / 10, y: Math.round(e.position.y * 10) / 10, z: Math.round(e.position.z * 10) / 10 },
        distance: Math.round(bot.entity.position.distanceTo(e.position) * 10) / 10
      }));
    socket.write(JSON.stringify({
      success: true, agentId: agentId, connectionId: connectionId,
      data: { action: 'nearby_entities', result: { entities: entities, count: entities.length }, timestamp: new Date().toISOString() },
      observerEvents: []
    }));

  } else {
    socket.write(JSON.stringify({
      success: false, error: { code: 'INVALID_ACTION', message: `Unknown query action: ${queryAction}. Supported: craftable, crafting_plan, nearby_blocks, nearby_entities` }
    }));
  }
}

// ============================================================
// handleFarm - Farming system (till/plant/harvest)
// ============================================================
function handleFarm(command, socket) {
  const action = command.farmAction || command.action;
  const position = parsePosition(command.position) || bot.entity.position;
  const radius = parseInt(command.radius) || 3;
  const crop = command.crop || 'wheat';

  if (!['till', 'plant', 'harvest'].includes(action)) {
    socket.write(JSON.stringify({
      success: false, agentId, connectionId,
      error: { code: 'INVALID_ACTION', message: `Unknown farm action: ${action}. Supported: till, plant, harvest` },
      suggestions: ['Use --farm-action till|plant|harvest']
    }));
    return;
  }

  // Validate item in hand for plant
  if (action === 'plant' && !bot.heldItem) {
    socket.write(JSON.stringify({
      success: false, agentId, connectionId,
      error: { code: 'NO_SEEDS', message: 'No seeds in hand to plant' },
      suggestions: ['Equip seeds before planting', 'Check your held item slot']
    }));
    return;
  }

  const pos = bot.entity.position;
  let blocksProcessed = 0;
  let cropsCollected = {};
  const cropTypes = ['wheat', 'carrot', 'potato', 'beetroot'];

  if (action === 'harvest') {
    // Find mature crops
    for (let dx = -radius; dx <= radius; dx++) {
      for (let dz = -radius; dz <= radius; dz++) {
        const blockPos = pos.offset(dx, 0, dz);
        const block = bot.blockAt(blockPos);
        if (block && cropTypes.includes(block.name)) {
          const above = bot.blockAt(blockPos.offset(0, 1, 0));
          if (above && above.name === 'air') {
            // Harvest - use nearby block
            try {
              bot.dig(block);
              blocksProcessed++;
              const drops = bot.world.getBlock(block.position)?.diggable ? [] : [];
              cropsCollected[block.name] = (cropsCollected[block.name] || 0) + 1;
            } catch (e) { /* skip */ }
          }
        }
      }
    }
    socket.write(JSON.stringify({
      success: true, agentId, connectionId,
      data: {
        action: 'harvest',
        result: { blocksHarvested: blocksProcessed, cropsCollected },
        position: { x: Math.round(pos.x), y: Math.round(pos.y), z: Math.round(pos.z) },
        timestamp: new Date().toISOString()
      },
      observerEvents: [{
        type: 'crop_harvested',
        description: `Harvested ${blocksProcessed} crops: ${JSON.stringify(cropsCollected)}`,
        data: { crops: cropsCollected, area: { x: Math.round(pos.x), z: Math.round(pos.z) }, radius }
      }]
    }));
  } else if (action === 'till') {
    // Find grass/dirt and till it
    for (let dx = -radius; dx <= radius; dx++) {
      for (let dz = -radius; dz <= radius; dz++) {
        const blockPos = pos.offset(dx, 0, dz);
        const block = bot.blockAt(blockPos);
        if (block && (block.name === 'grass_block' || block.name === 'dirt')) {
          const above = bot.blockAt(blockPos.offset(0, 1, 0));
          if (above && above.name === 'air') {
            try {
              bot.dig(block);
              bot.placeBlock(blockPos, 'down');
              blocksProcessed++;
            } catch (e) { /* skip */ }
          }
        }
      }
    }
    socket.write(JSON.stringify({
      success: true, agentId, connectionId,
      data: {
        action: 'till',
        result: { blocksTilled: blocksProcessed },
        position: { x: Math.round(pos.x), y: Math.round(pos.y), z: Math.round(pos.z) },
        timestamp: new Date().toISOString()
      },
      observerEvents: [{
        type: 'land_tilled',
        description: `Tilled ${blocksProcessed} blocks for farming`,
        data: { blocksTilled: blocksProcessed, radius }
      }]
    }));
  } else if (action === 'plant') {
    // Plant seeds on tilled dirt
    const seedName = bot.heldItem.name;
    for (let dx = -radius; dx <= radius; dx++) {
      for (let dz = -radius; dz <= radius; dz++) {
        const blockPos = pos.offset(dx, 0, dz);
        const block = bot.blockAt(blockPos);
        if (block && (block.name === 'farmland' || block.name === 'dirt')) {
          const above = bot.blockAt(blockPos.offset(0, 1, 0));
          if (above && above.name === 'air') {
            try {
              bot.placeBlock(blockPos, 'down');
              blocksProcessed++;
            } catch (e) { /* skip */ }
          }
        }
      }
    }
    socket.write(JSON.stringify({
      success: true, agentId, connectionId,
      data: {
        action: 'plant',
        result: { seedsPlanted: blocksProcessed, seedUsed: seedName },
        position: { x: Math.round(pos.x), y: Math.round(pos.y), z: Math.round(pos.z) },
        timestamp: new Date().toISOString()
      },
      observerEvents: [{
        type: 'crop_planted',
        description: `Planted ${blocksProcessed} ${seedName} seeds`,
        data: { seedsPlanted: blocksProcessed, seedType: seedName, radius }
      }]
    }));
  }
}

// ============================================================
// handleTrade - Villager trading
// ============================================================
function handleTrade(command, socket) {
  const action = command.tradeAction || command.action;
  const villagerId = parseInt(command.villagerId);
  const tradeIndex = parseInt(command.tradeIndex);
  const count = parseInt(command.count) || 1;

  if (!['list', 'trade'].includes(action)) {
    socket.write(JSON.stringify({
      success: false, agentId, connectionId,
      error: { code: 'INVALID_ACTION', message: `Unknown trade action: ${action}. Supported: list, trade` },
      suggestions: ['Use --trade-action list|trade']
    }));
    return;
  }

  if (action === 'list') {
    if (!villagerId) {
      // Find nearest villager
      const nearest = Object.values(bot.entities)
        .filter(e => e.name === 'villager' && e.position)
        .sort((a, b) => bot.entity.position.distanceTo(a.position) - bot.entity.position.distanceTo(b.position))[0];
      if (!nearest) {
        socket.write(JSON.stringify({
          success: false, agentId, connectionId,
          error: { code: 'NO_VILLAGER', message: 'No villager found nearby', details: { searchRadius: 5 } },
          suggestions: ['Move closer to a villager', 'Find a village to trade with']
        }));
        return;
      }
      const villagerPos = nearest.position;
      bot.lookAt(villagerPos);
      bot.openVillager(nearest);
      const trades = nearest.trades ? Object.entries(nearest.trades).map(([idx, t]) => ({
        index: parseInt(idx), input: t.input1 ? `${t.input1.name} x${t.input1.count}` : 'unknown',
        output: t.output ? `${t.output.name} x${t.output.count}` : 'unknown',
        usesLeft: t.uses || 0, maxUses: t.maxUses || 0
      })) : [];
      socket.write(JSON.stringify({
        success: true, agentId, connectionId,
        data: {
          action: 'list',
          result: { villagerId: nearest.id, profession: nearest.villagerProfession || 'unknown', level: nearest.villagerLevel || 1, trades },
          timestamp: new Date().toISOString()
        },
        observerEvents: [{ type: 'trade_opened', description: `Opened trade with villager (ID: ${nearest.id})`, data: { villagerId: nearest.id } }]
      }));
      return;
    }
  }

  if (action === 'trade') {
    if (!villagerId || isNaN(tradeIndex)) {
      socket.write(JSON.stringify({
        success: false, agentId, connectionId,
        error: { code: 'MISSING_PARAMS', message: 'trade requires --villager-id and --trade-index' },
        suggestions: ['First use list action to get villager ID and trade indices']
      }));
      return;
    }
    const entity = bot.entities[villagerId];
    if (!entity || entity.name !== 'villager') {
      socket.write(JSON.stringify({
        success: false, agentId, connectionId,
        error: { code: 'VILLAGER_NOT_FOUND', message: `Villager ${villagerId} not found or not a villager` },
        suggestions: ['Move closer to the villager', 'Use list action to refresh villager data']
      }));
      return;
    }
    try {
      const villager = bot.openVillager(entity);
      const result = villager.trade(tradeIndex, count);
      const trade = villager.trades[tradeIndex];
      socket.write(JSON.stringify({
        success: true, agentId, connectionId,
        data: {
          action: 'trade',
          result: {
            villagerId, tradeIndex,
            inputItem: trade.input1?.name || 'unknown',
            outputItem: trade.output?.name || 'unknown',
            outputCount: result?.count || 1,
            emeraldCost: trade.input2?.name === 'emerald' ? trade.input2.count : 0
          },
          timestamp: new Date().toISOString()
        },
        observerEvents: [{ type: 'trade_completed', description: `Traded with villager (trade #${tradeIndex})`, data: { villagerId, tradeIndex, count } }]
      }));
    } catch (e) {
      socket.write(JSON.stringify({
        success: false, agentId, connectionId,
        error: { code: 'TRADE_FAILED', message: `Trade failed: ${e.message}` },
        suggestions: ['Check if you have enough items for the trade', 'Villager may have exhausted this trade']
      }));
    }
  }
}

// ============================================================
// handleVision - Screenshot capture
// ============================================================
function handleVision(command, socket) {
  const action = command.visionAction || 'capture';
  const description = command.description || '';
  const width = parseInt(command.width) || 800;
  const height = parseInt(command.height) || 512;

  if (action !== 'capture') {
    socket.write(JSON.stringify({
      success: false, agentId, connectionId,
      error: { code: 'INVALID_ACTION', message: `Unknown vision action: ${action}. Supported: capture` },
      suggestions: ['Use --vision-action capture']
    }));
    return;
  }

  const captureId = 'cap_' + Date.now().toString(36);
  const pos = bot.entity.position;

  try {
    // Try prismarine-viewer if available
    let imageData = null;
    try {
      const { Viewer } = require('prismarine-viewer');
      const viewer = new Viewer(bot, { width, height });
      const canvas = viewer.getCanvas();
      imageData = canvas.toDataURL('image/jpeg', 0.9).slice(22); // Remove 'data:image/jpeg;base64,' prefix
    } catch (viewerErr) {
      // Fallback: no screenshot available
    }

    const sceneInfo = {
      biome: bot.game.dimension || 'overworld',
      timeOfDay: (bot.time?.dayTime % 24000) < 6000 ? 'day' : 'night',
      dimension: bot.game.dimension || 'overworld'
    };

    socket.write(JSON.stringify({
      success: true, agentId, connectionId,
      data: {
        action: 'capture',
        result: {
          captureId,
          format: imageData ? 'jpeg' : 'unavailable',
          dimensions: { width, height },
          hasImage: !!imageData,
          position: { x: Math.round(pos.x), y: Math.round(pos.y), z: Math.round(pos.z) },
          facing: { yaw: Math.round(bot.entity.yaw * 10) / 10, pitch: Math.round(bot.entity.pitch * 10) / 10 },
          description,
          sceneInfo
        },
        timestamp: new Date().toISOString()
      },
      observerEvents: [{
        type: 'vision_captured',
        description: description || 'Screenshot captured',
        data: { captureId, position: { x: Math.round(pos.x), y: Math.round(pos.y), z: Math.round(pos.z) }, sceneInfo }
      }]
    }));
  } catch (e) {
    socket.write(JSON.stringify({
      success: false, agentId, connectionId,
      error: { code: 'CAPTURE_FAILED', message: `Screenshot failed: ${e.message}` },
      suggestions: ['Ensure the bot is spawned and in the world']
    }));
  }
}

// ============================================================
// handleBuild - Blueprint-based building
// ============================================================
async function handleBuild(command, socket) {
  const blueprintStr = command.blueprint;
  const startPos = parsePosition(command['start-position']) || bot.entity.position;
  const direction = command.direction || 'north';
  const verify = command.verify !== false;

  if (!blueprintStr) {
    socket.write(JSON.stringify({
      success: false, agentId, connectionId,
      error: { code: 'MISSING_BLUEPRINT', message: '--blueprint is required (JSON string or file path)' },
      suggestions: ['Provide blueprint as inline JSON or file path']
    }));
    return;
  }

  let blueprint;
  try {
    blueprint = JSON.parse(blueprintStr);
  } catch (e) {
    try {
      blueprint = JSON.parse(fs.readFileSync(blueprintStr, 'utf8'));
    } catch (e2) {
      socket.write(JSON.stringify({
        success: false, agentId, connectionId,
        error: { code: 'INVALID_BLUEPRINT', message: 'Blueprint must be valid JSON' },
        suggestions: ['Check JSON syntax', 'File must be accessible and valid JSON']
      }));
      return;
    }
  }

  const buildId = 'build_' + Date.now().toString(36);
  const materials = blueprint.materials || {};
  const layers = blueprint.layers || [];

  // Direction offsets
  const dirOffsets = { north: [0, 0, -1], south: [0, 0, 1], east: [1, 0, 0], west: [-1, 0, 0] };
  const [dx, , dz] = dirOffsets[direction] || dirOffsets.north;

  let blocksPlaced = 0;
  let blocksTotal = 0;
  let errors = [];
  const materialsUsed = {};
  const layerCount = layers.length;

  // Count total blocks
  for (const layer of layers) {
    const y = startPos.y + layer.y;
    for (let row = 0; row < layer.pattern.length; row++) {
      for (let col = 0; col < layer.pattern[row].length; col++) {
        const char = layer.pattern[row][col];
        if (char !== ' ' && materials[char]) blocksTotal++;
      }
    }
  }

  // Send start event
  sendEvent('build_started', { buildId, blueprintName: blueprint.name, blocksTotal, startPosition: { x: Math.round(startPos.x), y: Math.round(startPos.y), z: Math.round(startPos.z) } });

  // Place blocks layer by layer
  for (let li = 0; li < layers.length; li++) {
    const layer = layers[li];
    const y = startPos.y + layer.y;
    for (let row = 0; row < layer.pattern.length; row++) {
      for (let col = 0; col < layer.pattern[row].length; col++) {
        const char = layer.pattern[row][col];
        if (char === ' ' || !materials[char]) continue;
        const blockName = materials[char];
        const px = startPos.x + row * dx;
        const pz = startPos.z + col * dz;
        try {
          const targetBlock = bot.blockAt(new Vec3(px, y, pz));
          if (!targetBlock) continue;
          const above = bot.blockAt(new Vec3(px, y + 1, pz));
          if (above && above.name !== 'air') continue;
          const placePos = new Vec3(px, y, pz);
          bot.placeBlock(placePos, 'down');
          blocksPlaced++;
          materialsUsed[blockName] = (materialsUsed[blockName] || 0) + 1;
          // Progress report every 10%
          if (verify && blocksPlaced % Math.max(1, Math.floor(blocksTotal * 0.1)) === 0) {
            const progress = blocksPlaced / blocksTotal;
            sendEvent('build_progress', { buildId, blueprintName: blueprint.name, progress: Math.round(progress * 100) / 100, currentLayer: li + 1, totalLayers: layerCount, blocksPlaced, blocksTotal, materialsUsed });
          }
        } catch (e) {
          errors.push({ position: { x: px, y, z: pz }, block: blockName, error: e.message });
        }
      }
    }
    // Small delay between layers
    await new Promise(r => setTimeout(r, 100));
  }

  const endPos = { x: startPos.x + (layers[0]?.pattern.length || 0), y: startPos.y + layers.length, z: startPos.z + (layers[0]?.pattern[0]?.length || 0) };

  sendEvent('build_completed', { buildId, blueprintName: blueprint.name, blocksPlaced, blocksTotal, durationSeconds: 0, errors: errors.slice(0, 10) });

  socket.write(JSON.stringify({
    success: true, agentId, connectionId,
    data: {
      action: 'build',
      result: { blueprint: blueprint.name || 'unnamed', buildId, status: errors.length > 0 && blocksPlaced === 0 ? 'failed' : 'completed', blocksPlaced, blocksTotal, durationSeconds: 0, errors: errors.slice(0, 10) },
      startPosition: { x: Math.round(startPos.x), y: Math.round(startPos.y), z: Math.round(startPos.z) },
      endPosition: endPos,
      timestamp: new Date().toISOString()
    },
    observerEvents: [{
      type: errors.length > 0 && blocksPlaced === 0 ? 'build_failed' : 'build_completed',
      description: errors.length > 0 && blocksPlaced === 0 ? `Build failed: ${errors[0].error}` : `Completed ${blueprint.name || 'blueprint'}, placed ${blocksPlaced} blocks`,
      data: { buildId, blueprintName: blueprint.name, blocksPlaced, blocksTotal, materialsUsed, errors: errors.length }
    }]
  }));
}

// ============================================================
// handleEvents - Event subscription system
// ============================================================
const eventSubscriptions = new Map(); // subscriptionId -> { event, filter, socket }
let subscriptionIdCounter = 0;

function handleEvents(command, socket) {
  const action = command.eventsAction || command.action;
  const eventName = command.event;

  if (action === 'subscribe') {
    if (!eventName) {
      socket.write(JSON.stringify({
        success: false, agentId, connectionId,
        error: { code: 'MISSING_EVENT', message: '--event is required for subscribe' },
        suggestions: ['Specify event name to subscribe to']
      }));
      return;
    }
    const subId = 'sub_' + (++subscriptionIdCounter);
    const filter = command.filter ? JSON.parse(command.filter) : {};
    eventSubscriptions.set(subId, { event: eventName, filter, socket });
    const active = Array.from(eventSubscriptions.entries()).map(([id, s]) => ({ subscriptionId: id, event: s.event, status: 'active' }));
    socket.write(JSON.stringify({
      success: true, agentId, connectionId,
      data: {
        action: 'subscribe',
        result: { subscriptionId: subId, event: eventName, filter, status: 'active' },
        activeSubscriptions: active,
        timestamp: new Date().toISOString()
      },
      observerEvents: []
    }));
    // Report to observer
    sendEvent('event_subscribed', { subscriptionId: subId, event: eventName, filter });
  } else if (action === 'unsubscribe') {
    if (!eventName) {
      socket.write(JSON.stringify({
        success: false, agentId, connectionId,
        error: { code: 'MISSING_EVENT', message: '--event is required for unsubscribe' }
      }));
      return;
    }
    let removed = 0;
    for (const [id, sub] of eventSubscriptions.entries()) {
      if (sub.event === eventName && sub.socket === socket) {
        eventSubscriptions.delete(id);
        removed++;
      }
    }
    const active = Array.from(eventSubscriptions.entries()).map(([id, s]) => ({ subscriptionId: id, event: s.event, status: 'active' }));
    socket.write(JSON.stringify({
      success: true, agentId, connectionId,
      data: { action: 'unsubscribe', result: { removed, event: eventName }, activeSubscriptions: active, timestamp: new Date().toISOString() },
      observerEvents: []
    }));
  } else if (action === 'list') {
    const active = Array.from(eventSubscriptions.entries()).map(([id, s]) => ({ subscriptionId: id, event: s.event, status: 'active' }));
    socket.write(JSON.stringify({
      success: true, agentId, connectionId,
      data: { action: 'list', result: { subscriptions: active, total: active.length }, timestamp: new Date().toISOString() },
      observerEvents: []
    }));
  } else {
    socket.write(JSON.stringify({
      success: false, agentId, connectionId,
      error: { code: 'INVALID_ACTION', message: `Unknown events action: ${action}. Supported: subscribe, unsubscribe, list` }
    }));
  }
}

// Hook subscriptions into bot events
function notifySubscribers(eventType, eventData) {
  for (const [subId, sub] of eventSubscriptions.entries()) {
    if (sub.event === eventType) {
      try {
        sub.socket.write(JSON.stringify({
          type: 'event_callback',
          subscriptionId: subId,
          event: eventType,
          eventData,
          filterMatch: true,
          timestamp: new Date().toISOString()
        }));
      } catch (e) {
        eventSubscriptions.delete(subId);
      }
    }
  }
}

// Register bot event hooks for subscriptions
if (bot) {
  bot.on('entitySpawn', (entity) => {
    notifySubscribers('entity_spawn', { entityId: entity.id, entityType: entity.name, position: { x: Math.round(entity.position.x), y: Math.round(entity.position.y), z: Math.round(entity.position.z) }, distance: bot.entity.position.distanceTo(entity.position) });
  });
  bot.on('entityDead', (entity, reason) => {
    notifySubscribers('entity_death', { entityType: entity.name, killer: reason });
  });
  bot.on('chat', (username, message) => {
    notifySubscribers('chat_received', { sender: username, message });
  });
  bot.on('death', () => {
    notifySubscribers('player_death', { position: { x: Math.round(bot.entity.position.x), y: Math.round(bot.entity.position.y), z: Math.round(bot.entity.position.z) } });
  });
  bot.on('respawn', () => {
    notifySubscribers('player_respawn', { position: { x: Math.round(bot.entity.position.x), y: Math.round(bot.entity.position.y), z: Math.round(bot.entity.position.z) } });
  });
  bot.on('health', () => {
    notifySubscribers('health_change', { health: bot.health, maxHealth: 20 });
  });
  bot.on('digging', (block) => {
    notifySubscribers('block_break', { blockType: block.name, position: { x: block.position.x, y: block.position.y, z: block.position.z } });
  });
  bot.on('blockPlaced', (block) => {
    notifySubscribers('block_place', { blockType: block.name, position: { x: block.position.x, y: block.position.y, z: block.position.z } });
  });
  bot.on('pickedUp', (item) => {
    notifySubscribers('item_pickup', { item: item.name, count: item.count });
  });
  bot.on('dropped', (item) => {
    notifySubscribers('item_dropped', { item: item.name, count: item.count });
  });
}

// ============================================================
// handleMulti - Multi-bot team management
// ============================================================
const teams = new Map(); // teamId -> { name, leader, members[], task }
let teamIdCounter = 0;

function handleMulti(command, socket) {
  const action = command.multiAction || command.action;

  if (action === 'team_create') {
    const teamName = command['team-name'];
    if (!teamName) {
      socket.write(JSON.stringify({
        success: false, agentId, connectionId,
        error: { code: 'MISSING_TEAM_NAME', message: '--team-name is required for team_create' },
        suggestions: ['Specify a name for your team']
      }));
      return;
    }
    const teamId = 'team_' + (++teamIdCounter);
    teams.set(teamId, { teamId, teamName, leader: agentId, members: [{ agentId, role: 'leader' }], task: null, status: 'active' });
    socket.write(JSON.stringify({
      success: true, agentId, connectionId,
      data: { action: 'team_create', result: { teamId, teamName }, timestamp: new Date().toISOString() },
      observerEvents: [{ type: 'team_created', description: `Team "${teamName}" created`, data: { teamId, teamName, leader: agentId } }]
    }));
  } else if (action === 'team_list') {
    const allTeams = Array.from(teams.values()).map(t => ({
      teamId: t.teamId, teamName: t.teamName, leader: t.leader,
      members: t.members, status: t.status, task: t.task
    }));
    socket.write(JSON.stringify({
      success: true, agentId, connectionId,
      data: { action: 'team_list', result: { teams: allTeams }, timestamp: new Date().toISOString() },
      observerEvents: []
    }));
  } else if (action === 'team_join') {
    const teamId = command['team-id'];
    if (!teamId) {
      socket.write(JSON.stringify({ success: false, agentId, connectionId, error: { code: 'MISSING_TEAM_ID', message: '--team-id required' } }));
      return;
    }
    const team = teams.get(teamId);
    if (!team) {
      socket.write(JSON.stringify({ success: false, agentId, connectionId, error: { code: 'TEAM_NOT_FOUND', message: `Team ${teamId} not found` } }));
      return;
    }
    if (!team.members.find(m => m.agentId === agentId)) {
      team.members.push({ agentId, role: 'member' });
    }
    socket.write(JSON.stringify({
      success: true, agentId, connectionId,
      data: { action: 'team_join', result: { teamId, teamName: team.teamName, members: team.members }, timestamp: new Date().toISOString() },
      observerEvents: [{ type: 'team_joined', description: `${agentId} joined team "${team.teamName}"`, data: { teamId, agentId } }]
    }));
  } else if (action === 'team_assign') {
    const teamId = command['team-id'];
    const taskType = command['task-type'];
    if (!teamId || !taskType) {
      socket.write(JSON.stringify({ success: false, agentId, connectionId, error: { code: 'MISSING_PARAMS', message: '--team-id and --task-type required' } }));
      return;
    }
    const team = teams.get(teamId);
    if (!team) {
      socket.write(JSON.stringify({ success: false, agentId, connectionId, error: { code: 'TEAM_NOT_FOUND', message: `Team ${teamId} not found` } }));
      return;
    }
    team.task = { type: taskType, status: 'active', progress: 0 };
    socket.write(JSON.stringify({
      success: true, agentId, connectionId,
      data: { action: 'team_assign', result: { teamId, task: team.task }, timestamp: new Date().toISOString() },
      observerEvents: [{ type: 'team_updated', description: `Team task set to: ${taskType}`, data: { teamId, task: team.task } }]
    }));
  } else if (action === 'list') {
    // Backward compat: list all bots
    const allTeams = Array.from(teams.values()).map(t => ({
      teamId: t.teamId, teamName: t.teamName, leader: t.leader, members: t.members, status: t.status
    }));
    socket.write(JSON.stringify({
      success: true, agentId, connectionId,
      data: { action: 'list', result: { teams: allTeams }, timestamp: new Date().toISOString() },
      observerEvents: []
    }));
  } else {
    socket.write(JSON.stringify({
      success: false, agentId, connectionId,
      error: { code: 'INVALID_ACTION', message: `Unknown multi action: ${action}. Supported: team_create, team_list, team_join, team_assign, list` }
    }));
  }
}

function parsePosition(posStr) {
  if (!posStr) return null;
  const parts = posStr.split(',');
  if (parts.length !== 3) return null;
  const x = parseInt(parts[0]), y = parseInt(parts[1]), z = parseInt(parts[2]);
  if (isNaN(x) || isNaN(y) || isNaN(z)) return null;
  return new Vec3(x, y, z);
}

function cleanup() {
  if (connectionSocket) connectionSocket.close();
  if (fs.existsSync(socketPath)) fs.unlinkSync(socketPath);
}

process.stdin.resume();
