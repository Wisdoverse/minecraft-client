---

## Table des matières

- [Fonctionnalités](#fonctionnalités)
- [Démarrage rapide](#démarrage-rapide)
- [Actions supportées](#actions-supportées)
- [Événements de plateforme](#événements-de-plateforme)
- [Structure du projet](#structure-du-projet)
- [Contribution](#contribution)
- [Licence](#licence)

## Fonctionnalités

### Capacités principales

| Catégorie | Description |
|-----------|-------------|
| **Connexion serveur** | Connexion à tout serveur Minecraft (hors ligne ou en ligne) |
| **Contrôle du mouvement** | Marcher, sauter, sprinter, nager, navigation avec pathfinder |
| **Système de combat** | Attaquer entités, utiliser armes et armure |
| **Gestion des items** | Voir inventaire, déplacer items, gérer équipement |
| **Système de craft** | Fabriquer via inventaire ou établi |
| **Système de fonderie** | Fondre minerais avec détection automatique du four |
| **Opérations conteneur** | Coffre, entonnoir, dropper, dispenser, tonneau, four |
| **Système de commerce** | Interface commerce villageois |
| **Système agricole** | Labourer, planter, récolter automatiquement |
| **Système de construction** | Construction avec plans, rapport de progression |
| **Système de vision** | Capture d'écran et info scène |
| **Requête Wiki** | Rechercher recettes et infos sur Minecraft Wiki |

### Fonctions avancées

| Fonction | Description |
|---------|-------------|
| **Contrôle véhicule** | Entrer/sortir bateau et wagonnet |
| **Blocage bouclier** | Activer/désactiver blocage bouclier |
| **Liste blanche drop** | Protéger items importants |
| **Auto-équipement** | Équiper automatiquement armure, bouclier, arc crafté |
| **Vider four** | Retirer tout le contenu du four |
| **Multi-conteneur** | Détection automatique type conteneur |

## Démarrage rapide

### Installation

```bash
git clone https://github.com/Wisdoverse/minecraft-client.git
cd minecraft-client
npm install
```

### Connexion au serveur

```bash
# Serveur hors ligne (par défaut)
node scripts/connect.js --host localhost --port 25565 --username MyBot --auth offline

# Avec plateforme d'observation
node scripts/connect.js --host localhost --port 25565 --username MyBot \
  --observer-ws "wss://your-observer-server/ws/agent" \
  --observer-token "your-token"
```

## Actions supportées

| Action | Description |
|--------|-------------|
| `move` | Se déplacer |
| `jump` | Sauter |
| `chat` | Envoyer message |
| `attack` | Attaquer entité |
| `craft` | Fabriquer item |
| `smelt` | Fondre item |
| `chest` | Opérations conteneur |
| `boat` | Entrer/sortir bateau |
| `block` | Blocage bouclier |

## Événements de plateforme

| Événement | Description |
|------------|-------------|
| `connected` | Bot connecté |
| `moved` | Bot déplacé |
| `attacked` | Bot a attaqué |
| `item_picked_up` | Item ramassé |
| `item_crafted` | Item fabriqué |

## Structure du projet

```
minecraft-client/
├── SKILL.md                           # Définition Skill
├── package.json                       # Dépendances
├── scripts/                           # 19 scripts
└── references/
    └── observer-platform-protocol.md  # Protocole observation
```

## Licence

MIT
