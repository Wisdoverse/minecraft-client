---

## Índice

- [Recursos](#recursos)
- [Início rápido](#início-rápido)
- [Ações suportadas](#ações-suportadas)
- [Eventos da plataforma](#eventos-da-plataforma)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Contribuição](#contribuição)
- [Licença](#licença)

## Recursos

### Capacidades principais

| Categoria | Descrição |
|-----------|-------------|
| **Conexão com servidor** | Conectar a qualquer servidor Minecraft (offline ou online) |
| **Controle de movimento** | Andar, pular, correr, nadar, navegação com pathfinder |
| **Sistema de combate** | Atacar entidades, usar armas e armadura |
| **Gestão de itens** | Ver inventário, mover itens, gerenciar equipamento |
| **Sistema de artesanato** | Fabricar usando inventário ou mesa de trabalho |
| **Sistema de fundição** | Fundir minérios com detecção automática de fornalha |
| **Operações de contêiner** | Baú, funil, dropper, dispenser, barril, fornalha |
| **Sistema de comércio** | Interface de comércio com aldeões |
| **Sistema agrícola** | Arar, plantar, colher automaticamente |
| **Sistema de construção** | Construção com plantas, relatório de progresso |
| **Sistema de visão** | Captura de tela e informação de cena |
| **Consulta Wiki** | Pesquisar receitas e informações no Minecraft Wiki |

### Funções avançadas

| Função | Descrição |
|---------|-------------|
| **Controle de veículo** | Entrar/sair de barco e carrinho de mina |
| **Bloqueio de escudo** | Ativar/desativar bloqueio de escudo |
| **Lista branca de drop** | Proteger itens importantes |
| **Auto-equipar** | Equipar automaticamente armadura, escudo, arco fabricado |
| **Limpar fornalha** | Retirar todo o conteúdo da fornalha |
| **Multi-contêiner** | Detecção automática de tipo de contêiner |

## Início rápido

### Instalação

```bash
git clone https://github.com/Wisdoverse/minecraft-client.git
cd minecraft-client
npm install
```

### Conexão ao servidor

```bash
# Servidor offline (padrão)
node scripts/connect.js --host localhost --port 25565 --username MyBot --auth offline

# Com plataforma de observação
node scripts/connect.js --host localhost --port 25565 --username MyBot \
  --observer-ws "wss://your-observer-server/ws/agent" \
  --observer-token "your-token"
```

## Ações suportadas

| Ação | Descrição |
|------|-------------|
| `move` | Mover em direção |
| `jump` | Pular |
| `chat` | Enviar mensagem |
| `attack` | Atacar entidade |
| `craft` | Fabricar item |
| `smelt` | Fundir item |
| `chest` | Operações de contêiner |
| `boat` | Entrar/sair de barco |

## Eventos da plataforma

| Evento | Descrição |
|---------|-------------|
| `connected` | Bot conectado |
| `moved` | Bot movido |
| `attacked` | Bot atacou |

## Estrutura do projeto

```
minecraft-client/
├── SKILL.md                           # Definição do Skill
├── package.json                       # Dependências
├── scripts/                           # 19 scripts
└── references/
    └── observer-platform-protocol.md  # Protocolo de observação
```

## Licença

MIT
