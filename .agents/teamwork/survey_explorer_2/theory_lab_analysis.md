# Análise Técnica Aprofundada: Conteúdo Teórico, Estudos de Caso e Laboratório Prático de Solidity (R3 & R4)

**Data da Investigação**: 04/10/2026  
**Responsável**: `survey_explorer_2` (Teamwork Explorer Archetype)  
**Contexto Pedagógico**: Aula Técnica Nº 10 — "Oráculos e integração com dados externos" (Plano de Aulas Inteli Blockchain, 05/10/2026, Ateliê do Inteli, Instrutor: Kauan).  
**Alvo do Projeto**: Plataforma Web Interativa `estudo_oraculos` (Zero-backend SPA / HTML5 + Modern JS).

---

## 1. Contexto Pedagógico e Alinhamento Curricular

A análise dos artefatos do repositório (`PLANO DE AULAS - BLOCKCHAIN.docx.pdf`, Atividade Nº 10) revela que a aula de **05/10/2026** é um ponto de inflexão crítico na trilha de formação técnica dos alunos do Inteli:
1. **Conhecimentos Prévios Estabelecidos (Aulas 5 a 9)**: Os alunos já dominam funcionamento de taxas de rede e gas (Aula 5), integração Web2 com EVM via RPC/providers/eventos (Aula 6), arquiteturas de privacidade (Aula 7), contratos padronizados OpenZeppelin e controle de acesso (Aula 8) e dApps full-stack conectados a carteiras (Aula 9).
2. **Objetivo da Aula 10**: Romper a barreira do determinismo hermético da EVM, capacitando os alunos a compreender e integrar dados e gatilhos externos sem violar as propriedades de segurança e descentralização da rede.
3. **Ponte para Tópicos Futuros**: A Aula 10 fundamenta a Aula 11 (Segurança e Vulnerabilidades de Smart Contracts) e a Aula 14 (Interoperabilidade, Bridges e CCIP).
4. **Missão da Plataforma**: Empoderar o instrutor (Kauan) com explicações matemáticas e forenses de nível sênior, acompanhadas de códigos Solidity prontos para teste imediato no Remix IDE, eliminando atritos de configuração durante os 90 minutos de aula.

---

## 2. R3: Especificação Teórica Detalhada e Estudos de Caso Reais

### 2.1 Determinismo da EVM e o "Problema do Oráculo"

#### 2.1.1 A Natureza Hermética da Máquina de Estados
A Ethereum Virtual Machine (EVM) é uma máquina de transição de estados determinística e quase-Turing-completa. A formalização matemática do consenso estabelece que:
$$S_{t+1} = \Upsilon(S_t, T)$$
Onde $S_t$ é o estado global da rede, $T$ é o bloco de transações e $\Upsilon$ é a função de transição de estado da Ethereum.

Para que milhares de validadores independentes distribuídos globalmente alcancem consenso sobre o estado da blockchain, **a execução de cada transação deve produzir exatamente o mesmo resultado em qualquer máquina, em qualquer instante de tempo**:
$$\text{StateRoot}_{n} = \text{MerklePatriciaTrieRoot}(S_n)$$

#### 2.1.2 Por que requisições HTTP quebram o consenso?
Se a EVM possuísse um opcode nativo hipotético `OP_HTTP_GET("https://api.binance.com/api/v3/ticker/price?symbol=ETHUSDT")`:
1. **Assincronia Temporal**: Um validador em Tóquio executaria no milissegundo $t_0$ e leria `ETH = $3.050,10`. Um validador em Frankfurt executaria no instante $t_0 + 300\text{ms}$ e leria `ETH = $3.050,45`.
2. **Falhas de Rede e Conectividade**: Um validador em São Paulo poderia sofrer um timeout DNS ou HTTP 504 Gateway Timeout.
3. **Mutabilidade e Ponto Único de Falha**: A API externa pode sofrer alterações de rota, indisponibilidade ou ser comprometida por um ataque hacker.
4. **Consequência no Consenso**: Cada validador calcularia uma raiz de estado diferente ($\text{StateRoot}_A \neq \text{StateRoot}_B$). O bloco seria invalidado ou a rede sofreria uma bifurcação catastrófica (Hard Fork não intencional), paralisando o protocolo.

**Conclusão Fundamental**: A blockchain não pode "puxar" (*pull*) dados do mundo externo. Todo dado externo deve ser transformado em uma transação assinada e "empurrado" (*pushed*) para dentro da rede por um ator externo (Externally Owned Account - EOA).

#### 2.1.3 O Trilema do Oráculo (The Oracle Problem)
A blockchain garante execução descentralizada, tolerância a falhas bizantinas e imutabilidade criptográfica. No entanto, se um contrato inteligente financeiro que gerencia US$ 1 bilhão depender de uma única chave privada centralizada atualizando o preço de um ativo:
- A descentralização da blockchain é anulada.
- O oráculo centralizado torna-se um vetor fatal de ataque ("Garbage in, Garbage out").
- Um invasor não precisa invadir a Ethereum; basta sequestrar a chave do oráculo para drenar o protocolo.

---

### 2.2 Modelos de Arquitetura: Push vs. Pull (On-Demand)

