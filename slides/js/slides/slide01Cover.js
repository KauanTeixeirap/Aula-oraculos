window.OracleDeck = window.OracleDeck || {};
window.OracleDeck.SLIDES = window.OracleDeck.SLIDES || [];

window.OracleDeck.SLIDES.push(function renderSlide01Cover() {
  return `
    <section class="slide-view active flex-col justify-center h-full px-4" data-slide="0" data-steps="1">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
        <!-- Texto da Capa -->
        <div class="lg:col-span-7 flex flex-col justify-center">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-cyan-300 font-mono-code text-xs w-fit mb-6">
            <span class="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            ARQUITETURA BLOCKCHAIN • ESTUDO DE CASO ETH/USD
          </div>
          <h2 class="text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.1] mb-6">
            Oráculos na <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Blockchain</span>
          </h2>
          <p class="text-lg md:text-xl text-slate-300 max-w-2xl leading-relaxed">
            Como contratos inteligentes isolados conseguem descobrir o preço real do Ethereum e do Dólar usando mais de 20 fontes globais sem depender de um servidor central.
          </p>
        </div>

        <!-- Elemento 3D Interativo (Cubo On-Chain + Nós de Oráculo) -->
        <div class="lg:col-span-5 flex flex-col items-center justify-center relative">
          <div class="relative w-full max-w-[430px] aspect-square flex items-center justify-center">
            <canvas
              id="oracle-3d-canvas"
              class="oracle-3d-stage w-full h-full block"
              role="img"
              aria-label="Visualização 3D interativa de um cubo blockchain conectado a nós externos de dados como Globo e API por anéis orbitais"
            ></canvas>
          </div>
          <div class="flex items-center gap-3 mt-1">
            <span class="font-mono-code text-[11px] text-slate-400 flex items-center gap-1.5">
              <i class="fa-solid fa-cube text-cyan-400"></i>
              Arraste para girar em 3D
            </span>
            <button
              type="button"
              id="btn-toggle-3d"
              class="px-2.5 py-1 rounded-md text-[11px] font-mono-code bg-slate-800/80 hover:bg-slate-700 text-cyan-300 border border-slate-700/80 transition flex items-center gap-1.5"
            >
              <i class="fa-solid fa-pause" id="icon-toggle-3d" aria-hidden="true"></i>
              <span id="label-toggle-3d">Pausar</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  `;
});
