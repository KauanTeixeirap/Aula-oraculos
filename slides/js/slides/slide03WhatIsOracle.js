window.OracleDeck = window.OracleDeck || {};
window.OracleDeck.SLIDES = window.OracleDeck.SLIDES || [];

window.OracleDeck.SLIDES.push(function renderSlide03WhatIsOracle() {
  return `
    <section class="slide-view flex-col justify-between h-full" data-slide="2" data-steps="1">
      <div>
        <span class="font-mono-code text-xs text-cyan-400 uppercase tracking-widest">01 • Definição Fundamental</span>
        <h2 class="text-3xl md:text-4xl font-bold text-white mt-1">O que é um Oráculo e qual a sua função?</h2>
        <p class="text-slate-400 text-sm md:text-base mt-1">
          É o middleware (ponte segura) que captura dados de fora da blockchain (<strong class="text-white">Off-Chain</strong>) e os injeta dentro da rede (<strong class="text-cyan-300">On-Chain</strong>).
        </p>
      </div>

      <!-- Animated Bridge Diagram -->
      <div class="grid grid-cols-1 md:grid-cols-11 gap-4 items-center my-auto">
        <!-- Off-Chain Side -->
        <div class="md:col-span-4 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 h-full flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-4">
              <span class="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 font-mono-code text-xs">MUNDO OFF-CHAIN</span>
              <i class="fa-solid fa-globe text-slate-400 text-xl"></i>
            </div>
            <h3 class="text-xl font-bold text-white mb-3">Internet & Mercado Real</h3>
            <ul class="space-y-3 text-sm text-slate-300">
              <li class="flex items-start gap-2.5">
                <i class="fa-solid fa-chart-line text-emerald-400 mt-1"></i>
                <span><strong>Cotações Dinâmicas:</strong> Preço do Dólar e do ETH mudam a cada milissegundo.</span>
              </li>
              <li class="flex items-start gap-2.5">
                <i class="fa-solid fa-building-columns text-cyan-400 mt-1"></i>
                <span><strong>Múltiplas Corretoras:</strong> Binance, Coinbase e Uniswap têm preços ligeiramente diferentes.</span>
              </li>
              <li class="flex items-start gap-2.5">
                <i class="fa-solid fa-cloud-bolt text-amber-400 mt-1"></i>
                <span><strong>APIs Web2:</strong> Podem cair, atrasar ou responder valores diferentes por latência.</span>
              </li>
            </ul>
          </div>
          <div class="mt-4 pt-3 border-t border-slate-800 text-xs text-slate-400 font-mono-code">
            Dado mutável e não-determinístico
          </div>
        </div>

        <!-- Animated Oracle Bridge in Center -->
        <div class="md:col-span-3 flex flex-col items-center justify-center px-2 py-4">
          <div class="w-full bg-blue-950/60 border border-blue-500/40 rounded-2xl p-4 text-center relative overflow-hidden glow-active">
            <i class="fa-solid fa-satellite-dish text-cyan-400 text-2xl mb-2"></i>
            <h4 class="font-bold text-white text-base">ORÁCULO</h4>
            <p class="text-xs text-blue-200 mt-1">Coleta, filtra, unifica e assina o dado</p>
            <!-- Centered Animated Flow Line -->
            <div class="packet-track w-full h-6 mt-3 bg-slate-900/90 rounded-full border border-slate-700">
              <div class="packet-dot w-3 h-3 rounded-full bg-cyan-400 shadow-md shadow-cyan-400"></div>
              <div class="packet-dot delay-1 w-3 h-3 rounded-full bg-blue-400 shadow-md shadow-blue-400"></div>
              <div class="packet-dot delay-2 w-3 h-3 rounded-full bg-emerald-400 shadow-md shadow-emerald-400"></div>
            </div>
            <span class="font-mono-code text-[11px] text-cyan-300 mt-2 block">Transação On-Chain ➔</span>
          </div>
        </div>

        <!-- On-Chain Side -->
        <div class="md:col-span-4 bg-slate-900/90 border border-blue-500/30 rounded-2xl p-6 h-full flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-4">
              <span class="px-2.5 py-1 rounded-md bg-blue-500/20 text-cyan-300 font-mono-code text-xs">MUNDO ON-CHAIN</span>
              <i class="fa-solid fa-link text-cyan-400 text-xl"></i>
            </div>
            <h3 class="text-xl font-bold text-white mb-3">Smart Contracts (Blockchain)</h3>
            <ul class="space-y-3 text-sm text-slate-300">
              <li class="flex items-start gap-2.5">
                <i class="fa-solid fa-box-archive text-cyan-400 mt-1"></i>
                <span><strong>Caixa-Preta Isolada:</strong> Só enxerga dados já gravados dentro dos próprios blocos.</span>
              </li>
              <li class="flex items-start gap-2.5">
                <i class="fa-solid fa-check-double text-emerald-400 mt-1"></i>
                <span><strong>Consenso Total:</strong> Todos os validadores precisam ler exatamente o mesmo número.</span>
              </li>
              <li class="flex items-start gap-2.5">
                <i class="fa-solid fa-code text-blue-400 mt-1"></i>
                <span><strong>Execução Automática:</strong> Libera empréstimos e liquidações baseados no preço do Oráculo.</span>
              </li>
            </ul>
          </div>
          <div class="mt-4 pt-3 border-t border-slate-800 text-xs text-cyan-400 font-mono-code">
            Estado imutável e 100% determinístico
          </div>
        </div>
      </div>
    </section>
  `;
});
