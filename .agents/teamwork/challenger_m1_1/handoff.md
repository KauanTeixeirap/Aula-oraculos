# Handoff Report: Empirical Challenge of `store.js`

- **Agent**: `challenger_m1_1` (Critic / Specialist)
- **Target Component**: `estudo_oraculos/src/state/store.js`
- **Scope Documents**: `PROJECT.md`, `ORIGINAL_REQUEST.md`
- **Verdict**: **FAIL**

---

## 1. Observation

### Observation 1: Contract Violation in Teacher Mode Unlock
When running the automated E2E test suite via `node test/cli_runner.js`:
- **File**: `estudo_oraculos/test/e2e_spec.js` (lines 193-201, 1692, 1887)
- **Verbatim Error**:
  ```
  • [F03] [Tier 1] F03: Dependency & Prerequisite Engine [Tier 1] > TC-T1-F03-05: In teacher mode all 9 nodes are unlocked regardless of completed set
    Error: Error: Expected 1 to be 9
  • [CROSS] [Tier 3] Tier 3: Cross-Feature Combinations > CF01 (F01 + F03): Toggling Teacher Mode in Header immediately unlocks all DAG nodes in engine
    Error: Error: Expected 1 to be 9
  • [JOURNEY] [Tier 4] Tier 4: Real-World Application Scenarios > UJ02: Instructor Presentation Journey (Kauan classroom unlock-all & direct jump)
    Error: Error: Expected 1 to be 9
  ```
- **Code Inspection** (`estudo_oraculos/src/state/store.js`, lines 119-126):
  ```javascript
  case 'SET_TEACHER_MODE': {
    const enabled = Boolean(payload.enabled);
    if (this._state.teacherMode !== enabled) {
      this._state.teacherMode = enabled;
      stateChanged = true;
      this._saveToStorage();
    }
    break;
  }
  ```
  `SET_TEACHER_MODE` mutates the boolean flag but never updates `this._state.unlockedNodes` or calls `this._recalculateUnlockedNodes()`. Even if it did, `_recalculateUnlockedNodes()` (lines 175-197) does not inspect `this._state.teacherMode`. Consequently, `unlockedNodes` remains restricted to `['NODE_01']` instead of unlocking all 9 concepts as required by `PROJECT.md` (lines 13, 58, 60).

### Observation 2: Uncaught Crash on Null Action Payloads
Running the empirical harness `node test/stress_store.js`:
- **Tool Command**: `node test/stress_store.js`
- **Verbatim Errors**:
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
- **Code Inspection** (`estudo_oraculos/src/state/store.js`, line 81):
  ```javascript
  dispatch(action, payload = {}) { ... }
  ```
  Default parameter `payload = {}` is only triggered when `payload === undefined`. When a caller dispatches `dispatch('UNLOCK_NODE', null)` or any other action with `null`, destructuring throws an unhandled `TypeError`, crashing the execution thread.

### Observation 3: Ingestion of Corrupted Types from Storage and Dispatches
- **Empirical Result**:
  ```
  ❌ [CAT1: Malformed Payloads] dispatch UNLOCK_NODE with primitive/object nodeId types
     store accepted non-string nodeId into unlockedNodes: ["NODE_01",12345,{},true]
  ❌ [CAT2: Storage Corruption] JSON with corrupted array elements (e.g. objects, nulls, numbers in completedNodes)
     completedNodes loaded invalid non-string types: [null,9999,{"evil":true},"NODE_02"]
  ```
- **Code Inspection** (`estudo_oraculos/src/state/store.js`, lines 216-218):
  ```javascript
  if (Array.isArray(parsed.completedNodes)) {
    this._state.completedNodes = parsed.completedNodes;
  }
  ```
  `_loadFromStorage` validates that `completedNodes` is an array, but performs zero element sanitization. Tampered or corrupted `localStorage` entries directly inject non-string primitives and objects into application state.

### Observation 4: Shallow Freeze Immutability Leak
- **Empirical Result**:
  ```
  ❌ [CAT3: Frozen State] Deep freeze: state.unlockedNodes is frozen
     state.unlockedNodes is NOT frozen (shallow freeze vulnerability)
  ❌ [CAT3: Frozen State] Deep freeze: state.completedNodes is frozen
     state.completedNodes is NOT frozen (shallow freeze vulnerability)
  ```
