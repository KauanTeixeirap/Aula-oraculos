window.OracleDeck = window.OracleDeck || {};

window.OracleDeck.TEACHER_NOTES = {
  '0-0': 'Comece perguntando à turma se alguém sabe o que é um Oráculo e para que ele serve. Instigue: por que um contrato inteligente na Ethereum não faz simplesmente uma requisição HTTP para descobrir o preço do dólar?',
  '1-0': 'Apresente o mapa completo da aula (9 etapas do planejamento). Mostre que vamos sair do isolamento da EVM até entender como aplicações blockchain consomem dados externos de forma confiável. Qualquer bloco do mapa é clicável para pular direto ao tópico.',
  '2-0': 'Defina o conceito básico: o Oráculo é a ponte que busca dados Off-Chain (fora da rede) e os coloca On-Chain (dentro da blockchain), já que contratos inteligentes são isolados e exigem que todos os computadores leiam o mesmo valor.',
  '3-0': 'Destaque os dois grandes motivos de não existir HTTP na blockchain: 1) Sandbox da EVM bloqueia conexões externas. 2) Mesmo que pudesse, 1 milissegundo de diferença gera valores distintos e quebra o consenso. O simulador começa vazio de propósito — clique em "Testar Consulta Simultânea" ao vivo para mostrar a divergência!',
  '4-0': 'Faça a transição para o estudo de caso: até aqui vimos o problema geral. Agora vamos abrir a Chainlink (~68% do mercado DeFi, +US$ 37 trilhões viabilizados historicamente — média de ~US$ 28 bilhões/dia ou ~US$ 19 milhões por minuto!). Cite que há concorrentes como Pyth, UMA e RedStone.',
  '5-0': 'Mostre a visão geral horizontal das 3 camadas da Chainlink no par ETH/USD: Nível 1 (Corretoras), Nível 2 (Agregadores) e Nível 3 (Rede de Nós DON). Ao avançar, os 3 níveis vão se empilhar fluidamente na vertical à esquerda para o zoom detalhado!',
  '5-1': 'Nível 1 em destaque no topo da pilha: explique que o dado nasce bruto nas corretoras (Binance, Coinbase, Kraken, Uniswap). Nunca podemos depender de uma corretora só por risco de queda de API ou manipulação localizada.',
  '5-2': 'Nível 2 (Barra 1 de 4 — Coleta): destaque o diagrama N-para-1! Várias corretoras descentralizadas e centralizadas enviam fluxos brutos para 1 agregador (CoinGecko, Kaiko, Amberdata), iniciando a limpeza dos dados.',
  '5-3': 'Nível 2 (Barra 2 de 4 — Filtro VWAP): mostre as barras de peso financeiro. Uma corretora com US$ 500M domina o cálculo (82%), impedindo que uma corretora minúscula com preço distorcido mova o ponteiro.',
  '5-4': 'Nível 2 (Barra 3 de 4 — Profundidade de Livro): em uma frase, avalia quantos dólares reais existem na fila de compra e venda. Livros rasos sofrem alta variabilidade com ordens pequenas e perdem peso.',
  '5-5': 'Nível 2 (Barra 4 de 4 — Wash Trading): robôs comprando e vendendo entre si na mesma corretora para simular volume falso são colocados em blacklist e têm peso zerado.',
  '5-6': 'Nível 3 (Barra 1 de 3 — Rede Off-Chain): explique que a DON é composta por 21 a 31 operadores independentes (Deutsche Telekom, Swisscom, Blockdaemon, Infura) rodando fora da Ethereum, com quórum mínimo de 21.',
  '5-7': 'Nível 3 (Barra 2 de 3 — Multi-Agregadores): note a simetria com o Nível 2! Agora cada nó operador da Chainlink consulta múltiplos agregadores diferentes ao mesmo tempo para não confiar em um único agregador.',
  '5-8': 'Nível 3 (Barra 3 de 3 — Medianas): primeiro cada nó tira sua mediana local entre os agregadores; depois veremos como o protocolo OCR consolida a mediana global dos 31 nós — ignorando outliers extremos nas pontas.',
  '6-0': 'Explique o Protocolo OCR: antigamente cada nó enviava uma transação separada e o Smart Contract calculava a mediana on-chain (gas explosivo). Hoje, no OCR, os nós conversam P2P de graça, elegem um Líder e enviam só 1 transação.',
  '7-0': 'Mostre o caminho final: os nós assinam suas medianas com chaves privadas; o Líder monta um array ordenado crescente e envia 1 transação para a Mempool. O Contrato Agregador valida assinaturas, ordem e grava a Mediana no bloco.',
  '8-0': 'Explique o duplo gatilho na Ethereum Mainnet: atualização por Limiar de Desvio (0,5% de variação no preço) ou por Heartbeat (60 minutos máximos de intervalo). Em L2s como Arbitrum, esse desvio chega a 0,05%.',
  '9-0': 'Lance a pergunta: "E se duas pessoas operarem no mesmo bloco (#26.490.000) em que o preço muda?". Mostre a fila sequencial à direita: quem vem antes (#09) lê $1.708; na #10 a Chainlink grava $1.690; na #11 entra o Bot de OEV pagando mais Gas para liquidar logo após!',
  '10-0': 'Fechamento de ecossistema: 1) Feeds principais de preço funcionam como bem público; a Chainlink monetiza via serviços de infraestrutura (CCIP com ~US$ 27,8B em volume, VRF, Automation, Data Streams). 2) Compare com a Pyth Network (Pull sob demanda direto das corretoras).',
  '11-0': 'Slide final de revisão dos 5 passos da aula e abertura para perguntas dos alunos!'
};
