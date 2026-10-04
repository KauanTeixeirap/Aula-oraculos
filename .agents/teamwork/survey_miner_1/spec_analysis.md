# Especificação de Requisitos e Inventário de Funcionalidades: Plataforma Educacional de Oráculos em Blockchain

- **Projeto**: Plataforma Web Interativa de Aprendizado sobre Oráculos em Blockchain e Integração com Dados Externos (`estudo_oraculos`)
- **Data do Documento**: 2026-10-04
- **Agente**: `survey_miner_1` (teamwork_preview_spec_miner)
- **Documentos de Referência**:
  - `c:/Users/Inteli/workspace/modulo-3/Blockas/Plano_de_aulas/.agents/teamwork/ORIGINAL_REQUEST.md`
  - `c:/Users/Inteli/workspace/modulo-3/Blockas/Plano_de_aulas/PLANO DE AULAS - BLOCKCHAIN.docx.pdf` (Atividade 10 — Aula Técnica de 05/10/2026, Inteli Blockchain)

---

## 1. Contexto Didático e Enquadramento Institucional

A plataforma foi concebida para atender à **Atividade Nº 10** do plano semestral do **Inteli Blockchain** (Central Estudantil Inteli, 2º Semestre de 2026), agendada para **05/10/2026**:
- **Nome da Atividade**: *Aula Blockchain — Oráculos e integração com dados externos*
- **Tipo de Atividade**: Atividade Extensionista — Aula Técnica
- **Responsável / Instrutor**: Kauan
- **Local**: Ateliê do Inteli
- **Público-Alvo**: Estudantes do Inteli interessados em blockchain e Web3 (~20 participantes)
- **Impacto Esperado**: Compreender como aplicações blockchain utilizam dados externos de forma confiável, preparando os alunos para as aulas subsequentes de *Segurança e Vulnerabilidades em Smart Contracts* (19/10/2026) e *Interoperabilidade, Bridges e Comunicação Cross-Chain* (16/11/2026).

---

## 2. Matriz de Requisitos Primários e Secundários

### Requisitos Funcionais Primários (RF)

- **RF-01 (Árvore de Dependências Conceitual)**: Apresentar grafo direcionado/hierárquico estruturado em 5 níveis (Nível 0 a Nível 4).
  - Nível 0: EVM e Determinismo Estrito
  - Nível 1: O Problema do Oráculo (The Oracle Problem)
  - Nível 2: Arquiteturas Push/Pull & Redes Descentralizadas de Oráculos (DONs)
  - Nível 3: Primitivas Avançadas (Data Feeds, VRF, Keepers/Automação)
  - Nível 4: Laboratório Hands-on em Solidity e Remix IDE
- **RF-02 (Navegação e Inspeção de Nós)**: Cada nó da árvore deve ser clicável, abrindo painel de detalhes com resumo técnico, impactos na arquitetura de sistemas, código ou simulação relacionada e perguntas para a turma.
- **RF-03 (Filtros de Dificuldade e Rastreamento de Progresso)**:
  - Filtragem por dificuldade: Todos, Fundamentos (Iniciante), Intermediário, Avançado.
  - Checkpoint de progresso: Marcação de nó como "Concluído", cálculo de barra de progresso (%) e persistência em `localStorage`.
- **RF-04 (Simulação 1: Quebra de Consenso por Chamadas HTTP)**:
  - Demonstrar graficamente 5 validadores globais executando uma transação hipotética que tenta fazer `http_get()` em uma API externa.
  - Controle de volatilidade do preço e latência de rede.
  - Visualização de hashes de estado (`stateRoot`) divergentes e o colapso do consenso (rede em fork/rejeição de bloco).
- **RF-05 (Simulação 2: Comparativo de Arquiteturas Push vs. Pull)**:
  - Fluxo animado de dados entre fontes off-chain, rede de oráculos e smart contracts.
  - Alternância entre Modelo Push (Chainlink Price Feeds clássicos) e Modelo Pull / On-Demand (Pyth Network / Chainlink Data Streams).
  - Métricas comparativas dinâmicas: custo de gas acumulado, latência do dado (freshness) e sobrecarga de transação.
- **RF-06 (Simulação 3: Simulador de Agregação de Dados da DON)**:
  - Grade com múltiplos nós oráculos (mínimo 7 nós com feeds independentes).
  - Injeção de nós maliciosos / valores extremos (ataque bizantino) e simulação de nós caídos/offline.
  - Pipeline de consenso visual: Verificação de quórum -> Ordenação -> Filtro de Outliers (IQR / tolerância percentual) -> Cálculo da Mediana Ponderada final enviada on-chain.
- **RF-07 (Teoria Aprofundada e Casos de Uso Reais)**:
  - Estudo de caso 1: Ataques de Flash Loan e manipulação de preço em AMMs (ex.: bZx, Mango Markets, Harvest) vs Oráculos descentralizados robustos (Chainlink / TWAP).
  - Estudo de caso 2: Aleatoriedade Verificável (VRF) — falhas do uso de `block.timestamp`/`prevrandao` e prova criptográfica elíptica.
  - Estudo de caso 3: Automação Descentralizada (Keepers) — solução para a passividade da EVM (sem cron jobs nativos) em liquidações DeFi e vaults.
