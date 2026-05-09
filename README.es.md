<!-- header -->
---

<p align="center">
  <img src="https://raw.githubusercontent.com/Wisdoverse/mineworld/main/public/logo.svg" width="80" height="80" alt="logo">
</p>

<h1 align="center">MineWorld</h1>

<p align="center"><strong>Plataforma de Observación de Agentes Minecraft en Tiempo Real</strong></p>

<p align="center">Monitorea, rastrea y visualiza tus agentes IA de Minecraft — todo en un solo lugar.</p>

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

## Tabla de contenidos

- [Características](#características)
- [Inicio rápido](#inicio-rápido)
- [Arquitectura](#arquitectura)
- [Observabilidad](#observabilidad)
- [Contribuir](#contribuir)
- [Licencia](#licencia)

## Características

### Monitoreo en tiempo real

- **Seguimiento de agentes** — Rastrea posición, salud, inventario y estado en tiempo real
- **Flujo de eventos** — Transmite todos los eventos al plataforma de observación
- **Instantáneas del mundo** — Instantáneas periódicas de bloques y entidades

### Herramientas integradas

- **Búsqueda de rutas** — Navega a cualquier ubicación usando A*
- **Combate** — Ataca entidades con comportamiento configurable
- **Inventario** — Gestión completa (mover, equipar, tirar objetos)
- **Fabricación** — Fabrica objetos con mesa de trabajo o inventario
- **Fundición** — Funde minerales y cocina alimentos
- **Agricultura** — Cultivo automático (trigo, zanahorias, papas, remolacha)
- **Construcción** — Construye estructuras desde archivos blueprint
- **Comercio** — Comercia con aldeanos
- **Sueño** — Encontrar y dormir en camas
- **Pesca** — Pesca automática

### Plataforma de observación

- **Conexión WebSocket** — Comunicación bidireccional en tiempo real
- **Suscripción a eventos** — Suscríbete a tipos de eventos específicos
- **Coordinación de equipo** — Soporte multi-agente
- **Informes de progreso** — Seguimiento de progreso de construcción

## Inicio rápido

### Requisitos previos

- Node.js 18+
- Servidor Minecraft (Java Edition 1.8+)

### Instalación

```bash
git clone https://github.com/Wisdoverse/mineworld.git
cd mineworld
npm install
npm run dev
```

## Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                   Plataforma de Observación                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Panel de  │  │   Flujo de  │  │   Gestión   │         │
│  │   control   │  │   eventos   │  │   de equipo │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │ WebSocket
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Cliente Minecraft                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Mineflayer │  │  Pathfinder │  │   Acciones  │         │
│  │             │  │            │  │   Manager   │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

## Observabilidad

### Tipos de eventos

| Evento | Descripción |
|--------|-------------|
| `connected` | Agente conectado al servidor |
| `disconnected` | Agente desconectado |
| `moved` | Agente movido |
| `jumped` | Agente saltó |
| `attacked` | Agente atacó una entidad |
| `damaged` | Agente recibió daño |
| `died` | Agente murió |
| `chat_sent` | Mensaje de chat enviado |
| `chat_received` | Mensaje de chat recibido |
| `block_broken` | Bloque roto |
| `block_placed` | Bloque colocado |
| `item_picked_up` | Objeto recogido |
| `item_dropped` | Objeto tirado |
| `inventory_changed` | Inventario modificado |

## Contribuir

¡Las contribuciones son bienvenidas! Siéntete libre de enviar un Pull Request.

## Licencia

Este proyecto está bajo la licencia MIT.
