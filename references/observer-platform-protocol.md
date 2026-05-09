# Minecraft Client Skill — 观测平台消息协议参考

版本：v1.0
日期：2026-04-29
面向：观测平台开发者

---

## 概述

Minecraft Client Skill 通过 WebSocket 与观测平台通信。Agent 连接端点：

- **开发环境：** `wss://bcebb916-73c2-4790-9efa-20b86711bb5c.dev.coze.site/ws/agent`
- **生产环境：** `wss://sn4p3txnjz.coze.site/ws/agent`

消息统一使用 JSON 格式，Agent 发送消息以 `agent:` 开头，平台回复以 `server:` 或 `agent:` 开头。

---

## 一、Agent 注册与断开

### 1.1 agent:register — Agent 注册

**触发时机：** Bot 成功连接到 Minecraft 服务器并完成观测平台配置后

**Agent 发送：**
```json
{
  "type": "agent:register",
  "payload": {
    "agentId": "minecraft-agent-a3c40a9f",
    "username": "Bot01",
    "serverHost": "127.0.0.1",
    "serverPort": 25565
  }
}
```

**字段说明：**
| 字段 | 类型 | 说明 |
|------|------|------|
| agentId | string | Agent 唯一标识，格式 `minecraft-agent-{connectionId}`，connectionId 为 8 位随机字符串 |
| username | string | Minecraft 游戏内用户名 |
| serverHost | string | Minecraft 服务器地址 |
| serverPort | number | Minecraft 服务器端口 |

**平台响应：**
```json
{
  "type": "agent:register:ack",
  "payload": {
    "agentId": "minecraft-agent-a3c40a9f",
    "success": true
  }
}
```

---

### 1.2 agent:disconnect — Agent 断开

**触发时机：** Bot 主动断开连接（调用 disconnect 命令）时，在关闭 WebSocket 前发送

**Agent 发送：**
```json
{
  "type": "agent:disconnect",
  "payload": {
    "agentId": "minecraft-agent-a3c40a9f",
    "reason": "Bot disconnecting"
  }
}
```

**字段说明：**
| 字段 | 类型 | 说明 |
|------|------|------|
| agentId | string | Agent 唯一标识 |
| reason | string | 断开原因描述 |

---

## 二、状态更新

### 2.1 agent:status:update — 玩家状态上报

**触发时机：** Bot 连接后立即发送首次，之后每 **30 秒** 自动发送一次

**Agent 发送：**
```json
{
  "type": "agent:status:update",
  "payload": {
    "agentId": "minecraft-agent-a3c40a9f",
    "status": {
      "id": "minecraft-agent-a3c40a9f",
      "username": "Bot01",
      "connected": true,
      "position": { "x": 128, "y": 64, "z": -256 },
      "health": 20,
      "maxHealth": 20,
      "food": 20,
      "saturation": 5.0,
      "gamemode": "survival",
      "inventory": [
        {
          "slot": 0,
          "name": "minecraft:diamond_sword",
          "displayName": "钻石剑",
          "count": 1
        },
        {
          "slot": 1,
          "name": "minecraft:oak_planks",
          "displayName": "橡木木板",
          "count": 64
        },
        {
          "slot": 2,
          "name": "minecraft:stick",
          "displayName": "木棍",
          "count": 16
        },
        {
          "slot": 8,
          "name": "minecraft:torch",
          "displayName": "火把",
          "count": 32
        }
      ],
      "equipment": {
        "head": null,
        "chest": {
          "slot": -2,
          "name": "minecraft:diamond_chestplate",
          "displayName": "钻石胸甲",
          "count": 1
        },
        "legs": null,
        "feet": null,
        "mainhand": {
          "slot": 0,
          "name": "minecraft:diamond_sword",
          "displayName": "钻石剑",
          "count": 1
        },
        "offhand": null
      },
      "world": "127.0.0.1",
      "dimension": "overworld",
      "yaw": 90.5,
      "pitch": -5.2,
      "isOnGround": true,
      "isSleeping": false,
      "isSprinting": false,
      "isSneaking": false,
      "lastUpdated": 1745943725000
    }
  }
}
```

