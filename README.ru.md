# Minecraft Client Skill

Комплексный навык бота Minecraft для подключения к любому серверу Minecraft и выполнения полных игровых взаимодействий со встроенной интеграцией наблюдательной платформы для мониторинга агента в реальном времени.

## Функции

### Основные возможности
- **Подключение к серверу**: Подключение к любому серверу Minecraft (офлайн или онлайн режим)
- **Управление движением**: Ходьба, прыжки, спринт, плавание, навигация с помощью pathfinder
- **Боевая система**: Атака сущностей, использование оружия и брони
- **Управление предметами**: Просмотр инвентаря, перемещение предметов, управление экипировкой
- **Система крафта**: Создание предметов через инвентарь или верстак
- **Система плавки**: Плавка руды с автоматическим определением печи
- **Операции с контейнерами**: Доступ к сундукам, воронкам, дропперам, диспенсерам, бочкам, печам
- **Торговля**: Интерфейс торговли с жителями
- **Сельское хозяйство**: Автоматическая вспашка, посадка, сбор урожая
- **Строительство**: Строительство по чертежам с отчетами о прогрессе
- **Видение**: Снимок экрана с информацией о сцене
- **Запрос Wiki**: Поиск рецептов и информации в Minecraft Wiki

### Продвинутые функции
- **Управление транспортом**: Вход/выход из лодок и вагонеток
- **Блокирование щитом**: Включение/выключение блокирования щитом
- **Белый список дропа**: Защита важных предметов от случайного удаления
- **Авто-экипировка**: Автоматическое надевание созданной брони, щитов, луков
- **Очистка печи**: Извлечение всех предметов из печи одним кликом
- **Поддержка мульти-контейнеров**: Автоматическое определение типов контейнеров

### Интеграция с наблюдательной платформой
- Обновления состояния агента в реальном времени (позиция, здоровье, инвентарь, экипировка)
- Отчеты снимков мира (блоки, сущности)
- Отслеживание событий (движение, атаки, крафт, чат и т.д.)
- Связь на основе WebSocket
- Автоматическое переподключение со стратегией backoff

## Требования

- Node.js 16+
- npm

## Установка

```bash
# Клонировать репозиторий
git clone https://github.com/Wisdoverse/minecraft-client.git
cd minecraft-client

# Установить зависимости
npm install
```

## Быстрый старт

### 1. Подключение к серверу

```bash
# Офлайн сервер (по умолчанию)
node scripts/connect.js --host localhost --port 25565 --username MyBot --auth offline

# Сервер с аутентификацией Microsoft
node scripts/connect.js --host mc.hypixel.net --port 25565 --username MyBot --auth microsoft --password "your-password"

# С наблюдательной платформой
node scripts/connect.js --host localhost --port 25565 --username MyBot \
  --observer-ws "wss://your-observer-server/ws/agent" \
  --observer-token "your-token"
```

### 2. Базовые взаимодействия

```bash
# Движение
node scripts/interact.js --action move --connection-id <id> --direction forward
node scripts/interact.js --action jump --connection-id <id>
node scripts/interact.js --action swim --connection-id <id> --swim-action start

# Чат
node scripts/interact.js --action chat --connection-id <id> --message "Привет!"

# Взаимодействие с блоками
node scripts/interact.js --action break --connection-id <id> --position "10,64,10"
node scripts/interact.js --action place --connection-id <id> --position "10,65,10"

# Бой
node scripts/interact.js --action attack --connection-id <id> --entity-name Zombie
node scripts/interact.js --action equip --connection-id <id> --slot 5 --destination head

# Блокирование щитом
node scripts/interact.js --action block --connection-id <id> --block-action enable
node scripts/interact.js --action block --connection-id <id> --block-action disable

# Управление транспортом
node scripts/interact.js --action boat --connection-id <id> --boat-action enter
node scripts/interact.js --action boat --connection-id <id> --boat-action exit
```

### 3. Управление предметами

```bash
# Выбросить предметы
node scripts/interact.js --action drop --connection-id <id> --item diamond --count 5

# Защита белым списком
node scripts/interact.js --action drop --connection-id <id> --whitelist-action add --item diamond_sword
node scripts/interact.js --action drop --connection-id <id> --whitelist-action list

# Инвентарь
node scripts/inventory.js --action list --connection-id <id>
```

### 4. Крафт и плавка

```bash
# Крафт в инвентаре (рецепты 2x2)
node scripts/craft.js --connection-id <id> --item stick --amount 4

# Крафт за верстаком (рецепты 3x3)
node scripts/craft.js --connection-id <id> --item diamond_pickaxe --use-workbench true

# Авто-экипировка
node scripts/craft.js --connection-id <id> --item diamond_helmet --auto-equip

# Плавка
node scripts/smelt.js --connection-id <id> --item iron_ore --amount 10 --fuel coal

# Очистка печи
node scripts/smelt.js --connection-id <id> --action clear --furnace-position "100,64,200"
```

### 5. Операции с контейнерами

```bash
# Список содержимого
node scripts/chest.js --connection-id <id> --action list --position "100,64,200"

# Сохранить предметы
node scripts/chest.js --connection-id <id> --action store --position "100,64,200" --item diamond --amount 16

# Извлечь предметы
node scripts/chest.js --connection-id <id> --action withdraw --position "100,64,200" --item iron_ingot --amount 32
```

## Структура проекта

```
minecraft-client/
├── README.md                 # Английская документация
├── README.zh.md             # Китайская документация
├── README.ja.md             # Японская документация
├── README.ko.md             # Корейская документация
├── README.es.md             # Испанская документация
├── README.fr.md             # Французская документация
├── README.de.md             # Немецкая документация
├── README.ru.md             # Русская документация
├── SKILL.md                 # Определение навыка
├── package.json             # Зависимости
├── scripts/                 # 19 скриптов
└── references/
    └── observer-platform-protocol.md
```

## Лицензия

MIT