- **RF-08 (Laboratório Prático Hands-on Solidity)**:
  - Três contratos completos, compiláveis e anotados linha por linha:
    1. `PriceConsumerV3.sol` (Consumo de `AggregatorV3Interface` com proteções contra dados estagnados / stale data).
    2. `RandomNumberVRF.sol` (Consumo de `VRFConsumerBaseV2Plus` com padrão assíncrono request-fulfill).
    3. `AutomationKeeper.sol` (Implementação de `checkUpkeep` e `performUpkeep` para automação de tarefas DeFi).
  - Contrato auxiliar de testes: `MockPriceFeed.sol` (permite ao aluno testar 100% no Remix VM sem precisar de carteira ou faucets).
  - Botão de cópia para a área de transferência com feedback visual e instruções detalhadas passo a passo para o Remix IDE.
- **RF-09 (Modo Instrutor / Roteiro de Aula)**:
  - Painel dedicado ao instrutor Kauan com cronograma sugerido para a aula de 05/10/2026, lista de perguntas reflexivas para engajar os 20 alunos e tópicos de conexão com as próximas aulas.

### Requisitos Não-Funcionais (RNF)

- **RNF-01 (Autocontenção & Zero Backend)**: A aplicação deve ser uma SPA moderna (HTML5, CSS3, JavaScript ES6+, SVG/Canvas) executável diretamente no navegador (`file:///` ou servidor estático simples), sem necessidade de bancos de dados externos, Node.js runtime ou infraestrutura em nuvem.
- **RNF-02 (Responsividade e Apresentação em Projetor)**: O layout deve se adaptar com nitidez a resoluções de notebooks de estudantes (1366x768 / 1920x1080) e telões de ateliê/projetores, com alto contraste e tipografia legível.
- **RNF-03 (Performance e Fluididade)**: Animações em CSS e Canvas operando a 60 FPS, sem travamentos na interface durante as simulações matemáticas de agregação.
- **RNF-04 (Design System Moderno Web3)**: Identidade visual profissional com paleta Dark Mode com acentos ciano/roxo/esmeralda, tipografia monoespaçada para código (`Fira Code` / `JetBrains Mono` / `Consolas`) e iconografia limpa.
- **RNF-05 (Acessibilidade e Usabilidade)**: Contraste conforme WCAG AA, tags semânticas, tooltips descritivos e atalhos intuitivos de teclado.

---

## 3. Especificação Detalhada da Árvore de Dependências de Conceitos (R1)

```
[Nível 0: EVM & Determinismo]
         │
         ▼
[Nível 1: O Problema do Oráculo]
         │
         ├───────────────────────────────┐
         ▼                               ▼
[Nível 2A: Push vs Pull]       [Nível 2B: DONs e OCR]
         │                               │
         └───────────────┬───────────────┘
                         ▼
[Nível 3: Primitivas & Serviços de Oráculos]
   ├── 3.1: Data Feeds & Validação de Preços
   ├── 3.2: VRF & Aleatoriedade Verificável
   └── 3.3: Keepers & Automação Descentralizada
                         │
                         ▼
[Nível 4: Laboratório Hands-on Solidity & Remix]
   ├── 4.1: Consumo de Feed (PriceConsumerV3)
   ├── 4.2: Consumo de VRF (RandomNumberVRF)
   ├── 4.3: Contrato Automatizado (AutomationKeeper)
   └── 4.4: Mock Local & Roteiro Passo a Passo
```

### Detalhamento dos Nós da Árvore

