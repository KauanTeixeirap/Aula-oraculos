# Dispatch: worker_m1 (Milestone 1: Core Shell, Concept Tree & UI Core)

- **Role**: Worker (teamwork_preview_worker)
- **Working Directory**: c:\Users\Inteli\workspace\modulo-3\Blockas\Plano_de_aulas\.agents\teamwork\worker_m1
- **Project Directory**: c:\Users\Inteli\workspace\modulo-3\Blockas\Plano_de_aulas\estudo_oraculos
- **Authoritative Request**: c:\Users\Inteli\workspace\modulo-3\Blockas\Plano_de_aulas\.agents\teamwork\ORIGINAL_REQUEST.md
- **Project Scope Document**: c:\Users\Inteli\workspace\modulo-3\Blockas\Plano_de_aulas\.agents\teamwork\PROJECT.md
- **Explorer Findings**:
  - `c:\Users\Inteli\workspace\modulo-3\Blockas\Plano_de_aulas\.agents\teamwork\survey_explorer_1\simulation_tree_analysis.md`
  - `c:\Users\Inteli\workspace\modulo-3\Blockas\Plano_de_aulas\.agents\teamwork\survey_miner_1\spec_analysis.md`

## Mandatory Integrity Warning
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

## Scope of Milestone 1
Implement Features F01, F02, F03, F04, F05, F06, and F22:
1. Application Shell (`estudo_oraculos/index.html`): Semantic HTML5 layout with Header/Hero, Concept Tree section, Simulations placeholders, Theory sections, Code Lab container, and Toast container.
2. Styling (`styles/main.css`, `styles/components.css`, `styles/tree.css`): Modern Web3 design tokens, responsive grid/flexbox, Glassmorphism, accessible dark mode contrast, node badges, connection lines.
3. State Store (`src/state/store.js`): Reactive store supporting actions `UNLOCK_NODE`, `COMPLETE_NODE`, `SET_TEACHER_MODE`, `SELECT_NODE`, `SET_FILTER`, `RESET_PROGRESS`, with automatic localStorage persistence and memory fallback.
4. Concept Data (`src/data/concepts.js`): Complete 5-level hierarchy (Levels 0 through 4, 9 conceptual nodes) with title, subtitle, level, difficulty, prerequisites, technical impact, code snippet preview, and reflection questions.
5. Tree Engine (`src/tree/treeEngine.js`): Responsive SVG/DOM DAG renderer, dynamic bezier curve connector calculations, student mode prerequisite locking vs teacher mode ("Modo Instrutor") instant bypass, filtering by level and difficulty, debounced search.
6. Detail Drawer (`src/ui/drawer.js`): Sliding inspection drawer showing full conceptual depth, mathematical formulation, technical impact, and mark-as-completed action.
7. Notifications (`src/ui/notifications.js`): Non-blocking alert system for unlocks, resets, and consensus warnings.
8. Main Entrypoint (`src/main.js`): Initializes store, tree engine, filters, event listeners, and drawer.

## Write Ownership
You exclusively own:
- `estudo_oraculos/index.html`
- `estudo_oraculos/styles/main.css`
- `estudo_oraculos/styles/components.css`
- `estudo_oraculos/styles/tree.css`
- `estudo_oraculos/src/main.js`
- `estudo_oraculos/src/state/store.js`
- `estudo_oraculos/src/data/concepts.js`
- `estudo_oraculos/src/tree/treeEngine.js`
- `estudo_oraculos/src/ui/drawer.js`
- `estudo_oraculos/src/ui/notifications.js`
Do NOT edit any files in `test/` or `contracts/` or `src/simulations/` in this milestone.

## Execution & Verification
1. Ensure `estudo_oraculos` directory and all required subdirectories are created.
2. Validate using PowerShell / Node.js static check that all files exist, are syntactically valid JavaScript/CSS/HTML, and can be served cleanly without 404s.
3. Write your report in `handoff.md`.


## 2026-10-04T19:38:46Z
You are worker_m1, a teamwork_preview_worker.
Your working directory is: c:\Users\Inteli\workspace\modulo-3\Blockas\Plano_de_aulas\.agents\teamwork\worker_m1
Target project directory: c:\Users\Inteli\workspace\modulo-3\Blockas\Plano_de_aulas\estudo_oraculos
MANDATORY: Read the authoritative request file FIRST:
c:\Users\Inteli\workspace\modulo-3\Blockas\Plano_de_aulas\.agents\teamwork\ORIGINAL_REQUEST.md
Also read the project scope document:
c:\Users\Inteli\workspace\modulo-3\Blockas\Plano_de_aulas\.agents\teamwork\PROJECT.md
Also read your dispatch file at:
c:\Users\Inteli\workspace\modulo-3\Blockas\Plano_de_aulas\.agents\teamwork\worker_m1\DISPATCH.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Implement Milestone 1 (F01, F02, F03, F04, F05, F06, F22): App Shell, CSS design system, reactive state store, complete 9-node concepts data, interactive DAG tree engine, concept detail drawer, notifications, and entrypoint in estudo_oraculos.
Verify builds/syntax and functionality. Write your report to handoff.md and send a message with the path when finished.
