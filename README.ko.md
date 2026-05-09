<p align="center">
  <img src="https://raw.githubusercontent.com/Wisdoverse/mineworld/main/public/logo.svg" width="80" height="80" alt="logo">
</p>

<h1 align="center">Minecraft Client</h1>

<p align="center"><strong>실시간 Minecraft Agent 관찰 플랫폼</strong></p>

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
- [관찰 플랫폼](#관찰-플랫폼)
- [기여](#기여)
- [라이선스](#라이선스)

## 기능

### 핵심 기능

| 카테고리 | 설명 |
|----------|------|
| **서버 연결** | 모든 Minecraft 서버에 연결 (오프라인/온라인) |
| **이동 제어** | 걷기, 점프, 전력질주, 수영, 경로 탐색 |
| **전투 시스템** | 엔티티 공격, 무기 및 갑옷 사용 |
| **인벤토리 관리** | 인벤토리 보기, 아이템 이동, 장비 관리 |
| **제작 시스템** | 인벤토리 또는 작업대 사용 제작 |
| **제련 시스템** | 광석 제련, 화로 자동 감지 |
| **컨테이너 작업** | 상자, 호퍼, 드로퍼, 디스펜서, 배럴, 화로 |
| **거래 시스템** | 주민 거래 인터페이스 |
| **농업 시스템** | 자동 경작, 작물 심기, 수확 |
| **건축 시스템** | 청사진 건축, 진행 상황 보고 |
| **비전 시스템** | 스크린샷, 정보 가져오기 |
| **위키 查询** | Minecraft Wiki에서 레시피 정보 가져오기 |

### 고급 기능

| 기능 | 설명 |
|------|------|
| **차량 제어** | 보트 및 마인카트 출입 |
| **방패 차단** | 방패 방어 활성화/비활성화 |
| **드롭 화이트리스트** | 중요한 아이템 실수 보호 |
| **자동 장착** | 제작한 갑옷, 방패, 활 자동 장착 |
| **화로 비우기** | 화로에서 모든 아이템 한 번에 가져오기 |
| **멀티 컨테이너** | 컨테이너 유형 자동 감지 |

## 빠른 시작

### 설치

```bash
git clone https://github.com/Wisdoverse/minecraft-client.git
cd minecraft-client
npm install
```

### 서버 연결

```bash
# 오프라인 서버 (기본값)
node scripts/connect.js --host localhost --port 25565 --username MyBot --auth offline

# 온라인/Microsoft 인증 서버
node scripts/connect.js --host mc.hypixel.net --port 25565 --username MyBot --auth microsoft

# 관찰 플랫폼 활성화
node scripts/connect.js --host localhost --port 25565 --username MyBot \
  --observer-ws "wss://your-observer-server/ws/agent" \
  --observer-token "your-token"
```

### 기본 작업

```bash
# 이동
node scripts/interact.js --action move --connection-id <id> --direction forward
node scripts/interact.js --action jump --connection-id <id>
node scripts/interact.js --action swim --connection-id <id> --swim-action start

# 채팅
node scripts/interact.js --action chat --connection-id <id> --message "안녕하세요!"

# 전투
node scripts/interact.js --action attack --connection-id <id> --entity-name Zombie
node scripts/interact.js --action equip --connection-id <id> --slot 5 --destination head

# 방패 차단
node scripts/interact.js --action block --connection-id <id> --block-action enable
node scripts/interact.js --action block --connection-id <id> --block-action disable

# 차량 제어
node scripts/interact.js --action boat --connection-id <id> --boat-action enter
node scripts/interact.js --action boat --connection-id <id> --boat-action exit
```

### 제작 및 제련

```bash
# 인벤토리 제작 (2x2)
node scripts/craft.js --connection-id <id> --item stick --amount 4

# 작업대 제작 (3x3)
node scripts/craft.js --connection-id <id> --item diamond_pickaxe --use-workbench true

# 제작한 갑옷 자동 장착
node scripts/craft.js --connection-id <id> --item diamond_helmet --auto-equip

# 제련
node scripts/smelt.js --connection-id <id> --item iron_ore --amount 10 --fuel coal

# 화로 비우기
node scripts/smelt.js --connection-id <id> --action clear --furnace-position "100,64,200"
```

### 컨테이너 작업

```bash
# 컨테이너 보기
node scripts/chest.js --connection-id <id> --action list --position "100,64,200"

# 아이템 저장
node scripts/chest.js --connection-id <id> --action store --position "100,64,200" --item diamond --amount 16

# 아이템 가져오기
node scripts/chest.js --connection-id <id> --action withdraw --position "100,64,200" --item iron_ingot --amount 32
```

## 아키텍처

```
minecraft-client/
├── SKILL.md                           # Skill 정의
├── package.json                       # Node.js 종속성
├── scripts/
│   ├── connect.js                     # 메인 Bot 연결
│   ├── interact.js                    # 인터랙션 명령
│   ├── disconnect.js                  # 연결 해제
│   ├── status.js                      # 상태 조회
│   ├── vision.js                      # 스크린샷
│   ├── inventory.js                   # 인벤토리 관리
│   ├── craft.js                       # 제작 시스템
│   ├── smelt.js                       # 제련 시스템
│   ├── chest.js                       # 컨테이너 작업
│   ├── sleep.js                       # 수면 시스템
│   ├── auto.js                        # 자동화 작업
│   ├── farm.js                        # 농업 시스템
│   ├── build.js                       # 청사진 건축
│   ├── monitor.js                     # 환경 모니터링
│   ├── query.js                       # 쿼리 시스템
│   ├── trade.js                       # 주민 거래
│   ├── events.js                      # 이벤트 구독
│   ├── wiki.js                        # 위키 查询
│   └── multi.js                       # 멀티 Bot 조정
└── references/
    └── observer-platform-protocol.md  # 관찰 플랫폼 프로토콜
```

## 관찰 플랫폼

### 지원 이벤트

| 이벤트 유형 | 설명 |
|------------|------|
| `connected` | Bot이 서버에 연결됨 |
| `disconnected` | Bot 연결 해제됨 |
| `moved` | Bot이 이동 또는 탐색 |
| `jumped` | Bot이 점프함 |
| `attacked` | Bot이 엔티티를 공격함 |
| `damaged` | Bot이 피해를 입음 |
| `died` | Bot이 죽음 |
| `chat_sent` | 채팅 메시지 전송 |
| `chat_received` | 채팅 메시지 수신 |
| `block_broken` | 블록이 파괴됨 |
| `block_placed` | 블록이 배치됨 |
| `item_picked_up` | 아이템을 주움 |
| `item_dropped` | 아이템을 버림 |
| `item_used` | 아이템을 사용함 |
| `inventory_changed` | 인벤토리가 변경됨 |
| `world_changed` | 세계가 변경됨 (차원) |
| `respawned` | Bot이 리스폰됨 |
| `item_crafted` | 아이템이 제작됨 |
| `item_smelted` | 아이템이 제련됨 |
| `chest_opened` | 컨테이너가 열림 |
| `item_deposited` | 아이템이 예치됨 |
| `item_withdrawn` | 아이템이 인출됨 |

## 기여

기여를 환영합니다! 언제든지 이슈와 풀 리퀘스트를 제출해 주세요.

## 라이선스

MIT
