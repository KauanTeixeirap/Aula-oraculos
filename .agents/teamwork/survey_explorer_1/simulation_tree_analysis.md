# Technical Implementation & UI/UX Architecture Analysis
## R1 (Interactive Concept Dependency Tree) & R2 (Dynamic Concept Simulations)
**Project Target**: `c:\Users\Inteli\workspace\modulo-3\Blockas\Plano_de_aulas\estudo_oraculos`  
**Author**: `survey_explorer_1` (Teamwork Explorer)  
**Date**: 2026-10-04  
**Pedagogical Context**: Inteli Módulo 3 — Atividade Nº 10 (Aula Técnica: *Oráculos e Integração com Dados Externos*, 05/10/2026)

---

## 1. Executive Summary

This document establishes the end-to-end technical specification and UI/UX architecture for:
1. **R1: Interactive Concept Dependency Tree** — A structured, progressive 5-level knowledge graph (Level 0: EVM/Determinism $\to$ Level 1: The Oracle Problem $\to$ Level 2: Push/Pull Architectures & DONs $\to$ Level 3: Specialized Primitives (Data Feeds, VRF, Keepers) $\to$ Level 4: Hands-on Solidity/Remix).
2. **R2: Dynamic Visualizations & Concept Simulations** — Three high-fidelity, interactive browser-native simulations:
   - **Simulation 1: The Oracle Problem & HTTP Consensus Break** (visualizing multi-validator state root divergence from nondeterministic network calls).
   - **Simulation 2: Push vs. Pull Architecture Flow** (interactive comparison of deviation/heartbeat pushes vs. on-demand cryptographic pull feeds, comparing gas and latency).
   - **Simulation 3: Decentralized Oracle Network (DON) Aggregation** (interactive Byzantine fault injection, outlier pruning via IQR/deviation limits, and robust median consensus).

### Architecture Mandate
- **Zero-Backend Standalone Single Page Application (SPA)**: Runs natively in any modern web browser without requiring a Node.js daemon, backend API server, Docker container, or database.
- **Pure Web Standards**: HTML5, Modern CSS3 with CSS Custom Properties and Container Queries, Vanilla ES2022+ JavaScript Modules (`import`/`export`), and Canvas 2D + SVG for crisp rendering.
- **Dual-Audience Usability**:
  - **Student Mode**: Progressive unlocking where nodes unlock as prerequisites are marked complete.
  - **Instructor Mode**: Instant "Unlock All" toggle enabling the lecturer (Kauan) to navigate freely to any node or simulation during the 05/10/2026 session.

---

## 2. Directory Layout & Modular File Architecture

The target directory `c:\Users\Inteli\workspace\modulo-3\Blockas\Plano_de_aulas\estudo_oraculos` must be structured into modular, clean separation of concerns:

```
estudo_oraculos/
├── index.html                     # Main application entry point & semantic layout
├── css/
│   ├── theme.css                  # Color tokens, glassmorphism, typography, CSS vars
│   ├── layout.css                 # App shell, responsive grid, navigation bar, tabs
│   ├── tree.css                   # Tree graph layout, node cards, connectors, badges
│   ├── simulations.css            # Simulation canvases, control docks, metric cards
│   ├── inspector.css              # Detail drawer/modal for concept nodes
│   └── code-lab.css               # Solidity code viewer, syntax styling, copy actions
├── js/
│   ├── app.js                     # Main application bootstrapper & tab router
│   ├── store.js                   # Central reactive state manager & localStorage sync
│   ├── event-bus.js               # Lightweight publish/subscribe event bus
│   ├── tree/
│   │   ├── tree-data.js           # Full taxonomy dataset for Levels 0-4
│   │   ├── tree-engine.js         # Dependency validation & DAG traversal logic
│   │   ├── tree-renderer.js       # SVG bezier connector & DOM node graph renderer
│   │   └── tree-inspector.js      # Rich slide-in drawer renderer for node details
│   ├── simulations/
│   │   ├── sim-common.js          # Shared canvas math, particle effects & timer utils
│   │   ├── sim-consensus.js       # Simulation 1: HTTP Consensus Break & Validator Roots
│   │   ├── sim-push-pull.js       # Simulation 2: Animated Push vs Pull Architecture
│   │   └── sim-aggregation.js     # Simulation 3: DON Node Aggregation, Outliers & Median
│   └── content/
│       ├── theory-content.js      # Comprehensive theoretical notes & case studies
│       └── solidity-code.js       # Commented production Solidity contracts for Remix
└── assets/
    └── icons/                     # Inline SVG definitions or minimalist icon assets
```