| Nó ID | Nível | Título | Pré-requisitos | Conceitos Chave | Impacto Técnico no Ecossistema | Questão Reflexiva para a Aula |
|-------|-------|--------|----------------|-----------------|--------------------------------|-------------------------------|
| `NODE_01` | Nível 0 | EVM & Determinismo Estrito | Nenhum | Função de transição de estado determinística, isolamento sandbox, ausência de I/O de rede na EVM | Se uma instrução da EVM gerasse resultados diferentes em nós distintos, a blockchain sofreria forks irreversíveis. | Por que a EVM não tem um opcode `HTTP_GET` nativo? |
| `NODE_02` | Nível 1 | O Problema do Oráculo | `NODE_01` | Ponto único de falha, paradoxo da descentralização, assimetria de segurança entre smart contract e fontes off-chain | Contratos matematicamente seguros tornam-se vulneráveis se a fonte de dados externa for comprometida. | Como confiar em dados de um mundo caótico dentro de uma máquina estritamente determinística? |
| `NODE_03` | Nível 2 | Arquitetura Push vs. Pull | `NODE_02` | Modelo Push (periódico/desvio), Modelo Pull (on-demand), Pyth vs Chainlink clássico, gas cost vs freshness | Escolha crítica de arquitetura: protocolos de alta frequência (Perp DEXs) exigem Pull; protocolos de lending convencionais costumam usar Push. | Quem deve pagar o gas da atualização do oráculo: o protocolo ou o usuário que executa a transação? |
| `NODE_04` | Nível 2 | Redes Descentralizadas de Oráculos (DONs) | `NODE_02` | Múltiplos nós independentes, agregação off-chain (OCR), tolerância a falhas bizantinas, quórum de assinaturas | Elimina pontos únicos de falha ao distribuir a coleta e o consenso entre validadores de reputação comprovada. | Quantos nós oráculos precisam ser corrompidos para manipular o feed de uma DON com $3f+1$ nós? |
| `NODE_05` | Nível 3 | Data Feeds & Proteções de Preço | `NODE_03`, `NODE_04` | `AggregatorV3Interface`, `latestRoundData`, stale data checks, heartbeats, roundId, desvio percentual | Evita liquidações indevidas causadas por feeds desatualizados durante congestionamentos de rede. | O que acontece com um protocolo DeFi se o oráculo ficar 4 horas sem atualizar o preço do ETH? |
| `NODE_06` | Nível 3 | VRF: Aleatoriedade Verificável | `NODE_01`, `NODE_04` | Assinatura elíptica off-chain, prova criptográfica, seed imutável, modelo commit-reveal em 2 etapas | Protege loterias, drops de NFTs e mecânicas de jogos contra exploração por mineradores/validadores (MEV). | Por que usar `block.prevrandao` ou `block.timestamp` em um sorteio na mainnet é extremamente perigoso? |
| `NODE_07` | Nível 3 | Keepers & Automação Descentralizada | `NODE_01`, `NODE_04` | Passividade da EVM, `checkUpkeep` (off-chain), `performUpkeep` (on-chain), incentivos econômicos de bots | Permite que protocolos executem liquidações, colheitas de rendimento e rebalanceamentos sem depender de servidores Web2 centralizados. | Como garantir que uma chamada a `performUpkeep` não seja executada maliciosamente se as condições mudarem entre a simulação e a inclusão no bloco? |
| `NODE_08` | Nível 4 | Hands-on: Consumo de Preço em Solidity | `NODE_05` | `AggregatorV3Interface`, validações de segurança, normalização de decimais, deploy em Sepolia e Mock | O aluno cria seu primeiro smart contract capaz de consultar a cotação real do ETH/USD com proteções de produção. | Como tratar feeds que possuem 8 decimais em contratos contábeis que operam com 18 decimais (ERC-20)? |
| `NODE_09` | Nível 4 | Hands-on: VRF Consumer & Automação | `NODE_06`, `NODE_07` | Request-Fulfill assíncrono, callback exclusivo, integração de automação com verificação em duas etapas | Capacita o aluno a implementar contratos dinâmicos e autônomos prontos para auditorias e hackathons. | Por que a função de recebimento do número aleatório (`fulfillRandomWords`) precisa ter limite estrito de gas? |

---

## 4. Especificação Detalhada das Simulações Interativas (R2)

### 4.1 Simulação 1: Quebra de Consenso por Requisições HTTP (The Oracle Problem)

- **Objetivo Pedagógico**: Provar visualmente e empiricamente por que a inclusão de chamadas de rede não-determinísticas dentro do motor de execução da blockchain rompe o consenso distribuído.
- **Entidades Visuais**:
  - **Servidor Web2 / API de Cotação Externa**: Localizado fora do cluster, emitindo cotações de BTC/USD que variam a cada centésimo de segundo.
  - **5 Nós Validadores Distribuidos Globalmente**:
    - Nó 1: São Paulo (Latência: 120ms)
    - Nó 2: Frankfurt (Latência: 25ms)
    - Nó 3: Tóquio (Latência: 240ms)
    - Nó 4: Virgínia (Latência: 40ms)
    - Nó 5: Cidade do Cabo (Latência: 310ms ou instabilidade configurável)
  - **Pipeline de Bloco**: Exibição da transação executada, do valor retornado para cada nó, do hash local calculado (`keccak256(estado)`) e do status de consenso da rede.
- **Controles Interativos**:
  - Slider: *Volatilidade da API Externa* (Baixa: $\pm 0.05\%$, Média: $\pm 0.5\%$, Alta: $\pm 3.0\%$).
  - Slider: *Latência de Rede / Jitter* (0ms a 500ms).
  - Checkbox: *Simular Timeout / Erro 500 em um Validador*.
  - Botão Principal: *Disparar Transação com HTTP Nativo*.
  - Botão Alternativo: *Disparar Transação via Oráculo Criptográfico (Determinístico)*.
- **Comportamento Observável**:
  - Ao disparar com HTTP nativo: Cada nó recebe um valor ligeiramente diferente devido à latência e volatilidade. Os nós geram `stateRoot` conflitantes. Um alerta em vermelho pulsa: **"FALHA CRÍTICA DE CONSENSO: A REDE SE DIVIDIU EM 4 FORKS. O BLOCO FOI REJEITADO!"**
  - Ao alternar para o modelo de Oráculo Determinístico: Uma única transação com dado assinado é incluída no bloco; todos os validadores recebem exatamente o mesmo payload criptográfico; 100% dos nós geram o mesmo `stateRoot` e o bloco é finalizado com sucesso.

