/**
 * Concept Detail Inspector Drawer Component.
 * Implements sliding modal dialog with full conceptual depth, mathematical models,
 * technical impact, didactic reflection questions, and completion actions.
 * Follows Modern Web Guidance for dialogs, light-dismiss, and accessibility.
 */

import { CONCEPTS_BY_ID } from '../data/concepts.js';
import store from '../state/store.js';
import notifications from './notifications.js';

class ConceptDrawer {
  constructor() {
    this._dialog = null;
    this._currentNodeId = null;
    this._lastFocusedElement = null;
  }

  init() {
    this._dialog = document.getElementById('concept-drawer');
    if (!this._dialog) {
      this._dialog = document.createElement('dialog');
      this._dialog.id = 'concept-drawer';
      this._dialog.className = 'concept-drawer';
      this._dialog.setAttribute('closedby', 'any');
      this._dialog.setAttribute('aria-labelledby', 'drawer-title');
      this._dialog.setAttribute('aria-modal', 'true');
      document.body.appendChild(this._dialog);
    }

    // Light-dismiss fallback for browsers without native `closedby="any"` support
    if (!('closedBy' in HTMLDialogElement.prototype)) {
      this._dialog.addEventListener('click', (event) => {
        if (event.target !== this._dialog) return;
        const rect = this._dialog.getBoundingClientRect();
        const isDialogContent = (
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width
        );
        if (!isDialogContent) {
          this.close();
        }
      });
    }

    // Handle ESC key or dialog close event
    this._dialog.addEventListener('close', () => {
      if (this._lastFocusedElement && typeof this._lastFocusedElement.focus === 'function') {
        this._lastFocusedElement.focus();
      }
    });
  }

  /**
   * Opens the drawer for a given concept ID.
   * @param {string} nodeId
   */
  open(nodeId) {
    if (!this._dialog) this.init();

    const concept = CONCEPTS_BY_ID.get(nodeId);
    if (!concept) {
      console.warn(`[Drawer] Concept not found for ID: ${nodeId}`);
      return;
    }

    this._currentNodeId = nodeId;
    this._lastFocusedElement = document.activeElement;

    this._renderContent(concept);

    if (this._dialog && !this._dialog.open) {
      if (typeof this._dialog.showModal === 'function') {
        this._dialog.showModal();
      } else {
        this._dialog.open = true;
      }
    }

    const closeBtn = (this._dialog && typeof this._dialog.querySelector === 'function')
      ? this._dialog.querySelector('.drawer-close-btn')
      : null;
    if (closeBtn && typeof closeBtn.focus === 'function') {
      closeBtn.focus();
    }
  }

  /**
   * Closes the drawer.
   */
  close() {
    if (this._dialog && this._dialog.open) {
      if (typeof this._dialog.close === 'function') {
        this._dialog.close();
      } else {
        this._dialog.open = false;
      }
    }
    this._currentNodeId = null;
  }

  /**
   * Re-renders drawer content if open
   */
  refresh() {
    if (this._dialog && this._dialog.open && this._currentNodeId) {
      const concept = CONCEPTS_BY_ID.get(this._currentNodeId);
      if (concept) {
        this._renderContent(concept);
      }
    }
  }

