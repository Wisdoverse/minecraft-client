<!-- Separator -->
---

<!-- Project Header -->
<p align="center">
  <img src="https://raw.githubusercontent.com/Wisdoverse/mineworld/main/public/logo.svg" width="80" height="80" alt="MineWorld Logo">
</p>

<h1 align="center">Minecraft Client</h1>

<p align="center">
  <strong>Real-Time Minecraft Agent Observation Platform</strong>
</p>

<p align="center">
  Connect to any Minecraft server and perform full game interactions — all in one place.
</p>

<br/>

<!-- Badges -->
<p align="center">

[![GitHub](https://img.shields.io/badge/GitHub-Wisdoverse%2Fminecraft--client-black?logo=github)](https://github.com/Wisdoverse/minecraft-client)
[![Node.js](https://img.shields.io/badge/Node.js-16%2B-green?logo=nodedotjs)](https://nodejs.org/)
[![Mineflayer](https://img.shields.io/badge/Mineflayer-4.37.0-blue)](https://github.com/PrismarineJS/mineflayer)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green?logo=opensourceinitiative)](LICENSE)

</p>

<!-- Language Switcher -->
<p align="center">

[English](README.md) · [简体中文](README.zh.md) · [日本語](README.ja.md) · [Français](README.fr.md) · [Español](README.es.md) · [Deutsch](README.de.md) · [Português](README.pt.md) · [Русский](README.ru.md) · [العربية](README.ar.md)

</p>

<!-- Separator -->
---

<!-- Table of Contents -->
## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Supported Actions](#supported-actions)
- [Observer Platform Events](#observer-platform-events)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

<!-- Features -->
## Features

### Core Capabilities

| Category | Description |
|----------|-------------|
| **Server Connection** | Connect to any Minecraft server (offline or online mode) |
| **Movement Control** | Walk, jump, sprint, swim, navigate with pathfinder |
| **Combat System** | Attack entities, use weapons and armor |
| **Item Management** | Inventory viewing, item moving, equipment management |
| **Crafting System** | Craft items using inventory or workbench |
| **Smelting System** | Smelt ores with automatic furnace detection |
| **Container Operations** | Chest, hopper, dropper, dispenser, barrel, furnace access |
| **Trading** | Villager trading interface |
| **Farming** | Auto-till, plant, harvest crops |
| **Building** | Blueprint-based construction with progress reporting |
| **Vision** | Screenshot capture with scene information |
| **Wiki Query** | Search Minecraft Wiki for recipes and information |

### Advanced Features

| Feature | Description |
|---------|-------------|
| **Vehicle Control** | Enter/exit boats and minecarts |
| **Shield Blocking** | Enable/disable shield blocking |
| **Drop Whitelist** | Protect important items from accidental dropping |
| **Auto-Equip** | Automatically equip crafted armor, shields, bows |
| **Furnace Clear** | One-click withdrawal of all furnace contents |
| **Multi-Container** | Automatic detection of container types |

<!-- Quick Start -->
## Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/Wisdoverse/minecraft-client.git
cd minecraft-client

# Install dependencies
npm install
```

### Connect to Server

```bash
# Offline server (default)
node scripts/connect.js --host localhost --port 25565 --username MyBot --auth offline

# Online/Microsoft auth server
node scripts/connect.js --host mc.hypixel.net --port 25565 --username MyBot --auth microsoft --password "your-password"

# With Observer Platform
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

# Shield Blocking
node scripts/interact.js --action block --connection-id <id> --block-action enable
node scripts/interact.js --action block --connection-id <id> --block-action disable

# Vehicle Control
node scripts/interact.js --action boat --connection-id <id> --boat-action enter
node scripts/interact.js --action boat --connection-id <id> --boat-action exit
```

### Crafting & Smelting

```bash
# Inventory crafting (2x2 recipes)
node scripts/craft.js --connection-id <id> --item stick --amount 4

# Workbench crafting (3x3 recipes)
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
# List container contents
node scripts/chest.js --connection-id <id> --action list --position "100,64,200"

# Store items
node scripts/chest.js --connection-id <id> --action store --position "100,64,200" --item diamond --amount 16

# Withdraw items
node scripts/chest.js --connection-id <id> --action withdraw --position "100,64,200" --item iron_ingot --amount 32
```

<!-- Supported Actions -->
## Supported Actions

| Action | Description |
|--------|-------------|
| `move` | Move in direction (forward/backward/left/right) |
| `jump` | Jump |
| `chat` | Send chat message |
| `break` | Break block at position |
| `place` | Place block at position |
| `attack` | Attack entity by name or UUID |
| `equip` | Equip item to destination |
| `drop` | Drop item (supports whitelist) |
| `look` | Look at position or set yaw/pitch |
| `eat` | Eat food |
| `sleep` | Sleep in bed at position |
| `wake` | Wake up from bed |
| `fish` | Start fishing |
| `boat` | Enter/exit boat |
| `minecart` | Enter/exit minecart |
| `block` | Enable/disable shield blocking |
| `goto` | Navigate to position |
| `collect` | Collect specific item type |
| `swim` | Start/stop swimming |
| `craft` | Craft item |
| `smelt` | Smelt item |
| `chest` | Container operations |
| `query` | Query information |
| `status` | Get bot status |
| `vision` | Take screenshot |
| `events` | Event subscription |
| `trade` | Villager trading |
| `farm` | Farming operations |
| `build` | Blueprint construction |
| `sleep-auto` | Auto-find and sleep in bed |
| `multi` | Multi-bot coordination |

<!-- Observer Platform Events -->
## Observer Platform Events

| Event Type | Description |
|------------|-------------|
| `connected` | Bot connected to server |
| `disconnected` | Bot disconnected from server |
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

<!-- Project Structure -->
## Project Structure

```
minecraft-client/
├── SKILL.md                           # Skill definition
├── package.json                       # Node.js dependencies
├── scripts/
│   ├── connect.js                     # Main bot connection
│   ├── interact.js                    # Interactive commands
│   ├── disconnect.js                  # Disconnect
│   ├── status.js                      # Status query
│   ├── vision.js                      # Screenshot
│   ├── inventory.js                   # Inventory management
│   ├── craft.js                       # Crafting system
│   ├── smelt.js                       # Smelting system
│   ├── chest.js                       # Container operations
│   ├── sleep.js                       # Sleep/wake system
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

<!-- Contributing -->
## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

<!-- License -->
## License

MIT

<!-- Footer Separator -->
---
