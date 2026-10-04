# Project: Plataforma Interativa de Oráculos em Blockchain (`estudo_oraculos`)

## Architecture
- **Paradigma**: Standalone Single Page Application (SPA), zero-backend, 100% executável nativamente no navegador (Chrome, Edge, Firefox, Safari).
- **Stack Tecnológico**:
  - HTML5 Semântico (`index.html`) estruturado em seções modulares (Header/Hero, Árvore de Dependências, Painel de Simulações, Módulos Teóricos & Casos de Uso, Laboratório de Código Solidity).
  - CSS3 Moderno (`styles/main.css`, `styles/components.css`, `styles/simulations.css`, `styles/tree.css`) com design tokens, layout responsivo em Grid/Flexbox, tipografia técnica acessível e suporte a Dark/Cyberpunk Web3 Theme com Glassmorphism.
  - JavaScript Modular ES2022+ (`src/main.js`, `src/state/store.js`, `src/data/concepts.js`, `src/data/contracts.js`, `src/tree/treeEngine.js`, `src/simulations/consensusSim.js`, `src/simulations/pushPullSim.js`, `src/simulations/donSim.js`, `src/simulations/flashLoanSim.js`, `src/lab/codeLab.js`).
  - Motor Gráfico Híbrido: SVG responsivo para conexões e arestas da DAG + nós interativos com suporte a Canvas 2D para visualização fluida de animações de pacotes e consenso a 60fps.
  - Armazenamento de Estado: `store.js` reativo com persistência automática em `localStorage` e fallback em memória.
- **Público e Contexto Pedagógico**:
  - Atividade 10 do Plano de Aulas de Blockchain (05/10/2026, Inteli Ateliê, Instrutor Kauan, ~20 alunos).
  - Suporte duplo: Modo Aluno (desbloqueio progressivo com pré-requisitos) e Modo Instrutor (desbloqueio imediato para apresentação).

## Code Layout
```
c:/Users/Inteli/workspace/modulo-3/Blockas/Plano_de_aulas/estudo_oraculos/
├── index.html                     # Entrypoint da aplicação SPA
├── styles/
│   ├── main.css                   # Variáveis globais, reset, tipografia, base
│   ├── components.css             # Header, modais, drawer, botões, badges, filtros
│   ├── tree.css                   # Estilização visual da árvore DAG e nós
│   ├── simulations.css            # Painéis, dashboards e controles das 3 simulações + sandbox
│   └── codelab.css                # Visualizador de código, anotações linha a linha, tabs
├── src/
│   ├── main.js                    # Inicialização e orquestração dos módulos
│   ├── state/
│   │   └── store.js               # Gerenciador reativo de estado e persistência (localStorage)
│   ├── data/
│   │   ├── concepts.js            # Base conceitual detalhada (Níveis 0 a 4, 9 nós com teoria profunda)
│   │   ├── caseStudies.js         # Dados dos 5 casos de estudo de exploits reais (bZx, Harvest, Mango, etc.)
│   │   └── contracts.js           # 4 contratos Solidity completos com anotações linha por linha
│   ├── tree/
│   │   └── treeEngine.js          # Renderizador da DAG, cálculo de posições, pré-requisitos e filtros
│   ├── simulations/
│   │   ├── consensusSim.js        # Simulação 1: Quebra de Consenso HTTP vs Oráculo
│   │   ├── pushPullSim.js         # Simulação 2: Fluxo Push vs Pull e medidores de gas/latência
│   │   ├── donSim.js              # Simulação 3: Rede Descentralizada (DON), IQR e Mediana vs Média
│   │   └── flashLoanSim.js        # Sandbox: Manipulação de preço AMM x*y=k e flash loans
│   ├── lab/
│   │   └── codeLab.js             # Visualizador de código, cópia, anotações e guia Remix IDE
│   └── ui/
│       ├── drawer.js              # Drawer lateral de inspeção profunda de conceitos
│       └── notifications.js       # Sistema de toasts/alertas de consenso e feedback
├── contracts/                     # Arquivos .sol avulsos prontos para import direto no Remix
│   ├── PriceConsumerV3.sol
│   ├── VRFv25Lottery.sol
│   ├── AutomatedVaultKeeper.sol
│   └── MockAggregatorV3.sol
└── test/                          # Testes E2E e unitários automatizados
    ├── runner.html                # Executor de testes automatizados no navegador
    └── e2e_spec.js                # Suite completa de testes automatizados Tiers 1-5
```

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| F01 | Shell, Header & Global Controls | Header com status, Modo Instrutor ("Unlock All"), busca com debounce e reset | M1 | survey |
| F02 | DAG Concept Tree Rendering | Renderização visual interativa da árvore de 5 níveis (Nível 0 a 4, 9 nós) | M1 | survey |
| F03 | Dependency & Prerequisite Engine | Motor de validação de pré-requisitos para Modo Aluno e bypass para Modo Instrutor | M1 | survey |
| F04 | Concept Detail Inspector Drawer | Gaveta lateral deslizante com explicações profundas, impacto técnico e reflexões | M1 | survey |
| F05 | Level & Difficulty Filtering | Filtros por nível (0-4) e dificuldade (Fundamento, Intermediário, Avançado) | M1 | survey |
| F06 | Study Progress Persistence | Rastreamento de progresso de estudo em localStorage com indicador visual de % | M1 | survey |
| F07 | Simulation 1: HTTP Consensus Break | Simulação interativa com 3 validadores, API Web2 instável, hashes divergentes e alerta | M2 | survey |
| F08 | Simulation 2: Push vs Pull Architecture | Fluxo animado de pacotes em 4 camadas, comparação de gas contínuo vs on-demand e latência | M2 | survey |
| F09 | Simulation 3: DON Data Aggregation | Simulador com 9 nós oráculos, injeção de outlier/ataque, poda IQR e Mediana vs Média | M2 | survey |
| F10 | Flash Loan Math Sandbox | Simulador interativo da curva $x \cdot y = k$, distorção de reserva e cálculo de colateral | M2 | survey |
| F11 | Theory: EVM Determinism & Oracle Paradox | Formalização matemática $S_{t+1} = \Upsilon(S_t, T)$ e impossibilidade de I/O na EVM | M3 | survey |
| F12 | Theory: Oracle Architectures | Arquiteturas Push vs Pull, Centralizado vs DON, limiar criptográfico e consenso | M3 | survey |
| F13 | Theory: Exploit Forensics | Estudo minucioso dos 5 ataques históricos (bZx, Harvest, Mango Markets, Euler, BonqDAO) | M3 | survey |
| F14 | Theory: Verifiable Randomness (VRF) | Micali-Rabin-Vadhan, curvas elípticas, commit-reveal assíncrono e VRF v2 vs v2.5 | M3 | survey |
| F15 | Theory: Keepers & Automation | Execução em 2 fases (`checkUpkeep` 0-gas vs `performUpkeep`), validação on-chain | M3 | survey |
| F16 | Contract: PriceConsumerV3 | Consumo de AggregatorV3Interface com 4 verificações de produção e comentários linha a linha | M4 | survey |
| F17 | Contract: VRFv25Lottery | Contrato de loteria assíncrono commit-reveal via VRF v2.5 com anotações linha a linha | M4 | survey |
| F18 | Contract: AutomatedVaultKeeper | Cofre automatizado com checkData/performData e revalidação on-chain linha a linha | M4 | survey |
| F19 | Contract: MockAggregatorV3 | Mock standalone para teste instantâneo na Remix VM sem necessidade de faucet/rede | M4 | survey |
| F20 | Hands-on Remix IDE Guide | Guia passo a passo de deploy e teste no Remix (Remix VM e Sepolia testnet) | M4 | survey |
| F21 | Interactive Code Lab UI | Visualizador de código com highlight, cópia rápida, abas e anotações explicativas | M4 | survey |
| F22 | Responsive & Accessible Web3 UI | Design responsivo, contraste WCAG AA, tipografia técnica e zero dependência de build | M1 | survey |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M0 | E2E Testing Suite & Infrastructure | Test runner autônomo em browser/CLI, especificações Tiers 1-4 para todas as features | none | IN_PROGRESS |
| M1 | Shell, Concept Tree & UI Core | F01, F02, F03, F04, F05, F06, F22 (Estrutura base, DAG, store, filtros, drawer) | none | PLANNED |
| M2 | Dynamic Concept Simulations & Sandbox | F07, F08, F09, F10 (Simulações 1, 2 e 3 + Sandbox de Flash Loan) | M1 | PLANNED |
| M3 | Comprehensive Theory & Case Studies | F11, F12, F13, F14, F15 (Módulos teóricos, gráficos conceituais, 5 casos reais) | M1 | PLANNED |
| M4 | Solidity Code Lab & Remix Playbook | F16, F17, F18, F19, F20, F21 (4 contratos anotados, guia Remix, UI do Lab) | M1 | PLANNED |
| M5 | Final Verification & Adversarial Hardening | Execução e aprovação de 100% dos testes E2E (Tiers 1-4) + endurecimento adversarial (Tier 5) | M0, M1, M2, M3, M4 | PLANNED |