**字段说明：**
| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 同 agentId |
| username | string | 游戏用户名 |
| connected | boolean | 是否在线 |
| position | object | 当前位置坐标 |
| position.x/y/z | number | 三维坐标 |
| health | number | 当前生命值 |
| maxHealth | number | 最大生命值 |
| food | number | 饥饿值 (0-20) |
| saturation | number | 饱和度 |
| gamemode | string | 游戏模式: survival/creative/adventure/spectator |
| inventory | array | 背包物品列表，空时为 `[]` |
| inventory[].slot | number | 物品所在格子 (0-8 为主手, -1~8 为装备栏) |
| inventory[].name | string | 物品 ID，带命名空间 |
| inventory[].displayName | string | 物品中文名 |
| inventory[].count | number | 物品数量 |
| equipment | object | 装备槽位 |
| equipment.head/chest/legs/feet | object/null | 头/胸/腿/脚装备 |
| equipment.mainhand/offhand | object/null | 主手/副手物品 |
| world | string | 服务器地址 |
| dimension | string | 维度: overworld/nether/the_end |
| yaw | number | 水平旋转角度 (度) |
| pitch | number | 垂直旋转角度 (度) |
| isOnGround | boolean | 是否在地面上 |
| isSleeping | boolean | 是否在睡觉 |
| isSprinting | boolean | 是否在疾跑 |
| isSneaking | boolean | 是否在下蹲 |
| lastUpdated | number | Unix 时间戳 (毫秒) |

**平台建议展示：**
- 玩家卡片：头像区显示坐标 + 生命值条 + 饥饿值条
- 背包 UI：9 格快捷栏 + 27 格主背包，按 slot 排序
- 装备面板：5 个装备槽位可视化（头盔/胸甲/护腿/靴子/主手）
- 状态栏：维度图标 + 游戏模式标签 + 运动状态图标

---

## 三、世界快照

### 3.1 agent:world:snapshot — 周围世界数据

**触发时机：** Bot spawn 后 **3 秒** 发送首次，之后每 **60 秒** 自动发送

**Agent 发送：**
```json
{
  "type": "agent:world:snapshot",
  "payload": {
    "agentId": "minecraft-agent-a3c40a9f",
    "snapshot": {
      "blocks": [
        {
          "position": { "x": 128, "y": 63, "z": -255 },
          "type": "grass_block",
          "name": "草方块",
          "light": 15
        },
        {
          "position": { "x": 130, "y": 64, "z": -255 },
          "type": "oak_log",
          "name": "橡木原木",
          "light": 14
        },
        {
          "position": { "x": 131, "y": 63, "z": -256 },
          "type": "diamond_ore",
          "name": "钻石矿石",
          "light": 0
        },
        {
          "position": { "x": 128, "y": 62, "z": -256 },
          "type": "stone",
          "name": "石头",
          "light": 0
        }
      ],
      "entities": [
        {
          "id": 101,
          "type": "pig",
          "name": "Pig",
          "position": { "x": 135, "y": 64, "z": -260 },
          "distance": 8.5
        },
        {
          "id": 102,
          "type": "zombie",
          "name": "Zombie",
          "position": { "x": 120, "y": 64, "z": -250 },
          "distance": 12.3
        }
      ],
      "timestamp": 1745943725000
    }
  }
}
```

**字段说明：**
| 字段 | 类型 | 说明 |
|------|------|------|
| blocks | array | 扫描范围内的方块列表 |
| blocks[].position | object | 方块坐标 |
| blocks[].type | string | 方块类型 ID |
| blocks[].name | string | 方块中文名 |
| blocks[].light | number | 光照等级 (0-15) |
| entities | array | 可见实体列表 |
| entities[].id | number | 实体唯一 ID |
| entities[].type | string | 实体类型 |
| entities[].name | string | 实体显示名 |
| entities[].position | object | 实体位置 |
| entities[].distance | number | 到 Bot 的距离 |
| timestamp | number | Unix 时间戳 (毫秒) |

**扫描范围说明：**
- 默认扫描以 Bot 为中心，半径 3 格范围内
- 扫描 Y 范围：地面以下 2 层到地面以上 2 层
- 实体扫描半径 16 格

**平台建议展示：**
- 小地图：2D 俯视图，方块按类型着色
- 实体标记：在地图对应位置显示实体图标
- 点击实体可查看详情（类型、距离）
- 支持快照时序回放

---

## 四、事件上报

### 4.1 agent:event — 操作/环境/系统事件

**触发时机：** 各种操作完成或环境变化时