| Dimensão | Modelo Push (ex.: Chainlink Classic Data Feeds) | Modelo Pull / On-Demand (ex.: Pyth Network, Chainlink Data Streams) |
| :--- | :--- | :--- |
| **Mecanismo de Atualização** | A rede de oráculos submete transações on-chain periodicamente ou quando o desvio atinge um limiar. | Dados de preço são emitidos off-chain em alta frequência; a transação on-chain só ocorre quando um usuário demanda o dado. |
| **Gatilho de Atualização** | - **Threshold de Desvio** (ex.: $\Delta P \ge 0.5\%$)<br>- **Heartbeat** (ex.: a cada 3.600 segundos). | O usuário final/dApp busca o payload assinado off-chain e o envia junto à sua transação. |
| **Custo de Gas** | Alto custo sustentado pelos nós da rede de oráculos (centenas de transações por dia na L1/L2). | Custo transferido para a transação do usuário que consome o dado; zero custo on-chain em momentos de baixa atividade. |
| **Latência de Preço** | Segundos a minutos (delimitado pelo bloco e heartbeat). | Sub-segundo (200ms - 400ms), viabilizando Perp DEXs e derivativos de alta velocidade. |
| **Interface de Consumo em Solidity** | Simples leitura estática: `AggregatorV3Interface(feed).latestRoundData()`. | Fluxo em duas etapas na mesma transação: primeiro submete bytes criptográficos para verificação do contrato do oráculo, depois consome o valor. |
| **Melhor Aplicação** | Protocolos de Empréstimo (Lending: Aave, Compound), Stablecoins, RWA. | Perp DEXs (GMX, Drift), Opções, Trading de Alta Frequência (HFT). |

---

### 2.3 Ataques de Flash Loan e Manipulação de Preço Spot em AMMs

#### 2.3.1 A Falácia da Reserva de AMM como Oráculo de Preço
Muitos desenvolvedores iniciantes assumem que o preço de um token em uma corretora descentralizada (Uniswap, Sushiswap) representa o "preço de mercado":
$$P_{\text{spot}} = \frac{R_y}{R_x}$$
Onde $R_x$ e $R_y$ são as reservas dos tokens no pool de liquidez ($x \cdot y = k$).

**Por que a reserva é manipulável?**
1. O produto constante $x \cdot y = k$ reflete apenas a relação interna de estoque daquele pool específico, não a liquidez global do mercado.
2. Com um **Flash Loan** (empréstimo relâmpago sem garantia que deve ser tomado e quitado na mesma transação atômica), um atacante pode tomar emprestado dezenas de milhões de dólares sem risco de inadimplência.
3. Ao despejar um volume massivo de tokens no pool dentro da transação, a razão $\frac{R_y}{R_x}$ sofre uma distorção extrema por alguns blocos ou mesmo dentro do mesmo bloco.
4. Qualquer protocolo que consulte `pool.getReserves()` para avaliar colateral no meio dessa transação lerá um preço completamente forjado.

#### 2.3.2 Anatomia Passo a Passo de um Ataque de Flash Loan

```
+---------------------------------------------------------------------------------------+
|                               TRANSAÇÃO ATÔMICA ÚNICA                                 |
|                                                                                       |
|  1. Flash Loan: Toma 50.000.000 USDC na Aave (Taxa: 0.05%)                            |
|         │                                                                             |
|         ▼                                                                             |
|  2. Manipulação de Spot: Vende 50.000.000 USDC no Pool Uniswap XYZ/USDC               |
|     --> Reserva de XYZ é esgotada; preço spot de XYZ salta de $1.00 para $85.00        |
|         │                                                                             |
|         ▼                                                                             |
|  3. Exploração do Alvo: Protocolo de Lending consulta `getReserves()` da Uniswap      |
|     --> Atacante deposita 100.000 XYZ (valor real: $100k; avaliado pelo protocolo: $8.5M)|
|     --> Atacante toma empréstimo de 6.000.000 USDC em colateral legítimo (ETH/USDC)   |
|         │                                                                             |
|         ▼                                                                             |
|  4. Reversão/Arbitragem: Recompra USDC ou utiliza os fundos roubados                  |
|         │                                                                             |
|         ▼                                                                             |
|  5. Quitação do Flash Loan: Devolve 50.025.000 USDC à Aave                            |
|     --> Lucro Líquido do Atacante: ~US$ 5.975.000 transferidos para o endereço hacker |
+---------------------------------------------------------------------------------------+
```

#### 2.3.3 Casos de Estudo Históricos com Forense Técnica

1. **bZx Protocol (Fevereiro de 2020)**:
   - **Vulnerabilidade**: O contrato do bZx consultava a Kyber Network para obter taxas de conversão de ativos, e a Kyber, internamente, consultava a liquidez do pool sUSD da Uniswap v1.
   - **Mecanismo**: O atacante tomou um flash loan de 10.000 ETH na dYdX, usou parte para distorcer a taxa sUSD/ETH na Uniswap, e então abriu uma posição alavancada no bZx que comprou sUSD inflacionado, drenando centenas de milhares de dólares.
   - **Impacto**: Perda de mais de US$ 950.000 em dois ataques sequenciais.
