/**
 * Central Reactive State Store for the Blockchain Oracle Educational Platform.
 * Supports localStorage persistence with memory fallback.
 * Follows interface contract defined in PROJECT.md.
 * Remediation implementation addressing all findings from auditor_m1_1 and challenger_m1_1.
 */

const STORAGE_KEY = 'oraculos_study_progress_v1';

const DEFAULT_CONCEPT_IDS = [
  'NODE_01', 'NODE_02', 'NODE_03', 'NODE_04', 'NODE_05',
  'NODE_06', 'NODE_07', 'NODE_08', 'NODE_09'
];

class Store {
  constructor() {
    this._state = {
      unlockedNodes: ['NODE_01'],
      completedNodes: [],
      teacherMode: false,
      selectedNodeId: null,
      filterLevel: 'all',
      filterDifficulty: 'all',
      searchQuery: ''
    };

    this._listeners = new Set();
    this._conceptsMap = new Map();
    this._manualUnlockedNodes = new Set();
    this._loadFromStorage();
  }

  /**
   * Register concepts definition for prerequisite calculations
   * @param {Array<{id: string, prerequisites: string[]}>} concepts
   */
  registerConcepts(concepts) {
    if (Array.isArray(concepts)) {
      this._conceptsMap.clear();
      concepts.forEach(c => {
        if (c && typeof c === 'object' && typeof c.id === 'string' && c.id.trim() !== '') {
          this._conceptsMap.set(c.id, {
            ...c,
            prerequisites: Array.isArray(c.prerequisites)
              ? c.prerequisites.filter(p => typeof p === 'string')
              : []
          });
        }
      });
      this._recalculateUnlockedNodes();
    }
  }

  /**
   * Returns a frozen copy of the current application state.
   * Deep freezes array properties (unlockedNodes, completedNodes).
   * @returns {Readonly<{
   *   unlockedNodes: readonly string[],
   *   completedNodes: readonly string[],
   *   teacherMode: boolean,
   *   selectedNodeId: string|null,
   *   filterLevel: string,
   *   filterDifficulty: string,
   *   searchQuery: string
   * }>}
   */
  getState() {
    return Object.freeze({
      unlockedNodes: Object.freeze([...this._state.unlockedNodes]),
      completedNodes: Object.freeze([...this._state.completedNodes]),
      teacherMode: Boolean(this._state.teacherMode),
      selectedNodeId: this._state.selectedNodeId,
      filterLevel: this._state.filterLevel,
      filterDifficulty: this._state.filterDifficulty,
      searchQuery: this._state.searchQuery
    });
  }

