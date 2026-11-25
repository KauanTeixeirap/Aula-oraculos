window.OracleDeck = window.OracleDeck || {};
window.OracleDeck.SLIDES = window.OracleDeck.SLIDES || [];

window.OracleDeck.SLIDES.push(function renderSlide09Triggers() {
  const cl = window.OracleDeck.METRICS.chainlink;

  return `
    <section class="slide-view flex-col justify-between h-full" data-slide="8" data-steps="1">
      <div>
        <span class="font-mono-code text-xs text-amber-400 uppercase tracking-widest">07 • Quando o Oráculo posta na rede?</span>
        <h2 class="text-3xl md:text-4xl font-bold text-white mt-1">Frequência de Consolidação (Sistema de Duplo Gatilho)</h2>
        <p class="text-slate-400 text-sm md:text-base mt-1">
          Para economizar Gas sem deixar o preço defasado na Ethereum Mainnet, uma atualização é disparada pelo critério que ocorrer primeiro:
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-auto">
        <!-- Trigger 1: Deviation Threshold -->
        <div class="bg-slate-900 border-2 border-cyan-500/40 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-4">
              <span class="px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-300 font-mono-code text-xs font-bold">GATILHO 1 • POR VARIAÇÃO DE PREÇO</span>
              <i class="fa-solid fa-bolt-lightning text-cyan-400 text-xl"></i>
            </div>
            <div class="flex items-baseline gap-3 mb-3">
              <span class="text-5xl font-bold font-display text-cyan-400">${cl.deviationThreshold}</span>
              <span class="text-lg font-bold text-white">Limiar de Desvio (Deviation Threshold)</span>
            </div>
            <p class="text-xs md:text-sm text-slate-300 leading-relaxed">
              Os nós monitoram o mercado off-chain segundo a segundo. Sempre que o preço real variar <strong>0,5% para cima ou para baixo</strong> em relação ao último valor gravado no Smart Contract, uma rodada OCR é disparada imediatamente!
            </p>
          </div>
          <div class="mt-5 pt-3 border-t border-slate-800 text-xs text-slate-400 font-mono-code">
            Em dias de alta volatilidade, atualiza várias vezes por minuto.
          </div>
        </div>

        <!-- Trigger 2: Heartbeat -->
        <div class="bg-slate-900 border-2 border-amber-500/40 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-4">
              <span class="px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 font-mono-code text-xs font-bold">GATILHO 2 • POR TEMPO MÁXIMO</span>
              <i class="fa-solid fa-heart-pulse text-amber-400 text-xl"></i>
            </div>
            <div class="flex items-baseline gap-3 mb-3">
              <span class="text-5xl font-bold font-display text-amber-400">${cl.heartbeat}</span>
              <span class="text-lg font-bold text-white">Heartbeat (Tempo Máximo de Intervalo)</span>
            </div>
            <p class="text-xs md:text-sm text-slate-300 leading-relaxed">
              E se o mercado ficar parado e o ETH não variar 0,5%? Existe um cronômetro regressivo de <strong>1 hora (3600s)</strong>. Quando o tempo zera, os nós são obrigados a atualizar o contrato para provar que o oráculo continua ativo.
            </p>
          </div>
          <div class="mt-5 pt-3 border-t border-slate-800 text-xs text-slate-400 font-mono-code">
            Garante que nenhum contrato leia um preço "congelado" (stale price).
          </div>
        </div>
      </div>

      <div class="bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2.5 flex items-center gap-3 text-xs text-slate-300">
        <i class="fa-solid fa-layer-group text-cyan-400"></i>
        <span><strong>Escala em Layer 2 (2026):</strong> ${cl.l2Note}</span>
      </div>
    </section>
  `;
});
