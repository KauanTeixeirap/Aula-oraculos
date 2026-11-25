window.OracleDeck = window.OracleDeck || {};

/**
 * Interactive HTTP Consensus Failure Simulator for Slide 04.
 * Starts completely empty with warning hidden until "Testar Consulta Simultânea" is clicked.
 */
window.OracleDeck.createHttpSimulator = function createHttpSimulator() {
  const getEls = () => ({
    time1: document.getElementById('sim-time-1'),
    time2: document.getElementById('sim-time-2'),
    val1: document.getElementById('sim-val-1'),
    val2: document.getElementById('sim-val-2'),
    diff1: document.getElementById('sim-diff-1'),
    diff2: document.getElementById('sim-diff-2'),
    emptyHint: document.getElementById('sim-empty-hint'),
    warning: document.getElementById('sim-warning'),
    resetBtn: document.getElementById('btn-sim-reset')
  });

  function reset() {
    const els = getEls();
    if (!els.val1) return;

    els.time1.textContent = 'Aguardando teste de consulta...';
    els.time2.textContent = 'Aguardando teste de consulta...';

    els.val1.textContent = '';
    els.val1.className =
      'font-mono-code text-base font-bold text-slate-500 bg-slate-900/60 px-3 py-1 rounded-lg border border-slate-800 min-w-[104px] h-9 flex items-center justify-center';

    els.val2.textContent = '';
    els.val2.className =
      'font-mono-code text-base font-bold text-slate-500 bg-slate-900/60 px-3 py-1 rounded-lg border border-slate-800 min-w-[104px] h-9 flex items-center justify-center';

    if (els.diff1) els.diff1.textContent = '';
    if (els.diff2) els.diff2.textContent = '';
    if (els.emptyHint) els.emptyHint.hidden = false;
    if (els.warning) els.warning.hidden = true;
    if (els.resetBtn) els.resetBtn.hidden = true;
  }

  function run() {
    const els = getEls();
    if (!els.val1) return;

    const baseRate = (window.OracleDeck.METRICS && window.OracleDeck.METRICS.market.usdBrlBase) || 5.91;
    const base = baseRate + Math.random() * 0.03;
    const val1Str = base.toFixed(4).replace('.', ',');
    const val2Str = (base + 0.0005 + Math.random() * 0.0014).toFixed(4).replace('.', ',');
    const ms = Math.floor(100 + Math.random() * 800);

    els.time1.textContent = `GET api.cambio/usd • t = 14:00:01.${ms}s`;
    els.time2.textContent = `GET api.cambio/usd • t = 14:00:01.${ms + 1}s (+1ms)`;

    els.val1.textContent = `R$ ${val1Str}`;
    els.val1.className =
      'font-mono-code text-base font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/30 min-w-[104px] h-9 flex items-center justify-center transition-colors';

    els.val2.textContent = `R$ ${val2Str}`;
    els.val2.className =
      'font-mono-code text-base font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/30 min-w-[104px] h-9 flex items-center justify-center transition-colors';

    if (els.diff1) els.diff1.textContent = val1Str;
    if (els.diff2) els.diff2.textContent = val2Str;
    if (els.emptyHint) els.emptyHint.hidden = true;
    if (els.warning) els.warning.hidden = false;
    if (els.resetBtn) els.resetBtn.hidden = false;
  }

  return { reset, run };
};
