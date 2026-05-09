# Minecraft Client Skill

Una skill completa de bot de Minecraft para conectar a cualquier servidor de Minecraft y realizar interacciones de juego completas, con integración de plataforma observadora incorporada para monitoreo de agentes en tiempo real.

## Características

### Capacidades Principales
- **Conexión al Servidor**: Conectar a cualquier servidor de Minecraft (modo offline u online)
- **Control de Movimiento**: Caminar, saltar, sprint, nadar, navegar con pathfinder
- **Sistema de Combate**: Atacar entidades, usar armas y armaduras
- **Gestión de Ítems**: Ver inventario, mover ítems, gestión de equipamiento
- **Sistema de Crafteo**: Fabricar ítems usando inventario o mesa de crafteo
- **Sistema de Fundición**: Fundir minerales con detección automática de horno
- **Operaciones de Contenedores**: Acceso a cofres, tolvas, dispensadores,上月发射器, toneles, hornos
- **Comercio**: Interfaz de comercio con aldeanos
- **Agricultura**: Arar, plantar, cosechar cultivos automáticamente
- **Construcción**: Construcción basada en planos con informes de progreso
- **Visión**: Captura de pantalla con información de escena
- **Consulta Wiki**: Buscar recetas e información en Minecraft Wiki

### Características Avanzadas
- **Control de Vehículos**: Entrar/salir de barcos y vagonetas
- **Bloqueo con Escudo**: Activar/desactivar bloqueo con escudo
- **Lista Blanca de Drop**: Proteger ítems importantes de eliminación accidental
- **Auto-Equipar**: Equipar automáticamente armaduras, escudos, arcos fabricados
- **Limpiar Horno**: Retirar todos los ítems del horno con un clic
- **Soporte Multi-Contenedor**: Detección automática de tipos de contenedores

### Integración con Plataforma Observadora
- Actualizaciones de estado del agente en tiempo real (posición, salud, inventario, equipamiento)
- Informes de instantáneas del mundo (bloques, entidades)
- Seguimiento de eventos (movimientos, ataques, crafteo, chat, etc.)
- Comunicación basada en WebSocket
- Reconexión automática con estrategia de retroceso

## Requisitos

- Node.js 16+
- npm

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/Wisdoverse/minecraft-client.git
cd minecraft-client

# Instalar dependencias
npm install
```

## Inicio Rápido

### 1. Conectar al Servidor

```bash
# Servidor offline (predeterminado)
node scripts/connect.js --host localhost --port 25565 --username MyBot --auth offline

# Servidor con autenticación Microsoft
node scripts/connect.js --host mc.hypixel.net --port 25565 --username MyBot --auth microsoft --password "your-password"

# Con Plataforma Observadora
node scripts/connect.js --host localhost --port 25565 --username MyBot \
  --observer-ws "wss://your-observer-server/ws/agent" \
  --observer-token "your-token"
```

### 2. Interacciones Básicas

```bash
# Movimiento
node scripts/interact.js --action move --connection-id <id> --direction forward
node scripts/interact.js --action jump --connection-id <id>
node scripts/interact.js --action swim --connection-id <id> --swim-action start

# Chat
node scripts/interact.js --action chat --connection-id <id> --message "¡Hola!"

# Interacción con Bloques
node scripts/interact.js --action break --connection-id <id> --position "10,64,10"
node scripts/interact.js --action place --connection-id <id> --position "10,65,10"

# Combate
node scripts/interact.js --action attack --connection-id <id> --entity-name Zombie
node scripts/interact.js --action equip --connection-id <id> --slot 5 --destination head

# Bloqueo con Escudo
node scripts/interact.js --action block --connection-id <id> --block-action enable
node scripts/interact.js --action block --connection-id <id> --block-action disable

# Control de Vehículos
node scripts/interact.js --action boat --connection-id <id> --boat-action enter
node scripts/interact.js --action boat --connection-id <id> --boat-action exit
```

### 3. Gestión de Ítems

```bash
# Soltar ítems
node scripts/interact.js --action drop --connection-id <id> --item diamond --count 5

# Protección con Lista Blanca
node scripts/interact.js --action drop --connection-id <id> --whitelist-action add --item diamond_sword
node scripts/interact.js --action drop --connection-id <id> --whitelist-action list

# Inventario
node scripts/inventory.js --action list --connection-id <id>
```

### 4. Crafteo y Fundición

```bash
# Crafteo en Inventario (recetas 2x2)
node scripts/craft.js --connection-id <id> --item stick --amount 4

# Crafteo en Mesa (recetas 3x3)
node scripts/craft.js --connection-id <id> --item diamond_pickaxe --use-workbench true

# Auto-Equipar
node scripts/craft.js --connection-id <id> --item diamond_helmet --auto-equip

# Fundir
node scripts/smelt.js --connection-id <id> --item iron_ore --amount 10 --fuel coal

# Limpiar Horno
node scripts/smelt.js --connection-id <id> --action clear --furnace-position "100,64,200"
```

### 5. Operaciones de Contenedores

```bash
# Listar Contenido
node scripts/chest.js --connection-id <id> --action list --position "100,64,200"

# Almacenar Ítems
node scripts/chest.js --connection-id <id> --action store --position "100,64,200" --item diamond --amount 16

# Retirar Ítems
node scripts/chest.js --connection-id <id> --action withdraw --position "100,64,200" --item iron_ingot --amount 32
```

## Estructura del Proyecto

```
minecraft-client/
├── README.md                 # Documentación en inglés
├── README.zh.md             # Documentación en chino
├── README.ja.md             # Documentación en japonés
├── README.ko.md             # Documentación en coreano
├── README.es.md             # Documentación en español
├── SKILL.md                 # Definición de Skill
├── package.json             # Dependencias
├── scripts/                 # 19 scripts
└── references/
    └── observer-platform-protocol.md
```

## Licencia

MIT
