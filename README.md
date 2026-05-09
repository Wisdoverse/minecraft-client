<!-- header -->
---

<p align="center">
  <img src="https://raw.githubusercontent.com/Wisdoverse/mineworld/main/public/logo.svg" width="80" height="80" alt="logo">
</p>

<h1 align="center">MineWorld</h1>

<p align="center"><strong>Real-Time Minecraft Agent Observation Platform</strong></p>

<p align="center">Monitor, track, and visualize your Minecraft AI agents — all in one place.</p>

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

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Observability](#observability)
- [Contributing](#contributing)
- [License](#license)

## Features

### Real-Time Monitoring

- **Live Agent Tracking** — Track agent position, health, inventory, and status in real-time
- **Event Streaming** — Stream all agent events (movement, combat, inventory changes) to the observer platform
- **World Snapshots** — Periodic world snapshots showing blocks and entities around agents

### Built-in Tools

- **Pathfinding** — Navigate to any location using A* pathfinding
- **Combat** — Attack entities with configurable behavior
- **Inventory** — Full inventory management (move, equip, drop items)
- **Crafting** — Craft items using workbench or inventory
- **Smelting** — Smelt ores and cook food
- **Farming** — Automatic crop farming (wheat, carrots, potatoes, beetroot)
- **Building** — Build structures from blueprint files
- **Trading** — Trade with villagers
- **Sleep** — Find and sleep in beds
- **Fishing** — Automatic fishing

### Observer Platform

- **WebSocket Connection** — Real-time bidirectional communication
- **Event Subscription** — Subscribe to specific event types
- **Team Coordination** — Multi-agent coordination support
- **Progress Reporting** — Build progress tracking

## Quick Start

### Prerequisites

- Node.js 18+
- Minecraft Server (Java Edition 1.8+)

### Installation

```bash
# Clone the repository
git clone https://github.com/Wisdoverse/mineworld.git
cd mineworld

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Configuration

Create a `.env` file in the root directory:

```env
# Observer Platform
OBSERVER_WS_URL=ws://localhost:8080/ws/agent
OBSERVER_TOKEN=your-token-here

# Minecraft Server
MC_HOST=localhost
MC_PORT=25565
MC_USERNAME=AgentBot
```

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Observer Platform                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  Dashboard  │  │   Event     │  │   Team      │         │
│  │             │  │   Stream    │  │   Manager   │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │ WebSocket
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Minecraft Client                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  Mineflayer │  │  Pathfinder │  │   Actions   │         │
│  │             │  │             │  │   Manager   │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │ Unix Socket
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      CLI Interface                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Connect   │  │   Interact  │  │   Status    │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

## Observability

### Event Types

| Event | Description |
|-------|-------------|
| `connected` | Agent connected to server |
| `disconnected` | Agent disconnected |
| `moved` | Agent position changed |
| `jumped` | Agent jumped |
| `attacked` | Agent attacked an entity |
| `damaged` | Agent took damage |
| `died` | Agent died |
| `chat_sent` | Chat message sent |
| `chat_received` | Chat message received |
| `block_broken` | Block was broken |
| `block_placed` | Block was placed |
| `item_picked_up` | Item was picked up |
| `item_dropped` | Item was dropped |
| `inventory_changed` | Inventory was modified |

### Message Protocol

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

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