### 4.2 Simulação 2: Comparativo Push vs. Pull (Fluxo Animado)

- **Objetivo Pedagógico**: Demonstrar as diferenças arquiteturais, de custo de gas e de latência entre os dois maiores paradigmas de oráculos do mercado moderno (Chainlink Data Feeds clássicos vs Pyth Network / Chainlink Data Streams).
- **Entidades Visuais**:
  - Três raias horizontais:
    1. *Mercado Financeiro Off-Chain / Exchanges* (Binance, Coinbase, CME)
    2. *Camada de Oráculos / Rede de Retransmissão* (DON / Wormhole / Pythnet)
    3. *Blockchain & dApp do Usuário* (Contrato de Empréstimo / Perp DEX)
  - Pacotes de dados animados trafegando entre as camadas.
- **Controles Interativos**:
  - Seletor de Arquitetura: *Modelo Push (Chainlink Clássico)* vs *Modelo Pull / On-Demand (Pyth Network)*.
  - Slider: *Frequência de Mudança de Preço no Mercado* (1 a 10 ticks/segundo).
  - Slider: *Demanda de Usuários / Transações dApp* (Baixa a Alta).
  - Botão de Controle: *Iniciar Fluxo Animado*, *Pausar*, *Avançar Passo a Passo*.
- **Painel de Métricas em Tempo Real**:
  - Gas Total Gasto na Blockchain (Gwei / USD simulado).
  - Idade do Dado (Data Freshness / Latência em segundos).
  - Número de Transações On-Chain geradas pelo Oráculo vs pelo Usuário.
  - Custo por Consulta de Preço.
- **Comportamento Observável**:
  - No Modelo Push: Bolinhas de dados são empurradas continuamente on-chain sempre que o desvio passa de 0.5% ou no heartbeat, gerando custo constante de gas mesmo sem nenhuma transação de usuário.
  - No Modelo Pull: O preço permanece na camada off-chain; quando o usuário clica em "Executar Swap/Trade", a transação do usuário carrega o pacote assinado recente e atualiza o contrato no exato milissegundo necessário, economizando gas ocioso.

### 4.3 Simulação 3: Agregador de Dados da Rede Descentralizada (DON)

- **Objetivo Pedagógico**: Ensinar como uma rede de múltiplos oráculos elimina manipuladores, filtra ruídos (outliers) e calcula uma mediana de consenso confiável antes da publicação on-chain.
- **Entidades Visuais**:
  - Painel com 7 a 9 nós oráculos exibindo: Identificador do Nó, Fonte Primária (ex: Kraken, Binance, Coinbase, OKX, Bybit, Bitfinex, CoinGecko), Preço Reportado, Status da Assinatura Criptográfica.
  - Gráfico de dispersão dos preços reportados.
  - Linha do tempo do algoritmo de agregação em 4 passos.
- **Controles Interativos**:
  - Botão para *Injetar Ataque de Manipulação (Nó Bizantino)*: Altera o valor de 1 ou 2 nós para valores absurdos (ex: $15.000 ou $120.000 enquanto o real é $65.000).
  - Botão para *Simular Queda de Conectividade*: Coloca nós em timeout/offline.
  - Slider: *Threshold de Tolerância de Desvio / IQR* (Interquartile Range).
  - Botão: *Executar Pipeline de Consenso*.
- **Pipeline de Execução (Passo a Passo Visual)**:
  1. *Fase 1: Verificação de Quórum*: Confere se há pelo menos $2f + 1$ respostas válidas com assinaturas digitais íntegras.
  2. *Fase 2: Ordenação dos Dados*: Ordena a lista de preços do menor para o maior.
  3. *Fase 3: Detecção e Eliminação de Outliers*: Destaca os nós manipulados em vermelho com aviso "OUTLIER DESCARTADO (Desvio > limite)".
  4. *Fase 4: Cálculo da Mediana Ponderada*: Identifica o elemento central da lista filtrada.
  5. *Fase 5: Emissão da Resposta Consensual*: Exibe o valor final pronto para ser consumido pelo smart contract.

---

## 5. Especificação dos Casos de Uso Reais & Teoria Aprofundada (R3)

### 5.1 Estudo de Caso: Ataques de Flash Loan & Manipulação de AMM Spot Price

- **A Anatomia do Ataque**:
  1. O invasor solicita um empréstimo instantâneo (Flash Loan) de 50.000 ETH sem colateral prévio (com a obrigação de devolver no mesmo bloco).
  2. Despeja 50.000 ETH em um pool de liquidez da Uniswap v2 (ex.: ETH/USDC), derrubando o preço spot do ETH para uma fração do valor real.
  3. Um protocolo de empréstimo DeFi vulnerável consulta diretamente a reserva da Uniswap (`reservesETH / reservesUSDC`) para avaliar o valor do colateral de seus mutuários.
  4. O protocolo considera que o ETH colateralizado pelos usuários agora "vale quase nada" e liquida as posições a preço de banana em favor do invasor, ou permite que o invasor tome empréstimo de outro ativo usando preços distorcidos.
  5. O invasor compra os ativos liquidados, restaura o saldo do pool, devolve o Flash Loan de 50.000 ETH e lucra milhões em uma única transação atômica.
