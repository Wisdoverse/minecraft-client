# Minecraft Client Skill

Mineflayerフレームワークを使用した包括的なMinecraftボットスキルです。任意のMinecraftサーバーに接続し、完全なゲーム操作を実行できます。組み込みのオブザーバープラットフォーム統合により、リアルタイムのエージェント監視も可能です。

## 機能

### コア機能
- **サーバー接続**: 任意のMinecraftサーバーに接続（オフラインまたはオンライン）
- **移動制御**: 歩行、ジャンプ、スプリント、游泳、pathfinderによるナビゲーション
- **戦闘システム**: エンティティ攻撃、武器と防具の使用
- **アイテム管理**: インベントリ表示、アイテム移動、装備管理
- **作業台システム**: インベントリまたは作業台でのクラフト
- **精錬システム**: 自動炉検出で鉱石を精錬
- **コンテナ操作**: チェスト、ホッパー、ドロッパー、ディスペンサー、バレル、炉へのアクセス
- **取引**: 村人との取引インターフェース
- **農業**: 自動耕起、植林、収穫
- **建築**: 進捗レポート付きブループリント建設
- **ビジョン**: シーン情報付きでスクリーンショット撮影
- **Wikiクエリ**: Minecraft Wikiのレシピと情報の検索

### 高度な機能
- **乗り物制御**: 船と minecart の出入
- **盾防御**: 盾防御の有効/無効化
- **ドロップホワイトリスト**: 重要なアイテムの誤削除防止
- **自動装備**: クラフトした鎧、盾、弓を自動装着
- **炉クリア**: 一括で炉の全アイテム取出
- **マルチコンテナ対応**: コンテナタイプの自動検出

### オーバーバプラットフォーム統合
- リアルタイムエージェント状態更新（位置、健康、インベントリ、装備）
- 世界スナップショットレポート（ブロック、エンティティ）
- イベントトラッキング（移動、攻撃、クラフト、チャットなど）
- WebSocket ベースの通信
- 自動再接続とバックオフ戦略

## 必要条件

- Node.js 16+
- npm

## インストール

```bash
# リポジトリをクローン
git clone https://github.com/Wisdoverse/minecraft-client.git
cd minecraft-client

# 依存関係をインストール
npm install
```

## クイックスタート

### 1. サーバーに接続

```bash
# オフラインサーバー（デフォルト）
node scripts/connect.js --host localhost --port 25565 --username MyBot --auth offline

# オンライン/Microsoft 認証サーバー
node scripts/connect.js --host mc.hypixel.net --port 25565 --username MyBot --auth microsoft --password "your-password"

# オーバーバプラットフォーム付き
node scripts/connect.js --host localhost --port 25565 --username MyBot \
  --observer-ws "wss://your-observer-server/ws/agent" \
  --observer-token "your-token"
```

### 2. 基本的な操作

```bash
# 移動
node scripts/interact.js --action move --connection-id <id> --direction forward
node scripts/interact.js --action jump --connection-id <id>
node scripts/interact.js --action swim --connection-id <id> --swim-action start

# チャット
node scripts/interact.js --action chat --connection-id <id> --message "こんにちは！"

# ブロック操作
node scripts/interact.js --action break --connection-id <id> --position "10,64,10"
node scripts/interact.js --action place --connection-id <id> --position "10,65,10"

# 戦闘
node scripts/interact.js --action attack --connection-id <id> --entity-name Zombie
node scripts/interact.js --action equip --connection-id <id> --slot 5 --destination head

# 盾防御
node scripts/interact.js --action block --connection-id <id> --block-action enable
node scripts/interact.js --action block --connection-id <id> --block-action disable

# 乗り物操作
node scripts/interact.js --action boat --connection-id <id> --boat-action enter
node scripts/interact.js --action boat --connection-id <id> --boat-action exit
```

### 3. アイテム管理

```bash
# アイテムをドロップ
node scripts/interact.js --action drop --connection-id <id> --item diamond --count 5

# ホワイトリスト保護
node scripts/interact.js --action drop --connection-id <id> --whitelist-action add --item diamond_sword
node scripts/interact.js --action drop --connection-id <id> --whitelist-action list

# インベントリ
node scripts/inventory.js --action list --connection-id <id>
node scripts/inventory.js --action move --connection-id <id> --source-slot 0 --dest-slot 8
```

### 4. クラフトと精錬

```bash
# インベントリクラフト（2x2レシピ）
node scripts/craft.js --connection-id <id> --item stick --amount 4

# 作業台クラフト（3x3レシピ）
node scripts/craft.js --connection-id <id> --item diamond_pickaxe --use-workbench true

# 自動装備
node scripts/craft.js --connection-id <id> --item diamond_helmet --auto-equip

# 精錬
node scripts/smelt.js --connection-id <id> --item iron_ore --amount 10 --fuel coal

# 炉をクリア
node scripts/smelt.js --connection-id <id> --action clear --furnace-position "100,64,200"
```

### 5. コンテナ操作

```bash
# コンテナ内容を表示
node scripts/chest.js --connection-id <id> --action list --position "100,64,200"

# アイテムを保管
node scripts/chest.js --connection-id <id> --action store --position "100,64,200" --item diamond --amount 16

# アイテムを取出
node scripts/chest.js --connection-id <id> --action withdraw --position "100,64,200" --item iron_ingot --amount 32
```

### 6. 自動化タスク

```bash
# 位置に移動
node scripts/auto.js --task goto --connection-id <id> --position "100,64,200"

# アイテムを収集
node scripts/auto.js --task collect --connection-id <id> --item-type diamond --radius 32

# 自動睡眠
node scripts/sleep.js --connection-id <id>
```

## プロジェクト構造

```
minecraft-client/
├── README.md                 # 英語ドキュメント
├── README.zh.md             # 中国語ドキュメント
├── README.ja.md             # 日本語ドキュメント
├── SKILL.md                 # スキル定義
├── package.json             # 依存関係
├── scripts/                 # 19個のスクリプト
│   ├── connect.js           # メイン接続
│   ├── interact.js          # 操作コマンド
│   └── ...
└── references/
    └── observer-platform-protocol.md
```

## ライセンス

MIT