### Key Technical Advantages of this Layout:
1. **Zero-Build Deployment**: Opening `index.html` via a local static server (`python -m http.server 8000` or `npx serve`) works immediately with standard ES modules.
2. **Strict Component Isolation**: Each simulation is self-contained in its own JS module with `init()`, `start()`, `pause()`, `reset()`, and `destroy()` lifecycle hooks.
3. **Hot-Swappable Data**: Adding new concepts or editing code examples requires modifying only `tree-data.js` or `solidity-code.js` without touching rendering engines.

---

## 3. R1: Interactive Concept Dependency Tree Architecture

### 3.1 Five-Level Pedagogical Taxonomy (Levels 0 to 4)

| Level | Level Name | Key Concepts / Nodes | Prerequisites |
|---|---|---|---|
| **0** | **EVM & Determinismo** | `0.1` Máquina Virtual Ethereum (EVM) como Autômato de Estados<br>`0.2` Determinismo Estrito & Árvore de Estado (State Root)<br>`0.3` Ausência de Syscalls de Rede & Isolamento de Execução | *None (Raiz)* |
| **1** | **O Problema do Oráculo** | `1.1` O Trilema da Conectividade & Redes Isoladas<br>`1.2` Oráculo Centralizado como Ponto Único de Falha (SPOF)<br>`1.3` Princípio Garbage In, Garbage Out (GIGO) na Web3<br>`1.4` Vetores de Ataque: Fonte de Dados vs. Camada de Transporte | `0.1`, `0.2`, `0.3` |
| **2** | **Arquiteturas & Redes Descentralizadas** | `2.1` Modelo Push: Feeds On-Chain Baseados em Desvio & Heartbeat<br>`2.2` Modelo Pull: Preços On-Demand Assinados Off-Chain<br>`2.3` Redes Descentralizadas de Oráculos (DONs) & Sybil Resistance<br>`2.4` Consenso Off-Chain: Off-Chain Reporting (OCR) | `1.2`, `1.3`, `1.4` |
| **3** | **Primitivas Especializadas** | `3.1` Data Feeds Financeiros & Checagem de Defasagem (Staleness)<br>`3.2` VRF (Verifiable Random Function): Commit-Reveal Criptográfico<br>`3.3` Keepers & Automação Descentralizada: `checkUpkeep` / `performUpkeep` | `2.1`, `2.2`, `2.3`, `2.4` |
| **4** | **Hands-on Solidity / Remix** | `4.1` Consumo de Preços com `AggregatorV3Interface` & Proteções<br>`4.2` Requisição de Aleatoriedade Verificável com VRF v2.5<br>`4.3` Contratos Auto-Executáveis com Chainlink Automation<br>`4.4` Roteiro de Deploy & Simulação Prática no Remix IDE | `3.1`, `3.2`, `3.3` |

### 3.2 Data Structure Specification for Tree Nodes (`tree-data.js`)

Each node is represented by a standardized JavaScript object:

