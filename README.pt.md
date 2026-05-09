# Minecraft Client Skill

Uma skill completa de bot Minecraft para conectar a qualquer servidor Minecraft e realizar interações completas do jogo, com integração de plataforma observadora incorporada para monitoramento de agentes em tempo real.

## Funcionalidades

### Capacidades Principais
- **Conexão ao Servidor**: Conectar a qualquer servidor Minecraft (modo offline ou online)
- **Controle de Movimento**: Andar, pular, correr, nadar, navegar com pathfinder
- **Sistema de Combate**: Atacar entidades, usar armas e armaduras
- **Gerenciamento de Itens**: Ver inventário, mover itens, gerenciamento de equipamento
- **Sistema de Crafting**: Fabricar itens usando inventário ou mesa de trabalho
- **Sistema de Fundição**: Fundir minérios com detecção automática de fornalha
- **Operações de Container**: Acesso a baús, funis, dispensadores, lanzadores, barris, fornalhas
- **Comércio**: Interface de comércio com aldeões
- **Agricultura**: Arar, plantar, colher automaticamente
- **Construção**: Construção baseada em plantas com relatórios de progresso
- **Visão**: Captura de tela com informações da cena
- **Consulta Wiki**: Pesquisar receitas e informações no Minecraft Wiki

### Funcionalidades Avançadas
- **Controle de Veículos**: Entrar/sair de barcos e vagões
- **Bloqueio com Escudo**: Ativar/desativar bloqueio com escudo
- **Lista Branca de Drop**: Proteger itens importantes de exclusão acidental
- **Auto-Equipar**: Equipar automaticamente armaduras, escudos, arcos fabricados
- **Limpar Fornalha**: Retirar todos os itens da fornalha com um clique
- **Suporte Multi-Container**: Detecção automática de tipos de container

### Integração com Plataforma Observadora
- Atualizações de estado do agente em tempo real (posição, saúde, inventário, equipamento)
- Relatórios de snapshot do mundo (blocos, entidades)
- Rastreamento de eventos (movimentos, ataques, crafting, chat, etc.)
- Comunicação baseada em WebSocket
- Reconexão automática com estratégia de backoff

## Requisitos

- Node.js 16+
- npm

## Instalação

```bash
# Clonar o repositório
git clone https://github.com/Wisdoverse/minecraft-client.git
cd minecraft-client

# Instalar dependências
npm install
```

## Início Rápido

### 1. Conectar ao Servidor

```bash
# Servidor offline (padrão)
node scripts/connect.js --host localhost --port 25565 --username MyBot --auth offline

# Servidor com autenticação Microsoft
node scripts/connect.js --host mc.hypixel.net --port 25565 --username MyBot --auth microsoft --password "your-password"

# Com Plataforma Observadora
node scripts/connect.js --host localhost --port 25565 --username MyBot \
  --observer-ws "wss://your-observer-server/ws/agent" \
  --observer-token "your-token"
```

### 2. Interações Básicas

```bash
# Movimento
node scripts/interact.js --action move --connection-id <id> --direction forward
node scripts/interact.js --action jump --connection-id <id>
node scripts/interact.js --action swim --connection-id <id> --swim-action start

# Chat
node scripts/interact.js --action chat --connection-id <id> --message "Olá!"

# Interação com Blocos
node scripts/interact.js --action break --connection-id <id> --position "10,64,10"
node scripts/interact.js --action place --connection-id <id> --position "10,65,10"

# Combate
node scripts/interact.js --action attack --connection-id <id> --entity-name Zombie
node scripts/interact.js --action equip --connection-id <id> --slot 5 --destination head

# Bloqueio com Escudo
node scripts/interact.js --action block --connection-id <id> --block-action enable
node scripts/interact.js --action block --connection-id <id> --block-action disable

# Controle de Veículos
node scripts/interact.js --action boat --connection-id <id> --boat-action enter
node scripts/interact.js --action boat --connection-id <id> --boat-action exit
```

### 3. Gerenciamento de Itens

```bash
# Dropar itens
node scripts/interact.js --action drop --connection-id <id> --item diamond --count 5

# Proteção com Lista Branca
node scripts/interact.js --action drop --connection-id <id> --whitelist-action add --item diamond_sword
node scripts/interact.js --action drop --connection-id <id> --whitelist-action list

# Inventário
node scripts/inventory.js --action list --connection-id <id>
```

### 4. Crafting e Fundição

```bash
# Crafting no Inventário (receitas 2x2)
node scripts/craft.js --connection-id <id> --item stick --amount 4

# Crafting na Mesa (receitas 3x3)
node scripts/craft.js --connection-id <id> --item diamond_pickaxe --use-workbench true

# Auto-Equipar
node scripts/craft.js --connection-id <id> --item diamond_helmet --auto-equip

# Fundir
node scripts/smelt.js --connection-id <id> --item iron_ore --amount 10 --fuel coal

# Limpar Fornalha
node scripts/smelt.js --connection-id <id> --action clear --furnace-position "100,64,200"
```

### 5. Operações de Container

```bash
# Listar Conteúdo
node scripts/chest.js --connection-id <id> --action list --position "100,64,200"

# Guardar Itens
node scripts/chest.js --connection-id <id> --action store --position "100,64,200" --item diamond --amount 16

# Retirar Itens
node scripts/chest.js --connection-id <id> --action withdraw --position "100,64,200" --item iron_ingot --amount 32
```

## Estrutura do Projeto

```
minecraft-client/
├── README.md                 # Documentação em inglês
├── README.zh.md             # Documentação em chinês
├── README.ja.md             # Documentação em japonês
├── README.ko.md             # Documentação em coreano
├── README.es.md             # Documentação em espanhol
├── README.fr.md             # Documentação em francês
├── README.de.md             # Documentação em alemão
├── README.pt.md             # Documentação em português
├── SKILL.md                 # Definição da Skill
├── package.json             # Dependências
├── scripts/                 # 19 scripts
└── references/
    └── observer-platform-protocol.md
```

## Licença

MIT