**Agent 发送（通用格式）：**
```json
{
  "type": "agent:event",
  "payload": {
    "agentId": "minecraft-agent-a3c40a9f",
    "event": {
      "type": "moved",
      "description": "移动到 (130, 64, -252)",
      "data": {
        "from": { "x": 128, "y": 64, "z": -256 },
        "to": { "x": 130, "y": 64, "z": -252 },
        "distance": 4.47
      }
    }
  }
}
```

---

### 4.2 支持的全部事件类型

#### A. 玩家操作事件

| event.type | description 示例 | data 字段 |
|-----------|-----------------|----------|
| `connected` | "Bot 已连接到服务器" | `{ host, port, version }` |
| `disconnected` | "Bot 已断开连接" | `{ reason }` |
| `chat_sent` | "发送聊天: hello" | `{ message }` |
| `chat_received` | "收到聊天: [Steve] hi" | `{ sender, message }` |

**示例（chat_sent）：**
```json
{
  "type": "agent:event",
  "payload": {
    "agentId": "minecraft-agent-a3c40a9f",
    "event": {
      "type": "chat_sent",
      "description": "发送聊天: hello_world",
      "data": {
        "message": "hello_world"
      }
    }
  }
}
```

#### B. 移动与状态事件

| event.type | description 示例 | data 字段 |
|-----------|-----------------|----------|
| `moved` | "移动到 (130, 64, -252)" | `{ from, to, distance }` |
| `jumped` | "跳跃了" | `{ position }` |
| `respawned` | "在 (128, 64, -256) 重生" | `{ position }` |

**示例（moved）：**
```json
{
  "event": {
    "type": "moved",
    "description": "移动到 (130, 64, -252)",
    "data": {
      "from": { "x": 128, "y": 64, "z": -256 },
      "to": { "x": 130, "y": 64, "z": -252 },
      "distance": 4.47
    }
  }
}
```

#### C. 战斗事件

| event.type | description 示例 | data 字段 |
|-----------|-----------------|----------|
| `attacked` | "攻击了 Zombie" | `{ target, damage, weapon }` |
| `damaged` | "受到 4 点伤害 (Zombie)" | `{ from, amount, currentHealth }` |
| `died` | "被 Zombie 杀死了" | `{ cause, position }` |

**示例（attacked）：**
```json
{
  "event": {
    "type": "attacked",
    "description": "攻击了 Zombie (距离 3.2)",
    "data": {
      "target": "zombie",
      "targetName": "Zombie",
      "damage": 3,
      "weapon": "minecraft:diamond_sword",
      "healthLeft": 15,
      "position": { "x": 125, "y": 64, "z": -253 }
    }
  }
}
```

#### D. 方块交互事件

| event.type | description 示例 | data 字段 |
|-----------|-----------------|----------|
| `block_broken` | "破坏了 钻石矿石" | `{ blockType, position, tool }` |
| `block_placed` | "放置了 圆石" | `{ blockType, position }` |
| `world_changed` | "维度切换: overworld → nether" | `{ from, to }` |

**示例（block_broken）：**
```json
{
  "event": {
    "type": "block_broken",
    "description": "破坏了 钻石矿石",
    "data": {
      "blockType": "diamond_ore",
      "displayName": "钻石矿石",
      "position": { "x": 131, "y": 63, "z": -256 },
      "tool": "minecraft:diamond_pickaxe",
      "drops": [
        { "name": "minecraft:diamond", "count": 2 }
      ]
    }
  }
}
```

#### E. 物品事件

| event.type | description 示例 | data 字段 |
|-----------|-----------------|----------|
| `item_picked_up` | "拾取了 钻石 x2" | `{ item, count, position }` |
| `item_dropped` | "丢弃了 圆石 x10" | `{ item, count }` |
| `item_used` | "使用了 面包" | `{ item, remaining }` |

**示例（item_picked_up）：**
```json
{
  "event": {
    "type": "item_picked_up",
    "description": "拾取了 钻石 x3",
    "data": {
      "item": "minecraft:diamond",
      "displayName": "钻石",
      "count": 3,
      "position": { "x": 132, "y": 64, "z": -258 }
    }
  }
}
```

#### F. 背包事件

| event.type | description 示例 | data 字段 |
|-----------|-----------------|----------|
| `inventory_changed` | "背包已更新" | `{ changes, slots }` |

#### G. 合成事件

