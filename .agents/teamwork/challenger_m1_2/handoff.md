# Handoff Report: Empirical Adversarial Challenge of `treeEngine.js` & `concepts.js`

**Agent**: `challenger_m1_2` (teamwork_preview_challenger)  
**Target Project**: `estudo_oraculos`  
**Target Components**: `src/tree/treeEngine.js` & `src/data/concepts.js`  
**Verdict**: **FAIL**

---

## 1. Observation

### Obs 1.1: E2E Test Suite Execution Failures
Running `node test/cli_runner.js` produces 5 failing tests out of 253:
```
Total Test Cases : 253
Passed           : 248
Failed           : 5
Duration         : 117 ms

• [F03] [Tier 1] F03: Dependency & Prerequisite Engine [Tier 1] > TC-T1-F03-05: In teacher mode all 9 nodes are unlocked regardless of completed set
  Error: Error: Expected 1 to be 9
• [F12] [Tier 1] F12: Theory: Oracle Architectures [Tier 1] > TC-T1-F12-05: Details gas cost vs freshness trade-off curve between models
  Error: Error: Expected ["Push Model","Pull Model","Pyth Network","Chainlink Data Feeds","Gas Optimization"] to contain "Heartbeat"
• [F04] [Tier 2] F04: Concept Detail Inspector Drawer [Tier 2] > TC-T2-F04-02: Rapid open-close calls do not desynchronize drawer state
  Error: TypeError: Cannot read properties of null (reading 'addEventListener')
• [CROSS] [Tier 3] Tier 3: Cross-Feature Combinations > CF01 (F01 + F03): Toggling Teacher Mode in Header immediately unlocks all DAG nodes in engine
  Error: Error: Expected 1 to be 9
• [JOURNEY] [Tier 4] Tier 4: Real-World Application Scenarios > UJ02: Instructor Presentation Journey (Kauan classroom unlock-all & direct jump)
  Error: Error: Expected 1 to be 9
```

### Obs 1.2: Runtime Crash in `treeEngine.js:220` on Null/Undefined Difficulty Filter
In `src/tree/treeEngine.js`, lines 207-220:
```javascript
207:    const filterDiff = state.filterDifficulty;
...
220:    const matchesDiff = filterDiff === 'all' || concept.difficulty.toLowerCase() === filterDiff.toLowerCase();
```
When `store.dispatch('SET_FILTER', { key: 'difficulty', value: null })` or `{ key: 'difficulty', value: undefined }` is dispatched, `filterDiff` is `null`/`undefined`. Calling `filterDiff.toLowerCase()` immediately throws:
```
TypeError: Cannot read properties of null (reading 'toLowerCase')
    at TreeEngine.updateState (src/tree/treeEngine.js:220)
```
Empirically reproduced in test S5.4 in `test/challenge_tree_engine.js`.

### Obs 1.3: Runtime Crash in `treeEngine.js:206` on Non-String Search Query
In `src/tree/treeEngine.js`, line 206:
```javascript
206:    const query = (state.searchQuery || '').trim().toLowerCase();
```
When `store.dispatch('SET_FILTER', { key: 'search', value: 123 })` is executed, `(123 || '')` evaluates to `123`. Calling `.trim()` on a number throws:
```
TypeError: (state.searchQuery || "").trim is not a function
    at TreeEngine.updateState (src/tree/treeEngine.js:206)
```

### Obs 1.4: Taxonomy Discrepancy in `src/data/concepts.js:68`
In `src/data/concepts.js`, `NODE_03` tags are defined as:
```javascript
68:    tags: ['Push Model', 'Pull Model', 'Pyth Network', 'Chainlink Data Feeds', 'Gas Optimization'],
```
The concept description explicitly discusses heartbeats (`"intervalos fixos (heartbeat de 1h)"`), but `'Heartbeat'` was omitted from the `tags` array. This directly causes `TC-T1-F12-05` to fail.

### Obs 1.5: Teacher Mode Store-Engine Contract Divergence
In `src/state/store.js:120-128`:
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
Setting `teacherMode: true` does NOT populate `this._state.unlockedNodes` with all 9 concepts. Consequently, `store.getState().unlockedNodes` only contains `['NODE_01']` (length 1).  
In `treeEngine.js:70-72` and line 215:
```javascript
    if (state.teacherMode) {
      return { isUnlocked: true, missingPrereqs: [] };
    }
...
    const isUnlocked = state.unlockedNodes.includes(concept.id) || state.teacherMode;
```
`treeEngine` papers over this by checking `|| state.teacherMode`, but any component or test inspecting `store.getState().unlockedNodes` fails (Obs 1.1: `TC-T1-F03-05`, `CF01`, `UJ02`).

