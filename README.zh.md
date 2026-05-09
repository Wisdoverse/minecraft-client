<p align="center">
  <img src="https://raw.githubusercontent.com/Wisdoverse/mineworld/main/public/logo.svg" width="80" height="80" alt="logo">
</p>

<h1 align="center">Minecraft Client</h1>

<p align="center"><strong>实时 Minecraft Agent 观测平台</strong></p>

<p align="center">在一处监控、追踪和可视化您的 Minecraft AI 智能体。</p>

---

<p align="center">

[![GitHub](https://img.shields.io/badge/GitHub-Wisdoverse%2Fmineworld-black?logo=github)](https://github.com/Wisdoverse/mineworld)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green?logo=open-source-initiative)](https://opensource.org/licenses/MIT)

</p>

<p align="center">[English](README.md) · [简体中文](README.zh.md) · [日本語](README.ja.md) · [Français](README.fr.md) · [Русский](README.ru.md) · [Español](README.es.md) · [العربية](README.ar.md) · [Deutsch](README.de.md)</p>

---

## 目录

- [功能特性](#功能特性)
- [快速开始](#快速开始)
- [架构设计](#架构设计)
- [观测平台](#观测平台)
- [贡献指南](#贡献指南)
- [许可证](#许可证)

## 功能特性

### 核心能力

| 类别 | 描述 |
|------|------|
| **服务器连接** | 连接任意 Minecraft 服务器（离线或在线模式） |
| **移动控制** | 行走、跳跃、冲刺、游泳、路径导航 |
| **战斗系统** | 攻击实体、使用武器和护甲 |
| **物品管理** | 背包查看、物品移动、装备管理 |
| **合成系统** | 使用背包或工作台合成物品 |
| **熔炼系统** | 熔炼矿石，自动检测熔炉 |
| **容器操作** | 箱子、漏斗、投掷器、发射器、桶、熔炉访问 |
| **交易系统** | 村民交易界面 |
| **农业系统** | 自动耕地、种植、收获作物 |
| **建造系统** | 蓝图建造，进度上报 |
| **视觉系统** | 场景截图和信息获取 |
| **百科查询** | 查询 Minecraft Wiki 获取配方和信息 |

### 高级功能

| 功能 | 描述 |
|------|------|
| **载具控制** | 进入/离开船和矿车 |
| **盾牌格挡** | 启用/禁用盾牌防御 |
| **丢弃白名单** | 保护重要物品防止误删 |
| **自动装备** | 自动穿戴合成的护甲、盾牌、弓 |
| **清空熔炉** | 一键取出熔炉所有物品 |
| **多容器支持** | 自动检测容器类型 |

## 快速开始

### 安装

```bash
git clone https://github.com/Wisdoverse/minecraft-client.git
cd minecraft-client
npm install
```

### 连接服务器

```bash
# 离线服务器（默认）
node scripts/connect.js --host localhost --port 25565 --username MyBot --auth offline

# 在线/Microsoft 认证服务器
node scripts/connect.js --host mc.hypixel.net --port 25565 --username MyBot --auth microsoft

# 启用观测平台
node scripts/connect.js --host localhost --port 25565 --username MyBot \
  --observer-ws "wss://your-observer-server/ws/agent" \
  --observer-token "your-token"
```

### 基础交互

```bash
# 移动
node scripts/interact.js --action move --connection-id <id> --direction forward
node scripts/interact.js --action jump --connection-id <id>
node scripts/interact.js --action swim --connection-id <id> --swim-action start

# 聊天
node scripts/interact.js --action chat --connection-id <id> --message "你好！"

# 战斗
node scripts/interact.js --action attack --connection-id <id> --entity-name Zombie
node scripts/interact.js --action equip --connection-id <id> --slot 5 --destination head

# 盾牌格挡
node scripts/interact.js --action block --connection-id <id> --block-action enable
node scripts/interact.js --action block --connection-id <id> --block-action disable

# 载具控制
node scripts/interact.js --action boat --connection-id <id> --boat-action enter
node scripts/interact.js --action boat --connection-id <id> --boat-action exit
```

### 合成与熔炼

```bash
# 背包合成（2x2）
node scripts/craft.js --connection-id <id> --item stick --amount 4

# 工作台合成（3x3）
node scripts/craft.js --connection-id <id> --item diamond_pickaxe --use-workbench true

# 自动装备合成的护甲
node scripts/craft.js --connection-id <id> --item diamond_helmet --auto-equip

# 熔炼物品
node scripts/smelt.js --connection-id <id> --item iron_ore --amount 10 --fuel coal

# 清空熔炉
node scripts/smelt.js --connection-id <id> --action clear --furnace-position "100,64,200"
```

### 容器操作

```bash
# 查看容器
node scripts/chest.js --connection-id <id> --action list --position "100,64,200"

# 存入物品
node scripts/chest.js --connection-id <id> --action store --position "100,64,200" --item diamond --amount 16

# 取走物品
node scripts/chest.js --connection-id <id> --action withdraw --position "100,64,200" --item iron_ingot --amount 32
```

## 架构设计

```
minecraft-client/
├── SKILL.md                           # Skill 定义
├── package.json                       # Node.js 依赖
├── scripts/
│   ├── connect.js                     # 主 Bot 连接
│   ├── interact.js                    # 交互命令
│   ├── disconnect.js                  # 断开连接
│   ├── status.js                      # 状态查询
│   ├── vision.js                      # 截图
│   ├── inventory.js                   # 背包管理
│   ├── craft.js                       # 合成系统
│   ├── smelt.js                       # 熔炼系统
│   ├── chest.js                       # 容器操作
│   ├── sleep.js                       # 睡眠系统
│   ├── auto.js                        # 自动化任务
│   ├── farm.js                        # 农业系统
│   ├── build.js                       # 蓝图建造
│   ├── monitor.js                     # 环境监控
│   ├── query.js                       # 查询系统
│   ├── trade.js                       # 村民交易
│   ├── events.js                      # 事件订阅
│   ├── wiki.js                        # 百科查询
│   └── multi.js                       # 多 Bot 协作
└── references/
    └── observer-platform-protocol.md  # 观测平台协议
```

## 观测平台

### 支持的事件

| 事件类型 | 描述 |
|----------|------|
| `connected` | Bot 连接服务器 |
| `disconnected` | Bot 断开连接 |
| `moved` | Bot 移动或导航 |
| `jumped` | Bot 跳跃 |
| `attacked` | Bot 攻击实体 |
| `damaged` | Bot 受到伤害 |
| `died` | Bot 死亡 |
| `chat_sent` | 发送聊天消息 |
| `chat_received` | 接收聊天消息 |
| `block_broken` | 方块被破坏 |
| `block_placed` | 方块被放置 |
| `item_picked_up` | 捡起物品 |
| `item_dropped` | 丢弃物品 |
| `item_used` | 使用物品 |
| `inventory_changed` | 背包变化 |
| `world_changed` | 世界改变（维度） |
| `respawned` | Bot 重生 |
| `item_crafted` | 物品被合成 |
| `item_smelted` | 物品被熔炼 |
| `chest_opened` | 容器打开 |
| `item_deposited` | 物品存入 |
| `item_withdrawn` | 物品取出 |

### 消息格式

```json
{
  "type": "agent:event",
  "payload": {
    "agentId": "xxx",
    "event": {
      "type": "moved",
      "description": "Bot moved to position",
      "data": { "position": { "x": 0, "y": 64, "z": 0 } }
    }
  }
}
```

## 贡献指南

欢迎贡献！请随时提交 Issues 和 Pull Requests。

## 许可证

MIT
