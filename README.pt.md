<!-- header -->
---

<p align="center">
  <img src="https://raw.githubusercontent.com/Wisdoverse/mineworld/main/public/logo.svg" width="80" height="80" alt="logo">
</p>

<h1 align="center">MineWorld</h1>

<p align="center"><strong>Plataforma de Observação de Agentes Minecraft em Tempo Real</strong></p>

<p align="center">Monitore, acompanhe e visualize seus agentes de IA do Minecraft — tudo em um só lugar.</p>

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

### Monitoramento em Tempo Real

- **Rastreamento de Agentes** — Rastreie posição, saúde, inventário e status em tempo real
- **Transmissão de Eventos** — Transmita todos os eventos do agente para a plataforma de observação
- **Snapshots do Mundo** — Snapshots periódicos de blocos e entidades ao redor dos agentes

### Ferramentas Integradas

- **Navegação** — Navegue para qualquer local usando A*
- **Combate** — Atacar entidades com comportamento configurável
- **Inventário** — Gestão completa do inventário (mover, equipar, descartar itens)
- **Fabricação** — Fabricar itens usando bancadas ou inventário
- **Fundição** — Fundir minérios e cozinhar alimentos
- **Agricultura** — Cultivo automático de safras (trigo, cenouras, batatas, beterraba)
- **Construção** — Construir estruturas a partir de arquivos de planta
- **Comércio** — Negociar com aldeões
- **Sono** — Encontrar e dormir em camas
- **Pesca** — Pesca automática

### Plataforma de Observação

- **Conexão WebSocket** — Comunicação bidirecional em tempo real
- **Assinatura de Eventos** — Assine tipos específicos de eventos
- **Coordenação de Equipe** — Suporte multiagente
- **Relatórios de Progresso** — Acompanhamento do progresso da construção

## Início Rápido

### Pré-requisitos

- Node.js 18+
- Servidor Minecraft (Java Edition 1.8+)

### Instalação

```bash
git clone https://github.com/Wisdoverse/mineworld.git
cd mineworld
npm install
npm run dev
```

## Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                   Plataforma de Observação                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Painel de  │  │   Transmis- │  │   Gerente   │         │
│  │   Controle   │  │   são de     │  │   de Equipe  │         │
│  │             │  │   Eventos     │  │            │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │ WebSocket
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     Cliente Minecraft                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Mineflayer │  │  Pathfinder  │  │   Ações    │         │
│  │             │  │             │  │   Manager   │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

## Observabilidade

### Tipos de Eventos

| Evento | Descrição |
|--------|-----------|
| `connected` | Agente conectado ao servidor |
| `disconnected` | Agente desconectado |
| `moved` | Agente se moveu |
| `jumped` | Agente pulou |
| `attacked` | Agente atacou uma entidade |
| `damaged` | Agente sofreu dano |
| `died` | Agente morreu |
| `chat_sent` | Mensagem de chat enviada |
| `chat_received` | Mensagem de chat recebida |
| `block_broken` | Bloco quebrado |
| `block_placed` | Bloco colocado |
| `item_picked_up` | Item coletado |
| `item_dropped` | Item descartado |
| `inventory_changed` | Inventário modificado |

## Contribuir

Contribuições são bem-vindas! Sinta-se à vontade para enviar um Pull Request.

## Licença

Este projeto está licenciado sob a Licença MIT.
