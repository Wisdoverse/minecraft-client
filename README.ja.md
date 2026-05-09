<!-- header -->
---

<p align="center">
  <img src="https://raw.githubusercontent.com/Wisdoverse/mineworld/main/public/logo.svg" width="80" height="80" alt="logo">
</p>

<h1 align="center">MineWorld</h1>

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
- [監視機能](#監視機能)
- [コントリビューション](#コントリビューション)
- [ライセンス](#ライセンス)

## 機能

### リアルタイム監視

- **Agent 追跡** — Agent の位置、健康、インベントリ、ステータスをリアルタイムで追跡
- **イベントストリーム** — すべての Agent イベントを監視プラットフォームにストリーミング
- **ワールドスナップショット** — Agent 周囲のブロックとエンティティの定期スナップショット

### 組み込みツール

- **パスファインディング** — A* パスファインディングで任意の場所へナビゲーション
- **戦闘** — 設定可能な動作でエンティティを攻撃
- **インベントリ** — 完全なインベントリ管理（移動、装備、アイテムドロップ）
- **作業台** — 作業台またはインベントリでアイテムを製造
- **精錬** — 鉱石を精錬し食べ物を調理
- **農業** — 自動作物栽培（小麦、人参、ジャガイモ、ビートルート）
- **建築** — ブループリントファイルから構造物を建設
- **取引** — 村人と交易
- **睡眠** — ベッドを見つけて寝る
- **釣り** — 自動釣り

### 監視プラットフォーム

- **WebSocket 接続** — リアルタイム双方向通信
- **イベント購読** — 特定のイベントタイプを購読
- **チーム調整** — マルチエージェント調整サポート
- **進捗報告** — 建設進捗トラッキング

## クイックスタート

### 前提条件

- Node.js 18+
- Minecraft サーバー（Java Edition 1.8+）

### インストール

```bash
git clone https://github.com/Wisdoverse/mineworld.git
cd mineworld
npm install
npm run dev
```

## アーキテクチャ

```
┌─────────────────────────────────────────────────────────────┐
│                     監視プラットフォーム                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   ダッシュボード│  │  イベント   │  │   チーム    │         │
│  │             │  │   ストリーム │  │   マネージャー│         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │ WebSocket
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     Minecraft クライアント                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Mineflayer │  │ Pathfinder │  │   アクション │         │
│  │             │  │            │  │   マネージャー│         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

## 監視機能

### イベントタイプ

| イベント | 説明 |
|----------|------|
| `connected` | Agent がサーバーに接続 |
| `disconnected` | Agent の切断 |
| `moved` | Agent の移動 |
| `jumped` | Agent のジャンプ |
| `attacked` | Agent がエンティティを攻撃 |
| `damaged` | Agent がダメージを受けた |
| `died` | Agent が死亡 |
| `chat_sent` | チャットメッセージ送信 |
| `chat_received` | チャットメッセージ受信 |
| `block_broken` | ブロック破壊 |
| `block_placed` | ブロック設置 |
| `item_picked_up` | アイテム取得 |
| `item_dropped` | アイテムドロップ |
| `inventory_changed` | インベントリ変更 |

## コントリビューション

コントリビューションを歓迎します！Pull Request を 자유に 提出してください。

## ライセンス

MIT ライセンスの下でライセンスされています。
