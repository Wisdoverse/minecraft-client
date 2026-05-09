<!-- header -->
---

<p align="center">
  <img src="https://raw.githubusercontent.com/Wisdoverse/mineworld/main/public/logo.svg" width="80" height="80" alt="logo">
</p>

<h1 align="center">MineWorld</h1>

<p align="center"><strong>实时 Minecraft Agent 观测平台</strong></p>

<p align="center">一站式监控、追踪和可视化您的 Minecraft AI Agent。</p>

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
- [观测能力](#观测能力)
- [贡献指南](#贡献指南)
- [许可证](#许可证)

## 功能特性

### 实时监控

- **Agent 追踪** — 实时追踪 Agent 位置、生命值、背包和状态
- **事件流** — 将所有 Agent 事件（移动、战斗、背包变更）流式传输到观测平台
- **世界快照** — 定期获取 Agent 周围世界的方块和实体快照

### 内置工具

- **路径导航** — 使用 A* 算法导航到任意位置
- **战斗系统** — 可配置行为的实体攻击
- **背包管理** — 完整的背包操作（移动、装备、丢弃物品）
- **合成系统** — 使用工作台或背包合成物品
- **熔炼系统** — 熔炼矿石和烹饪食物
- **农业系统** — 自动农作物种植（小麦、胡萝卜、土豆、甜菜根）
- **建造系统** — 从蓝图文件构建建筑
- **交易系统** — 与村民交易
- **睡眠系统** — 寻找并睡在床上
- **钓鱼系统** — 自动钓鱼

### 观测平台

- **WebSocket 连接** — 实时双向通信
- **事件订阅** — 订阅特定事件类型
- **团队协作** — 多 Agent 协调支持
- **进度上报** — 建造进度追踪

## 快速开始

### 环境要求

- Node.js 18+
- Minecraft 服务器（Java 版 1.8+）

### 安装步骤

```bash
# 克隆仓库
git clone https://github.com/Wisdoverse/mineworld.git
cd mineworld

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 配置说明

在根目录创建 `.env` 文件：

```env
# 观测平台
OBSERVER_WS_URL=ws://localhost:8080/ws/agent
OBSERVER_TOKEN=your-token-here

# Minecraft 服务器
MC_HOST=localhost
MC_PORT=25565
MC_USERNAME=AgentBot
```

## 架构设计

```
┌─────────────────────────────────────────────────────────────┐
│                      观测平台                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   仪表盘     │  │   事件流    │  │   团队     │         │
│  │             │  │             │  │   管理器   │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │ WebSocket
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Minecraft 客户端                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Mineflayer │  │  Pathfinder  │  │   动作     │         │
│  │             │  │             │  │   管理器   │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │ Unix Socket
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      CLI 命令行接口                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   连接      │  │   交互      │  │   状态      │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

## 观测能力

### 事件类型

| 事件 | 描述 |
|------|------|
| `connected` | Agent 连接服务器 |
| `disconnected` | Agent 断开连接 |
| `moved` | Agent 位置改变 |
| `jumped` | Agent 跳跃 |
| `attacked` | Agent 攻击实体 |
| `damaged` | Agent 受到伤害 |
| `died` | Agent 死亡 |
| `chat_sent` | 发送聊天消息 |
| `chat_received` | 接收聊天消息 |
| `block_broken` | 方块被破坏 |
| `block_placed` | 方块被放置 |
| `item_picked_up` | 捡起物品 |
| `item_dropped` | 丢弃物品 |
| `inventory_changed` | 背包被修改 |

### 消息协议

```json
{
  "type": "agent:event",
  "payload": {
    "agentId": "agent-001",
    "event": {
      "type": "moved",
      "description": "Agent moved to x=100, y=64, z=-200",
      "data": {
        "from": { "x": 90, "y": 64, "z": -200 },
        "to": { "x": 100, "y": 64, "z": -200 }
      }
    },
    "timestamp": 1704067200000
  }
}
```

## 贡献指南

欢迎贡献！请随时提交 Issue 和 Pull Request。

## 许可证

本项目基于 MIT 许可证开源。