- **Code Inspection** (`estudo_oraculos/src/state/store.js`, lines 50-58):
  `Object.freeze()` is applied only to the top-level object. The cloned arrays (`unlockedNodes: [...this._state.unlockedNodes]`) are plain mutable arrays. `Object.isFrozen(getState().unlockedNodes)` evaluates to `false`. While external mutations do not alter the store's internal arrays directly due to the shallow copy, consumers expecting deep immutability or passing arrays to frozen-checking utilities will observe mutable array instances.

### Observation 5: Disappearing Manual Unlocks ("Leaky Recalculation")
- **Empirical Result**:
  ```
  ❌ [CAT5: Prerequisites] Disappearing unlocks: manually unlocked node persists after subsequent COMPLETE_NODE
     FLAW: Manually unlocked NODE_08 was wiped out by _recalculateUnlockedNodes()!
  ```
- **Code Inspection** (`estudo_oraculos/src/state/store.js`, lines 85-91 & 175-197):
  When `UNLOCK_NODE` is dispatched for `NODE_08`, it is added to `this._state.unlockedNodes`. However, when any subsequent `COMPLETE_NODE` occurs, `_recalculateUnlockedNodes()` resets `unlocked = new Set(['NODE_01'])` and only includes `completedNodes` plus DAG-satisfied concepts. The manually unlocked node is silently discarded.

### Observation 6: Uncaught Exception in `registerConcepts`
- **Empirical Result**:
  ```
  ❌ [CAT1: Malformed Payloads] registerConcepts with malformed concepts (null, non-array, missing fields)
     Cannot read properties of null (reading 'id')
  ```
- **Code Inspection** (`estudo_oraculos/src/state/store.js`, lines 30-34):
  `concepts.forEach(c => this._conceptsMap.set(c.id, c))` does not filter out `null` or `undefined` items within the array.

---

## 2. Logic Chain

1. **Premise 1**: The system specification (`PROJECT.md` F01, F03, lines 13, 58, 60) and authoritative test suite (`TC-T1-F03-05`, `CF01`, `UJ02`) define Teacher Mode as an immediate unlock bypass where all 9 DAG nodes must be present in `store.getState().unlockedNodes`.
2. **Step 1 (Observation 1)**: `store.js` merely stores `this._state.teacherMode = enabled` without populating `unlockedNodes`. In both standalone tests and E2E runs, `unlockedNodes.length` evaluates to `1` instead of `9`.
3. **Step 2 (Observation 2)**: Actions dispatched with `payload = null` cause immediate unhandled `TypeError` exceptions due to unprotected destructuring (`const { nodeId } = payload;`). This violates basic runtime defense principles in modern Web3 single-page applications.
4. **Step 3 (Observations 3 & 5)**: State persistence from `localStorage` does not validate array member types, and the prerequisite engine discards previous `UNLOCK_NODE` operations upon any `COMPLETE_NODE` invocation.
5. **Deduction**: Because `store.js` breaks 3 existing test cases across Tiers 1, 3, and 4 in the project's test runner, and fails 13 adversarial stress assertions, the component fails both its functional specification and empirical robustness criteria.
6. **Verdict**: **FAIL**.

---

## 3. Caveats

- **No modifications performed**: In strict adherence to the challenger role constraint ("Review-only — do NOT modify implementation code"), no source code in `estudo_oraculos/src/state/store.js` was modified.
- **Node.js execution environment**: Tests were run in Node.js with a compliant browser mock (`window.localStorage`). Browser DOM event handling for UI components was not evaluated here, as this review was strictly focused on `store.js`.
- **E2E test suite failures outside store**: Note that `TC-T1-F12-05` (missing concept keyword "Heartbeat") and `TC-T2-F04-02` (drawer event listener null check) failed in `e2e_spec.js`. These are separate issues in `concepts.js` and `drawer.js`, independent of `store.js`.

---

## 4. Conclusion

**Verdict: FAIL**

