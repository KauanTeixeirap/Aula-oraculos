window.OracleDeck = window.OracleDeck || {};
window.OracleDeck.SLIDES = window.OracleDeck.SLIDES || [];

window.OracleDeck.SLIDES.push(function renderSlide07OcrProtocol() {
  return `
    <section class="slide-view flex-col justify-between h-full" data-slide="6" data-steps="1">
      <div>
        <span class="font-mono-code text-xs text-cyan-400 uppercase tracking-widest">05 • Protocolo Off-Chain Reporting (OCR)</span>
        <h2 class="text-3xl md:text-4xl font-bold text-white mt-1">Como os nós se comunicam? (Modelo Antigo vs. OCR Atual)</h2>
        <p class="text-slate-400 text-sm md:text-base mt-1">
          Por que a Chainlink tirou a organização e o cálculo de dentro do Smart Contract e levou para uma rede P2P Off-Chain?
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 my-auto items-stretch">
        <!-- Old Model -->
        <div class="bg-slate-900/90 border border-red-500/30 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="px-2.5 py-1 rounded bg-red-500/15 text-red-400 font-mono-code text-xs font-bold">ANTIGAMENTE • ON-CHAIN AGGREGATION</span>
              <i class="fa-solid fa-fire-flame-curved text-red-400 text-lg"></i>
            </div>
            <h3 class="text-xl font-bold text-white mb-3">Custo de Gas Explosivo na Rede</h3>
            <ul class="space-y-3 text-xs md:text-sm text-slate-300">
              <li class="flex items-start gap-2.5">
                <i class="fa-solid fa-xmark text-red-400 mt-1"></i>
                <span><strong>Transações Separadas:</strong> Cada um dos 21 a 31 nós enviava sua própria transação individual direto para a Ethereum.</span>
              </li>
              <li class="flex items-start gap-2.5">
                <i class="fa-solid fa-xmark text-red-400 mt-1"></i>
                <span><strong>Ordenação e Mediana no Smart Contract:</strong> O próprio contrato na blockchain precisava armazenar cada envio, organizar a lista e calcular a mediana <em>on-chain</em>.</span>
              </li>
              <li class="flex items-start gap-2.5">
                <i class="fa-solid fa-coins text-amber-400 mt-1"></i>
                <span><strong>Consequência:</strong> Gastava muito mais processamento na EVM e multiplicava o custo de Gas a cada atualização!</span>
              </li>
            </ul>
          </div>

          <div class="mt-4 bg-red-950/40 border border-red-500/30 rounded-xl p-3 font-mono-code text-xs text-red-300 text-center">
            31 Transações + Processamento Pesado On-Chain = Gas Altíssimo
          </div>
        </div>

        <!-- Current OCR Model -->
        <div class="bg-gradient-to-b from-blue-950/60 to-slate-900 border-2 border-cyan-400/60 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-300 font-mono-code text-xs font-bold">HOJE • PROTOCOLO OCR (P2P OFF-CHAIN)</span>
              <i class="fa-solid fa-bolt text-cyan-400 text-lg"></i>
            </div>
            <h3 class="text-xl font-bold text-white mb-3">Consenso P2P e Eleição de Líder</h3>
            <ul class="space-y-3 text-xs md:text-sm text-slate-200">
              <li class="flex items-start gap-2.5">
                <i class="fa-solid fa-check text-emerald-400 mt-1"></i>
                <span><strong>Conversa P2P Gratuita:</strong> Os 31 nós conversam entre si fora da blockchain (via rede P2P), onde trocar dados custa <strong>zero de Gas</strong>.</span>
              </li>
              <li class="flex items-start gap-2.5">
                <i class="fa-solid fa-check text-emerald-400 mt-1"></i>
                <span><strong>Rodada de Eleição de Líder:</strong> A cada rodada é escolhido um nó <strong>Líder</strong>, que coleta os valores assinados com a chave privada de cada nó.</span>
              </li>
              <li class="flex items-start gap-2.5">
                <i class="fa-solid fa-check text-emerald-400 mt-1"></i>
                <span><strong>1 Única Transação:</strong> O Líder já organiza tudo em um array ordenado off-chain e envia <strong>uma única transação</strong> para o Smart Contract!</span>
              </li>
            </ul>
          </div>

          <div class="mt-4 bg-emerald-950/50 border border-emerald-500/40 rounded-xl p-3 font-mono-code text-xs text-emerald-300 text-center">
            Redução de até 90% no custo de Gas na rede Ethereum!
          </div>
        </div>
      </div>
    </section>
  `;
});