```javascript
export const TREE_NODES = [
  {
    id: "evm-determinism",
    level: 0,
    levelTitle: "Nível 0: EVM & Determinismo",
    title: "Determinismo Estrito da EVM",
    shortDescription: "Por que todos os validadores da Ethereum devem calcular exatamente o mesmo estado a partir dos mesmos inputs.",
    difficulty: "Iniciante", // "Iniciante" | "Intermediário" | "Avançado"
    prerequisites: [],
    tags: ["EVM", "Consenso", "State Root", "Merkle Trie"],
    impact: "Se uma execução de smart contract produzir saídas diferentes em validadores distintos, a rede bifurca (hard fork involuntário) e o consenso colapsa.",
    coreConcept: "A Ethereum Virtual Machine é uma máquina de Turing quase-completa e puramente determinística. Dadas as mesmas transações de entrada e o mesmo estado anterior S, a função de transição de estado Y(S, T) deve produzir rigorosamente o mesmo novo estado S' em milhares de nós espalhados pelo globo.",
    blindSpot: "Achar que um smart contract pode simplesmente importar uma biblioteca HTTP para chamar uma API REST pública.",
    deepLinkSim: "sim-consensus", // Links to Simulation 1
    codeRef: "solidity-evm-intro"
  },
  // ... (Full data schema across all 18 sub-nodes)
];
```

### 3.3 Node Unlocking & Dependency Engine (`tree-engine.js`)

The engine manages state transitions: `LOCKED`, `UNLOCKED`, and `COMPLETED`.
- A node is `UNLOCKED` if all nodes listed in its `prerequisites` array have `status === "COMPLETED"`.
- Root nodes (Level 0) start as `UNLOCKED`.
- When a user clicks "Marcar como Concluído" inside the node inspector, the node transitions to `COMPLETED`.
- The engine recalculates dependencies and fires a `NODE_UNLOCKED` event for newly accessible nodes with a subtle particle/glow animation.
- **Teacher Mode ("Modo Instrutor")**: A toggle switch in the UI header sets `state.instructorMode = true`. When active, all lock restrictions are bypassed, allowing the instructor to jump directly into any node, diagram, or simulation.

### 3.4 Interactive Graph Visualizer (`tree-renderer.js`)

- **Rendering Strategy**: Hybrid SVG + CSS Grid layout.
  - Columns represent Levels 0 through 4.
  - Cards represent nodes with clear status pills (Bloqueado 🔒, Desbloqueado 🔓, Concluído ✅), difficulty badges, and title.
  - An absolute SVG overlay layer draws responsive cubic Bezier curves (`M x1 y1 C cx1 cy1, cx2 cy2, x2 y2`) connecting prerequisite output pins to dependent input pins.
  - Active/completed connections glow with cyan/violet gradients; locked connections remain muted dashed lines.
  - Smooth resize observer dynamically updates Bezier curve coordinates when viewport size changes.

### 3.5 Detailed Inspector Drawer (`tree-inspector.js`)

When a node card is clicked:
1. The canvas scrolls or centers on the node, and a high-contrast slide-in drawer expands from the right (or modal on mobile).
2. Drawer sections:
   - **Header**: Level indicator, node title, difficulty badge, status pill.
   - **O Que É (Definição Técnica)**: Explicação rigorosa e concisa.
   - **Impacto na Arquitetura Web3**: Por que essa decisão foi tomada na blockchain e o que aconteceria de errado se fosse ignorada.
   - **Ponto Cego Típico (Gotchas)**: Erros conceituais cometidos por novatos.
   - **Conexão com a Próxima Etapa**: Como este nó prepara para o próximo nível.
   - **Ações Rápidas**:
     - Botão `[Ver Simulação Relacionada]` (transiciona instantaneamente para a simulação correspondente com parâmetros pré-configurados).
     - Botão `[Marcar como Concluído / Desmarcar]`.
     - Botão `[Copiar Link do Conceito]`.

### 3.6 Filtering, Search & Progress Tracking

- **Difficulty Filter**: Tabs for "Todos", "Iniciante", "Intermediário", "Avançado". Non-matching nodes dim slightly (`opacity: 0.25`) to preserve graph topological context while highlighting relevant nodes.
- **Search Bar**: Real-time debounce filter matching titles, descriptions, and tags.
- **Progress Tracker**:
  - Global progress bar (`% Concluído`).
  - Progress counters per level (ex: "Nível 0: 3/3", "Nível 1: 2/4", etc.).
  - Automatic persistence to `localStorage` under key `oraculos_study_progress_v1`.
  - "Resetar Progresso" with confirmation prompt.

