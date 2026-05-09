---
name: minecraft-client
description: 连接任意Minecraft服务器并执行移动、战斗、物品管理、合成、熔炼、箱子存取、交易、种地、建造、视觉截图等完整操作，集成观测平台自动上报Agent状态和事件；当用户需要自动化游戏测试、机器人控制、服务器管理或远程观测Agent行为时使用
dependency:
  system:
    - node -v
    - npm install
---

# Minecraft客户端连接与交互

## 任务目标
- 本Skill用于：通过脚本连接任意Minecraft服务器，实现全面的自动化游戏操作
- 能力包含：服务器连接、移动控制、战斗系统、物品管理、合成系统、熔炼系统、箱子存取、方块交互、聊天通信、环境监控、自动化任务、查询与计划
- 触发条件：用户需要自动化测试Minecraft服务器、创建游戏机器人、远程管理服务器或执行重复性游戏任务时
- **使用前准备**：用户需提供目标Minecraft服务器的地址、端口和机器人用户名信息

## 前置准备
- 依赖安装：首次使用需运行 `npm install` 安装依赖包（mineflayer、mineflayer-pathfinder、ws、vec3）
- 系统要求：需要Node.js环境
- **服务器信息**（使用前需询问用户）：
  - 服务器地址（host）：必需，如 `mc.example.com` 或 `192.168.1.100`
  - 服务器端口（port）：可选，默认25565
  - 机器人用户名（username）：必需，符合Minecraft用户名规则
  - 认证方式（auth）：可选，默认offline（离线模式），正版服务器需使用microsoft
  - 密码（password）：可选，仅microsoft认证时需要

### 服务器类型分类
本Skill支持连接四种类型的Minecraft服务器：

1. **本地服务器（Localhost）**
   - 地址：`127.0.0.1` 或 `localhost`
   - 端口：默认25565
   - 认证：offline（默认）
   - 用途：开发测试、个人体验

2. **私服（Private Servers）**
   - 地址：自定义域名或IP地址
   - 端口：自定义（默认25565）
   - 认证：offline或microsoft（根据服务器配置）
   - 用途：自己部署的服务器、他人部署的私服

3. **公共服务器（Public Servers）**
   - 地址：公共服务器域名
   - 端口：默认25565
   - 认证：microsoft（通常需要正版账号）
   - 用途：大型社区服务器、第三方运营服务器

4. **官方服务器（Realms）**
   - 地址：Realms服务器地址
   - 端口：25565
   - 认证：microsoft（必需，需订阅Realms）
   - 用途：微软官方托管的服务器

### 观测平台集成（可选）
本Skill支持连接到观测平台，自动上报Agent状态和操作事件。

**配置方式**（任选一种）：

1. **环境变量配置**：
   ```bash
   export OBSERVER_WS_URL="wss://bcebb916-73c2-4790-9efa-20b86711bb5c.dev.coze.site/ws/agent"
   export OBSERVER_TOKEN="your-token-optional"
   ```

2. **命令行参数**：
   ```bash
   node scripts/connect.js --host mc.example.com --username Bot \
     --observer-ws "wss://bcebb916-73c2-4790-9efa-20b86711bb5c.dev.coze.site/ws/agent" \
     --observer-token "your-token"
   ```

**自动上报功能**：
- Agent注册：连接后自动注册到观测平台
- 状态更新：连接后立即上报首次状态，之后每30秒自动上报
- 操作事件：所有action执行后自动上报事件；环境事件自动上报
- 世界快照：spawn后3秒发送首次快照，之后每60秒自动上报
- 断开通知：断开前发送`agent:disconnect`消息
- 重连机制：WebSocket断开自动重连（退避策略，最多5次）

**上报的消息类型**（字段统一使用`payload`，匹配观测平台规范）：

1. `agent:register` - Agent注册：`{ type, payload: { agentId, username, serverHost, serverPort } }`
2. `agent:status:update` - 状态更新：`{ type, payload: { agentId, status: { id, username, connected, position, health, maxHealth, food, saturation, gamemode, inventory[], equipment{}, world, dimension, yaw, pitch, isOnGround, isSleeping, isSprinting, isSneaking, lastUpdated } } }`
3. `agent:world:snapshot` - 世界快照：`{ type, payload: { agentId, snapshot: { blocks[], entities[], timestamp } } }`
4. `agent:event` - 事件上报：`{ type, payload: { agentId, event: { type, description, data } } }`，支持事件类型：connected, disconnected, moved, jumped, attacked, damaged, died, chat_sent, chat_received, block_broken, block_placed, item_picked_up, item_dropped, item_used, inventory_changed, world_changed, respawned, item_crafted, item_smelted, chest_opened, item_deposited, item_withdrawn
5. `agent:disconnect` - 断开通知：`{ type, payload: { agentId, reason } }`