### Obs 1.6: Portuguese Accent Sensitivity in Search
In `src/tree/treeEngine.js:221-225`:
```javascript
      const matchesSearch = !query ||
        concept.title.toLowerCase().includes(query) ||
        concept.subtitle.toLowerCase().includes(query) ||
        concept.tags.some(t => t.toLowerCase().includes(query)) ||
        concept.coreConcept.toLowerCase().includes(query);
```
Searching for `"oraculo"` yields 0 matches, whereas searching for `"oráculo"` yields 5 matches. Searching for `"automacao"` yields 0 matches, whereas `"automação"` yields 2 matches. No diacritic normalization (`.normalize('NFD').replace(/[\u0300-\u036f]/g, '')`) is performed.

### Obs 1.7: DAG Acyclicity and Bezier Math Verification
Running `test/challenge_tree_engine.js` executed 32 automated tests across 5 sections:
- **DAG Acyclicity**: 0 cycles detected. Tarjan's SCC produced exactly 9 singleton components. Level monotonicity holds strictly ($level(u) < level(v)$ for all edges).
- **Topological Sorting**: Kahn's algorithm successfully visited all 9 nodes. Reachability from root `NODE_01` to leaves `NODE_08` and `NODE_09` is 100%.
- **Bezier Geometry**: Tested across 9 extreme viewport configurations (320px narrow mobile, 4K ultrawide, zero dimensions, negative offsets, reversed layout $targetX < sourceX$, coincident nodes, $10^{12}$ coordinates, subpixel floats). In all cases, `sourceX`, `sourceY`, `targetX`, `targetY`, `cx1`, `cy1`, `cx2`, `cy2`, and `deltaX` remained finite numbers with zero `NaN` and zero `Infinity`. 10,000 evaluations completed in under 5ms.

---

## 2. Logic Chain

1. **Premise 1 (Obs 1.1 & Obs 1.4)**: `concepts.js` is the authoritative taxonomy for the platform. `NODE_03` omits `'Heartbeat'` from its tags, which violates the specification expected by `TC-T1-F12-05`.
2. **Premise 2 (Obs 1.2 & Obs 1.3)**: `treeEngine.js` subscribes directly to `store` updates and invokes `this.updateState()` upon every store change. Because `treeEngine.js` fails to validate that `filterDifficulty` is a string before calling `.toLowerCase()`, and fails to coerce `searchQuery` to a string before calling `.trim()`, any valid or external dispatch with `null`, `undefined`, or non-string values immediately crashes the user interface with an unhandled `TypeError`.
3. **Premise 3 (Obs 1.5)**: The interface contract for Teacher Mode ("Unlock All") is inconsistent between `store.js` and `treeEngine.js`. `store.getState().unlockedNodes` fails to include all nodes when Teacher Mode is active, causing 3 critical test assertions (`TC-T1-F03-05`, `CF01`, `UJ02`) to fail.
4. **Premise 4 (Obs 1.6)**: Because the platform is built for Portuguese-speaking students at Inteli, failing to normalize diacritics in `treeEngine.js` breaks fundamental usability when students type unaccented search terms like "oraculo".
5. **Synthesis (Obs 1.7)**: While the graph-theoretical foundations of the DAG (acyclicity, topological ordering, and cubic bezier geometry) are mathematically sound and robust, the implementation code in `treeEngine.js`, `concepts.js`, and `store.js` contains active runtime bugs and specification violations that break the test suite.

Therefore, the verdict must be **FAIL**.

---

## 3. Caveats

- **DOM Environment**: The tests were executed in a Node.js test environment with mock DOM primitives. Canvas 2D frame rendering at 60fps was not challenged under heavy hardware acceleration constraints.
- **Transitive Edges**: Identified redundant transitive edges (`NODE_01 -> NODE_06` while `NODE_04 -> NODE_06` already implies `NODE_01`; and `NODE_01 -> NODE_07` while `NODE_04 -> NODE_07` already implies `NODE_01`). These do not violate DAG properties, but represent redundant edges that could clutter SVG connector rendering.
- **Drawer Null Reference**: `TC-T2-F04-02` in `cli_runner.js` failed due to `.drawer-close-btn` event listener attachment when `innerHTML` is re-rendered in headless mode. While primarily related to `drawer.js`, it affects node interaction when clicked from `treeEngine.js`.