  _renderContent(concept) {
    const state = store.getState();
    const isCompleted = state.completedNodes.includes(concept.id);
    const isUnlocked = state.unlockedNodes.includes(concept.id) || state.teacherMode;

    const diffBadgeClass = {
      'Fundamento': 'badge-fundamento',
      'Intermediário': 'badge-intermediario',
      'Avançado': 'badge-avancado'
    }[concept.difficulty] || 'badge-fundamento';

    const statusBadge = isCompleted
      ? '<span class="badge badge-completed">✅ Concluído</span>'
      : (isUnlocked 
          ? '<span class="badge badge-unlocked">🔓 Disponível</span>' 
          : '<span class="badge badge-locked">🔒 Bloqueado</span>');

    const completionBtnText = isCompleted
      ? '✓ Concluído (Clique para Desmarcar)'
      : 'Marcar Tópico como Concluído';

    const completionBtnClass = isCompleted
      ? 'drawer-action-btn-primary'
      : 'drawer-action-btn-primary';

    const tagsHtml = (concept.tags || [])
      .map(tag => `<span class="drawer-tag-pill">#${tag}</span>`)
      .join('');

    this._dialog.innerHTML = `
      <header class="drawer-header">
        <div class="drawer-header-top">
          <div class="drawer-badges">
            <span class="badge ${diffBadgeClass}">${concept.difficulty}</span>
            ${statusBadge}
          </div>
          <button class="drawer-close-btn" aria-label="Fechar gaveta de detalhes">&times;</button>
        </div>
        <div>
          <span class="section-tag" style="margin-bottom: 0.25rem;">${concept.levelName}</span>
          <h2 id="drawer-title" class="drawer-title">${concept.title}</h2>
          <p class="drawer-subtitle">${concept.subtitle}</p>
        </div>
      </header>

      <div class="drawer-body">
        <section class="drawer-section">
          <h3 class="drawer-section-title">
            <span aria-hidden="true">📖</span> O Que É (Definição Técnica)
          </h3>
          <p class="drawer-text">${concept.coreConcept}</p>
        </section>

        <section class="drawer-section">
          <h3 class="drawer-section-title">
            <span aria-hidden="true">⚡</span> Impacto na Arquitetura Web3
          </h3>
          <p class="drawer-text">${concept.technicalImpact}</p>
        </section>

        ${concept.mathFormula ? `
        <section class="drawer-section">
          <h3 class="drawer-section-title">
            <span aria-hidden="true">📐</span> Formalização Matemática / Teorema
          </h3>
          <div class="drawer-card drawer-card-math">
            <div class="drawer-math-formula">${concept.mathFormula}</div>
            <p class="drawer-text" style="font-size: 0.82rem; margin-top: 0.25rem;">${concept.mathDescription || ''}</p>
          </div>
        </section>` : ''}

        <section class="drawer-section">
          <h3 class="drawer-section-title">
            <span aria-hidden="true">⚠️</span> Ponto Cego Típico (Gotchas)
          </h3>
          <div class="drawer-card drawer-card-pitfall">
            <p class="drawer-text" style="color: #fde68a;">${concept.pitfall}</p>
          </div>
        </section>

        <section class="drawer-section">
          <h3 class="drawer-section-title">
            <span aria-hidden="true">🎯</span> Questão Reflexiva para a Aula (05/10/2026)
          </h3>
          <div class="drawer-card drawer-card-question">
            <p class="drawer-text" style="color: #bae6fd; font-style: italic;">
              "${concept.didacticQuestion}"
            </p>
          </div>
        </section>

        ${concept.codePreview ? `
        <section class="drawer-section">
          <h3 class="drawer-section-title">
            <span aria-hidden="true">💻</span> Código / Exemplo Prático
          </h3>
          <pre class="drawer-code-block"><code>${escapeHtml(concept.codePreview)}</code></pre>
        </section>` : ''}

        <section class="drawer-section">
          <h3 class="drawer-section-title">
            <span aria-hidden="true">🏷️</span> Palavras-chave
          </h3>
          <div class="drawer-tags">${tagsHtml}</div>
        </section>
      </div>

      <footer class="drawer-footer">
        <button id="btn-toggle-completion" class="${completionBtnClass}">
          ${completionBtnText}
        </button>

        ${concept.simulationId ? `
        <button id="btn-drawer-sim" class="drawer-action-btn-sim">
          <span>🚀</span> ${concept.simulationLabel || 'Ver Simulação Interativa'}
        </button>` : ''}
      </footer>
    `;

    // Event Listeners inside drawer (defensively guarded for headless and real DOM)
    if (!this._dialog || typeof this._dialog.querySelector !== 'function') return;

    const closeBtn = this._dialog.querySelector('.drawer-close-btn');
    if (closeBtn && typeof closeBtn.addEventListener === 'function') {
      closeBtn.addEventListener('click', () => this.close());
    }

    const toggleBtn = this._dialog.querySelector('#btn-toggle-completion');
    if (toggleBtn && typeof toggleBtn.addEventListener === 'function') {
      toggleBtn.addEventListener('click', () => {
        if (isCompleted) {
          store.dispatch('UNCOMPLETE_NODE', { nodeId: concept.id });
          notifications.info(`Nó "${concept.title}" desmarcado.`);
        } else {
          store.dispatch('COMPLETE_NODE', { nodeId: concept.id });
          notifications.success(`Tópico "${concept.title}" concluído!`);
        }
        this.refresh();
      });
    }

    const simBtn = this._dialog.querySelector('#btn-drawer-sim');
    if (simBtn && typeof simBtn.addEventListener === 'function') {
      simBtn.addEventListener('click', () => {
        this.close();
        const targetSection = (typeof document !== 'undefined' && document.getElementById)
          ? document.getElementById(concept.simulationId)
          : null;
        if (targetSection && typeof targetSection.scrollIntoView === 'function') {
          targetSection.scrollIntoView({ behavior: 'smooth' });
        } else if (typeof window !== 'undefined') {
          window.location.hash = concept.simulationId;
        }
      });
    }
  }
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export const drawer = new ConceptDrawer();
export default drawer;
