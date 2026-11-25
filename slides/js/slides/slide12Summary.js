window.OracleDeck = window.OracleDeck || {};
window.OracleDeck.SLIDES = window.OracleDeck.SLIDES || [];

window.OracleDeck.SLIDES.push(function renderSlide12Summary() {
  return `
    <section class="slide-view flex-col justify-between h-full" data-slide="11" data-steps="1">
      <div class="text-center max-w-3xl mx-auto">
        <span class="font-mono-code text-xs text-cyan-400 uppercase tracking-widest">10 • Fechamento e Revisão Completa</span>
        <h2 class="text-4xl md:text-5xl font-bold text-white mt-2">Resumo da Jornada do Dado</h2>
        <p class="text-slate-400 text-sm md:text-base mt-2">
          De uma ordem de compra em uma corretora até a variável lida pelo Smart Contract na Ethereum:
        </p>
      </div>

      <!-- Summary Pipeline Cards -->
      <div class="grid grid-cols-1 md:grid-cols-5 gap-3 my-auto">
        <div class="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
          <span class="font-mono-code text-xs text-cyan-400 block mb-1">PASSO 1</span>
          <h4 class="font-bold text-white text-sm">Trava HTTP &amp; Sandbox</h4>
          <p class="text-xs text-slate-400 mt-1">A Blockchain é isolada e determinística; precisa do Oráculo.</p>
        </div>
        <div class="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
          <span class="font-mono-code text-xs text-cyan-400 block mb-1">PASSO 2</span>
          <h4 class="font-bold text-white text-sm">Nível 1 ➔ Nível 2</h4>
          <p class="text-xs text-slate-400 mt-1">Corretoras geram dados; Agregadores coletam e aplicam VWAP, Livro e Anti-Wash.</p>
        </div>
        <div class="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
          <span class="font-mono-code text-xs text-cyan-400 block mb-1">PASSO 3</span>
          <h4 class="font-bold text-white text-sm">Nível 3 &amp; OCR P2P</h4>
          <p class="text-xs text-slate-400 mt-1">21-31 nós consultam múltiplos agregadores, tiram medianas e conversam P2P.</p>
        </div>
        <div class="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
          <span class="font-mono-code text-xs text-cyan-400 block mb-1">PASSO 4</span>
          <h4 class="font-bold text-white text-sm">Smart Contract</h4>
          <p class="text-xs text-slate-400 mt-1">Valida assinaturas e ordem, extrai a Mediana (a cada 0,5% ou 60m).</p>
        </div>
        <div class="bg-slate-900 border border-amber-500/40 rounded-xl p-4 text-center">
          <span class="font-mono-code text-xs text-amber-400 block mb-1">PASSO 5</span>
          <h4 class="font-bold text-white text-sm">Fila do Bloco &amp; OEV</h4>
          <p class="text-xs text-slate-400 mt-1">Bots monitoram a Mempool e pagam Gas para entrar logo após o oráculo.</p>
        </div>
      </div>

      <div class="bg-gradient-to-r from-blue-950/80 via-slate-900 to-blue-950/80 border border-blue-500/40 rounded-2xl p-6 text-center max-w-2xl mx-auto w-full">
        <h3 class="text-2xl font-bold text-white">Dúvidas ou Perguntas?</h3>
        <p class="text-xs md:text-sm text-cyan-300 mt-1">
          Use os botões abaixo ou as setas do teclado para revisitar qualquer etapa da simulação.
        </p>
      </div>
    </section>
  `;
});
