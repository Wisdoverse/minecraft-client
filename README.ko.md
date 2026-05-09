<!-- header -->
---

<p align="center">
  <img src="https://raw.githubusercontent.com/Wisdoverse/mineworld/main/public/logo.svg" width="80" height="80" alt="logo">
</p>

<h1 align="center">MineWorld</h1>

<p align="center"><strong>실시간 Minecraft Agent 관측 플랫폼</strong></p>

<p align="center">Minecraft AI 에이전트를 한 곳에서 모니터링, 추적 및 시각화합니다.</p>

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

## 목차

- [기능](#기능)
- [빠른 시작](#빠른-시작)
- [아키텍처](#아키텍처)
- [관측 기능](#관측-기능)
- [기여](#기여)
- [라이선스](#라이선스)

## 기능

### 실시간 모니터링

- **에이전트 추적** — 에이전트 위치, 체력, 인벤토리, 상태 실시간 추적
- **이벤트 스트리밍** — 모든 에이전트 이벤트를 관측 플랫폼으로 스트리밍
- **월드 스냅샷** — 에이전트 주변 블록 및 엔티티의 주기적 스냅샷

### 내장 도구

- **경로 탐색** — A* 경로 탐색으로 원하는 위치로 이동
- **전투** — 설정 가능한 동작으로 엔티티 공격
- **인벤토리** — 완전한 인벤토리 관리 (이동, 장비, 아이템 버리기)
- **제작** — 작업대 또는 인벤토리로 아이템 제작
- **제련** — 광석 제련 및 음식 조리
- **농업** — 자동 작물 재배 (밀, 당근, 감자, 비트)
- **건축** — 블루프린트 파일에서 구조물 건설
- **거래** — 주민과 거래
- **수면** — 침대 찾아 자기
- **낚시** — 자동 낚시

### 관측 플랫폼

- **WebSocket 연결** — 실시간 양방향 통신
- **이벤트 구독** — 특정 이벤트 유형 구독
- **팀 조정** — 다중 에이전트 조정 지원
- **진행 보고** — 건축 진행 상황 추적

## 빠른 시작

### 전제 조건

- Node.js 18+
- Minecraft 서버 (Java Edition 1.8+)

### 설치

```bash
git clone https://github.com/Wisdoverse/mineworld.git
cd mineworld
npm install
npm run dev
```

## 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│                      관측 플랫폼                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   대시보드   │  │   이벤트    │  │   팀       │         │
│  │             │  │   스트림    │  │   매니저   │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │ WebSocket
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Minecraft 클라이언트                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Mineflayer │  │  Pathfinder  │  │   액션     │         │
│  │             │  │             │  │   매니저   │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

## 관측 기능

### 이벤트 유형

| 이벤트 | 설명 |
|--------|------|
| `connected` | 에이전트가 서버에 연결됨 |
| `disconnected` | 에이전트 연결 해제 |
| `moved` | 에이전트 이동 |
| `jumped` | 에이전트 점프 |
| `attacked` | 에이전트가 엔티티를 공격함 |
| `damaged` | 에이전트가 데미지를 입음 |
| `died` | 에이전트가 죽음 |
| `chat_sent` | 채팅 메시지 전송 |
| `chat_received` | 채팅 메시지 수신 |
| `block_broken` | 블록 파괴 |
| `block_placed` | 블록 배치 |
| `item_picked_up` | 아이템 주움 |
| `item_dropped` | 아이템 버림 |
| `inventory_changed` | 인벤토리 변경 |

## 기여

기여를 환영합니다! Pull Request를 자유롭게 제출하세요.

## 라이선스

MIT 라이선스 하에 라이선스가 부여되었습니다.
