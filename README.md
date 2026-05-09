<div align="center">

Minecraft Client

<strong>Real-Time Minecraft Agent Observation Platform</strong>

Monitor, track, and visualize your Minecraft AI agents — all in one place.

---

[![GitHub](https://img.shields.io/badge/GitHub-Wisdoverse%2Fmineworld-black?logo=github)](https://github.com/Wisdoverse/mineworld)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green?logo=open-source-initiative)](https://opensource.org/licenses/MIT)

**English** · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [Français](README.fr.md) · [Русский](README.ru.md) · [Español](README.es.md) · [العربية](README.ar.md) · [Deutsch](README.de.md)

---
</div>

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Observability](#observability)
- [Contributing](#contributing)
- [License](#license)

## Features

### Core Capabilities

| Category | Description |
|----------|-------------|
| **Server Connection** | Connect to any Minecraft server (offline or online mode) |
| **Movement Control** | Walk, jump, sprint, swim, path navigation |
| **Combat System** | Attack entities, use weapons and armor |
| **Inventory Management** | View inventory, move items, equipment management |
| **Crafting System** | Craft items using inventory or workbench |
| **Smelting System** | Smelt ores, auto-detect furnaces |
| **Container Operations** | Chest, hopper, dropper, dispenser, barrel, furnace access |
| **Trading System** | Villager trading interface |
| **Farming System** | Auto-till, plant, harvest crops |
| **Building System** | Blueprint construction with progress reporting |
| **Vision System** | Scene screenshots and information retrieval |
| **Wiki Query** | Query Minecraft Wiki for recipes and info |

### Advanced Features

| Feature | Description |
|---------|-------------|
| **Vehicle Control** | Enter/exit boats and minecarts |
| **Shield Blocking** | Enable/disable shield defense |
| **Drop Whitelist** | Protect important items from accidental deletion |
| **Auto-Equip** | Auto-equip crafted armor, shields, bows |
| **Clear Furnace** | One-click to take all items from furnace |
| **Multi-Container** | Auto-detect container types |

## Quick Start

### Installation

```bash
git clone https://github.com/Wisdoverse/minecraft-client.git
cd minecraft-client
npm install
```

### Connect to Server

```bash
# Offline server (default)
node scripts/connect.js --host localhost --port 25565 --username MyBot --auth offline

# Online/Microsoft authenticated server
node scripts/connect.js --host mc.hypixel.net --port 25565 --username MyBot --auth microsoft

# Enable observer platform
node scripts/connect.js --host localhost --port 25565 --username MyBot \
  --observer-ws "wss://your-observer-server/ws/agent" \
  --observer-token "your-token"
```

### Basic Interactions

```bash
# Movement
node scripts/interact.js --action move --connection-id <id> --direction forward
node scripts/interact.js --action jump --connection-id <id>
node scripts/interact.js --action swim --connection-id <id> --swim-action start

# Chat
node scripts/interact.js --action chat --connection-id <id> --message "Hello!"

# Combat
node scripts/interact.js --action attack --connection-id <id> --entity-name Zombie
node scripts/interact.js --action equip --connection-id <id> --slot 5 --destination head

# Shield blocking
node scripts/interact.js --action block --connection-id <id> --block-action enable
node scripts/interact.js --action block --connection-id <id> --block-action disable

# Vehicle control
node scripts/interact.js --action boat --connection-id <id> --boat-action enter
node scripts/interact.js --action boat --connection-id <id> --boat-action exit
```

### Crafting & Smelting

```bash
# Inventory crafting (2x2)
node scripts/craft.js --connection-id <id> --item stick --amount 4

# Workbench crafting (3x3)
node scripts/craft.js --connection-id <id> --item diamond_pickaxe --use-workbench true

# Auto-equip crafted armor
node scripts/craft.js --connection-id <id> --item diamond_helmet --auto-equip

# Smelt items
node scripts/smelt.js --connection-id <id> --item iron_ore --amount 10 --fuel coal

# Clear furnace
node scripts/smelt.js --connection-id <id> --action clear --furnace-position "100,64,200"
```

### Container Operations

```bash
# View container
node scripts/chest.js --connection-id <id> --action list --position "100,64,200"

# Store items
node scripts/chest.js --connection-id <id> --action store --position "100,64,200" --item diamond --amount 16

# Withdraw items
node scripts/chest.js --connection-id <id> --action withdraw --position "100,64,200" --item iron_ingot --amount 32
```

## Architecture

```
minecraft-client/
├── SKILL.md                           # Skill definition
├── package.json                       # Node.js dependencies
├── scripts/
│   ├── connect.js                     # Main bot connection
│   ├── interact.js                    # Interaction commands
│   ├── disconnect.js                  # Disconnect
│   ├── status.js                      # Status query
│   ├── vision.js                      # Screenshot
│   ├── inventory.js                   # Inventory management
│   ├── craft.js                       # Crafting system
│   ├── smelt.js                       # Smelting system
│   ├── chest.js                       # Container operations
│   ├── sleep.js                       # Sleep system
│   ├── auto.js                        # Automation tasks
│   ├── farm.js                        # Farming system
│   ├── build.js                       # Blueprint building
│   ├── monitor.js                     # Environment monitoring
│   ├── query.js                       # Query system
│   ├── trade.js                       # Villager trading
│   ├── events.js                      # Event subscription
│   ├── wiki.js                        # Wiki query
│   └── multi.js                       # Multi-bot coordination
└── references/
    └── observer-platform-protocol.md  # Observer platform protocol
```

## Observability

### Supported Events

| Event Type | Description |
|------------|-------------|
| `connected` | Bot connected to server |
| `disconnected` | Bot disconnected |
| `moved` | Bot moved or navigated |
| `jumped` | Bot jumped |
| `attacked` | Bot attacked entity |
| `damaged` | Bot took damage |
| `died` | Bot died |
| `chat_sent` | Chat message sent |
| `chat_received` | Chat message received |
| `block_broken` | Block broken |
| `block_placed` | Block placed |
| `item_picked_up` | Item picked up |
| `item_dropped` | Item dropped |
| `item_used` | Item used |
| `inventory_changed` | Inventory changed |
| `world_changed` | World changed (dimension) |
| `respawned` | Bot respawned |
| `item_crafted` | Item crafted |
| `item_smelted` | Item smelted |
| `chest_opened` | Container opened |
| `item_deposited` | Item deposited |
| `item_withdrawn` | Item withdrawn |

### Message Format

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

## Contributing

Contributions are welcome! Feel free to submit Issues and Pull Requests.

## License

MIT
