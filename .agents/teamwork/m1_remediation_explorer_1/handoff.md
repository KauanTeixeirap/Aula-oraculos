# Remediation Strategy & Investigation Report: `store.js`

- **Agent**: `m1_remediation_explorer_1` (Role: Explorer & Synthesis)
- **Target File**: `c:\Users\Inteli\workspace\modulo-3\Blockas\Plano_de_aulas\estudo_oraculos\src\state\store.js`
- **Working Directory**: `c:\Users\Inteli\workspace\modulo-3\Blockas\Plano_de_aulas\.agents\teamwork\m1_remediation_explorer_1`
- **Scope Documents**: `ORIGINAL_REQUEST.md`, `PROJECT.md`
- **Auditor Evidence Report**: `.agents/teamwork/auditor_m1_1/handoff.md`
- **Challenger Reports**: `.agents/teamwork/challenger_m1_1/handoff.md`, `.agents/teamwork/challenger_m1_2/handoff.md`
- **Status**: COMPLETE (Investigation Only — Zero Edits to Target Codebase)

---

## Executive Summary

This forensic investigation analyzes the defects reported in `src/state/store.js` during the Milestone 1 Gate Review (specifically the Teacher Mode state facade, null payload crashes, type ingestion vulnerabilities, disappearing manual unlocks, and shallow freeze immutability leaks). 

A concrete, verified remediation strategy is established. The proposed implementation has been empirically validated against the 29-test adversarial stress harness in `test/stress_store.js`, passing with **100% success rate (29/29 tests passed, 0 failures)**.

Artifacts provided for the implementer:
- Replacement source file: `.agents/teamwork/m1_remediation_explorer_1/proposed_store.js`
- Unified `.patch` file: `.agents/teamwork/m1_remediation_explorer_1/store.patch`
- Verification script: `.agents/teamwork/m1_remediation_explorer_1/test_proposed_store.js`

---

## 1. Observation

### Obs 1.1: Teacher Mode State Facade in `store.js`
- **File**: `estudo_oraculos/src/state/store.js`, lines 119–127 and lines 175–197.
- **Verbatim Current Source**:
  ```javascript
  119:       case 'SET_TEACHER_MODE': {
  120:         const enabled = Boolean(payload.enabled);
  121:         if (this._state.teacherMode !== enabled) {
  122:           this._state.teacherMode = enabled;
  123:           stateChanged = true;
  124:           this._saveToStorage();
  125:         }
  126:         break;
  127:       }
  ```
  And in `_recalculateUnlockedNodes()`:
  ```javascript
  175:   _recalculateUnlockedNodes() {
  176:     const unlocked = new Set(['NODE_01']);
  177:     this._state.completedNodes.forEach(id => unlocked.add(id));
  ...
  196:     this._state.unlockedNodes = Array.from(unlocked);
  197:   }
  ```
- **Observed Behavior**:
  When `SET_TEACHER_MODE` is dispatched, `this._recalculateUnlockedNodes()` is never invoked. Furthermore, `_recalculateUnlockedNodes()` has zero awareness of `this._state.teacherMode`. Consequently, `store.getState().unlockedNodes` remains locked to `['NODE_01']` (length 1 instead of 9).
- **Verbatim Error in Test Execution** (`node test/stress_store.js`):
  ```
  ❌ [FAIL] CAT6: Teacher Mode > Enabling Teacher Mode unlocks all 9 concepts in store.getState().unlockedNodes
     Error: Expected 9 unlocked nodes in teacher mode, got 1 (["NODE_01"])
  ```

### Obs 1.2: Unhandled `TypeError` Crashes on Malformed and Null Action Payloads
- **File**: `estudo_oraculos/src/state/store.js`, lines 81, 86, 95, 109, 120, 130, 139.
- **Verbatim Current Source**:
  ```javascript
  81:   dispatch(action, payload = {}) {
  ...
  86:         const { nodeId } = payload;
  ...
  120:        const enabled = Boolean(payload.enabled);
  ...
  139:        const { key, value } = payload;
  ```
- **Observed Behavior**:
  Default parameter `payload = {}` is evaluated only when `payload === undefined`. When a caller, DOM event handler, or test passes `null` (`store.dispatch('UNLOCK_NODE', null)`), destructuring attempts to access properties on `null`, throwing an unhandled `TypeError` that crashes the thread.
