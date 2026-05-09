<p align="center">
  <img src="https://raw.githubusercontent.com/Wisdoverse/mineworld/main/public/logo.svg" width="80" height="80" alt="logo">
</p>

<h1 align="center">Minecraft Client</h1>

<p align="center"><strong>リアルタイム Minecraft Agent 監視プラットフォーム</strong></p>

<p align="center">Minecraft AI エージェントを一箇所で監視、追跡、視覚化。</p>

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

## 目次

- [機能](#機能)
- [クイックスタート](#クイックスタート)
- [アーキテクチャ](#アーキテクチャ)
- [監視プラットフォーム](#監視プラットフォーム)
- [貢献](#貢献)
- [ライセンス](#ライセンス)

## 機能

### コア機能

| カテゴリ | 説明 |
|----------|------|
| **サーバー接続** | 任意のMinecraftサーバーに接続（オフライン/オンライン） |
| **移動制御** | 歩行、ジャンプ、スプリント、水泳、パス探索 |
| **戦闘システム** | エンティティ攻撃、武器・防具使用 |
| **インベントリ管理** | インベントリ表示、アイテム移動、装備管理 |
| **作業台システム** | インベントリまたは作業台での製造 |
| **精錬システム** | 鉱石の精錬、炉の自動検出 |
| **コンテナ操作** | チェスト、ホッパー、ドロッパー、ディスペンサー、バレル、炉 |
| **取引システム** | 村人取引インターフェース |
| **農業システム** | 自動耕うん、植付け、収穫 |
| **建設システム** | ブループリント建設、進捗報告 |
| **ビジョンシステム** | スクリーンショット、情報取得 |
| **Wiki検索** | Minecraft Wikiからレシピ情報取得 |

### 上級機能

| 機能 | 説明 |
|------|------|
| **車両制御** | boatsおよびminecartsへの入退出 |
| **盾防御** | 盾防御の有効/無効 |
| **ドロップホワイトリスト** | 大切なアイテムの誤削除保護 |
| **自動装備** | 製造した防具、盾、弓の自動装備 |
| **炉クリア** | 炉から全アイテムを一括取得 |
| **マルチコンテナ** | コンテナタイプの自動検出 |

## クイックスタート

### インストール

```bash
git clone https://github.com/Wisdoverse/minecraft-client.git
cd minecraft-client
npm install
```

### サーバー接続

```bash
# オフラインサーバー（デフォルト）
node scripts/connect.js --host localhost --port 25565 --username MyBot --auth offline

# オンライン/Microsoft認証サーバー
node scripts/connect.js --host mc.hypixel.net --port 25565 --username MyBot --auth microsoft

# 監視プラットフォーム有効化
node scripts/connect.js --host localhost --port 25565 --username MyBot \
  --observer-ws "wss://your-observer-server/ws/agent" \
  --observer-token "your-token"
```

### 基本操作

```bash
# 移動
node scripts/interact.js --action move --connection-id <id> --direction forward
node scripts/interact.js --action jump --connection-id <id>
node scripts/interact.js --action swim --connection-id <id> --swim-action start

# チャット
node scripts/interact.js --action chat --connection-id <id> --message "こんにちは！"

# 戦闘
node scripts/interact.js --action attack --connection-id <id> --entity-name Zombie
node scripts/interact.js --action equip --connection-id <id> --slot 5 --destination head

# 盾防御
node scripts/interact.js --action block --connection-id <id> --block-action enable
node scripts/interact.js --action block --connection-id <id> --block-action disable

# 車両制御
node scripts/interact.js --action boat --connection-id <id> --boat-action enter
node scripts/interact.js --action boat --connection-id <id> --boat-action exit
```

### 製造と精錬

```bash
# インベントリ製造（2x2）
node scripts/craft.js --connection-id <id> --item stick --amount 4

# 作業台製造（3x3）
node scripts/craft.js --connection-id <id> --item diamond_pickaxe --use-workbench true

# 製造した防具を自動装備
node scripts/craft.js --connection-id <id> --item diamond_helmet --auto-equip

# 精錬
node scripts/smelt.js --connection-id <id> --item iron_ore --amount 10 --fuel coal

# 炉をクリア
node scripts/smelt.js --connection-id <id> --action clear --furnace-position "100,64,200"
```

### コンテナ操作

```bash
# コンテナ表示
node scripts/chest.js --connection-id <id> --action list --position "100,64,200"

# アイテムを保管
node scripts/chest.js --connection-id <id> --action store --position "100,64,200" --item diamond --amount 16

# アイテムを取得
node scripts/chest.js --connection-id <id> --action withdraw --position "100,64,200" --item iron_ingot --amount 32
```

## アーキテクチャ

```
minecraft-client/
├── SKILL.md                           # Skill定義
├── package.json                       # Node.js依存関係
├── scripts/
│   ├── connect.js                     # メインBot接続
│   ├── interact.js                    # インタラクションコマンド
│   ├── disconnect.js                  # 切断
│   ├── status.js                      # ステータス取得
│   ├── vision.js                      # スクリーンショット
│   ├── inventory.js                   # インベントリ管理
│   ├── craft.js                       # 製造システム
│   ├── smelt.js                       # 精錬システム
│   ├── chest.js                       # コンテナ操作
│   ├── sleep.js                       # 睡眠システム
│   ├── auto.js                        # 自動化タスク
│   ├── farm.js                        # 農業システム
│   ├── build.js                       # ブループリント建設
│   ├── monitor.js                     # 環境監視
│   ├── query.js                       # クエリシステム
│   ├── trade.js                       # 村人取引
│   ├── events.js                      # イベント購読
│   ├── wiki.js                        # Wiki検索
│   └── multi.js                       # マルチBot連携
└── references/
    └── observer-platform-protocol.md  # 監視プラットフォームプロトコル
```

## 監視プラットフォーム

### サポートイベント

| イベントタイプ | 説明 |
|---------------|------|
| `connected` | Botがサーバーに接続 |
| `disconnected` | Botが切断 |
| `moved` | Botが移動またはナビゲート |
| `jumped` | Botがジャンプ |
| `attacked` | Botがエンティティを攻撃 |
| `damaged` | Botがダメージを受けた |
| `died` | Botが死亡 |
| `chat_sent` | チャットメッセージ送信 |
| `chat_received` | チャットメッセージ受信 |
| `block_broken` | ブロックが破壊された |
| `block_placed` | ブロックが置かれた |
| `item_picked_up` | アイテムを取得 |
| `item_dropped` | アイテムをドロップ |
| `item_used` | アイテムを使用 |
| `inventory_changed` | インベントリが変更 |
| `world_changed` | 世界が変更（ディメンション） |
| `respawned` | Botがリスポーン |
| `item_crafted` | アイテムが製造された |
| `item_smelted` | アイテムが精錬された |
| `chest_opened` | コンテナが開かれた |
| `item_deposited` | アイテムが預けられた |
| `item_withdrawn` | アイテムが引き出された |

## 貢献

貢献は歓迎します！IssueとPull Requestをお気軽にどうぞ。

## ライセンス

MIT
