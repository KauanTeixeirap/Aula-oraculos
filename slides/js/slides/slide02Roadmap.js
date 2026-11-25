window.OracleDeck = window.OracleDeck || {};
window.OracleDeck.SLIDES = window.OracleDeck.SLIDES || [];

window.OracleDeck.SLIDES.push(function renderSlide02Roadmap() {
  const nodes = window.OracleDeck.ROADMAP_NODES || [];

  const toneMap = {
    cyan: {
      border: 'border-cyan-500/40 hover:border-cyan-400',
      badge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
      icon: 'text-cyan-400'
    },
    blue: {
      border: 'border-blue-500/40 hover:border-blue-400',
      badge: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
      icon: 'text-blue-400'
    },
    amber: {
      border: 'border-amber-500/40 hover:border-amber-400',
      badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      icon: 'text-amber-400'
    },
    purple: {
      border: 'border-purple-500/40 hover:border-purple-400',
      badge: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
      icon: 'text-purple-400'
    },
    rose: {
      border: 'border-rose-500/40 hover:border-rose-400',
      badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
      icon: 'text-rose-400'
    },
    emerald: {
      border: 'border-emerald-500/50 hover:border-emerald-400',
      badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      icon: 'text-emerald-400'
    }
  };

  function card(node) {
    const t = toneMap[node.tone] || toneMap.cyan;
    return `
      <button
        type="button"
        onclick="OracleDeck.goToSlide(${node.slideIndex}, ${node.subStep})"
        class="roadmap-node group text-left w-full bg-slate-900/90 border ${t.border} rounded-xl p-3 flex flex-col justify-between shadow-lg hover:shadow-cyan-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
      >
        <div class="flex items-center justify-between gap-2 mb-1">
          <span class="px-2 py-0.5 rounded-md border ${t.badge} font-mono-code text-[10px] font-bold">
            ETAPA ${String(node.num).padStart(2, '0')}
          </span>
          <i class="fa-solid ${node.icon} ${t.icon} text-xs"></i>
        </div>
        <div>
          <h3 class="text-xs md:text-sm font-bold text-white leading-snug group-hover:text-cyan-200 transition-colors">
            ${node.title}
          </h3>
          <p class="text-[11px] text-slate-400 mt-0.5 leading-snug">${node.subtitle}</p>
        </div>
      </button>
    `;
  }

  function arrowH(dir = 'right') {
    const icon = dir === 'right' ? 'fa-arrow-right' : 'fa-arrow-left';
    return `
      <div class="hidden md:flex items-center justify-center text-cyan-400/80">
        <div class="flex items-center gap-1 px-1">
          <span class="w-4 h-0.5 bg-cyan-500/50 rounded-full"></span>
          <i class="fa-solid ${icon} text-xs"></i>
        </div>
      </div>
    `;
  }

  return `
    <section class="slide-view flex-col justify-between h-full" data-slide="1" data-steps="1">
      <div class="flex flex-wrap items-end justify-between gap-2">
        <div>
          <span class="font-mono-code text-xs text-cyan-400 uppercase tracking-widest">00 • Caminho da Aula</span>
          <h2 class="text-3xl md:text-4xl font-bold text-white mt-1">Linha Temporal de Aprendizado</h2>
          <p class="text-slate-400 text-xs md:text-sm mt-1">
            Objetivo: compreender como aplicações blockchain utilizam dados externos de forma confiável (clique em qualquer etapa para navegar).
          </p>
        </div>
        <span class="font-mono-code text-[11px] text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
          9 Etapas • Fluxo Serpente
        </span>
      </div>

      <!-- Serpentine 3x3 Flowchart matching PLANO_SLIDES_AULA_ORACULOS.md -->
      <div class="my-auto flex flex-col gap-1.5">
        <!-- Row 1: 1 -> 2 -> 3 -->
        <div class="grid grid-cols-1 md:grid-cols-[1fr_36px_1fr_36px_1fr] gap-2 items-center">
          ${card(nodes[0])}
          ${arrowH('right')}
          ${card(nodes[1])}
          ${arrowH('right')}
          ${card(nodes[2])}
        </div>

        <!-- Connector Row 1 -> Row 2 (Right side, under Node 3 -> Node 4) -->
        <div class="hidden md:grid grid-cols-[1fr_36px_1fr_36px_1fr] gap-2 items-center h-4">
          <div></div><div></div><div></div><div></div>
          <div class="flex items-center justify-center text-cyan-400/85">
            <div class="flex flex-col items-center">
              <span class="w-0.5 h-2 bg-cyan-500/55"></span>
              <i class="fa-solid fa-arrow-down text-[11px] -mt-1"></i>
            </div>
          </div>
        </div>

        <!-- Row 2: 6 <- 5 <- 4 (Visual serpentine right-to-left) -->
        <div class="grid grid-cols-1 md:grid-cols-[1fr_36px_1fr_36px_1fr] gap-2 items-center">
          ${card(nodes[5])}
          ${arrowH('left')}
          ${card(nodes[4])}
          ${arrowH('left')}
          ${card(nodes[3])}
        </div>

        <!-- Connector Row 2 -> Row 3 (Left side, under Node 6 -> Node 7) -->
        <div class="hidden md:grid grid-cols-[1fr_36px_1fr_36px_1fr] gap-2 items-center h-4">
          <div class="flex items-center justify-center text-cyan-400/85">
            <div class="flex flex-col items-center">
              <span class="w-0.5 h-2 bg-cyan-500/55"></span>
              <i class="fa-solid fa-arrow-down text-[11px] -mt-1"></i>
            </div>
          </div>
          <div></div><div></div><div></div><div></div>
        </div>

        <!-- Row 3: 7 -> 8 -> 9 -->
        <div class="grid grid-cols-1 md:grid-cols-[1fr_36px_1fr_36px_1fr] gap-2 items-center">
          ${card(nodes[6])}
          ${arrowH('right')}
          ${card(nodes[7])}
          ${arrowH('right')}
          ${card(nodes[8])}
        </div>
      </div>
    </section>
  `;
});
