<p align="center">
  <img src="https://raw.githubusercontent.com/Wisdoverse/mineworld/main/public/logo.svg" width="80" height="80" alt="logo">
</p>

<h1 align="center">MineWorld</h1>

<p align="center"><strong>منصة مراقبة وكلاء Minecraft في الوقت الفعلي</strong></p>

<p align="center">مراقبة وتتبع وتصور وكلاء الذكاء الاصطناعي في Minecraft - كل ذلك في مكان واحد.</p>

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

## جدول المحتويات

- [الميزات](#الميزات)
- [البدء السريع](#البدء-السريع)
- [البنية](#البنية)
- [المراقبة](#المراقبة)
- [المساهمة](#المساهمة)
- [الترخيص](#الترخيص)

## الميزات

### القدرات الأساسية

| الفئة | الوصف |
|-------|-------|
| **اتصال الخادم** | الاتصال بأي خادم Minecraft (غير متصل أو متصل) |
| **التحكم في الحركة** | المشي، القفز، الركض، السباحة، التنقل عبر المسار |
| **نظام القتال** | مهاجمة الكيانات، استخدام الأسلحة والدروع |
| **إدارة المخزون** | عرض المخزون، نقل العناصر، إدارة المعدات |
| **نظام التصنيع** | تصنيع العناصر باستخدام المخزون أو طاولة العمل |
| **نظام الصهر** | صهر الخامات، اكتشاف الأفران تلقائياً |
| **عمليات الحاويات** | الصندوق، القمع، الموزع، البرميل، الفرن |
| **نظام التجارة** | واجهة التجارة مع villagers |
| **نظام الزراعة** | الحراثة والزراعة والحصاد التلقائي |
| **نظام البناء** | البناء وفق المخططات مع تقرير التقدم |
| **نظام الرؤية** | لقطات الشاشة والحصول على المعلومات |
| **استعلام الويكي** | الحصول على الوصفات والمعلومات من ويكي Minecraft |

### الميزات المتقدمة

| الميزة | الوصف |
|--------|-------|
| **التحكم في المركبات** | الدخول/الخروج من القوارب وعربات المناجم |
| **حظر الدرع** | تفعيل/إلغاء حماية الدرع |
| **قائمة بيضاء للسحب** | حماية العناصر المهمة من الحذف العرضي |
| **التجهيز التلقائي** | تجهيز الدروع والأقواس والدروق المصنوعة تلقائياً |
| **تفريغ الفرن** | أخذ جميع العناصر من الفرن بنقرة واحدة |
| **حاويات متعددة** | اكتشاف نوع الحاوية تلقائياً |

## البدء السريع

### التثبيت

```bash
git clone https://github.com/Wisdoverse/minecraft-client.git
cd minecraft-client
npm install
```

### الاتصال بالخادم

```bash
# خادم غير متصل (افتراضي)
node scripts/connect.js --host localhost --port 25565 --username MyBot --auth offline

# خادم متصل مع مصادقة Microsoft
node scripts/connect.js --host mc.hypixel.net --port 25565 --username MyBot --auth microsoft

# تفعيل منصة المراقبة
node scripts/connect.js --host localhost --port 25565 --username MyBot \
  --observer-ws "wss://your-observer-server/ws/agent" \
  --observer-token "your-token"
```

### التفاعلات الأساسية

```bash
# الحركة
node scripts/interact.js --action move --connection-id <id> --direction forward
node scripts/interact.js --action jump --connection-id <id>
node scripts/interact.js --action swim --connection-id <id> --swim-action start

# الدردشة
node scripts/interact.js --action chat --connection-id <id> --message "مرحباً!"

# القتال
node scripts/interact.js --action attack --connection-id <id> --entity-name Zombie
node scripts/interact.js --action equip --connection-id <id> --slot 5 --destination head

# حظر الدرع
node scripts/interact.js --action block --connection-id <id> --block-action enable
node scripts/interact.js --action block --connection-id <id> --block-action disable

# التحكم في المركبات
node scripts/interact.js --action boat --connection-id <id> --boat-action enter
node scripts/interact.js --action boat --connection-id <id> --boat-action exit
```

### التصنيع والصهر

```bash
# التصنيع في المخزون (2x2)
node scripts/craft.js --connection-id <id> --item stick --amount 4

# التصنيع في طاولة العمل (3x3)
node scripts/craft.js --connection-id <id> --item diamond_pickaxe --use-workbench true

# تجهيز الدروع المصنوعة تلقائياً
node scripts/craft.js --connection-id <id> --item diamond_helmet --auto-equip

# الصهر
node scripts/smelt.js --connection-id <id> --item iron_ore --amount 10 --fuel coal

# تفريغ الفرن
node scripts/smelt.js --connection-id <id> --action clear --furnace-position "100,64,200"
```

### عمليات الحاويات

```bash
# عرض الحاوية
node scripts/chest.js --connection-id <id> --action list --position "100,64,200"

# تخزين العناصر
node scripts/chest.js --connection-id <id> --action store --position "100,64,200" --item diamond --amount 16

# سحب العناصر
node scripts/chest.js --connection-id <id> --action withdraw --position "100,64,200" --item iron_ingot --amount 32
```

## البنية

```
minecraft-client/
├── SKILL.md                           # تعريف Skill
├── package.json                       # تبعيات Node.js
├── scripts/
│   ├── connect.js                     # اتصال Bot الرئيسي
│   ├── interact.js                    # أوامر التفاعل
│   ├── disconnect.js                  # قطع الاتصال
│   ├── status.js                      # استعلام الحالة
│   ├── vision.js                      # لقطة الشاشة
│   ├── inventory.js                   # إدارة المخزون
│   ├── craft.js                       # نظام التصنيع
│   ├── smelt.js                       # نظام الصهر
│   ├── chest.js                       # عمليات الحاويات
│   ├── sleep.js                       # نظام النوم
│   ├── auto.js                        # المهام الآلية
│   ├── farm.js                        # نظام الزراعة
│   ├── build.js                       # البناء وفق المخططات
│   ├── monitor.js                     # مراقبة البيئة
│   ├── query.js                       # نظام الاستعلام
│   ├── trade.js                       # التجارة مع villagers
│   ├── events.js                      # الاشتراك في الأحداث
│   ├── wiki.js                        # استعلام الويكي
│   └── multi.js                       # تنسيق Multi-Bot
└── references/
    └── observer-platform-protocol.md  # بروتوكول منصة المراقبة
```

## المراقبة

### الأحداث المدعومة

| نوع الحدث | الوصف |
|-----------|-------|
| `connected` | Bot متصل بالخادم |
| `disconnected` | Bot غير متصل |
| `moved` | Bot تحرك أو تنقل |
| `jumped` | Bot قفز |
| `attacked` | Bot هاجم كيان |
| `damaged` | Bot تلقى ضرراً |
| `died` | Bot مات |
| `chat_sent` | رسالة دردشة مرسلة |
| `chat_received` | رسالة دردشة مستلمة |
| `block_broken` | كتلة محطمة |
| `block_placed` | كتلة موضوعة |
| `item_picked_up` | عنصر ملتقطة |
| `item_dropped` | عنصر ملقى |
| `item_used` | عنصر مستخدم |
| `inventory_changed` | المخزون تغير |
| `world_changed` | العالم تغير (البعد) |
| `respawned` | Bot ظهر من جديد |
| `item_crafted` | عنصر مصنوع |
| `item_smelted` | عنصر مصهور |
| `chest_opened` | حاوية مفتوحة |
| `item_deposited` | عنصر مُودع |
| `item_withdrawn` | عنصر مسحوب |

## المساهمة

المساهمات مرحب بها! لا تتردد في إرسال Issues و Pull Requests.

## الترخيص

MIT