2. **Harvest Finance (Outubro de 2020)**:
   - **Vulnerabilidade**: Os vaults da Harvest calculavam o valor das cotas com base no preço dos tokens no pool Y da Curve.
   - **Mecanismo**: Atacante usou flash loans de US$ 50M para manipular a proporção de stablecoins no pool da Curve, realizou depósitos na Harvest a um preço manipulado, reverteu a manipulação na Curve e sacou cotas superfaturadas.
   - **Impacto**: Drenagem de US$ 24 milhões em menos de 7 minutos.
3. **Mango Markets (Outubro de 2022)**:
   - **Vulnerabilidade**: O oráculo dependia do livro de ofertas spot da Serum DEX na Solana para o token ilíquido MNGO.
   - **Mecanismo**: O atacante (Avraham Eisenberg) financiou duas contas com US$ 5M em USDC cada, negociou contratos perpétuos contra si mesmo elevando artificialmente o preço de MNGO de US$ 0,038 para US$ 0,91 (aumento de 2.400%), e utilizou o colateral fictício inflacionado para tomar empréstimo de todos os ativos líquidos do protocolo.
   - **Impacto**: Dreno de US$ 114 milhões.
4. **Euler Finance (Março de 2023)**:
   - **Vulnerabilidade**: Embora utilizasse TWAP da Uniswap V3, uma falha na função `donateToReserves` permitiu que um usuário entrasse em auto-liquidação alavancada com flash loan, manipulando o índice de conversão interno de saúde do protocolo.
   - **Impacto**: Perda de US$ 197 milhões (posteriormente devolvidos após negociação).
5. **BonqDAO / AllianceBlock (Fevereiro de 2023)**:
   - **Vulnerabilidade**: Manipulação do feed de preços do Tellor para o token WALBT devido a liquidez de staking insuficiente para penalização imediata.
   - **Impacto**: Cunhagem ilícita de 100M BEUR e prejuízo superior a US$ 120 milhões.

#### 2.3.4 Mecanismos de Defesa Robustos
- **Decentralized Oracle Networks (DONs) com Multi-Source Aggregation**:
  - A Chainlink coleta dados de dezenas de agregadores de mercado profissionais (BraveNewCoin, CoinMarketCap, CoinGecko) que calculam Volume-Weighted Average Price (VWAP) através de centenas de exchanges centralizadas e descentralizadas.
  - Um flash loan executado na Ethereum afeta apenas um pool local; ele não altera a cotação global na Binance, Coinbase, Kraken ou OKX.
- **Filtragem de Outliers e Mediana Ponderada**:
  - Os nós da DON descartam os quartis superior e inferior e submetem a mediana ponderada, eliminando nós comprometidos.
- **Time-Weighted Average Price (TWAP)**:
  - Acumuladores geométricos (Uniswap v3) em janelas de 30 minutos ou 1 hora. Como uma transação de flash loan ocorre no mesmo bloco ($\Delta t = 0$), seu impacto na média ponderada pelo tempo é estatisticamente nulo.

---

### 2.4 VRF (Verifiable Random Function): Criptografia e Aleatoriedade Provável

#### 2.4.1 Por que o Gerador On-Chain Ingênuo é uma Falha Grave?
A tentativa comum e incorreta de gerar números aleatórios em Solidity:
```solidity
// VULNERABILIDADE CRÍTICA:
uint256 random = uint256(keccak256(abi.encodePacked(
    block.timestamp, 
    block.prevrandao, 
    msg.sender
)));
```
**Vulnerabilidades Críticas**:
1. **Manipulação por Propositor de Bloco (MEV / PoS RANDAO)**: O validador que monta o bloco pode inspecionar o resultado antes de publicar. Se for uma loteria de US$ 1 milhão e o validador perder, ele pode optar por descartar o bloco (abdicando da recompensa de bloco de 0,05 ETH) para refazer a semente no próximo bloco.
2. **Previsibilidade no Mempool (Front-Running)**: Qualquer bot de arbitragem pode simular a transação off-chain com os parâmetros do bloco atual e minerar se a aposta vencerá antes mesmo da transação ser confirmada.

#### 2.4.2 Fundamentação Criptográfica do VRF (Micali, Rabin, Vadhan)
Uma Função Aleatória Verificável opera com um par de chaves assimétricas: chave privada ($SK$) e chave pública ($PK$).
1. **Entrada**: Semente conhecida publicamente $\alpha$ (derivada de parâmetros do contrato + hash do bloco da requisição).
2. **Cálculo Off-Chain (pelo nó da Chainlink)**:
   - Número pseudo-aleatório: $\beta = \text{VRF\_Hash}(SK, \alpha)$
   - Prova criptográfica: $\pi = \text{VRF\_Prove}(SK, \alpha)$
3. **Verificação On-Chain**:
   - O contrato `VRFCoordinator` verifica na curva elíptica:
     $$\text{VRF\_Verify}(PK, \alpha, \beta, \pi) \stackrel{?}{=} \text{true}$$
   - **Propriedade da Unicidade (Uniqueness)**: Para uma dada chave $PK$ e semente $\alpha$, existe **um e apenas um** valor $\beta$ matematicamente válido. O nó do oráculo **não pode escolher** um número que o favoreça; ele só pode entregar o número gerado ou se abster de responder.
   - **Inviabilidade de Falsificação**: Sem a chave $SK$, é computacionalmente impossível forjar uma prova $\pi$ válida.

