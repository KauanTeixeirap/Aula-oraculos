window.OracleDeck = window.OracleDeck || {};
window.OracleDeck.SLIDES = window.OracleDeck.SLIDES || [];

window.OracleDeck.SLIDES.push(function renderSlide06ChainlinkPipeline() {
  return `
    <section class="slide-view flex-col justify-between h-full" data-slide="5" data-steps="9">
      <!-- Top Header -->
      <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
        <div>
          <span class="font-mono-code text-xs text-cyan-400 uppercase tracking-widest">04 • Arquitetura Chainlink (ETH/USD)</span>
          <h2 class="text-2xl md:text-3xl font-bold text-white mt-0.5">O Pipeline de 3 Camadas de Dados</h2>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            id="btn-pipe-overview"
            onclick="OracleDeck.setSubStep(0)"
            hidden
            class="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 flex items-center gap-1.5 transition"
          >
            <i class="fa-solid fa-table-columns"></i>
            <span>Visão Geral</span>
          </button>
          <span id="pipe-mode-pill" class="font-mono-code text-xs bg-slate-900 border border-slate-700 text-cyan-300 px-3 py-1.5 rounded-lg">
            Visão Geral (1/9)
          </span>
        </div>
      </div>

      <!-- Unified Morphing Workspace: Overview (Horizontal) <-> DeepDive (Left Vertical Stack + Right Explanation) -->
      <div id="pipe-workspace" class="pipe-workspace" data-mode="overview" data-active-level="0">
        <!-- RAIL OF 3 LEVELS (Horizontal in overview, Vertical Stack L1 top -> L2 mid -> L3 bottom in deepdive) -->
        <div id="pipe-nodes-rail" class="pipe-nodes-rail">
          <!-- LEVEL 1 CARD -->
          <div id="pipe-card-l1" onclick="OracleDeck.setSubStep(1)" role="button" tabindex="0" class="pipe-level-card cursor-pointer bg-slate-900 border-2 border-cyan-400 rounded-2xl p-4">
            <div class="flex items-center justify-between mb-1">
              <span class="font-mono-code text-[11px] font-bold text-cyan-400">NÍVEL 1 • FONTES BRUTAS</span>
              <i class="fa-solid fa-arrow-trend-up text-cyan-400 text-sm"></i>
            </div>
            <h3 class="text-base font-bold text-white leading-tight">Corretoras (CEX &amp; DEX)</h3>
            <p class="text-[11px] text-slate-300 mt-1">Binance, Coinbase, Kraken, Bitstamp, OKX, Uniswap...</p>
            <div class="pipe-card-chips mt-2.5 flex flex-wrap gap-1.5 font-mono-code text-[10px]">
              <span class="bg-slate-950 px-2 py-0.5 rounded border border-slate-700 text-emerald-400">Binance: $1.700,10</span>
              <span class="bg-slate-950 px-2 py-0.5 rounded border border-slate-700 text-cyan-300">Coinbase: $1.700,40</span>
            </div>
          </div>

          <!-- Horizontal Connector 1 -> 2 (Overview) -->
          <div id="pipe-conn-h1" class="pipe-conn-h flex-col items-center justify-center">
            <div class="packet-track w-full h-5 bg-slate-900 rounded-full border border-slate-700">
              <div class="packet-dot w-2.5 h-2.5 rounded-full bg-cyan-400"></div>
              <div class="packet-dot pair-1 w-2.5 h-2.5 rounded-full bg-cyan-400"></div>
            </div>
            <span class="font-mono-code text-[10px] text-slate-400 mt-1">Dados Brutos</span>
          </div>

          <!-- Vertical Connector 1 -> 2 (DeepDive) -->
          <div id="pipe-conn-v1" class="pipe-conn-v">
            <div class="flex items-center gap-2">
              <div class="packet-track-vertical w-4 h-7 bg-slate-900 rounded-full border border-slate-700">
                <div class="packet-dot-v w-2 h-2 rounded-full bg-cyan-400"></div>
                <div class="packet-dot-v pair-1 w-2 h-2 rounded-full bg-cyan-400"></div>
              </div>
              <span class="font-mono-code text-[10px] text-slate-400">Dados brutos ↓</span>
            </div>
          </div>

          <!-- LEVEL 2 CARD -->
          <div id="pipe-card-l2" onclick="OracleDeck.setSubStep(2)" role="button" tabindex="0" class="pipe-level-card cursor-pointer bg-slate-900 border border-slate-700 rounded-2xl p-4">
            <div class="flex items-center justify-between mb-1">
              <span class="font-mono-code text-[11px] font-bold text-blue-400">NÍVEL 2 • TRATAMENTO</span>
              <i class="fa-solid fa-filter text-blue-400 text-sm"></i>
            </div>
            <h3 class="text-base font-bold text-white leading-tight">Agregadores de Dados</h3>
            <p class="text-[11px] text-slate-300 mt-1">CoinGecko, Kaiko, Amberdata, BraveNewCoin...</p>
            <div class="pipe-card-chips mt-2.5 flex flex-wrap gap-1.5 font-mono-code text-[10px]">
              <span class="bg-slate-950 px-2 py-0.5 rounded border border-slate-700 text-blue-300">Coleta + 3 Filtros</span>
            </div>
          </div>

          <!-- Horizontal Connector 2 -> 3 (Overview) -->
          <div id="pipe-conn-h2" class="pipe-conn-h flex-col items-center justify-center">
            <div class="packet-track w-full h-5 bg-slate-900 rounded-full border border-slate-700">
              <div class="packet-dot w-2.5 h-2.5 rounded-full bg-blue-400"></div>
              <div class="packet-dot pair-1 w-2.5 h-2.5 rounded-full bg-blue-400"></div>
            </div>
            <span class="font-mono-code text-[10px] text-slate-400 mt-1">Preço Limpo</span>
          </div>

          <!-- Vertical Connector 2 -> 3 (DeepDive) -->
          <div id="pipe-conn-v2" class="pipe-conn-v">
            <div class="flex items-center gap-2">
              <div class="packet-track-vertical w-4 h-7 bg-slate-900 rounded-full border border-slate-700">
                <div class="packet-dot-v w-2 h-2 rounded-full bg-blue-400"></div>
                <div class="packet-dot-v pair-1 w-2 h-2 rounded-full bg-blue-400"></div>
              </div>
              <span class="font-mono-code text-[10px] text-slate-400">Preço limpo ↓</span>
            </div>
          </div>

          <!-- LEVEL 3 CARD -->
          <div id="pipe-card-l3" onclick="OracleDeck.setSubStep(6)" role="button" tabindex="0" class="pipe-level-card cursor-pointer bg-slate-900 border border-slate-700 rounded-2xl p-4">
            <div class="flex items-center justify-between mb-1">
              <span class="font-mono-code text-[11px] font-bold text-amber-400">NÍVEL 3 • CONSENSO DON</span>
              <i class="fa-solid fa-network-wired text-amber-400 text-sm"></i>
            </div>
            <h3 class="text-base font-bold text-white leading-tight">Nós da Chainlink</h3>
            <p class="text-[11px] text-slate-300 mt-1">21 a 31 operadores independentes &amp; Mediana Off-Chain.</p>
            <div class="pipe-card-chips mt-2.5 flex flex-wrap gap-1.5 font-mono-code text-[10px]">
              <span class="bg-slate-950 px-2 py-0.5 rounded border border-amber-500/40 text-amber-300">1 Tx ➔ Smart Contract</span>
            </div>
          </div>
        </div>

        <!-- RIGHT / BOTTOM EXPLANATION STAGE -->
        <div id="pipe-detail-stage" class="pipe-detail-stage">
          <!-- ==========================================
               PANE 0: OVERVIEW
               ========================================== -->
          <div id="pipe-pane-overview" class="panel-reveal bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col gap-4">
            <div>
              <div class="flex items-center gap-3 mb-2">
                <span class="px-2.5 py-0.5 rounded bg-blue-500/20 text-cyan-300 font-mono-code text-xs">VISÃO GERAL DA CASCATA</span>
                <h4 class="font-bold text-white text-lg">Como as mais de 20 fontes se conectam até o contrato?</h4>
              </div>
              <p class="text-sm text-slate-300 leading-relaxed w-full">
                Os nós da Chainlink (<strong>Nível 3</strong>) <strong>não batem diretamente</strong> na API de uma única corretora. O dado nasce nas negociações reais das <strong>Corretoras (Nível 1)</strong>, é coletado e filtrado por empresas <strong>Agregadoras de Mercado (Nível 2)</strong> e só então é consultado pela rede descentralizada de <strong>Nós Operadores (Nível 3)</strong>.
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button type="button" onclick="OracleDeck.setSubStep(1)" class="text-left bg-slate-950/80 hover:border-cyan-400/70 border border-slate-800 rounded-xl p-3.5 transition">
                <span class="font-mono-code text-[11px] text-cyan-400 font-bold block">1. ORIGEM BRUTA</span>
                <span class="text-xs text-slate-300 mt-1 block">Dezenas de corretoras geram preços distintos em tempo real.</span>
              </button>
              <button type="button" onclick="OracleDeck.setSubStep(2)" class="text-left bg-slate-950/80 hover:border-blue-400/70 border border-slate-800 rounded-xl p-3.5 transition">
                <span class="font-mono-code text-[11px] text-blue-400 font-bold block">2. COLETA &amp; 3 FILTROS</span>
                <span class="text-xs text-slate-300 mt-1 block">Agregadores centralizam fontes e expurgam manipulações.</span>
              </button>
              <button type="button" onclick="OracleDeck.setSubStep(6)" class="text-left bg-slate-950/80 hover:border-amber-400/70 border border-slate-800 rounded-xl p-3.5 transition">
                <span class="font-mono-code text-[11px] text-amber-400 font-bold block">3. REDE OFF-CHAIN &amp; MEDIANAS</span>
                <span class="text-xs text-slate-300 mt-1 block">21–31 nós validam múltiplos agregadores sem ponto único de falha.</span>
              </button>
            </div>
          </div>

          <!-- ==========================================
               PANE 1: LEVEL 1 DEEP-DIVE
               ========================================== -->
          <div id="pipe-pane-l1" hidden class="panel-reveal bg-gradient-to-br from-cyan-950/45 via-slate-900 to-slate-900 border-2 border-cyan-500/45 rounded-2xl p-3.5 flex-1 flex flex-col justify-between">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span class="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono-code text-xs font-bold">NÍVEL 1 EM FOCO • FONTES PRIMÁRIAS</span>
                <h4 class="font-bold text-white text-lg mt-0.5">O que acontece nas Corretoras Brutas?</h4>
              </div>
              <span class="font-mono-code text-xs text-cyan-300 bg-slate-950/80 px-3 py-1 rounded-lg border border-cyan-500/30">
                Por que não parar aqui?
              </span>
            </div>

            <!-- Sample Exchange Tickers -->
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 my-2 font-mono-code text-xs">
              <div class="bg-slate-950 border border-slate-800 rounded-xl p-2.5 flex justify-between items-center">
                <span class="text-slate-300">Binance (CEX)</span>
                <span class="text-emerald-400 font-bold">$1.700,10</span>
              </div>
              <div class="bg-slate-950 border border-slate-800 rounded-xl p-2.5 flex justify-between items-center">
                <span class="text-slate-300">Coinbase (CEX)</span>
                <span class="text-cyan-300 font-bold">$1.700,40</span>
              </div>
              <div class="bg-slate-950 border border-slate-800 rounded-xl p-2.5 flex justify-between items-center">
                <span class="text-slate-300">Kraken (CEX)</span>
                <span class="text-cyan-300 font-bold">$1.699,85</span>
              </div>
              <div class="bg-slate-950 border border-slate-800 rounded-xl p-2.5 flex justify-between items-center">
                <span class="text-slate-300">Bitstamp (CEX)</span>
                <span class="text-emerald-400 font-bold">$1.700,30</span>
              </div>
              <div class="bg-slate-950 border border-slate-800 rounded-xl p-2.5 flex justify-between items-center">
                <span class="text-slate-300">OKX (CEX)</span>
                <span class="text-cyan-300 font-bold">$1.700,25</span>
              </div>
              <div class="bg-slate-950 border border-slate-800 rounded-xl p-2.5 flex justify-between items-center">
                <span class="text-slate-300">Uniswap (DEX)</span>
                <span class="text-amber-300 font-bold">$1.700,55</span>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div class="bg-slate-950/85 p-3.5 rounded-xl border border-slate-800">
                <strong class="text-white block mb-1">1. Onde o preço nasce</strong>
                <span class="text-slate-300 leading-relaxed">Milhões de ordens de compra e venda de ETH acontecem simultaneamente em corretoras centralizadas e DEXs ao redor do mundo.</span>
              </div>
              <div class="bg-slate-950/85 p-3.5 rounded-xl border border-amber-500/30">
                <strong class="text-amber-300 block mb-1">2. Risco de fonte única</strong>
                <span class="text-slate-300 leading-relaxed">Se o oráculo olhasse apenas uma corretora, uma queda de API ou uma ordem gigante de baleia distorceria todo o DeFi.</span>
              </div>
              <div class="bg-slate-950/85 p-3.5 rounded-xl border border-cyan-500/30">
                <strong class="text-cyan-300 block mb-1">3. Passagem para o Nível 2</strong>
                <span class="text-slate-300 leading-relaxed">Os Agregadores do Nível 2 puxam dezenas desses fluxos brutos ao mesmo tempo para filtrar ruídos e fraudes.</span>
              </div>
            </div>
          </div>

          <!-- ==========================================
               PANE 2: LEVEL 2 DEEP-DIVE (4 TOP BARS)
               ========================================== -->
          <div id="pipe-pane-l2" hidden class="panel-reveal bg-slate-900/95 border-2 border-blue-500/45 rounded-2xl p-4 flex-1 flex flex-col justify-between">
            <!-- 4 Sequential Top Bars -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-3" role="tablist" aria-label="Etapas do Nível 2">
              <button type="button" id="l2-bar-0" onclick="OracleDeck.setSubStep(2)" role="tab" aria-selected="true" class="pipe-bar-btn is-active text-left p-2.5 rounded-xl border-2 border-cyan-400 bg-blue-950/70">
                <span class="font-mono-code text-[10px] text-cyan-300 font-bold block">BARRA 1 DE 4</span>
                <span class="text-xs font-bold text-white block mt-0.5">1. Coleta de Dados</span>
              </button>
              <button type="button" id="l2-bar-1" onclick="OracleDeck.setSubStep(3)" role="tab" aria-selected="false" class="pipe-bar-btn is-inactive text-left p-2.5 rounded-xl border border-slate-800 bg-slate-950/75">
                <span class="font-mono-code text-[10px] text-blue-400 font-bold block">BARRA 2 DE 4</span>
                <span class="text-xs font-bold text-white block mt-0.5">2. Cálculo VWAP</span>
              </button>
              <button type="button" id="l2-bar-2" onclick="OracleDeck.setSubStep(4)" role="tab" aria-selected="false" class="pipe-bar-btn is-inactive text-left p-2.5 rounded-xl border border-slate-800 bg-slate-950/75">
                <span class="font-mono-code text-[10px] text-indigo-400 font-bold block">BARRA 3 DE 4</span>
                <span class="text-xs font-bold text-white block mt-0.5">3. Profundidade</span>
              </button>
              <button type="button" id="l2-bar-3" onclick="OracleDeck.setSubStep(5)" role="tab" aria-selected="false" class="pipe-bar-btn is-inactive text-left p-2.5 rounded-xl border border-slate-800 bg-slate-950/75">
                <span class="font-mono-code text-[10px] text-amber-400 font-bold block">BARRA 4 DE 4</span>
                <span class="text-xs font-bold text-white block mt-0.5">4. Wash Trading</span>
              </button>
            </div>

            <!-- BAR 1: COLETA DE DADOS (MANY EXCHANGES -> 1 COLLECTOR SVG) -->
            <div id="l2-sub-0" class="panel-reveal flex-1 flex flex-col justify-between">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span class="font-mono-code text-[11px] text-cyan-400 uppercase">Etapa 1 • Centralização Inicial dos Dados Descentralizados</span>
                  <h4 class="text-lg font-bold text-white">Várias Corretoras ➔ 1 Coletor Agregador</h4>
                </div>
                <span class="font-mono-code text-[11px] bg-slate-950 text-cyan-300 px-2.5 py-1 rounded border border-cyan-500/30">
                  N fontes ➔ 1 coletor
                </span>
              </div>

              <div class="bg-slate-950/90 border border-slate-800 rounded-xl p-2 my-2 flex-1 flex items-center justify-center">
                <svg id="svg-l2-fanin" viewBox="0 0 680 230" class="w-full h-full max-h-[215px]" role="img" aria-label="Diagrama animado mostrando 6 corretoras descentralizadas ligadas a 1 único coletor agregador">
                  <defs>
                    <linearGradient id="gradL2Line" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stop-color="#22d3ee" stop-opacity="0.55" />
                      <stop offset="100%" stop-color="#3b82f6" stop-opacity="0.85" />
                    </linearGradient>
                  </defs>

                  <!-- 6 Curved Fan-In Paths (Left Exchanges -> Right Single Collector) -->
                  <path data-flow-path data-dot-color="#38bdf8" d="M 185 24 C 310 24, 335 115, 445 115" fill="none" stroke="url(#gradL2Line)" stroke-width="2" />
                  <path data-flow-path data-dot-color="#22d3ee" d="M 185 60 C 310 60, 335 115, 445 115" fill="none" stroke="url(#gradL2Line)" stroke-width="2" />
                  <path data-flow-path data-dot-color="#60a5fa" d="M 185 96 C 310 96, 335 115, 445 115" fill="none" stroke="url(#gradL2Line)" stroke-width="2" />
                  <path data-flow-path data-dot-color="#34d399" d="M 185 134 C 310 134, 335 115, 445 115" fill="none" stroke="url(#gradL2Line)" stroke-width="2" />
                  <path data-flow-path data-dot-color="#38bdf8" d="M 185 170 C 310 170, 335 115, 445 115" fill="none" stroke="url(#gradL2Line)" stroke-width="2" />
                  <path data-flow-path data-dot-color="#a78bfa" d="M 185 206 C 310 206, 335 115, 445 115" fill="none" stroke="url(#gradL2Line)" stroke-width="2" />

                  <!-- Left Source Pills -->
                  <g font-family="JetBrains Mono, monospace" font-size="11">
                    <rect x="12" y="10" width="173" height="28" rx="8" fill="#0f172a" stroke="#1e293b" />
                    <text x="22" y="28" fill="#e2e8f0" font-weight="600">Binance</text>
                    <text x="175" y="28" fill="#34d399" text-anchor="end">$1.700,10</text>

                    <rect x="12" y="46" width="173" height="28" rx="8" fill="#0f172a" stroke="#1e293b" />
                    <text x="22" y="64" fill="#e2e8f0" font-weight="600">Coinbase</text>
                    <text x="175" y="64" fill="#38bdf8" text-anchor="end">$1.700,40</text>

                    <rect x="12" y="82" width="173" height="28" rx="8" fill="#0f172a" stroke="#1e293b" />
                    <text x="22" y="100" fill="#e2e8f0" font-weight="600">Kraken</text>
                    <text x="175" y="100" fill="#38bdf8" text-anchor="end">$1.699,85</text>

                    <rect x="12" y="118" width="173" height="28" rx="8" fill="#0f172a" stroke="#1e293b" />
                    <text x="22" y="136" fill="#e2e8f0" font-weight="600">Bitstamp</text>
                    <text x="175" y="136" fill="#34d399" text-anchor="end">$1.700,30</text>

                    <rect x="12" y="154" width="173" height="28" rx="8" fill="#0f172a" stroke="#1e293b" />
                    <text x="22" y="172" fill="#e2e8f0" font-weight="600">OKX</text>
                    <text x="175" y="172" fill="#38bdf8" text-anchor="end">$1.700,25</text>

                    <rect x="12" y="190" width="173" height="28" rx="8" fill="#0f172a" stroke="#1e293b" />
                    <text x="22" y="208" fill="#e2e8f0" font-weight="600">Uniswap</text>
                    <text x="175" y="208" fill="#c084fc" text-anchor="end">$1.700,55</text>
                  </g>

                  <!-- Right Single Collector Node -->
                  <g>
                    <rect x="445" y="65" width="222" height="100" rx="14" fill="#172554" stroke="#38bdf8" stroke-width="2" />
                    <text x="556" y="92" fill="#7dd3fc" font-family="JetBrains Mono, monospace" font-size="10" font-weight="700" text-anchor="middle">1 COLETOR AGREGADOR</text>
                    <text x="556" y="114" fill="#ffffff" font-family="Space Grotesk, sans-serif" font-size="15" font-weight="700" text-anchor="middle">Ex: Kaiko / CoinGecko</text>
                    <text x="556" y="136" fill="#cbd5e1" font-family="Inter, sans-serif" font-size="10.5" text-anchor="middle">Consolida dezenas de APIs</text>
                    <text x="556" y="152" fill="#34d399" font-family="JetBrains Mono, monospace" font-size="10.5" font-weight="700" text-anchor="middle">Pronto para os 3 filtros ➔</text>
                  </g>
                </svg>
              </div>

              <div class="text-xs text-cyan-200 bg-blue-950/35 border border-blue-500/25 rounded-xl px-3.5 py-2">
                <strong>Centralização controlada para limpeza:</strong> vários fluxos pulverizados do mercado convergem em 1 coletor para serem padronizados — e nas próximas barras aplicamos os <strong>3 filtros de qualidade</strong>.
              </div>
            </div>

            <!-- BAR 2: FILTRO 1 (VWAP) -->
            <div id="l2-sub-1" hidden class="panel-reveal flex-1 flex flex-col justify-between">
              <div>
                <span class="font-mono-code text-[11px] text-cyan-400 uppercase">Filtro 1 de 3 • Volume-Weighted Average Price (VWAP)</span>
                <h4 class="text-lg font-bold text-white mt-0.5">Como o VWAP protege o preço contra corretoras pequenas?</h4>
                <p class="text-xs text-slate-300 mt-0.5">
                  Em vez de média simples, o agregador dá <strong>peso proporcional ao volume financeiro real</strong> de cada corretora:
                </p>
              </div>

              <div class="space-y-2.5 my-auto">
                <div class="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div class="flex justify-between text-xs font-bold mb-1.5">
                    <span class="text-white">Corretora A (Binance) — Volume: $500M • Preço ETH: $1.700</span>
                    <span class="text-cyan-400 font-mono-code">Peso: 82%</span>
                  </div>
                  <div class="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div class="bg-gradient-to-r from-blue-600 to-cyan-400 h-full rounded-full" style="width: 82%"></div>
                  </div>
                </div>

                <div class="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div class="flex justify-between text-xs font-bold mb-1.5">
                    <span class="text-white">Corretora B (Coinbase) — Volume: $110M • Preço ETH: $1.701</span>
                    <span class="text-blue-400 font-mono-code">Peso: 18%</span>
                  </div>
                  <div class="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div class="bg-blue-500 h-full rounded-full" style="width: 18%"></div>
                  </div>
                </div>

                <div class="bg-slate-950 p-3 rounded-xl border border-red-500/30">
                  <div class="flex justify-between text-xs font-bold mb-1.5">
                    <span class="text-red-300">Corretora C (Pequena) — Volume: $1M • Distorcido: $1.780</span>
                    <span class="text-red-400 font-mono-code">Impacto: ~0,1%</span>
                  </div>
                  <div class="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div class="bg-red-500 h-full rounded-full" style="width: 1.5%"></div>
                  </div>
                </div>
              </div>

              <div class="text-xs text-emerald-300 font-mono-code pt-2 border-t border-slate-800">
                Resultado Consolidado VWAP: ~$1.700,18 (ancorado onde há mais liquidez real)
              </div>
            </div>

            <!-- BAR 3: FILTRO 2 (ORDER BOOK DEPTH) -->
            <div id="l2-sub-2" hidden class="panel-reveal flex-1 flex flex-col justify-between">
              <div>
                <span class="font-mono-code text-[11px] text-blue-400 uppercase">Filtro 2 de 3 • Análise de Profundidade de Livro (Order Book Depth)</span>
                <h4 class="text-lg font-bold text-white mt-0.5">Medindo a variabilidade de oferta e demanda por corretora</h4>
                <p class="text-xs text-slate-300 mt-0.5">
                  Avalia quantos milhões em ordens reais de compra e venda estão empilhados no livro para impedir manipulações baratas.
                </p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 my-auto">
                <div class="bg-slate-950 border border-emerald-500/35 rounded-xl p-4">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-xs font-bold text-emerald-400 uppercase font-mono-code">Livro Profundo</span>
                    <span class="text-[11px] bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded">Aprovado</span>
                  </div>
                  <p class="text-xs text-slate-300 mb-3">
                    Dezenas de milhões em ordens próximas ao preço ($1.699, $1.700, $1.701).
                  </p>
                  <div class="bg-slate-900 p-2.5 rounded-lg text-xs font-mono-code text-slate-200 border border-slate-800">
                    Ordem de $5 Milhões ➔ Preço varia só <strong>0,1%</strong>
                  </div>
                </div>

                <div class="bg-slate-950 border border-red-500/35 rounded-xl p-4">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-xs font-bold text-red-400 uppercase font-mono-code">Livro Raso</span>
                    <span class="text-[11px] bg-red-500/10 text-red-300 px-2 py-0.5 rounded">Peso Reduzido</span>
                  </div>
                  <p class="text-xs text-slate-300 mb-3">
                    Poucas ordens na fila. Qualquer compra pequena derruba ou explode a cotação.
                  </p>
                  <div class="bg-slate-900 p-2.5 rounded-lg text-xs font-mono-code text-red-300 border border-red-900/40">
                    Ordem de apenas $1.000 ➔ Preço salta <strong>+12%</strong>!
                  </div>
                </div>
              </div>

              <div class="text-xs text-blue-300 font-mono-code pt-2 border-t border-slate-800">
                Resumo: corretoras com alta variabilidade e pouca liquidez no livro são descartadas.
              </div>
            </div>

            <!-- BAR 4: FILTRO 3 (WASH TRADING) -->
            <div id="l2-sub-3" hidden class="panel-reveal flex-1 flex flex-col justify-between">
              <div>
                <span class="font-mono-code text-[11px] text-amber-400 uppercase">Filtro 3 de 3 • Anti-Fraude de Volume</span>
                <h4 class="text-lg font-bold text-white mt-0.5">O que é Detecção de Wash Trading?</h4>
                <p class="text-xs text-slate-300 mt-0.5">
                  Impede que um atacante ou corretora mal-intencionada compre e venda para si mesmo com robôs apenas para inflar o volume e enganar o VWAP.
                </p>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-12 gap-3 my-auto items-center">
                <div class="md:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between gap-2">
                  <div class="text-center shrink-0">
                    <div class="w-11 h-11 rounded-xl bg-red-500/15 border border-red-500/40 flex items-center justify-center text-red-400 mx-auto mb-1">
                      <i class="fa-solid fa-robot text-lg"></i>
                    </div>
                    <span class="font-mono-code text-[11px] font-bold text-white block">Robô A</span>
                    <span class="text-[10px] text-slate-400">Vende ETH</span>
                  </div>

                  <div class="flex-1 flex flex-col items-center min-w-0">
                    <span class="font-mono-code text-[10px] text-red-400 mb-1">Volume Falso ($0 taxa)</span>
                    <div class="wash-track w-full h-7 bg-slate-900 rounded-full border border-red-500/30">
                      <div class="wash-packet px-2 py-0.5 rounded bg-red-500 text-[10px] font-mono-code font-bold text-white">
                        ⇄ $2.150
                      </div>
                    </div>
                    <span class="font-mono-code text-[10px] text-amber-400 mt-1">Detectado pelo Algoritmo!</span>
                  </div>

                  <div class="text-center shrink-0">
                    <div class="w-11 h-11 rounded-xl bg-red-500/15 border border-red-500/40 flex items-center justify-center text-red-400 mx-auto mb-1">
                      <i class="fa-solid fa-robot text-lg"></i>
                    </div>
                    <span class="font-mono-code text-[11px] font-bold text-white block">Robô B</span>
                    <span class="text-[10px] text-slate-400">Compra de A</span>
                  </div>
                </div>

                <div class="md:col-span-5 bg-amber-950/30 border border-amber-500/30 rounded-xl p-3.5 text-xs text-slate-200 space-y-1.5">
                  <div class="flex items-center gap-2 text-amber-400 font-bold text-sm">
                    <i class="fa-solid fa-magnifying-glass-chart"></i>
                    <span>Bloqueio no Nível 2</span>
                  </div>
                  <p class="leading-relaxed">
                    Os agregadores cruzam o volume reportado com o livro real e padrões estatísticos. Negociações artificiais entram em <strong>blacklist</strong> e têm peso zerado!
                  </p>
                </div>
              </div>

              <div class="text-xs text-amber-300 font-mono-code pt-2 border-t border-slate-800">
                Resultado do Nível 2: dado limpo, ponderado e auditado — mas ainda precisamos descentralizar quem lê!
              </div>
            </div>
          </div>

          <!-- ==========================================
               PANE 3: LEVEL 3 DEEP-DIVE (3 TOP BARS)
               ========================================== -->
          <div id="pipe-pane-l3" hidden class="panel-reveal bg-slate-900/95 border-2 border-amber-500/45 rounded-2xl p-4 flex-1 flex flex-col justify-between">
            <!-- 3 Sequential Top Bars -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3" role="tablist" aria-label="Etapas do Nível 3">
              <button type="button" id="l3-bar-0" onclick="OracleDeck.setSubStep(6)" role="tab" aria-selected="true" class="pipe-bar-btn is-active text-left p-2.5 rounded-xl border-2 border-amber-400 bg-amber-950/45">
                <span class="font-mono-code text-[10px] text-amber-300 font-bold block">ETAPA 1 DE 3</span>
                <span class="text-xs font-bold text-white block mt-0.5">1. Rede Off-Chain (DON)</span>
              </button>
              <button type="button" id="l3-bar-1" onclick="OracleDeck.setSubStep(7)" role="tab" aria-selected="false" class="pipe-bar-btn is-inactive text-left p-2.5 rounded-xl border border-slate-800 bg-slate-950/75">
                <span class="font-mono-code text-[10px] text-cyan-400 font-bold block">ETAPA 2 DE 3</span>
                <span class="text-xs font-bold text-white block mt-0.5">2. Multi-Agregadores</span>
              </button>
              <button type="button" id="l3-bar-2" onclick="OracleDeck.setSubStep(8)" role="tab" aria-selected="false" class="pipe-bar-btn is-inactive text-left p-2.5 rounded-xl border border-slate-800 bg-slate-950/75">
                <span class="font-mono-code text-[10px] text-emerald-400 font-bold block">ETAPA 3 DE 3</span>
                <span class="text-xs font-bold text-white block mt-0.5">3. Cálculo das Medianas</span>
              </button>
            </div>

            <!-- L3 BAR 1: REDE OFF-CHAIN (DON) -->
            <div id="l3-sub-0" class="panel-reveal flex-1 flex flex-col justify-between">
              <div>
                <span class="font-mono-code text-[11px] text-amber-400 uppercase">Etapa 1 • Decentralized Oracle Network (DON)</span>
                <h4 class="text-lg font-bold text-white mt-0.5">O que é a Rede de Nós Operadores Off-Chain?</h4>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-12 gap-3 my-auto items-stretch">
                <div class="md:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <h5 class="text-sm font-bold text-cyan-300 flex items-center gap-2 mb-2">
                      <i class="fa-solid fa-server"></i> Infraestrutura Independente 24/7
                    </h5>
                    <p class="text-xs text-slate-300 leading-relaxed">
                      Cada nó é um servidor dedicado mantido por empresas de telecomunicações e Web3 independentes (como <strong>Deutsche Telekom, Swisscom, Blockdaemon, Infura</strong>) rodando fora da Ethereum (<strong>Off-Chain</strong>) para não pagar Gas a cada consulta.
                    </p>
                  </div>
                  <div class="mt-3 pt-2.5 border-t border-slate-800 flex flex-wrap gap-1.5 font-mono-code text-[10px]">
                    <span class="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">Deutsche Telekom</span>
                    <span class="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">Swisscom</span>
                    <span class="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">Blockdaemon</span>
                    <span class="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">Infura</span>
                  </div>
                </div>

                <div class="md:col-span-5 grid grid-rows-2 gap-2.5">
                  <div class="bg-slate-950 border border-cyan-500/40 rounded-xl p-3.5 text-center flex flex-col justify-center">
                    <span class="text-3xl font-bold text-cyan-400 font-display">21 a 31</span>
                    <span class="text-xs font-bold text-white mt-0.5">Nós Operadores (ETH/USD)</span>
                    <span class="text-[11px] text-slate-400">Trabalhando em paralelo off-chain</span>
                  </div>
                  <div class="bg-slate-950 border border-amber-500/40 rounded-xl p-3.5 text-center flex flex-col justify-center">
                    <span class="text-3xl font-bold text-amber-400 font-display">Mín. 21</span>
                    <span class="text-xs font-bold text-white mt-0.5">Quórum de Validação</span>
                    <span class="text-[11px] text-slate-400">Assinaturas exigidas por rodada</span>
                  </div>
                </div>
              </div>

              <div class="text-xs text-amber-200 font-mono-code pt-2 border-t border-slate-800">
                Por que tantos nós? Se 1 agregador ou 1 operador falhar, a rede continua intacta!
              </div>
            </div>

            <!-- L3 BAR 2: CONSULTA MULTI-AGREGADORES (MANY AGGREGATORS -> 1 NODE SVG) -->
            <div id="l3-sub-1" hidden class="panel-reveal flex-1 flex flex-col justify-between">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span class="font-mono-code text-[11px] text-cyan-400 uppercase">Etapa 2 • Simetria Fractal da Descentralização</span>
                  <h4 class="text-lg font-bold text-white">Cada Nó consulta vários Agregadores do Nível 2</h4>
                </div>
                <span class="font-mono-code text-[11px] bg-slate-950 text-amber-300 px-2.5 py-1 rounded border border-amber-500/30">
                  Múltiplos Agregadores ➔ 1 Nó
                </span>
              </div>

              <div class="bg-slate-950/90 border border-slate-800 rounded-xl p-2 my-2 flex-1 flex items-center justify-center">
                <svg id="svg-l3-fanin" viewBox="0 0 680 220" class="w-full h-full max-h-[210px]" role="img" aria-label="Diagrama animado mostrando 5 agregadores do Nível 2 ligados a 1 nó operador da Chainlink">
                  <defs>
                    <linearGradient id="gradL3Line" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.6" />
                      <stop offset="100%" stop-color="#fbbf24" stop-opacity="0.9" />
                    </linearGradient>
                  </defs>

                  <path data-flow-path data-dot-color="#38bdf8" d="M 205 26 C 325 26, 350 110, 450 110" fill="none" stroke="url(#gradL3Line)" stroke-width="2" />
                  <path data-flow-path data-dot-color="#fbbf24" d="M 205 68 C 325 68, 350 110, 450 110" fill="none" stroke="url(#gradL3Line)" stroke-width="2" />
                  <path data-flow-path data-dot-color="#34d399" d="M 205 110 C 325 110, 350 110, 450 110" fill="none" stroke="url(#gradL3Line)" stroke-width="2" />
                  <path data-flow-path data-dot-color="#38bdf8" d="M 205 152 C 325 152, 350 110, 450 110" fill="none" stroke="url(#gradL3Line)" stroke-width="2" />
                  <path data-flow-path data-dot-color="#fbbf24" d="M 205 194 C 325 194, 350 110, 450 110" fill="none" stroke="url(#gradL3Line)" stroke-width="2" />

                  <!-- 5 Aggregator APIs -->
                  <g font-family="JetBrains Mono, monospace" font-size="11">
                    <rect x="12" y="11" width="193" height="30" rx="8" fill="#0f172a" stroke="#1e293b" />
                    <text x="22" y="30" fill="#cbd5e1">CoinGecko API</text>
                    <text x="195" y="30" fill="#38bdf8" text-anchor="end">$1.700,10</text>

                    <rect x="12" y="53" width="193" height="30" rx="8" fill="#0f172a" stroke="#1e293b" />
                    <text x="22" y="72" fill="#cbd5e1">BraveNewCoin</text>
                    <text x="195" y="72" fill="#38bdf8" text-anchor="end">$1.700,15</text>

                    <rect x="12" y="95" width="193" height="30" rx="8" fill="#0f172a" stroke="#10b981" stroke-width="1.5" />
                    <text x="22" y="114" fill="#ffffff" font-weight="700">Kaiko API (Meio)</text>
                    <text x="195" y="114" fill="#34d399" font-weight="700" text-anchor="end">$1.700,20</text>

                    <rect x="12" y="137" width="193" height="30" rx="8" fill="#0f172a" stroke="#1e293b" />
                    <text x="22" y="156" fill="#cbd5e1">CryptoCompare</text>
                    <text x="195" y="156" fill="#38bdf8" text-anchor="end">$1.700,30</text>

                    <rect x="12" y="179" width="193" height="30" rx="8" fill="#0f172a" stroke="#1e293b" />
                    <text x="22" y="198" fill="#cbd5e1">Amberdata API</text>
                    <text x="195" y="198" fill="#38bdf8" text-anchor="end">$1.700,45</text>
                  </g>

                  <!-- Single Operator Node -->
                  <g>
                    <rect x="450" y="56" width="218" height="108" rx="14" fill="#1e1b4b" stroke="#fbbf24" stroke-width="2" />
                    <text x="559" y="83" fill="#fcd34d" font-family="JetBrains Mono, monospace" font-size="10" font-weight="700" text-anchor="middle">NÓ OPERADOR #01 (DON)</text>
                    <text x="559" y="106" fill="#ffffff" font-family="Space Grotesk, sans-serif" font-size="14.5" font-weight="700" text-anchor="middle">Consulta N Agregadores</text>
                    <text x="559" y="128" fill="#cbd5e1" font-family="Inter, sans-serif" font-size="10.5" text-anchor="middle">Igual ao Nível 2 com corretoras!</text>
                    <text x="559" y="148" fill="#34d399" font-family="JetBrains Mono, monospace" font-size="11" font-weight="700" text-anchor="middle">Mediana Local: $1.700,20</text>
                  </g>
                </svg>
              </div>

              <div class="text-xs text-slate-300 bg-slate-950/75 border border-slate-800 rounded-xl px-3.5 py-2">
                <strong>Dupla camada contra falhas:</strong> nenhum nó depende de um único agregador — e como todos os <strong>21 a 31 nós</strong> fazem isso ao mesmo tempo, precisamos agora da mediana da rede!
              </div>
            </div>

            <!-- L3 BAR 3: CÁLCULO DAS MEDIANAS -->
            <div id="l3-sub-2" hidden class="panel-reveal flex-1 flex flex-col justify-between">
              <div>
                <span class="font-mono-code text-[11px] text-emerald-400 uppercase">Etapa 3 • Imunidade Estatística em Duas Fases</span>
                <h4 class="text-lg font-bold text-white mt-0.5">Cálculo das Medianas (Local no Nó + Global na Rede)</h4>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-3 my-auto">
                <!-- Local Median -->
                <div class="bg-slate-950 border border-cyan-500/35 rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <span class="font-mono-code text-[10px] text-cyan-400 uppercase font-bold">Fase A • Mediana Local (Dentro de 1 Nó)</span>
                    <h5 class="text-sm font-bold text-white mt-1 mb-2">Ordena as respostas dos Agregadores</h5>
                    <div class="bg-slate-900 border border-slate-800 rounded-lg p-2.5 font-mono-code text-[11px] text-slate-300 space-y-1">
                      <div>[$1.700,10, $1.700,15, <strong class="text-emerald-400">★ $1.700,20</strong>, $1.700,30, $1.700,45]</div>
                    </div>
                  </div>
                  <p class="text-[11px] text-slate-400 mt-2.5">
                    Se um agregador retornar bug ou pico falso, ele fica isolado na ponta e não contamina o nó.
                  </p>
                </div>

                <!-- Global Network Median -->
                <div class="bg-slate-950 border border-emerald-500/40 rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <span class="font-mono-code text-[10px] text-emerald-400 uppercase font-bold">Fase B • Mediana Global (Entre os 21–31 Nós)</span>
                    <h5 class="text-sm font-bold text-white mt-1 mb-2">Expurga nós invadidos ou mal-intencionados</h5>
                    <div class="bg-slate-900 border border-slate-800 rounded-lg p-2.5 font-mono-code text-[11px] text-slate-300 space-y-1">
                      <div>[$1.699,90, ..., <strong class="text-emerald-400">★ $1.700,20</strong>, ..., <span class="text-red-400 line-through">$999.999</span>]</div>
                    </div>
                  </div>
                  <p class="text-[11px] text-slate-400 mt-2.5">
                    Mesmo que um hacker invada um nó operador, a mediana matemática ignora o extremo!
                  </p>
                </div>
              </div>

              <div class="text-xs text-emerald-300 font-mono-code pt-2 border-t border-slate-800 flex items-center justify-between">
                <span>Próximo Slide: como os 31 nós calculam isso sem pagar 31x Gas na Ethereum? (Protocolo OCR) ➔</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
});