| event.type | description 示例 | data 字段 |
|-----------|-----------------|----------|
| `item_crafted` | "合成了 1 个 钻石镐" | `{ item, count, materials, location }` |

**示例（item_crafted）：**
```json
{
  "event": {
    "type": "item_crafted",
    "description": "合成了 1 个 钻石镐",
    "data": {
      "item": "minecraft:diamond_pickaxe",
      "displayName": "钻石镐",
      "count": 1,
      "materials": [
        { "name": "diamond", "required": 3, "used": 3 },
        { "name": "stick", "required": 2, "used": 2 }
      ],
      "craftingLocation": "inventory"
    }
  }
}
```

#### H. 熔炼事件

| event.type | description 示例 | data 字段 |
|-----------|-----------------|----------|
| `item_smelted` | "熔炼了 10 个 铁矿石" | `{ input, output, count, furnace }` |

**示例（item_smelted）：**
```json
{
  "event": {
    "type": "item_smelted",
    "description": "熔炼了 10 个 铁矿石",
    "data": {
      "inputItem": "minecraft:iron_ore",
      "inputDisplayName": "铁矿石",
      "outputItem": "minecraft:iron_ingot",
      "outputDisplayName": "铁锭",
      "count": 10,
      "fuelConsumed": 5,
      "furnacePosition": { "x": 120, "y": 64, "z": -260 }
    }
  }
}
```

#### I. 箱子事件

| event.type | description 示例 | data 字段 |
|-----------|-----------------|----------|
| `chest_opened` | "打开了箱子" | `{ position, chestType, slots }` |
| `item_deposited` | "存入了 16 个 钻石" | `{ item, count, position }` |
| `item_withdrawn` | "取出了 5 个 铁锭" | `{ item, count, position }` |

**示例（item_deposited）：**
```json
{
  "event": {
    "type": "item_deposited",
    "description": "存入了 16 个 钻石",
    "data": {
      "item": "minecraft:diamond",
      "displayName": "钻石",
      "count": 16,
      "position": { "x": 100, "y": 64, "z": 200 }
    }
  }
}
```

#### J. 农业事件

| event.type | description 示例 | data 字段 |
|-----------|-----------------|----------|
| `land_tilled` | "耕作了 9 块地" | `{ blocksTilled, area, radius }` |
| `crop_planted` | "种植了 9 棵 小麦" | `{ crop, count, area }` |
| `crop_harvested` | "收割了 45 个 小麦" | `{ crops, area, radius }` |

**示例（crop_harvested）：**
```json
{
  "event": {
    "type": "crop_harvested",
    "description": "收割了 45 个 小麦和 12 个 种子",
    "data": {
      "crops": {
        "wheat": 45,
        "seeds": 12
      },
      "area": { "x": 100, "z": 200 },
      "radius": 3,
      "blocksHarvested": 9
    }
  }
}
```

#### K. 睡眠事件

| event.type | description 示例 | data 字段 |
|-----------|-----------------|----------|
| `sleep_started` | "开始睡觉" | `{ bedPosition }` |
| `sleep_completed` | "睡眠完成，已是白天" | `{ skippedNight }` |

#### L. 建造事件

| event.type | description 示例 | data 字段 |
|-----------|-----------------|----------|
| `build_started` | "开始建造: simple_house" | `{ buildId, blueprint, totalBlocks }` |
| `build_progress` | "建造进度: 65%" | 见 4.3 节 |
| `build_completed` | "完成建造 simple_house" | `{ buildId, blocksPlaced, duration }` |
| `build_failed` | "建造失败: 材料不足" | `{ buildId, reason, missingMaterials }` |

**示例（build_completed）：**
```json
{
  "event": {
    "type": "build_completed",
    "description": "完成建造 simple_house，放置了 98 个方块",
    "data": {
      "buildId": "build_abc123",
      "blueprint": "simple_house",
      "blocksPlaced": 98,
      "blocksTotal": 98,
      "durationSeconds": 180,
      "errors": []
    }
  }
}
```

#### M. 交易事件

| event.type | description 示例 | data 字段 |
|-----------|-----------------|----------|
| `trade_opened` | "打开了 图书管理员 交易界面" | `{ profession, level, trades }` |
| `trade_completed` | "完成交易: 绿宝石 x5 → 书架 x1" | `{ input, output, emeraldCost }` |

