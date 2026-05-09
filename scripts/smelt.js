#!/usr/bin/env node
/**
 * smelt.js - Minecraft熔炼系统
 * 用法: 
 *   node scripts/smelt.js --connection-id <id> --item <item_name> [--amount 1] [--fuel coal] [--furnace-position x,y,z]
 *   node scripts/smelt.js --connection-id <id> --action clear --furnace-position x,y,z
 */
const net = require('net');
const path = require('path');
const os = require('os');

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

function main() {
  const params = parseArgs();
  const connectionId = params['connection-id'];

  if (!connectionId) {
    console.error(JSON.stringify({ success: false, error: { code: 'MISSING_PARAMETER', message: '--connection-id is required' } }));
    process.exit(1);
  }

  // Handle clear action
  if (params.action === 'clear') {
    if (!params['furnace-position']) {
      console.error(JSON.stringify({ 
        success: false, 
        error: { code: 'MISSING_PARAMETER', message: '--furnace-position is required for clear action' },
        suggestions: ['Specify furnace position: --furnace-position x,y,z']
      }));
      process.exit(1);
    }

    const sockPath = path.join(os.tmpdir(), `minecraft-bot-${connectionId}.sock`);
    const client = net.createConnection(sockPath, () => {
      const command = {
        type: 'smelt',
        action: 'clear',
        'furnace-position': params['furnace-position']
      };
      client.write(JSON.stringify(command));
    });

    client.on('data', (data) => {
      try {
        const result = JSON.parse(data.toString());
        console.log(JSON.stringify(result, null, 2));
      } catch (e) {
        console.log(data.toString());
      }
      client.end();
      process.exit(0);
    });

    client.on('error', (err) => {
      console.error(JSON.stringify({ success: false, error: { code: 'CONNECTION_ERROR', message: err.message } }));
      process.exit(1);
    });
    setTimeout(() => { client.destroy(); process.exit(1); }, 10000);
    return;
  }

  // Standard smelting action
  if (!params.item) {
    console.error(JSON.stringify({ success: false, error: { code: 'MISSING_PARAMETER', message: '--item is required' }, suggestions: ['Specify an item to smelt, e.g. --item iron_ore'] }));
    process.exit(1);
  }

  const sockPath = path.join(os.tmpdir(), `minecraft-bot-${connectionId}.sock`);
  const client = net.createConnection(sockPath, () => {
    const command = {
      type: 'smelt',
      item: params.item,
      amount: params.amount || '1',
      fuel: params.fuel || 'coal',
      'furnace-position': params['furnace-position'] || null
    };
    client.write(JSON.stringify(command));
  });

  client.on('data', (data) => {
    try { console.log(JSON.stringify(JSON.parse(data.toString()), null, 2)); } catch (e) { console.log(data.toString()); }
    client.end();
    process.exit(0);
  });
  client.on('error', (err) => {
    console.error(JSON.stringify({ success: false, error: { code: 'CONNECTION_ERROR', message: err.message } }));
    process.exit(1);
  });
  setTimeout(() => { client.destroy(); process.exit(1); }, 15000);
}

if (require.main === module) main();