---

## 4. R2: Dynamic Concept Simulations Architecture

### 4.1 Simulation 1: The Oracle Problem & HTTP Consensus Break (`sim-consensus.js`)

#### 4.1.1 Pedagogical Goal
Visually demonstrate why an EVM node **cannot** execute arbitrary network calls (e.g. `HTTP GET https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT`). If 3 independent validators in different continents run the same transaction, microsecond price volatility, network jitter, DNS resolution delays, and HTTP 429/500 errors produce divergent responses, leading to different state roots and breaking network consensus.

#### 4.1.2 Visual Components
1. **Interactive Stage**:
   - **Center Top**: External Web2 API Server (`api.coingecko.com / binance.com`) emitting fluctuating price ticks every 50ms.
   - **Bottom Left**: **Validador A (Frankfurt)** — Local time $T_0$, ping 15ms.
   - **Bottom Center**: **Validador B (Virgínia)** — Local time $T_0 + 80ms$, ping 95ms.
   - **Bottom Right**: **Validador C (Tóquio)** — Local time $T_0 + 190ms$, ping 210ms.
   - **Network Channels**: Animated SVG packet lines with moving data dots between validators and the API.
   - **Consensus Dashboard**: Live comparison of each validator's calculated `State Root` (SHA-256 hash preview).

#### 4.1.3 Simulation Modes & Controls
- **Toggle "Modo de Execução"**:
  - `Cenário 1: Chamada HTTP Direta (Nativa/Falha)`:
    - User clicks **"Submeter Transação `getExchangeRate()`"**.
    - Animated HTTP request packets leave each validator towards the API.
    - Each validator hits the API at a slightly different millisecond timestamp.
    - Result:
      - Validador A receives `ETH = $3.250,20` $\to$ computes State Root `0xa48f...`
      - Validador B receives `ETH = $3.251,45` $\to$ computes State Root `0x39c1...`
      - Validador C receives `Timeout 504 / $3.249,80` $\to$ computes State Root `0x77e2...`
    - **Visual Climax**: Alerta vermelho piscante: **"🚨 QUEBRA DE CONSENSO! STATE ROOTS DIVERGENTES"**. Three branching blockchain forks appear, halting the network.
  - `Cenário 2: Resolução com Oráculo On-Chain (Correto)`:
    - User clicks **"Submeter Transação via Oráculo On-Chain"**.
    - The transaction does not make an external network request. Instead, it reads a deterministic storage slot updated by an off-chain consensus network beforehand (`storage[LATEST_PRICE]`).
    - All three validators read identical value `$3.250,00`.
    - All compute identical State Root `0x88bb...`.
    - **Visual Climax**: Alerta verde luminoso: **"✅ CONSENSO 100% ATINGIDO! BLOCO #19847291 MINERADO"**. Single unified canonical chain advances.
- **Interactive Control Sliders**:
  - `Volatilidade de Mercado`: Baixa (0.1% oscilação/s), Média (1%), Extrema (5% / Flash Crash).
  - `Jitter de Rede / Latência`: 0ms a 500ms.
  - `Injetar Falha HTTP`: Toggle to force HTTP 429 Too Many Requests or 500 Server Error on Validator C.

---

### 4.2 Simulation 2: Push vs. Pull Architecture Flow (`sim-push-pull.js`)

#### 4.2.1 Pedagogical Goal
Teach the trade-offs between the two predominant oracle paradigms:
- **Modelo Push (Chainlink Data Feeds clássico)**: Updates published on-chain pro-actively when price deviates past threshold (e.g. 0.5%) or heartbeat triggers (e.g. 1 hour). Always fresh in contract storage, but continuous L1 gas cost.
- **Modelo Pull (Pyth Network, Chainlink Data Streams)**: High-frequency off-chain streaming (sub-second). Users or dApps bundle the latest cryptographically signed price update with their transaction payload; contract validates signature on-chain atomically. Zero idle gas cost, sub-second freshness, but user pays verification gas.