## 操作步骤

### 标准流程

1. **连接服务器** — connect.js
   - 必需信息：服务器地址（host）、端口（port，默认25565）、用户名（username）
   - 可选参数：认证方式（auth，默认offline）、密码、观测平台配置
   ```bash
   node scripts/connect.js --host mc.example.com --port 25565 --username BotName --auth offline
   ```

2. **执行基础交互** — interact.js
   - 移动/跳跃/聊天/破坏/放置/攻击/装备/丢弃/进食/睡觉/醒来/钓鱼/船只/盾牌等
   ```bash
   node scripts/interact.js --action move --connection-id <id> --direction forward
   node scripts/interact.js --action chat --connection-id <id> --message "Hello!"
   node scripts/interact.js --action break --connection-id <id> --position "10,64,10"
   # 船只操作
   node scripts/interact.js --action boat --connection-id <id> --boat-action enter
   node scripts/interact.js --action boat --connection-id <id> --boat-action exit
   # 盾牌格挡
   node scripts/interact.js --action block --connection-id <id> --block-action enable
   node scripts/interact.js --action block --connection-id <id> --block-action disable
   # 丢弃物品（含白名单保护）
   node scripts/interact.js --action drop --connection-id <id> --item diamond --count 5
   node scripts/interact.js --action drop --connection-id <id> --whitelist-action add --item diamond
   node scripts/interact.js --action drop --connection-id <id> --whitelist-action remove --item diamond
   node scripts/interact.js --action drop --connection-id <id> --whitelist-action list
   ```

3. **合成物品** — craft.js
   - 在背包或工作台旁执行合成操作；支持自动装备护甲
   ```bash
   # 背包合成（2x2配方）
   node scripts/craft.js --connection-id <id> --item stick --amount 4

   # 工作台合成（3x3配方）
   node scripts/craft.js --connection-id <id> --item diamond_pickaxe --use-workbench true

   # 合成护甲并自动装备（自动装备盾牌/弓/鞘翅等）
   node scripts/craft.js --connection-id <id> --item diamond_helmet --auto-equip
   node scripts/craft.js --connection-id <id> --item shield --auto-equip
   ```

4. **熔炼物品** — smelt.js
   - 在熔炉中熔炼原材料；支持清空熔炉（取出所有物品）
   ```bash
   node scripts/smelt.js --connection-id <id> --item iron_ore --amount 10 --fuel coal

   # 清空熔炉（取出所有输入/燃料/输出物品）
   node scripts/smelt.js --connection-id <id> --action clear --furnace-position "100,64,200"
   ```

5. **箱子存取** — chest.js
   - 与箱子/熔炉/漏斗/投掷器/发射器等容器交互：查看、存入、取出
   ```bash
   node scripts/chest.js --connection-id <id> --action list --position "100,64,200"
   node scripts/chest.js --connection-id <id> --action store --position "100,64,200" --item diamond --amount 16
   node scripts/chest.js --connection-id <id> --action withdraw --position "100,64,200" --item iron_ingot --amount 32
   # 支持容器类型：chest, trapped_chest, hopper, dropper, dispenser, barrel, furnace, blast_furnace, smoker
   ```

6. **自动寻床睡觉** — sleep.js
   - 自动寻找附近床铺并睡觉
   ```bash
   node scripts/sleep.js --connection-id <id>
   ```

7. **物品管理** — inventory.js
   ```bash
   node scripts/inventory.js --action list --connection-id <id>
   node scripts/inventory.js --action move --connection-id <id> --source-slot 0 --dest-slot 8
   ```

8. **查询与计划** — query.js（通过interact.js action=query）
   - 查询可合成物品、生成合成计划、查询附近方块/实体
   ```bash
   # 查询可合成物品
   node scripts/interact.js --action query --connection-id <id> --query-action craftable

   # 生成合成计划
   node scripts/interact.js --action query --connection-id <id> --query-action crafting_plan --item diamond_pickaxe

   # 查询附近方块
   node scripts/interact.js --action query --connection-id <id> --query-action nearby_blocks --range 16

   # 查询附近实体
   node scripts/interact.js --action query --connection-id <id> --query-action nearby_entities --range 16
   ```

