#!/usr/bin/env node
/**
 * wiki.js - Minecraft Wiki 查询
 * 支持: search, get, recipe
 */
const https = require('https');
const http = require('http');

const WIKI_BASE = 'minecraft.fandom.com';
const WIKI_API = '/api.php';

function parseArgs() {
  const args = {};
  for (let i = 2; i < process.argv.length; i++) {
    if (process.argv[i] === '--connection-id' && process.argv[i + 1]) {
      args.connectionId = process.argv[++i];
    } else if (process.argv[i] === '--action' && process.argv[i + 1]) {
      args.action = process.argv[++i];
    } else if (process.argv[i] === '--query' && process.argv[i + 1]) {
      args.query = process.argv[++i];
    } else if (process.argv[i] === '--item' && process.argv[i + 1]) {
      args.item = process.argv[++i];
    } else if (process.argv[i] === '--lang' && process.argv[i + 1]) {
      args.lang = process.argv[++i];
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
    agentId: 'minecraft-wiki',
    connectionId: args.connectionId || null,
    error: { code, message, details },
    suggestions: suggestions || []
  });
}

function httpGet(options) {
  return new Promise((resolve, reject) => {
    const req = https.get(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.setTimeout(10000, () => { req.destroy(); reject(new Error('请求超时')); });
  });
}

async function wikiSearch(query, lang) {
  const domain = lang === 'en' ? 'minecraft.fandom.com' : 'minecraft.fandom.com/zh';
  const path = `${WIKI_API}?action=opensearch&search=${encodeURIComponent(query)}&limit=10&format=json`;
  const data = await httpGet({ hostname: domain, path, headers: { 'User-Agent': 'Minecraft-Client-Skill/3.0' } });
  try {
    const parsed = JSON.parse(data);
    return parsed[1].map((name, i) => ({
      id: name.toLowerCase().replace(/ /g, '_'),
      name,
      description: parsed[2][i] || '',
      url: parsed[3][i] || ''
    }));
  } catch {
    return [];
  }
}

async function wikiGet(itemName, lang) {
  const domain = lang === 'en' ? 'minecraft.fandom.com' : 'minecraft.fandom.com/zh';
  const titles = decodeURIComponent(itemName);
  const path = `${WIKI_API}?action=query&titles=${encodeURIComponent(titles)}&prop=extracts|info&exintro=1&explaintext=1&inprop=url&format=json`;
  const data = await httpGet({ hostname: domain, path, headers: { 'User-Agent': 'Minecraft-Client-Skill/3.0' } });
  const parsed = JSON.parse(data);
  const pages = parsed.query?.pages || {};
  const page = Object.values(pages)[0];
  if (!page || page.missing) return null;
  return {
    id: page.title.toLowerCase().replace(/ /g, '_'),
    name: page.title,
    description: page.extract || '',
    url: lang === 'en' ? `https://minecraft.fandom.com/wiki/${encodeURIComponent(page.title)}` : `https://minecraft.fandom.com/zh/wiki/${encodeURIComponent(page.title)}`
  };
}

async function wikiRecipe(itemName, lang) {
  // Minecraft Wiki 没有公开的 recipe API，通过搜索获取
  const results = await wikiSearch(`${itemName} crafting recipe`, lang);
  return { item: itemName, results };
}

const args = parseArgs();
if (!args.action) {
  error('MISSING_ACTION', '缺少 --action 参数 (search|get|recipe)');
}
if (args.action === 'search' && !args.query) {
  error('MISSING_QUERY', 'search 操作需要 --query 参数');
}
if ((args.action === 'get' || args.action === 'recipe') && !args.item) {
  error('MISSING_ITEM', 'get/recipe 操作需要 --item 参数');
}

const lang = args.lang || 'zh';

(async () => {
  try {
    let result;
    if (args.action === 'search') {
      const results = await wikiSearch(args.query, lang);
      result = { query: args.query, results, count: results.length };
    } else if (args.action === 'get') {
      const item = await wikiGet(args.item, lang);
      if (!item) {
        error('ITEM_NOT_FOUND', `未找到物品: ${args.item}`);
      }
      result = item;
    } else if (args.action === 'recipe') {
      const recipe = await wikiRecipe(args.item, lang);
      result = recipe;
    }
    output({
      success: true,
      agentId: 'minecraft-wiki',
      connectionId: args.connectionId || null,
      data: { action: 'wiki', result }
    });
  } catch (err) {
    error('WIKI_ERROR', 'Wiki 查询失败: ' + err.message, { action: args.action, item: args.item || args.query });
  }
})();
