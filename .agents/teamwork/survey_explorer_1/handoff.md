# Handoff Report — survey_explorer_1

## 1. Observation

- **Direct Observation 1 (Authoritative Requirements)**:  
  In file `c:\Users\Inteli\workspace\modulo-3\Blockas\Plano_de_aulas\.agents\teamwork\ORIGINAL_REQUEST.md`:
  - Lines 12-14 define R1:
    > "R1. Navegação Interativa da Árvore de Dependências: O sistema deve apresentar a árvore de dependências conceitual (Nível 0: EVM/Determinismo -> Nível 1: O Problema do Oráculo -> Nível 2: Arquitetura Push/Pull & Redes Descentralizadas/DONs -> Nível 3: Data Feeds, VRF, Keepers/Automação -> Nível 4: Hands-on em Solidity/Remix). O usuário deve conseguir clicar em cada nó para desbloquear/visualizar os detalhes aprofundados e seu impacto técnico."
  - Lines 15-20 define R2:
    > "R2. Visualizações Dinâmicas e Simulações de Conceitos: A plataforma deve conter componentes visuais interativos e dinâmicos:
    > - Simulação do Problema do Oráculo: demonstrar graficamente por que requisições HTTP quebram o consenso entre validadores.
    > - Simulação Push vs. Pull: fluxo animado mostrando a diferença entre feeds contínuos e modelo requisição-resposta.
    > - Simulador de Agregação de Dados da Rede Descentralizada (DON): seleção de múltiplos nós, eliminação de outliers e cálculo de mediana/consenso."
  - Lines 29-33 define Acceptance Criteria:
    > "O projeto gera um arquivo/aplicação funcional (HTML/CSS/JS autocontido ou SPA moderna) que pode ser aberta diretamente no navegador sem dependências complexas de backend."
    > "A árvore de dependências permite navegação fluida, filtragem por nível de dificuldade e rastreamento de progresso de estudo."
    > "Pelo menos 3 simulações interativas funcionais (Quebra de Consenso/HTTP, Fluxo Push vs Pull, Agregação de Oráculos descentralizados)."

- **Direct Observation 2 (Target Project Path)**:  
  Tool call `list_dir` on path `c:\Users\Inteli\workspace\modulo-3\Blockas\Plano_de_aulas\estudo_oraculos` returned:
  > `Encountered error in tool execution: directory c:\Users\Inteli\workspace\modulo-3\Blockas\Plano_de_aulas\estudo_oraculos does not exist`  
  Confirming that the project directory is completely fresh and must be scaffolded from scratch.

- **Direct Observation 3 (Pedagogical Foundation & Academic Context)**:  
  In file `c:\Users\Inteli\workspace\modulo-3\Blockas\Plano_de_aulas\PLANO DE AULAS - BLOCKCHAIN.docx.pdf`, page 15, "Atividade Nº 10":
  > "TIPO DE ATIVIDADE: Atividade Extensionista — Aula Técnica"  
  > "NOME DA ATIVIDADE: Aula Blockchain — Oráculos e integração com dados externos"  
  > "DESCRIÇÃO DA ATIVIDADE: Problema dos oráculos, feeds de dados, automações e formas de conectar smart contracts a informações externas."  
  > "RESPONSÁVEL(IS): Kauan"  
  > "DATA DE PREVISÃO: 05/10/2026"  
  > "LOCAL DA ATIVIDADE: Ateliê do Inteli"  
  > "PÚBLICO ALVO: Estudantes do Inteli interessados em blockchain e Web3 (estimativa: 20 participantes)"

- **Direct Observation 4 (Modern Web Tooling Verification)**:  
  Tool call `run_command` with `npx.cmd -y modern-web-guidance@latest search "interactive tree visualization canvas animation"` completed with exit code 0 and retrieved modern guidance tags `interactive-content-in-3d-scenes`, `dynamic-sibling-animations`, `css`, and `export-html-media-from-canvas`.

---

## 2. Logic Chain

1. **Premise 1 (Zero-Backend Mandate)**: From Observation 1, the platform must run directly in the browser with zero complex backend dependencies. A build-heavy framework (e.g. Next.js, Webpack, or backend Node/Python services) creates setup friction and execution failure risks for students and the lecturer in an offline or classroom environment.
2. **Premise 2 (Technology Selection)**: Based on Premise 1, a pure Vanilla ES2022+ SPA with semantic HTML5, modern CSS3 (Custom Properties, Grid, Flexbox, Glassmorphism, Backdrop Filter), and a Canvas 2D + SVG hybrid rendering engine provides maximum portability, instant loading, 60fps animations, and zero build tool failure modes.
3. **Premise 3 (R1 Concept Tree Structuring)**: From Observation 1 & 3, the curriculum requires a 5-level hierarchy (Levels 0 through 4) designed for Lesson 10 (05/10/2026). To serve both autonomous student study and live instructor presentation, the graph engine must support a directed acyclic graph (DAG) dependency solver with dual operational modes:
   - *Modo Aluno*: Progressive unlocking requiring prerequisite completion.
   - *Modo Instrutor*: Instant unlock bypass enabling lecturer Kauan to access any node or simulation on demand.
