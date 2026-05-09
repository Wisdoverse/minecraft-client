#!/usr/bin/env node
/**
 * farm.js - 农业系统
 * 支持: till(耕地), plant(种植), harvest(收割)
 */
const net = require('net');
const path = require('path');
const os = require('os');

function parseArgs() {
  const args = {};
  for (let i = 2; i < process.argv.length; i++) {
    if (process.argv[i] === '--connection-id' && process.argv[i + 1]) {
      args.connectionId = process.argv[++i];
    } else if (process.argv[i] === '--action' && process.argv[i + 1]) {
      args.action = process.argv[++i];
    } else if (process.argv[i] === '--position' && process.argv[i + 1]) {
      const parts = process.argv[++i].split(',').map(Number);
      args.position = { x: parts[0], y: parts[1], z: parts[2] };
    } else if (process.argv[i] === '--crop' && process.argv[i + 1]) {
      args.crop = process.argv[++i];
    } else if (process.argv[i] === '--radius' && process.argv[i + 1]) {
      args.radius = parseInt(process.argv[++i], 10);
    } else if (process.argv[i] === '--auto' && process.argv[i + 1]) {
      args.auto = process.argv[i + 1] === 'true';
      i++;
    }
  }
  return args;
}

function output(result) {
  console.log(JSON.stringify(result, null, 2));
  process.exit(0);
}

function error(code, message, details, suggestions) {
  output({
    success: false,
    agentId: process.env.MINECRAFT_AGENT_ID || 'minecraft-agent-unknown',
    connectionId: args.connectionId,
    error: { code, message, details },
    suggestions: suggestions || []
  });
}

const args = parseArgs();
if (!args.connectionId) {
  error('MISSING_CONNECTION_ID', '缺少 --connection-id 参数');
}
if (!args.action) {
  error('MISSING_ACTION', '缺少 --action 参数 (till|plant|harvest)');
}
if (!args.position) {
  error('MISSING_POSITION', '缺少 --position 参数');
}
if (args.action === 'plant' && !args.crop) {
  error('MISSING_CROP', '种植操作需要 --crop 参数 (wheat|carrot|potato|beetroot)');
}

const agentId = process.env.MINECRAFT_AGENT_ID || 'minecraft-agent-' + args.connectionId;
const sockPath = path.join(os.tmpdir(), 'minecraft-bot-' + args.connectionId + '.sock');

const client = net.createConnection(sockPath, () => {
  const cmd = {
    type: 'farm',
    action: args.action,
    position: args.position
  };
  if (args.crop) cmd.crop = args.crop;
  if (args.radius !== undefined) cmd.radius = args.radius;
  if (args.auto !== undefined) cmd.auto = args.auto;
  client.write(JSON.stringify(cmd) + '\n');
});

client.on('data', (data) => {
  try {
    const resp = JSON.parse(data.toString());
    output({
      success: resp.success !== false,
      agentId,
      connectionId: args.connectionId,
      data: { action: 'farm', result: resp },
      observerEvents: resp.observerEvents || []
    });
  } catch (e) {
    output({
      success: false,
      agentId,
      connectionId: args.connectionId,
      error: { code: 'PARSE_ERROR', message: '无法解析响应' },
      suggestions: []
    });
  }
});

client.on('error', (err) => {
  error('CONNECTION_FAILED', '无法连接到 Bot: ' + err.message, { sockPath });
});
