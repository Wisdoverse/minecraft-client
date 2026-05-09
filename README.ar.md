# Minecraft Client Skill

 مهارة بوت Minecraft شاملة للاتصال بأي خادم Minecraft وتنفيذ تفاعلات اللعبة الكاملة، مع تكامل منصة المراقب المدمج لمراقبة الوكيل في الوقت الفعلي.

## الميزات

### القدرات الأساسية
- **الاتصال بالخادم**: الاتصال بأي خادم Minecraft (وضع غير متصل أو متصل)
- **التحكم في الحركة**: المشي، القفز، الركض، السباحة، التنقل باستخدام pathfinder
- **نظام القتال**: مهاجمة الكيانات، استخدام الأسلحة والدروع
- **إدارة العناصر**: عرض المخزون، نقل العناصر، إدارة المعدات
- **نظام التصنيع**: تصنيع العناصر باستخدام المخزون أو طاولة العمل
- **نظام الصهر**: صهر الخامات مع الكشف التلقائي عن الفرن
- **عمليات الحاويات**: الوصول إلى الصناديق، القمع، الموزعات، المطلقات، البراميل، الأفران
- **التداول**: واجهة التداول مع القرية
- **الزراعة**: الحراثة والزراعة والحصاد التلقائي
- **البناء**: بناء قائم على المخططات مع تقارير التقدم
- **الرؤية**: التقاط شاشة مع معلومات المشهد
- **استعلام ويكي**: البحث عن الوصفات والمعلومات في Minecraft Wiki

### الميزات المتقدمة
- **التحكم في المركبات**: الدخول/الخروج من القوارب وعربات الميناء
- **حظر الدرع**: تفعيل/إلغاء حظر الدرع
- **قائمة بيضاء للإسقاط**: حماية العناصر المهمة من الحذف العرضي
- **التجهيز التلقائي**: تجهيز الدروع والأقواس والدرع المصنوعة تلقائياً
- **مسح الفرن**: سحب جميع العناصر من الفرن بنقرة واحدة
- **دعم الحاويات المتعددة**: الكشف التلقائي عن أنواع الحاويات

### تكامل منصة المراقب
- تحديثات حالة الوكيل في الوقت الفعلي (الموقع، الصحة، المخزون، المعدات)
- تقارير لقطات العالم (الكتل، الكيانات)
- تتبع الأحداث (الحركات، الهجمات، التصنيع، الدردشة، إلخ)
- اتصال قائم على WebSocket
- إعادة الاتصال التلقائي مع استراتيجية التراجع

## المتطلبات

- Node.js 16+
- npm

## التثبيت

```bash
# استنساخ المستودع
git clone https://github.com/Wisdoverse/minecraft-client.git
cd minecraft-client

# تثبيت التبعيات
npm install
```

## البدء السريع

### 1. الاتصال بالخادم

```bash
# خادم غير متصل (افتراضي)
node scripts/connect.js --host localhost --port 25565 --username MyBot --auth offline

# خادم مع مصادقة Microsoft
node scripts/connect.js --host mc.hypixel.net --port 25565 --username MyBot --auth microsoft --password "your-password"

# مع منصة المراقب
node scripts/connect.js --host localhost --port 25565 --username MyBot \
  --observer-ws "wss://your-observer-server/ws/agent" \
  --observer-token "your-token"
```

### 2. التفاعلات الأساسية

```bash
# الحركة
node scripts/interact.js --action move --connection-id <id> --direction forward
node scripts/interact.js --action jump --connection-id <id>
node scripts/interact.js --action swim --connection-id <id> --swim-action start

# الدردشة
node scripts/interact.js --action chat --connection-id <id> --message "مرحبا!"

# التفاعل مع الكتل
node scripts/interact.js --action break --connection-id <id> --position "10,64,10"
node scripts/interact.js --action place --connection-id <id> --position "10,65,10"

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

### 3. إدارة العناصر

```bash
# إسقاط العناصر
node scripts/interact.js --action drop --connection-id <id> --item diamond --count 5

# حماية القائمة البيضاء
node scripts/interact.js --action drop --connection-id <id> --whitelist-action add --item diamond_sword
node scripts/interact.js --action drop --connection-id <id> --whitelist-action list

# المخزون
node scripts/inventory.js --action list --connection-id <id>
```

### 4. التصنيع والصهر

```bash
# التصنيع في المخزون (وصفات 2x2)
node scripts/craft.js --connection-id <id> --item stick --amount 4

# التصنيع على طاولة العمل (وصفات 3x3)
node scripts/craft.js --connection-id <id> --item diamond_pickaxe --use-workbench true

# التجهيز التلقائي
node scripts/craft.js --connection-id <id> --item diamond_helmet --auto-equip

# الصهر
node scripts/smelt.js --connection-id <id> --item iron_ore --amount 10 --fuel coal

# مسح الفرن
node scripts/smelt.js --connection-id <id> --action clear --furnace-position "100,64,200"
```

### 5. عمليات الحاويات

```bash
# سرد المحتويات
node scripts/chest.js --connection-id <id> --action list --position "100,64,200"

# تخزين العناصر
node scripts/chest.js --connection-id <id> --action store --position "100,64,200" --item diamond --amount 16

# سحب العناصر
node scripts/chest.js --connection-id <id> --action withdraw --position "100,64,200" --item iron_ingot --amount 32
```

## هيكل المشروع

```
minecraft-client/
├── README.md                 # الوثائق بالإنجليزية
├── README.zh.md             # الوثائق بالصينية
├── README.ja.md             # الوثائق باليابانية
├── README.ko.md             # الوثائق بالكورية
├── README.es.md             # الوثائق بالإسبانية
├── README.fr.md             # الوثائق بالفرنسية
├── README.de.md             # الوثائق بالألمانية
├── README.pt.md             # الوثائق بالبرتغالية
├── README.ar.md             # الوثائق بالعربية
├── SKILL.md                 # تعريف المهارة
├── package.json             # التبعيات
├── scripts/                 # 19 سكريبت
└── references/
    └── observer-platform-protocol.md
```

## الترخيص

MIT