---

## 4. Conclusion

**Verdict: FAIL**

The implementation of `treeEngine.js` and `concepts.js` cannot be approved in its current state due to:
1. **[CRITICAL] Runtime Crash Vulnerability**: `treeEngine.js:220` crashes on `filterDiff.toLowerCase()` when `filterDifficulty` is `null` or `undefined`.
2. **[CRITICAL] Type Error Vulnerability**: `treeEngine.js:206` crashes on `(state.searchQuery || '').trim()` when `searchQuery` is non-string.
3. **[HIGH] Contract Violation**: `store.getState().unlockedNodes` fails to unlock all 9 nodes in Teacher Mode, breaking 3 E2E test suites (`TC-T1-F03-05`, `CF01`, `UJ02`).
4. **[MEDIUM] Specification Defect**: `concepts.js:68` misses `'Heartbeat'` tag on `NODE_03`, breaking `TC-T1-F12-05`.
5. **[MEDIUM] Search UX Flaw**: Lack of diacritic normalization prevents searching Portuguese terms without accents ("oraculo").

### Required Mitigations for Developer:
1. In `src/tree/treeEngine.js`:
   - Change line 206 to:
     ```javascript
     const query = String(state.searchQuery || '').trim().toLowerCase();
     ```
   - Change line 220 to:
     ```javascript
     const matchesDiff = filterDiff === 'all' ||
       (typeof filterDiff === 'string' && concept.difficulty.toLowerCase() === filterDiff.toLowerCase());
     ```
   - Normalize diacritics in search:
     ```javascript
     const norm = (str) => String(str || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
     const query = norm(state.searchQuery).trim();
     const matchesSearch = !query ||
       norm(concept.title).includes(query) ||
       norm(concept.subtitle).includes(query) ||
       concept.tags.some(t => norm(t).includes(query)) ||
       norm(concept.coreConcept).includes(query);
     ```
2. In `src/data/concepts.js`:
   - Add `'Heartbeat'` to `NODE_03` tags:
     ```javascript
     tags: ['Push Model', 'Pull Model', 'Pyth Network', 'Chainlink Data Feeds', 'Gas Optimization', 'Heartbeat'],
     ```
3. In `src/state/store.js`:
   - In `_recalculateUnlockedNodes()`:
     ```javascript
     if (this._state.teacherMode && this._conceptsMap.size > 0) {
       this._state.unlockedNodes = Array.from(this._conceptsMap.keys());
       return;
     }
     ```
   - In `SET_TEACHER_MODE`, invoke `this._recalculateUnlockedNodes()` when `enabled` changes.

---

## 5. Verification Method

To independently verify these findings, run:

1. **Adversarial Challenge Test Suite**:
   ```powershell
   node test/challenge_tree_engine.js
   ```
   *Expected outcome*: 32 tests pass, empirically demonstrating acyclicity, topological sort completeness, finite bezier math, and logging confirmed findings for null difficulty crash, teacher mode divergence, and missing tags.

2. **Full Project E2E Suite**:
   ```powershell
   node test/cli_runner.js
   ```
   *Expected outcome*: Exits with code 1, reporting 5 failures (including `TC-T1-F03-05`, `TC-T1-F12-05`, `CF01`, `UJ02`).

3. **Crash Reproduction One-Liners**:
   ```powershell
   # Reproduce filterDiff null crash:
   node -e "import('./src/tree/treeEngine.js').then(async m => { const s = (await import('./src/state/store.js')).default; s.dispatch('SET_FILTER', { key: 'difficulty', value: null }); m.default.updateState(); });"

   # Reproduce unaccented search mismatch:
   node -e "import('./src/data/concepts.js').then(m => { console.log('oraculo matches:', m.CONCEPTS.filter(c => c.title.toLowerCase().includes('oraculo')).length); });"
   ```

**Invalidation Conditions**: This FAIL verdict is invalidated only when all 5 test failures in `cli_runner.js` pass (253/253 passing) and `treeEngine.js` safely handles non-string and null filter payloads without unhandled exceptions.