- **A Solução com Oráculos Robustos**:
  - Oráculos como Chainlink não leem a mempool ou uma única DEX local; agregam dados de dezenas de CEXs e DEXs off-chain com volume ponderado (VWAP).
  - Ataques de flash loan operam dentro de uma única transação atômica na blockchain e não afetam o preço global das exchanges mundiais, neutralizando completamente o vetor de ataque.

### 5.2 Estudo de Caso: VRF (Verifiable Random Function) & Fraquezas On-Chain

- **A Armadilha Comum**: O uso de variáveis de bloco como fonte de aleatoriedade (`keccak256(abi.encodePacked(block.timestamp, block.prevrandao, msg.sender))`).
- **O Vetor de Exploração**:
  - Mineradores / validadores de Proof of Stake (PoS) conhecem o timestamp e o slot com antecedência.
  - Se o prêmio de uma loteria for de $100.000 e a recompensa do bloco for de $2.000, o validador pode optar por descartar um bloco desfavorável para tentar minerar outro favorável no próximo slot (selfish mining / MEV).
- **A Mecânica Criptográfica do VRF**:
  - O contrato submete uma semente (seed) e um nonces on-chain.
  - O nó oráculo aplica uma função criptográfica com sua chave privada secreta: $R = \text{VRF\_Hash}(SK, \text{Seed})$ e gera uma prova matemática $\pi = \text{VRF\_Proof}(SK, \text{Seed})$.
  - O contrato inteligente on-chain verifica $\text{VRF\_Verify}(PK, \text{Seed}, R, \pi) == \text{true}$ usando a chave pública do oráculo.
  - O resultado é matematicamente imprevisível, à prova de manipulação por validadores e auditável publicamente.

### 5.3 Estudo de Caso: Automação Descentralizada (Keepers) & Agentes Autônomos

- **A Limitação Fundamental da EVM**: A EVM é uma máquina puramente passiva. Ela só executa código quando uma transação externa assinada (EOA) é submetida e paga taxas de gas.
- **O Padrão de Arquitetura Chainlink Automation**:
  - `checkUpkeep(bytes calldata checkData)`: Função de leitura (`view`) simulada off-chain pelos nós Keepers a cada novo bloco. Custo de gas = zero.
  - `performUpkeep(bytes calldata performData)`: Quando a condição de disparo é satisfeita (ex.: preço caiu abaixo do limite de liquidação ou intervalo de tempo passou), o nó Keeper envia uma transação on-chain executando a tarefa.
  - Validação estrita on-chain: O contrato deve revalidar a condição dentro de `performUpkeep` para evitar ataques de front-running ou corridas de estado.

---

## 6. Especificação do Laboratório Prático Hands-on Solidity (R4)

### 6.1 Contrato 1: `PriceConsumerV3.sol` (Consumo Seguro de Feed de Preço)
- **Interface**: `@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol`
- **Técnicas Demonstradas**:
  - Inicialização do contrato do feed via endereço de proxy (Sepolia ETH/USD: `0x694AA1769357215DE4FAC081bf1f309aDC325306`).
  - Execução de `latestRoundData()` recuperando: `roundId`, `answer`, `startedAt`, `updatedAt`, `answeredInRound`.
  - Tratamento de 5 salvaguardas essenciais de produção:
    1. Preço positivo (`answer > 0`).
    2. Rodada completa (`updatedAt != 0`).
    3. Proteção contra dados congelados/estagnados (`block.timestamp - updatedAt < 3600`).
    4. Consistência de rodada (`answeredInRound >= roundId`).
    5. Conversão e normalização de casas decimais para padrão 18 decimais (WAD).

### 6.2 Contrato 2: `RandomWinnerVRF.sol` (Sorteio com Aleatoriedade Criptográfica)
- **Interface**: `@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol`
- **Técnicas Demonstradas**:
  - Padrão assíncrono em 2 fases: `requestRandomWords()` e `fulfillRandomWords()`.
  - Configuração de parâmetros: `subscriptionId`, `keyHash` (gas lane), `callbackGasLimit`, `requestConfirmations`, `numWords`.
  - Modificador de proteção `onlyCoordinator` no callback.
  - Seleção justa de ganhador usando módulo: `winnerIndex = randomWords[0] % participants.length`.

### 6.3 Contrato 3: `AutomationVaultKeeper.sol` (Cofre com Automação de Rebalanceamento)
- **Interface**: `@chainlink/contracts/src/v0.8/automation/interfaces/AutomationCompatibleInterface.sol`
- **Técnicas Demonstradas**:
  - Implementação de `checkUpkeep` avaliando saldo acumulado e tempo decorrido.
  - Implementação de `performUpkeep` com proteção de reentrância e revalidação do gatilho.
  - Registro de eventos de execução para auditoria off-chain.