#### 2.4.3 Padrão Assíncrono de Duas Fases (Request-Fulfill)
1. **Fase 1: Requisição (`requestRandomWords`)**:
   - O contrato do usuário solicita aleatoriedade ao `VRFCoordinator`.
   - Um `requestId` único é retornado e associado à rodada atual.
   - O contrato salva o estado como `PENDING`. **O jogo jamais é resolvido na mesma transação!**
2. **Fase 2: Espera de Confirmações de Bloco**:
   - O oráculo aguarda $N$ confirmações de bloco (ex.: 3 blocos) para prevenir reorganizações da cadeia (*chain re-orgs*).
3. **Fase 3: Resolução (`fulfillRandomWords`)**:
   - O nó do oráculo submete a prova on-chain.
   - O `VRFCoordinator` verifica a prova na EVM.
   - Se válida, o coordenador faz uma chamada de retorno (*callback*) interna para a função `fulfillRandomWords` do contrato do usuário, entregando os números aleatórios verificados.

#### 2.4.4 Evolução: VRF v2 vs. VRF v2.5
- **VRF v2**: Exigia pré-financiamento em tokens LINK (via transferência direta ou sistema de Subscrições). Se a subscrição esgotasse os LINKs, a requisição travava.
- **VRF v2.5**: Introduziu **faturamento nativo** (pagamento direto em ETH/MATIC/BNB sem necessidade de converter para LINK), migração automatizada entre versões de coordenador e suporte a limites de gas aprimorados.

---

### 2.5 Smart Contract Keepers e Automação Descentralizada

#### 2.5.1 O Dilema do Contrato Passivo na EVM
Contratos inteligentes não possuem ciclos de CPU contínuos nem temporizadores nativos (`setTimeout`, cron jobs). Eles são máquinas de estado puramente inertes que só executam instruções quando ativados por uma transação assinada por uma EOA que paga gas.

Cenários que exigem execução autônoma:
- Liquidação de posições de empréstimo subcolateralizadas no instante em que o preço cai.
- Auto-compounding de rendimentos em cofres DeFi (Yearn, Beefy).
- Rebalanceamento diário de ativos sintéticos.
- Fechamento de rodadas de loteria após um timestamp limite.

#### 2.5.2 Bots Centralizados vs. Chainlink Automation (Keepers)
- **Bot Centralizado em Servidor Web2 (ex.: Script Node.js em AWS EC2)**:
  - *Riscos*: Servidor cai durante alta volatilidade; chave privada do bot armazenada no servidor pode vazar; se as taxas de gas da rede explodirem, o bot falha por gas insuficiente ou transação fica presa na mempool.
- **Rede Descentralizada de Automação (Chainlink Keepers)**:
  - Consenso distribuído entre nós independentes monitorando a blockchain a cada bloco.
  - Gerenciamento inteligente de gas com bumping automático de taxas.
  - SLAs de alta disponibilidade e sem ponto único de falha.

#### 2.5.3 Arquitetura de Duas Fases (`checkUpkeep` e `performUpkeep`)
A interface `AutomationCompatibleInterface` separa a lógica em duas etapas para maximizar a eficiência econômica:

1. **Etapa 1: Simulação Off-Chain (`checkUpkeep`)**:
   - Executada continuamente pelos nós do Keepers via chamada local JSON-RPC `eth_call`.
   - **Custo de Gas: US$ 0,00 (Zero Gas)**.
   - O nó simula a função `checkUpkeep(bytes calldata checkData)` a cada bloco.
   - Se o contrato responder `upkeepNeeded == false`, nada é enviado para a blockchain.
2. **Etapa 2: Execução On-Chain (`performUpkeep`)**:
   - Quando `checkUpkeep` retorna `upkeepNeeded == true`, o nó monta e transmite uma transação real assinada chamando `performUpkeep(bytes calldata performData)`.
   - O contrato executa a alteração de estado (ex.: compõe juros, liquida empréstimo).
   - O gas da transação é descontado do saldo de subscrição do contrato.

#### 2.5.4 Regra de Ouro de Segurança: Revalidação Obrigatória On-Chain
**Vulnerabilidade Comum**: Confiar cegamente nos dados recebidos em `performData` sem revalidar as condições de negócio.  
Entre o momento em que o nó simulou `checkUpkeep` e o bloco em que `performUpkeep` foi minerado, o estado da blockchain pode ter mudado (ex.: outro usuário já liquidou o empréstimo ou adicionou colateral).  
**Solução**: A função `performUpkeep` **deve sempre recalcular e revalidar** se o upkeep ainda é necessário antes de alterar o estado.

---

## 3. R4: Especificação do Laboratório Prático de Código (Solidity)

Todos os contratos foram desenhados na versão **Solidity `^0.8.20`**, com comentários educativos linha a linha, validações de segurança contra feeds obsoletos (*stale data*) e mocks complementares para teste local no Remix VM sem necessidade de conexão com testnet.

---

### 3.1 Contrato 1: `PriceConsumerV3.sol` (Consumo de Preço Chainlink)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @dev Interface oficial da Chainlink para consumo de Feeds de Preços.
 * Define as funções de leitura do AggregatorProxy on-chain.
 */
