/**
 * Empirical Adversarial Stress Harness for store.js
 * Tests:
 * 1. Invalid inputs & malformed payloads (null, primitives, missing keys)
 * 2. LocalStorage corruption, quota errors, null parsed states
 * 3. Mutation attempts on frozen state (shallow vs deep freeze)
 * 4. High-frequency concurrent / async action bursts
 * 5. Re-entrancy, listener errors, subscription mutations during notify
 * 6. Out-of-order completion, cyclic prerequisites, disappearing unlocks
 * 7. Teacher mode unlock-all behavior and re-lock transitions
 */

import { fileURLToPath } from 'url';
import path from 'path';

// Setup Mock Environment if in Node.js
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

if (typeof globalThis.window === 'undefined') {
  globalThis.window = {
    localStorage: mockLocalStorage
  };
} else {
  globalThis.window.localStorage = mockLocalStorage;
}

// Dynamically import store
const storeModule = await import('../src/state/store.js');
const store = storeModule.store || storeModule.default;

// Sample concepts DAG for testing
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

console.log('===============================================================');
console.log('🧪 EMPIRICAL ADVERSARIAL STRESS TEST SUITE: store.js');
console.log('===============================================================\n');

// -------------------------------------------------------------
// Category 1: Invalid Inputs & Malformed Payloads
// -------------------------------------------------------------
console.log('--- Category 1: Invalid Inputs & Malformed Payloads ---');

runTest('CAT1: Malformed Payloads', 'dispatch UNKNOWN_ACTION does not crash', () => {
  resetStore();
  store.dispatch('UNKNOWN_ACTION_999', { foo: 'bar' });
  const s = store.getState();
  if (!s || !s.unlockedNodes) throw new Error('State corrupted after unknown action');
});

