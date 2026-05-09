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

const socketPath = `/tmp/minecraft-bot-${params['connection-id']}.sock`;

// Check if socket exists
if (!fs.existsSync(socketPath)) {
  console.error(JSON.stringify({
    success: false,
    error: 'Connection not found. The bot may not be running or the connection-id is invalid.'
  }, null, 2));
  process.exit(1);
}

// Send disconnect request to bot
const command = {
  type: 'disconnect'
};

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
}, 5000);

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
  
  // Give bot time to cleanup
  setTimeout(() => {
    process.exit(0);
  }, 1000);
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
