window.OracleDeck = window.OracleDeck || {};
window.OracleDeck.SLIDES = window.OracleDeck.SLIDES || [];

window.OracleDeck.SLIDES.push(function renderSlide10BlockOrderOev() {
  const blockNum = window.OracleDeck.METRICS.market.ethBlockNumber;

  return `
    <section class="slide-view flex-col justify-between h-full" data-slide="9" data-steps="1">
      <div>
        <span class="font-mono-code text-xs text-amber-400 uppercase tracking-widest">08 • Ordem no Bloco, Mempool e OEV</span>
        <h2 class="text-2xl md:text-3xl font-bold text-white mt-0.5">
          "E se duas pessoas operarem no mesmo bloco em que o preço muda?"
        </h2>
        <p class="text-slate-400 text-xs md:text-sm mt-0.5">
          Na blockchain as transações rodam em fila sequencial. Quem entra antes da Chainlink lê o preço antigo; quem entra depois lê o preço novo.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 my-auto items-stretch">
        <!-- Left Explanatory Cards -->
        <div class="lg:col-span-5 flex flex-col justify-between space-y-3">
          <div class="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <h3 class="text-sm font-bold text-cyan-300 flex items-center gap-2">
              <i class="fa-solid fa-layer-group"></i> 1. Leitura sem requisição externa
            </h3>
            <p class="text-xs text-slate-300 mt-1 leading-relaxed">
              Quando um usuário faz uma compra ou empréstimo, o contrato lê a variável já salva na memória da blockchain. Portanto, tudo depende da <strong>posição na fila do bloco</strong>.
            </p>
          </div>

          <div class="bg-slate-900 border border-amber-500/40 rounded-xl p-4">
            <h3 class="text-sm font-bold text-amber-400 flex items-center gap-2">
              <i class="fa-solid fa-eye"></i> 2. Mempool Pública e OEV
            </h3>
            <p class="text-xs text-slate-300 mt-1 leading-relaxed">
              Antes de o bloco fechar (a cada 12s), a transação da Chainlink fica visível na <strong>Mempool</strong> (sala de espera). É aí que surge o <strong>OEV (Oracle Extractable Value)</strong>.
            </p>
          </div>

          <div class="bg-amber-950/30 border border-amber-500/40 rounded-xl p-4">
            <h3 class="text-sm font-bold text-white flex items-center gap-2">
              <i class="fa-solid fa-robot text-amber-400"></i> 3. Como o Bot lucra (Back-running)?
            </h3>
            <p class="text-xs text-slate-200 mt-1 leading-relaxed">
              O Bot vê na Mempool que a Chainlink vai atualizar o ETH para <strong>$1.690</strong> (liberando liquidações). Ele paga uma <strong>gorjeta alta de Gas</strong> ao validador para colar sua transação na posição <strong>#11</strong> (logo após a Chainlink)!
            </p>
          </div>
        </div>

        <!-- Right Side: Enriched Visual Block Queue Table -->
        <div class="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
            <span class="font-mono-code text-xs text-cyan-400 font-bold">FILA DE EXECUÇÃO DENTRO DO BLOCO ${blockNum}</span>
            <span class="text-xs bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded font-mono-code">Execução de cima p/ baixo</span>
          </div>

          <div class="overflow-hidden rounded-xl border border-slate-800">
            <table class="w-full text-left border-collapse text-xs">
              <thead>
                <tr class="bg-slate-950 text-slate-400 font-mono-code border-b border-slate-800">
                  <th class="py-3 px-3">Posição</th>
                  <th class="py-3 px-3">Quem Envia</th>
                  <th class="py-3 px-3">Preço Lido</th>
                  <th class="py-3 px-3">O que acontece</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800/80">
                <tr class="bg-slate-900/60">
                  <td class="py-3.5 px-3 font-mono-code text-slate-300">#09</td>
                  <td class="py-3.5 px-3 font-medium text-white">Pessoa 1 (Operação DeFi)</td>
                  <td class="py-3.5 px-3 font-mono-code font-bold text-slate-200">$1.708 <span class="text-[10px] text-slate-400">(Antigo)</span></td>
                  <td class="py-3.5 px-3 text-slate-300">Executou 1 linha antes do oráculo atualizar.</td>
                </tr>
                <tr class="bg-blue-950/60 border-l-4 border-l-cyan-400">
                  <td class="py-3.5 px-3 font-mono-code font-bold text-cyan-300">#10</td>
                  <td class="py-3.5 px-3 font-bold text-cyan-300">Nó Líder Chainlink (OCR)</td>
                  <td class="py-3.5 px-3 font-mono-code font-bold text-cyan-300">Grava $1.690</td>
                  <td class="py-3.5 px-3 text-cyan-100">Contrato valida mediana e altera o estado!</td>
                </tr>
                <tr class="bg-amber-950/50 border-l-4 border-l-amber-400">
                  <td class="py-3.5 px-3 font-mono-code font-bold text-amber-300">#11</td>
                  <td class="py-3.5 px-3 font-bold text-amber-300">Bot de OEV (Pagou +Gas)</td>
                  <td class="py-3.5 px-3 font-mono-code font-bold text-amber-300">$1.690 <span class="text-[10px]">(Novo)</span></td>
                  <td class="py-3.5 px-3 text-amber-100">Entra colado na #10 e liquida empréstimo com bônus!</td>
                </tr>
                <tr class="bg-slate-900/60">
                  <td class="py-3.5 px-3 font-mono-code text-slate-300">#12</td>
                  <td class="py-3.5 px-3 font-medium text-white">Pessoa 2 (Mesmo Bloco)</td>
                  <td class="py-3.5 px-3 font-mono-code font-bold text-emerald-400">$1.690 <span class="text-[10px]">(Novo)</span></td>
                  <td class="py-3.5 px-3 text-slate-300">Opera normalmente já com o preço atualizado.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p class="text-[11px] text-slate-400 mt-3 font-mono-code">
            Conclusão: duas pessoas no mesmo bloco só recebem valores diferentes se a transação da Chainlink ficar exatamente entre elas!
          </p>
        </div>
      </div>
    </section>
  `;
});
