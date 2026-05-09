# Minecraft 客户端 Skill

一个全面的 Minecraft 机器人技能，可连接到任意 Minecraft 服务器并执行完整的游戏交互，内置观测平台集成，支持实时 Agent 监控。

## 功能特性

### 核心能力
- **服务器连接**：连接到任意 Minecraft 服务器（离线或正版模式）
- **移动控制**：行走、跳跃、冲刺、游泳、使用路径导航
- **战斗系统**：攻击实体、使用武器和盔甲
- **物品管理**：查看背包、移动物品、装备管理
- **合成系统**：使用背包或工作台合成物品
- **熔炼系统**：熔炼矿石，自动检测熔炉
- **容器操作**：箱子、漏斗、投掷器、发射器、桶、熔炉存取
- **交易系统**：村民交易界面
- **农业系统**：自动耕地、种植、收割农作物
- **建造系统**：基于蓝图的建造，进度上报
- **视觉系统**：截图捕获，场景信息
- **Wiki 查询**：搜索 Minecraft Wiki 获取配方和信息

### 高级功能
- **载具控制**：进入/离开船和矿车
- **盾牌格挡**：启用/禁用盾牌防御
- **丢弃白名单**：保护重要物品防止误删
- **自动装备**：自动穿戴合成的盔甲、盾牌、弓
- **清空熔炉**：一键取出熔炉内所有物品
- **多容器支持**：自动检测容器类型

### 观测平台集成
- 实时 Agent 状态更新（位置、生命值、背包、装备）
- 世界快照上报（方块、实体）
- 事件追踪（移动、攻击、合成、聊天等）
- 基于 WebSocket 的通信
- 自动重连与退避策略

## 系统要求

- Node.js 16+
- npm

## 安装

```bash
# 克隆仓库
git clone https://github.com/Wisdoverse/minecraft-client.git
cd minecraft-client

# 安装依赖
npm install
```

## 快速开始

### 1. 连接服务器

```bash
# 离线服务器（默认）
node scripts/connect.js --host localhost --port 25565 --username MyBot --auth offline

# 正版/Microsoft 认证服务器
node scripts/connect.js --host mc.hypixel.net --port 25565 --username MyBot --auth microsoft --password "your-password"

# 带观测平台
node scripts/connect.js --host localhost --port 25565 --username MyBot \
  --observer-ws "wss://your-observer-server/ws/agent" \
  --observer-token "your-token"
```

### 2. 基础交互

```bash
# 移动
node scripts/interact.js --action move --connection-id <id> --direction forward
node scripts/interact.js --action jump --connection-id <id>
node scripts/interact.js --action swim --connection-id <id> --swim-action start

# 聊天
node scripts/interact.js --action chat --connection-id <id> --message "你好！"

# 方块交互
node scripts/interact.js --action break --connection-id <id> --position "10,64,10"
node scripts/interact.js --action place --connection-id <id> --position "10,65,10"

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

### 3. 物品管理

```bash
# 丢弃物品
node scripts/interact.js --action drop --connection-id <id> --item diamond --count 5

# 白名单保护
node scripts/interact.js --action drop --connection-id <id> --whitelist-action add --item diamond_sword
node scripts/interact.js --action drop --connection-id <id> --whitelist-action list

# 背包管理
node scripts/inventory.js --action list --connection-id <id>
node scripts/inventory.js --action move --connection-id <id> --source-slot 0 --dest-slot 8
```

### 4. 合成与熔炼

```bash
# 背包合成（2x2 配方）
node scripts/craft.js --connection-id <id> --item stick --amount 4

# 工作台合成（3x3 配方）
node scripts/craft.js --connection-id <id> --item diamond_pickaxe --use-workbench true

# 自动装备合成的盔甲
node scripts/craft.js --connection-id <id> --item diamond_helmet --auto-equip
node scripts/craft.js --connection-id <id> --item shield --auto-equip

# 熔炼物品
node scripts/smelt.js --connection-id <id> --item iron_ore --amount 10 --fuel coal

# 清空熔炉
node scripts/smelt.js --connection-id <id> --action clear --furnace-position "100,64,200"
```

### 5. 容器操作

```bash
# 查看容器内容
node scripts/chest.js --connection-id <id> --action list --position "100,64,200"

# 存入物品
node scripts/chest.js --connection-id <id> --action store --position "100,64,200" --item diamond --amount 16

# 取回物品
node scripts/chest.js --connection-id <id> --action withdraw --position "100,64,200" --item iron_ingot --amount 32
```

### 6. 自动化任务

```bash
# 导航到位置
node scripts/auto.js --task goto --connection-id <id> --position "100,64,200"

# 收集物品
node scripts/auto.js --task collect --connection-id <id> --item-type diamond --radius 32

# 自动睡觉
node scripts/sleep.js --connection-id <id>

# 农业
node scripts/farm.js --connection-id <id> --farm-action till --position "100,64,200"
```

### 7. 查询与监控

```bash
# 查询可合成物品
node scripts/interact.js --action query --connection-id <id> --query-action craftable

# 生成合成计划
node scripts/interact.js --action query --connection-id <id> --query-action crafting_plan --item diamond_pickaxe

