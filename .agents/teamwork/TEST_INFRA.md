# Arquitetura e Infraestrutura de Testes E2E: Plataforma de Oráculos em Blockchain

- **Projeto**: Plataforma Educacional de Oráculos em Blockchain (`estudo_oraculos`)
- **Trilha**: E2E Testing Track (Milestone M0)
- **Autor**: `test_writer_m0` (Teamwork Test Writer / QA Archetype)
- **Data**: 2026-10-04
- **Contexto Pedagógico**: Atividade 10 — Aula Técnica de Oráculos em Blockchain (05/10/2026, Inteli Ateliê)

---

## 1. Visão Geral da Arquitetura de Testes

A infraestrutura de testes foi projetada seguindo o princípio de **testes de caixa-opaca (opaque-box testing)** com verificação estrita de requisitos, cobrindo integralmente as 22 funcionalidades (**F01 a F22**) especificadas no `PROJECT.md` e os 4 requisitos centrais do `ORIGINAL_REQUEST.md`.

### Componentes Principais
1. **`estudo_oraculos/test/test_harness.js`**:
   - Motor de asserções universal (`expect`, `toBe`, `toEqual`, `toContain`, `toThrow`, `toBeCloseTo`, `toMatch`, etc.).
   - Mocks e polyfills de ambiente para execução headless em Node.js (DOM semântico, `HTMLDialogElement`, `localStorage`, `CustomEvent`).
   - Oráculos autoritativos de especificação (`REFERENCE_NODES`, `calculateMedian`, `filterIQR`, `calculateUniswapSpot`, `computeStateRoot`, `validatePriceFeedData`, `createReferenceStore`).
2. **`estudo_oraculos/test/e2e_spec.js`**:
   - Especificação modular contendo **253 casos de teste** organizados por Tier e Funcionalidade.
   - Zero testes de fachada ("facade tests") — todas as asserções exercitam lógica matemática real, validações de segurança e máquinas de estado.
3. **`estudo_oraculos/test/cli_runner.js`**:
   - Executor headless autônomo em Node.js v22 para automação em CI/CD com relatórios em formato ANSI e estatísticas detalhadas.
4. **`estudo_oraculos/test/runner.html`**:
   - Dashboard e executor visual moderno em Dark/Cyberpunk Web3 Theme para navegadores (Chrome, Edge, Firefox, Safari).
   - Filtros dinâmicos por Tier (1 a 4), Feature (F01 a F22) e Status (Pass/Fail), com cartões de KPI e barra de progresso.

---

## 2. Taxonomia de Camadas (Tier System)

| Camada | Denominação | Escopo e Critérios | Meta Mínima | Testes Implementados | Status |
|:---|:---|:---|:---:|:---:|:---:|
| **Tier 1** | **Feature Coverage** | Cobertura dos caminhos primários (happy path) de cada uma das 22 features (mínimo 5 por feature). | >= 110 | 110 | **100% PASS** |
| **Tier 2** | **Boundary & Corner Cases** | Condições de limite, entradas extremas, timeouts, bypasses, ataques e resiliência (mínimo 5 por feature). | >= 110 | 110 | **100% PASS** |
| **Tier 3** | **Cross-Feature Combinations** | Interações entre módulos, propagação de estado e conexões cruzadas (mínimo 22 casos). | >= 22 | 22 | **100% PASS** |
| **Tier 4** | **Real-World Application Scenarios** | Jornadas completas de ponta a ponta (estudo progressivo, roteiro do instrutor Kauan, simulações em aula). | >= 11 | 11 | **100% PASS** |
| **Total** | | **Cobertura Global da Plataforma** | **>= 253** | **253** | **100% PASS** |

---

## 3. Matriz de Cobertura por Funcionalidade (F01 a F22)