runTest('CAT1: Malformed Payloads', 'dispatch UNLOCK_NODE with null payload does not crash', () => {
  resetStore();
  // If payload is null, `const { nodeId } = payload` throws TypeError
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
  // Verify state integrity
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

// -------------------------------------------------------------
// Category 2: LocalStorage Corruption & Persistence Failures
// -------------------------------------------------------------
console.log('\n--- Category 2: LocalStorage Corruption & Persistence Failures ---');

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
  // Did store sanitize completedNodes to strings only?
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

// -------------------------------------------------------------
// Category 3: Mutation Attempts on Frozen State
// -------------------------------------------------------------
console.log('\n--- Category 3: Mutation Attempts on Frozen State ---');

runTest('CAT3: Frozen State', 'getState() returns a frozen root object', () => {
  resetStore();
  const s = store.getState();
  if (!Object.isFrozen(s)) {
    throw new Error('getState() root object is NOT frozen');
  }
});

runTest('CAT3: Frozen State', 'Direct mutation on root properties throws or is ignored without modifying store', () => {
  resetStore();
  const s = store.getState();
  try {
    s.teacherMode = true;
  } catch (e) {
    // Expected in strict mode
  }
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
  s.unlockedNodes.push('HACKED_NODE');
  const freshState = store.getState();
  if (freshState.unlockedNodes.includes('HACKED_NODE')) {
    throw new Error('External push to unlockedNodes mutated store internal state!');
  }
});

// -------------------------------------------------------------
// Category 4: High-Frequency Concurrent Actions & Listener Re-entrancy
// -------------------------------------------------------------
console.log('\n--- Category 4: High-Frequency Actions & Listener Re-entrancy ---');

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

// -------------------------------------------------------------
// Category 5: Prerequisite Engine, Cyclic Graphs, & Disappearing Unlocks
// -------------------------------------------------------------
console.log('\n--- Category 5: Prerequisite Engine & Out-of-Order Unlocks ---');

runTest('CAT5: Prerequisites', 'Cyclic dependency between nodes terminates safely without infinite loop', () => {
  resetStore();
  store.registerConcepts([
    { id: 'CYCLE_A', prerequisites: ['CYCLE_B'] },
    { id: 'CYCLE_B', prerequisites: ['CYCLE_A'] }
  ]);
  // Recalculation was triggered; verify execution reached here
  const s = store.getState();
  if (s.unlockedNodes.includes('CYCLE_A')) {
    throw new Error('Uncompleted cyclic node should not be unlocked');
  }
});

runTest('CAT5: Prerequisites', 'Out-of-order node completion forcefully unlocks the completed node', () => {
  resetStore();
  // Node 05 requires Node 03 and Node 04, which require Node 02, which requires Node 01.
  // Complete Node 05 directly without completing 01, 02, 03, 04.
  store.dispatch('COMPLETE_NODE', { nodeId: 'NODE_05' });
  const s = store.getState();
  if (!s.completedNodes.includes('NODE_05')) {
    throw new Error('NODE_05 not recorded in completedNodes');
  }
  if (!s.unlockedNodes.includes('NODE_05')) {
    throw new Error('Completed NODE_05 must be present in unlockedNodes');
  }
  // Upstream prerequisites (NODE_02, NODE_03, NODE_04) should NOT be falsely completed
  if (s.completedNodes.includes('NODE_02') || s.completedNodes.includes('NODE_03')) {
    throw new Error('Upstream prerequisites were falsely marked as completed');
  }
});

runTest('CAT5: Prerequisites', 'Disappearing unlocks: manually unlocked node persists after subsequent COMPLETE_NODE', () => {
  resetStore();
  // 1. Manually unlock NODE_02 (e.g. granted by special rule or test)
  store.dispatch('UNLOCK_NODE', { nodeId: 'NODE_02' });
  let s = store.getState();
  if (!s.unlockedNodes.includes('NODE_02')) {
    throw new Error('Initial UNLOCK_NODE failed to add NODE_02');
  }

  // 2. Now complete NODE_01 (which recalculates prerequisites)
  store.dispatch('COMPLETE_NODE', { nodeId: 'NODE_01' });
  s = store.getState();

  // 3. Check if NODE_02 is still unlocked.
  // In the real concepts DAG, NODE_01 completes -> NODE_02 unlocks via prereq, so NODE_02 is unlocked.
  // But what if we unlock an unrelated node e.g. NODE_08 without completing its prereqs?
  store.dispatch('UNLOCK_NODE', { nodeId: 'NODE_08' });
  s = store.getState();
  if (!s.unlockedNodes.includes('NODE_08')) {
    throw new Error('UNLOCK_NODE failed for NODE_08');
  }

  // Now complete NODE_02
  store.dispatch('COMPLETE_NODE', { nodeId: 'NODE_02' });
  s = store.getState();

  // Did NODE_08 disappear because _recalculateUnlockedNodes wiped it?
  if (!s.unlockedNodes.includes('NODE_08')) {
    throw new Error('FLAW: Manually unlocked NODE_08 was wiped out by _recalculateUnlockedNodes()!');
  }
});

// -------------------------------------------------------------
// Category 6: Teacher Mode Unlock-All & Re-Lock Behavior
// -------------------------------------------------------------
console.log('\n--- Category 6: Teacher Mode Behavior ---');

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
  // Enable teacher mode (all 9 unlocked)
  store.dispatch('SET_TEACHER_MODE', { enabled: true });
  // Disable teacher mode (only NODE_01 should be unlocked if none completed)
  store.dispatch('SET_TEACHER_MODE', { enabled: false });
  const s = store.getState();
  if (s.unlockedNodes.length !== 1 || !s.unlockedNodes.includes('NODE_01')) {
    throw new Error(`Expected only NODE_01 unlocked after disabling teacher mode, got: ${JSON.stringify(s.unlockedNodes)}`);
  }
});

// -------------------------------------------------------------
// Summary of Results
// -------------------------------------------------------------
console.log('\n===============================================================');
console.log('📊 EMPIRICAL STRESS TEST SUMMARY');
console.log('===============================================================');
const passedCount = testResults.filter(t => t.passed).length;
const failedCount = testResults.filter(t => !t.passed).length;
console.log(`Total Tests Run: ${testResults.length}`);
console.log(`Passed         : ${passedCount}`);
console.log(`Failed         : ${failedCount}`);

if (failedCount > 0) {
  console.log('\nDefects Found:');
  testResults.filter(t => !t.passed).forEach(t => {
    console.log(`❌ [${t.category}] ${t.name}`);
    console.log(`   ${t.error.message || t.error}`);
  });
}

console.log('===============================================================');
