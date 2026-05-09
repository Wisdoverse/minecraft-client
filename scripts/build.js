#!/usr/bin/env node
/**
 * build.js - 编程式建造系统
 * 支持: 蓝图式结构建造，按层按列放置方块
 */
const net = require('net');
const path = require('path');
const os = require('os');

function parseArgs() {
  const args = {};
  for (let i = 2; i < process.argv.length; i++) {
    if (process.argv[i] === '--connection-id' && process.argv[i + 1]) {
      args.connectionId = process.argv[++i];
    } else if (process.argv[i] === '--blueprint' && process.argv[i + 1]) {
      args.blueprint = process.argv[++i];
    } else if (process.argv[i] === '--start-position' && process.argv[i + 1]) {
      const parts = process.argv[++i].split(',').map(Number);
      args.startPosition = { x: parts[0], y: parts[1], z: parts[2] };
    } else if (process.argv[i] === '--direction' && process.argv[i + 1]) {
      args.direction = process.argv[++i];
    } else if (process.argv[i] === '--verify' && process.argv[i + 1]) {
      args.verify = process.argv[++i] === 'true';
    } else if (process.argv[i] === '--build-id' && process.argv[i + 1]) {
      args.buildId = process.argv[++i];
    } else if (process.argv[i] === '--action' && process.argv[i + 1]) {
      args.action = process.argv[++i];
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
if (!args.blueprint && !args.buildId && !args.action) {
  error('MISSING_BLUEPRINT', '缺少 --blueprint 或 --build-id 参数');
}

const agentId = process.env.MINECRAFT_AGENT_ID || 'minecraft-agent-' + args.connectionId;
const sockPath = path.join(os.tmpdir(), 'minecraft-bot-' + args.connectionId + '.sock');

// Parse blueprint if provided
let blueprint = null;
if (args.blueprint) {
  try {
    // Try as JSON string first
    if (args.blueprint.startsWith('{')) {
      blueprint = JSON.parse(args.blueprint);
    } else {
      // Try as file path
      const fs = require('fs');
      blueprint = JSON.parse(fs.readFileSync(args.blueprint, 'utf8'));
    }
  } catch (e) {
    error('INVALID_BLUEPRINT', '蓝图解析失败: ' + e.message);
  }
}

const client = net.createConnection(sockPath, () => {
  const cmd = { type: 'build' };
  if (blueprint) cmd.blueprint = blueprint;
  if (args.startPosition) cmd.startPosition = args.startPosition;
  if (args.direction) cmd.direction = args.direction;
  if (args.verify !== undefined) cmd.verify = args.verify;
  if (args.buildId) cmd.buildId = args.buildId;
  if (args.action) cmd.action = args.action;
  client.write(JSON.stringify(cmd) + '\n');
});

client.on('data', (data) => {
  try {
    const resp = JSON.parse(data.toString());
    output({
      success: resp.success !== false,
      agentId,
      connectionId: args.connectionId,
      data: { action: 'build', result: resp },
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
