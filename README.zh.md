<div align="center">

# Minecraft Client

**实时 Minecraft Agent 观测平台**

监控、追踪和可视化你的 Minecraft AI Agent — 一站式解决方案。

---

[![GitHub](https://img.shields.io/badge/GitHub-Wisdoverse%2Fminecraft--client-black?logo=github)](https://github.com/Wisdoverse/minecraft-client)
[![Node.js](https://img.shields.io/badge/Node.js-16%2B-green?logo=nodedotjs)](https://nodejs.org/)
[![Mineflayer](https://img.shields.io/badge/Mineflayer-4.37.0-blue)](https://github.com/PrismarineJS/mineflayer)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green?logo=open-source-initiative)](https://opensource.org/licenses/MIT)

[English](README.md) · **简体中文** · [日本語](README.ja.md) · [Français](README.fr.md) · [Русский](README.ru.md) · [Español](README.es.md) · [العربية](README.ar.md) · [Deutsch](README.de.md)

---
</div>

## 功能特性

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

## 快速开始

### 安装

```bash
git clone https://github.com/Wisdoverse/minecraft-client.git
cd minecraft-client
npm install
```

### 连接服务器

```bash
# 离线服务器
node scripts/connect.js --host localhost --port 25565 --username MyBot --auth offline

# 在线服务器
node scripts/connect.js --host mc.hypixel.net --port 25565 --username MyBot --auth microsoft --password "your-password"

# 启用观测平台
node scripts/connect.js --host localhost --port 25565 --username MyBot \
  --observer-ws "wss://your-observer-server/ws/agent" \
  --observer-token "your-token"
```

## 支持的操作

| 操作 | 描述 |
|------|------|
| `move` | 移动方向（前进/后退/左/右） |
| `jump` | 跳跃 |
| `chat` | 发送聊天消息 |
| `break` | 破坏指定位置的方块 |
| `place` | 放置方块到指定位置 |
| `attack` | 按名称或 UUID 攻击实体 |
| `equip` | 装备物品到指定位置 |
| `drop` | 丢弃物品（支持白名单） |
| `look` | 看向位置或设置视角 |
| `eat` | 吃东西 |
| `sleep` | 在指定位置睡觉 |
| `wake` | 起床 |
| `fish` | 开始钓鱼 |
| `boat` | 进入/离开船 |
| `minecart` | 进入/离开矿车 |
| `block` | 启用/禁用盾牌格挡 |
| `goto` | 导航到指定位置 |
| `craft` | 合成物品 |
| `smelt` | 熔炼物品 |
| `chest` | 容器操作 |
| `trade` | 村民交易 |
| `farm` | 农业操作 |
| `build` | 蓝图建造 |

## 项目结构

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

## 许可证

MIT
