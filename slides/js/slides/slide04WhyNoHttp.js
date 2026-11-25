window.OracleDeck = window.OracleDeck || {};
window.OracleDeck.SLIDES = window.OracleDeck.SLIDES || [];

window.OracleDeck.SLIDES.push(function renderSlide04WhyNoHttp() {
  return `
    <section class="slide-view flex-col justify-between h-full" data-slide="3" data-steps="1">
      <div>
        <span class="font-mono-code text-xs text-amber-400 uppercase tracking-widest">02 • Travas Arquiteturais e Consenso</span>
        <h2 class="text-3xl md:text-4xl font-bold text-white mt-1">Por que a Blockchain não faz requisições HTTP?</h2>
        <p class="text-slate-400 text-sm md:text-base mt-1">
          Não é apenas por variação de preço: a própria estrutura da máquina virtual proíbe chamadas externas.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 my-auto items-stretch">
        <!-- Left: The 3 Technical Reasons -->
        <div class="lg:col-span-6 flex flex-col justify-between space-y-3.5">
          <div class="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex items-start gap-4">
            <div class="w-10 h-10 rounded-lg bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 shrink-0 mt-0.5">
              <i class="fa-solid fa-ban"></i>
            </div>
            <div>
              <h3 class="font-bold text-white text-base">1. Bloqueio Estrutural (Ambiente Sandbox)</h3>
              <p class="text-xs md:text-sm text-slate-300 mt-1 leading-relaxed">
                A Máquina Virtual da Blockchain (EVM) é isolada por arquitetura. No código de máquina não existem instruções nativas (<code class="text-amber-300">opcodes</code>) para abrir sockets TCP/IP ou fazer um <code class="text-amber-300">GET HTTP</code>.
              </p>
            </div>
          </div>

          <div class="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex items-start gap-4">
            <div class="w-10 h-10 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
              <i class="fa-solid fa-stopwatch"></i>
            </div>
            <div>
              <h3 class="font-bold text-white text-base">2. Problema do Milissegundo (Quebra de Consenso)</h3>
              <p class="text-xs md:text-sm text-slate-300 mt-1 leading-relaxed">
                Se você e um amigo pesquisarem o Dólar com <strong>1 milésimo de segundo</strong> de diferença, a API pode retornar valores diferentes. Se dois validadores recebem números diferentes, a blockchain trava!
              </p>
            </div>
          </div>

          <div class="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex items-start gap-4">
            <div class="w-10 h-10 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
              <i class="fa-solid fa-clock-rotate-left"></i>
            </div>
            <div>
              <h3 class="font-bold text-white text-base">3. Reprodução Histórica no Futuro</h3>
              <p class="text-xs md:text-sm text-slate-300 mt-1 leading-relaxed">
                Um computador novo que entrar na rede daqui a 5 anos precisa re-executar todos os blocos desde o início. Se a API externa tivesse saído do ar, seria impossível sincronizar.
              </p>
            </div>
          </div>
        </div>

        <!-- Right: Interactive Simulator of Consensus Failure (Starts Empty!) -->
        <div class="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <span class="font-mono-code text-xs text-amber-400 uppercase">Simulador de Falha HTTP</span>
              <h4 class="font-bold text-white text-base">O que aconteceria se houvesse HTTP On-Chain?</h4>
            </div>
            <div class="flex items-center gap-2">
              <button
                type="button"
                id="btn-sim-reset"
                onclick="OracleDeck.resetHttpSimulator()"
                hidden
                class="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 border border-slate-700 transition"
                title="Limpar resultado"
              >
                Limpar
              </button>
              <button
                type="button"
                id="btn-sim-http"
                onclick="OracleDeck.simulateHttpCall()"
                class="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white flex items-center gap-1.5 shadow transition"
              >
                <i class="fa-solid fa-rotate"></i> Testar Consulta Simultânea
              </button>
            </div>
          </div>

          <div class="space-y-3 my-4">
            <div class="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <i class="fa-solid fa-server text-cyan-400"></i>
                <div>
                  <p class="text-xs font-bold text-white">Você (Validador #1)</p>
                  <p id="sim-time-1" class="text-[11px] font-mono-code text-slate-500">Aguardando teste de consulta...</p>
                </div>
              </div>
              <span id="sim-val-1" class="font-mono-code text-base font-bold text-slate-500 bg-slate-900/60 px-3 py-1 rounded-lg border border-slate-800 min-w-[104px] h-9 flex items-center justify-center"></span>
            </div>

            <div class="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <i class="fa-solid fa-server text-purple-400"></i>
                <div>
                  <p class="text-xs font-bold text-white">Seu Amigo (Validador #2)</p>
                  <p id="sim-time-2" class="text-[11px] font-mono-code text-slate-500">Aguardando teste de consulta...</p>
                </div>
              </div>
              <span id="sim-val-2" class="font-mono-code text-base font-bold text-slate-500 bg-slate-900/60 px-3 py-1 rounded-lg border border-slate-800 min-w-[104px] h-9 flex items-center justify-center"></span>
            </div>
          </div>

          <!-- Neutral Idle Prompt (visible until tested) -->
          <div id="sim-empty-hint" class="bg-slate-950/70 border border-dashed border-slate-700 rounded-xl p-3.5 flex items-center gap-3">
            <i class="fa-solid fa-flask text-cyan-400 text-lg"></i>
            <p class="text-xs text-slate-400 leading-relaxed">
              Clique em <strong class="text-cyan-300">"Testar Consulta Simultânea"</strong> para simular dois validadores consultando a cotação USD/BRL com 1 ms de diferença.
            </p>
          </div>

          <!-- Fork Warning (hidden until tested!) -->
          <div id="sim-warning" hidden class="discrete-panel bg-red-950/50 border border-red-500/40 rounded-xl p-3.5 flex items-center gap-3">
            <i class="fa-solid fa-triangle-exclamation text-red-400 text-xl"></i>
            <div class="text-xs text-red-200 leading-relaxed">
              <strong>Resultado: Quebra de Consenso (Fork)!</strong> Como <code id="sim-diff-1"></code> ≠ <code id="sim-diff-2"></code>, os validadores discordam do estado do bloco. Por isso o dado precisa entrar <strong>já unificado via Oráculo</strong>.
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
});
