<p align="center">
  <img src="https://raw.githubusercontent.com/Wisdoverse/mineworld/main/public/logo.svg" width="80" height="80" alt="logo">
</p>

<h1 align="center">MineWorld</h1>

<p align="center"><strong>Платформа наблюдения за агентами Minecraft в реальном времени</strong></p>

<p align="center">Отслеживайте, мониторьте и визуализируйте ваших агентов ИИ Minecraft — всё в одном месте.</p>

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

## Оглавление

- [Функции](#функции)
- [Быстрый старт](#быстрый-старт)
- [Архитектура](#архитектура)
- [Наблюдаемость](#наблюдаемость)
- [Вклад](#вклад)
- [Лицензия](#лицензия)

## Функции

### Основные возможности

| Категория | Описание |
|-----------|----------|
| **Подключение к серверу** | Подключение к любому Minecraft серверу (офлайн или онлайн) |
| **Управление движением** | Ходьба, прыжки, спринт, плавание, навигация по маршруту |
| **Боевая система** | Атака сущностей, использование оружия и брони |
| **Управление инвентарём** | Просмотр инвентаря, перемещение предметов, управление экипировкой |
| **Система крафта** | Крафт в инвентаре или верстаке |
| **Система плавки** | Плавка руды, автоматическое определение печей |
| **Операции с контейнерами** | Сундук, воронка, дроппер, диспенсер, бочка, печь |
| **Торговая система** | Интерфейс торговли с жителями |
| **Сельскохозяйственная система** | Автоматическая вспашка, посадка, сбор урожая |
| **Строительная система** | Строительство по чертежам с отчётом о прогрессе |
| **Система зрения** | Скриншоты и получение информации |
| **Wiki запросы** | Получение рецептов и информации из Minecraft Wiki |

### Продвинутые функции

| Функция | Описание |
|---------|----------|
| **Управление транспортом** | Вход/выход из лодок и вагонеток |
| **Блокирование щитом** | Включение/выключение защиты щитом |
| **Белый список дропа** | Защита важных предметов от случайного удаления |
| **Авто-экипировка** | Автоматическое надевание крафтовой брони, щитов, луков |
| **Очистка печи** | Забрать все предметы из печи одним кликом |
| **Мульти-контейнер** | Автоматическое определение типа контейнера |

## Быстрый старт

### Установка

```bash
git clone https://github.com/Wisdoverse/minecraft-client.git
cd minecraft-client
npm install
```

### Подключение к серверу

```bash
# Офлайн сервер (по умолчанию)
node scripts/connect.js --host localhost --port 25565 --username MyBot --auth offline

# Онлайн сервер с Microsoft аутентификацией
node scripts/connect.js --host mc.hypixel.net --port 25565 --username MyBot --auth microsoft

# Включить платформу наблюдения
node scripts/connect.js --host localhost --port 25565 --username MyBot \
  --observer-ws "wss://your-observer-server/ws/agent" \
  --observer-token "your-token"
```

### Базовые взаимодействия

```bash
# Движение
node scripts/interact.js --action move --connection-id <id> --direction forward
node scripts/interact.js --action jump --connection-id <id>
node scripts/interact.js --action swim --connection-id <id> --swim-action start

# Чат
node scripts/interact.js --action chat --connection-id <id> --message "Привет!"

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

### Крафт и плавка

```bash
# Крафт в инвентаре (2x2)
node scripts/craft.js --connection-id <id> --item stick --amount 4

# Крафт за верстаком (3x3)
node scripts/craft.js --connection-id <id> --item diamond_pickaxe --use-workbench true

# Авто-экипировка крафтовой брони
node scripts/craft.js --connection-id <id> --item diamond_helmet --auto-equip

# Плавка
node scripts/smelt.js --connection-id <id> --item iron_ore --amount 10 --fuel coal

# Очистка печи
node scripts/smelt.js --connection-id <id> --action clear --furnace-position "100,64,200"
```

### Операции с контейнерами

```bash
# Просмотр контейнера
node scripts/chest.js --connection-id <id> --action list --position "100,64,200"

# Положить предметы
node scripts/chest.js --connection-id <id> --action store --position "100,64,200" --item diamond --amount 16

# Взять предметы
node scripts/chest.js --connection-id <id> --action withdraw --position "100,64,200" --item iron_ingot --amount 32
```

## Архитектура

```
minecraft-client/
├── SKILL.md                           # Определение Skill
├── package.json                       # Зависимости Node.js
├── scripts/
│   ├── connect.js                     # Основное подключение Bot
│   ├── interact.js                    # Команды взаимодействия
│   ├── disconnect.js                  # Отключение
│   ├── status.js                      # Запрос статуса
│   ├── vision.js                      # Скриншот
│   ├── inventory.js                   # Управление инвентарём
│   ├── craft.js                       # Система крафта
│   ├── smelt.js                       # Система плавки
│   ├── chest.js                       # Операции с контейнерами
│   ├── sleep.js                       # Система сна
│   ├── auto.js                        # Автоматические задачи
│   ├── farm.js                        # Сельскохозяйственная система
│   ├── build.js                       # Строительство по чертежам
│   ├── monitor.js                     # Мониторинг окружения
│   ├── query.js                       # Система запросов
│   ├── trade.js                       # Торговля с жителями
│   ├── events.js                      # Подписка на события
│   ├── wiki.js                        # Wiki запросы
│   └── multi.js                       # Координация мульти-Bot
└── references/
    └── observer-platform-protocol.md  # Протокол платформы наблюдения
```

## Наблюдаемость

### Поддерживаемые события

| Тип события | Описание |
|-------------|----------|
| `connected` | Bot подключился к серверу |
| `disconnected` | Bot отключился |
| `moved` | Bot переместился или следовал маршруту |
| `jumped` | Bot прыгнул |
| `attacked` | Bot атаковал сущность |
| `damaged` | Bot получил урон |
| `died` | Bot умер |
| `chat_sent` | Отправлено сообщение в чат |
| `chat_received` | Получено сообщение в чат |
| `block_broken` | Блок сломан |
| `block_placed` | Блок размещён |
| `item_picked_up` | Предмет подобран |
| `item_dropped` | Предмет выброшен |
| `item_used` | Предмет использован |
| `inventory_changed` | Инвентарь изменён |
| `world_changed` | Мир изменён (измерение) |
| `respawned` | Bot респавнился |
| `item_crafted` | Предмет создан крафтом |
| `item_smelted` | Предмет переплавлен |
| `chest_opened` | Контейнер открыт |
| `item_deposited` | Предмет положен |
| `item_withdrawn` | Предмет взят |

## Вклад

Вклад приветствуется! Не стесняйтесь отправлять Issues и Pull Requests.

## Лицензия

MIT
