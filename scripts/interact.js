#!/usr/bin/env node

const net = require('net');
const fs = require('fs');

// Parse command line arguments
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

// Validate required parameters
if (!params['connection-id']) {
  console.error(JSON.stringify({
    success: false,
    error: 'Missing required parameter: --connection-id is required'
  }, null, 2));
  process.exit(1);
}

if (!params.action) {
  console.error(JSON.stringify({
    success: false,
    error: 'Missing required parameter: --action is required'
  }, null, 2));
  process.exit(1);
}

const socketPath = `/tmp/minecraft-bot-${params['connection-id']}.sock`;

// Check if socket exists
if (!fs.existsSync(socketPath)) {
  console.error(JSON.stringify({
    success: false,
    error: 'Connection not found. The bot may not be running or the connection-id is invalid.'
  }, null, 2));
  process.exit(1);
}

// Build command
const command = {
  type: params.action
};

// Add action-specific parameters
switch (params.action) {
  case 'move':
    if (!params.direction) {
      console.error(JSON.stringify({
        success: false,
        error: 'For move action, --direction is required (forward/backward/left/right)'
      }, null, 2));
      process.exit(1);
    }
    command.direction = params.direction;
    break;

  case 'use':
    if (params.slot !== undefined) {
      command.slot = params.slot;
    }
    break;

  case 'break':
  case 'place':
    if (!params.position) {
      console.error(JSON.stringify({
        success: false,
        error: `For ${params.action} action, --position is required (format: x,y,z)`
      }, null, 2));
      process.exit(1);
    }
    command.position = params.position;
    break;

  case 'chat':
    if (!params.message) {
      console.error(JSON.stringify({
        success: false,
        error: 'For chat action, --message is required'
      }, null, 2));
      process.exit(1);
    }
    command.message = params.message;
    break;

  case 'jump':
    // No additional parameters needed
    break;

  case 'equip':
    if (params.slot === undefined) {
      console.error(JSON.stringify({
        success: false,
        error: 'For equip action, --slot is required'
      }, null, 2));
      process.exit(1);
    }
    command.slot = params.slot;
    command.destination = params.destination || 'hand';
    break;

  case 'attack':
    if (!params['entity-uuid'] && !params['entity-name']) {
      console.error(JSON.stringify({
        success: false,
        error: 'For attack action, --entity-uuid or --entity-name is required'
      }, null, 2));
      process.exit(1);
    }
    if (params['entity-uuid']) command['entity-uuid'] = params['entity-uuid'];
    if (params['entity-name']) command['entity-name'] = params['entity-name'];
    break;

  case 'drop':
    if (params.item) {
      command.item = params.item;
    }
    if (params.slot !== undefined) {
      command.slot = params.slot;
    }
    if (params.count !== undefined) command.count = params.count;
    // Handle whitelist actions
    if (params.whitelistAction) {
      command.action = params.whitelistAction;
    }
    break;

  case 'boat':
    if (params['boat-action']) command.action = params['boat-action'];
    else command.action = 'enter';
    if (params.position) command.position = params.position;
    break;

  case 'minecart':
    if (params['minecart-action']) command.action = params['minecart-action'];
    else command.action = 'enter';
    if (params.position) command.position = params.position;
    break;

  case 'block':
    if (params['block-action']) command.action = params['block-action'];
    else command.action = 'enable';
    break;

  case 'look':
    if (params.position) {
      command.position = params.position;
    } else if (params.yaw !== undefined && params.pitch !== undefined) {
      command.yaw = params.yaw;
      command.pitch = params.pitch;
    } else {
      console.error(JSON.stringify({
        success: false,
        error: 'For look action, either --position or --yaw/--pitch is required'
      }, null, 2));
      process.exit(1);
    }
    break;

  case 'eat':
  case 'wake':
    // No additional parameters needed
    break;

  case 'sleep':
    if (!params.position) {
      console.error(JSON.stringify({
        success: false,
        error: 'For sleep action, --position is required (format: x,y,z)'
      }, null, 2));
      process.exit(1);
    }
    command.position = params.position;
    break;

  case 'fish':
    // No additional parameters needed
    break;

  case 'open-chest':
    if (!params.position) {
      console.error(JSON.stringify({
        success: false,
        error: 'For open-chest action, --position is required (format: x,y,z)'
      }, null, 2));
      process.exit(1);
    }
    command.position = params.position;
    break;

  case 'goto':
    if (!params.position) {
      console.error(JSON.stringify({
        success: false,
        error: 'For goto action, --position is required (format: x,y,z)'
      }, null, 2));
      process.exit(1);
    }
    command.position = params.position;
    break;

  case 'collect':
    if (!params['item-type']) {
      console.error(JSON.stringify({
        success: false,
        error: 'For collect action, --item-type is required'
      }, null, 2));
      process.exit(1);
    }
    command['item-type'] = params['item-type'];
    if (params.radius !== undefined) command.radius = params.radius;
    break;

  case 'monitor':
    command.type = 'monitor'; // Override to send to bot
    if (params.monitorType) command.type = params.monitorType;
    command.monitorType = params.monitorType || 'entities';
    if (params.radius !== undefined) command.radius = params.radius;
    break;

  case 'inventory':
    command.type = 'inventory'; // Override to send to bot
    if (params.inventoryAction) command.action = params.inventoryAction;
    command.action = params.inventoryAction || 'list';
    if (params['source-slot'] !== undefined) command['source-slot'] = params['source-slot'];
    if (params['dest-slot'] !== undefined) command['dest-slot'] = params['dest-slot'];
    break;

  case 'query':
    command.type = 'query';
    if (params['query-action']) command['query-action'] = params['query-action'];
    else if (params.queryAction) command['query-action'] = params.queryAction;
    if (params.item) command.item = params.item;
    if (params.amount) command.amount = params.amount;
    if (params.range) command.range = params.range;
    break;

  case 'craft':
    command.type = 'craft';
    if (params.item) command.item = params.item;
    if (params.amount) command.amount = params.amount;
    if (params['use-workbench']) command['use-workbench'] = params['use-workbench'];
    if (params.position) command.position = params.position;
    break;

  case 'smelt':
    command.type = 'smelt';
    if (params.item) command.item = params.item;
    if (params.amount) command.amount = params.amount;
    if (params.fuel) command.fuel = params.fuel;
    if (params['furnace-position']) command['furnace-position'] = params['furnace-position'];
    break;

  case 'chest':
    command.type = 'chest';
    if (params['chest-action']) command['chest-action'] = params['chest-action'];
    else if (params.action) command['chest-action'] = params.action;
    if (params.position) command.position = params.position;
    if (params.item) command.item = params.item;
    if (params.amount) command.amount = params.amount;
    break;

  case 'sleep-auto':
    command.type = 'sleep-auto';
    break;

  case 'swim':
    command.type = 'swim';
    if (params['swim-action']) command['swim-action'] = params['swim-action'];
    break;

  default:
    console.error(JSON.stringify({
      success: false,
      error: `Unknown action: ${params.action}. Supported actions: move, use, break, place, chat, jump, equip, attack, drop, look, eat, sleep, wake, fish, boat, minecart, block, open-chest, goto, collect, monitor, inventory, query, craft, smelt, chest, sleep-auto, swim`
    }, null, 2));
    process.exit(1);
}

// Send command to bot
const client = new net.Socket();
let responseReceived = false;

const timeout = setTimeout(() => {
  if (!responseReceived) {
    console.error(JSON.stringify({
      success: false,
      error: 'Request timeout. The bot may not be responding.'
    }, null, 2));
    process.exit(1);
  }
}, 15000); // Increased timeout for pathfinding operations

client.connect(socketPath, () => {
  client.write(JSON.stringify(command));
});

client.on('data', (data) => {
  responseReceived = true;
  clearTimeout(timeout);
  try {
    const response = JSON.parse(data.toString());
    console.log(JSON.stringify(response, null, 2));
  } catch (err) {
    console.error(data.toString());
  }
  client.end();
  process.exit(0);
});

client.on('error', (err) => {
  clearTimeout(timeout);
  console.error(JSON.stringify({
    success: false,
    error: 'Failed to communicate with bot: ' + err.message
  }, null, 2));
  process.exit(1);
});

client.on('close', () => {
  clearTimeout(timeout);
});
