<!-- header -->
---

<p align="center">
  <img src="https://raw.githubusercontent.com/Wisdoverse/mineworld/main/public/logo.svg" width="80" height="80" alt="logo">
</p>

<h1 align="center">MineWorld</h1>

<p align="center"><strong>منصة مراقبة عملاء Minecraft في الوقت الفعلي</strong></p>

<p align="center">مراقبة وتتبع وتصور عملاء الذكاء الاصطناعي في Minecraft — كل ذلك في مكان واحد.</p>

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
- [القابلية للمراقبة](#القابلية-للمراقبة)
- [المساهمة](#المساهمة)
- [الترخيص](#الترخيص)

## الميزات

### المراقبة في الوقت الفعلي

- **تتبع العملاء** — تتبع الموقع والصحة والمخزون والحالة في الوقت الفعلي
- **تدفق الأحداث** — بث جميع أحداث العملاء إلى منصة المراقبة
- **لقطات العالم** — لقطات دورية للكتل والكيانات

### الأدوات المدمجة

- **إيجاد المسار** — انتقل إلى أي موقع باستخدام A*
- **القتال** — مهاجمة الكيانات بسلوك قابل للتكوين
- **المخزون** — إدارة كاملة للمخزون (نقل، تجهيز، رمي العناصر)
- **الصناعة** — صناعة العناصر باستخدام طاولة العمل أو المخزون
- **الصهر** — صهر الخامات وطهي الطعام
- **الزراعة** — زراعة المحاصيل تلقائياً (القمح، الجزر، البطاطس، الشمندر)
- **البناء** — بناء الهياكل من ملفات المخططات
- **التجارة** — التجارة مع villagers
- **النوم** — البحث عن السرير والنوم فيه
- **ال الصيد** — الصيد التلقائي

### منصة المراقبة

- **اتصال WebSocket** — اتصال ثنائي الاتجاه في الوقت الفعلي
- **الاشتراك في الأحداث** — اشترك في أنواع أحداث محددة
- **تنسيق الفريق** — دعم العملاء المتعددين
- **تقارير التقدم** — تتبع تقدم البناء

## البدء السريع

### المتطلبات الأساسية

- Node.js 18+
- خادم Minecraft (Java Edition 1.8+)

### التثبيت

```bash
git clone https://github.com/Wisdoverse/mineworld.git
cd mineworld
npm install
npm run dev
```

## البنية

```
┌─────────────────────────────────────────────────────────────┐
│                      منصة المراقبة                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   لوحة التحكم │  │   تدفق     │  │   مدير     │         │
│  │             │  │   الأحداث   │  │   الفريق   │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │ WebSocket
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      عميل Minecraft                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Mineflayer │  │  Pathfinder │  │   الإجراءات │         │
│  │             │  │             │  │   المدير    │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

## القابلية للمراقبة

### أنواع الأحداث

| الحدث | الوصف |
|-------|-------|
| `connected` | العميل متصل بالخادم |
| `disconnected` | العميل غير متصل |
| `moved` | العميل تحرك |
| `jumped` | العميل قفز |
| `attacked` | العميل هاجم كياناً |
| `damaged` | العميل تعرض للضرر |
| `died` | العميل مات |
| `chat_sent` | تم إرسال رسالة |
| `chat_received` | تم استلام رسالة |
| `block_broken` | تم كسر كتلة |
| `block_placed` | تم وضع كتلة |
| `item_picked_up` | تم التقاط عنصر |
| `item_dropped` | تم إسقاط عنصر |
| `inventory_changed` | تم تغيير المخزون |

## المساهمة

المساهمات مرحب بها! لا تتردد في إرسال طلب سحب.

## الترخيص

هذا المشروع مرخص بموجب MIT.
