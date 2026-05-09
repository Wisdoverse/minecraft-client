#!/usr/bin/env node
/**
 * events.js - 行为钩子/事件订阅系统
 * 支持: subscribe, unsubscribe, list
 * 订阅的 Minecraft 事件通过 Unix Socket 回调通知
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
    } else if (process.argv[i] === '--event' && process.argv[i + 1]) {
      args.event = process.argv[++i];
    } else if (process.argv[i] === '--filter' && process.argv[i + 1]) {
      try { args.filter = JSON.parse(process.argv[++i]); } catch { args.filter = {}; }
    } else if (process.argv[i] === '--subscription-id' && process.argv[i + 1]) {
      args.subscriptionId = process.argv[++i];
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
  error('MISSING_ACTION', '缺少 --action 参数 (subscribe|unsubscribe|list)');
}
if ((args.action === 'subscribe' || args.action === 'unsubscribe') && !args.event) {
  error('MISSING_EVENT', 'subscribe/unsubscribe 操作需要 --event');
}

const agentId = process.env.MINECRAFT_AGENT_ID || 'minecraft-agent-' + args.connectionId;
const sockPath = path.join(os.tmpdir(), 'minecraft-bot-' + args.connectionId + '.sock');

const client = net.createConnection(sockPath, () => {
  const cmd = {
    type: 'events',
    action: args.action,
    event: args.event,
    filter: args.filter || null,
    subscriptionId: args.subscriptionId || null
  };
  client.write(JSON.stringify(cmd) + '\n');
});

client.on('data', (data) => {
  try {
    const resp = JSON.parse(data.toString());
    output({
      success: resp.success !== false,
      agentId,
      connectionId: args.connectionId,
      data: { action: 'events', result: resp },
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