9. **环境监控** — monitor.js
   ```bash
   node scripts/monitor.js --type entities --connection-id <id> --radius 50
   node scripts/monitor.js --type blocks --connection-id <id> --radius 10
   ```

10. **自动化任务** — auto.js（支持寻路、收集、游泳）
    ```bash
    node scripts/auto.js --task goto --connection-id <id> --position "100,64,200"
    node scripts/auto.js --task collect --connection-id <id> --item-type diamond --radius 32
    node scripts/auto.js --task swim --connection-id <id> --swim-action start
    node scripts/auto.js --task swim --connection-id <id> --swim-action stop
    ```

11. **查询状态** — status.js
    ```bash
    node scripts/status.js --connection-id <id>
    ```

12. **断开连接** — disconnect.js
    ```bash
    node scripts/disconnect.js --connection-id <id>
    ```

### 可选分支

- **正版认证**：当需要连接正版服务器时，添加 `--auth microsoft --password <password>`
- **批量操作**：保持连接ID不变，连续调用脚本；操作间可调用status.js或monitor.js验证中间状态
- **游泳模式**：在水中使用 `auto.js --task swim` 开始/停止游泳

## 使用示例

- 示例1：基础连接与交互
  - 场景/输入：连接服务器并执行基本操作
  - 预期产出：机器人连接并执行移动、方块操作、聊天
  - 关键要点：
    ```bash
    node scripts/connect.js --host <服务器地址> --port <端口> --username <用户名> --auth offline
    node scripts/interact.js --action move --connection-id <id> --direction forward
    node scripts/interact.js --action chat --connection-id <id> --message "Hello!"
    node scripts/disconnect.js --connection-id <id>
    ```

- 示例2：合成与熔炼
  - 场景/输入：从原材料到成品的完整加工流程
  - 预期产出：合成工具并熔炼矿石
  - 关键要点：
    ```bash
    # 合成木棍（背包2x2配方）
    node scripts/craft.js --connection-id <id> --item stick --amount 4

    # 合成钻石镐（需工作台）
    node scripts/craft.js --connection-id <id> --item diamond_pickaxe --use-workbench true

    # 熔炼铁矿石
    node scripts/smelt.js --connection-id <id> --item iron_ore --amount 10 --fuel coal
    ```

- 示例3：箱子存取与物品管理
  - 场景/输入：将贵重物品存入箱子，取出需要的材料
  - 预期产出：物品正确存取
  - 关键要点：
    ```bash
    node scripts/chest.js --connection-id <id> --action list --position "100,64,200"
    node scripts/chest.js --connection-id <id> --action store --position "100,64,200" --item diamond --amount 16
    node scripts/chest.js --connection-id <id> --action withdraw --position "100,64,200" --item iron_ingot --amount 32
    ```

- 示例4：观测平台集成
  - 场景/输入：Agent自动上报状态到观测平台
  - 预期产出：Agent连接后自动注册并定期上报状态和事件
  - 关键要点：
    ```bash
    node scripts/connect.js --host localhost --port 25565 --username ObservedBot --auth offline \
      --observer-ws "wss://bcebb916-73c2-4790-9efa-20b86711bb5c.dev.coze.site/ws/agent"
    # Agent自动上报：register、status:update、event、world:snapshot、disconnect
    ```

- 示例5：查询与合成计划
  - 场景/输入：查询可合成物品并生成合成计划
  - 预期产出：列出可合成物品和所需材料
  - 关键要点：
    ```bash
    node scripts/interact.js --action query --connection-id <id> --query-action craftable
    node scripts/interact.js --action query --connection-id <id> --query-action crafting_plan --item diamond_pickaxe
    node scripts/interact.js --action query --connection-id <id> --query-action nearby_blocks --range 16
    ```

## 资源索引

