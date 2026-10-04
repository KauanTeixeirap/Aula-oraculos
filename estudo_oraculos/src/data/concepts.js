/**
 * Conceptual Taxonomy for Blockchain Oracles and External Data Integration.
 * Designed for Inteli Módulo 3 — Atividade 10 (Aula Técnica: 05/10/2026).
 * Contains complete 5-level hierarchy (Levels 0 through 4, 9 conceptual nodes).
 */

export const CONCEPTS = [
  {
    id: 'NODE_01',
    level: 0,
    levelName: 'Nível 0: EVM & Determinismo Estrito',
    title: 'EVM & Determinismo Estrito',
    subtitle: 'Por que nós validadores devem calcular exatamente o mesmo estado a partir dos mesmos inputs',
    difficulty: 'Fundamento',
    prerequisites: [],
    tags: ['EVM', 'State Transition', 'Merkle Patricia Trie', 'Consenso', 'Determinismo'],
    mathFormula: 'S_{t+1} = \\Upsilon(S_t, T)',
    mathDescription: 'Função de transição de estado determinística: a partir do estado anterior St e do bloco de transações T, o novo estado St+1 é estritamente previsível e idêntico em todos os nós.',
    coreConcept: 'A Ethereum Virtual Machine (EVM) é um autômato de estados formal e puramente determinístico. Para qualquer estado global anterior S e bloco de transações T, a função de transição de estado Υ(S, T) deve produzir exatamente o mesmo novo estado S\' em dezenas de milhares de validadores independentes distribuídos pelo mundo. Se um único nó calcular um estado diferente, a rede bifurca (hard fork involuntário) e o consenso colapsa.',
    technicalImpact: 'Como a EVM opera em um sandbox isolado sem acesso a I/O de rede ou syscalls de relógio de sistema, contratos inteligentes não possuem e nunca possuirão um opcode nativo como HTTP_GET. A entrada de dados do mundo exterior depende estritamente de transações atômicas autenticadas e assinadas por contas externas (EOA).',
    pitfall: 'Achar que a ausência de chamadas HTTP na EVM é uma limitação temporária da linguagem Solidity e que futuras atualizações permitirão requisições REST normais dentro de smart contracts.',
    didacticQuestion: 'Por que a EVM não tem um opcode HTTP_GET nativo e qual seria a consequência imediata para a blockchain se um smart contract pudesse consultar uma API REST Web2?',
    codePreview: `// A EVM exige determinismo absoluto em cada opcode:
// function getEthPrice() public view returns (uint256) {
//     // IMPOSSÍVEL na EVM:
//     // return http.get("https://api.binance.com/price");
//     // Validadores em Tóquio e Frankfurt teriam valores diferentes!
// }`,
    simulationId: 'sim-consensus',
    simulationLabel: 'Simulação 1: Quebra de Consenso HTTP'
  },
  {
    id: 'NODE_02',
    level: 1,
    levelName: 'Nível 1: O Problema do Oráculo',
    title: 'O Problema do Oráculo (The Oracle Problem)',
    subtitle: 'O abismo de confiança entre contratos descentralizados e dados externos',
    difficulty: 'Fundamento',
    prerequisites: ['NODE_01'],
    tags: ['Oracle Problem', 'SPOF', 'GIGO', 'Assimetria de Confiança', 'Segurança Web3'],
    mathFormula: '\\text{Trust}(App) = \\min\\big(\\text{Trust}(SmartContract), \\text{Trust}(Oracle)\\big)',
    mathDescription: 'Teorema da assimetria de confiança: a segurança geral de uma dApp é limitada pelo elo mais fraco da cadeia — a fonte de dados externa.',
    coreConcept: 'O "Problema do Oráculo" reside no paradoxo de que um smart contract pode ser matematicamente perfeito e formalmente verificado, mas torna-se tão frágil quanto sua fonte de alimentação de dados. Se o oráculo reportar dados incorretos, o contrato executará fielmente operações financeiras catastróficas (princípio Garbage In, Garbage Out).',
    technicalImpact: 'Um oráculo centralizado introduz um Ponto Único de Falha (SPOF) e anula a proposta de descentralização da blockchain. Se uma única chave privada ou servidor Web2 ditar o preço de liquidação de um protocolo de empréstimo de $500M, essa entidade possui poder de roubo ou censura instantâneo.',
    pitfall: 'Acreditar que integrar dados externos é apenas criar uma chave de API Web2 e deixar o administrador (owner) atualizar as cotações manualmente pelo painel do Remix.',
    didacticQuestion: 'Se o código do smart contract é imutável e auditado, por que um oráculo malicioso ou comprometido pode drenar todo o saldo do protocolo sem violar nenhuma linha do código?',
    codePreview: `// ANTIPATTERN CRÍTICO: Oráculo centralizado com Ponto Único de Falha
contract NaivePriceOracle {
    address public owner;
    uint256 public btcPrice;
    
    function updatePrice(uint256 newPrice) external {
        require(msg.sender == owner, "Not authorized");
        btcPrice = newPrice; // Se o servidor do owner for invadido, todo o protocolo cai!
    }
}`,
    simulationId: 'sim-consensus',
    simulationLabel: 'Simulação 1: Quebra de Consenso HTTP'
  },
  {
    id: 'NODE_03',
    level: 2,
    levelName: 'Nível 2: Arquiteturas & Redes Descentralizadas',
    title: 'Arquitetura Push vs. Pull',
    subtitle: 'Atualizações contínuas de storage vs. feeds sob demanda criptograficamente assinados',
    difficulty: 'Intermediário',
    prerequisites: ['NODE_02'],
    tags: ['Push Model', 'Pull Model', 'Pyth Network', 'Chainlink Data Feeds', 'Gas Optimization', 'Heartbeat'],
    mathFormula: '\\text{Gas}_{Push} = \\sum_{i=1}^M G_{storage\\_write} \\quad \\text{vs} \\quad \\text{Gas}_{Pull} = N_{tx} \\times G_{verify\\_sig}',
    mathDescription: 'Modelo Push incorre em custo de gas contínuo por heartbeat/desvio (M); Modelo Pull só consome gas na liquidação/transação do usuário (Ntx).',
    coreConcept: 'No Modelo Push (Chainlink tradicional), nós do oráculo monitoram desvios de mercado (ex: 0.5%) ou intervalos fixos (heartbeat de 1h) e gravam os novos preços no storage da blockchain proativamente. No Modelo Pull (Pyth Network, Chainlink Data Streams), os preços são transmitidos e assinados off-chain com latência sub-segundo; o próprio usuário inclui a assinatura recente no calldata da sua transação para validação atômica on-chain.',
    technicalImpact: 'DEXs de futuros perpétuos e derivativos exigem o modelo Pull para evitar arbitragem tóxica (front-running de oráculos) e latências inferiores a 400ms. Já protocolos de empréstimo (Lending) em Ethereum L1 costumam preferir Push pela simplicidade de leitura compartilhada.',
    pitfall: 'Achar que o modelo Push é universalmente superior por ser "mais simples de chamar" sem calcular a insustentabilidade de gas gerada por feeds de baixa frequência em redes L1 caras.',
    didacticQuestion: 'Quem deve pagar o custo de gas da atualização do oráculo: a rede do protocolo periodicamente ou o usuário final ao executar uma transação de swap ou empréstimo?',
    codePreview: `// 1. Modelo Push: Leitura passiva de storage pré-atualizado
(, int256 price, , , ) = priceFeed.latestRoundData();

// 2. Modelo Pull: Verificação atômica de payload assinado pelo usuário
bytes[] memory priceUpdateData = msg.data[payloadStart:];
uint256 fee = pyth.getUpdateFee(priceUpdateData);
pyth.updatePriceFeeds{ value: fee }(priceUpdateData);`,
    simulationId: 'sim-push-pull',
    simulationLabel: 'Simulação 2: Fluxo Push vs. Pull'
  },
  {
    id: 'NODE_04',
    level: 2,
    levelName: 'Nível 2: Arquiteturas & Redes Descentralizadas',
    title: 'Redes Descentralizadas de Oráculos (DONs) & OCR',
    subtitle: 'Consenso bizantino off-chain e threshold signatures para segurança máxima',
    difficulty: 'Intermediário',
    prerequisites: ['NODE_02'],
    tags: ['DON', 'OCR', 'BFT', 'Threshold Signatures', 'Sybil Resistance'],
    mathFormula: 'N \\ge 3f + 1 \\implies \\text{Quórum BFT} = 2f + 1',
    mathDescription: 'Tolerância a Falhas Bizantinas: em uma rede com N nós, até f nós podem agir de má-fé ou falhar sem comprometer a exatidão do resultado.',
    coreConcept: 'Uma Decentralized Oracle Network (DON) elimina o SPOF organizando dezenas de nós independentes (ex: Chainlink OCR). Cada nó consulta APIs de exchanges distintas, troca mensagens em uma rede P2P off-chain, filtra outliers estatísticos, calcula a mediana e gera uma única assinatura criptográfica compacta (threshold signature). Uma única transação barata é então enviada on-chain.',
    technicalImpact: 'O Off-Chain Reporting (OCR) reduziu os custos de gas dos oráculos em mais de 90%, substituindo múltiplas transações on-chain individuais de cada nó por um consenso off-chain seguro e auditável on-chain.',
    pitfall: 'Supor que descentralizar um oráculo significa apenas ler 5 exchanges a partir de um único script em Node.js ou Python em vez de ter nós fisicamente e juridicamente independentes.',
    didacticQuestion: 'Se 3 de 10 nós de uma DON forem invadidos por hackers e transmitirem cotações manipuladas, como a rede garante matematicamente que o preço final será legítimo?',
    codePreview: `// Contrato agregador valida um relatório com consenso off-chain e assinaturas agregadas:
// OCR2Abstract.sol
function transmit(
    bytes32[3] calldata reportContext,
    bytes calldata report,
    bytes32[] calldata rs,
    bytes32[] calldata ss,
    bytes32 rawVs
) external;`,
    simulationId: 'sim-don',
    simulationLabel: 'Simulação 3: Agregação DON & Outliers'
  },
  {
    id: 'NODE_05',
    level: 3,
    levelName: 'Nível 3: Primitivas Especializadas',
    title: 'Data Feeds Financeiros & Proteções de Produção',
    subtitle: 'Interface AggregatorV3, detecção de dados obsoletos (stale data) e normalização de decimais',
    difficulty: 'Intermediário',
    prerequisites: ['NODE_03', 'NODE_04'],
    tags: ['AggregatorV3', 'Stale Data', 'Heartbeat', 'Decimals', 'DeFi Security'],
    mathFormula: '\\Delta t = \\text{block.timestamp} - \\text{updatedAt} \\le \\text{MAX\\_HEARTBEAT}',
    mathDescription: 'Validação temporal obrigatória: se a diferença entre o timestamp do bloco e a atualização do oráculo exceder o limite, o dado é considerado estagnado.',
    coreConcept: 'Consumir feeds de preço em produção exige verificar 4 salvaguardas essenciais: preço estritamente positivo (answer > 0), rodada finalizada (updatedAt > 0), frescor temporal contra congestionamentos da rede (block.timestamp - updatedAt < MAX_TIMEOUT) e consistência sequencial (answeredInRound >= roundId). Feeds de USD possuem 8 casas decimais e precisam ser normalizados para 18 casas decimais no padrão ERC-20.',
    technicalImpact: 'Ignorar a verificação de dados estagnados (stale data) permite que invasores explorem protocolos de empréstimo durante quedas bruscas de mercado: se a rede congestionar e o feed atrasar, o invasor retira empréstimos avaliados pelo preço antigo.',
    pitfall: 'Apenas extrair o valor do preço ignorando completamente a tupla de metadados retornada por latestRoundData().',
    didacticQuestion: 'O que aconteceria com um protocolo DeFi se o oráculo ficar 4 horas sem atualizar o preço do ETH durante um crash de mercado devido a congestionamento de gas?',
    codePreview: `(uint80 roundId, int256 price, , uint256 updatedAt, uint80 answeredInRound) = priceFeed.latestRoundData();

// 4 Salvaguardas essenciais de auditoria:
require(price > 0, "Preco invalido/negativo");
require(updatedAt != 0, "Rodada incompleta");
require(block.timestamp - updatedAt <= 3600, "Dado obsoleto (stale feed)");
require(answeredInRound >= roundId, "Sequencia de rodada desatualizada");`,
    simulationId: 'sim-push-pull',
    simulationLabel: 'Simulação 2: Fluxo Push vs. Pull'
  },
  {
    id: 'NODE_06',
    level: 3,
    levelName: 'Nível 3: Primitivas Especializadas',
    title: 'VRF: Aleatoriedade Verificável',
    subtitle: 'Criptografia de curvas elípticas e commit-reveal contra manipulação de MEV e validadores',
    difficulty: 'Avançado',
    prerequisites: ['NODE_01', 'NODE_04'],
    tags: ['VRF', 'Commit-Reveal', 'Elliptic Curve', 'prevrandao Exploit', 'MEV'],
    mathFormula: '\\text{Verify}(PK, \\text{Seed}, R, \\pi) = \\text{true}',
    mathDescription: 'Prova criptográfica não-interativa: a partir da chave pública PK e da seed, qualquer entidade pode verificar que R foi gerado com a chave secreta correta.',
    coreConcept: 'Gerar números aleatórios usando variáveis on-chain como block.prevrandao ou block.timestamp é inseguro: validadores de Proof of Stake conhecem os slots futuros e podem descartar blocos desfavoráveis (selfish mining / MEV). O Verifiable Random Function (VRF) utiliza criptografia de chave pública: o oráculo calcula a aleatoriedade off-chain com sua chave privada gerando uma prova matemática (π) que o contrato valida on-chain antes de aceitar o número.',
    technicalImpact: 'Garante imparcialidade matemática em sorteios de loterias, distribuição de itens raros de jogos Web3 e geração de atributos de NFTs, eliminando qualquer viés ou manipulação por parte de validadores de blocos ou mineradores.',
    pitfall: 'Esperar que o número aleatório retorne instantaneamente no retorno da função. O VRF requer obrigatoriamente um ciclo assíncrono em duas etapas: requisição e callback.',
    didacticQuestion: 'Se o prêmio acumulado de uma loteria on-chain for de 500 ETH (~$1.5M) e a recompensa por produzir um bloco for 0.05 ETH, por que um validador tentaria manipular o resultado se dependesse de prevrandao?',
    codePreview: `// Ciclo assíncrono do VRF v2.5:
function requestRandomWords() external returns (uint256 requestId) {
    requestId = s_vrfCoordinator.requestRandomWords(req);
}

// Callback restrito chamado exclusivamente pelo coordenador do oráculo:
function fulfillRandomWords(uint256 requestId, uint256[] calldata randomWords) internal override {
    s_randomResult = randomWords[0];
    emit RandomnessReceived(requestId, s_randomResult);
}`,
    simulationId: 'sim-sandbox',
    simulationLabel: 'Simulação Sandbox: Flash Loans e Manipulação'
  },
  {
    id: 'NODE_07',
    level: 3,
    levelName: 'Nível 3: Primitivas Especializadas',
    title: 'Keepers & Automação Descentralizada',
    subtitle: 'Superando a passividade da EVM com simulação off-chain a zero gas e execução on-chain',
    difficulty: 'Intermediário',
    prerequisites: ['NODE_01', 'NODE_04'],
    tags: ['Automation', 'Keepers', 'checkUpkeep', 'performUpkeep', 'Autonomia'],
    mathFormula: '\\text{Simulacao}(\\text{checkUpkeep}) = 0\\text{ gas} \\quad \\implies \\quad \\text{Execucao}(\\text{performUpkeep}) > 0\\text{ gas}',
    mathDescription: 'O padrão separa a checagem contínua e gratuita off-chain da transação real on-chain que altera o estado.',
    coreConcept: 'Smart contracts na EVM são puramente passivos: não contêm timers nativos nem capacidade de executar tarefas agendadas sozinhos. O Chainlink Automation resolve isso dividindo o ciclo em duas partes: checkUpkeep, que roda continuamente em simulação off-chain nos nós do oráculo sem custo de gás, e performUpkeep, disparada on-chain quando a condição é satisfeita, com pagamento automatizado das taxas.',
    technicalImpact: 'Permite automação descentralizada de ordens limitadas em DEXs, colheita periódica de rendimentos em cofres (vaults), rebalanceamento de tesourarias e liquidações instantâneas de posições devedoras sem servidores Web2 centralizados.',
    pitfall: 'Esquecer de revalidar a condição de execução dentro de performUpkeep, abrindo brechas para front-running ou chamadas fora de tempo por invasores.',
    didacticQuestion: 'Por que um contrato inteligente não pode rodar um loop while(true) esperando 24 horas para executar um pagamento automático?',
    codePreview: `function checkUpkeep(bytes calldata) external view override returns (bool upkeepNeeded, bytes memory) {
    upkeepNeeded = (block.timestamp - lastTimeStamp) > interval;
}

function performUpkeep(bytes calldata) external override {
    // Revalidação estrita obrigatória contra manipulação externa:
    require((block.timestamp - lastTimeStamp) > interval, "Condicao nao satisfeita");
    lastTimeStamp = block.timestamp;
    rebalanceVault();
}`,
    simulationId: 'sim-sandbox',
    simulationLabel: 'Simulação Sandbox: Flash Loans e Manipulação'
  },
  {
    id: 'NODE_08',
    level: 4,
    levelName: 'Nível 4: Laboratório Hands-on em Solidity',
    title: 'Hands-on: Consumo de Preço em Solidity',
    subtitle: 'Contrato PriceConsumerV3 de produção, MockAggregator e deploy no Remix IDE',
    difficulty: 'Avançado',
    prerequisites: ['NODE_05'],
    tags: ['Solidity', 'Remix IDE', 'PriceConsumerV3', 'MockAggregator', 'Deploy Sepolia'],
    mathFormula: '\\text{Preco}_{18} = \\text{Preco}_8 \\times 10^{10}',
    mathDescription: 'Escalonamento de precisão: oráculos de USD com 8 decimais escalados para o padrão de 18 decimais de tokens ERC-20 (WAD).',
    coreConcept: 'Implementação prática e completa de um contrato consumidor de preços com as 4 salvaguardas industriais de segurança, função de conversão de decimais (8 para 18 casas decimais) e compatibilidade com o contrato Mock standalone para simulação instantânea no Remix VM sem necessidade de faucets.',
    technicalImpact: 'A base de código fornece a estrutura exata utilizada por grandes protocolos DeFi, pronta para ser compilada, testada e implantada pelos estudantes durante a aula prática.',
    pitfall: 'Esquecer de multiplicar o valor do feed por 10^10 ao calcular trocas com tokens padrão ERC-20 que utilizam 18 casas decimais.',
    didacticQuestion: 'Se o feed ETH/USD retornar 320000000000 (8 decimais), qual é a fórmula exata em Solidity para converter esse número para 18 decimais sem perda de precisão matemática?',
    codePreview: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract PriceConsumerV3 {
    AggregatorV3Interface internal priceFeed;
    
    constructor(address feedAddress) {
        priceFeed = AggregatorV3Interface(feedAddress);
    }
    
    function getLatestPriceScaled() public view returns (uint256) {
        (, int256 price, , uint256 updatedAt, ) = priceFeed.latestRoundData();
        require(price > 0 && block.timestamp - updatedAt < 3600, "Feed invalido");
        return uint256(price) * 1e10; // 8 decimais -> 18 decimais
    }
}`,
    simulationId: 'codelab-section',
    simulationLabel: 'Laboratório de Código: PriceConsumerV3'
  },
  {
    id: 'NODE_09',
    level: 4,
    levelName: 'Nível 4: Laboratório Hands-on em Solidity',
    title: 'Hands-on: VRF Consumer & Automação',
    subtitle: 'Contratos de sorteio verificável e cofre automatizado prontos para o Remix IDE',
    difficulty: 'Avançado',
    prerequisites: ['NODE_06', 'NODE_07'],
    tags: ['VRFConsumerBaseV2Plus', 'AutomationCompatible', 'Remix VM', 'Gas Limits'],
    mathFormula: '\\text{Ganhador} = \\text{randomWords}[0] \\pmod{\\text{participantes}.\\text{length}}',
    mathDescription: 'Mapeamento uniforme por aritmética modular: garante chances equiprováveis para todos os participantes inscritos.',
    coreConcept: 'Desenvolvimento prático de uma loteria descentralizada utilizando o padrão request-fulfill do VRF v2.5 com proteção de gas e seleção justa de ganhadores por aritmética modular, combinado com um cofre DeFi autônomo acionado por Keepers.',
    technicalImpact: 'Prepara os alunos para criar aplicações Web3 dinâmicas, justas e descentralizadas de ponta a ponta, prontas para hackathons e projetos de conclusão de curso.',
    pitfall: 'Tentar executar computações pesadas dentro de fulfillRandomWords, estourando o callbackGasLimit e fazendo a transação do oráculo falhar.',
    didacticQuestion: 'Por que a função fulfillRandomWords deve apenas salvar o número aleatório e atualizar o estado em vez de disparar dezenas de transferências de tokens caras?',
    codePreview: `function fulfillRandomWords(uint256 requestId, uint256[] calldata randomWords) internal override {
    uint256 indexOfWinner = randomWords[0] % s_players.length;
    s_recentWinner = s_players[indexOfWinner];
    s_lotteryState = LotteryState.OPEN;
    s_players = new address payable[](0);
    emit WinnerPicked(s_recentWinner);
}`,
    simulationId: 'codelab-section',
    simulationLabel: 'Laboratório de Código: VRF e Automação'
  }
];

export const CONCEPTS_BY_ID = new Map(CONCEPTS.map(c => [c.id, c]));

export const LEVELS = [
  { level: 0, title: 'Nível 0: EVM & Determinismo', nodes: ['NODE_01'] },
  { level: 1, title: 'Nível 1: O Problema do Oráculo', nodes: ['NODE_02'] },
  { level: 2, title: 'Nível 2: Arquiteturas & DONs', nodes: ['NODE_03', 'NODE_04'] },
  { level: 3, title: 'Nível 3: Primitivas Especializadas', nodes: ['NODE_05', 'NODE_06', 'NODE_07'] },
  { level: 4, title: 'Nível 4: Hands-on Solidity', nodes: ['NODE_08', 'NODE_09'] }
];