**示例（trade_completed）：**
```json
{
  "event": {
    "type": "trade_completed",
    "description": "完成交易: 绿宝石 x5 → 书架 x1",
    "data": {
      "villagerId": 1234,
      "profession": "Librarian",
      "tradeIndex": 1,
      "input": "minecraft:emerald x5",
      "output": "minecraft:bookshelf x1",
      "emeraldCost": 5,
      "usesLeft": 10
    }
  }
}
```

---

### 4.3 agent:build:progress — 建造进度（独立消息类型）

**触发时机：** 蓝图建造过程中，每放置约 10% 方块时发送一次

**Agent 发送：**
```json
{
  "type": "agent:build:progress",
  "payload": {
    "agentId": "minecraft-agent-a3c40a9f",
    "build": {
      "buildId": "build_abc123",
      "blueprintName": "simple_house",
      "status": "in_progress",
      "progress": 0.65,
      "currentLayer": 2,
      "totalLayers": 4,
      "blocksPlaced": 64,
      "blocksTotal": 98,
      "materialsUsed": [
        { "material": "minecraft:cobblestone", "displayName": "圆石", "used": 50 },
        { "material": "minecraft:oak_planks", "displayName": "橡木木板", "used": 30 }
      ],
      "startPosition": { "x": 100, "y": 64, "z": 200 },
      "startedAt": 1745943540000,
      "estimatedCompletion": 1745943720000
    }
  }
}
```

**status 字段值：** `in_progress` | `completed` | `failed` | `paused`

**平台建议展示：**
- 进度条：百分比 + 已放置 / 总数
- 当前层指示
- 材料消耗列表
- 预计完成时间

---

## 五、团队协作

### 5.1 agent:team:update — 团队状态上报

**触发时机：** 团队创建/成员加入离开/任务状态变更时

**Agent 发送：**
```json
{
  "type": "agent:team:update",
  "payload": {
    "agentId": "minecraft-agent-a3c40a9f",
    "team": {
      "teamId": "team_mining_001",
      "teamName": "MiningTeam",
      "action": "created",
      "leader": "minecraft-agent-a3c40a9f",
      "members": [
        {
          "agentId": "minecraft-agent-a3c40a9f",
          "username": "Bot01",
          "role": "leader",
          "taskType": "mining",
          "status": "active"
        },
        {
          "agentId": "minecraft-agent-def67890",
          "username": "Bot02",
          "role": "member",
          "taskType": "mining",
          "status": "active"
        }
      ],
      "task": {
        "type": "mining",
        "status": "active",
        "target": { "x": 128, "y": -50, "z": 256 },
        "dimension": "overworld",
        "progress": 0.35,
        "description": "在 (128, -50, 256) 附近挖矿"
      },
      "timestamp": 1745943725000
    }
  }
}
```

**action 字段值：** `created` | `member_joined` | `member_left` | `role_changed` | `task_updated` | `disbanded`

**task.type 字段值：** `mining` | `farming` | `building` | `exploring` | `combat` | `trading`

**平台建议展示：**
- 团队面板：成员列表 + 角色标签
- 任务进度：任务类型 + 目标位置 + 百分比
- 成员状态：在线/离线/忙碌

---

## 六、事件订阅

### 6.1 agent:subscribe — 事件订阅注册

**触发时机：** Agent 调用 `events.js --action subscribe` 时

**Agent 发送：**
```json
{
  "type": "agent:subscribe",
  "payload": {
    "agentId": "minecraft-agent-a3c40a9f",
    "subscription": {
      "subscriptionId": "sub_zombie_alert",
      "events": ["entity_spawn", "player_death"],
      "filter": {
        "entityTypes": ["zombie", "skeleton", "creeper"],
        "distance": 16
      }
    }
  }
}
```

**字段说明：**
| 字段 | 类型 | 说明 |
|------|------|------|
| subscriptionId | string | 订阅唯一标识 |
| events | array | 订阅的事件类型列表 |
| filter | object | 过滤条件（可选） |
| filter.entityTypes | array | 关注的实体类型 |
| filter.distance | number | 关注距离 |

**平台收到订阅后的行为：** 当收到匹配的 `agent:event` 消息时，将事件转发给订阅的 Agent。

---

## 七、视觉截图

### 7.1 agent:vision — 第一人称视角截图

**触发时机：** Agent 调用 `vision.js --action capture` 时