#### 4.2.2 Visual Architecture & Layout
The simulation features a 4-tier interactive animated architecture stack:
1. **Tier 1 (External Exchanges)**: Live feeds from Binance, Coinbase, OKX, Uniswap.
2. **Tier 2 (Oracle Network Layer)**:
   - *Push*: Decentralized Oracle Network (DON) running periodic OCR consensus.
   - *Pull*: Low-latency Off-chain P2P Gossiping (Pythnet / Hermes / Wormhole) emitting signed price blobs.
3. **Tier 3 (Mempool & Blockchain Ledger)**:
   - *Push*: Oracle Aggregator Contract with persistent `latestRoundData()` storage.
   - *Pull*: User transaction carrying `[Signed Price Blob + Trade Calldata]`, executing in a single atomic transaction.
4. **Tier 4 (Consumer dApp & User)**:
   - Lending Protocol (Aave / Compound) or Perp DEX (GMX / Synthetix).

#### 4.2.3 Interactive Controls & Metrics
- **View Switcher**: `Modelo Push`, `Modelo Pull`, or `Comparação Lado a Lado (Split Screen)`.
- **Action Buttons**:
  - `Simular Movimento de Mercado (+1.2%)`: Triggers deviation in Tier 1.
  - `Simular Transação de Usuário (Swap / Empréstimo)`: User calls dApp.
  - `Acelerar Tempo (Simular 24 Horas)`: Illustrates continuous heartbeat gas consumption in Push vs $0 gas idle in Pull.
- **Live Comparison Telemetry Dock**:
  - **Gás Gasto pela Rede de Oráculos (24h)**: Push = `~48 transações on-chain ($$$$)` vs Pull = `0 transações ociosas ($0)`.
  - **Latência do Preço**: Push = `~15 a 60 minutos (ou 0.5% desvio)` vs Pull = `~350ms (sub-segundo)`.
  - **Custo de Gás por Transação do Usuário**: Push = `21k + 5k leitura (~26k gas)` vs Pull = `21k + 65k validação de assinatura eckw (~86k gas)`.
  - **Melhor Caso de Uso**:
    - Push: Pares primários com alto volume em L1 (ETH/USD, BTC/USD) onde milhares de contratos lêem o mesmo preço armazenado.
    - Pull: Mercados perpétuos de alta alavancagem, cauda longa de centenas de pares, L2s de alta velocidade, e liquidações instantâneas.

---

### 4.3 Simulation 3: DON Data Aggregation & Outlier Elimination (`sim-aggregation.js`)

#### 4.3.1 Pedagogical Goal
Demystify how a Decentralized Oracle Network (DON) like Chainlink OCR processes multi-source data to produce an unshakeable canonical price feed even under adversarial conditions:
- Resisting single-source flash loan price manipulation attacks on AMM pools.
- Pruning malicious or broken node operators reporting corrupt numbers.
- Computing robust consensus (Median) instead of naive algorithms (Mean) that fail under Byzantine attacks.

#### 4.3.2 Visual Components
1. **Network Ring of 9 Oracle Nodes**:
   - Each node displays its Node Operator Name (ex: *Chainlink Labs*, *Deutsche Telekom*, *Staking Facilities*, *Infura*, *LinkPool*, *F-Prime*, *Swisscom*, *T-Systems*, *B-Harvest*).
   - Each node displays its Data Source API (ex: *Binance API*, *Coinbase Pro*, *Kraken*, *Uniswap v3 TWAP*, *Bitfinex*, *CoinGecko*, *CoinMarketCap*, *OKX*, *Bybit*).
   - Real-time reported price tag (e.g. `$3.250,40`, `$3.249,90`...).
   - Node health indicator: `🟢 Normal / Honesto`, `🟡 Timeout / Sem Resposta`, `🔴 Malicioso / Manipulado`.

