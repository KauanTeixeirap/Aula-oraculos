/**
 * Interactive DAG Tree Engine for Concept Dependency Graph.
 * Renders Levels 0 through 4 with responsive SVG cubic bezier connectors,
 * prerequisite locking enforcement, teacher mode bypass, and live filters.
 * Follows interface contracts defined in PROJECT.md.
 */

import { CONCEPTS, CONCEPTS_BY_ID, LEVELS } from '../data/concepts.js';
import store from '../state/store.js';
import drawer from '../ui/drawer.js';
import notifications from '../ui/notifications.js';

/**
 * Normalizes strings by removing diacritics, trimming whitespace, and converting to lowercase.
 * Safely handles null, undefined, numeric, and non-string types.
 * @param {*} val
 * @returns {string}
 */
function normalizeSearchText(val) {
  if (val == null) return '';
  return String(val)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

class TreeEngine {
  constructor() {
    this._container = null;
    this._svgLayer = null;
    this._canvas = null;
    this._nodeElements = new Map();
    this._resizeObserver = null;
    this._unsubscribeStore = null;
  }

  /**
   * Initializes the tree engine in the specified container element.
   * @param {HTMLElement} container
   */
  init(container) {
    if (!container) {
      console.error('[TreeEngine] Container element is required for initialization.');
      return;
    }

    this._container = container;
    store.registerConcepts(CONCEPTS);

    this._renderShell();
    this._setupResizeListeners();

    // Subscribe to reactive store changes
    this._unsubscribeStore = store.subscribe(() => {
      this.updateState();
    });

    this.updateState();
  }

  /**
   * Dispatches node selection and opens the detail drawer.
   * Interface contract: onNodeClick(nodeId)
   * @param {string} nodeId
   */
  onNodeClick(nodeId) {
    store.dispatch('SELECT_NODE', { nodeId });
    drawer.open(nodeId);
  }

  /**
   * Evaluates prerequisite status for a given node.
   * Interface contract: getPrerequisitesStatus(nodeId)
   * @param {string} nodeId
   * @returns {{ isUnlocked: boolean, missingPrereqs: string[] }}
   */
  getPrerequisitesStatus(nodeId) {
    const concept = CONCEPTS_BY_ID.get(nodeId);
    if (!concept) {
      return { isUnlocked: false, missingPrereqs: [] };
    }

    const state = store.getState();
    if (state.teacherMode) {
      return { isUnlocked: true, missingPrereqs: [] };
    }

    const prereqs = concept.prerequisites || [];
    const missing = prereqs.filter(reqId => !state.completedNodes.includes(reqId));

    return {
      isUnlocked: missing.length === 0,
      missingPrereqs: missing
    };
  }

  /**
   * Builds the DOM skeleton for the 5-level graph and SVG connector canvas
   */
  _renderShell() {
    this._container.innerHTML = `
      <div class="tree-viewport-container">
        <div class="tree-canvas" id="tree-canvas">
          <svg class="tree-svg-layer" id="tree-svg-layer" aria-hidden="true"></svg>
          ${LEVELS.map(lvl => `
            <div class="tree-level-column" data-level="${lvl.level}">
              <header class="level-column-header">
                <span class="level-tag">Nível ${lvl.level}</span>
                <h3 class="level-title">${lvl.title.split(': ')[1] || lvl.title}</h3>
              </header>
              <div class="level-nodes-stack">
                ${lvl.nodes.map(nodeId => {
                  const c = CONCEPTS_BY_ID.get(nodeId);
                  return this._createNodeCardMarkup(c);
                }).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="tree-legend">
        <div class="legend-item">
          <span class="legend-dot legend-dot-unlocked" aria-hidden="true"></span>
          <span>Desbloqueado / Disponível</span>
        </div>
        <div class="legend-item">
          <span class="legend-dot legend-dot-completed" aria-hidden="true"></span>
          <span>Concluído</span>
        </div>
        <div class="legend-item">
          <span class="legend-dot legend-dot-locked" aria-hidden="true"></span>
          <span>Bloqueado (Requer Pré-requisitos)</span>
        </div>
        <div class="legend-item">
          <span class="legend-dot legend-dot-teacher" aria-hidden="true"></span>
          <span>Modo Instrutor Ativo (Bypass Geral)</span>
        </div>
      </div>
    `;

    this._canvas = this._container.querySelector('#tree-canvas');
    this._svgLayer = this._container.querySelector('#tree-svg-layer');

    // Cache node DOM elements and attach listeners
    this._nodeElements.clear();
    CONCEPTS.forEach(concept => {
      const el = this._container.querySelector(`[data-node-id="${concept.id}"]`);
      if (el) {
        this._nodeElements.set(concept.id, el);

        el.addEventListener('click', () => this._handleCardClick(concept.id));
        el.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this._handleCardClick(concept.id);
          }
        });
      }
    });
  }

  _createNodeCardMarkup(concept) {
    const diffBadgeClass = {
      'Fundamento': 'badge-fundamento',
      'Intermediário': 'badge-intermediario',
      'Avançado': 'badge-avancado'
    }[concept.difficulty] || 'badge-fundamento';

    return `
      <article
        class="concept-node-card"
        data-node-id="${concept.id}"
        data-level="${concept.level}"
        data-difficulty="${concept.difficulty}"
        tabindex="0"
        role="button"
        aria-label="${concept.title} (${concept.levelName})"
      >
        <header class="node-card-header">
          <span class="node-id-badge">${concept.id}</span>
          <span class="badge ${diffBadgeClass}">${concept.difficulty}</span>
        </header>

        <h4 class="node-card-title">${concept.title}</h4>
        <p class="node-card-desc">${concept.subtitle}</p>

        <footer class="node-card-footer">
          <span class="node-status-pill">
            <span class="status-icon" aria-hidden="true">🔒</span>
            <span class="status-label">Carregando...</span>
          </span>
          <span class="node-prereq-badge" style="display: none;">Pré-requisito pendente</span>
        </footer>
      </article>
    `;
  }

  _handleCardClick(nodeId) {
    const status = this.getPrerequisitesStatus(nodeId);
    const state = store.getState();

    if (status.isUnlocked || state.teacherMode) {
      this.onNodeClick(nodeId);
    } else {
      const missingTitles = status.missingPrereqs
        .map(id => CONCEPTS_BY_ID.get(id)?.title || id)
        .join(', ');
      notifications.warning(
        `Este conceito requer a conclusão prévia de: ${missingTitles}. Complete os tópicos anteriores ou ative o Modo Instrutor no topo.`,
        'Tópico Bloqueado'
      );
    }
  }

  /**
   * Updates CSS classes, state pills, and recalculates connectors based on store state
   */
  updateState() {
    const state = store.getState();
    const query = normalizeSearchText(state.searchQuery);
    const filterLvl = state.filterLevel;
    const filterDiff = state.filterDifficulty;

    const safeFilterLvl = filterLvl != null ? String(filterLvl).trim().toLowerCase() : '';
    const safeFilterDiff = normalizeSearchText(filterDiff);

    CONCEPTS.forEach(concept => {
      const el = this._nodeElements.get(concept.id);
      if (!el) return;

      const isCompleted = state.completedNodes.includes(concept.id);
      const isUnlocked = state.unlockedNodes.includes(concept.id) || state.teacherMode;
      const isSelected = state.selectedNodeId === concept.id;

      // Safe filter check (type-guarded and diacritic-normalized)
      const matchesLevel = !safeFilterLvl || safeFilterLvl === 'all' || String(concept.level) === safeFilterLvl;
      const matchesDiff = !safeFilterDiff || safeFilterDiff === 'all' || normalizeSearchText(concept.difficulty) === safeFilterDiff;
      const matchesSearch = !query ||
        normalizeSearchText(concept.title).includes(query) ||
        normalizeSearchText(concept.subtitle).includes(query) ||
        (Array.isArray(concept.tags) && concept.tags.some(t => normalizeSearchText(t).includes(query))) ||
        normalizeSearchText(concept.coreConcept).includes(query);

      const isVisible = matchesLevel && matchesDiff && matchesSearch;

      // Class toggles
      el.classList.toggle('status-completed', isCompleted);
      el.classList.toggle('status-unlocked', !isCompleted && isUnlocked);
      el.classList.toggle('status-locked', !isCompleted && !isUnlocked);
      el.classList.toggle('is-selected', isSelected);
      el.classList.toggle('is-dimmed', !isVisible);

      // Status pill update
      const statusIcon = el.querySelector('.status-icon');
      const statusLabel = el.querySelector('.status-label');
      const prereqBadge = el.querySelector('.node-prereq-badge');

      if (isCompleted) {
        if (statusIcon) statusIcon.textContent = '✅';
        if (statusLabel) statusLabel.textContent = 'Concluído';
        if (prereqBadge) prereqBadge.style.display = 'none';
      } else if (isUnlocked) {
        if (statusIcon) statusIcon.textContent = '🔓';
        if (statusLabel) statusLabel.textContent = state.teacherMode ? 'Livre (Instrutor)' : 'Disponível';
        if (prereqBadge) prereqBadge.style.display = 'none';
      } else {
        if (statusIcon) statusIcon.textContent = '🔒';
        if (statusLabel) statusLabel.textContent = 'Bloqueado';
        if (prereqBadge) prereqBadge.style.display = 'inline-block';
      }
    });

    this._drawConnectors();
  }

  /**
   * Recalculates and renders SVG cubic bezier lines connecting nodes
   */
  _drawConnectors() {
    if (!this._svgLayer || !this._canvas) return;

    const state = store.getState();
    const canvasRect = this._canvas.getBoundingClientRect();
    const paths = [];

    CONCEPTS.forEach(targetConcept => {
      const targetEl = this._nodeElements.get(targetConcept.id);
      if (!targetEl) return;

      const targetRect = targetEl.getBoundingClientRect();
      const targetX = targetRect.left - canvasRect.left;
      const targetY = targetRect.top - canvasRect.top + targetRect.height / 2;

      const targetDimmed = targetEl.classList.contains('is-dimmed');

      (targetConcept.prerequisites || []).forEach(sourceId => {
        const sourceEl = this._nodeElements.get(sourceId);
        if (!sourceEl) return;

        const sourceRect = sourceEl.getBoundingClientRect();
        const sourceX = sourceRect.right - canvasRect.left;
        const sourceY = sourceRect.top - canvasRect.top + sourceRect.height / 2;

        const sourceCompleted = state.completedNodes.includes(sourceId);
        const targetUnlocked = state.unlockedNodes.includes(targetConcept.id) || state.teacherMode;
        const targetCompleted = state.completedNodes.includes(targetConcept.id);

        let connectorState = 'locked';
        if (targetCompleted && sourceCompleted) {
          connectorState = 'completed';
        } else if (targetUnlocked) {
          connectorState = 'unlocked';
        }

        const sourceDimmed = sourceEl.classList.contains('is-dimmed');
        const isDimmed = targetDimmed || sourceDimmed;

        // Cubic Bezier curve control points
        const deltaX = Math.max(30, (targetX - sourceX) * 0.5);
        const cx1 = sourceX + deltaX;
        const cy1 = sourceY;
        const cx2 = targetX - deltaX;
        const cy2 = targetY;

        const d = `M ${sourceX} ${sourceY} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${targetX} ${targetY}`;

        paths.push(`
          <path
            d="${d}"
            class="tree-connector state-${connectorState} ${isDimmed ? 'is-dimmed' : ''}"
            data-from="${sourceId}"
            data-to="${targetConcept.id}"
          />
        `);
      });
    });

    this._svgLayer.innerHTML = paths.join('');
  }

  _setupResizeListeners() {
    if (typeof ResizeObserver !== 'undefined' && this._canvas) {
      this._resizeObserver = new ResizeObserver(() => {
        this._drawConnectors();
      });
      this._resizeObserver.observe(this._canvas);
    }

    window.addEventListener('resize', () => {
      this._drawConnectors();
    });
  }

  destroy() {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
    }
    if (this._unsubscribeStore) {
      this._unsubscribeStore();
    }
  }
}

export const treeEngine = new TreeEngine();
export default treeEngine;
