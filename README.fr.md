<!-- header -->
---

<p align="center">
  <img src="https://raw.githubusercontent.com/Wisdoverse/mineworld/main/public/logo.svg" width="80" height="80" alt="logo">
</p>

<h1 align="center">MineWorld</h1>

<p align="center"><strong>Plateforme d'Observation d'Agents Minecraft en Temps Réel</strong></p>

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

### Surveillance en temps réel

- **Suivi des agents** — Suivez en temps réel la position, la santé, l'inventaire et le statut des agents
- **Flux d'événements** — Diffusez tous les événements des agents vers la plateforme d'observation
- **Instantanés du monde** — Instantanés périodiques des blocs et entités autour des agents

### Outils intégrés

- **Recherche de chemin** — Naviguez vers n'importe quel emplacement avec A*
- **Combat** — Attaquez des entités avec un comportement configurable
- **Inventaire** — Gestion complète de l'inventaire (déplacer, équiper, déposer des objets)
- **Artisanat** — Fabriquez des objets avec établi ou inventaire
- **Fondage** — Fondre des minerais et cuisiner
- **Agriculture** — Culture automatique (blé, carottes, pommes de terre, betteraves)
- **Construction** — Construisez des structures à partir de fichiers blueprint
- **Commerce** — Commercez avec les villageois
- **Sommeil** — Trouver et dormir dans un lit
- **Pêche** — Pêche automatique

### Plateforme d'observation

- **Connexion WebSocket** — Communication bidirectionnelle en temps réel
- **Abonnement aux événements** — Abonnez-vous à des types d'événements spécifiques
- **Coordination d'équipe** — Support multi-agents
- **Rapports de progression** — Suivi de la progression de construction

## Démarrage rapide

### Prérequis

- Node.js 18+
- Serveur Minecraft (Java Edition 1.8+)

### Installation

```bash
git clone https://github.com/Wisdoverse/mineworld.git
cd mineworld
npm install
npm run dev
```

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                   Plateforme d'Observation                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  Tableau de │  │   Flux      │  │   Gestion   │         │
│  │   bord      │  │   d'événements│ │   d'équipe  │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │ WebSocket
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     Client Minecraft                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Mineflayer │  │  Pathfinder  │  │   Actions  │         │
│  │             │  │             │  │   Manager   │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

## Observabilité

### Types d'événements

| Événement | Description |
|-----------|-------------|
| `connected` | Agent connecté au serveur |
| `disconnected` | Agent déconnecté |
| `moved` | Agent déplacé |
| `jumped` | Agent sauté |
| `attacked` | Agent a attaqué une entité |
| `damaged` | Agent a subi des dégâts |
| `died` | Agent mort |
| `chat_sent` | Message de chat envoyé |
| `chat_received` | Message de chat reçu |
| `block_broken` | Bloc cassé |
| `block_placed` | Bloc placé |
| `item_picked_up` | Objet ramassé |
| `item_dropped` | Objet déposé |
| `inventory_changed` | Inventaire modifié |

## Contribuer

Les contributions sont les bienvenues ! N'hésitez pas à soumettre une Pull Request.

## Licence

Ce projet est sous licence MIT.
