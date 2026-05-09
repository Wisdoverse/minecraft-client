#!/usr/bin/env node
/**
 * multi.js - 多 Bot 管理与团队协作
 * 支持: list, team_create, team_invite, team_assign, team_leave
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
    } else if (process.argv[i] === '--team-name' && process.argv[i + 1]) {
      args.teamName = process.argv[++i];
    } else if (process.argv[i] === '--target-bots' && process.argv[i + 1]) {
      args.targetBots = process.argv[++i].split(',').map(s => s.trim());
    } else if (process.argv[i] === '--task-type' && process.argv[i + 1]) {
      args.taskType = process.argv[++i];
    } else if (process.argv[i] === '--team-id' && process.argv[i + 1]) {
      args.teamId = process.argv[++i];
    } else if (process.argv[i] === '--task' && process.argv[i + 1]) {
      args.task = process.argv[++i];
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
  error('MISSING_ACTION', '缺少 --action 参数 (list|team_create|team_invite|team_assign|team_leave)');
}

const agentId = process.env.MINECRAFT_AGENT_ID || 'minecraft-agent-' + args.connectionId;
const sockPath = path.join(os.tmpdir(), 'minecraft-bot-' + args.connectionId + '.sock');

const client = net.createConnection(sockPath, () => {
  const cmd = { type: 'multi', action: args.action };
  if (args.teamName) cmd.teamName = args.teamName;
  if (args.targetBots) cmd.targetBots = args.targetBots;
  if (args.taskType) cmd.taskType = args.taskType;
  if (args.teamId) cmd.teamId = args.teamId;
  if (args.task) cmd.task = args.task;
  client.write(JSON.stringify(cmd) + '\n');
});

client.on('data', (data) => {
  try {
    const resp = JSON.parse(data.toString());
    output({
      success: resp.success !== false,
      agentId,
      connectionId: args.connectionId,
      data: { action: 'multi', result: resp },
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
