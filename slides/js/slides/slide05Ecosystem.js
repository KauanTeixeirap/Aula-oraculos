window.OracleDeck = window.OracleDeck || {};
window.OracleDeck.SLIDES = window.OracleDeck.SLIDES || [];

window.OracleDeck.SLIDES.push(function renderSlide05Ecosystem() {
  const m = window.OracleDeck.METRICS;
  const cl = m.chainlink;

  return `
    <section class="slide-view flex-col justify-between h-full" data-slide="4" data-steps="1">
      <div>
        <span class="font-mono-code text-xs text-cyan-400 uppercase tracking-widest">03 • Panorama do Ecossistema (${m.asOf})</span>
        <h2 class="text-3xl md:text-4xl font-bold text-white mt-1">Quem resolve esse problema no mercado?</h2>
        <p class="text-slate-400 text-sm md:text-base mt-1">
          Existem diversas redes de oráculos no mercado, mas vamos aprofundar na arquitetura da <strong class="text-white">Chainlink</strong>, a líder global do setor.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-5 my-auto items-stretch">
        <!-- Main Highlight: Chainlink with Updated Nov 2026 Metrics -->
        <div class="md:col-span-7 bg-gradient-to-br from-blue-950/90 via-slate-900 to-slate-900 border-2 border-blue-500/60 rounded-2xl p-5 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div>
            <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
              <span class="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-cyan-300 font-mono-code text-xs font-semibold">
                NOSSO ESTUDO DE CASO NA AULA
              </span>
              <span class="font-mono-code text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                ${cl.defiMarketShare} do Mercado DeFi • ${m.asOf}
              </span>
            </div>

            <div class="flex items-center gap-4 mb-3">
              <div class="w-12 h-12 rounded-2xl bg-[#2a5ada] flex items-center justify-center shadow-lg shrink-0">
                <svg class="w-7 h-7 text-white" viewBox="0 0 38 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19 0L0 11V33L19 44L38 33V11L19 0ZM30 28.37L19 34.74L8 28.37V15.63L19 9.26L30 15.63V28.37Z" fill="currentColor"/>
                </svg>
              </div>
              <div>
                <h3 class="text-2xl font-bold text-white">Chainlink</h3>
                <p class="text-xs md:text-sm text-cyan-300">Padrão ouro para feeds de preços (Par ETH/USD com +20 fontes)</p>
              </div>
            </div>

            <!-- Eye-catching 2026 Scale Metrics Grid -->
            <div class="grid grid-cols-2 gap-2.5 mb-3">
              <div class="bg-slate-950/85 border border-cyan-500/35 rounded-xl p-3">
                <span class="font-mono-code text-[10px] uppercase text-cyan-300 block">Valor Viabilizado (TVE)</span>
                <span class="text-xl md:text-2xl font-bold text-white font-display block mt-0.5">${cl.tve}</span>
                <span class="text-[11px] text-slate-400">Acumulado on-chain &amp; institucional</span>
              </div>

              <div class="bg-gradient-to-br from-emerald-950/70 to-slate-950 border border-emerald-400/50 rounded-xl p-3">
                <span class="font-mono-code text-[10px] uppercase text-emerald-300 flex items-center gap-1.5">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Ritmo Médio Atrelado*
                </span>
                <span class="text-xl md:text-2xl font-bold text-emerald-300 font-display block mt-0.5">${cl.throughput.perDay}</span>
                <span class="text-[11px] text-emerald-200/90 font-mono-code">${cl.throughput.perMinute} • ${cl.throughput.perHour}</span>
              </div>

              <div class="bg-slate-950/75 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between">
                <div>
                  <span class="font-mono-code text-[10px] uppercase text-slate-400 block">Valor Protegido (TVS)</span>
                  <span class="text-base font-bold text-cyan-300 font-display">${cl.tvs}</span>
                </div>
                <span class="text-[10px] text-slate-400 text-right">${cl.tvsDefiLlama}</span>
              </div>

              <div class="bg-slate-950/75 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between">
                <div>
                  <span class="font-mono-code text-[10px] uppercase text-slate-400 block">Mensagens Verificadas</span>
                  <span class="text-base font-bold text-white font-display">${cl.verifiedMessages}</span>
                </div>
                <span class="text-[10px] text-blue-300 font-mono-code text-right">CCIP: ${cl.ccipVolume}</span>
              </div>
            </div>

            <p class="text-xs text-slate-300 leading-relaxed">
              Protege protocolos líderes como <strong>Aave, Compound e GMX</strong> além de pilotos institucionais com <strong>Swift, J.P. Morgan (Kinexys) e UBS</strong>.
            </p>
          </div>

          <div class="mt-3 pt-2.5 border-t border-slate-800/90 flex flex-wrap items-center justify-between gap-2 text-[11px]">
            <div class="flex items-center gap-3 font-mono-code text-cyan-300">
              <span><strong>3</strong> Camadas</span>
              <span>•</span>
              <span><strong>${cl.ethUsdNodes}</strong> (ETH/USD)</span>
              <span>•</span>
              <span>Protocolo <strong>OCR</strong></span>
            </div>
            <span class="text-[10px] text-slate-500" title="${cl.throughput.methodology}">
              *Avanço oficial Mar/2025–Nov/2026 (Chainlink &amp; DefiLlama)
            </span>
          </div>
        </div>

        <!-- Other Oracles in the Market -->
        <div class="md:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between h-full">
          <div>
            <span class="font-mono-code text-xs text-amber-400 uppercase">Outras Soluções no Mercado</span>
            <h4 class="text-xl font-bold text-white mt-1 mb-2.5">A Chainlink é a única? Não!</h4>
            <p class="text-xs md:text-sm text-slate-300 leading-relaxed mb-4">
              Existem outras redes de oráculos com arquiteturas diferentes (que compararemos ao final da aula):
            </p>

            <div class="space-y-3">
              <div class="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                <div class="w-9 h-9 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs shrink-0">PYTH</div>
                <div>
                  <h5 class="text-xs font-bold text-white">Pyth Network</h5>
                  <p class="text-[11px] text-slate-400">Focada em altíssima velocidade (modelo Pull) com dados assinados direto pelas corretoras e market makers.</p>
                </div>
              </div>
              <div class="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                <div class="w-9 h-9 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs shrink-0">UMA</div>
                <div>
                  <h5 class="text-xs font-bold text-white">UMA &amp; RedStone</h5>
                  <p class="text-[11px] text-slate-400">Oráculos otimistas para eventos do mundo real (Polymarket) e feeds modulares de baixo custo de Gas.</p>
                </div>
              </div>
              <div class="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                <div class="w-9 h-9 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-xs shrink-0">CHR</div>
                <div>
                  <h5 class="text-xs font-bold text-white">Chronicle</h5>
                  <p class="text-[11px] text-slate-400">Infraestrutura nascida na MakerDAO/Sky para provas verificáveis de ativos reais (RWAs).</p>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-4 pt-3 border-t border-slate-800 text-xs text-cyan-300 flex items-center gap-2">
            <i class="fa-solid fa-arrow-right"></i>
            <span>Vamos abrir o capô da Chainlink passo a passo agora!</span>
          </div>
        </div>
      </div>
    </section>
  `;
});