4. **Premise 4 (R2 Simulation 1 Mechanics)**: From Observation 1, to tangibly prove why EVM bytecode cannot execute HTTP calls, Simulation 1 must model at least 3 geographically dispersed validators (e.g. Frankfurt, Virginia, Tokyo) executing an identical transaction against a live fluctuating Web2 API endpoint. Network jitter and timestamp differences result in divergent price returns and diverging Merkle State Roots, triggering an explicit consensus break alert and network fork. In contrast, toggling to the Oracle model reads a deterministic on-chain storage slot, demonstrating identical state roots and successful block production.
5. **Premise 5 (R2 Simulation 2 Mechanics)**: To compare Push (Chainlink Data Feeds) vs. Pull (Pyth Network / Data Streams), Simulation 2 must visually depict packet lifecycles across 4 architectural tiers (Exchanges $\to$ Oracle DON/Streaming $\to$ Mempool/Ledger $\to$ dApp). The simulation must compute and contrast real-time metrics: continuous heartbeat gas costs vs. zero-idle on-demand verification gas, and minute-level latency vs. sub-second freshness.
6. **Premise 6 (R2 Simulation 3 Mechanics)**: To teach decentralized data aggregation, Simulation 3 must simulate a ring of 9 independent Oracle nodes querying distinct APIs (Binance, Coinbase, Kraken, Uniswap v3, etc.). Interactive Byzantine fault injection (flash loan price spikes, offline DNS timeouts, malicious collusion) must run through a 5-stage pipeline (Collection $\to$ Sorting $\to$ Tukey's IQR Outlier Elimination $\to$ Median Calculation $\to$ Threshold Signature Delivery), explicitly contrasting the catastrophic $+11\%$ price distortion of naive Mean vs. the $<0.005\%$ immunity of Median consensus.

---

## 3. Caveats

1. **Target Directory Status**: Directory `c:\Users\Inteli\workspace\modulo-3\Blockas\Plano_de_aulas\estudo_oraculos` does not yet exist on disk. Implementation workers in Milestone 1 must create this directory and establish the file layout.
2. **Scope Boundary**: This investigation focuses strictly on R1 (Tree Architecture) and R2 (Three Dynamic Simulations). Deep theoretical notes (R3) and Solidity contract suites for Remix (R4) are being analyzed concurrently by peer agent `survey_explorer_2`.
3. **Browser LocalStorage**: Progress tracking relies on the browser's `window.localStorage`. In strict incognito modes or automated headless test runners without local storage privileges, fallback in-memory state must be handled gracefully in `store.js`.

---

## 4. Conclusion

- A standalone, zero-dependency Vanilla ES2022+ web application is the optimal and most reliable technical architecture for `estudo_oraculos`.
- R1 (Interactive Concept Tree) is fully architected across 5 progressive levels with data schema, DAG prerequisite validator, teacher mode bypass, difficulty filters, search debounce, and inspector drawer.
- R2 (Simulations 1, 2, and 3) are fully specified with complete mathematical formulas, state machine states (`IDLE`, `FETCHING`, `DIVERGING`, `AGGREGATING`, `CONSENSUS_REACHED`), visual packet flows, and interactive control sandboxes.
- Complete findings and detailed component designs have been documented in:
  `c:\Users\Inteli\workspace\modulo-3\Blockas\Plano_de_aulas\.agents\teamwork\survey_explorer_1\simulation_tree_analysis.md`.

---

## 5. Verification Method

To independently verify this architectural strategy:
1. **Document Verification**: Inspect `c:\Users\Inteli\workspace\modulo-3\Blockas\Plano_de_aulas\.agents\teamwork\survey_explorer_1\simulation_tree_analysis.md` and verify that all sections (Levels 0-4 taxonomy, state management, UI/UX design tokens, and state machines for all 3 simulations) are fully documented.
2. **Zero-Backend Executability Check**: Once files are scaffolded in `estudo_oraculos`, run a local static web server:
   ```powershell
   cd c:\Users\Inteli\workspace\modulo-3\Blockas\Plano_de_aulas\estudo_oraculos
   npx.cmd serve .
   ```
   Open `http://localhost:3000` in Google Chrome or Microsoft Edge and ensure 0 runtime errors and 0 missing imports in Developer Tools Console.
3. **Simulation 1 Consensus Break Test**: Trigger "Cenário HTTP Direto" and verify that all 3 validator nodes calculate different state root hashes and that the red alert banner is displayed.
4. **Simulation 2 Push vs Pull Comparison**: Switch between Push and Pull tabs and verify that Push displays continuous gas consumption while Pull displays zero idle gas.
5. **Simulation 3 Byzantine Outlier Test**: Click "Ataque Flash Loan (+100%)", verify that the outlier node is purged via IQR, and that the calculated Median remains identical to fair market value while the Mean displays a critical failure warning.
