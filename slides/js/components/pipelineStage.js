window.OracleDeck = window.OracleDeck || {};

/**
 * Controls Slide 06's unified 9-step morphing 3-level pipeline:
 *  0: Horizontal Overview
 *  1: Vertical Left Stack -> Level 1 (Corretoras)
 *  2..5: Vertical Left Stack -> Level 2 (4 bars: Coleta, VWAP, Profundidade, Wash Trading)
 *  6..8: Vertical Left Stack -> Level 3 (3 bars: Rede Off-Chain, Multi-Agregadores, Medianas)
 */
window.OracleDeck.createPipelineStage = function createPipelineStage() {
  const STEPS = [
    { mode: 'overview', level: 0, tab: 0, label: 'Visão Geral (1/9)' },
    { mode: 'deepdive', level: 1, tab: 0, label: 'Nível 1 • Corretoras (2/9)' },
    { mode: 'deepdive', level: 2, tab: 0, label: 'Nível 2 • Coleta (3/9)' },
    { mode: 'deepdive', level: 2, tab: 1, label: 'Nível 2 • VWAP (4/9)' },
    { mode: 'deepdive', level: 2, tab: 2, label: 'Nível 2 • Profundidade (5/9)' },
    { mode: 'deepdive', level: 2, tab: 3, label: 'Nível 2 • Wash Trading (6/9)' },
    { mode: 'deepdive', level: 3, tab: 0, label: 'Nível 3 • Rede Off-Chain (7/9)' },
    { mode: 'deepdive', level: 3, tab: 1, label: 'Nível 3 • Multi-Agregadores (8/9)' },
    { mode: 'deepdive', level: 3, tab: 2, label: 'Nível 3 • Medianas (9/9)' }
  ];

  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let currentMode = 'overview';
  let currentStep = 0;
  let slideActive = false;
  let activeTransition = null;

  const l2FanIn = window.OracleDeck.createFlowPathAnimator('svg-l2-fanin', '#38bdf8');
  const l3FanIn = window.OracleDeck.createFlowPathAnimator('svg-l3-fanin', '#fbbf24');

  function syncFlowAnimators(stepIdx) {
    if (slideActive && stepIdx === 2) l2FanIn.start();
    else l2FanIn.stop();

    if (slideActive && stepIdx === 7) l3FanIn.start();
    else l3FanIn.stop();
  }

  function applyCardStyles(level, mode) {
    const configs = [
      {
        id: 'pipe-card-l1',
        n: 1,
        activeClass:
          'pipe-level-card cursor-pointer bg-gradient-to-br from-cyan-950/80 to-slate-900 border-2 border-cyan-400 rounded-2xl p-4 shadow-lg shadow-cyan-500/15 is-active',
        idleClass:
          'pipe-level-card cursor-pointer bg-slate-900 border border-slate-700 hover:border-cyan-500/60 rounded-2xl p-4',
        dimmedClass:
          'pipe-level-card cursor-pointer bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-4 is-inactive'
      },
      {
        id: 'pipe-card-l2',
        n: 2,
        activeClass:
          'pipe-level-card cursor-pointer bg-gradient-to-br from-blue-950/80 to-slate-900 border-2 border-blue-400 rounded-2xl p-4 shadow-lg shadow-blue-500/15 is-active',
        idleClass:
          'pipe-level-card cursor-pointer bg-slate-900 border border-slate-700 hover:border-blue-500/60 rounded-2xl p-4',
        dimmedClass:
          'pipe-level-card cursor-pointer bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 rounded-2xl p-4 is-inactive'
      },
      {
        id: 'pipe-card-l3',
        n: 3,
        activeClass:
          'pipe-level-card cursor-pointer bg-gradient-to-br from-amber-950/70 to-slate-900 border-2 border-amber-400 rounded-2xl p-4 shadow-lg shadow-amber-500/15 is-active',
        idleClass:
          'pipe-level-card cursor-pointer bg-slate-900 border border-slate-700 hover:border-amber-500/60 rounded-2xl p-4',
        dimmedClass:
          'pipe-level-card cursor-pointer bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-4 is-inactive'
      }
    ];

    configs.forEach(({ id, n, activeClass, idleClass, dimmedClass }) => {
      const card = document.getElementById(id);
      if (!card) return;
      if (mode === 'overview') {
        card.className = n === 1 ? activeClass.replace(' is-active', '') : idleClass;
      } else {
        card.className = level === n ? activeClass : dimmedClass;
      }
    });
  }

  function applyDOMState(stepIdx) {
    const spec = STEPS[stepIdx] || STEPS[0];
    const workspace = document.getElementById('pipe-workspace');
    const overviewBtn = document.getElementById('btn-pipe-overview');
    const modePill = document.getElementById('pipe-mode-pill');

    if (!workspace) return;

    workspace.dataset.mode = spec.mode;
    workspace.dataset.activeLevel = String(spec.level);

    if (overviewBtn) overviewBtn.hidden = spec.mode === 'overview';
    if (modePill) modePill.textContent = spec.label;

    applyCardStyles(spec.level, spec.mode);

    // Toggle main level panes inside #pipe-detail-stage
    const panes = {
      0: document.getElementById('pipe-pane-overview'),
      1: document.getElementById('pipe-pane-l1'),
      2: document.getElementById('pipe-pane-l2'),
      3: document.getElementById('pipe-pane-l3')
    };

    Object.entries(panes).forEach(([lvl, el]) => {
      if (!el) return;
      el.hidden = Number(lvl) !== spec.level;
    });

    // Level 2: 4 top bars
    if (spec.level === 2) {
      for (let i = 0; i < 4; i++) {
        const bar = document.getElementById(`l2-bar-${i}`);
        const sub = document.getElementById(`l2-sub-${i}`);
        const isCurrent = i === spec.tab;
        if (sub) sub.hidden = !isCurrent;
        if (bar) {
          bar.setAttribute('aria-selected', String(isCurrent));
          bar.className = isCurrent
            ? 'pipe-bar-btn is-active text-left p-2.5 rounded-xl border-2 border-cyan-400 bg-blue-950/70 shadow-lg shadow-cyan-500/10'
            : 'pipe-bar-btn is-inactive text-left p-2.5 rounded-xl border border-slate-800 bg-slate-950/75 hover:border-slate-700';
        }
      }
    }

    // Level 3: 3 top bars
    if (spec.level === 3) {
      for (let i = 0; i < 3; i++) {
        const bar = document.getElementById(`l3-bar-${i}`);
        const sub = document.getElementById(`l3-sub-${i}`);
        const isCurrent = i === spec.tab;
        if (sub) sub.hidden = !isCurrent;
        if (bar) {
          bar.setAttribute('aria-selected', String(isCurrent));
          bar.className = isCurrent
            ? 'pipe-bar-btn is-active text-left p-2.5 rounded-xl border-2 border-amber-400 bg-amber-950/45 shadow-lg shadow-amber-500/10'
            : 'pipe-bar-btn is-inactive text-left p-2.5 rounded-xl border border-slate-800 bg-slate-950/75 hover:border-slate-700';
        }
      }
    }

    currentMode = spec.mode;
    currentStep = stepIdx;
    syncFlowAnimators(stepIdx);
  }

  function clearTransitionNames() {
    ['pipe-card-l1', 'pipe-card-l2', 'pipe-card-l3'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.style.viewTransitionName = '';
    });
  }

  function update(stepIdx, allowMorph = true) {
    const spec = STEPS[stepIdx] || STEPS[0];
    const shouldMorph =
      allowMorph &&
      slideActive &&
      spec.mode !== currentMode &&
      typeof document.startViewTransition === 'function' &&
      !reducedMotionQuery.matches;

    if (!shouldMorph) {
      applyDOMState(stepIdx);
      return;
    }

    if (activeTransition && typeof activeTransition.skipTransition === 'function') {
      activeTransition.skipTransition();
    }

    ['pipe-card-l1', 'pipe-card-l2', 'pipe-card-l3'].forEach((id, idx) => {
      const el = document.getElementById(id);
      if (el) el.style.viewTransitionName = `pipe-card-${idx + 1}`;
    });

    const vt = document.startViewTransition(() => {
      applyDOMState(stepIdx);
    });
    activeTransition = vt;
    vt.finished.finally(() => {
      clearTransitionNames();
      if (activeTransition === vt) activeTransition = null;
    });
  }

  return {
    getStepLabel(stepIdx) {
      return (STEPS[stepIdx] || STEPS[0]).label;
    },
    setActive(active) {
      slideActive = active;
      syncFlowAnimators(currentStep);
    },
    update
  };
};
