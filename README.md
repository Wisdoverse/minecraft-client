# Minecraft Client Skill

A comprehensive Minecraft bot skill for connecting to any Minecraft server and performing full game interactions, with built-in observer platform integration for real-time agent monitoring.

## Features

### Core Capabilities
- **Server Connection**: Connect to any Minecraft server (offline or online mode)
- **Movement Control**: Walk, jump, sprint, swim, navigate with pathfinder
- **Combat System**: Attack entities, use weapons and armor
- **Item Management**: Inventory viewing, item moving, equipment management
- **Crafting System**: Craft items using inventory or workbench
- **Smelting System**: Smelt ores with automatic furnace detection
- **Container Operations**: Chest, hopper, dropper, dispenser, barrel, furnace access
- **Trading**: Villager trading interface
- **Farming**: Auto-till, plant, harvest crops
- **Building**: Blueprint-based construction with progress reporting
- **Vision**: Screenshot capture with scene information
- **Wiki Query**: Search Minecraft Wiki for recipes and information

### Advanced Features
- **Vehicle Control**: Enter/exit boats and minecarts
- **Shield Blocking**: Enable/disable shield blocking
- **Drop Whitelist**: Protect important items from accidental dropping
- **Auto-Equip**: Automatically equip crafted armor, shields, bows
- **Furnace Clear**: One-click withdrawal of all furnace contents
- **Multi-Container Support**: Automatic detection of container types

### Observer Platform Integration
- Real-time agent status updates (position, health, inventory, equipment)
- World snapshot reporting (blocks, entities)
- Event tracking (moves, attacks, crafting, chat, etc.)
- WebSocket-based communication
- Automatic reconnection with backoff strategy

## Requirements

- Node.js 16+
- npm

## Installation

```bash
# Clone the repository
git clone https://github.com/Wisdoverse/minecraft-client.git
cd minecraft-client

# Install dependencies
npm install
```

## Quick Start

### 1. Connect to Server

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

### 2. Basic Interactions

```bash
# Movement
node scripts/interact.js --action move --connection-id <id> --direction forward
node scripts/interact.js --action jump --connection-id <id>
node scripts/interact.js --action swim --connection-id <id> --swim-action start

# Chat
node scripts/interact.js --action chat --connection-id <id> --message "Hello!"

# Block Interaction
node scripts/interact.js --action break --connection-id <id> --position "10,64,10"
node scripts/interact.js --action place --connection-id <id> --position "10,65,10"

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

### 3. Item Management

```bash
# Drop items
node scripts/interact.js --action drop --connection-id <id> --item diamond --count 5

# Protect items with whitelist
node scripts/interact.js --action drop --connection-id <id> --whitelist-action add --item diamond_sword
node scripts/interact.js --action drop --connection-id <id> --whitelist-action list

# Inventory
node scripts/inventory.js --action list --connection-id <id>
node scripts/inventory.js --action move --connection-id <id> --source-slot 0 --dest-slot 8
```

### 4. Crafting & Smelting

```bash
# Craft items (inventory crafting for 2x2 recipes)
node scripts/craft.js --connection-id <id> --item stick --amount 4

# Craft with workbench (3x3 recipes)
node scripts/craft.js --connection-id <id> --item diamond_pickaxe --use-workbench true

# Auto-equip crafted armor
node scripts/craft.js --connection-id <id> --item diamond_helmet --auto-equip
node scripts/craft.js --connection-id <id> --item shield --auto-equip

# Smelt items
node scripts/smelt.js --connection-id <id> --item iron_ore --amount 10 --fuel coal

# Clear furnace (withdraw all items)
node scripts/smelt.js --connection-id <id> --action clear --furnace-position "100,64,200"
```

### 5. Container Operations

```bash
# List container contents
node scripts/chest.js --connection-id <id> --action list --position "100,64,200"

# Store items
node scripts/chest.js --connection-id <id> --action store --position "100,64,200" --item diamond --amount 16

# Withdraw items
node scripts/chest.js --connection-id <id> --action withdraw --position "100,64,200" --item iron_ingot --amount 32
```

### 6. Automation Tasks

```bash
# Navigate to location
node scripts/auto.js --task goto --connection-id <id> --position "100,64,200"

# Collect items
node scripts/auto.js --task collect --connection-id <id> --item-type diamond --radius 32

# Auto sleep
node scripts/sleep.js --connection-id <id>

# Farming
node scripts/farm.js --connection-id <id> --farm-action till --position "100,64,200"
```

### 7. Query & Monitoring

```bash
# Query craftable items
node scripts/interact.js --action query --connection-id <id> --query-action craftable

# Generate crafting plan
node scripts/interact.js --action query --connection-id <id> --query-action crafting_plan --item diamond_pickaxe

# Query nearby blocks/entities
node scripts/interact.js --action query --connection-id <id> --query-action nearby_blocks --range 16
node scripts/interact.js --action query --connection-id <id> --query-action nearby_entities --range 16

# Monitor environment
node scripts/monitor.js --type entities --connection-id <id> --radius 50
node scripts/monitor.js --type blocks --connection-id <id> --radius 10
```

### 8. Status & Vision

```bash
# Get bot status
node scripts/status.js --connection-id <id>

# Take screenshot
node scripts/vision.js --connection-id <id>
```

### 9. Disconnect

```bash
node scripts/disconnect.js --connection-id <id>
```

## Supported Action Types

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

## Project Structure

```
minecraft-client/
├── SKILL.md                           # Skill definition and documentation
├── package.json                       # Node.js dependencies
├── scripts/
│   ├── connect.js                    # Main bot connection script
│   ├── interact.js                   # Interactive command script
│   ├── disconnect.js                 # Disconnect script
│   ├── status.js                     # Status query script
│   ├── vision.js                     # Screenshot script
│   ├── inventory.js                  # Inventory management
│   ├── craft.js                      # Crafting system
│   ├── smelt.js                      # Smelting system
│   ├── chest.js                      # Container operations
│   ├── sleep.js                      # Sleep/wake system
│   ├── auto.js                       # Automation tasks
│   ├── farm.js                       # Farming system
│   ├── build.js                      # Blueprint building
│   ├── monitor.js                    # Environment monitoring
│   ├── query.js                      # Query system
│   ├── trade.js                      # Villager trading
│   ├── events.js                     # Event subscription
│   ├── wiki.js                       # Minecraft Wiki query
│   └── multi.js                      # Multi-bot coordination
└── references/
    └── observer-platform-protocol.md # Observer platform protocol
```

## Dependencies

- **mineflayer** (^4.37.0) - Minecraft bot framework
- **mineflayer-pathfinder** (^2.4.5) - Pathfinding for navigation
- **mineflayer-web** (^0.1.0) - Web interface
- **prismarine-viewer** (^1.6.0) - Visual debugging
- **ws** (^8.20.0) - WebSocket client
- **vec3** (^0.3.24) - Vector math utilities

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.