The implementation of `estudo_oraculos/src/state/store.js` cannot be approved for Milestone M1 completion. It introduces blocking defects:
1. **Critical Functionality Flaw**: `SET_TEACHER_MODE` does not unlock all nodes, breaking core requirements F01 and F03, and causing 3 test failures in `e2e_spec.js`.
2. **Reliability Flaws**: Unhandled crashes on `null` payloads across all action types, and unhandled crash in `registerConcepts` when encountering null entries.
3. **State Consistency Flaw**: Disappearing manually unlocked nodes upon prerequisite recalculation.
4. **Data Hygiene Flaws**: Lack of element type validation on loaded `completedNodes` from `localStorage`, and shallow freezing on `getState()`.

### Required Mitigations for Implementation Agents:
1. In `dispatch(action, payload = {})`, normalize `payload = payload || {}` at the start of the method to prevent destructuring null crashes.
2. In `SET_TEACHER_MODE`, update `this._state.teacherMode = enabled`, call `this._recalculateUnlockedNodes()`, and inside `_recalculateUnlockedNodes()`, check `if (this._state.teacherMode)` and add all concept IDs in `this._conceptsMap` to `unlocked`. When disabled, recompute based on completed nodes.
3. In `registerConcepts`, filter items with `Boolean(c && c.id)`.
4. In `_loadFromStorage`, sanitize `completedNodes` to only retain non-empty strings: `parsed.completedNodes.filter(id => typeof id === 'string')`.
5. Deep-freeze state arrays in `getState()`: `unlockedNodes: Object.freeze([...this._state.unlockedNodes])`, `completedNodes: Object.freeze([...this._state.completedNodes])`.

---

## 5. Verification Method

To independently verify these findings, run the following commands:

1. **Verify E2E Test Suite Failures (TC-T1-F03-05, CF01, UJ02)**:
   ```powershell
   cd c:\Users\Inteli\workspace\modulo-3\Blockas\Plano_de_aulas\estudo_oraculos
   node test/cli_runner.js
   ```
   *Expected result*: Exits with code 1, reporting failures on `TC-T1-F03-05`, `CF01`, and `UJ02` with `Expected 1 to be 9`.

2. **Verify Adversarial Stress Harness**:
   ```powershell
   cd c:\Users\Inteli\workspace\modulo-3\Blockas\Plano_de_aulas\estudo_oraculos
   node test/stress_store.js
   ```
   *Expected result*: Executes 29 tests, reporting 13 failures across Categories 1, 2, 3, 5, and 6.

3. **Invalidation Condition**:
   This verdict is invalidated only when both `node test/stress_store.js` passes 100% of its assertions and `node test/cli_runner.js` passes all store-dependent tests (`TC-T1-F03-05`, `CF01`, `UJ02`).

---

## Adversarial Challenge Matrix

| Challenge ID | Severity | Assumption Challenged | Attack Scenario | Blast Radius | Mitigated? |
|---|---|---|---|---|---|
| ADV-01 | CRITICAL | Teacher mode unlocks all DAG nodes | Dispatch `SET_TEACHER_MODE: { enabled: true }` | F01, F03, UI navigation blocked in Teacher Mode | NO (Fails) |
| ADV-02 | HIGH | Payload is always an object | Dispatch `dispatch('UNLOCK_NODE', null)` | Unhandled `TypeError`, crashes SPA | NO (Fails) |
| ADV-03 | MEDIUM | `localStorage` data is valid | Inject `[null, 9999, {}]` into storage | Corrupt types in application state | NO (Fails) |
| ADV-04 | MEDIUM | `getState()` returns immutable state | Inspect `Object.isFrozen(getState().unlockedNodes)` | Shallow freeze allows array mutations | NO (Fails) |
| ADV-05 | HIGH | Manual unlocks persist | `UNLOCK_NODE` followed by `COMPLETE_NODE` | Prerequisite recalculation wipes previous unlock | NO (Fails) |
| ADV-06 | LOW | Rapid concurrency / listener errors | 1,000 rapid dispatches, throwing listener | None (Store handles sequential sync cleanly) | YES (Passes) |
