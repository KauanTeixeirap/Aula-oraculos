/**
 * Test Harness & Opaque-Box E2E Testing Framework
 * Blockchain Oracles Educational Platform (estudo_oraculos)
 * 
 * Supports both standalone browser execution (runner.html)
 * and headless CLI execution (Node.js).
 */

(function (root, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else {
    root.TestHarness = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {

  // --- Environment Polyfills for Headless Node.js Execution ---
  if (typeof window === 'undefined') {
    const memoryStore = {};
    const mockStorage = {
      getItem: (key) => (Object.prototype.hasOwnProperty.call(memoryStore, key) ? memoryStore[key] : null),
      setItem: (key, val) => { memoryStore[key] = String(val); },
      removeItem: (key) => { delete memoryStore[key]; },
      clear: () => { for (const k in memoryStore) delete memoryStore[k]; },
      get length() { return Object.keys(memoryStore).length; },
      key: (i) => Object.keys(memoryStore)[i] || null
    };

    class MockEventTarget {
      constructor() {
        this._listeners = {};
      }
      addEventListener(type, callback) {
        if (!this._listeners[type]) this._listeners[type] = [];
        this._listeners[type].push(callback);
      }
      removeEventListener(type, callback) {
        if (!this._listeners[type]) return;
        this._listeners[type] = this._listeners[type].filter(cb => cb !== callback);
      }
      dispatchEvent(event) {
        const listeners = this._listeners[event.type] || [];
        for (const cb of listeners) {
          try { cb.call(this, event); } catch (e) { console.error(e); }
        }
        return true;
      }
    }

    class MockElement extends MockEventTarget {
      constructor(tagName) {
        super();
        this.tagName = tagName.toUpperCase();
        this.id = '';
        this.className = '';
        this.classList = {
          _classes: new Set(),
          add: (...cls) => cls.forEach(c => this.classList._classes.add(c)),
          remove: (...cls) => cls.forEach(c => this.classList._classes.delete(c)),
          contains: (c) => this.classList._classes.has(c),
          toggle: (c) => (this.classList.contains(c) ? (this.classList.remove(c), false) : (this.classList.add(c), true))
        };
        this.children = [];
        this.parentElement = null;
        this.innerHTML = '';
        this.textContent = '';
        this.style = {};
        this.attributes = {};
        this.dataset = {};
      }
      setAttribute(k, v) { this.attributes[k] = String(v); }
      getAttribute(k) { return this.attributes[k] || null; }
      removeAttribute(k) { delete this.attributes[k]; }
      hasAttribute(k) { return Object.prototype.hasOwnProperty.call(this.attributes, k); }
      appendChild(child) {
        child.parentElement = this;
        this.children.push(child);
        return child;
      }
      removeChild(child) {
        const idx = this.children.indexOf(child);
        if (idx !== -1) {
          this.children.splice(idx, 1);
          child.parentElement = null;
        }
        return child;
      }
      querySelector(selector) {
        // Simple mock selector lookup
        if (selector.startsWith('#')) {
          const id = selector.slice(1);
          if (this.id === id) return this;
          for (const c of this.children) {
            const found = c.querySelector ? c.querySelector(selector) : null;
            if (found) return found;
          }
          if (this.innerHTML && (this.innerHTML.includes(`id="${id}"`) || this.innerHTML.includes(`id='${id}'`))) {
            const el = new MockElement('div');
            el.id = id;
            this.appendChild(el);
            return el;
          }
        }
        if (selector.startsWith('.')) {
          const cls = selector.slice(1);
          if (this.classList.contains(cls)) return this;
          for (const c of this.children) {
            const found = c.querySelector ? c.querySelector(selector) : null;
            if (found) return found;
          }
          if (this.innerHTML && (this.innerHTML.includes(`class="${cls}`) || this.innerHTML.includes(`class='${cls}`) || this.innerHTML.includes(` ${cls}`))) {
            const el = new MockElement('button');
            el.classList.add(cls);
            this.appendChild(el);
            return el;
          }
        }
        return null;
      }
      querySelectorAll(selector) {
        const results = [];
        const match = (el) => {
          if (selector.startsWith('#') && el.id === selector.slice(1)) results.push(el);
          else if (selector.startsWith('.') && el.classList.contains(selector.slice(1))) results.push(el);
          else if (el.tagName.toLowerCase() === selector.toLowerCase()) results.push(el);
          for (const child of el.children) match(child);
        };
        match(this);
        return results;
      }
      click() {
        this.dispatchEvent(new CustomEvent('click', { bubbles: true }));
      }
      focus() {
        this.focused = true;
      }
      blur() {
        this.focused = false;
      }
    }

    class MockHTMLDialogElement extends MockElement {
      constructor() {
        super('dialog');
        this.open = false;
      }
      showModal() { this.open = true; }
      close() { this.open = false; }
    }

    const mockDocument = {
      createElement: (tag) => {
        if (tag.toLowerCase() === 'dialog') return new MockHTMLDialogElement();
        return new MockElement(tag);
      },
      getElementById: (id) => {
        const root = mockDocument.body;
        return root.querySelector(`#${id}`);
      },
      querySelector: (sel) => mockDocument.body.querySelector(sel),
      querySelectorAll: (sel) => mockDocument.body.querySelectorAll(sel),
      body: new MockElement('body'),
      addEventListener: () => {},
      removeEventListener: () => {}
    };

    globalThis.HTMLDialogElement = MockHTMLDialogElement;
    globalThis.window = globalThis;
    globalThis.window.HTMLDialogElement = MockHTMLDialogElement;
    globalThis.document = mockDocument;
    globalThis.window.document = mockDocument;
    globalThis.localStorage = mockStorage;
    globalThis.window.localStorage = mockStorage;
    globalThis.CustomEvent = class CustomEvent {
      constructor(type, params = {}) {
        this.type = type;
        this.detail = params.detail || null;
        this.bubbles = !!params.bubbles;
        this.cancelable = !!params.cancelable;
      }
    };
  }

  // --- Authoritative Verification Oracles (Specification Reference) ---
  const AuthoritativeOracles = {
    // 9 Core DAG Nodes Taxonomy Specification
    REFERENCE_NODES: [
      {
        id: 'NODE_01',
        alias: 'evm-determinism',
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
// }`,
        simulationId: 'sim-consensus',
        simulationLabel: 'Simulação 1: Quebra de Consenso HTTP'
      },
      {
        id: 'NODE_02',
        alias: 'oracle-problem',
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
}`,
        simulationId: 'sim-consensus',
        simulationLabel: 'Simulação 1: Quebra de Consenso HTTP'
      },
      {
        id: 'NODE_03',
        alias: 'push-vs-pull',
        level: 2,
        levelName: 'Nível 2: Arquiteturas & Redes Descentralizadas',
        title: 'Arquitetura Push vs. Pull',
        subtitle: 'Atualizações contínuas de storage vs. feeds sob demanda criptograficamente assinados',
        difficulty: 'Intermediário',
        prerequisites: ['NODE_02'],
        tags: ['Push Model', 'Pull Model', 'Pyth Network', 'Chainlink Data Feeds', 'Gas Optimization'],
        mathFormula: '\\text{Gas}_{Push} = \\sum_{i=1}^M G_{storage\\_write} \\quad \\text{vs} \\quad \\text{Gas}_{Pull} = N_{tx} \\times G_{verify\\_sig}',
        mathDescription: 'Modelo Push incorre em custo de gas contínuo por heartbeat/desvio (M); Modelo Pull só consome gas na liquidação/transação do usuário (Ntx).',
        coreConcept: 'No Modelo Push (Chainlink tradicional), nós do oráculo monitoram desvios de mercado (ex: 0.5%) ou intervalos fixos (heartbeat de 1h) e gravam os novos preços no storage da blockchain proativamente. No Modelo Pull (Pyth Network, Chainlink Data Streams), os preços são transmitidos e assinados off-chain com latência sub-segundo; o próprio usuário inclui a assinatura recente no calldata da sua transação para validação atômica on-chain.',
        technicalImpact: 'DEXs de futuros perpétuos e derivativos exigem o modelo Pull para evitar arbitragem tóxica (front-running de oráculos) e latências inferiores a 400ms. Já protocolos de empréstimo (Lending) em Ethereum L1 costumam preferir Push pela simplicidade de leitura compartilhada.',
        pitfall: 'Achar que o modelo Push é universalmente superior por ser "mais simples de chamar" sem calcular a insustentabilidade de gas gerada por feeds de baixa frequência em redes L1 caras.',
        didacticQuestion: 'Quem deve pagar o custo de gas da atualização do oráculo: a rede do protocolo periodicamente ou o usuário final ao executar uma transação de swap ou empréstimo?',
        codePreview: `(, int256 price, , , ) = priceFeed.latestRoundData();`,
        simulationId: 'sim-push-pull',
        simulationLabel: 'Simulação 2: Fluxo Push vs. Pull'
      },
      {
        id: 'NODE_04',
        alias: 'don-networks',
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
        codePreview: `// OCR2Abstract.sol`,
        simulationId: 'sim-don',
        simulationLabel: 'Simulação 3: Agregação DON & Outliers'
      },
      {
        id: 'NODE_05',
        alias: 'data-feeds',
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
        codePreview: `(uint80 roundId, int256 price, , uint256 updatedAt, uint80 answeredInRound) = priceFeed.latestRoundData();`,
        simulationId: 'sim-push-pull',
        simulationLabel: 'Simulação 2: Fluxo Push vs. Pull'
      },
      {
        id: 'NODE_06',
        alias: 'vrf-randomness',
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
        codePreview: `function requestRandomWords() external returns (uint256 requestId);`,
        simulationId: 'sim-sandbox',
        simulationLabel: 'Simulação Sandbox: Flash Loans e Manipulação'
      },
      {
        id: 'NODE_07',
        alias: 'keepers-automation',
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
        codePreview: `function checkUpkeep(bytes calldata) external view returns (bool, bytes memory);`,
        simulationId: 'sim-sandbox',
        simulationLabel: 'Simulação Sandbox: Flash Loans e Manipulação'
      },
      {
        id: 'NODE_08',
        alias: 'hands-on-price',
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
        codePreview: `contract PriceConsumerV3 {}`,
        simulationId: 'codelab-section',
        simulationLabel: 'Laboratório de Código: PriceConsumerV3'
      },
      {
        id: 'NODE_09',
        alias: 'hands-on-vrf',
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
        codePreview: `contract VRFv25Lottery {}`,
        simulationId: 'codelab-section',
        simulationLabel: 'Laboratório de Código: VRF e Automação'
      }
    ],

    createReferenceStore: function (concepts = this.REFERENCE_NODES) {
      const state = {
        unlockedNodes: ['NODE_01'],
        completedNodes: [],
        teacherMode: false,
        selectedNodeId: null,
        filterLevel: 'all',
        filterDifficulty: 'all',
        searchQuery: ''
      };
      const listeners = new Set();
      const recalculate = () => {
        if (state.teacherMode) {
          state.unlockedNodes = concepts.map(c => c.id);
          return;
        }
        const set = new Set(['NODE_01']);
        state.completedNodes.forEach(id => set.add(id));
        let changed = true;
        while (changed) {
          changed = false;
          for (const c of concepts) {
            if (!set.has(c.id)) {
              const reqs = c.prerequisites || [];
              if (reqs.every(r => state.completedNodes.includes(r))) {
                set.add(c.id);
                changed = true;
              }
            }
          }
        }
        state.unlockedNodes = Array.from(set);
      };
      return {
        getState: () => Object.freeze({ ...state, unlockedNodes: [...state.unlockedNodes], completedNodes: [...state.completedNodes] }),
        dispatch: (action, payload = {}) => {
          if (action === 'COMPLETE_NODE') {
            if (!state.completedNodes.includes(payload.nodeId)) state.completedNodes.push(payload.nodeId);
            recalculate();
          } else if (action === 'UNCOMPLETE_NODE') {
            state.completedNodes = state.completedNodes.filter(id => id !== payload.nodeId);
            recalculate();
          } else if (action === 'SET_TEACHER_MODE') {
            state.teacherMode = Boolean(payload.enabled);
            recalculate();
          } else if (action === 'SELECT_NODE') {
            state.selectedNodeId = payload.nodeId ?? null;
          } else if (action === 'SET_FILTER') {
            if (payload.key === 'level') state.filterLevel = payload.value;
            else if (payload.key === 'difficulty') state.filterDifficulty = payload.value;
            else if (payload.key === 'search') state.searchQuery = payload.value ?? '';
          } else if (action === 'RESET_PROGRESS') {
            state.completedNodes = [];
            state.unlockedNodes = ['NODE_01'];
            recalculate();
          }
          listeners.forEach(cb => cb(state));
        },
        subscribe: (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
        registerConcepts: () => recalculate()
      };
    },

    // Reference Prerequisite Checker
    checkPrerequisites: function (nodeId, completedSet, nodes = this.REFERENCE_NODES) {
      const node = nodes.find(n => n.id === nodeId || n.alias === nodeId);
      if (!node) return { isUnlocked: false, missingPrereqs: [] };
      if (!node.prerequisites || node.prerequisites.length === 0) {
        return { isUnlocked: true, missingPrereqs: [] };
      }
      const missing = node.prerequisites.filter(reqId => {
        const reqNode = nodes.find(n => n.id === reqId || n.alias === reqId);
        const resolvedId = reqNode ? reqNode.id : reqId;
        const resolvedAlias = reqNode ? reqNode.alias : reqId;
        return !completedSet.has(resolvedId) && !completedSet.has(resolvedAlias);
      });
      return { isUnlocked: missing.length === 0, missingPrereqs: missing };
    },

    // Reference Median Calculator
    calculateMedian: function (values) {
      if (!values || values.length === 0) return 0;
      const sorted = [...values].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      if (sorted.length % 2 === 0) {
        return (sorted[mid - 1] + sorted[mid]) / 2;
      }
      return sorted[mid];
    },

    // Reference IQR Outlier Filter
    filterIQR: function (values, multiplier = 1.5) {
      if (!values || values.length < 4) return { valid: [...values], outliers: [] };
      const sorted = [...values].sort((a, b) => a - b);
      const n = sorted.length;
      const q1Index = Math.floor(n * 0.25);
      const q3Index = Math.floor(n * 0.75);
      const q1 = sorted[q1Index];
      const q3 = sorted[q3Index];
      const iqr = q3 - q1;
      const lowerBound = q1 - multiplier * iqr;
      const upperBound = q3 + multiplier * iqr;

      const valid = [];
      const outliers = [];
      for (const val of values) {
        if (val < lowerBound || val > upperBound) {
          outliers.push(val);
        } else {
          valid.push(val);
        }
      }
      return { valid, outliers, q1, q3, iqr, lowerBound, upperBound };
    },

    // Reference Constant Product AMM Math: x * y = k
    calculateUniswapSpot: function (reserveX, reserveY) {
      if (reserveX <= 0 || reserveY <= 0) return 0;
      return reserveY / reserveX;
    },

    calculateSwapOutput: function (reserveIn, reserveOut, amountIn, feeBps = 30) {
      // 0.3% fee = 997 / 1000
      const amountInWithFee = amountIn * (10000 - feeBps);
      const numerator = amountInWithFee * reserveOut;
      const denominator = (reserveIn * 10000) + amountInWithFee;
      return numerator / denominator;
    },

    // Reference Simple State Root Hash Simulation
    computeStateRoot: function (valString) {
      // Simple deterministic 32-byte hex hash simulation
      let hash = 0x811c9dc5;
      const str = String(valString);
      for (let i = 0; i < str.length; i++) {
        hash ^= str.charCodeAt(i);
        hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
      }
      const hex = (hash >>> 0).toString(16).padStart(8, '0');
      return '0x' + hex.repeat(8).slice(0, 64);
    },

    // Reference Chainlink AggregatorV3 Production Checks
    validatePriceFeedData: function ({ roundId, price, updatedAt, answeredInRound, maxStaleness = 3600, currentTimestamp = Math.floor(Date.now() / 1000) }) {
      if (price <= 0) return { valid: false, error: "Preco corrompido: deve ser estritamente positivo" };
      if (!updatedAt || updatedAt === 0) return { valid: false, error: "Rodada incompleta: timestamp zerado" };
      if (answeredInRound < roundId) return { valid: false, error: "Dado obsoleto: resposta pertence a rodada anterior" };
      if ((currentTimestamp - updatedAt) > maxStaleness) return { valid: false, error: "Dado expirado: excedeu o heartbeat maximo" };
      return { valid: true, error: null };
    }
  };

  // --- Assertion Engine ---
  class Expectation {
    constructor(actual, isNot = false) {
      this.actual = actual;
      this.isNot = isNot;
    }

    get not() {
      return new Expectation(this.actual, !this.isNot);
    }

    _assert(condition, messageGenerator) {
      const passed = this.isNot ? !condition : condition;
      if (!passed) {
        throw new Error(messageGenerator());
      }
    }

    toBe(expected) {
      this._assert(
        this.actual === expected,
        () => `Expected ${JSON.stringify(this.actual)} ${this.isNot ? 'not to be' : 'to be'} ${JSON.stringify(expected)}`
      );
    }

    toEqual(expected) {
      const actualStr = JSON.stringify(this.actual);
      const expectedStr = JSON.stringify(expected);
      this._assert(
        actualStr === expectedStr,
        () => `Expected ${actualStr} ${this.isNot ? 'not to equal' : 'to equal'} ${expectedStr}`
      );
    }

    toBeDefined() {
      this._assert(
        typeof this.actual !== 'undefined',
        () => `Expected value ${this.isNot ? 'to be undefined' : 'to be defined'}`
      );
    }

    toBeNull() {
      this._assert(
        this.actual === null,
        () => `Expected ${JSON.stringify(this.actual)} ${this.isNot ? 'not to be null' : 'to be null'}`
      );
    }

    toBeTruthy() {
      this._assert(
        Boolean(this.actual),
        () => `Expected ${JSON.stringify(this.actual)} ${this.isNot ? 'to be falsy' : 'to be truthy'}`
      );
    }

    toBeFalsy() {
      this._assert(
        !Boolean(this.actual),
        () => `Expected ${JSON.stringify(this.actual)} ${this.isNot ? 'to be truthy' : 'to be falsy'}`
      );
    }

    toBeGreaterThan(expected) {
      this._assert(
        this.actual > expected,
        () => `Expected ${this.actual} ${this.isNot ? 'not to be greater than' : 'to be greater than'} ${expected}`
      );
    }

    toBeGreaterThanOrEqual(expected) {
      this._assert(
        this.actual >= expected,
        () => `Expected ${this.actual} ${this.isNot ? 'not to be >= ' : 'to be >= '} ${expected}`
      );
    }

    toBeLessThan(expected) {
      this._assert(
        this.actual < expected,
        () => `Expected ${this.actual} ${this.isNot ? 'not to be less than' : 'to be less than'} ${expected}`
      );
    }

    toBeLessThanOrEqual(expected) {
      this._assert(
        this.actual <= expected,
        () => `Expected ${this.actual} ${this.isNot ? 'not to be <= ' : 'to be <= '} ${expected}`
      );
    }

    toBeCloseTo(expected, delta = 0.001) {
      const diff = Math.abs(this.actual - expected);
      this._assert(
        diff <= delta,
        () => `Expected ${this.actual} to be close to ${expected} (diff: ${diff}, max allowed: ${delta})`
      );
    }

    toContain(item) {
      let contains = false;
      if (typeof this.actual === 'string') {
        contains = this.actual.includes(item);
      } else if (Array.isArray(this.actual)) {
        contains = this.actual.includes(item);
      } else if (this.actual && typeof this.actual === 'object') {
        if (this.actual instanceof Set) {
          contains = this.actual.has(item);
        } else {
          contains = Object.prototype.hasOwnProperty.call(this.actual, item);
        }
      }
      this._assert(
        contains,
        () => `Expected ${JSON.stringify(this.actual)} ${this.isNot ? 'not to contain' : 'to contain'} ${JSON.stringify(item)}`
      );
    }

    toMatch(pattern) {
      const regex = typeof pattern === 'string' ? new RegExp(pattern) : pattern;
      this._assert(
        regex.test(String(this.actual)),
        () => `Expected ${JSON.stringify(this.actual)} ${this.isNot ? 'not to match' : 'to match'} ${pattern}`
      );
    }

    toThrow(optMsg) {
      if (typeof this.actual !== 'function') {
        throw new Error('Expected function to be passed to expect(...) for toThrow assertion');
      }
      let threw = false;
      let thrownError = null;
      try {
        this.actual();
      } catch (err) {
        threw = true;
        thrownError = err;
      }
      this._assert(
        threw,
        () => `Expected function ${this.isNot ? 'not to throw' : 'to throw'}, but it ${threw ? 'threw ' + thrownError : 'did not throw'}`
      );
      if (threw && optMsg && !this.isNot) {
        const errorMsg = thrownError ? thrownError.message : String(thrownError);
        const matches = typeof optMsg === 'string' ? errorMsg.includes(optMsg) : optMsg.test(errorMsg);
        if (!matches) {
          throw new Error(`Expected thrown error message "${errorMsg}" to match "${optMsg}"`);
        }
      }
    }

    toHaveLength(expectedLen) {
      const len = this.actual ? this.actual.length : undefined;
      this._assert(
        len === expectedLen,
        () => `Expected length ${len} ${this.isNot ? 'not to be' : 'to be'} ${expectedLen}`
      );
    }

    toHaveProperty(prop, optVal) {
      const hasProp = this.actual && Object.prototype.hasOwnProperty.call(this.actual, prop);
      if (optVal !== undefined) {
        this._assert(
          hasProp && this.actual[prop] === optVal,
          () => `Expected property ${prop} with value ${optVal}`
        );
      } else {
        this._assert(
          hasProp,
          () => `Expected property ${prop} to exist`
        );
      }
    }
  }

  // --- Suite and Test Registry ---
  class TestRegistry {
    constructor() {
      this.suites = [];
      this.currentSuite = null;
      this.beforeEachHooks = [];
      this.afterEachHooks = [];
      this.results = [];
    }

    describe(title, fn, options = {}) {
      const suite = {
        title,
        options,
        tier: options.tier || 1,
        feature: options.feature || 'GLOBAL',
        tests: [],
        beforeEachHooks: [],
        afterEachHooks: []
      };
      const parentSuite = this.currentSuite;
      this.currentSuite = suite;
      this.suites.push(suite);

      try {
        fn();
      } finally {
        this.currentSuite = parentSuite;
      }
    }

    it(title, fn, options = {}) {
      if (!this.currentSuite) {
        this.describe('Root Suite', () => {
          this.it(title, fn, options);
        });
        return;
      }
      const test = {
        title,
        fn,
        options,
        tier: options.tier || this.currentSuite.tier || 1,
        feature: options.feature || this.currentSuite.feature || 'GLOBAL',
        suiteTitle: this.currentSuite.title
      };
      this.currentSuite.tests.push(test);
    }

    beforeEach(fn) {
      if (this.currentSuite) {
        this.currentSuite.beforeEachHooks.push(fn);
      } else {
        this.beforeEachHooks.push(fn);
      }
    }

    afterEach(fn) {
      if (this.currentSuite) {
        this.currentSuite.afterEachHooks.push(fn);
      } else {
        this.afterEachHooks.push(fn);
      }
    }

    async run(onProgress) {
      const startTime = Date.now();
      this.results = [];

      let totalTests = 0;
      for (const suite of this.suites) {
        totalTests += suite.tests.length;
      }

      let executed = 0;
      let passed = 0;
      let failed = 0;

      for (const suite of this.suites) {
        for (const test of suite.tests) {
          const testStart = Date.now();
          const result = {
            suiteTitle: suite.title,
            title: test.title,
            tier: test.tier,
            feature: test.feature,
            status: 'PASSED',
            error: null,
            duration: 0
          };

          try {
            // Global beforeEach
            for (const hook of this.beforeEachHooks) await hook();
            // Suite beforeEach
            for (const hook of suite.beforeEachHooks) await hook();

            // Run test
            const res = test.fn();
            if (res && typeof res.then === 'function') {
              await res;
            }

            // Suite afterEach
            for (const hook of suite.afterEachHooks) await hook();
            // Global afterEach
            for (const hook of this.afterEachHooks) await hook();

            passed++;
          } catch (err) {
            result.status = 'FAILED';
            result.error = err ? (err.stack || err.message || String(err)) : 'Unknown error';
            failed++;
          }

          result.duration = Date.now() - testStart;
          this.results.push(result);
          executed++;

          if (typeof onProgress === 'function') {
            onProgress({
              executed,
              total: totalTests,
              passed,
              failed,
              currentResult: result
            });
          }
        }
      }

      const totalDuration = Date.now() - startTime;

      // Group statistics
      const tierStats = { 1: { total: 0, passed: 0, failed: 0 }, 2: { total: 0, passed: 0, failed: 0 }, 3: { total: 0, passed: 0, failed: 0 }, 4: { total: 0, passed: 0, failed: 0 } };
      const featureStats = {};

      for (const r of this.results) {
        if (!tierStats[r.tier]) tierStats[r.tier] = { total: 0, passed: 0, failed: 0 };
        tierStats[r.tier].total++;
        if (r.status === 'PASSED') tierStats[r.tier].passed++;
        else tierStats[r.tier].failed++;

        if (!featureStats[r.feature]) featureStats[r.feature] = { total: 0, passed: 0, failed: 0 };
        featureStats[r.feature].total++;
        if (r.status === 'PASSED') featureStats[r.feature].passed++;
        else featureStats[r.feature].failed++;
      }

      return {
        total: totalTests,
        passed,
        failed,
        duration: totalDuration,
        results: this.results,
        tierStats,
        featureStats
      };
    }
  }

  const registry = new TestRegistry();

  return {
    expect: (actual) => new Expectation(actual),
    describe: (title, fn, options) => registry.describe(title, fn, options),
    it: (title, fn, options) => registry.it(title, fn, options),
    beforeEach: (fn) => registry.beforeEach(fn),
    afterEach: (fn) => registry.afterEach(fn),
    run: (onProgress) => registry.run(onProgress),
    getRegistry: () => registry,
    oracles: AuthoritativeOracles
  };
});