2. **Step-by-Step Aggregation Pipeline (Animated Stages)**:
   - **Fase 1: Coleta das Leituras**: 9 nós consultam suas APIs. Valores brutos preenchem a tabela.
   - **Fase 2: Ordenação dos Valores**: Valores deslizam visualmente para uma régua ordenada do menor para o maior.
   - **Fase 3: Detecção e Eliminação de Outliers**:
     - Cálculo do Intervalo Interquartil (IQR: $Q_3 - Q_1$) ou Desvio Máximo Permitido (ex: $\pm 3\%$).
     - Nós fora do limiar são destacados com um efeito de corte vermelho pulsante (*"OUTLIER ELIMINADO"*).
   - **Fase 4: Seleção do Consenso**:
     - O ponteiro desliza e fixa no valor da **Mediana** (elemento central $n/2$ dos nós válidos).
   - **Fase 5: Assinatura Criptográfica Agregada (Threshold Signature)**:
     - Os nós honestos combinam suas chaves privadas em uma única assinatura compacta (ECDSA / Schnorr threshold).
     - Payload entregue ao contrato do agregador on-chain.

3. **Adversarial Control Panel (Attack Sandbox)**:
   - **Preset 1: "Ataque Normal (Sem Anomalias)"**: Pequenas flutuações naturais de mercado ($\pm 0.05\%$).
   - **Preset 2: "Ataque Flash Loan em DEX (Outlier Único)"**: Nó 4 (Uniswap v3) tem seu preço artificialmente inflado para `$6.500,00` (+100%) devido a uma drenagem momentânea de liquidez.
   - **Preset 3: "Falha de API Web2 (Timeout / Múltiplos Nós)"**: Nó 7 e Nó 8 sofrem falha de DNS (retornam `$0.00` ou `Offline`).
   - **Preset 4: "Conluio Bizantino (2 Nós Maliciosos)"**: 2 nós enviam dados falsos coordenados (`$1.100,00`).
   - **Controle Manual por Nó**: O usuário pode clicar em qualquer um dos 9 nós e digitar livremente qualquer preço arbitrário.

4. **Comparative Analysis Card: Média vs. Mediana**:
   - Exibe em tempo real o cálculo lado a lado:
     - **Se o protocolo usasse Média Simples (Mean)**:
       - Cálculo: $\sum X_i / N = \$3.611,10$ (Desvio de $+11.1\%$ provocado por apenas 1 outlier!).
       - Consequência no Smart Contract: **🚨 CATÁSTROFE! Drenagem de liquidez / liquidações indevidas em cascata.**
     - **Com Agregação DON (Mediana)**:
       - Cálculo: $\text{Mediana} = \$3.250,15$ (Desvio residual de $+0.004\%$).
       - Consequência no Smart Contract: **🛡️ TOTALMENTE SEGURO. O ataque foi absorvido e anulado.**

---

## 5. State Management & Zero-Backend SPA Engine

### 5.1 Store Architecture (`store.js`)

A reactive store pattern implemented in pure vanilla JS:

```javascript
class AppStore {
  constructor() {
    this.state = {
      activeTab: "tree", // "tree" | "sim-consensus" | "sim-push-pull" | "sim-aggregation" | "theory" | "lab"
      instructorMode: false,
      filterDifficulty: "all",
      searchQuery: "",
      completedNodes: new Set(),
      selectedNodeId: null,
      simState: {
        consensus: { running: false, mode: "http", volatility: "low", jitter: 150 },
        pushPull: { activeView: "split", marketTrend: 0, gasPush: 0, gasPull: 0 },
        aggregation: { nodes: [], activePreset: "normal", aggMethod: "median" }
      }
    };
    this.listeners = [];
    this.loadFromStorage();
  }

  loadFromStorage() {
    try {
      const saved = localStorage.getItem("oraculos_app_state_v1");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.completedNodes) {
          this.state.completedNodes = new Set(parsed.completedNodes);
        }
      }
    } catch (e) {
      console.warn("Storage load failed", e);
    }
  }

  saveToStorage() {
    try {
      const payload = {
        completedNodes: Array.from(this.state.completedNodes)
      };
      localStorage.setItem("oraculos_app_state_v1", JSON.stringify(payload));
    } catch (e) {
      console.warn("Storage save failed", e);
    }
  }

  setState(updates) {
    this.state = { ...this.state, ...updates };
    this.saveToStorage();
    this.notify();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    for (const listener of this.listeners) {
      listener(this.state);
    }
  }
}

export const store = new AppStore();
```