# 查询附近方块/实体
node scripts/interact.js --action query --connection-id <id> --query-action nearby_blocks --range 16
node scripts/interact.js --action query --connection-id <id> --query-action nearby_entities --range 16

# 监控环境
node scripts/monitor.js --type entities --connection-id <id> --radius 50
node scripts/monitor.js --type blocks --connection-id <id> --radius 10
```

### 8. 状态与视觉

```bash
# 获取机器人状态
node scripts/status.js --connection-id <id>

# 截图
node scripts/vision.js --connection-id <id>
```

### 9. 断开连接

```bash
node scripts/disconnect.js --connection-id <id>
```

## 支持的操作类型

| 操作 | 描述 |
|------|------|
| `move` | 朝指定方向移动 (forward/backward/left/right) |
| `jump` | 跳跃 |
| `chat` | 发送聊天消息 |
| `break` | 破坏指定位置的方块 |
| `place` | 在指定位置放置方块 |
| `attack` | 按名称或 UUID 攻击实体 |
| `equip` | 将物品装备到指定位置 |
| `drop` | 丢弃物品（支持白名单） |
| `look` | 看向位置或设置俯仰角/偏航角 |
| `eat` | 进食 |
| `sleep` | 在指定位置的床上睡觉 |
| `wake` | 从床上醒来 |
| `fish` | 开始钓鱼 |
| `boat` | 进入/离开船 |
| `minecart` | 进入/离开矿车 |
| `block` | 启用/禁用盾牌格挡 |
| `goto` | 导航到位置 |
| `collect` | 收集指定类型的物品 |
| `swim` | 开始/停止游泳 |
| `craft` | 合成物品 |
| `smelt` | 熔炼物品 |
| `chest` | 容器操作 |
| `query` | 查询信息 |
| `status` | 获取机器人状态 |
| `vision` | 截图 |
| `events` | 事件订阅 |
| `trade` | 村民交易 |
| `farm` | 农业操作 |
| `build` | 蓝图建造 |
| `sleep-auto` | 自动寻找床睡觉 |
| `multi` | 多机器人协作 |

## 观测平台事件

| 事件类型 | 描述 |
|----------|------|
| `connected` | 机器人连接到服务器 |
| `disconnected` | 机器人断开连接 |
| `moved` | 机器人移动或导航 |
| `jumped` | 机器人跳跃 |
| `attacked` | 机器人攻击 |
| `damaged` | 机器人受伤 |
| `died` | 机器人死亡 |
| `chat_sent` | 发送聊天消息 |
| `chat_received` | 收到聊天消息 |
| `block_broken` | 方块被破坏 |
| `block_placed` | 方块被放置 |
| `item_picked_up` | 拾取物品 |
| `item_dropped` | 丢弃物品 |
| `item_used` | 使用物品 |
| `inventory_changed` | 背包变更 |
| `world_changed` | 世界改变（维度） |
| `respawned` | 机器人重生 |
| `item_crafted` | 物品已合成 |
| `item_smelted` | 物品已熔炼 |
| `chest_opened` | 容器已打开 |
| `item_deposited` | 物品已存入 |
| `item_withdrawn` | 物品已取出 |

## 项目结构

```
minecraft-client/
├── README.md                           # 英文说明文档
├── README.zh.md                        # 中文说明文档
├── README.ja.md                        # 日文说明文档
├── README.ko.md                        # 韩文说明文档
├── README.es.md                        # 西班牙语说明文档
├── README.fr.md                        # 法语说明文档
├── README.de.md                        # 德语说明文档
├── README.pt.md                        # 葡萄牙语说明文档
├── README.ru.md                        # 俄语说明文档
├── README.ar.md                        # 阿拉伯语说明文档
├── SKILL.md                            # Skill 定义
├── package.json                        # Node.js 依赖
├── scripts/
│   ├── connect.js                      # 主连接脚本
│   ├── interact.js                     # 交互命令脚本
│   ├── disconnect.js                   # 断开连接脚本
│   ├── status.js                       # 状态查询脚本
│   ├── vision.js                       # 截图脚本
│   ├── inventory.js                    # 背包管理
│   ├── craft.js                        # 合成系统
│   ├── smelt.js                        # 熔炼系统
│   ├── chest.js                        # 容器操作
│   ├── sleep.js                        # 睡觉/醒来系统
│   ├── auto.js                         # 自动化任务
│   ├── farm.js                         # 农业系统
│   ├── build.js                        # 蓝图建造
│   ├── monitor.js                      # 环境监控
│   ├── query.js                        # 查询系统
│   ├── trade.js                        # 村民交易
│   ├── events.js                       # 事件订阅
│   ├── wiki.js                         # Wiki 查询
│   └── multi.js                        # 多机器人协作
└── references/
    └── observer-platform-protocol.md    # 观测平台协议
```

## 依赖

- **mineflayer** (^4.37.0) - Minecraft 机器人框架
- **mineflayer-pathfinder** (^2.4.5) - 路径导航
- **mineflayer-web** (^0.1.0) - Web 界面
- **prismarine-viewer** (^1.6.0) - 视觉调试
- **ws** (^8.20.0) - WebSocket 客户端
- **vec3** (^0.3.24) - 向量数学工具

## 开源许可

MIT

## 贡献

欢迎贡献！请随时提交 Issue 和 Pull Request。
