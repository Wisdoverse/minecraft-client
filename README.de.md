---

## Inhaltsverzeichnis

- [Funktionen](#funktionen)
- [Schnellstart](#schnellstart)
- [Unterstützte Aktionen](#unterstützte-aktionen)
- [Plattform-Events](#plattform-events)
- [Projektstruktur](#projektstruktur)
- [Beitrag](#beitrag)
- [Lizenz](#lizenz)

## Funktionen

### Hauptfunktionen

| Kategorie | Beschreibung |
|-----------|-------------|
| **Serververbindung** | Verbindung zu jedem Minecraft-Server (offline oder online) |
| **Bewegungskontrolle** | Gehen, Springen, Rennen, Schwimmen, Navigation mit Pathfinder |
| **Kampfsystem** | Entitäten angreifen, Waffen und Rüstung verwenden |
| **Gegenstandsverwaltung** | Inventar anzeigen, Items bewegen, Ausrüstung verwalten |
| **Handwerkssystem** | Herstellen über Inventar oder Werkbank |
| **Schmelzsystem** | Erze schmelzen mit automatischer Ofenerkennung |
| **Behälteroperationen** | Truhe, Trichter, Spender, Fass, Ofen |
| **Handelssystem** | Dorfbewohner-Handelsinterface |
| **Landwirtschaftssystem** | Automatisches Pflügen, Pflanzen, Ernten |
| **Bausystem** | Bau mit Blaupausen, Fortschrittsberichte |
| **Visualsystem** | Screenshot und Szeneninformation |
| **Wiki-Abfrage** | Rezepte und Infos in Minecraft Wiki suchen |

### Erweiterte Funktionen

| Funktion | Beschreibung |
|---------|-------------|
| **Fahrzeugkontrolle** | Ein-/Aussteigen bei Boot und Lore |
| **Schildblockierung** | Schildblockierung ein/aus |
| **Drop-Whitelist** | Wichtige Items vor versehentlichem Wegwerfen schützen |
| **Auto-Ausrüsten** | Hergestellte Rüstung, Schilde, Bögen automatisch anlegen |
| **Ofen leeren** | Gesamten Inhalt des Ofens auf einmal entnehmen |
| **Multi-Container** | Automatische Erkennung des Containertyps |

## Schnellstart

### Installation

```bash
git clone https://github.com/Wisdoverse/minecraft-client.git
cd minecraft-client
npm install
```

### Serververbindung

```bash
# Offline-Server (Standard)
node scripts/connect.js --host localhost --port 25565 --username MyBot --auth offline

# Mit Beobachtungsplattform
node scripts/connect.js --host localhost --port 25565 --username MyBot \
  --observer-ws "wss://your-observer-server/ws/agent" \
  --observer-token "your-token"
```

## Unterstützte Aktionen

| Aktion | Beschreibung |
|--------|-------------|
| `move` | Sich in Richtung bewegen |
| `jump` | Springen |
| `chat` | Nachricht senden |
| `attack` | Entität angreifen |
| `craft` | Item herstellen |
| `smelt` | Item schmelzen |
| `chest` | Behälteroperationen |
| `boat` | Ein-/Aussteigen Boot |
| `block` | Schildblockierung |

## Plattform-Events

| Event | Beschreibung |
|-------|-------------|
| `connected` | Bot verbunden |
| `moved` | Bot bewegt |
| `attacked` | Bot hat angegriffen |
| `item_picked_up` | Item aufgehoben |

## Projektstruktur

```
minecraft-client/
├── SKILL.md                           # Skill-Definition
├── package.json                       # Abhängigkeiten
├── scripts/                           # 19 Scripts
└── references/
    └── observer-platform-protocol.md  # Beobachtungsprotokoll
```

## Lizenz

MIT