### 5.2 Deep-Link Routing (`app.js`)
- URL hash listener (`window.addEventListener('hashchange', ...)`) supports instant direct navigation:
  - `index.html#tree` $\to$ Visual Tree
  - `index.html#tree:oracle-problem` $\to$ Tree with specific node inspector opened
  - `index.html#sim:consensus` $\to$ Simulation 1
  - `index.html#sim:push-pull` $\to$ Simulation 2
  - `index.html#sim:aggregation` $\to$ Simulation 3
  - `index.html#lab` $\to$ Hands-on Solidity Lab
- Allows the instructor to prepare bookmark links for each segment of the lecture.

---

## 6. UI/UX Design System Specification

### 6.1 Theme & Visual Identity (`theme.css`)
- **Palette (Web3 Dark Theme)**:
  - Background Base: `#080c14` (Deep Space Obsidian)
  - Background Surface / Cards: `rgba(17, 24, 39, 0.75)` with `backdrop-filter: blur(16px)`
  - Border Accents: `rgba(255, 255, 255, 0.08)` and `rgba(56, 189, 248, 0.2)`
  - Primary Accent (Cyan): `#38bdf8` (Chainlink / Web3 electric cyan)
  - Secondary Accent (Purple): `#a855f7` (Smart Contract logic violet)
  - Success Indicator (Emerald): `#10b981` (Consensus OK, Node Verified)
  - Warning Indicator (Amber): `#f59e0b` (Stale price, High jitter)
  - Danger Indicator (Crimson): `#ef4444` (Consensus broken, Byzantine outlier, Flash loan exploit)
- **Typography**:
  - Headings & UI: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
  - Code & Cryptographic Hashes: `"JetBrains Mono", "Fira Code", monospace`
- **Responsive Layout**:
  - Fluid layout supporting $1280\text{px}+$ standard projector resolution, $1080\text{px}$ laptops, and tablet/mobile viewports.

---

## 7. Verification & Implementation Roadmap

### 7.1 Independent Verification Plan
Any implementation produced from this specification can be verified against the following objective criteria:
1. **Zero-Dependency Test**:
   - Serve directory with a basic HTTP server (e.g. `npx serve .` or `python -m http.server 8000`).
   - Check browser console: must load with **0 errors, 0 warnings, 0 failed network requests**.
2. **R1 Acceptance Verification**:
   - Navigate to Tree view. All 5 levels (Level 0 to 4) rendered with SVG connectors.
   - In Student Mode: Level 1 nodes are locked until Level 0 nodes are marked completed.
   - In Teacher Mode: All nodes can be clicked immediately.
   - Filter by "Iniciante", "Intermediário", "Avançado": cards update visibility instantly.
   - Search "VRF": nodes without the term dim out, VRF node highlights.
   - Progress bar updates dynamically and persists across page reloads via `localStorage`.
3. **R2 Acceptance Verification**:
   - **Simulation 1**: Running "Cenário HTTP" produces divergent state roots across the 3 validators and alerts consensus break. Running "Cenário Oráculo" yields identical state roots and successful block addition.
   - **Simulation 2**: Toggling Push vs Pull shows distinct packet flows. Push displays heartbeat L1 gas meter; Pull displays zero idle gas and on-demand user transaction execution.
   - **Simulation 3**: Injecting a flash loan outlier (+100%) visibly highlights the rogue node, eliminates it from the consensus set via IQR, and calculates a median that deviates by $<0.01\%$, while displaying a warning for what the Mean would have caused.

---

## 8. Summary Conclusion

The combination of a **zero-backend Vanilla ES Module SPA architecture**, **SVG/Canvas hybrid rendering**, and **rigorous pedagogical state machines** delivers a self-contained, lightning-fast, and fail-safe educational platform. It directly satisfies all requirements of R1 and R2, providing instructor Kauan with an interactive teaching tool for the 05/10/2026 lecture at Inteli.
