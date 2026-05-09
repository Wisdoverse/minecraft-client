<p align="center">
  <img src="https://raw.githubusercontent.com/Wisdoverse/mineworld/main/public/logo.svg" width="80" height="80" alt="logo">
</p>

<h1 align="center">Minecraft Client</h1>

<p align="center"><strong>Plateforme d'observation d'agent Minecraft en temps réel</strong></p>

<p align="center">Surveillez, suivez et visualisez vos agents IA Minecraft — tout en un seul endroit.</p>

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

## Table des matières

- [Fonctionnalités](#fonctionnalités)
- [Démarrage rapide](#démarrage-rapide)
- [Architecture](#architecture)
- [Observabilité](#observabilité)
- [Contribuer](#contribuer)
- [Licence](#licence)

## Fonctionnalités

### Capacités principales

| Catégorie | Description |
|-----------|-------------|
| **Connexion serveur** | Connexion à tout serveur Minecraft (hors ligne ou en ligne) |
| **Contrôle mouvement** | Marche, saut, sprint, natation, navigation par chemin |
| **Système de combat** | Attaquer des entités, utiliser armes et armures |
| **Gestion inventaire** | Voir inventaire, déplacer objets, gestion équipement |
| **Système artisanat** | Fabriquer avec inventaire ou établi |
| **Système fusion** | Fondre minerais, détecter fours automatiquement |
| **Opérations conteneur** | Coffre, entonnoir, droppeur, dispenser, tonneau, four |
| **Système commerce** | Interface de commerce avec villageois |
| **Système agriculture** | Labourer, planter, récolte automatiques |
| **Système construction** | Construction par blueprint avec rapport de progression |
| **Système vision** | Captures d'écran et récupération d'information |
| **Requête wiki** | Obtenir recettes et infos depuis Minecraft Wiki |

### Fonctionnalités avancées

| Fonction | Description |
|----------|-------------|
| **Contrôle véhicule** | Entrer/sortir bateau et wagonnet |
| **Blocage bouclier** | Activer/désactiver défense bouclier |
| **Liste blanche drop** | Protéger objets importants de suppression accidentelle |
| **Auto-équipement** | Équiper automatiquement armures, boucliers, arcs fabriqués |
| **Vider four** | Récupérer tous les objets du four en un clic |
| **Multi-conteneur** | Détection automatique du type de conteneur |

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

# Serveur en ligne avec authentification Microsoft
node scripts/connect.js --host mc.hypixel.net --port 25565 --username MyBot --auth microsoft

# Activer la plateforme d'observation
node scripts/connect.js --host localhost --port 25565 --username MyBot \
  --observer-ws "wss://your-observer-server/ws/agent" \
  --observer-token "your-token"
```

### Interactions basiques

```bash
# Mouvement
node scripts/interact.js --action move --connection-id <id> --direction forward
node scripts/interact.js --action jump --connection-id <id>
node scripts/interact.js --action swim --connection-id <id> --swim-action start

# Chat
node scripts/interact.js --action chat --connection-id <id> --message "Bonjour!"

# Combat
node scripts/interact.js --action attack --connection-id <id> --entity-name Zombie
node scripts/interact.js --action equip --connection-id <id> --slot 5 --destination head

# Blocage bouclier
node scripts/interact.js --action block --connection-id <id> --block-action enable
node scripts/interact.js --action block --connection-id <id> --block-action disable

# Contrôle véhicule
node scripts/interact.js --action boat --connection-id <id> --boat-action enter
node scripts/interact.js --action boat --connection-id <id> --boat-action exit
```

### Artisanat et fusion

```bash
# Artisanat inventaire (2x2)
node scripts/craft.js --connection-id <id> --item stick --amount 4

# Artisanat établi (3x3)
node scripts/craft.js --connection-id <id> --item diamond_pickaxe --use-workbench true

# Auto-équipement armure Manufacturée
node scripts/craft.js --connection-id <id> --item diamond_helmet --auto-equip

# Fondre
node scripts/smelt.js --connection-id <id> --item iron_ore --amount 10 --fuel coal

# Vider le four
node scripts/smelt.js --connection-id <id> --action clear --furnace-position "100,64,200"
```

### Opérations conteneur

```bash
# Voir conteneur
node scripts/chest.js --connection-id <id> --action list --position "100,64,200"

# Stocker objets
node scripts/chest.js --connection-id <id> --action store --position "100,64,200" --item diamond --amount 16

# Retirer objets
node scripts/chest.js --connection-id <id> --action withdraw --position "100,64,200" --item iron_ingot --amount 32
```

## Architecture

```
minecraft-client/
├── SKILL.md                           # Définition Skill
├── package.json                       # Dépendances Node.js
├── scripts/
│   ├── connect.js                     # Connexion Bot principale
│   ├── interact.js                    # Commandes d'interaction
│   ├── disconnect.js                  # Déconnexion
│   ├── status.js                      # Requête statut
│   ├── vision.js                      # Capture d'écran
│   ├── inventory.js                   # Gestion inventaire
│   ├── craft.js                       # Système artisanat
│   ├── smelt.js                       # Système fusion
│   ├── chest.js                       # Opérations conteneur
│   ├── sleep.js                       # Système sommeil
│   ├── auto.js                        # Tâches automatisées
│   ├── farm.js                        # Système agriculture
│   ├── build.js                       # Construction blueprint
│   ├── monitor.js                     # Surveillance environnement
│   ├── query.js                       # Système requêtes
│   ├── trade.js                       # Commerce villageois
│   ├── events.js                      # Abonnement événements
│   ├── wiki.js                        # Requête wiki
│   └── multi.js                       # Coordination multi-Bot
└── references/
    └── observer-platform-protocol.md  # Protocole plateforme observation
```

## Observabilité

### Événements supportés

| Type d'événement | Description |
|------------------|-------------|
| `connected` | Bot connecté au serveur |
| `disconnected` | Bot déconnecté |
| `moved` | Bot déplacé ou navigué |
| `jumped` | Bot sauté |
| `attacked` | Bot a attaqué une entité |
| `damaged` | Bot a reçu des dégâts |
| `died` | Bot mort |
| `chat_sent` | Message chat envoyé |
| `chat_received` | Message chat reçu |
| `block_broken` | Bloc cassé |
| `block_placed` | Bloc placé |
| `item_picked_up` | Objet ramassé |
| `item_dropped` | Objet jeté |
| `item_used` | Objet utilisé |
| `inventory_changed` | Inventaire changé |
| `world_changed` | Monde changé (dimension) |
| `respawned` | Bot réapparu |
| `item_crafted` | Objet fabriqué |
| `item_smelted` | Objet fondu |
| `chest_opened` | Conteneur ouvert |
| `item_deposited` | Objet déposé |
| `item_withdrawn` | Objet retiré |

## Contribuer

Les contributions sont les bienvenues ! N'hésitez pas à soumettre des Issues et Pull Requests.

## Licence

MIT
