---

## Tabla de contenidos

- [Características](#características)
- [Inicio rápido](#inicio-rápido)
- [Acciones soportadas](#acciones-soportadas)
- [Eventos de plataforma](#eventos-de-plataforma)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Contribución](#contribución)
- [Licencia](#licencia)

## Características

### Capacidades principales

| Categoría | Descripción |
|-----------|-------------|
| **Conexión a servidor** | Conectar a cualquier servidor Minecraft (offline u online) |
| **Control de movimiento** | Caminar, saltar, correr, nadar, navegación con pathfinder |
| **Sistema de combate** | Atacar entidades, usar armas y armadura |
| **Gestión de items** | Ver inventario, mover items, gestionar equipamiento |
| **Sistema de crafteo** | Fabricar usando inventario o mesa de crafteo |
| **Sistema de fundición** | Fundir minerales con detección automática de horno |
| **Operaciones de contenedor** | Cofre, tolva, dispensador, barril, horno |
| **Sistema de comercio** | Interfaz de comercio con aldeanos |
| **Sistema de agricultura** | Arar, plantar, cosechar automáticamente |
| **Sistema de construcción** | Construcción con planos, reporte de progreso |
| **Sistema de visión** | Captura de pantalla e información de escena |
| **Consulta Wiki** | Buscar recetas e información en Minecraft Wiki |

### Funciones avanzadas

| Función | Descripción |
|---------|-------------|
| **Control de vehículos** | Entrar/salir de barcos y vagonetas |
| **Bloqueo con escudo** | Activar/desactivar bloqueo de escudo |
| **Lista blanca de drop** | Proteger items importantes de descarte accidental |
| **Auto-equipar** | Equipar automáticamente armadura, escudos, arcos fabricados |
| **Limpiar horno** | Retirar todo el contenido del horno con un clic |
| **Multi-contenedor** | Detección automática de tipo de contenedor |

## Inicio rápido

### Instalación

```bash
git clone https://github.com/Wisdoverse/minecraft-client.git
cd minecraft-client
npm install
```

### Conexión al servidor

```bash
# Servidor offline (predeterminado)
node scripts/connect.js --host localhost --port 25565 --username MyBot --auth offline

# Servidor con auth Microsoft
node scripts/connect.js --host mc.hypixel.net --port 25565 --username MyBot --auth microsoft --password "your-password"

# Con plataforma de observación
node scripts/connect.js --host localhost --port 25565 --username MyBot \
  --observer-ws "wss://your-observer-server/ws/agent" \
  --observer-token "your-token"
```

## Acciones soportadas

| Acción | Descripción |
|--------|-------------|
| `move` | Mover en dirección |
| `jump` | Saltar |
| `chat` | Enviar mensaje |
| `break` | Romper bloque |
| `place` | Colocar bloque |
| `attack` | Atacar entidad |
| `equip` | Equipar item |
| `drop` | Soltar item |
| `look` | Mirar posición |
| `eat` | Comer |
| `sleep` / `wake` | Dormir / Despertar |
| `fish` | Pescar |
| `boat` | Entrar/salir de barco |
| `minecart` | Entrar/salir de vagoneta |
| `block` | Bloqueo con escudo |
| `goto` | Navegar a posición |
| `craft` | Fabricar item |
| `smelt` | Fundir item |
| `chest` | Operaciones de contenedor |
| `trade` | Comercio con aldeanos |
| `farm` | Operaciones agrícolas |
| `build` | Construcción con planos |

## Eventos de plataforma

| Evento | Descripción |
|--------|-------------|
| `connected` | Bot conectado |
| `disconnected` | Bot desconectado |
| `moved` | Bot movido |
| `attacked` | Bot atacó |
| `item_picked_up` | Item recogido |
| `item_crafted` | Item fabricado |
| `item_smelted` | Item fundido |
| `chest_opened` | Contenedor abierto |

## Estructura del proyecto

```
minecraft-client/
├── SKILL.md                           # Definición del Skill
├── package.json                       # Dependencias
├── scripts/                           # 19 scripts
│   ├── connect.js                     # Conexión principal
│   ├── interact.js                    # Comandos interactivos
│   ├── craft.js, smelt.js             # Crafteo y fundición
│   ├── chest.js                       # Contenedores
│   └── ...
└── references/
    └── observer-platform-protocol.md  # Protocolo de observación
```

## Contribución

¡Las contribuciones son bienvenidas!

## Licencia

MIT