  /**
   * Subscribe to state updates.
   * @param {(state: ReturnType<Store['getState']>) => void} listener
   * @returns {() => void} Unsubscribe function
   */
  subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new TypeError('Subscriber listener must be a function');
    }
    this._listeners.add(listener);
    return () => {
      this._listeners.delete(listener);
    };
  }

  /**
   * Dispatch an action to alter state and notify subscribers.
   * Safely handles null, primitive, or malformed payloads.
   * @param {string} action
   * @param {Record<string, any>} [payload={}]
   */
  dispatch(action, payload = {}) {
    const safePayload = (payload !== null && typeof payload === 'object') ? payload : {};
    let stateChanged = false;

    switch (action) {
      case 'UNLOCK_NODE': {
        const nodeId = safePayload.nodeId;
        if (typeof nodeId === 'string' && nodeId.trim() !== '') {
          this._manualUnlockedNodes.add(nodeId);
          if (!this._state.unlockedNodes.includes(nodeId)) {
            this._recalculateUnlockedNodes();
            stateChanged = true;
          }
        }
        break;
      }

      case 'COMPLETE_NODE': {
        const nodeId = safePayload.nodeId;
        if (typeof nodeId === 'string' && nodeId.trim() !== '' && !this._state.completedNodes.includes(nodeId)) {
          this._state.completedNodes.push(nodeId);
          this._recalculateUnlockedNodes();
          stateChanged = true;
          this._saveToStorage();
        }
        break;
      }

      case 'UNCOMPLETE_NODE': {
        const nodeId = safePayload.nodeId;
        if (typeof nodeId === 'string' && this._state.completedNodes.includes(nodeId)) {
          this._state.completedNodes = this._state.completedNodes.filter(id => id !== nodeId);
          this._recalculateUnlockedNodes();
          stateChanged = true;
          this._saveToStorage();
        }
        break;
      }

      case 'SET_TEACHER_MODE': {
        const enabled = Boolean(safePayload.enabled);
        if (this._state.teacherMode !== enabled) {
          this._state.teacherMode = enabled;
          this._recalculateUnlockedNodes();
          stateChanged = true;
          this._saveToStorage();
        }
        break;
      }

      case 'SELECT_NODE': {
        const nodeId = (typeof safePayload.nodeId === 'string' && safePayload.nodeId.trim() !== '') ? safePayload.nodeId : null;
        if (this._state.selectedNodeId !== nodeId) {
          this._state.selectedNodeId = nodeId;
          stateChanged = true;
        }
        break;
      }

      case 'SET_FILTER': {
        const { key, value } = safePayload;
        if (key === 'level' && typeof value === 'string' && this._state.filterLevel !== value) {
          this._state.filterLevel = value;
          stateChanged = true;
        } else if (key === 'difficulty' && typeof value === 'string' && this._state.filterDifficulty !== value) {
          this._state.filterDifficulty = value;
          stateChanged = true;
        } else if (key === 'search') {
          const valStr = typeof value === 'string' ? value : (value == null ? '' : String(value));
          if (this._state.searchQuery !== valStr) {
            this._state.searchQuery = valStr;
            stateChanged = true;
          }
        }
        break;
      }

      case 'RESET_PROGRESS': {
        this._state.completedNodes = [];
        this._manualUnlockedNodes.clear();
        this._state.unlockedNodes = ['NODE_01'];
        this._recalculateUnlockedNodes();
        stateChanged = true;
        this._saveToStorage();
        break;
      }

      default:
        console.warn(`[Store] Unknown action dispatched: ${action}`);
        return;
    }

    if (stateChanged) {
      this._notify();
    }
  }

  /**
   * Recalculates unlocked nodes based on registered concept prerequisites,
   * manual unlocks, completed nodes, and Teacher Mode status.
   */
  _recalculateUnlockedNodes() {
    if (this._state.teacherMode) {
      const allConcepts = this._conceptsMap.size > 0
        ? Array.from(this._conceptsMap.keys())
        : [...DEFAULT_CONCEPT_IDS];
      this._state.unlockedNodes = allConcepts;
      return;
    }

    const unlocked = new Set(['NODE_01']);
    this._manualUnlockedNodes.forEach(id => unlocked.add(id));
    this._state.completedNodes.forEach(id => unlocked.add(id));

    if (this._conceptsMap.size > 0) {
      let addedAny = true;
      while (addedAny) {
        addedAny = false;
        for (const [id, concept] of this._conceptsMap.entries()) {
          if (!unlocked.has(id)) {
            const prereqs = concept.prerequisites || [];
            const allMet = prereqs.every(reqId => this._state.completedNodes.includes(reqId));
            if (allMet) {
              unlocked.add(id);
              addedAny = true;
            }
          }
        }
      }
    }

    this._state.unlockedNodes = Array.from(unlocked);
  }

  _notify() {
    const frozenState = this.getState();
    this._listeners.forEach(listener => {
      try {
        listener(frozenState);
      } catch (err) {
        console.error('[Store] Error in subscriber listener:', err);
      }
    });
  }

  _loadFromStorage() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed === 'object') {
            if (Array.isArray(parsed.completedNodes)) {
              this._state.completedNodes = parsed.completedNodes
                .filter(id => typeof id === 'string' && id.trim() !== '');
            }
            if (typeof parsed.teacherMode === 'boolean') {
              this._state.teacherMode = parsed.teacherMode;
            }
            this._recalculateUnlockedNodes();
          }
        }
      }
    } catch (err) {
      console.warn('[Store] Failed to load state from localStorage, falling back to memory:', err);
    }
  }

  _saveToStorage() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const payload = {
          completedNodes: this._state.completedNodes,
          teacherMode: this._state.teacherMode
        };
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      }
    } catch (err) {
      console.warn('[Store] Failed to save state to localStorage:', err);
    }
  }
}

export const store = new Store();
export default store;
