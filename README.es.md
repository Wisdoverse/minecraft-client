<p align="center">
  <img src="https://raw.githubusercontent.com/Wisdoverse/mineworld/main/public/logo.svg" width="80" height="80" alt="logo">
</p>

<h1 align="center">Minecraft Client</h1>

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

### Capacidades principales

| Categoría | Descripción |
|-----------|-------------|
| **Conexión servidor** | Conectar a cualquier servidor Minecraft (sin conexión o en línea) |
| **Control de movimiento** | Caminar, saltar, sprint, nadar, navegación por rutas |
| **Sistema de combate** | Atacar entidades, usar armas y armaduras |
| **Gestión de inventario** | Ver inventario, mover objetos, gestión de equipamiento |
| **Sistema de crafteo** | Fabricar con inventario o mesa de crafteo |
| **Sistema de fundición** | Fundir minerales, detectar hornos automáticamente |
| **Operaciones de contenedor** | Cofre, embudo, tolva, dispensador, barril, horno |
| **Sistema de comercio** | Interfaz de comercio con aldeanos |
| **Sistema de agricultura** | Arar, plantar, cosechar automáticamente |
| **Sistema de construcción** | Construcción por planos con reporte de progreso |
| **Sistema de visión** | Capturas de pantalla y obtención de información |
| **Consulta wiki** | Obtener recetas e información de Minecraft Wiki |

### Funciones avanzadas

| Función | Descripción |
|---------|-------------|
| **Control de vehículos** | Entrar/salir de barcos y vagones |
| **Bloqueo con escudo** | Activar/desactivar defensa con escudo |
| **Lista blanca de drop** | Proteger objetos importantes de eliminación accidental |
| **Auto-equipamiento** | Equipar automáticamente armaduras, escudos, arcos fabricados |
| **Vaciar horno** | Obtener todos los objetos del horno de una vez |
| **Multi-contenedor** | Detección automática del tipo de contenedor |

## Inicio rápido

### Instalación

```bash
git clone https://github.com/Wisdoverse/minecraft-client.git
cd minecraft-client
npm install
```

### Conectar al servidor

```bash
# Servidor sin conexión (predeterminado)
node scripts/connect.js --host localhost --port 25565 --username MyBot --auth offline

# Servidor en línea con autenticación Microsoft
node scripts/connect.js --host mc.hypixel.net --port 25565 --username MyBot --auth microsoft

# Activar plataforma de observación
node scripts/connect.js --host localhost --port 25565 --username MyBot \
  --observer-ws "wss://your-observer-server/ws/agent" \
  --observer-token "your-token"
```

### Interacciones básicas

```bash
# Movimiento
node scripts/interact.js --action move --connection-id <id> --direction forward
node scripts/interact.js --action jump --connection-id <id>
node scripts/interact.js --action swim --connection-id <id> --swim-action start

# Chat
node scripts/interact.js --action chat --connection-id <id> --message "¡Hola!"

# Combate
node scripts/interact.js --action attack --connection-id <id> --entity-name Zombie
node scripts/interact.js --action equip --connection-id <id> --slot 5 --destination head

# Bloqueo con escudo
node scripts/interact.js --action block --connection-id <id> --block-action enable
node scripts/interact.js --action block --connection-id <id> --block-action disable

# Control de vehículos
node scripts/interact.js --action boat --connection-id <id> --boat-action enter
node scripts/interact.js --action boat --connection-id <id> --boat-action exit
```

### Crafteo y fundición

```bash
# Crafteo en inventario (2x2)
node scripts/craft.js --connection-id <id> --item stick --amount 4

# Crafteo en mesa (3x3)
node scripts/craft.js --connection-id <id> --item diamond_pickaxe --use-workbench true

# Auto-equipar armadura fabricada
node scripts/craft.js --connection-id <id> --item diamond_helmet --auto-equip

# Fundir
node scripts/smelt.js --connection-id <id> --item iron_ore --amount 10 --fuel coal

# Vaciar horno
node scripts/smelt.js --connection-id <id> --action clear --furnace-position "100,64,200"
```

### Operaciones de contenedor

```bash
# Ver contenedor
node scripts/chest.js --connection-id <id> --action list --position "100,64,200"

# Guardar objetos
node scripts/chest.js --connection-id <id> --action store --position "100,64,200" --item diamond --amount 16

# Retirar objetos
node scripts/chest.js --connection-id <id> --action withdraw --position "100,64,200" --item iron_ingot --amount 32
```

## Arquitectura

```
minecraft-client/
├── SKILL.md                           # Definición de Skill
├── package.json                       # Dependencias Node.js
├── scripts/
│   ├── connect.js                     # Conexión principal del Bot
│   ├── interact.js                    # Comandos de interacción
│   ├── disconnect.js                  # Desconexión
│   ├── status.js                      # Consulta de estado
│   ├── vision.js                      # Captura de pantalla
│   ├── inventory.js                   # Gestión de inventario
│   ├── craft.js                       # Sistema de crafteo
│   ├── smelt.js                       # Sistema de fundición
│   ├── chest.js                       # Operaciones de contenedor
│   ├── sleep.js                       # Sistema de sueño
│   ├── auto.js                        # Tareas automatizadas
│   ├── farm.js                        # Sistema de agricultura
│   ├── build.js                       # Construcción por planos
│   ├── monitor.js                     # Monitoreo de entorno
│   ├── query.js                       # Sistema de consultas
│   ├── trade.js                       # Comercio con aldeanos
│   ├── events.js                      # Suscripción de eventos
│   ├── wiki.js                        # Consulta wiki
│   └── multi.js                       # Coordinación multi-Bot
└── references/
    └── observer-platform-protocol.md  # Protocolo de plataforma de observación
```

## Observabilidad

### Eventos soportados

| Tipo de evento | Descripción |
|----------------|-------------|
| `connected` | Bot conectado al servidor |
| `disconnected` | Bot desconectado |
| `moved` | Bot movido o navegado |
| `jumped` | Bot saltó |
| `attacked` | Bot atacó entidad |
| `damaged` | Bot recibió daño |
| `died` | Bot murió |
| `chat_sent` | Mensaje de chat enviado |
| `chat_received` | Mensaje de chat recibido |
| `block_broken` | Bloque roto |
| `block_placed` | Bloque colocado |
| `item_picked_up` | Objeto recogido |
| `item_dropped` | Objeto soltado |
| `item_used` | Objeto usado |
| `inventory_changed` | Inventario cambiado |
| `world_changed` | Mundo cambiado (dimensión) |
| `respawned` | Bot reaparecido |
| `item_crafted` | Objeto fabricado |
| `item_smelted` | Objeto fundido |
| `chest_opened` | Contenedor abierto |
| `item_deposited` | Objeto depositado |
| `item_withdrawn` | Objeto retirado |

## Contribuir

¡Las contribuciones son bienvenidas! No dudes en enviar Issues y Pull Requests.

## Licencia

MIT