### 6.4 Contrato 4: `MockPriceFeed.sol` (Simulador Local para Remix VM)
- **Propósito Didático**: Permitir que os 20 estudantes do Inteli testem o código imediatamente no Remix sem precisar de carteira instalada, rede de testes ou faucets de Sepolia ETH / LINK.
- **Funcionalidades**: Permite ao aluno alterar manualmente o preço (`updateAnswer`), simular desvios e testar as respostas do `PriceConsumerV3`.

---

## 7. Inventário Completo de Funcionalidades (Features Discovered)

| # | Categoria | Funcionalidade | Descrição | Entradas | Saídas | Comportamento de Erro | Descoberto Via |
|---|-----------|----------------|-----------|----------|--------|-----------------------|----------------|
| 1 | Navegação & Árvore | Grafo Visual de Dependências | Renderização do grafo com 5 níveis hierárquicos e conexões visuais | Nível selecionado, estado dos nós | Canvas/SVG interativo com nós estilizados | Se nó inválido, mantém seleção anterior | `ORIGINAL_REQUEST.md` R1 |
| 2 | Navegação & Árvore | Painel de Detalhes do Nó | Gaveta lateral expansível exibindo resumo técnico, impactos e links | Clique no nó | Painel com conteúdo didático e badges | Se nenhum nó clicado, oculta gaveta | `ORIGINAL_REQUEST.md` R1 |
| 3 | Navegação & Árvore | Filtro de Dificuldade | Filtragem dos tópicos da árvore por nível de maturidade | Botões (Todos, Básico, Intermediário, Avançado) | Grafo filtrado com nós correspondentes destacados | Se filtro sem resultados, exibe mensagem amigável | `ORIGINAL_REQUEST.md` Critérios |
| 4 | Navegação & Árvore | Rastreador de Progresso | Checkbox de conclusão de nós com cálculo percentual e persistência | Check/uncheck do nó | Barra de progresso atualizada e persistência em `localStorage` | Falha de `localStorage` tratada com fallback em memória | `ORIGINAL_REQUEST.md` Critérios |
| 5 | Navegação & Árvore | Reset de Progresso | Botão para zerar o progresso dos nós e recomeçar o roteiro | Clique em "Reiniciar Estudo" com confirmação | Progresso zerado e nós desmarcados | Usuário cancela: nenhuma alteração | Implicit / UX Best Practices |
| 6 | Simulações | Simulação 1: Quebra de Consenso HTTP | Simula 5 validadores globais executando `http_get()` com volatilidade e latência | Slider de volatilidade, slider de jitter, botão disparar | Animação de pacotes, tabela de valores recebidos, divergência de `stateRoot` e alerta de fork | Se erro de rede ativado em nó, nó reporta timeout/500 | `ORIGINAL_REQUEST.md` R2 |
| 7 | Simulações | Simulação 1: Modo Oráculo Determinístico | Dispara a mesma transação utilizando um oráculo criptográfico de consenso | Clique em "Testar com Oráculo" | Todos os 5 validadores recebem o mesmo valor assinado, gerando o mesmo `stateRoot` com bloco aprovado | N/A (caminho feliz didático) | `ORIGINAL_REQUEST.md` R2 |
| 8 | Simulações | Simulação 2: Comparador Push vs. Pull | Fluxo animado comparando feeds periódicos on-chain vs requisição assinada on-demand | Toggle Push/Pull, sliders de frequência e transações | Animação de fluxo, gráfico comparativo de consumo de gas e latência | Configurações extremas limitadas por min/max | `ORIGINAL_REQUEST.md` R2 |
| 9 | Simulações | Simulação 2: Modo Passo a Passo | Permite avançar o ciclo de vida do oráculo Push/Pull frame por frame | Botão "Próximo Passo", "Passo Anterior" | Exibição do estado da transação pausada com legenda didática | Bloqueia avanço ao atingir início ou fim do ciclo | Implicit / Didactic Enhancement |
| 10 | Simulações | Simulação 3: Grade de Nós da DON | Exibição de 7 a 9 nós oráculos com seus provedores e dados de mercado | Estado dos nós (ativo, corrompido, offline) | Cards visuais de cada nó com status de assinatura | Se nó offline, card fica acinzentado | `ORIGINAL_REQUEST.md` R2 |
| 11 | Simulações | Simulação 3: Injeção de Nós Bizantinos | Permite corromper manualmente nós para injetar valores manipulados | Clique no botão "Corromper Nó" ou clique no card do nó | Nó passa a emitir valor distorcido e recebe badge de suspeito | Se quórum inviabilizado, acusa falha de consenso | `ORIGINAL_REQUEST.md` R2 |
| 12 | Simulações | Simulação 3: Pipeline de Agregação e Mediana | Executa ordenação, eliminação de outliers por IQR e cálculo de mediana | Botão "Executar Agregação" | Destaque visual dos nós descartados e exibição da fórmula da mediana | Se $N < 2f+1$, alerta de quórum insuficiente emitido | `ORIGINAL_REQUEST.md` R2 |
| 13 | Teoria & Casos | Caso Flash Loan & AMM Manipulation | Explicação do ataque bZx/Mango Markets com gráfico interativo de mempool | Seleção de abas / etapas do ataque | Passo a passo do flash loan, manipulação de pool e contraste com Chainlink | N/A | `ORIGINAL_REQUEST.md` R3 |
| 14 | Teoria & Casos | Caso VRF Criptográfico | Explicação da prova elíptica versus o uso inseguro de `block.timestamp`/`prevrandao` | Visualizador de equações e diagrama de fluxo commit-reveal | Diagrama das 2 fases (Request & Fulfill) e verificação de assinatura | N/A | `ORIGINAL_REQUEST.md` R3 |
| 15 | Teoria & Casos | Caso Keepers & Automação | Explicação do paradoxo de Turing na EVM e o padrão `checkUpkeep`/`performUpkeep` | Diagrama de fluxo de bots incentivados | Análise de custos de simulação off-chain vs execução on-chain | N/A | `ORIGINAL_REQUEST.md` R3 |
| 16 | Laboratório Hands-on | Visualizador de Código com Syntax Highlighting | Exibe os contratos Solidity com destaque sintático e numeração de linhas | Seletor de contrato (`PriceConsumerV3`, `RandomWinnerVRF`, `AutomationVaultKeeper`, `MockPriceFeed`) | Código formatado com explicação de cada bloco | Seleção inválida cai no contrato padrão | `ORIGINAL_REQUEST.md` R4 |
| 17 | Laboratório Hands-on | Explicações Linha por Linha | Clique em linhas ou blocos do contrato abre anotação técnica detalhada | Clique na linha do código | Tooltip/caixa explicativa com justificativa de segurança | Clique fora fecha o balão | `ORIGINAL_REQUEST.md` R4 |
| 18 | Laboratório Hands-on | Copiar Código para Clipboard | Botão de um clique para copiar o contrato selecionado com feedback visual | Clique no botão "Copiar Código" | Texto copiado e ícone muda para "Copiado!" temporariamente | Fallback se `navigator.clipboard` bloqueado por permissão do browser | `ORIGINAL_REQUEST.md` R4 |
| 19 | Laboratório Hands-on | Guia Passo a Passo do Remix IDE | Roteiro estruturado de como abrir o Remix, compilar, configurar e executar | Passo 1 a 6 com capturas/ilustrações textuais claras | Guia didático sequencial com dicas para a aula | N/A | `ORIGINAL_REQUEST.md` R4 |
| 20 | Suporte Pedagógico | Painel do Instrutor (Kauan - 05/10/2026) | Visão especial para o instrutor com plano de aula, minutagem e perguntas | Botão / Aba "Roteiro da Aula 05/10" | Cronograma da aula, checklist de conceitos e tópicos para os 20 alunos | N/A | `PLANO DE AULAS.pdf` Ativ. 10 |
| 21 | Suporte Pedagógico | Mini-Quiz Conceitual Rápido | 5 perguntas de múltipla escolha para validar fixação dos alunos no final | Seleção de alternativas | Feedback imediato com explicação didática do erro/acerto | Bloqueia submissão sem resposta | Implicit / Didactic Enhancement |
| 22 | Interface & UX | Alternador de Tema / Responsividade | Interface com design Web3 moderno, modo escuro otimizado para projetores | Redimensionamento de tela, controles de contraste | Layout adaptativo fluido em 100% dos dispositivos | N/A | `ORIGINAL_REQUEST.md` Critérios |