interface AggregatorV3Interface {
    function decimals() external view returns (uint8);
    function description() external view returns (string memory);
    function version() external view returns (uint256);
    function getRoundData(uint80 _roundId) external view returns (
        uint80 roundId,
        int256 answer,
        uint256 startedAt,
        uint256 updatedAt,
        uint80 answeredInRound
    );
    function latestRoundData() external view returns (
        uint80 roundId,
        int256 answer,
        uint256 startedAt,
        uint256 updatedAt,
        uint80 answeredInRound
    );
}

/**
 * @title PriceConsumerV3
 * @author Inteli Blockchain — Aula Técnica de Oráculos (05/10/2026)
 * @notice Contrato modelo para consumo seguro de Data Feeds da Chainlink.
 * @dev Implementa as 4 verificações de segurança obrigatórias contra dados obsoletos e corrompidos.
 */
contract PriceConsumerV3 {
    // Instância imutável do contrato agregador de preços
    AggregatorV3Interface public immutable priceFeed;
    
    // Tempo máximo de tolerância para considerar o dado atualizado (em segundos)
    // Para ETH/USD na Sepolia/Mainnet, o heartbeat é tipicamente de 3.600s (1 hora).
    uint256 public constant MAX_STALENESS = 3600;

    // Evento emitido quando uma cotação segura é recuperada
    event PriceRead(int256 rawPrice, uint8 decimals, uint256 timestamp);

    /**
     * @notice Construtor que inicializa o endereço do feed da Chainlink.
     * @param _priceFeed Endereço do contrato AggregatorV3 na rede alvo.
     * Exemplos na rede Sepolia:
     * - ETH / USD: 0x694AA1769357215DE4FAC081bf1f309aDC325306
     * - BTC / USD: 0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43
     * - LINK / USD: 0xc59E3633BAAC79493d908e636ee9f65AA20B6082
     */
    constructor(address _priceFeed) {
        require(_priceFeed != address(0), "Endereco de feed invalido");
        priceFeed = AggregatorV3Interface(_priceFeed);
    }

    /**
     * @notice Retorna o preço mais recente validado contra as 4 falhas de segurança de oráculos.
     * @return price Preço do ativo na escala de decimais nativa do agregador (geralmente 8 decimais em pares USD).
     */
    function getLatestPrice() public view returns (int256) {
        (
            uint80 roundId,
            int256 price,
            ,
            uint256 updatedAt,
            uint80 answeredInRound
        ) = priceFeed.latestRoundData();

        // 1. CHECAGEM DE PREÇO POSITIVO:
        // Evita bugs de preços nulos ou negativos (ex.: proteção contra falhas como a queda da LUNA).
        require(price > 0, "Preco corrompido: deve ser estritamente positivo");

        // 2. CHECAGEM DE RODADA CONCLUÍDA:
        // Garante que o timestamp de atualização foi efetivamente registrado no bloco.
        require(updatedAt != 0, "Rodada incompleta: timestamp zerado");

        // 3. CHECAGEM DE INTEGRIDADE DA RODADA (STALE ROUND CHECK):
        // Garante que a resposta pertence à rodada reportada, evitando respostas pendentes ou não consolidadas.
        require(answeredInRound >= roundId, "Dado obsoleto: resposta pertence a rodada anterior");

        // 4. CHECAGEM DE TEMPO LIMITE DE DEFASAGEM (HEARTBEAT TIMEOUT):
        // Garante que a rede de oráculos não travou ou deixou de enviar atualizações.
        require(block.timestamp - updatedAt <= MAX_STALENESS, "Dado expirado: excedeu o heartbeat maximo");

        return price;
    }

    /**
     * @notice Retorna o preço formatado e normalizado para 18 casas decimais (padrão ERC-20).
     * @dev Útil para operações matemáticas diretas com saldo em Wei.
     */
    function getNormalizedPrice() external view returns (uint256) {
        int256 price = getLatestPrice();
        uint8 decimals = priceFeed.decimals();
        
        if (decimals < 18) {
            return uint256(price) * (10 ** (18 - decimals));
        } else if (decimals > 18) {
            return uint256(price) / (10 ** (decimals - 18));
        }
        return uint256(price);
    }

    /**
     * @notice Retorna os metadados do feed para inspeção em aula.
     */
    function getFeedMetadata() external view returns (
        string memory description, 
        uint8 decimals, 
        uint256 version
    ) {
        return (
            priceFeed.description(), 
            priceFeed.decimals(), 
            priceFeed.version()
        );
    }
}
```

---

### 3.2 Contrato 2: `VRFv25Lottery.sol` (Aleatoriedade Verificável com Padrão Assíncrono)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @dev Interface simplificada do Coordenador do VRF v2 / v2.5.
 */
interface IVRFCoordinatorV2Plus {
    function requestRandomWords(
        bytes32 keyHash,
        uint256 subId,
        uint16 minimumRequestConfirmations,
        uint32 callbackGasLimit,
        uint32 numWords
    ) external returns (uint256 requestId);
}

/**
 * @dev Contrato base abstrato para consumo de VRF (equivalente ao VRFConsumerBaseV2).
 */
abstract contract VRFConsumerBaseV2 {
    address private immutable vrfCoordinator;

    error OnlyCoordinatorCanFulfill(address caller, address coordinator);

    constructor(address _vrfCoordinator) {
        vrfCoordinator = _vrfCoordinator;
    }

    function rawFulfillRandomWords(uint256 requestId, uint256[] memory randomWords) external {
        if (msg.sender != vrfCoordinator) {
            revert OnlyCoordinatorCanFulfill(msg.sender, vrfCoordinator);
        }
        fulfillRandomWords(requestId, randomWords);
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal virtual;
}

/**
 * @title VRFv25Lottery
 * @author Inteli Blockchain — Aula Técnica de Oráculos (05/10/2026)
 * @notice Demonstra o padrão assíncrono Commit-Reveal para obtenção de aleatoriedade verificável.
 */
contract VRFv25Lottery is VRFConsumerBaseV2 {
    enum LotteryState { OPEN, CALCULATING_WINNER, CLOSED }

    IVRFCoordinatorV2Plus public immutable COORDINATOR;
    address public immutable owner;
    
    // Parâmetros de configuração do VRF
    bytes32 public immutable keyHash; // Gas lane (limite de taxa de gas)
    uint256 public immutable subscriptionId; // ID da subscrição financiada
    uint16 public constant REQUEST_CONFIRMATIONS = 3; // Confirmações para evitar re-orgs
    uint32 public constant CALLBACK_GAS_LIMIT = 100000; // Limite de gas para o callback
    uint32 public constant NUM_WORDS = 1; // Quantidade de palavras aleatórias requisitadas

    // Estado da loteria
    LotteryState public state;
    address payable[] public players;
    address public recentWinner;
    uint256 public latestRequestId;
    uint256 public ticketPrice;

    // Mapeamento de rastreabilidade da requisição
    mapping(uint256 => bool) public pendingRequests;

    event TicketPurchased(address indexed player, uint256 amount);
    event WinnerRequested(uint256 indexed requestId);
    event WinnerPicked(address indexed winner, uint256 prize, uint256 randomness);

    modifier onlyOwner() {
        require(msg.sender == owner, "Apenas o proprietario pode executar");
        _;
    }

    /**
     * @param _coordinator Endereço do VRFCoordinator.
     * @param _keyHash Gas lane específica da rede.
     * @param _subId ID da subscrição criada no portal da Chainlink.
     * @param _ticketPrice Preço de entrada na loteria em Wei.
     */
    constructor(
        address _coordinator,
        bytes32 _keyHash,
        uint256 _subId,
        uint256 _ticketPrice
    ) VRFConsumerBaseV2(_coordinator) {
        owner = msg.sender;
        COORDINATOR = IVRFCoordinatorV2Plus(_coordinator);
        keyHash = _keyHash;
        subscriptionId = _subId;
        ticketPrice = _ticketPrice;
        state = LotteryState.OPEN;
    }

    /**
     * @notice Permite a um estudante comprar um bilhete da loteria.
     */
    function enter() external payable {
        require(state == LotteryState.OPEN, "Loteria nao esta aberta");
        require(msg.value == ticketPrice, "Valor incorreto do bilhete");
        players.push(payable(msg.sender));
        emit TicketPurchased(msg.sender, msg.value);
    }

    /**
     * @notice FASE 1: Dispara a requisição de aleatoriedade para o oráculo.
     * @dev Transiciona o estado para CALCULATING_WINNER, bloqueando novas entradas.
     */
    function pickWinner() external onlyOwner {
        require(state == LotteryState.OPEN, "Loteria em estado incorreto");
        require(players.length > 0, "Sem jogadores na rodada");

        state = LotteryState.CALCULATING_WINNER;

        latestRequestId = COORDINATOR.requestRandomWords(
            keyHash,
            subscriptionId,
            REQUEST_CONFIRMATIONS,
            CALLBACK_GAS_LIMIT,
            NUM_WORDS
        );

        pendingRequests[latestRequestId] = true;
        emit WinnerRequested(latestRequestId);
    }

    /**
     * @notice FASE 2: Callback invocado exclusivamente pelo VRFCoordinator.
     * @dev Processa a palavra aleatória verificada e premia o vencedor.
     */
    function fulfillRandomWords(
        uint256 requestId, 
        uint256[] memory randomWords
    ) internal override {
        require(state == LotteryState.CALCULATING_WINNER, "Estado incompativel");
        require(pendingRequests[requestId], "Requisicao nao reconhecida");

        pendingRequests[requestId] = false;
        
        // Mapeamento modular: 256 bits de entropia convertidos no indice do vencedor
        uint256 winnerIndex = randomWords[0] % players.length;
        address payable winner = players[winnerIndex];
        
        recentWinner = winner;
        uint256 prize = address(this).balance;

        // Reset seguro do estado antes da transferencia externa (evita reentrancia)
        players = new address payable[](0);
        state = LotteryState.OPEN;

        // Transferência do prêmio acumulado
        (bool success, ) = winner.call{value: prize}("");
        require(success, "Falha na transferencia do premio");

        emit WinnerPicked(winner, prize, randomWords[0]);
    }
}
```