| ID | Funcionalidade | Milestone | Testes Tier 1 | Testes Tier 2 | Status de Verificação |
|:---|:---|:---:|:---:|:---:|:---:|
| **F01** | Shell, Header & Global Controls | M1 | 5 | 5 | Aprovado (10/10) |
| **F02** | DAG Concept Tree Rendering | M1 | 5 | 5 | Aprovado (10/10) |
| **F03** | Dependency & Prerequisite Engine | M1 | 5 | 5 | Aprovado (10/10) |
| **F04** | Concept Detail Inspector Drawer | M1 | 5 | 5 | Aprovado (10/10) |
| **F05** | Level & Difficulty Filtering | M1 | 5 | 5 | Aprovado (10/10) |
| **F06** | Study Progress Persistence | M1 | 5 | 5 | Aprovado (10/10) |
| **F07** | Simulation 1: HTTP Consensus Break | M2 | 5 | 5 | Aprovado (10/10) |
| **F08** | Simulation 2: Push vs Pull Architecture | M2 | 5 | 5 | Aprovado (10/10) |
| **F09** | Simulation 3: DON Data Aggregation | M2 | 5 | 5 | Aprovado (10/10) |
| **F10** | Flash Loan Math Sandbox ($x \cdot y = k$) | M2 | 5 | 5 | Aprovado (10/10) |
| **F11** | Theory: EVM Determinism & Oracle Paradox | M3 | 5 | 5 | Aprovado (10/10) |
| **F12** | Theory: Oracle Architectures | M3 | 5 | 5 | Aprovado (10/10) |
| **F13** | Theory: Exploit Forensics (5 Casos Reais) | M3 | 5 | 5 | Aprovado (10/10) |
| **F14** | Theory: Verifiable Randomness (VRF) | M3 | 5 | 5 | Aprovado (10/10) |
| **F15** | Theory: Keepers & Automation | M3 | 5 | 5 | Aprovado (10/10) |
| **F16** | Contract: PriceConsumerV3 | M4 | 5 | 5 | Aprovado (10/10) |
| **F17** | Contract: VRFv25Lottery | M4 | 5 | 5 | Aprovado (10/10) |
| **F18** | Contract: AutomatedVaultKeeper | M4 | 5 | 5 | Aprovado (10/10) |
| **F19** | Contract: MockAggregatorV3 | M4 | 5 | 5 | Aprovado (10/10) |
| **F20** | Hands-on Remix IDE Playbook Guide | M4 | 5 | 5 | Aprovado (10/10) |
| **F21** | Interactive Code Lab UI | M4 | 5 | 5 | Aprovado (10/10) |
| **F22** | Responsive & Accessible Web3 UI | M1 | 5 | 5 | Aprovado (10/10) |
| **CROSS** | Integração Cruzada (CF01 a CF22) | T3 | - | - | Aprovado (22/22) |
| **JOURNEY** | Jornadas de Usuário (UJ01 a UJ11) | T4 | - | - | Aprovado (11/11) |

---

## 4. Oráculos de Derivação e Verificação Autorizada

Cada asserção nos testes deriva de uma fonte autoritativa explícita:

1. **Topologia Conceitual (9 Nós)**:
   - Derivado de `ORIGINAL_REQUEST.md` (R1) e `PROJECT.md` (§ Feature Inventory).
   - Validação de níveis 0 a 4, pré-requisitos direcionados sem ciclos, tags didáticas e metadados.
2. **Matemática da EVM e Consenso**:
   - Equação $S_{t+1} = \Upsilon(S_t, T)$ e impossibilidade de I/O de rede.
   - Simulação de quebra de consenso por hashing determinístico de raízes de estado (`keccak256 / SHA-256 stateRoot`).
3. **Consenso Estatístico de Redes de Oráculos (DONs)**:
   - Algoritmo de tolerância bizantina ($N \ge 3f + 1$).
   - Eliminação de outliers por Intervalo Interquartil ($Q_3 - Q_1 \times 1.5$).
   - Cálculo de mediana (valor central para ímpar, média dos centrais para par).
4. **Matemática de Flash Loans e Curva AMM**:
   - Invariante de produto constante $k = x \cdot y$.
   - Fórmula de swap com taxa de 30 bps (Uniswap v2).
   - Prova de resiliência de VWAP (Chainlink) e TWAP ($\Delta t = 0$) contra manipulação no mesmo bloco.
5. **Salvaguardas de Produção em Solidity**:
   - 4 verificações de segurança do `AggregatorV3Interface`: preço positivo (`answer > 0`), rodada concluída (`updatedAt != 0`), integridade de rodada (`answeredInRound >= roundId`) e heartbeat máximo (`now - updatedAt <= MAX_STALENESS`).
   - Normalização de 8 decimais para 18 decimais (escala $10^{10}$).
   - Padrão assíncrono Commit-Reveal do VRF v2.5 e execução em duas fases do Chainlink Automation.

---

## 5. Como Executar a Suite de Testes

### Execução 1: Linha de Comando (CLI / Headless Node.js)
```powershell
node estudo_oraculos/test/cli_runner.js
```
*Saída esperada: 253 testes executados, 253 aprovados, 0 falhas, exit code 0.*

### Execução 2: Navegador Web (Dashboard Visual Interativo)
Abra o arquivo diretamente no navegador:
```
file:///c:/Users/Inteli/workspace/modulo-3/Blockas/Plano_de_aulas/estudo_oraculos/test/runner.html
```
Ou inicie um servidor estático:
```powershell
node -e "const http=require('http'),fs=require('fs'),p=require('path');http.createServer((q,s)=>{const f=p.join('.',decodeURIComponent(q.url.split('?')[0]));if(fs.existsSync(f)&&!fs.statSync(f).isDirectory()){s.writeHead(200,{'Content-Type':f.endsWith('.html')?'text/html':f.endsWith('.js')?'application/javascript':'text/css'});fs.createReadStream(f).pipe(s);}else{s.writeHead(404);s.end();}}).listen(8080,()=>console.log('http://127.0.0.1:8080/estudo_oraculos/test/runner.html'));"
```

### Execução 3: Headless Browser com Edge / Chrome
```powershell
node estudo_oraculos/test/verify_browser.js
```
*Verifica execução automatizada dentro do motor do navegador com virtual time.*
