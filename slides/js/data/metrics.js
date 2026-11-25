window.OracleDeck = window.OracleDeck || {};

window.OracleDeck.METRICS = {
  asOf: 'Nov/2026',
  chainlink: {
    tve: 'US$ 37+ Trilhões',
    tveExact: 'US$ 37,04 Tri',
    tvs: '~US$ 46,6 Bilhões',
    tvsDefiLlama: 'US$ 31B–40B em DeFi',
    verifiedMessages: '+20,4 Bilhões',
    ccipVolume: '~US$ 27,8 Bilhões',
    defiMarketShare: '~68%',
    throughput: {
      perDay: '~US$ 28 Bilhões / dia',
      perHour: '~US$ 1,16 Bilhão / hora',
      perMinute: '~US$ 19 Milhões / min',
      perSecond: '~US$ 320 Mil / seg',
      methodology:
        'Média diária/minuto derivada do avanço oficial do TVE da Chainlink de US$ 20 Tri (Mar/2025) para US$ 37+ Tri (Nov/2026). Fontes: Chainlink Metrics & DefiLlama.'
    },
    ethUsdNodes: '21 a 31 Nós',
    quorumMin: 'Mín. 21',
    deviationThreshold: '0,5%',
    heartbeat: '60 min',
    l2Note: 'Em redes L2 (Arbitrum, Polygon), o desvio cai para 0,05%–0,1% pelo menor custo de Gas.',
    institutions: ['Aave', 'Compound', 'GMX', 'Swift', 'J.P. Morgan (Kinexys)', 'UBS']
  },
  market: {
    ethUsdBase: 1700,
    usdBrlBase: 5.91,
    ethBlockNumber: '#26.490.000'
  }
};
