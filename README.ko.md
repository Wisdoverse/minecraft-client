---

## 목차

- [기능](#기능)
- [빠른 시작](#빠른-시작)
- [지원되는 작업](#지원되는-작업)
- [플랫폼 이벤트](#플랫폼-이벤트)
- [프로젝트 구조](#프로젝트-구조)
- [기여](#기여)
- [라이선스](#라이선스)

## 기능

### 주요 기능

| 카테고리 | 설명 |
|---------|-------|
| **서버 연결** | 모든 Minecraft 서버에 연결 (오프라인 또는 온라인) |
| **이동 제어** | 걷기, 점프, 달리기, 수영, pathfinder 내비게이션 |
| **전투 시스템** | 엔티티 공격, 무기 및 갑옷 사용 |
| **아이템 관리** | 인벤토리 보기, 아이템 이동, 장비 관리 |
| **제작 시스템** | 인벤토리 또는 작업대를 사용한 제작 |
| **제련 시스템** | 광석 제련, 용광로 자동 감지 |
| **컨테이너 작업** | 상자, 깔대기, 드로퍼, 디스펜서, 배럴, 용광로 |
| **거래 시스템** | 주민 거래 인터페이스 |
| **농업 시스템** | 자동 경작, 작물 심기, 수확 |
| **건축 시스템** | 설계도에 따른 건축, 진행률 보고 |
| **비전 시스템** | 스크린샷 및 장면 정보 |
| **위키 조회** | Minecraft 위키에서 레시피 및 정보 검색 |

### 고급 기능

| 기능 | 설명 |
|------|-------|
| **차량 제어** | 보트 및矿차 출입 |
| **방패 차단** | 방패 차단을 활성화/비활성화 |
| **드롭 화이트리스트** | 중요한 아이템의 실수_drop 보호 |
| **자동 장비** | 제작된 갑옷, 방패, 활 자동 장착 |
| **용광로 비우기** | 용광로 내용물을 한 번에 회수 |
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

# 관찰 플랫폼 사용
node scripts/connect.js --host localhost --port 25565 --username MyBot \
  --observer-ws "wss://your-observer-server/ws/agent" \
  --observer-token "your-token"
```

## 지원되는 작업

| 작업 | 설명 |
|------|-------|
| `move` | 방향 이동 |
| `jump` | 점프 |
| `chat` | 메시지 보내기 |
| `attack` | 엔티티 공격 |
| `craft` | 아이템 제작 |
| `smelt` | 아이템 제련 |
| `chest` | 컨테이너 작업 |
| `boat` | 보트 출입 |
| `block` | 방패 차단 |

## 플랫폼 이벤트

| 이벤트 | 설명 |
|--------|-------|
| `connected` | 봇 연결됨 |
| `moved` | 봇 이동됨 |
| `attacked` | 봇이 공격함 |
| `item_picked_up` | 아이템 줍기 |

## 프로젝트 구조

```
minecraft-client/
├── SKILL.md                           # 스킬 정의
├── package.json                       # 의존성
├── scripts/                           # 19개 스크립트
└── references/
    └── observer-platform-protocol.md  # 관찰 플랫폼 프로토콜
```

## 라이선스

MIT