## Interface Contracts
### `store.js` ↔ All Components (`treeEngine`, `simulations`, `codeLab`, `drawer`)
- `getState()`: Retorna o estado global congelado/imutável `{ unlockedNodes: string[], completedNodes: string[], teacherMode: boolean, selectedNodeId: string|null, filterLevel: string, filterDifficulty: string, searchQuery: string }`.
- `dispatch(action, payload)`: Modifica o estado e notifica subscribers:
  - `UNLOCK_NODE`: payload `{ nodeId }`
  - `COMPLETE_NODE`: payload `{ nodeId }`
  - `SET_TEACHER_MODE`: payload `{ enabled: boolean }`
  - `SELECT_NODE`: payload `{ nodeId }`
  - `SET_FILTER`: payload `{ key: 'level'|'difficulty'|'search', value: string }`
  - `RESET_PROGRESS`: payload `{}`
- `subscribe(listener)`: Registra callback `(state) => void`, retorna função de unsubscribe.

### `treeEngine.js` ↔ `drawer.js`
- `onNodeClick(nodeId)`: Dispara `store.dispatch('SELECT_NODE', { nodeId })` e abre o drawer `drawer.open(nodeId)`.
- `getPrerequisitesStatus(nodeId)`: Retorna `{ isUnlocked: boolean, missingPrereqs: string[] }`.

### Simulations ↔ UI Containers
- Cada simulação exporta `{ init(containerElement): void, start(): void, reset(): void, destroy(): void }`.
- Notificações de evento: Simulações emitem CustomEvents (`simulation:fork-detected`, `simulation:iqr-filtered`, `simulation:metrics-updated`) capturados pelo sistema de notificações/dashboard.

### `contracts.js` ↔ `codeLab.js`
- Exporta objeto com contratos `{ priceConsumer: { code, annotations, remixSteps }, vrfLottery: {...}, vaultKeeper: {...}, mockFeed: {...} }`.
- `codeLab.render(contractKey)` injeta código formatado, tabs de navegação e lista de linhas explicadas.
