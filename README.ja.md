---

## 目次

- [機能](#機能)
- [クイックスタート](#クイックスタート)
- [サポートしている操作](#サポートしている操作)
- [観測プラットフォームイベント](#観測プラットフォームイベント)
- [プロジェクト構造](#プロジェクト構造)
- [貢献](#貢献)
- [ライセンス](#ライセンス)

## 機能

### コア機能

| カテゴリ | 説明 |
|----------|------|
| **サーバー接続** | 任意の Minecraft サーバーに接続（オフラインまたはオンライン） |
| **移動制御** | 歩き、跳跃、スプリント、游泳、パスファインディング |
| **戦闘システム** | エンティティ攻撃、武器と防具の使用 |
| **アイテム管理** | インベントリ表示、アイテム移動、装備管理 |
| **作業システム** | インベントリまたは作業台での作業 |
| **精錬システム** | 鉱石の精錬、熔炉の自動検出 |
| **コンテナ操作** | チェスト、ホッパー、ドロッパー、ディスペンサー、バレル、熔炉 |
| **取引システム** | 村人取引インターフェース |
| **農業システム** | 自動耕作、植付、収穫 |
| **建設システム** | ブループリント建設、進捗報告 |
| **ビジョンシステム** | スクリーンショットとシーン情報 |
| **Wiki クエリ** | Minecraft Wiki のレシピと情報查询 |

### 上級機能

| 機能 | 説明 |
|------|------|
| **載具制御** | ボートとMinecartに出入り |
| **盾防御** | 盾防御の有効/無効 |
| **ドロップホワイトリスト** | 大切なアイテムの誤廃棄防止 |
| **自動装備** | 製作した防具、盾、弓の自動装備 |
| **熔炉クリア** | 熔炉の中身をワンクリックで取出 |
| **マルチコンテナ** | コンテナタイプの自動検出 |

## クイックスタート

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/Wisdoverse/minecraft-client.git
cd minecraft-client

# 依存関係をインストール
npm install
```

### サーバーへの接続

```bash
# オフラインサーバー（デフォルト）
node scripts/connect.js --host localhost --port 25565 --username MyBot --auth offline

# オンライン/Microsoft 認証サーバー
node scripts/connect.js --host mc.hypixel.net --port 25565 --username MyBot --auth microsoft --password "your-password"

# 観測プラットフォームを有効化
node scripts/connect.js --host localhost --port 25565 --username MyBot \
  --observer-ws "wss://your-observer-server/ws/agent" \
  --observer-token "your-token"
```

### 基本的な操作

```bash
# 移動
node scripts/interact.js --action move --connection-id <id> --direction forward
node scripts/interact.js --action jump --connection-id <id>
node scripts/interact.js --action swim --connection-id <id> --swim-action start

# チャット
node scripts/interact.js --action chat --connection-id <id> --message "你好！"

# 戦闘
node scripts/interact.js --action attack --connection-id <id> --entity-name Zombie
node scripts/interact.js --action equip --connection-id <id> --slot 5 --destination head

# 盾防御
node scripts/interact.js --action block --connection-id <id> --block-action enable
node scripts/interact.js --action block --connection-id <id> --block-action disable

# 載具制御
node scripts/interact.js --action boat --connection-id <id> --boat-action enter
node scripts/interact.js --action boat --connection-id <id> --boat-action exit
```

### 作業と精錬

```bash
# インベントリ作業（2x2）
node scripts/craft.js --connection-id <id> --item stick --amount 4

# 作業台作業（3x3）
node scripts/craft.js --connection-id <id> --item diamond_pickaxe --use-workbench true

# 自動装備
node scripts/craft.js --connection-id <id> --item diamond_helmet --auto-equip

# 精錬
node scripts/smelt.js --connection-id <id> --item iron_ore --amount 10 --fuel coal

# 熔炉をクリア
node scripts/smelt.js --connection-id <id> --action clear --furnace-position "100,64,200"
```

### コンテナ操作

```bash
# コンテナ内容を表示
node scripts/chest.js --connection-id <id> --action list --position "100,64,200"

# アイテムを存入
node scripts/chest.js --connection-id <id> --action store --position "100,64,200" --item diamond --amount 16

# アイテムを取出
node scripts/chest.js --connection-id <id> --action withdraw --position "100,64,200" --item iron_ingot --amount 32
```

## サポートしている操作

| 操作 | 説明 |
|------|------|
| `move` | 方向移動（前/後/左/右） |
| `jump` | 跳跃 |
| `chat` | チャットメッセージを送信 |
| `break` | 指定位置のブロックを破壊 |
| `place` | 指定位置にブロックを設置 |
| `attack` | 名前またはUUIDでエンティティを攻撃 |
| `equip` | アイテムを装備 |
| `drop` | アイテムをドロップ（ホワイトリスト対応） |
| `look` | 位置を見る、または視点を設定 |
| `eat` | 食事を取る |
| `sleep` | 指定位置で寝る |
| `wake` | 起きる |
| `fish` | 釣り開始 |
| `boat` | ボートの出入り |
| `minecart` | Minecartの出入り |
| `block` | 盾防御の有効/無効 |
| `goto` | 指定位置にナビゲート |
| `collect` | 指定タイプのアイテムを収集 |
| `swim` | 游泳の開始/停止 |
| `craft` | アイテムを製作 |
| `smelt` | アイテムを精錬 |
| `chest` | コンテナ操作 |
| `query` | 情報を查询 |
| `status` | Botの状態を取得 |
| `vision` | スクリーンショット |
| `events` | イベント購読 |
| `trade` | 村人取引 |
| `farm` | 農業操作 |
| `build` | ブループリント建設 |
| `sleep-auto` | ベッドを自動検索して就寝 |
| `multi` | マルチBot協調 |

## 観測プラットフォームイベント

| イベントタイプ | 説明 |
|----------------|------|
| `connected` | Bot がサーバーに接続 |
| `disconnected` | Bot が切断 |
| `moved` | Bot が移動またはナビゲート |
| `jumped` | Bot が跳跃 |
| `attacked` | Bot がエンティティを攻撃 |
| `damaged` | Bot がダメージを受けた |
| `died` | Bot が死亡 |
| `chat_sent` | チャットメッセージを送信 |
| `chat_received` | チャットメッセージを受信 |
| `block_broken` | ブロックが破壊された |
| `block_placed` | ブロックが置かれた |
| `item_picked_up` | アイテムを拾った |
| `item_dropped` | アイテムをドロップ |
| `item_used` | アイテムを使用 |
| `inventory_changed` | インベントリが変更 |
| `world_changed` | 世界が変更（ディメンション） |
| `respawned` | Bot が리스ポーン |
| `item_crafted` | アイテムが製作された |
| `item_smelted` | アイテムが精錬された |
| `chest_opened` | コンテナが開いた |
| `item_deposited` | アイテムが存入された |
| `item_withdrawn` | アイテムが取出された |

## プロジェクト構造

```
minecraft-client/
├── SKILL.md                           # Skill 定義
├── package.json                       # Node.js 依存関係
├── scripts/
│   ├── connect.js                     # メイン Bot 接続
│   ├── interact.js                    # 対話コマンド
│   ├── disconnect.js                  # 切断
│   ├── status.js                      # 状態查询
│   ├── vision.js                      # スクリーンショット
│   ├── inventory.js                   # インベントリ管理
│   ├── craft.js                       # 作業システム
│   ├── smelt.js                       # 精錬システム
│   ├── chest.js                       # コンテナ操作
│   ├── sleep.js                       # 睡眠システム
│   ├── auto.js                        # 自動化タスク
│   ├── farm.js                        # 農業システム
│   ├── build.js                       # ブループリント建設
│   ├── monitor.js                     # 環境監視
│   ├── query.js                       # 查询システム
│   ├── trade.js                       # 村人取引
│   ├── events.js                      # イベント購読
│   ├── wiki.js                        # Wiki 查询
│   └── multi.js                       # マルチBot協調
└── references/
    └── observer-platform-protocol.md  # 観測プラットフォームプロトコル
```

## 貢献

貢献を歓迎します！Issues と Pull Requests をお気軽にどうぞ。

## ライセンス

MIT