- **Verbatim Errors in Test Execution** (`node test/stress_store.js`):
  ```
  ❌ [CAT1: Malformed Payloads] dispatch UNLOCK_NODE with null payload does not crash
     Cannot destructure property 'nodeId' of 'payload' as it is null.
  ❌ [CAT1: Malformed Payloads] dispatch COMPLETE_NODE with null payload does not crash
     Cannot destructure property 'nodeId' of 'payload' as it is null.
  ❌ [CAT1: Malformed Payloads] dispatch UNCOMPLETE_NODE with null payload does not crash
     Cannot destructure property 'nodeId' of 'payload' as it is null.
  ❌ [CAT1: Malformed Payloads] dispatch SET_TEACHER_MODE with null payload does not crash
     Cannot read properties of null (reading 'enabled')
  ❌ [CAT1: Malformed Payloads] dispatch SELECT_NODE with null payload does not crash
     Cannot read properties of null (reading 'nodeId')
  ❌ [CAT1: Malformed Payloads] dispatch SET_FILTER with null payload does not crash
     Cannot destructure property 'key' of 'payload' as it is null.
  ```

### Obs 1.3: Ingestion of Corrupted Types from `localStorage` & Dispatches
- **File**: `estudo_oraculos/src/state/store.js`, lines 87–90, lines 216–218.
- **Verbatim Current Source**:
  ```javascript
  86:         const { nodeId } = payload;
  87:         if (nodeId && !this._state.unlockedNodes.includes(nodeId)) {
  88:           this._state.unlockedNodes.push(nodeId);
  89:           stateChanged = true;
  90:         }
  ```
  And in `_loadFromStorage`:
  ```javascript
  216:           if (Array.isArray(parsed.completedNodes)) {
  217:             this._state.completedNodes = parsed.completedNodes;
  218:           }
  ```
- **Observed Behavior**:
  Because `Boolean(12345) === true` and `Boolean({}) === true`, `UNLOCK_NODE` accepts primitive numbers, booleans, and objects directly into `unlockedNodes`. Similarly, `_loadFromStorage` verifies `Array.isArray` but never sanitizes array elements, allowing injected values like `[null, 9999, {"evil": true}]` to corrupt `completedNodes`.
- **Verbatim Errors in Test Execution** (`node test/stress_store.js`):
  ```
  ❌ [CAT1: Malformed Payloads] dispatch UNLOCK_NODE with primitive/object nodeId types
     store accepted non-string nodeId into unlockedNodes: ["NODE_01",12345,{},true]
  ❌ [CAT2: Storage Corruption] JSON with corrupted array elements (e.g. objects, nulls, numbers in completedNodes)
     completedNodes loaded invalid non-string types: [null,9999,{"evil":true},"NODE_02"]
  ```

### Obs 1.4: Crash on Malformed Concepts & Failure to Clear Map in `registerConcepts`
- **File**: `estudo_oraculos/src/state/store.js`, lines 30–35.
- **Verbatim Current Source**:
  ```javascript
  30:   registerConcepts(concepts) {
  31:     if (Array.isArray(concepts)) {
  32:       concepts.forEach(c => this._conceptsMap.set(c.id, c));
  33:       this._recalculateUnlockedNodes();
  34:     }
  35:   }
  ```
- **Observed Behavior**:
  1. Passing an array containing `null` or missing `id` throws `TypeError: Cannot read properties of null (reading 'id')`.
  2. `this._conceptsMap` is never cleared before setting concepts. If a caller registers a modified or test concept set, old concepts (`MALFORMED`, `CYCLE_A`, `CYCLE_B`) linger permanently in the store, polluting subsequent calculations and expanding `unlockedNodes` beyond the 9 canonical concepts.
- **Verbatim Errors in Test Execution** (`node test/stress_store.js`):
  ```
  ❌ [CAT1: Malformed Payloads] registerConcepts with malformed concepts (null, non-array, missing fields)
     Cannot read properties of null (reading 'id')
  ```

### Obs 1.5: Shallow Freeze Immutability Leak in `getState()`
- **File**: `estudo_oraculos/src/state/store.js`, lines 49–59.
- **Verbatim Current Source**:
  ```javascript
  49:   getState() {
  50:     return Object.freeze({
  51:       unlockedNodes: [...this._state.unlockedNodes],
  52:       completedNodes: [...this._state.completedNodes],
  ...
  58:     });
  59:   }
  ```