---

## 8. Tabela de Casos de Borda (Edge Cases)

| # | Funcionalidade | Entrada / Condição Extrema | Comportamento Observado & Tratamento Requerido |
|---|----------------|----------------------------|------------------------------------------------|
| 1 | Árvore de Dependências | Janela do navegador redimensionada para resolução móvel ou muito estreita | O grafo reorganiza os nós em layout vertical responsivo ou ativa scroll suave bidirecional, mantendo as conexões legíveis. |
| 2 | Árvore de Dependências | `localStorage` desabilitado ou em modo anônimo estrito | A aplicação captura a exceção de escrita no `localStorage` sem quebrar o JavaScript, mantendo o progresso na memória da sessão (`sessionStorage` ou objeto JS em memória). |
| 3 | Árvore de Dependências | Usuário marca nó avançado (Nível 4) sem ter concluído os pré-requisitos (Nível 0-1) | A aplicação permite a marcação livre para flexibilidade de estudo, mas exibe um aviso sutil: "Atenção: tópicos pré-requisitos ainda pendentes." |
| 4 | Simulação 1 (HTTP) | Volatilidade máxima (3%) combinada com jitter máximo (500ms) e timeout ativado | 100% dos validadores divergem entre si; 2 validadores sofrem timeout total. O sistema exibe relatório claro com a fragmentação de 5 estados distintos e bloqueia o consenso. |
| 5 | Simulação 1 (HTTP) | Volatilidade zero e latência zero (caso ideal teórico improvável) | Mesmo que 2 validadores obtenham o mesmo valor por coincidência matemática, o sistema evidencia que qualquer variação de microsegundo na cotação real quebraria a rede. |
| 6 | Simulação 2 (Push vs Pull) | Frequência máxima de atualização com zero transações de usuários | No modelo Push: o contador de gas cresce indefinidamente sem benefício econômico. No modelo Pull: o gas permanece em zero, destacando o benefício de eficiência. |
| 7 | Simulação 3 (DON Agregação) | Injeção de nós maliciosos maior que a tolerância de falhas bizantinas ($f \ge N/3$) | Ao corromper mais de um terço dos nós, o sistema calcula que o quórum de segurança foi violado, exibe alerta de alerta vermelho e recusa a publicação do preço on-chain. |
| 8 | Simulação 3 (DON Agregação) | Todos os nós reportam exatamente o mesmo valor sem outliers | O algoritmo de ordenação e eliminação processa normalmente, IQR retorna zero, a mediana é idêntica ao valor único e a transação é aprovada em tempo recorde. |
| 9 | Simulação 3 (DON Agregação) | Lista com número par de nós oráculos ativos após eliminação | O cálculo da mediana adota a média aritmética dos dois valores centrais, conforme a especificação do contrato do Aggregator da Chainlink. |
| 10 | Laboratório Hands-on | Usuário sem suporte à API `navigator.clipboard` (navegadores antigos ou iframes com permissão restrita) | Fallback gracioso utilizando `document.execCommand('copy')` em `textarea` temporário invisível com notificação visual garantida. |
| 11 | Laboratório Hands-on | Cópia de código com quebras de linha em sistemas operacionais diferentes (Windows `CRLF` vs Linux/Mac `LF`) | Normalização automática de quebras de linha para manter a indentação e compilação perfeitas no Remix IDE. |
| 12 | Contratos Solidity | Teste de `PriceConsumerV3` com feed desatualizado há mais de 1 hora | A instrução `require(block.timestamp - updatedAt < MAX_TIMEOUT, "Stale price")` reverte a transação com mensagem de erro expressiva, protegendo o protocolo. |
| 13 | Contratos Solidity | Resposta do oráculo negativa ou nula (`answer <= 0`) provocada por falha extrema de mercado | A validação `require(answer > 0, "Invalid price")` reverte imediatamente, impedindo erros de divisão por zero ou contabilidade falha. |