**Agent 发送：**
```json
{
  "type": "agent:vision",
  "payload": {
    "agentId": "minecraft-agent-a3c40a9f",
    "vision": {
      "captureId": "cap_xyz789",
      "imageData": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAA...",
      "thumbnailData": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAA...",
      "dimensions": { "width": 640, "height": 480 },
      "position": { "x": 128, "y": 64, "z": -256 },
      "facing": { "yaw": 45.5, "pitch": -10.2 },
      "description": "发现钻石矿石",
      "scene": {
        "biome": "plains",
        "timeOfDay": "day",
        "weather": "clear",
        "dimension": "overworld"
      },
      "timestamp": 1745943725000
    }
  }
}
```

**字段说明：**
| 字段 | 类型 | 说明 |
|------|------|------|
| captureId | string | 截图唯一标识 |
| imageData | string | 完整 PNG 截图，Base64 编码，带 data URI 前缀 |
| thumbnailData | string | 缩略图，宽度 160px，Base64 编码 |
| dimensions | object | 原始分辨率 |
| position | object | 截图时 Bot 位置 |
| facing | object | 截图时视角方向 |
| description | string | Agent 对场景的描述（可选） |
| scene | object | 场景环境信息 |
| scene.biome | string | 生物群系 |
| scene.timeOfDay | string | 时间: night/dawn/day/dusk |
| scene.weather | string | 天气: clear/rain/thunder |
| scene.dimension | string | 维度 |
| timestamp | number | Unix 时间戳 (毫秒) |

**平台建议展示：**
- 截图列表：缩略图网格
- 详情页：完整大图 + 位置标注
- 场景信息：生物群系、时间、天气
- 地图联动：截图位置在小地图上标记

---

## 八、观测者客户端

### 8.1 observer:register — 观测客户端注册

**方向：** 观测客户端 → 平台（不是 Agent 发送）

**观测客户端发送：**
```json
{
  "type": "observer:register",
  "payload": {}
}
```

**平台响应：**
```json
{
  "type": "agents:list",
  "payload": {
    "agents": [
      {
        "agentId": "minecraft-agent-a3c40a9f",
        "username": "Bot01",
        "status": "active",
        "serverHost": "127.0.0.1",
        "serverPort": 25565,
        "lastSeen": 1745943725000
      },
      {
        "agentId": "minecraft-agent-def67890",
        "username": "Bot02",
        "status": "active",
        "serverHost": "127.0.0.1",
        "serverPort": 25565,
        "lastSeen": 1745943700000
      }
    ]
  }
}
```

**平台后续行为：** 观测客户端连接后，当有 Agent 状态变化（注册/断开/事件）时，平台主动推送更新给观测客户端。

---

## 九、平台需要处理的全部消息类型汇总

| 消息类型 | 方向 | 触发频率 | 平台优先级 |
|---------|------|---------|-----------|
| `agent:register` | Agent→平台 | 每 Bot 一次 | P0 |
| `agent:register:ack` | 平台→Agent | 收到 register 时 | P0 |
| `agent:status:update` | Agent→平台 | 每 30 秒 | P0 |
| `agent:world:snapshot` | Agent→平台 | 每 60 秒 | P0 |
| `agent:event` | Agent→平台 | 按需 | P0 |
| `agent:disconnect` | Agent→平台 | 每 Bot 一次 | P0 |
| `agent:vision` | Agent→平台 | 按需 | P1 |
| `agent:build:progress` | Agent→平台 | 建造时每 10% | P1 |
| `agent:team:update` | Agent→平台 | 团队变更时 | P1 |
| `agent:subscribe` | Agent→平台 | 订阅时 | P1 |
| `observer:register` | 观测客户端→平台 | 观测客户端接入 | P2 |
| `agents:list` | 平台→观测客户端 | 收到 register 时 | P2 |

---

## 十、完整事件类型索引

