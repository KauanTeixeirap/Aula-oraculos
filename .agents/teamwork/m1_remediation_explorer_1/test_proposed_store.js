/**
 * Verification test for proposed store.js remediation
 * Runs all 29 adversarial stress assertions from test/stress_store.js
 */

const STORAGE_KEY = 'oraculos_study_progress_v1';
const DEFAULT_CONCEPT_IDS = [
  'NODE_01', 'NODE_02', 'NODE_03', 'NODE_04', 'NODE_05',
  'NODE_06', 'NODE_07', 'NODE_08', 'NODE_09'
];

class ProposedStore {
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

  subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new TypeError('Subscriber listener must be a function');
    }
    this._listeners.add(listener);
    return () => {
      this._listeners.delete(listener);
    };
  }

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
        if (key === 'level' && this._state.filterLevel !== value) {
          this._state.filterLevel = value;
          stateChanged = true;
        } else if (key === 'difficulty' && this._state.filterDifficulty !== value) {
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

// -------------------------------------------------------------
// Test harness replicating stress_store.js
// -------------------------------------------------------------
let memoryStorage = {};
const mockLocalStorage = {
  getItem: (key) => (Object.prototype.hasOwnProperty.call(memoryStorage, key) ? memoryStorage[key] : null),
  setItem: (key, val) => {
    if (mockLocalStorage._throwOnSet) {
      throw new Error('QuotaExceededError: DOMException quota exceeded');
    }
    memoryStorage[key] = String(val);
  },
  removeItem: (key) => { delete memoryStorage[key]; },
  clear: () => { memoryStorage = {}; },
  _throwOnSet: false
};

globalThis.window = { localStorage: mockLocalStorage };

const store = new ProposedStore();
const SAMPLE_CONCEPTS = [
  { id: 'NODE_01', level: 0, prerequisites: [] },
  { id: 'NODE_02', level: 1, prerequisites: ['NODE_01'] },
  { id: 'NODE_03', level: 2, prerequisites: ['NODE_02'] },
  { id: 'NODE_04', level: 2, prerequisites: ['NODE_02'] },
  { id: 'NODE_05', level: 3, prerequisites: ['NODE_03', 'NODE_04'] },
  { id: 'NODE_06', level: 3, prerequisites: ['NODE_05'] },
  { id: 'NODE_07', level: 3, prerequisites: ['NODE_05'] },
  { id: 'NODE_08', level: 4, prerequisites: ['NODE_06'] },
  { id: 'NODE_09', level: 4, prerequisites: ['NODE_07', 'NODE_08'] }
];

const testResults = [];

function runTest(category, name, fn) {
  try {
    fn();
    testResults.push({ category, name, passed: true, error: null });
    console.log(`  ✔ [PASS] ${category} > ${name}`);
  } catch (err) {
    testResults.push({ category, name, passed: false, error: err });
    console.log(`  ❌ [FAIL] ${category} > ${name}`);
    console.log(`     Error: ${err.message || err}`);
  }
}

async function runAsyncTest(category, name, fn) {
  try {
    await fn();
    testResults.push({ category, name, passed: true, error: null });
    console.log(`  ✔ [PASS] ${category} > ${name}`);
  } catch (err) {
    testResults.push({ category, name, passed: false, error: err });
    console.log(`  ❌ [FAIL] ${category} > ${name}`);
    console.log(`     Error: ${err.message || err}`);
  }
}

function resetStore() {
  mockLocalStorage.clear();
  mockLocalStorage._throwOnSet = false;
  store.dispatch('RESET_PROGRESS');
  store.dispatch('SET_TEACHER_MODE', { enabled: false });
  store.dispatch('SET_FILTER', { key: 'level', value: 'all' });
  store.dispatch('SET_FILTER', { key: 'difficulty', value: 'all' });
  store.dispatch('SET_FILTER', { key: 'search', value: '' });
  store.dispatch('SELECT_NODE', { nodeId: null });
  store.registerConcepts(SAMPLE_CONCEPTS);
}

// Run the 29 stress tests
runTest('CAT1: Malformed Payloads', 'dispatch UNKNOWN_ACTION does not crash', () => {
  resetStore();
  store.dispatch('UNKNOWN_ACTION_999', { foo: 'bar' });
  const s = store.getState();
  if (!s || !s.unlockedNodes) throw new Error('State corrupted');
});

runTest('CAT1: Malformed Payloads', 'dispatch UNLOCK_NODE with null payload does not crash', () => {
  resetStore();
  store.dispatch('UNLOCK_NODE', null);
});

runTest('CAT1: Malformed Payloads', 'dispatch COMPLETE_NODE with null payload does not crash', () => {
  resetStore();
  store.dispatch('COMPLETE_NODE', null);
});

runTest('CAT1: Malformed Payloads', 'dispatch UNCOMPLETE_NODE with null payload does not crash', () => {
  resetStore();
  store.dispatch('UNCOMPLETE_NODE', null);
});

runTest('CAT1: Malformed Payloads', 'dispatch SET_TEACHER_MODE with null payload does not crash', () => {
  resetStore();
  store.dispatch('SET_TEACHER_MODE', null);
});

runTest('CAT1: Malformed Payloads', 'dispatch SELECT_NODE with null payload does not crash', () => {
  resetStore();
  store.dispatch('SELECT_NODE', null);
});

runTest('CAT1: Malformed Payloads', 'dispatch SET_FILTER with null payload does not crash', () => {
  resetStore();
  store.dispatch('SET_FILTER', null);
});

runTest('CAT1: Malformed Payloads', 'dispatch non-string action types (null, number, object)', () => {
  resetStore();
  store.dispatch(null);
  store.dispatch(12345);
  store.dispatch({});
  store.dispatch([]);
});

runTest('CAT1: Malformed Payloads', 'dispatch UNLOCK_NODE with primitive/object nodeId types', () => {
  resetStore();
  store.dispatch('UNLOCK_NODE', { nodeId: 12345 });
  store.dispatch('UNLOCK_NODE', { nodeId: {} });
  store.dispatch('UNLOCK_NODE', { nodeId: true });
  const s = store.getState();
  if (s.unlockedNodes.includes(12345) || s.unlockedNodes.includes(true)) {
    throw new Error('store accepted non-string nodeId into unlockedNodes: ' + JSON.stringify(s.unlockedNodes));
  }
});

runTest('CAT1: Malformed Payloads', 'subscribe with non-function throws clean TypeError', () => {
  resetStore();
  let threw = false;
  try {
    store.subscribe(null);
  } catch (e) {
    if (e instanceof TypeError) threw = true;
  }
  if (!threw) throw new Error('Expected subscribe(null) to throw TypeError');
});

runTest('CAT1: Malformed Payloads', 'registerConcepts with malformed concepts (null, non-array, missing fields)', () => {
  resetStore();
  store.registerConcepts(null);
  store.registerConcepts('not_an_array');
  store.registerConcepts([null, { id: 'MALFORMED', prerequisites: null }]);
});

runTest('CAT2: Storage Corruption', 'Corrupted unparseable JSON in localStorage does not crash _loadFromStorage', () => {
  mockLocalStorage.setItem('oraculos_study_progress_v1', '{ invalid json : missing quotes [}');
  store._loadFromStorage();
  const s = store.getState();
  if (!Array.isArray(s.unlockedNodes)) throw new Error('State uninitialized after corrupted JSON');
});

runTest('CAT2: Storage Corruption', 'JSON with primitive values ("null", "123", "\"str\"") in localStorage', () => {
  mockLocalStorage.setItem('oraculos_study_progress_v1', 'null');
  store._loadFromStorage();
  mockLocalStorage.setItem('oraculos_study_progress_v1', '12345');
  store._loadFromStorage();
  mockLocalStorage.setItem('oraculos_study_progress_v1', '"just a string"');
  store._loadFromStorage();
});

runTest('CAT2: Storage Corruption', 'JSON with corrupted array elements (e.g. objects, nulls, numbers in completedNodes)', () => {
  resetStore();
  mockLocalStorage.setItem('oraculos_study_progress_v1', JSON.stringify({
    completedNodes: [null, 9999, { evil: true }, 'NODE_02'],
    teacherMode: 'not_a_boolean'
  }));
  store._loadFromStorage();
  const s = store.getState();
  const hasBadTypes = s.completedNodes.some(x => typeof x !== 'string');
  if (hasBadTypes) {
    throw new Error('completedNodes loaded invalid non-string types: ' + JSON.stringify(s.completedNodes));
  }
});

runTest('CAT2: Storage Corruption', 'LocalStorage quota exceeded (DOMException) does not crash state dispatch', () => {
  resetStore();
  mockLocalStorage._throwOnSet = true;
  store.dispatch('COMPLETE_NODE', { nodeId: 'NODE_01' });
  const s = store.getState();
  if (!s.completedNodes.includes('NODE_01')) {
    throw new Error('Memory state did not update when storage threw quota error');
  }
  mockLocalStorage._throwOnSet = false;
});

runTest('CAT3: Frozen State', 'getState() returns a frozen root object', () => {
  resetStore();
  const s = store.getState();
  if (!Object.isFrozen(s)) throw new Error('getState() root object is NOT frozen');
});

runTest('CAT3: Frozen State', 'Direct mutation on root properties throws or is ignored without modifying store', () => {
  resetStore();
  const s = store.getState();
  try { s.teacherMode = true; } catch (e) {}
  if (store.getState().teacherMode === true) {
    throw new Error('Direct mutation on state.teacherMode altered store internal state!');
  }
});

runTest('CAT3: Frozen State', 'Deep freeze: state.unlockedNodes is frozen', () => {
  resetStore();
  const s = store.getState();
  if (!Object.isFrozen(s.unlockedNodes)) {
    throw new Error('state.unlockedNodes is NOT frozen (shallow freeze vulnerability)');
  }
});

runTest('CAT3: Frozen State', 'Deep freeze: state.completedNodes is frozen', () => {
  resetStore();
  const s = store.getState();
  if (!Object.isFrozen(s.completedNodes)) {
    throw new Error('state.completedNodes is NOT frozen (shallow freeze vulnerability)');
  }
});

runTest('CAT3: Frozen State', 'External mutation on unlockedNodes array does NOT mutate store internal state', () => {
  resetStore();
  const s = store.getState();
  try { s.unlockedNodes.push('HACKED_NODE'); } catch (e) {}
  const freshState = store.getState();
  if (freshState.unlockedNodes.includes('HACKED_NODE')) {
    throw new Error('External push to unlockedNodes mutated store internal state!');
  }
});

runTest('CAT4: Concurrency & Stress', '1,000 rapid sequential dispatches maintain state consistency', () => {
  resetStore();
  for (let i = 0; i < 1000; i++) {
    const action = i % 4 === 0 ? 'SET_FILTER' :
                   i % 4 === 1 ? 'SELECT_NODE' :
                   i % 4 === 2 ? 'SET_TEACHER_MODE' : 'UNLOCK_NODE';
    const payload = i % 4 === 0 ? { key: 'search', value: `query_${i}` } :
                    i % 4 === 1 ? { nodeId: `NODE_${i}` } :
                    i % 4 === 2 ? { enabled: i % 2 === 0 } :
                    { nodeId: `NODE_0${(i % 9) + 1}` };
    store.dispatch(action, payload);
  }
  const s = store.getState();
  if (typeof s.searchQuery !== 'string' || typeof s.teacherMode !== 'boolean') {
    throw new Error('State corrupted after 1,000 dispatches');
  }
});

await runAsyncTest('CAT4: Concurrency & Stress', '1,000 concurrent async dispatches resolve cleanly', async () => {
  resetStore();
  const promises = [];
  for (let i = 0; i < 1000; i++) {
    promises.push(
      new Promise((resolve) => {
        setTimeout(() => {
          store.dispatch('SET_FILTER', { key: 'search', value: `async_${i}` });
          resolve();
        }, Math.random() * 10);
      })
    );
  }
  await Promise.all(promises);
  const s = store.getState();
  if (!s.searchQuery.startsWith('async_')) {
    throw new Error('Unexpected searchQuery after concurrent async burst: ' + s.searchQuery);
  }
});

runTest('CAT4: Concurrency & Stress', 'A throwing subscriber listener does not block subsequent listeners', () => {
  resetStore();
  let listener2Called = false;
  const unsub1 = store.subscribe(() => {
    throw new Error('Subscriber error simulation');
  });
  const unsub2 = store.subscribe(() => {
    listener2Called = true;
  });

  store.dispatch('SET_FILTER', { key: 'level', value: '2' });

  unsub1();
  unsub2();

  if (!listener2Called) {
    throw new Error('Listener 2 was blocked by throwing Listener 1');
  }
});

runTest('CAT4: Concurrency & Stress', 'Re-entrant dispatch from subscriber does not crash or infinite loop', () => {
  resetStore();
  let depth = 0;
  const unsub = store.subscribe((st) => {
    depth++;
    if (depth < 3 && st.searchQuery !== 'reentrant_done') {
      store.dispatch('SET_FILTER', { key: 'search', value: 'reentrant_done' });
    }
  });

  store.dispatch('SET_FILTER', { key: 'search', value: 'start' });
  unsub();
  if (store.getState().searchQuery !== 'reentrant_done') {
    throw new Error('Re-entrant dispatch failed to update state');
  }
});

runTest('CAT5: Prerequisites', 'Cyclic dependency between nodes terminates safely without infinite loop', () => {
  resetStore();
  store.registerConcepts([
    { id: 'CYCLE_A', prerequisites: ['CYCLE_B'] },
    { id: 'CYCLE_B', prerequisites: ['CYCLE_A'] }
  ]);
  const s = store.getState();
  if (s.unlockedNodes.includes('CYCLE_A')) {
    throw new Error('Uncompleted cyclic node should not be unlocked');
  }
});

runTest('CAT5: Prerequisites', 'Out-of-order node completion forcefully unlocks the completed node', () => {
  resetStore();
  store.dispatch('COMPLETE_NODE', { nodeId: 'NODE_05' });
  const s = store.getState();
  if (!s.completedNodes.includes('NODE_05')) {
    throw new Error('NODE_05 not recorded in completedNodes');
  }
  if (!s.unlockedNodes.includes('NODE_05')) {
    throw new Error('Completed NODE_05 must be present in unlockedNodes');
  }
  if (s.completedNodes.includes('NODE_02') || s.completedNodes.includes('NODE_03')) {
    throw new Error('Upstream prerequisites were falsely marked as completed');
  }
});

runTest('CAT5: Prerequisites', 'Disappearing unlocks: manually unlocked node persists after subsequent COMPLETE_NODE', () => {
  resetStore();
  store.dispatch('UNLOCK_NODE', { nodeId: 'NODE_02' });
  let s = store.getState();
  if (!s.unlockedNodes.includes('NODE_02')) {
    throw new Error('Initial UNLOCK_NODE failed to add NODE_02');
  }

  store.dispatch('COMPLETE_NODE', { nodeId: 'NODE_01' });
  s = store.getState();

  store.dispatch('UNLOCK_NODE', { nodeId: 'NODE_08' });
  s = store.getState();
  if (!s.unlockedNodes.includes('NODE_08')) {
    throw new Error('UNLOCK_NODE failed for NODE_08');
  }

  store.dispatch('COMPLETE_NODE', { nodeId: 'NODE_02' });
  s = store.getState();

  if (!s.unlockedNodes.includes('NODE_08')) {
    throw new Error('FLAW: Manually unlocked NODE_08 was wiped out by _recalculateUnlockedNodes()!');
  }
});

runTest('CAT6: Teacher Mode', 'Enabling Teacher Mode unlocks all 9 concepts in store.getState().unlockedNodes', () => {
  resetStore();
  store.dispatch('SET_TEACHER_MODE', { enabled: true });
  const s = store.getState();
  if (s.unlockedNodes.length !== 9) {
    throw new Error(`Expected 9 unlocked nodes in teacher mode, got ${s.unlockedNodes.length} (${JSON.stringify(s.unlockedNodes)})`);
  }
});

runTest('CAT6: Teacher Mode', 'Disabling Teacher Mode re-locks uncompleted concepts without prereqs', () => {
  resetStore();
  store.dispatch('SET_TEACHER_MODE', { enabled: true });
  store.dispatch('SET_TEACHER_MODE', { enabled: false });
  const s = store.getState();
  if (s.unlockedNodes.length !== 1 || !s.unlockedNodes.includes('NODE_01')) {
    throw new Error(`Expected only NODE_01 unlocked after disabling teacher mode, got: ${JSON.stringify(s.unlockedNodes)}`);
  }
});

const passedCount = testResults.filter(t => t.passed).length;
const failedCount = testResults.filter(t => !t.passed).length;
console.log(`\nProposed Store Test Results: ${passedCount}/29 passed, ${failedCount} failed.`);
if (failedCount > 0) process.exit(1);
