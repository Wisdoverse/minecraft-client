#!/usr/bin/env node
/**
 * chest.js - Minecraft箱子存取系统
 * 用法: node scripts/chest.js --connection-id <id> --action <list|store|withdraw> --position <x,y,z> [--item <name>] [--amount <n>]
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

  const action = params.action || 'list';
  if (!['list', 'store', 'withdraw'].includes(action)) {
    console.error(JSON.stringify({ success: false, error: { code: 'INVALID_ACTION', message: `Unknown action: ${action}. Supported: list, store, withdraw` } }));
    process.exit(1);
  }

  if (!params.position) {
    console.error(JSON.stringify({ success: false, error: { code: 'MISSING_PARAMETER', message: '--position is required (x,y,z)' }, suggestions: ['Specify chest position, e.g. --position 100,64,200'] }));
    process.exit(1);
  }

  if ((action === 'store' || action === 'withdraw') && !params.item) {
    console.error(JSON.stringify({ success: false, error: { code: 'MISSING_PARAMETER', message: `--item is required for ${action} action` } }));
    process.exit(1);
  }

  const sockPath = path.join(os.tmpdir(), `minecraft-bot-${connectionId}.sock`);
  const client = net.createConnection(sockPath, () => {
    const command = {
      type: 'chest',
      'chest-action': action,
      position: params.position,
      item: params.item || null,
      amount: params.amount || null
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
