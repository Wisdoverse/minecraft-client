<!-- header -->
---

<p align="center">
  <img src="https://raw.githubusercontent.com/Wisdoverse/mineworld/main/public/logo.svg" width="80" height="80" alt="logo">
</p>

<h1 align="center">MineWorld</h1>

<p align="center"><strong>Echtzeit-Minecraft-Agent-Beobachtungsplattform</strong></p>

<p align="center">Überwachen, verfolgen und visualisieren Sie Ihre Minecraft-KI-Agenten — alles an einem Ort.</p>

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

## Inhaltsverzeichnis

- [Funktionen](#funktionen)
- [Schnellstart](#schnellstart)
- [Architektur](#architektur)
- [Observability](#observability)
- [Beitragen](#beitragen)
- [Lizenz](#lizenz)

## Funktionen

### Echtzeit-Überwachung

- **Agenten-Verfolgung** — Verfolgen Sie Position, Gesundheit, Inventar und Status in Echtzeit
- **Ereignis-Streaming** — Streamen Sie alle Agenten-Ereignisse zur Beobachtungsplattform
- **Welt-Schnappschüsse** — Periodische Schnappschüsse von Blöcken und Entitäten

### Integrierte Tools

- **Wegfindung** — Navigieren Sie mit A* zu beliebigen Orten
- **Kampf** — Greifen Sie Entitäten mit konfigurierbarem Verhalten an
- **Inventar** — Vollständige Inventarverwaltung (bewegen, ausrüsten, fallen lassen)
- **Handwerk** — Stellen Sie Gegenstände mit Werkbank oder Inventar her
- **Schmelzen** — Erze schmelzen und Essen kochen
- **Landwirtschaft** — Automatischer Pflanzenanbau (Weizen, Karotten, Kartoffeln, Rote Bete)
- **Bauen** — Bauen Sie Strukturen aus Blueprint-Dateien
- **Handel** — Handeln Sie mit Dorfbewohnern
- **Schlafen** — Betten finden und darin schlafen
- **Angeln** — Automatisches Angeln

### Beobachtungsplattform

- **WebSocket-Verbindung** — Echtzeit bidirektionale Kommunikation
- **Ereignisabonnement** — Abonnieren Sie bestimmte Ereignistypen
- **Team-Koordination** — Multi-Agent-Unterstützung
- **Fortschrittsberichte** — Baufortschrittsverfolgung

## Schnellstart

### Voraussetzungen

- Node.js 18+
- Minecraft-Server (Java Edition 1.8+)

### Installation

```bash
git clone https://github.com/Wisdoverse/mineworld.git
cd mineworld
npm install
npm run dev
```

## Architektur

```
┌─────────────────────────────────────────────────────────────┐
│                    Beobachtungsplattform                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Dashboard  │  │  Ereignis-  │  │   Team-    │         │
│  │             │  │   Stream    │  │   Manager  │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │ WebSocket
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Minecraft-Client                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Mineflayer │  │  Pathfinder │  │   Aktionen  │         │
│  │             │  │             │  │   Manager   │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

## Observability

### Ereignistypen

| Ereignis | Beschreibung |
|----------|-------------|
| `connected` | Agent mit Server verbunden |
| `disconnected` | Agent getrennt |
| `moved` | Agent bewegt |
| `jumped` | Agent gesprungen |
| `attacked` | Agent hat Entität angegriffen |
| `damaged` | Agent erlitt Schaden |
| `died` | Agent gestorben |
| `chat_sent` | Chat-Nachricht gesendet |
| `chat_received` | Chat-Nachricht empfangen |
| `block_broken` | Block gebrochen |
| `block_placed` | Block platziert |
| `item_picked_up` | Gegenstand aufgehoben |
| `item_dropped` | Gegenstand fallengelassen |
| `inventory_changed` | Inventar geändert |

## Beitragen

Beiträge sind willkommen! Bitte zögern Sie nicht, einen Pull Request zu senden.

## Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert.
