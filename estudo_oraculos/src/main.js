/**
 * Application Entrypoint and Module Coordinator.
 * Initializes the reactive store, DAG tree engine, drawer, filters,
 * progress tracking, and accessibility shortcuts.
 */

import store from './state/store.js';
import { CONCEPTS } from './data/concepts.js';
import treeEngine from './tree/treeEngine.js';
import drawer from './ui/drawer.js';
import notifications from './ui/notifications.js';

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  // 1. Initialize Detail Drawer
  drawer.init();

  // 2. Initialize Concept Tree Engine
  const treeContainer = document.getElementById('tree-container');
  if (treeContainer) {
    treeEngine.init(treeContainer);
  }

  // 3. Setup Global Controls & Event Listeners
  setupTeacherMode();
  setupSearchFilter();
  setupLevelFilter();
  setupDifficultyFilter();
  setupResetProgress();
  setupNavigationTabs();
  setupKeyboardShortcuts();
  setupHashRouting();

  // 4. Subscribe to Store updates for global counters and progress
  store.subscribe((state) => {
    updateProgressUI(state);
    updateTeacherToggleUI(state);
  });

  // Initial sync
  updateProgressUI(store.getState());
  updateTeacherToggleUI(store.getState());
}

/* --------------------------------------------------------------------------
   Teacher Mode Control (F01 / F03)
   -------------------------------------------------------------------------- */
function setupTeacherMode() {
  const toggle = document.getElementById('teacher-mode-toggle');
  const wrap = document.getElementById('teacher-toggle-wrap');
  if (!toggle) return;

  const initialState = store.getState();
  toggle.checked = initialState.teacherMode;
  if (wrap) wrap.classList.toggle('active', initialState.teacherMode);

  toggle.addEventListener('change', (e) => {
    const isTeacher = e.target.checked;
    store.dispatch('SET_TEACHER_MODE', { enabled: isTeacher });
    if (wrap) wrap.classList.toggle('active', isTeacher);

    if (isTeacher) {
      notifications.info(
        'Modo Instrutor ativado: Todos os 9 conceitos e simulações estão desbloqueados para apresentação imediata.',
        '🎓 Modo Instrutor'
      );
    } else {
      notifications.info(
        'Modo Aluno ativado: Pré-requisitos restabelecidos. Conclua os tópicos na ordem pedagógica.',
        '🎒 Modo Aluno'
      );
    }
  });
}

function updateTeacherToggleUI(state) {
  const toggle = document.getElementById('teacher-mode-toggle');
  const wrap = document.getElementById('teacher-toggle-wrap');
  if (toggle && toggle.checked !== state.teacherMode) {
    toggle.checked = state.teacherMode;
  }
  if (wrap) {
    wrap.classList.toggle('active', state.teacherMode);
  }
}

/* --------------------------------------------------------------------------
   Search Filter with Debounce (F01 / F05)
   -------------------------------------------------------------------------- */
function setupSearchFilter() {
  const searchInput = document.getElementById('search-input');
  if (!searchInput) return;

  let debounceTimer = null;
  searchInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      store.dispatch('SET_FILTER', { key: 'search', value: e.target.value.trim() });
    }, 180);
  });
}

/* --------------------------------------------------------------------------
   Level Filter (F05)
   -------------------------------------------------------------------------- */
function setupLevelFilter() {
  const select = document.getElementById('filter-level');
  if (!select) return;

  select.addEventListener('change', (e) => {
    store.dispatch('SET_FILTER', { key: 'level', value: e.target.value });
  });
}

/* --------------------------------------------------------------------------
   Difficulty Filter Pills (F05)
   -------------------------------------------------------------------------- */
function setupDifficultyFilter() {
  const pillBtns = document.querySelectorAll('.difficulty-pills .pill-btn');
  if (!pillBtns.length) return;

  pillBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      pillBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-checked', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-checked', 'true');

      const difficulty = btn.getAttribute('data-difficulty') || 'all';
      store.dispatch('SET_FILTER', { key: 'difficulty', value: difficulty });
    });
  });
}

/* --------------------------------------------------------------------------
   Progress Tracking UI (F06)
   -------------------------------------------------------------------------- */
function updateProgressUI(state) {
  const totalNodes = CONCEPTS.length;
  const completedCount = (state.completedNodes || []).length;
  const percent = totalNodes > 0 ? Math.round((completedCount / totalNodes) * 100) : 0;

  const statEl = document.getElementById('progress-stat');
  const fillEl = document.getElementById('progress-bar-fill');
  const trackEl = document.getElementById('progress-track');

  if (statEl) {
    statEl.textContent = `${completedCount} / ${totalNodes} Concluídos (${percent}%)`;
  }
  if (fillEl) {
    fillEl.style.width = `${percent}%`;
  }
  if (trackEl) {
    trackEl.setAttribute('aria-valuenow', String(percent));
  }
}

/* --------------------------------------------------------------------------
   Reset Progress Action (F01 / F06)
   -------------------------------------------------------------------------- */
function setupResetProgress() {
  const resetBtn = document.getElementById('btn-reset-progress');
  if (!resetBtn) return;

  resetBtn.addEventListener('click', () => {
    const confirmed = window.confirm(
      'Tem certeza que deseja reiniciar o seu progresso de estudo?\nTodos os tópicos marcados como concluídos serão desmarcados.'
    );
    if (confirmed) {
      store.dispatch('RESET_PROGRESS', {});
      notifications.info('O seu progresso de estudo foi reiniciado com sucesso.', 'Progresso Zerado');
    }
  });
}

/* --------------------------------------------------------------------------
   Navigation Tabs
   -------------------------------------------------------------------------- */
function setupNavigationTabs() {
  const tabs = document.querySelectorAll('.nav-tab-item');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      const href = tab.getAttribute('href');
      if (href && href.startsWith('#')) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          tabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          target.scrollIntoView({ behavior: 'smooth' });
          history.pushState(null, '', href);
        }
      }
    });
  });
}

/* --------------------------------------------------------------------------
   Keyboard Shortcuts & Accessibility (F22)
   -------------------------------------------------------------------------- */
function setupKeyboardShortcuts() {
  window.addEventListener('keydown', (e) => {
    // Press '/' to quickly focus the search bar
    if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
      e.preventDefault();
      const searchInput = document.getElementById('search-input');
      if (searchInput) searchInput.focus();
    }
  });
}

/* --------------------------------------------------------------------------
   Deep-link Hash Routing
   -------------------------------------------------------------------------- */
function setupHashRouting() {
  function checkHash() {
    const hash = window.location.hash.replace('#', '');
    if (!hash) return;

    if (hash.startsWith('node:')) {
      const nodeId = hash.split(':')[1];
      if (nodeId) drawer.open(nodeId);
    } else if (hash.startsWith('NODE_')) {
      drawer.open(hash);
    }
  }

  window.addEventListener('hashchange', checkHash);
  checkHash();
}

export { initApp };
