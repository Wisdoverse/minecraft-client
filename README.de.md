# Minecraft Client Skill

Ein umfassendes Minecraft-Bot-Skill zum Verbinden mit einem beliebigen Minecraft-Server und Durchführen vollständiger Spielinteraktionen, mit integrierter Observer-Plattform-Integration für Echtzeit-Agentenüberwachung.

## Funktionen

### Kernfunktionen
- **Serververbindung**: Verbindung zu einem beliebigen Minecraft-Server (Offline- oder Online-Modus)
- **Bewegungssteuerung**: Gehen, Springen, Sprinten, Schwimmen, Navigation mit Pathfinder
- **Kampfsystem**: Entitäten angreifen, Waffen und Rüstungen verwenden
- **Gegenstandsverwaltung**: Inventar anzeigen, Gegenstände bewegen, Ausrüstungsverwaltung
- **Handwerkssystem**: Gegenstände mit Inventar oder Werkbank herstellen
- **Schmelzsystem**: Erze schmelzen mit automatischer Ofenerkennung
- **Container-Operationen**: Zugriff auf Truhen, Trichter, Spender, Werfer, Fässer, Öfen
- **Handel**: Handelsoberfläche mit Dorfbewohnern
- **Landwirtschaft**: Automatisches Pflügen, Pflanzen, Ernten
- **Bauen**: Bauweise basierend auf Blaupausen mit Fortschrittsberichten
- **Vision**: Screenshot mit Szeneninformationen
- **Wiki-Abfrage**: Rezepte und Informationen in Minecraft Wiki suchen

### Erweiterte Funktionen
- **Fahrzeugsteuerung**: Ein-/Aussteigen von Booten und Loren
- **Schildblockierung**: Schildblockierung aktivieren/deaktivieren
- **Drop-Whitelist**: Wichtige Gegenstände vor versehentlichem Löschen schützen
- **Auto-Ausrüstung**: Hergestellte Rüstungen, Schilde, Bögen automatisch anlegen
- **Ofen leeren**: Alle Gegenstände aus dem Ofen mit einem Klick entnehmen
- **Multi-Container-Unterstützung**: Automatische Erkennung von Containertypen

### Observer-Plattform-Integration
- Echtzeit-Agentenstatus-Updates (Position, Gesundheit, Inventar, Ausrüstung)
- Welt-Snapshot-Berichte (Blöcke, Entitäten)
- Ereignisverfolgung (Bewegungen, Angriffe, Handwerk, Chat usw.)
- WebSocket-basierte Kommunikation
- Automatische Wiederholung mit Backoff-Strategie

## Anforderungen

- Node.js 16+
- npm

## Installation

```bash
# Repository klonen
git clone https://github.com/Wisdoverse/minecraft-client.git
cd minecraft-client

# Abhängigkeiten installieren
npm install
```

## Schnellstart

### 1. Mit Server verbinden

```bash
# Offline-Server (Standard)
node scripts/connect.js --host localhost --port 25565 --username MyBot --auth offline

# Server mit Microsoft-Authentifizierung
node scripts/connect.js --host mc.hypixel.net --port 25565 --username MyBot --auth microsoft --password "your-password"

# Mit Observer-Plattform
node scripts/connect.js --host localhost --port 25565 --username MyBot \
  --observer-ws "wss://your-observer-server/ws/agent" \
  --observer-token "your-token"
```

### 2. Grundlegende Interaktionen

```bash
# Bewegung
node scripts/interact.js --action move --connection-id <id> --direction forward
node scripts/interact.js --action jump --connection-id <id>
node scripts/interact.js --action swim --connection-id <id> --swim-action start

# Chat
node scripts/interact.js --action chat --connection-id <id> --message "Hallo!"

# Block-Interaktion
node scripts/interact.js --action break --connection-id <id> --position "10,64,10"
node scripts/interact.js --action place --connection-id <id> --position "10,65,10"

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

### 3. Gegenstandsverwaltung

```bash
# Gegenstände fallen lassen
node scripts/interact.js --action drop --connection-id <id> --item diamond --count 5

# Whitelist-Schutz
node scripts/interact.js --action drop --connection-id <id> --whitelist-action add --item diamond_sword
node scripts/interact.js --action drop --connection-id <id> --whitelist-action list

# Inventar
node scripts/inventory.js --action list --connection-id <id>
```

### 4. Handwerk und Schmelzen

```bash
# Inventar-Handwerk (2x2 Rezepte)
node scripts/craft.js --connection-id <id> --item stick --amount 4

# Werkbank-Handwerk (3x3 Rezepte)
node scripts/craft.js --connection-id <id> --item diamond_pickaxe --use-workbench true

# Auto-Ausrüstung
node scripts/craft.js --connection-id <id> --item diamond_helmet --auto-equip

# Schmelzen
node scripts/smelt.js --connection-id <id> --item iron_ore --amount 10 --fuel coal

# Ofen leeren
node scripts/smelt.js --connection-id <id> --action clear --furnace-position "100,64,200"
```

### 5. Container-Operationen

```bash
# Inhalt auflisten
node scripts/chest.js --connection-id <id> --action list --position "100,64,200"

# Gegenstände lagern
node scripts/chest.js --connection-id <id> --action store --position "100,64,200" --item diamond --amount 16

# Gegenstände entnehmen
node scripts/chest.js --connection-id <id> --action withdraw --position "100,64,200" --item iron_ingot --amount 32
```

## Projektstruktur

```
minecraft-client/
├── README.md                 # Englische Dokumentation
├── README.zh.md             # Chinesische Dokumentation
├── README.ja.md             # Japanische Dokumentation
├── README.ko.md             # Koreanische Dokumentation
├── README.es.md             # Spanische Dokumentation
├── README.fr.md             # Französische Dokumentation
├── README.de.md             # Deutsche Dokumentation
├── SKILL.md                 # Skill-Definition
├── package.json             # Abhängigkeiten
├── scripts/                 # 19 Skripte
└── references/
    └── observer-platform-protocol.md
```

## Lizenz

MIT
