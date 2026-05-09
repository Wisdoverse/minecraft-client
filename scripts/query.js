#!/usr/bin/env node
/**
 * query.js - 查询与计划系统
 * 支持: craftable, crafting_plan, nearby_blocks, nearby_entities
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
    } else if (process.argv[i] === '--query-action' && process.argv[i + 1]) {
      args.queryAction = process.argv[++i];
    } else if (process.argv[i] === '--item' && process.argv[i + 1]) {
      args.item = process.argv[++i];
    } else if (process.argv[i] === '--amount' && process.argv[i + 1]) {
      args.amount = parseInt(process.argv[++i], 10);
    } else if (process.argv[i] === '--range' && process.argv[i + 1]) {
      args.range = parseInt(process.argv[++i], 10);
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
if (!args.queryAction) {
  error('MISSING_QUERY_ACTION', '缺少 --query-action 参数');
}

const agentId = process.env.MINECRAFT_AGENT_ID || 'minecraft-agent-' + args.connectionId;
const sockPath = path.join(os.tmpdir(), 'minecraft-bot-' + args.connectionId + '.sock');

const client = net.createConnection(sockPath, () => {
  const cmd = { type: 'query' };
  if (args.queryAction) cmd['query-action'] = args.queryAction;
  if (args.item) cmd.item = args.item;
  if (args.amount) cmd.amount = args.amount;
  if (args.range) cmd.range = args.range;
  client.write(JSON.stringify(cmd) + '\n');
});

client.on('data', (data) => {
  try {
    const resp = JSON.parse(data.toString());
    const result = {
      success: resp.success !== false,
      agentId,
      connectionId: args.connectionId,
      data: { action: 'query', result: resp },
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
