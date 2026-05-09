#!/usr/bin/env node
/**
 * craft.js - Minecraft合成系统
 * 用法: node scripts/craft.js --connection-id <id> --item <item_name> [--amount 1] [--use-workbench false] [--position x,y,z] [--auto-equip]
 */
const net = require('net');
const path = require('path');
const os = require('os');

// Armor mapping - item name to equipment destination
const ARMOR_EQUIP_MAP = {
  'diamond_helmet': { part: 'head', slot: 5 },
  'diamond_chestplate': { part: 'torso', slot: 6 },
  'diamond_leggings': { part: 'legs', slot: 7 },
  'diamond_boots': { part: 'feet', slot: 8 },
  'netherite_helmet': { part: 'head', slot: 5 },
  'netherite_chestplate': { part: 'torso', slot: 6 },
  'netherite_leggings': { part: 'legs', slot: 7 },
  'netherite_boots': { part: 'feet', slot: 8 },
  'golden_helmet': { part: 'head', slot: 5 },
  'golden_chestplate': { part: 'torso', slot: 6 },
  'golden_leggings': { part: 'legs', slot: 7 },
  'golden_boots': { part: 'feet', slot: 8 },
  'iron_helmet': { part: 'head', slot: 5 },
  'iron_chestplate': { part: 'torso', slot: 6 },
  'iron_leggings': { part: 'legs', slot: 7 },
  'iron_boots': { part: 'feet', slot: 8 },
  'chainmail_helmet': { part: 'head', slot: 5 },
  'chainmail_chestplate': { part: 'torso', slot: 6 },
  'chainmail_leggings': { part: 'legs', slot: 7 },
  'chainmail_boots': { part: 'feet', slot: 8 },
  'leather_helmet': { part: 'head', slot: 5 },
  'leather_chestplate': { part: 'torso', slot: 6 },
  'leather_leggings': { part: 'legs', slot: 7 },
  'leather_boots': { part: 'feet', slot: 8 },
  'turtle_helmet': { part: 'head', slot: 5 },
  'elytra': { part: 'back', slot: 6 },
  'shield': { part: 'off-hand', slot: 45 },
  'bow': { part: 'off-hand', slot: 45 },
  'trident': { part: 'hand', slot: null },
  'crossbow': { part: 'off-hand', slot: 45 },
};

// Check if item is armor or equipable
function isArmorItem(itemName) {
  const normalized = itemName.replace('minecraft:', '');
  return normalized in ARMOR_EQUIP_MAP;
}

function getEquipDestination(itemName) {
  const normalized = itemName.replace('minecraft:', '');
  return ARMOR_EQUIP_MAP[normalized] || null;
}

function parseArgs() {
  const args = process.argv.slice(2);
  const params = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].slice(2);
      const next = args[i + 1];
      if (next && !next.startsWith('--')) {
        params[key] = next;
        i++;
      } else {
        params[key] = true;
      }
    }
  }
  return params;
}

function sendEquipCommand(sockPath, slot, destination) {
  return new Promise((resolve, reject) => {
    const client = net.createConnection(sockPath, () => {
      const command = {
        type: 'equip',
        slot: slot.toString(),
        destination: destination
      };
      client.write(JSON.stringify(command));
    });

    const timeout = setTimeout(() => {
      client.destroy();
      reject(new Error('Equip command timeout'));
    }, 5000);

    client.on('data', (data) => {
      clearTimeout(timeout);
      try {
        const result = JSON.parse(data.toString());
        if (result.success) {
          resolve(result);
        } else {
          reject(new Error(result.error?.message || 'Equip failed'));
        }
      } catch (e) {
        reject(e);
      }
      client.end();
    });

    client.on('error', (err) => {
      clearTimeout(timeout);
      reject(err);
    });
  });
}

function main() {
  const params = parseArgs();
  const connectionId = params['connection-id'];
  const autoEquip = params['auto-equip'] === true;

  if (!connectionId) {
    const err = { success: false, error: { code: 'MISSING_PARAMETER', message: '--connection-id is required' }, suggestions: ['Pass the connection ID returned by connect.js'] };
    console.error(JSON.stringify(err));
    process.exit(1);
  }

  if (!params.item) {
    const err = { success: false, error: { code: 'MISSING_PARAMETER', message: '--item is required' }, suggestions: ['Specify an item to craft, e.g. --item diamond_pickaxe'] };
    console.error(JSON.stringify(err));
    process.exit(1);
  }

  const sockPath = path.join(os.tmpdir(), `minecraft-bot-${connectionId}.sock`);
  const client = net.createConnection(sockPath, () => {
    const command = {
      type: 'craft',
      item: params.item,
      amount: params.amount || '1',
      'use-workbench': params['use-workbench'] || 'false',
      position: params.position || null
    };
    client.write(JSON.stringify(command));
  });

  client.on('data', (data) => {
    try {
      const result = JSON.parse(data.toString());
      console.log(JSON.stringify(result, null, 2));

      // Auto-equip armor if requested and crafting succeeded
      if (autoEquip && result.success && isArmorItem(params.item)) {
        const equipInfo = getEquipDestination(params.item);
        if (equipInfo) {
          console.error(`\n[Auto-equip] Equipping crafted ${params.item}...`);
          sendEquipCommand(sockPath, equipInfo.slot || 0, equipInfo.part)
            .then((equipResult) => {
              console.error(`[Auto-equip] Success: ${JSON.stringify(equipResult)}`);
            })
            .catch((err) => {
              console.error(`[Auto-equip] Failed: ${err.message}`);
            });
        }
      }
    } catch (e) {
      console.log(data.toString());
    }
    client.end();
    process.exit(0);
  });

  client.on('error', (err) => {
    console.error(JSON.stringify({
      success: false,
      error: { code: 'CONNECTION_ERROR', message: err.message },
      suggestions: ['Make sure the bot is running', 'Check the connection-id is correct']
    }));
    process.exit(1);
  });

  setTimeout(() => { client.destroy(); process.exit(1); }, 15000);
}

if (require.main === module) main();

module.exports = { isArmorItem, getEquipDestination };
