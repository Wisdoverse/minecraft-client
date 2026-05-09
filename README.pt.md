<p align="center">
  <img src="https://raw.githubusercontent.com/Wisdoverse/mineworld/main/public/logo.svg" width="80" height="80" alt="logo">
</p>

<h1 align="center">Minecraft Client</h1>

<p align="center"><strong>Plataforma de Observação de Agentes Minecraft em Tempo Real</strong></p>

<p align="center">Monitore, rastreie e visualize seus agentes de IA do Minecraft — tudo em um só lugar.</p>

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

## Índice

- [Recursos](#recursos)
- [Início Rápido](#início-rápido)
- [Arquitetura](#arquitetura)
- [Observabilidade](#observabilidade)
- [Contribuir](#contribuir)
- [Licença](#licença)

## Recursos

### Capacidades Principais

| Categoria | Descrição |
|-----------|-----------|
| **Conexão com Servidor** | Conectar a qualquer servidor Minecraft (offline ou online) |
| **Controle de Movimento** | Andar, pular, correr, nadar, navegação por caminho |
| **Sistema de Combate** | Atacar entidades, usar armas e armaduras |
| **Gestão de Inventário** | Ver inventário, mover itens, gestão de equipamentos |
| **Sistema de Fabricação** | Fabricar itens usando inventário ou bancada |
| **Sistema de Fundição** | Fundir minérios, detectar fornalhas automaticamente |
| **Operações de Container** | Baú, funil, dropper, dispensador, barris, fornalha |
| **Sistema de Comércio** | Interface de comércio com vilões |
| **Sistema Agrícola** | Arar, plantar, colher automaticamente |
| **Sistema de Construção** | Construção por planta com relatório de progresso |
| **Sistema de Visão** | Capturas de tela e obtenção de informações |
| **Consulta Wiki** | Obter receitas e informações do Minecraft Wiki |

### Recursos Avançados

| Recurso | Descrição |
|---------|-----------|
| **Controle de Veículos** | Entrar/sair de barcos e carrinhos de mina |
| **Bloqueio de Escudo** | Ativar/desativar defesa com escudo |
| **Lista Branca de Drop** | Proteger itens importantes de exclusão acidental |
| **Auto-equipamento** | Equipar automaticamente armaduras, escudos, arcos fabricados |
| **Limpar Fornalha** | Pegar todos os itens da fornalha de uma vez |
| **Multi-container** | Detecção automática do tipo de container |

## Início Rápido

### Instalação

```bash
git clone https://github.com/Wisdoverse/minecraft-client.git
cd minecraft-client
npm install
```

### Conectar ao Servidor

```bash
# Servidor offline (padrão)
node scripts/connect.js --host localhost --port 25565 --username MyBot --auth offline

# Servidor online com autenticação Microsoft
node scripts/connect.js --host mc.hypixel.net --port 25565 --username MyBot --auth microsoft

# Ativar plataforma de observação
node scripts/connect.js --host localhost --port 25565 --username MyBot \
  --observer-ws "wss://your-observer-server/ws/agent" \
  --observer-token "your-token"
```

### Interações Básicas

```bash
# Movimento
node scripts/interact.js --action move --connection-id <id> --direction forward
node scripts/interact.js --action jump --connection-id <id>
node scripts/interact.js --action swim --connection-id <id> --swim-action start

# Chat
node scripts/interact.js --action chat --connection-id <id> --message "Olá!"

# Combate
node scripts/interact.js --action attack --connection-id <id> --entity-name Zombie
node scripts/interact.js --action equip --connection-id <id> --slot 5 --destination head

# Bloqueio de Escudo
node scripts/interact.js --action block --connection-id <id> --block-action enable
node scripts/interact.js --action block --connection-id <id> --block-action disable

# Controle de Veículos
node scripts/interact.js --action boat --connection-id <id> --boat-action enter
node scripts/interact.js --action boat --connection-id <id> --boat-action exit
```

### Fabricação e Fundição

```bash
# Fabricação no inventário (2x2)
node scripts/craft.js --connection-id <id> --item stick --amount 4

# Fabricação na bancada (3x3)
node scripts/craft.js --connection-id <id> --item diamond_pickaxe --use-workbench true

# Auto-equipar armadura fabricada
node scripts/craft.js --connection-id <id> --item diamond_helmet --auto-equip

# Fundir
node scripts/smelt.js --connection-id <id> --item iron_ore --amount 10 --fuel coal

# Limpar fornalha
node scripts/smelt.js --connection-id <id> --action clear --furnace-position "100,64,200"
```

### Operações de Container

```bash
# Ver container
node scripts/chest.js --connection-id <id> --action list --position "100,64,200"

# Guardar itens
node scripts/chest.js --connection-id <id> --action store --position "100,64,200" --item diamond --amount 16

# Retirar itens
node scripts/chest.js --connection-id <id> --action withdraw --position "100,64,200" --item iron_ingot --amount 32
```

## Arquitetura

```
minecraft-client/
├── SKILL.md                           # Definição de Skill
├── package.json                       # Dependências Node.js
├── scripts/
│   ├── connect.js                     # Conexão principal do Bot
│   ├── interact.js                    # Comandos de interação
│   ├── disconnect.js                  # Desconectar
│   ├── status.js                      # Consulta de status
│   ├── vision.js                      # Captura de tela
│   ├── inventory.js                   # Gestão de inventário
│   ├── craft.js                       # Sistema de fabricação
│   ├── smelt.js                       # Sistema de fundição
│   ├── chest.js                       # Operações de container
│   ├── sleep.js                       # Sistema de sono
│   ├── auto.js                        # Tarefas automatizadas
│   ├── farm.js                        # Sistema agrícola
│   ├── build.js                       # Construção por planta
│   ├── monitor.js                     # Monitoramento ambiental
│   ├── query.js                       # Sistema de consulta
│   ├── trade.js                       # Comércio com vilões
│   ├── events.js                      # Assinatura de eventos
│   ├── wiki.js                        # Consulta wiki
│   └── multi.js                       # Coordenação multi-Bot
└── references/
    └── observer-platform-protocol.md  # Protocolo da plataforma de observação
```

## Observabilidade

### Eventos Suportados

| Tipo de Evento | Descrição |
|----------------|-----------|
| `connected` | Bot conectado ao servidor |
| `disconnected` | Bot desconectado |
| `moved` | Bot se moveu ou navegou |
| `jumped` | Bot pulou |
| `attacked` | Bot atacou entidade |
| `damaged` | Bot recebeu dano |
| `died` | Bot morreu |
| `chat_sent` | Mensagem de chat enviada |
| `chat_received` | Mensagem de chat recebida |
| `block_broken` | Bloco quebrado |
| `block_placed` | Bloco colocado |
| `item_picked_up` | Item coletado |
| `item_dropped` | Item descartado |
| `item_used` | Item usado |
| `inventory_changed` | Inventário alterado |
| `world_changed` | Mundo alterado (dimensão) |
| `respawned` | Bot reapareceu |
| `item_crafted` | Item fabricado |
| `item_smelted` | Item fundido |
| `chest_opened` | Container aberto |
| `item_deposited` | Item depositado |
| `item_withdrawn` | Item retirado |

## Contribuir

Contribuições são bem-vindas! Sinta-se à vontade para enviar Issues e Pull Requests.

## Licença

MIT
