#!/usr/bin/env node
/**
 * trade.js - 村民交易系统
 * 支持: list (查看交易列表), trade (执行交易)
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
    } else if (process.argv[i] === '--villager-id' && process.argv[i + 1]) {
      args.villagerId = parseInt(process.argv[++i], 10);
    } else if (process.argv[i] === '--trade-index' && process.argv[i + 1]) {
      args.tradeIndex = parseInt(process.argv[++i], 10);
    } else if (process.argv[i] === '--count' && process.argv[i + 1]) {
      args.count = parseInt(process.argv[++i], 10);
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
  error('MISSING_ACTION', '缺少 --action 参数 (list|trade)');
}
if (args.action === 'trade' && args.tradeIndex === undefined) {
  error('MISSING_TRADE_INDEX', 'trade 操作需要 --trade-index');
}
if (args.action === 'list' && args.villagerId === undefined) {
  error('MISSING_VILLAGER_ID', 'list 操作需要 --villager-id');
}

const agentId = process.env.MINECRAFT_AGENT_ID || 'minecraft-agent-' + args.connectionId;
const sockPath = path.join(os.tmpdir(), 'minecraft-bot-' + args.connectionId + '.sock');

const client = net.createConnection(sockPath, () => {
  const cmd = { type: 'trade' };
  if (args.action) cmd.action = args.action;
  if (args.villagerId !== undefined) cmd.villagerId = args.villagerId;
  if (args.tradeIndex !== undefined) cmd.tradeIndex = args.tradeIndex;
  if (args.count !== undefined) cmd.count = args.count;
  client.write(JSON.stringify(cmd) + '\n');
});

client.on('data', (data) => {
  try {
    const resp = JSON.parse(data.toString());
    const result = {
      success: resp.success !== false,
      agentId,
      connectionId: args.connectionId,
      data: { action: 'trade', result: resp },
      observerEvents: resp.observerEvents || []
    };
    output(result);
  } catch (e) {
    output({
      success: false,
      agentId,
      connectionId: args.connectionId,
      error: { code: 'PARSE_ERROR', message: '无法解析响应: ' + data.toString().slice(0, 200) },
      suggestions: []
    });
  }
});

client.on('error', (err) => {
  error('CONNECTION_FAILED', '无法连接到 Bot: ' + err.message, { sockPath });
});
