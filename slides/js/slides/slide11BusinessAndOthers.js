window.OracleDeck = window.OracleDeck || {};
window.OracleDeck.SLIDES = window.OracleDeck.SLIDES || [];

window.OracleDeck.SLIDES.push(function renderSlide11BusinessAndOthers() {
  const cl = window.OracleDeck.METRICS.chainlink;

  return `
    <section class="slide-view flex-col justify-between h-full" data-slide="10" data-steps="1">
      <div>
        <span class="font-mono-code text-xs text-cyan-400 uppercase tracking-widest">09 • Modelo de Negócios e Concorrentes</span>
        <h2 class="text-3xl md:text-4xl font-bold text-white mt-1">Como a Chainlink ganha dinheiro? E os outros Oráculos?</h2>
        <p class="text-slate-400 text-sm md:text-base mt-1">
          Entendendo a sustentabilidade do ecossistema e como outras empresas abordam o problema de forma diferente.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-auto items-stretch">
        <!-- Card 1: How Chainlink Makes Money -->
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-4">
              <span class="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 font-mono-code text-xs font-bold">MODELO DE RECEITA</span>
              <i class="fa-solid fa-sack-dollar text-emerald-400 text-xl"></i>
            </div>
            <h3 class="text-xl font-bold text-white mb-3">A consulta ao Oráculo de Preço é "de graça"?</h3>
            <p class="text-xs md:text-sm text-slate-300 leading-relaxed mb-4">
              Para os desenvolvedores e usuários que leem os feeds principais (como ETH/USD), <strong>a leitura no contrato é aberta e gratuita</strong> (bem público subsidiado pelas redes).
            </p>
            <div class="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2.5 text-xs text-slate-300">
              <strong class="text-emerald-400 block text-sm">De onde vem o faturamento da Chainlink?</strong>
              <p class="leading-relaxed">
                Ela monetiza principalmente prestando <strong>serviços pagos de infraestrutura</strong> na mesma rede de nós: <strong>CCIP</strong> (pontes cross-chain, com ${cl.ccipVolume} transferidos), <strong>VRF</strong> (aleatoriedade verificável), <strong>Automation</strong>, <strong>Proof of Reserve</strong> e <strong>Data Streams</strong> (feeds em sub-segundos sob demanda).
              </p>
            </div>
          </div>
          <div class="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400 font-mono-code">
            Feeds de preço atraem o ecossistema DeFi; serviços especializados geram receita contínua.
          </div>
        </div>

        <!-- Card 2: Other Oracles (Pyth Network example) -->
        <div class="bg-slate-900 border border-purple-500/30 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-4">
              <span class="px-3 py-1 rounded-full bg-purple-500/15 text-purple-300 font-mono-code text-xs font-bold">OUTRAS ARQUITETURAS • EX: PYTH NETWORK</span>
              <i class="fa-solid fa-bolt text-purple-400 text-xl"></i>
            </div>
            <h3 class="text-xl font-bold text-white mb-3">Todo oráculo usa 3 camadas igual à Chainlink?</h3>
            <p class="text-xs md:text-sm text-slate-300 leading-relaxed mb-4">
              Não! Concorrentes importantes como a <strong>Pyth Network</strong> trabalham com uma mecânica diferente focada em corretoras de alta frequência:
            </p>
            <ul class="space-y-2.5 text-xs text-slate-300">
              <li class="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-start gap-2.5">
                <i class="fa-solid fa-building-columns text-purple-400 mt-0.5"></i>
                <span><strong>Direto da Fonte (Sem Agregador Nível 2):</strong> As próprias corretoras e formadores de mercado (Binance, OKX, Jane Street) rodam os nós e assinam seus preços diretamente.</span>
              </li>
              <li class="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-start gap-2.5">
                <i class="fa-solid fa-hand-point-down text-cyan-400 mt-0.5"></i>
                <span><strong>Atualização sob Demanda (Pull):</strong> Atualiza a cada 400ms fora da rede e só grava na blockchain no segundo exato em que alguém faz uma operação (poupando Gas).</span>
              </li>
            </ul>
          </div>
          <div class="mt-4 pt-3 border-t border-slate-800 text-xs text-purple-300 font-mono-code">
            Chainlink = Máxima robustez (Push + Streams) • Pyth = Alta velocidade direto da fonte (Pull).
          </div>
        </div>
      </div>
    </section>
  `;
});