---

### 3.3 Contrato 3: `AutomatedVaultKeeper.sol` (Automação Descentralizada com Keepers)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @dev Interface oficial do Chainlink Automation (Keepers).
 */
interface AutomationCompatibleInterface {
    function checkUpkeep(bytes calldata checkData) external view returns (bool upkeepNeeded, bytes memory performData);
    function performUpkeep(bytes calldata performData) external;
}

/**
 * @title AutomatedVaultKeeper
 * @author Inteli Blockchain — Aula Técnica de Oráculos (05/10/2026)
 * @notice Demonstra o padrão de execução em duas etapas (off-chain check / on-chain perform).
 * @dev Simula um cofre que distribui juros compostos ou reequilibra fundos a cada intervalo de tempo.
 */
contract AutomatedVaultKeeper is AutomationCompatibleInterface {
    uint256 public immutable interval; // Intervalo mínimo entre execuções (em segundos)
    uint256 public lastTimeStamp;        // Timestamp da última execução realizada
    uint256 public executionCount;      // Contador de upkeeps realizados
    address public owner;

    event UpkeepExecuted(uint256 indexed executionId, uint256 timestamp, bytes payload);

    /**
     * @param _interval Tempo em segundos entre as execuções autônomas (ex.: 60 segundos para testes em aula).
     */
    constructor(uint256 _interval) {
        require(_interval > 0, "Intervalo deve ser maior que zero");
        interval = _interval;
        lastTimeStamp = block.timestamp;
        owner = msg.sender;
    }

    /**
     * @notice ETAPA 1 (OFF-CHAIN): Executada periodicamente pelos nós da Chainlink via eth_call (CUSTO: ZERO GAS).
     * @param checkData Dados arbitrários passados pela configuração do Upkeep.
     * @return upkeepNeeded Booleano que indica aos nós se devem submeter uma transação on-chain.
     * @return performData Bytes passados como argumento para a função performUpkeep.
     */
    function checkUpkeep(
        bytes calldata checkData
    ) external view override returns (bool upkeepNeeded, bytes memory performData) {
        // Condição de negócio: o tempo decorrido deve exceder o intervalo configurado
        bool timePassed = (block.timestamp - lastTimeStamp) >= interval;
        
        upkeepNeeded = timePassed;
        
        // Codifica dados contextuais para envio na transação on-chain
        performData = abi.encode(block.timestamp, checkData);
        return (upkeepNeeded, performData);
    }

    /**
     * @notice ETAPA 2 (ON-CHAIN): Transação real assinada e submetida pela rede de Keepers.
     * @dev OBRIGATÓRIO: Revalidar a condição de negócio on-chain para prevenir front-running e transações duplicadas!
     * @param performData Carga útil gerada na simulação off-chain.
     */
    function performUpkeep(bytes calldata performData) external override {
        // REGRA DE OURO DE SEGURANÇA: Revalidação estrita da condição
        require((block.timestamp - lastTimeStamp) >= interval, "Condicao de upkeep nao satisfeita");

        // Atualização dos estados
        lastTimeStamp = block.timestamp;
        executionCount++;

        // Ações de negócio do cofre (ex.: distribuir rendimentos, colher recompensas)
        // [Aqui entraria a lógica de auto-compounding ou rebalanceamento DeFi]

        emit UpkeepExecuted(executionCount, block.timestamp, performData);
    }

    /**
     * @notice Função manual para os alunos testarem o disparo no Remix sem esperar o bot da Chainlink.
     */
    function manualTrigger() external {
        bytes memory dummyData = abi.encode(block.timestamp, bytes("manual"));
        this.performUpkeep(dummyData);
    }
}
```

---

### 3.4 Contrato 4: `MockAggregatorV3.sol` (Mock Local para Testes Sem Fricção no Remix VM)

Para permitir que todos os 20 estudantes executem os testes mesmo sem carteira MetaMask configurada ou sem saldo de faucet Sepolia:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MockAggregatorV3
 * @notice Permite simular no ambiente local Remix VM (JavaScript) qualquer comportamento de feed:
 * oscilação de preço, dados obsoletos, falha de heartbeat e travamento de rodada.
 */
contract MockAggregatorV3 {
    uint8 public decimalsValue = 8;
    string public descriptionValue = "ETH / USD Mock";
    uint256 public versionValue = 4;

    uint80 public roundId = 1;
    int256 public currentPrice = 300000000000; // $3.000,00 (8 decimais)
    uint256 public startedAt = block.timestamp;
    uint256 public updatedAt = block.timestamp;
    uint80 public answeredInRound = 1;

    function decimals() external view returns (uint8) { return decimalsValue; }
    function description() external view returns (string memory) { return descriptionValue; }
    function version() external view returns (uint256) { return versionValue; }

    function latestRoundData() external view returns (
        uint80 _roundId,
        int256 _answer,
        uint256 _startedAt,
        uint256 _updatedAt,
        uint80 _answeredInRound
    ) {
        return (roundId, currentPrice, startedAt, updatedAt, answeredInRound);
    }

    // Funções utilitárias para o instrutor simular cenários em aula:
    function setPrice(int256 _newPrice) external {
        roundId++;
        currentPrice = _newPrice;
        updatedAt = block.timestamp;
        answeredInRound = roundId;
    }

    function simulateStaleData(uint256 _secondsAgo) external {
        updatedAt = block.timestamp - _secondsAgo;
    }

    function simulateIncompleteRound() external {
        answeredInRound = roundId - 1;
    }
}
```