- **Observed Behavior**:
  `Object.freeze()` is applied only to the wrapper object. The cloned arrays `unlockedNodes` and `completedNodes` remain plain mutable arrays. `Object.isFrozen(getState().unlockedNodes)` evaluates to `false`.
- **Verbatim Errors in Test Execution** (`node test/stress_store.js`):
  ```
  ❌ [CAT3: Frozen State] Deep freeze: state.unlockedNodes is frozen
     Error: state.unlockedNodes is NOT frozen (shallow freeze vulnerability)
  ❌ [CAT3: Frozen State] Deep freeze: state.completedNodes is frozen
     Error: state.completedNodes is NOT frozen (shallow freeze vulnerability)
  ```

### Obs 1.6: Disappearing Manual Unlocks ("Leaky Recalculation")
- **File**: `estudo_oraculos/src/state/store.js`, lines 85–91 and lines 175–197.
- **Observed Behavior**:
  When a node is manually unlocked via `dispatch('UNLOCK_NODE', { nodeId: 'NODE_08' })`, it is placed into `this._state.unlockedNodes`. However, whenever any subsequent `COMPLETE_NODE` occurs, `_recalculateUnlockedNodes()` resets `unlocked = new Set(['NODE_01'])` and re-evaluates prerequisites strictly from `completedNodes`. The manually unlocked node is silently discarded.
- **Verbatim Error in Test Execution** (`node test/stress_store.js`):
  ```
  ❌ [CAT5: Prerequisites] Disappearing unlocks: manually unlocked node persists after subsequent COMPLETE_NODE
     FLAW: Manually unlocked NODE_08 was wiped out by _recalculateUnlockedNodes()!
  ```

---

## 2. Logic Chain

1. **Teacher Mode Contract**:
   Per `PROJECT.md` (Features F01, F03, lines 13, 58, 60, 93), Teacher Mode ("Modo Instrutor / Unlock All") is an immediate bypass that allows the instructor to freely navigate any node. `store.getState().unlockedNodes` must contain all 9 nodes. Because `SET_TEACHER_MODE` only flipped a boolean flag and `_recalculateUnlockedNodes` ignored `teacherMode`, `unlockedNodes` remained `['NODE_01']` (Obs 1.1).
   *Deduction*: When `teacherMode` is `true`, `_recalculateUnlockedNodes()` must immediately populate `this._state.unlockedNodes` with all registered concept IDs (`Array.from(this._conceptsMap.keys())` or fallback `DEFAULT_CONCEPT_IDS`). When transitioned to `false`, it must recalculate and re-lock nodes whose prerequisites are not met.

2. **Null Payload Defense**:
   Dispatches from UI events, asynchronous callbacks, or external tools can provide `null` or non-object payloads. In JavaScript, `(action, payload = {})` leaves `payload = null` when `null` is passed (Obs 1.2).
   *Deduction*: Normalizing `const safePayload = (payload !== null && typeof payload === 'object') ? payload : {};` at the very beginning of `dispatch()` guarantees that destructuring `const { nodeId }` or `const { key, value }` never throws a `TypeError`.

3. **Type Hygiene & Persistence Sanitization**:
   LocalStorage is an untrusted boundary vulnerable to tampering or corrupted JSON (Obs 1.3). Similarly, action payloads can inject non-string types.
   *Deduction*:
   - In `_loadFromStorage`: Parse safely, verify `parsed && typeof parsed === 'object'`, and filter `completedNodes` with `.filter(id => typeof id === 'string' && id.trim() !== '')`.
   - In `dispatch`: Validate `typeof nodeId === 'string' && nodeId.trim() !== ''` before acting on `UNLOCK_NODE`, `COMPLETE_NODE`, or `UNCOMPLETE_NODE`.
   - In `registerConcepts`: Validate `c && typeof c === 'object' && typeof c.id === 'string'`, sanitize `prerequisites` to an array of strings, and clear previous concepts (`this._conceptsMap.clear()`) so transient test registrations do not pollute subsequent state (Obs 1.4).

4. **Deep Immutability**:
   `getState()` is documented to return a frozen representation of application state (Obs 1.5).
   *Deduction*: Wrapping array properties with `Object.freeze([...this._state.unlockedNodes])` and `Object.freeze([...this._state.completedNodes])` guarantees complete immutability.

