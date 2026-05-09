#!/usr/bin/env node
/**
 * sleep.js - Minecraft自动寻床睡觉
 * 用法: node scripts/sleep.js --connection-id <id>
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

  const sockPath = path.join(os.tmpdir(), `minecraft-bot-${connectionId}.sock`);
  const client = net.createConnection(sockPath, () => {
    const command = { type: 'sleep-auto' };
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
  setTimeout(() => { client.destroy(); process.exit(1); }, 10000);
}

if (require.main === module) main();