- 脚本:见 [scripts/connect.js](scripts/connect.js)(用途:连接MC服务器，加载pathfinder，建立持久连接，集成观测平台，处理所有action命令，含boat/minecart/block/drop白名单)
- 脚本:见 [scripts/interact.js](scripts/interact.js)(用途:执行游戏交互操作，支持20+种action类型：move/use/break/place/chat/jump/equip/attack/drop/look/eat/sleep/wake/fish/boat/minecart/block，含whitelist管理)
- 脚本:见 [scripts/query.js](scripts/query.js)(用途:独立查询工具，craftable/crafting_plan/nearby_blocks/nearby_entities)
- 脚本:见 [scripts/craft.js](scripts/craft.js)(用途:合成物品，支持背包和工作台，自动分析材料缺口；支持--auto-equip自动装备护甲/盾牌/弓等)
- 脚本:见 [scripts/smelt.js](scripts/smelt.js)(用途:熔炼物品，自动寻找附近熔炉，支持自定义燃料；支持--action clear清空熔炉所有物品)
- 脚本:见 [scripts/chest.js](scripts/chest.js)(用途:容器存取，store/withdraw/list操作；支持chest/trapped_chest/hopper/dropper/dispenser/barrel/furnace/blast_furnace/smoker)
- 脚本:见 [scripts/sleep.js](scripts/sleep.js)(用途:自动寻找并躺在床铺上，支持唤醒)
- 脚本:见 [scripts/inventory.js](scripts/inventory.js)(用途:管理物品栏，支持查看和移动物品，含装备管理)
- 脚本:见 [scripts/monitor.js](scripts/monitor.js)(用途:监控环境，查询实体、方块、聊天记录)
- 脚本:见 [scripts/auto.js](scripts/auto.js)(用途:自动化任务：寻路goto/收集collect/游泳swim)
- 脚本:见 [scripts/status.js](scripts/status.js)(用途:查询玩家当前状态，含坐标/生命/饥饿/装备)
- 脚本:见 [scripts/disconnect.js](scripts/disconnect.js)(用途:断开与服务器的连接)
- 脚本:见 [scripts/farm.js](scripts/farm.js)(用途:农业系统，till/plant/harvest，自动耕地种植收割)
- 脚本:见 [scripts/trade.js](scripts/trade.js)(用途:村民交易，list/trade操作，显示交易选项)
- 脚本:见 [scripts/vision.js](scripts/vision.js)(用途:视觉截图，capture当前视角，含场景信息biome/time/weather)
- 脚本:见 [scripts/build.js](scripts/build.js)(用途:编程式建造，解析蓝图分层放置方块，支持进度上报)
- 脚本:见 [scripts/events.js](scripts/events.js)(用途:行为钩子，订阅游戏事件并通过Socket回调)
- 脚本:见 [scripts/multi.js](scripts/multi.js)(用途:多Bot管理，team创建/邀请/任务分配)
- 脚本:见 [scripts/wiki.js](scripts/wiki.js)(用途:Minecraft Wiki查询，search/get/recipe)
- 配置:见 [package.json](package.json)(依赖:mineflayer、mineflayer-pathfinder、mineflayer-web、prismarine-viewer、ws、vec3)
- 参考:见 [references/observer-platform-protocol.md](references/observer-platform-protocol.md)(用途:观测平台开发者参考，包含全部消息类型的完整payload示例、字段说明及展示建议)

## 注意事项

- **连接管理**：每次连接会生成唯一connection-id，务必妥善保存；未断开的连接会占用资源
- **安全机制**：仅支持客户端模式，无法获取服务器控制台权限；所有操作以玩家身份执行
- **合成系统**：背包合成支持2x2配方；3x3配方需使用`--use-workbench true`并在工作台附近执行
- **熔炼系统**：需在熔炉附近执行，系统自动寻找5格内熔炉；燃料默认coal，可指定其他燃料
- **箱子操作**：需指定箱子精确位置（x,y,z）；store/withdraw操作需指定物品名称
- **自动睡觉**：自动搜索10格内的床，仅夜间或雷雨天可用
- **游泳功能**：在水中使用swim start开启自动上浮；上岸后使用swim stop
- **船只/矿车**：使用boat enter/exit进入或离开船只/矿车；minecart为别名
- **盾牌格挡**：使用block enable装备盾牌并启用格挡；block disable停止格挡
- **丢弃白名单**：重要物品（如装备、贵重物品）可加入白名单防止误删；使用whitelist:add/remove/list管理
- **自动装备**：合成护甲/盾牌/弓等后，使用--auto-equip参数自动装备到对应槽位
- **容器类型**：支持多种容器（chest/hopper/dropper/dispenser/barrel/furnace），系统自动识别并使用对应API
- **清空熔炉**：使用--action clear参数可一次性取出熔炉内所有输入/燃料/输出物品
- **查询功能**：craftable列出当前可合成物品；crafting_plan分析材料缺口；nearby_blocks/entities查询周围环境
- **错误处理**：所有脚本返回标准JSON格式，包含success/error/suggestions字段，结构化错误码便于Agent判断
- **坐标格式**：position参数使用"x,y,z"格式，坐标为整数
- **方向参数**：支持forward、backward、left、right四个方向
- **观测平台**：开发环境域名`bcebb916-73c2-4790-9efa-20b86711bb5c.dev.coze.site`，生产环境`sn4p3txnjz.coze.site`