---

## 9. Roteiro e Cronograma Sugerido para a Aula de 05/10/2026

Para apoiar diretamente o instrutor **Kauan** e os **20 estudantes do Inteli Blockchain**, a plataforma integrará o seguinte cronograma pedagógico sugerido:

| Bloco de Tempo | Duração | Tópico Abordado | Recurso da Plataforma Utilizado | Objetivo de Aprendizado |
|----------------|---------|-----------------|---------------------------------|-------------------------|
| 19:00 - 19:15 | 15 min | Boas-vindas & Nível 0: O Determinismo da EVM | Árvore de Conceitos: Nó 01 | Entender por que blockchains não têm chamadas de rede nativas |
| 19:15 - 19:40 | 25 min | Nível 1: O Problema do Oráculo & Falha de Consenso | Simulação 1: Quebra de Consenso por HTTP | Provar empiricamente por que requisições Web2 quebram validadores |
| 19:40 - 20:05 | 25 min | Nível 2: Arquiteturas Push vs. Pull & DONs | Simulação 2 (Push vs Pull) e Simulação 3 (DON Agregação) | Comparar Chainlink vs Pyth e aprender algoritmo de consenso de oráculos |
| 20:05 - 20:25 | 20 min | Nível 3: Casos Reais (Flash Loans, VRF e Keepers) | Painel Teórico & Estudos de Caso Interativos | Analisar hacks reais de DeFi e soluções com oráculos descentralizados |
| 20:25 - 21:05 | 40 min | Nível 4: Laboratório Hands-on no Remix IDE | Laboratório Solidity & Mock Local | Compilar e testar `PriceConsumerV3` e `MockPriceFeed` na prática |
| 21:05 - 21:20 | 15 min | Quiz Rápido & Conexão com Próximas Aulas | Mini-Quiz da Plataforma & Q&A | Fixar conceitos e fazer ponte com a Aula 11 (Segurança) e Aula 14 (Bridges) |

---

## 10. Conclusão da Análise de Especificação

Todas as exigências contidas em `ORIGINAL_REQUEST.md` e os detalhes operacionais da **Atividade 10** do `PLANO DE AULAS - BLOCKCHAIN.docx.pdf` foram mapeados em especificações funcionais e comportamentais rigorosas.

A implementação da plataforma como uma **Single Page Application (SPA) moderna, fluida e autocontida** (HTML5, CSS moderno e JavaScript ES6+ com visualizações SVG/Canvas interativas) atende plenamente ao critério de execução zero-backend, garantindo que o instrutor e os alunos executem a aplicação instantaneamente em qualquer computador com navegador moderno.