---

## 4. Guia Prático Passo a Passo para o Instrutor (Remix IDE Playbook)

O playbook a seguir deve ser integrado diretamente à interface da plataforma, oferecendo instruções operacionais diretas para a aula de 05/10/2026.

### 4.1 Cenário A: Execução Imediata no Remix VM (Sem Faucet / 100% Local)
1. **Abrir o Remix**: Acesse [remix.ethereum.org](https://remix.ethereum.org).
2. **Criar os Arquivos**:
   - Crie `MockAggregatorV3.sol` e cole o código do Mock.
   - Crie `PriceConsumerV3.sol` e cole o código do consumidor.
3. **Compilar**:
   - No menu lateral *Solidity Compiler*, selecione a versão `0.8.20` ou superior.
   - Clique em *Compile MockAggregatorV3.sol* e *Compile PriceConsumerV3.sol*.
4. **Deploy no Remix VM**:
   - No menu *Deploy & Run Transactions*, garanta que o *Environment* esteja em `Remix VM (Cancun)`.
   - Selecione o contrato `MockAggregatorV3` e clique em **Deploy**.
   - Copie o endereço gerado do contrato Mock.
   - Selecione o contrato `PriceConsumerV3`, cole o endereço do Mock no campo `_priceFeed` do construtor e clique em **Deploy**.
5. **Demonstração em Sala de Aula**:
   - Clique em `getLatestPrice` no `PriceConsumerV3` -> Observar o valor `300000000000` (US$ 3.000,00).
   - Clique em `getNormalizedPrice` -> Observar o valor expandido para 18 casas decimais (`3000000000000000000000`).
   - **Simulação de Falha de Heartbeat**: No Mock, chame `simulateStaleData(4000)`. Em seguida, chame `getLatestPrice` no consumidor -> O Remix exibirá o revert com a mensagem `"Dado expirado: excedeu o heartbeat maximo"`.
   - **Simulação de Rodada Corrompida**: No Mock, chame `simulateIncompleteRound()`. Ao chamar o consumidor -> Ocorre o revert `"Dado obsoleto: resposta pertence a rodada anterior"`.

### 4.2 Cenário B: Execução em Rede de Teste Real (Ethereum Sepolia)
1. **Conectar Carteira**:
   - No Remix, altere o *Environment* para `Injected Provider - MetaMask`.
   - Conecte a carteira com saldo na rede **Sepolia**.
2. **Deploy Direto com Feed Oficial**:
   - Selecione o contrato `PriceConsumerV3`.
   - No parâmetro `_priceFeed`, insira o endereço oficial do feed ETH / USD da Sepolia:
     `0x694AA1769357215DE4FAC081bf1f309aDC325306`
   - Confirme a transação na MetaMask.
3. **Consulta ao Vivo**:
   - Ao chamar `getLatestPrice`, o contrato consultará os nós validadores da Chainlink gravados na Sepolia em tempo real, exibindo a cotação real do mercado de criptoativos.

---

## 5. Especificação de Recursos de Interface para a Plataforma Web (`estudo_oraculos`)

Para atender plenamente aos requisitos R3 e R4 no produto final:
1. **Visualizador de Código com Abas e Destaque de Sintaxe**:
   - Abas claras: `PriceConsumerV3.sol`, `VRFv25Lottery.sol`, `AutomatedVaultKeeper.sol`, `MockAggregatorV3.sol`.
   - Botão flutuante "Copiar Código" com feedback visual imediato (tooltip/toast "Copiado com sucesso!").
   - Linhas numeradas com destaques nas linhas das 4 checagens de segurança.
2. **Caixas de Anotação Linha a Linha Expansíveis**:
   - Ao clicar nas linhas 70 a 86 de `PriceConsumerV3.sol`, exibir cards explicativos abordando por que cada checagem foi criada e qual ataque histórico ela neutraliza.
3. **Simulador Interativo de Matemática de Flash Loan em AMM**:
   - Painel interativo com sliders:
     - *Tamanho do Flash Loan* (US$ 0 a US$ 100M).
     - *Liquidez do Pool Uniswap* (US$ 1M a US$ 50M).
   - Gráfico dinâmico comparando:
     - Preço Spot da AMM ($x \cdot y = k$) -> Sofre salto abrupto.
     - Preço Chainlink DON (Mediana Multi-Mercado) -> Permanece inalterado.
     - Preço TWAP 30min -> Permanece estável.
   - Indicador de Resultado: Mostra claramente se o protocolo com oráculo ingênuo foi drenado ou se permaneceu solvente.
4. **Cheat-Sheet de Endereços Oficiais (Testnet Sepolia)**:
   - Tabela com botões de cópia rápida para os feeds mais populares (ETH/USD, BTC/USD, LINK/USD), Coordenadores VRF e Registradores de Automation.

---

## 6. Conclusão da Investigação
Esta especificação consolida toda a fundamentação teórica rigorosa (R3) e os contratos Solidity funcionais e seguros (R4) necessários para que o instrutor conduza uma aula memorável e de altíssimo padrão técnico no Inteli em 05/10/2026.
