window.OracleDeck = window.OracleDeck || {};
window.OracleDeck.SLIDES = window.OracleDeck.SLIDES || [];

window.OracleDeck.SLIDES.push(function renderSlide08LeaderToContract() {
  return `
    <section class="slide-view flex-col justify-between h-full" data-slide="7" data-steps="1">
      <div>
        <span class="font-mono-code text-xs text-cyan-400 uppercase tracking-widest">06 • Unificação e Validação On-Chain</span>
        <h2 class="text-3xl md:text-4xl font-bold text-white mt-1">Do Nó Líder até o Contrato Agregador na Ethereum</h2>
        <p class="text-slate-400 text-sm md:text-base mt-1">
          Como o Líder monta o pacote e o que o Smart Contract confere antes de gravar o preço no Bloco.
        </p>
      </div>

      <!-- 4 Step Connected Flow -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 my-auto">
        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <span class="w-8 h-8 rounded-lg bg-blue-600 text-white font-mono-code font-bold text-sm flex items-center justify-center mb-3">1</span>
            <h3 class="text-base font-bold text-white mb-2">Assinatura com Chave Privada</h3>
            <p class="text-xs text-slate-300 leading-relaxed">
              Cada nó envia seu preço ao Líder junto com uma <strong>assinatura digital criptográfica</strong> feita com sua chave privada exclusiva.
            </p>
          </div>
          <div class="mt-4 pt-2 border-t border-slate-800 font-mono-code text-[11px] text-cyan-400">
            Impede falsificação de nós
          </div>
        </div>

        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <span class="w-8 h-8 rounded-lg bg-blue-600 text-white font-mono-code font-bold text-sm flex items-center justify-center mb-3">2</span>
            <h3 class="text-base font-bold text-white mb-2">Array Ordenado &amp; Envio (Mempool)</h3>
            <p class="text-xs text-slate-300 leading-relaxed">
              Com no mínimo 21 assinaturas, o Líder organiza os preços em um <strong>array em ordem crescente</strong> e dispara <strong>1 transação</strong> para a fila da Mempool.
            </p>
          </div>
          <div class="mt-4 pt-2 border-t border-slate-800 font-mono-code text-[11px] text-cyan-400">
            [1699.9, 1700.0, 1700.2...]
          </div>
        </div>

        <div class="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <span class="w-8 h-8 rounded-lg bg-blue-600 text-white font-mono-code font-bold text-sm flex items-center justify-center mb-3">3</span>
            <h3 class="text-base font-bold text-white mb-2">Validação no Smart Contract</h3>
            <p class="text-xs text-slate-300 leading-relaxed">
              Quando entra no bloco, o <strong>Contrato Agregador</strong> verifica se as assinaturas são autênticas e confere se o array está ordenado.
            </p>
          </div>
          <div class="mt-4 pt-2 border-t border-slate-800 font-mono-code text-[11px] text-amber-400">
            Checagem 100% On-Chain
          </div>
        </div>

        <div class="bg-blue-950/60 border-2 border-cyan-400/60 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <span class="w-8 h-8 rounded-lg bg-cyan-400 text-slate-950 font-mono-code font-bold text-sm flex items-center justify-center mb-3">4</span>
            <h3 class="text-base font-bold text-white mb-2">Extração da Mediana &amp; Gravação</h3>
            <p class="text-xs text-slate-200 leading-relaxed">
              O contrato pega exatamente o <strong>valor do meio (Mediana)</strong> e grava o novo preço oficial na memória do <strong>Bloco da Blockchain</strong>.
            </p>
          </div>
          <div class="mt-4 pt-2 border-t border-blue-800 font-mono-code text-[11px] text-emerald-400">
            Imune a extremos/hackers!
          </div>
        </div>
      </div>

      <!-- Visual Median vs Average Callout -->
      <div class="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <i class="fa-solid fa-shield-virus text-emerald-400 text-xl"></i>
          <span class="text-xs md:text-sm text-slate-200">
            <strong>Por que Mediana e não Média?</strong> Se 1 nó for invadido e reportar <code class="text-red-400">$999.999</code>, a média quebraria; mas na <strong>Mediana</strong> ele fica na ponta do array e é 100% ignorado!
          </span>
        </div>
        <div class="font-mono-code text-xs bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
          [$1.699, $1.700, <strong class="text-emerald-400 underline">$1.700 (Mediana)</strong>, $1.701, <span class="text-red-400 line-through">$999.999</span>]
        </div>
      </div>
    </section>
  `;
});
