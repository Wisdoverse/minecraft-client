# Minecraft Client Skill

Une skill de bot Minecraft complète pour se connecter à n'importe quel serveur Minecraft et effectuer des interactions de jeu complètes, avec une intégration de plateforme d'observation intégrée pour la surveillance des agents en temps réel.

## Fonctionnalités

### Capacités Principales
- **Connexion au Serveur**: Connexion à n'importe quel serveur Minecraft (mode hors ligne ou en ligne)
- **Contrôle des Mouvements**: Marcher, sauter, sprinter, nager, naviguer avec pathfinder
- **Système de Combat**: Attaquer des entités, utiliser armes et armures
- **Gestion des Objets**: Voir l'inventaire, déplacer des objets, gestion de l'équipement
- **Système d'Artisanat**: Fabriquer des objets avec l'inventaire ou l'établi
- **Système de Fonte**: Fondre des minerais avec détection automatique du four
- **Opérations de Conteneurs**: Accès aux coffres, entonnoirs, distributors, tireurs, tonneaux, fours
- **Commerce**: Interface de commerce avec les villageois
- **Agriculture**: Labourer, planter, récolter automatiquement
- **Construction**: Construction basée sur des plans avec rapports de progression
- **Vision**: Capture d'écran avec informations de scène
- **Requête Wiki**: Rechercher des recettes et informations sur Minecraft Wiki

### Fonctionnalités Avancées
- **Contrôle de Véhicules**: Entrer/sortir de bateau et wagonnet
- **Blocage au Bouclier**: Activer/désactiver le blocage au bouclier
- **Liste Blanche de Drop**: Protéger les objets importants contre la suppression accidentelle
- **Auto-Équipement**: Équiper automatiquement armures, boucliers, arcs fabriqués
- **Vider le Four**: Retirer tous les objets du four en un clic
- **Support Multi-Conteneurs**: Détection automatique des types de conteneurs

### Intégration de Plateforme d'Observation
- Mises à jour d'état de l'agent en temps réel (position, santé, inventaire, équipement)
- Rapports d'instantanés du monde (blocs, entités)
- Suivi des événements (mouvements, attaques, artisanat, chat, etc.)
- Communication basée sur WebSocket
- Reconnexion automatique avec stratégie de backoff

## Configuration Requise

- Node.js 16+
- npm

## Installation

```bash
# Cloner le dépôt
git clone https://github.com/Wisdoverse/minecraft-client.git
cd minecraft-client

# Installer les dépendances
npm install
```

## Démarrage Rapide

### 1. Connecter au Serveur

```bash
# Serveur hors ligne (par défaut)
node scripts/connect.js --host localhost --port 25565 --username MyBot --auth offline

# Serveur avec authentification Microsoft
node scripts/connect.js --host mc.hypixel.net --port 25565 --username MyBot --auth microsoft --password "your-password"

# Avec Plateforme d'Observation
node scripts/connect.js --host localhost --port 25565 --username MyBot \
  --observer-ws "wss://your-observer-server/ws/agent" \
  --observer-token "your-token"
```

### 2. Interactions de Base

```bash
# Mouvement
node scripts/interact.js --action move --connection-id <id> --direction forward
node scripts/interact.js --action jump --connection-id <id>
node scripts/interact.js --action swim --connection-id <id> --swim-action start

# Chat
node scripts/interact.js --action chat --connection-id <id> --message "Bonjour!"

# Interaction avec Blocs
node scripts/interact.js --action break --connection-id <id> --position "10,64,10"
node scripts/interact.js --action place --connection-id <id> --position "10,65,10"

# Combat
node scripts/interact.js --action attack --connection-id <id> --entity-name Zombie
node scripts/interact.js --action equip --connection-id <id> --slot 5 --destination head

# Blocage au Bouclier
node scripts/interact.js --action block --connection-id <id> --block-action enable
node scripts/interact.js --action block --connection-id <id> --block-action disable

# Contrôle de Véhicules
node scripts/interact.js --action boat --connection-id <id> --boat-action enter
node scripts/interact.js --action boat --connection-id <id> --boat-action exit
```

### 3. Gestion des Objets

```bash
# Jeter des objets
node scripts/interact.js --action drop --connection-id <id> --item diamond --count 5

# Protection Liste Blanche
node scripts/interact.js --action drop --connection-id <id> --whitelist-action add --item diamond_sword
node scripts/interact.js --action drop --connection-id <id> --whitelist-action list

# Inventaire
node scripts/inventory.js --action list --connection-id <id>
```

### 4. Artisanat et Fonte

```bash
# Artisanat dans Inventaire (recettes 2x2)
node scripts/craft.js --connection-id <id> --item stick --amount 4

# Artisanat à l'Établi (recettes 3x3)
node scripts/craft.js --connection-id <id> --item diamond_pickaxe --use-workbench true

# Auto-Équipement
node scripts/craft.js --connection-id <id> --item diamond_helmet --auto-equip

# Fonte
node scripts/smelt.js --connection-id <id> --item iron_ore --amount 10 --fuel coal

# Vider le Four
node scripts/smelt.js --connection-id <id> --action clear --furnace-position "100,64,200"
```

### 5. Opérations de Conteneurs

```bash
# Lister le Contenu
node scripts/chest.js --connection-id <id> --action list --position "100,64,200"

# Stocker des Objets
node scripts/chest.js --connection-id <id> --action store --position "100,64,200" --item diamond --amount 16

# Retirer des Objets
node scripts/chest.js --connection-id <id> --action withdraw --position "100,64,200" --item iron_ingot --amount 32
```

## Structure du Projet

```
minecraft-client/
├── README.md                 # Documentation en anglais
├── README.zh.md             # Documentation en chinois
├── README.ja.md             # Documentation en japonais
├── README.ko.md             # Documentation en coréen
├── README.es.md             # Documentation en espagnol
├── README.fr.md             # Documentation en français
├── SKILL.md                 # Définition de la Skill
├── package.json             # Dépendances
├── scripts/                 # 19 scripts
└── references/
    └── observer-platform-protocol.md
```

## Licence

MIT
