# Minecraft Client Skill

Mineflayer 프레임워크를 사용한 포괄적인 Minecraft 봇 스킬입니다. 모든 Minecraft 서버에 연결하여 완전한 게임 상호작용을 수행할 수 있으며, 실시간 에이전트 모니터링을 위한 내장형 옵저버 플랫폼 통합 기능이 포함되어 있습니다.

## 기능

### 핵심 기능
- **서버 연결**: 모든 Minecraft 서버에 연결 (오프라인 또는 온라인 모드)
- **이동 제어**: 걷기, 점프, 전력질주, 수영, 경로 찾기 내비게이션
- **전투 시스템**: 엔티티 공격, 무기 및 갑옷 사용
- **아이템 관리**: 인벤토리 보기, 아이템 이동, 장비 관리
- **제작 시스템**: 인벤토리 또는 작업대를 사용하여 제작
- **제련 시스템**: 자동炉 감지로 광석 제련
- **컨테이너 작업**: 상자, 호퍼, 투|Bi>, 투|bi>, 배럴, 화로 접근
- **거래**: 주민 거래 인터페이스
- **농업**: 자동 경작, 작물 심기, 수확
- **건축**: 진행 상황 보고서가 있는 청사진 기반 건축
- **비전**: 장면 정보가 있는 스크린샷 캡처
- **위키 查询**: Minecraft 위키에서 레시피 및 정보 검색

### 고급 기능
- **차량 제어**: 보트 및 Minecart 출입
- **방패 차단**: 방패 차단 활성화/비활성화
- **드롭 화이트리스트**: 중요한 아이템의 실수导致的 삭제 방지
- **자동 장비**: 제작된 갑옷, 방패, 활 자동 장착
- **화로クリア**: 한 번의 클릭으로 화로의 모든 아이템 회수
- **멀티 컨테이너 지원**: 컨테이너 유형 자동 감지

### 옵저버 플랫폼 통합
- 실시간 에이전트 상태 업데이트 (위치, 체력, 인벤토리, 장비)
- 세계 스냅샷 보고 (블록, 엔티티)
- 이벤트 추적 (이동, 공격, 제작, 채팅 등)
- WebSocket 기반 통신
- 자동 재연결 및 백오프 전략

## 요구 사항

- Node.js 16+
- npm

## 설치

```bash
# 저장소 복제
git clone https://github.com/Wisdoverse/minecraft-client.git
cd minecraft-client

# 종속성 설치
npm install
```

## 빠른 시작

### 1. 서버에 연결

```bash
# 오프라인 서버 (기본값)
node scripts/connect.js --host localhost --port 25565 --username MyBot --auth offline

# 온라인/Microsoft 인증 서버
node scripts/connect.js --host mc.hypixel.net --port 25565 --username MyBot --auth microsoft --password "your-password"

# 옵저버 플랫폼 포함
node scripts/connect.js --host localhost --port 25565 --username MyBot \
  --observer-ws "wss://your-observer-server/ws/agent" \
  --observer-token "your-token"
```

### 2. 기본 작업

```bash
# 이동
node scripts/interact.js --action move --connection-id <id> --direction forward
node scripts/interact.js --action jump --connection-id <id>
node scripts/interact.js --action swim --connection-id <id> --swim-action start

# 채팅
node scripts/interact.js --action chat --connection-id <id> --message "안녕하세요!"

# 블록 작업
node scripts/interact.js --action break --connection-id <id> --position "10,64,10"
node scripts/interact.js --action place --connection-id <id> --position "10,65,10"

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

### 3. 아이템 관리

```bash
# 아이템 드롭
node scripts/interact.js --action drop --connection-id <id> --item diamond --count 5

# 화이트리스트 보호
node scripts/interact.js --action drop --connection-id <id> --whitelist-action add --item diamond_sword
node scripts/interact.js --action drop --connection-id <id> --whitelist-action list

# 인벤토리
node scripts/inventory.js --action list --connection-id <id>
```

### 4. 제작 및 제련

```bash
# 인벤토리 제작 (2x2 레시피)
node scripts/craft.js --connection-id <id> --item stick --amount 4

# 작업대 제작 (3x3 레시피)
node scripts/craft.js --connection-id <id> --item diamond_pickaxe --use-workbench true

# 자동 장비
node scripts/craft.js --connection-id <id> --item diamond_helmet --auto-equip

# 제련
node scripts/smelt.js --connection-id <id> --item iron_ore --amount 10 --fuel coal

# 화로 비우기
node scripts/smelt.js --connection-id <id> --action clear --furnace-position "100,64,200"
```

### 5. 컨테이너 작업

```bash
# 컨테이너 내용 나열
node scripts/chest.js --connection-id <id> --action list --position "100,64,200"

# 아이템 저장
node scripts/chest.js --connection-id <id> --action store --position "100,64,200" --item diamond --amount 16

# 아이템 회수
node scripts/chest.js --connection-id <id> --action withdraw --position "100,64,200" --item iron_ingot --amount 32
```

## 프로젝트 구조

```
minecraft-client/
├── README.md                 # 영어 문서
├── README.zh.md             # 중국어 문서
├── README.ja.md             # 일본어 문서
├── README.ko.md             # 한국어 문서
├── SKILL.md                 # 스킬 정의
├── package.json             # 종속성
├── scripts/                 # 19개 스크립트
└── references/
    └── observer-platform-protocol.md
```

## 라이선스

MIT
