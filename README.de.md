<p align="center">
  <img src="https://raw.githubusercontent.com/Wisdoverse/mineworld/main/public/logo.svg" width="80" height="80" alt="logo">
</p>

<h1 align="center">Minecraft Client</h1>

<p align="center"><strong>Echtzeit Minecraft Agent Beobachtungsplattform</strong></p>

<p align="center">Überwachen, verfolgen und visualisieren Sie Ihre Minecraft KI-Agenten — alles an einem Ort.</p>

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
- [Beobachtbarkeit](#beobachtbarkeit)
- [Beitragen](#beitragen)
- [Lizenz](#lizenz)

## Funktionen

### Hauptfunktionen

| Kategorie | Beschreibung |
|-----------|-------------|
| **Serververbindung** | Verbindung zu jedem Minecraft-Server (Offline oder Online) |
| **Bewegungssteuerung** | Gehen, Springen, Rennen, Schwimmen, Pfadnavigation |
| **Kampfsystem** | Entitäten angreifen, Waffen und Rüstungen benutzen |
| **Inventarverwaltung** | Inventar anzeigen, Gegenstände bewegen, Ausrüstungsverwaltung |
| **Handwerkssystem** | Gegenstände mit Inventar oder Werkbank herstellen |
| **Schmelzsystem** | Erze schmelzen, Öfen automatisch erkennen |
| **Container-Operationen** | Truhe, Trichter, Spender, Fass, Ofen |
| **Handelssystem** | Händler-Handelsoberfläche |
| **Landwirtschaftssystem** | Automatisches Pflügen, Pflanzen, Ernten |
| **Bausystem** | Bau nach Blaupause mit Fortschrittsmeldung |
| **Visionssystem** | Screenshots und Informationsabruf |
| **Wiki-Abfrage** | Rezepte und Informationen von Minecraft Wiki abrufen |

### Erweiterte Funktionen

| Funktion | Beschreibung |
|----------|-------------|
| **Fahrzeugsteuerung** | In/aus Booten und Loren ein-/aussteigen |
| **Schildblockierung** | Schildverteidigung aktivieren/deaktivieren |
| **Drop-Whitelist** | Wichtige Gegenstände vor versehentlichem Löschen schützen |
| **Auto-Ausrüstung** | Hergestellte Rüstungen, Schilde, Bögen automatisch anlegen |
| **Ofen leeren** | Alle Gegenstände aus dem Ofen auf einmal nehmen |
| **Multi-Container** | Automatische Erkennung von Containertypen |

## Schnellstart

### Installation

```bash
git clone https://github.com/Wisdoverse/minecraft-client.git
cd minecraft-client
npm install
```

### Mit Server verbinden

```bash
# Offline-Server (Standard)
node scripts/connect.js --host localhost --port 25565 --username MyBot --auth offline

# Online-Server mit Microsoft-Authentifizierung
node scripts/connect.js --host mc.hypixel.net --port 25565 --username MyBot --auth microsoft

# Beobachtungsplattform aktivieren
node scripts/connect.js --host localhost --port 25565 --username MyBot \
  --observer-ws "wss://your-observer-server/ws/agent" \
  --observer-token "your-token"
```

### Grundlegende Interaktionen

```bash
# Bewegung
node scripts/interact.js --action move --connection-id <id> --direction forward
node scripts/interact.js --action jump --connection-id <id>
node scripts/interact.js --action swim --connection-id <id> --swim-action start

# Chat
node scripts/interact.js --action chat --connection-id <id> --message "Hallo!"

# Kampf
node scripts/interact.js --action attack --connection-id <id> --entity-name Zombie
node scripts/interact.js --action equip --connection-id <id> --slot 5 --destination head

# Schildblockierung
node scripts/interact.js --action block --connection-id <id> --block-action enable
node scripts/interact.js --action block --connection-id <id> --block-action disable

# Fahrzeugsteuerung
node scripts/interact.js --action boat --connection-id <id> --boat-action enter
node scripts/interact.js --action boat --connection-id <id> --boat-action exit
```

### Handwerk und Schmelzen

```bash
# Inventar-Handwerk (2x2)
node scripts/craft.js --connection-id <id> --item stick --amount 4

# Werkbank-Handwerk (3x3)
node scripts/craft.js --connection-id <id> --item diamond_pickaxe --use-workbench true

# Hergestellte Rüstung automatisch anlegen
node scripts/craft.js --connection-id <id> --item diamond_helmet --auto-equip

# Schmelzen
node scripts/smelt.js --connection-id <id> --item iron_ore --amount 10 --fuel coal

# Ofen leeren
node scripts/smelt.js --connection-id <id> --action clear --furnace-position "100,64,200"
```

### Container-Operationen

```bash
# Container anzeigen
node scripts/chest.js --connection-id <id> --action list --position "100,64,200"

# Gegenstände lagern
node scripts/chest.js --connection-id <id> --action store --position "100,64,200" --item diamond --amount 16

# Gegenstände entnehmen
node scripts/chest.js --connection-id <id> --action withdraw --position "100,64,200" --item iron_ingot --amount 32
```

## Architektur

```
minecraft-client/
├── SKILL.md                           # Skill-Definition
├── package.json                       # Node.js-Abhängigkeiten
├── scripts/
│   ├── connect.js                     # Haupt-Bot-Verbindung
│   ├── interact.js                    # Interaktionsbefehle
│   ├── disconnect.js                  # Trennen
│   ├── status.js                      # Statusabfrage
│   ├── vision.js                      # Screenshot
│   ├── inventory.js                   # Inventarverwaltung
│   ├── craft.js                       # Handwerkssystem
│   ├── smelt.js                       # Schmelzsystem
│   ├── chest.js                       # Container-Operationen
│   ├── sleep.js                       # Schlafsystem
│   ├── auto.js                        # Automatisierungsaufgaben
│   ├── farm.js                        # Landwirtschaftssystem
│   ├── build.js                       # Blaupausenbau
│   ├── monitor.js                     # Umgebungsüberwachung
│   ├── query.js                       # Abfragesystem
│   ├── trade.js                       # Händlerhandel
│   ├── events.js                      # Ereignisabonnement
│   ├── wiki.js                        # Wiki-Abfrage
│   └── multi.js                       # Multi-Bot-Koordination
└── references/
    └── observer-platform-protocol.md  # Beobachtungsplattform-Protokoll
```

## Beobachtbarkeit

### Unterstützte Ereignisse

| Ereignistyp | Beschreibung |
|-------------|-------------|
| `connected` | Bot mit Server verbunden |
| `disconnected` | Bot getrennt |
| `moved` | Bot bewegt oder navigiert |
| `jumped` | Bot gesprungen |
| `attacked` | Bot hat Entität angegriffen |
| `damaged` | Bot hat Schaden erhalten |
| `died` | Bot gestorben |
| `chat_sent` | Chatnachricht gesendet |
| `chat_received` | Chatnachricht empfangen |
| `block_broken` | Block zerstört |
| `block_placed` | Block platziert |
| `item_picked_up` | Gegenstand aufgehoben |
| `item_dropped` | Gegenstand fallen gelassen |
| `item_used` | Gegenstand benutzt |
| `inventory_changed` | Inventar geändert |
| `world_changed` | Welt geändert (Dimension) |
| `respawned` | Bot neu gespawnt |
| `item_crafted` | Gegenstand hergestellt |
| `item_smelted` | Gegenstand geschmolzen |
| `chest_opened` | Container geöffnet |
| `item_deposited` | Gegenstand eingelagert |
| `item_withdrawn` | Gegenstand entnommen |

## Beitragen

Beiträge sind willkommen! Bitte zögern Sie nicht, Issues und Pull Requests einzureichen.

## Lizenz

MIT
