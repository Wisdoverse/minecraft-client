#!/usr/bin/env node
/**
 * vision.js - 视觉/截图系统
 * 依赖: prismarine-viewer (已包含在 mineflayer 中)
 * 支持: capture (截图并上报)
 */
const net = require('net');
const path = require('path');
const os = require('os');
const fs = require('fs');
const { pipeline } = require('stream');
const { promisify } = require('util');
const https = require('https');
const http = require('http');

const pipelineAsync = promisify(pipeline);

function parseArgs() {
  const args = {};
  for (let i = 2; i < process.argv.length; i++) {
    if (process.argv[i] === '--connection-id' && process.argv[i + 1]) {
      args.connectionId = process.argv[++i];
    } else if (process.argv[i] === '--action' && process.argv[i + 1]) {
      args.action = process.argv[++i];
    } else if (process.argv[i] === '--description' && process.argv[i + 1]) {
      args.description = process.argv[++i];
    } else if (process.argv[i] === '--width' && process.argv[i + 1]) {
      args.width = parseInt(process.argv[++i], 10);
    } else if (process.argv[i] === '--height' && process.argv[i + 1]) {
      args.height = parseInt(process.argv[++i], 10);
    } else if (process.argv[i] === '--upload-url' && process.argv[i + 1]) {
      args.uploadUrl = process.argv[++i];
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

async function uploadImage(imageData, uploadUrl) {
  return new Promise((resolve, reject) => {
    // imageData is base64 data: URL or base64 string
    let body;
    if (imageData.startsWith('data:')) {
      body = Buffer.from(imageData.split(',')[1], 'base64');
    } else {
      body = Buffer.from(imageData, 'base64');
    }
    try {
      const url = new URL(uploadUrl);
      const options = {
        hostname: url.hostname,
        port: url.port || (url.protocol === 'https:' ? 443 : 80),
        path: url.pathname + url.search,
        method: 'POST',
        headers: {
          'Content-Type': 'application/octet-stream',
          'Content-Length': body.length
        },
        timeout: 30000
      };
      const protocol = url.protocol === 'https:' ? https : http;
      const req = protocol.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try { resolve(JSON.parse(data)); } catch { resolve(data); }
        });
      });
      req.on('error', reject);
      req.on('timeout', () => { req.destroy(); reject(new Error('Upload timeout')); });
      req.write(body);
      req.end();
    } catch (e) { reject(e); }
  });
}

const args = parseArgs();
if (!args.connectionId) {
  error('MISSING_CONNECTION_ID', '缺少 --connection-id 参数');
}
if (!args.action) {
  args.action = 'capture';
}

const agentId = process.env.MINECRAFT_AGENT_ID || 'minecraft-agent-' + args.connectionId;
const sockPath = path.join(os.tmpdir(), 'minecraft-bot-' + args.connectionId + '.sock');
const captureId = 'cap_' + Math.random().toString(36).slice(2, 10);

const client = net.createConnection(sockPath, () => {
  const cmd = {
    type: 'vision',
    action: args.action || 'capture',
    captureId,
    description: args.description || '',
    width: args.width || 800,
    height: args.height || 512
  };
  client.write(JSON.stringify(cmd) + '\n');
});

client.on('data', async (data) => {
  try {
    const resp = JSON.parse(data.toString());
    // If vision captured image, try to upload
    if (resp.imageData && args.uploadUrl) {
      try {
        const uploadResult = await uploadImage(resp.imageData, args.uploadUrl);
        resp.uploadResult = uploadResult;
      } catch (e) {
        resp.uploadError = e.message;
      }
    }
    output({
      success: resp.success !== false,
      agentId,
      connectionId: args.connectionId,
      data: { action: 'vision', result: resp },
      observerEvents: []
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