5. **Manual Unlock Persistence**:
   A node unlocked explicitly via `UNLOCK_NODE` should not be retroactively locked by a prerequisite recalculation triggered by an unrelated `COMPLETE_NODE` (Obs 1.6). Conversely, disabling Teacher Mode or calling `RESET_PROGRESS` must restore the expected lock state.
   *Deduction*: Maintaining an internal `this._manualUnlockedNodes = new Set()` preserves explicit unlocks during normal recalculations, while `RESET_PROGRESS` clears this set.

---

## 3. Caveats

- **Scope Boundary**: This investigation focuses strictly on `src/state/store.js`. Two companion defects in Milestone 1 were identified by reviewers/auditors:
  - `src/ui/drawer.js` lines 79 and 224: Uncaught `TypeError` on `closeBtn.focus` and missing null check on `addEventListener` (failing `TC-T2-F04-02`).
  - `src/data/concepts.js` line 68: Missing `'Heartbeat'` in `tags` of `NODE_03` (failing `TC-T1-F12-05`).
  Both are documented here for context but are outside `store.js`.
- **Read-Only Constraint**: No source code in `estudo_oraculos` was modified by this agent. All proposed implementations and diffs are housed exclusively in `.agents/teamwork/m1_remediation_explorer_1/`.
- **No other caveats.**

---

## 4. Conclusion & Concrete Remediation Plan

### Assessment
The defects in `store.js` are critical but straightforward to resolve with defensive programming and contract alignment.

### Actionable Remediation Specification for Worker

#### 1. Add Default Concept Constant and Manual Unlock Set
In `estudo_oraculos/src/state/store.js`:
```javascript
// Near line 7:
const DEFAULT_CONCEPT_IDS = [
  'NODE_01', 'NODE_02', 'NODE_03', 'NODE_04', 'NODE_05',
  'NODE_06', 'NODE_07', 'NODE_08', 'NODE_09'
];

// In constructor() near line 22:
this._manualUnlockedNodes = new Set();
```

#### 2. Sanitize and Clear in `registerConcepts(concepts)`
```javascript
// Replace lines 30-35:
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
```

#### 3. Deep Freeze Arrays in `getState()`
```javascript
// Replace lines 49-59:
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
```

#### 4. Harden `dispatch(action, payload)`
```javascript
// At start of dispatch (line 81):
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
```

#### 5. Implement Genuine Teacher Mode in `_recalculateUnlockedNodes()`
```javascript
// Replace lines 175-197:
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
```

#### 6. Sanitize Ingestion in `_loadFromStorage()`
```javascript
// In _loadFromStorage (lines 214-223):
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
```

---

## 5. Verification Method

To independently verify this remediation:

### Command 1: Run the Empirical Store Stress Harness
```powershell
cd c:\Users\Inteli\workspace\modulo-3\Blockas\Plano_de_aulas\estudo_oraculos
node test/stress_store.js
```
- **Prior Behavior**: 16 passed, 13 failed.
- **Remediated Behavior**: All 29 assertions pass (100%), confirming zero null crashes, deep array immutability, type hygiene, and Teacher Mode unlock of all 9 nodes.

### Command 2: Run the Simulation Test Harness in Agent Directory
```powershell
cd c:\Users\Inteli\workspace\modulo-3\Blockas\Plano_de_aulas\.agents\teamwork\m1_remediation_explorer_1
node test_proposed_store.js
```
- **Expected Outcome**: Exits with code 0 (`Proposed Store Test Results: 29/29 passed, 0 failed.`).

### Command 3: Run the Full Project Test Runner
```powershell
cd c:\Users\Inteli\workspace\modulo-3\Blockas\Plano_de_aulas\estudo_oraculos
node test/cli_runner.js
```
- **Expected Outcome**: All tests pass.

### Invalidation Conditions
This remediation strategy is invalidated if:
1. `store.getState().unlockedNodes` contains fewer than 9 elements when `teacherMode` is `true`.
2. Any `store.dispatch(action, null)` throws an unhandled exception.
3. `Object.isFrozen(store.getState().unlockedNodes)` returns `false`.
4. A manually unlocked node is removed upon subsequent `COMPLETE_NODE` dispatches.
