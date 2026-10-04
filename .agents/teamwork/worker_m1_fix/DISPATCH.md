# Dispatch: worker_m1_fix (Milestone 1 Remediation Worker)

- **Role**: Worker (teamwork_preview_worker)
- **Working Directory**: c:\Users\Inteli\workspace\modulo-3\Blockas\Plano_de_aulas\.agents\teamwork\worker_m1_fix
- **Project Directory**: c:\Users\Inteli\workspace\modulo-3\Blockas\Plano_de_aulas\estudo_oraculos
- **Authoritative Request**: c:\Users\Inteli\workspace\modulo-3\Blockas\Plano_de_aulas\.agents\teamwork\ORIGINAL_REQUEST.md
- **Project Scope Document**: c:\Users\Inteli\workspace\modulo-3\Blockas\Plano_de_aulas\.agents\teamwork\PROJECT.md
- **Auditor Evidence Report (UNFILTERED)**: c:\Users\Inteli\workspace\modulo-3\Blockas\Plano_de_aulas\.agents\teamwork\auditor_m1_1\handoff.md
- **Explorer Remediation Blueprints**:
  - `c:\Users\Inteli\workspace\modulo-3\Blockas\Plano_de_aulas\.agents\teamwork\m1_remediation_explorer_1\handoff.md`
  - `c:\Users\Inteli\workspace\modulo-3\Blockas\Plano_de_aulas\.agents\teamwork\m1_remediation_explorer_1\proposed_store.js`
  - `c:\Users\Inteli\workspace\modulo-3\Blockas\Plano_de_aulas\.agents\teamwork\m1_remediation_explorer_2\handoff.md`
  - `c:\Users\Inteli\workspace\modulo-3\Blockas\Plano_de_aulas\.agents\teamwork\m1_remediation_explorer_3\handoff.md`

## Mandatory Integrity Warning
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Remediation Scope
Implement the concrete, verified fixes identified by the Explorers to eliminate all audit and challenge failures:
1. `estudo_oraculos/src/state/store.js`:
   - Genuine Teacher Mode: when `teacherMode` is true, populate `unlockedNodes` with all 9 concepts so `store.getState().unlockedNodes.length === 9`.
   - Null payload safety: normalize `safePayload = (payload !== null && typeof payload === 'object') ? payload : {}`.
   - Ingestion sanitization: sanitize `completedNodes` in `_loadFromStorage` and `registerConcepts`.
   - Deep freeze immutability: `Object.freeze([...this._state.unlockedNodes])` and `Object.freeze([...this._state.completedNodes])`.
   - Preserve manual unlocks in `_manualUnlockedNodes`.
   *(Refer to proposed_store.js in m1_remediation_explorer_1)*
2. `estudo_oraculos/src/ui/drawer.js`:
   - Defensively guard `closeBtn.addEventListener`, `toggleBtn.addEventListener`, and `typeof closeBtn.focus === 'function'`.
   - Provide safe fallback for `showModal()` and `close()`.
   *(Refer to handoff.md in m1_remediation_explorer_2)*
3. `estudo_oraculos/src/tree/treeEngine.js`:
   - Introduce `normalizeSearchText(val)` helper removing diacritics and handling non-string types.
   - Guard `filterDiff` against null/undefined before checking difficulty.
   - Guard `searchQuery` against numbers/non-strings.
   - Implement Portuguese diacritic-insensitive search matching ("oraculo" -> "Oráculo").
   *(Refer to handoff.md in m1_remediation_explorer_2)*
4. `estudo_oraculos/src/data/concepts.js`:
   - Add `'Heartbeat'` to `tags` of `NODE_03`.

## Write Ownership
You exclusively own:
- `estudo_oraculos/src/state/store.js`
- `estudo_oraculos/src/ui/drawer.js`
- `estudo_oraculos/src/tree/treeEngine.js`
- `estudo_oraculos/src/data/concepts.js`

## Mandatory Execution & Verification Requirements
You MUST execute the official project test suites using terminal commands:
1. `node test/cli_runner.js` — MUST achieve 253/253 passing tests (100% PASS, 0 failures, exit code 0).
2. `node test/stress_store.js` — MUST achieve 29/29 passing tests (100% PASS, 0 failures, exit code 0).
3. `node test/challenge_tree_engine.js` — MUST achieve 32/32 passing tests (100% PASS, 0 failures, exit code 0).
DO NOT create or rely on bespoke/isolated verification scripts. Include verbatim output of all three official test suites in your `handoff.md`.


## 2026-10-04T20:10:40Z
You are worker_m1_fix, a teamwork_preview_worker.
Your working directory is: c:\Users\Inteli\workspace\modulo-3\Blockas\Plano_de_aulas\.agents\teamwork\worker_m1_fix
Target project directory: c:\Users\Inteli\workspace\modulo-3\Blockas\Plano_de_aulas\estudo_oraculos
MANDATORY: Read the authoritative request file FIRST:
c:\Users\Inteli\workspace\modulo-3\Blockas\Plano_de_aulas\.agents\teamwork\ORIGINAL_REQUEST.md
Also read the project scope document:
c:\Users\Inteli\workspace\modulo-3\Blockas\Plano_de_aulas\.agents\teamwork\PROJECT.md
Also read your dispatch file at:
c:\Users\Inteli\workspace\modulo-3\Blockas\Plano_de_aulas\.agents\teamwork\worker_m1_fix\DISPATCH.md
Read the full unfiltered forensic auditor report:
c:\Users\Inteli\workspace\modulo-3\Blockas\Plano_de_aulas\.agents\teamwork\auditor_m1_1\handoff.md
Read the remediation blueprints from the 3 Explorers:
- c:\Users\Inteli\workspace\modulo-3\Blockas\Plano_de_aulas\.agents\teamwork\m1_remediation_explorer_1\handoff.md (and proposed_store.js)
- c:\Users\Inteli\workspace\modulo-3\Blockas\Plano_de_aulas\.agents\teamwork\m1_remediation_explorer_2\handoff.md
- c:\Users\Inteli\workspace\modulo-3\Blockas\Plano_de_aulas\.agents\teamwork\m1_remediation_explorer_3\handoff.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Remediate:
1. store.js: Genuine Teacher Mode unlock-all, safe null payload destructuring, deep freeze immutability, storage type hygiene, manual unlock preservation.
2. drawer.js: Null guards on event listeners and closeBtn.focus, headless dialog fallback.
3. treeEngine.js: normalizeSearchText helper (diacritics NFD), null difficulty filter guard, numeric search query guard.
4. concepts.js: Add 'Heartbeat' to NODE_03 tags.

MANDATORY VERIFICATION:
Run the official project test suites via run_command:
- node test/cli_runner.js (MUST be 253/253 PASS, exit code 0)
- node test/stress_store.js (MUST be 29/29 PASS, exit code 0)
- node test/challenge_tree_engine.js (MUST be 32/32 PASS, exit code 0)
Report verbatim test outputs in handoff.md and send a message when finished.