| event.type | 类别 | 说明 |
|-----------|------|------|
| `connected` | 系统 | Bot 连接成功 |
| `disconnected` | 系统 | Bot 断开 |
| `chat_sent` | 玩家 | 发送聊天 |
| `chat_received` | 环境 | 收到聊天 |
| `moved` | 移动 | 位置变化 |
| `jumped` | 移动 | 跳跃 |
| `respawned` | 移动 | 重生 |
| `attacked` | 战斗 | 攻击实体 |
| `damaged` | 战斗 | 受到伤害 |
| `died` | 战斗 | 死亡 |
| `block_broken` | 方块 | 破坏方块 |
| `block_placed` | 方块 | 放置方块 |
| `world_changed` | 环境 | 维度切换 |
| `item_picked_up` | 物品 | 拾取物品 |
| `item_dropped` | 物品 | 丢弃物品 |
| `item_used` | 物品 | 使用物品 |
| `inventory_changed` | 物品 | 背包变更 |
| `item_crafted` | 合成 | 合成物品 |
| `item_smelted` | 熔炼 | 熔炼物品 |
| `chest_opened` | 箱子 | 打开箱子 |
| `item_deposited` | 箱子 | 存入物品 |
| `item_withdrawn` | 箱子 | 取走物品 |
| `land_tilled` | 农业 | 耕地 |
| `crop_planted` | 农业 | 种植 |
| `crop_harvested` | 农业 | 收割 |
| `sleep_started` | 睡眠 | 开始睡觉 |
| `sleep_completed` | 睡眠 | 睡眠完成 |
| `build_started` | 建造 | 开始建造 |
| `build_progress` | 建造 | 建造进度 |
| `build_completed` | 建造 | 建造完成 |
| `build_failed` | 建造 | 建造失败 |
| `trade_opened` | 交易 | 打开交易 |
| `trade_completed` | 交易 | 完成交易 |

---

## 十一、错误码参考

Agent 在处理命令失败时返回的错误码：

| error.code | 说明 | suggestions 示例 |
|-----------|------|----------------|
| `CONNECTION_NOT_FOUND` | 连接不存在 | ["检查 connection-id 是否正确"] |
| `INSUFFICIENT_MATERIALS` | 材料不足 | ["需要再收集 N 个 X", "去矿井寻找"] |
| `NO_RECIPE_FOUND` | 没有配方 | ["检查物品名称是否正确"] |
| `NO_FURNACE_FOUND` | 未找到熔炉 | ["先放置一个熔炉", "熔炉 = 8 个圆石"] |
| `NO_BED_FOUND` | 未找到床铺 | ["附近没有床", "先放置一个床"] |
| `FURNACE_NO_SPACE` | 熔炉无空间 | ["熔炉输入槽已满"] |
| `FURNACE_NO_FUEL` | 燃料不足 | ["放入更多煤炭或木头"] |
| `CHEST_NOT_FOUND` | 箱子不存在 | ["检查箱子位置是否正确"] |
| `CHEST_FULL` | 箱子已满 | ["找另一个箱子存储"] |
| `CHEST_NO_ITEM` | 箱子中没有物品 | ["检查物品名称"] |
| `NOT_SLEEPING` | 不在睡觉状态 | ["需要先躺在床上"] |
| `NOT_HOLDING_SEEDS` | 没有种子 | ["需要先拿种子", "小麦种子 = 小麦合成"] |
| `NOT_SPRINTING` | 不在疾跑状态 | ["疾跑需要足够饥饿值"] |
| `GOTO_FAILED` | 导航失败 | ["目标不可达", "检查路径是否有障碍"] |
| `COLLECT_FAILED` | 收集失败 | ["附近没有可收集物品"] |
| `ENTITY_NOT_FOUND` | 实体不存在 | ["检查实体 ID"] |
| `VILLAGER_NOT_FOUND` | 村民不存在 | ["附近没有村民"] |
| `INVALID_TRADE_INDEX` | 无效交易索引 | ["检查交易编号"] |
| `NO_EMERALD` | 没有绿宝石 | ["先收集绿宝石"] |
| `TRADE_NOT_AVAILABLE` | 交易不可用 | ["交易已用尽或已解锁"] |
| `INVALID_BLUEPRINT` | 无效蓝图 | ["检查蓝图 JSON 格式"] |
| `BLUEPRINT_TOO_LARGE` | 蓝图过大 | ["减少层数或半径"] |
| `OUT_OF_BOUNDS` | 坐标超出范围 | ["检查目标坐标"] |
| `INVALID_ARGUMENT` | 无效参数 | ["检查参数格式"] |
| `TIMEOUT` | 操作超时 | ["网络可能不稳定", "重试"] |
| `SERVER_ERROR` | 服务器错误 | ["检查 Minecraft 服务器状态"] |
