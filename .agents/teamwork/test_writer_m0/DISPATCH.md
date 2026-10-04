# Dispatch: test_writer_m0 (E2E Testing Track)

- **Role**: Test Writer (teamwork_preview_test_writer)
- **Working Directory**: c:\Users\Inteli\workspace\modulo-3\Blockas\Plano_de_aulas\.agents\teamwork\test_writer_m0
- **Project Directory**: c:\Users\Inteli\workspace\modulo-3\Blockas\Plano_de_aulas\estudo_oraculos
- **Authoritative Request**: c:\Users\Inteli\workspace\modulo-3\Blockas\Plano_de_aulas\.agents\teamwork\ORIGINAL_REQUEST.md
- **Project Scope Document**: c:\Users\Inteli\workspace\modulo-3\Blockas\Plano_de_aulas\.agents\teamwork\PROJECT.md

## Scope & Mandate
You are the E2E Test Writer for the Blockchain Oracles Educational Platform.
Your mission is to establish the test infrastructure and author a comprehensive, requirement-driven, opaque-box E2E test suite covering all 22 features (F01 to F22) in PROJECT.md across the 4 systematic tiers:
- Tier 1: Feature Coverage (>=5 test cases per feature, covering all 22 features = >=110 test cases)
- Tier 2: Boundary & Corner Cases (>=5 per feature, boundary conditions, limits, error states = >=110 test cases)
- Tier 3: Cross-Feature Combinations (pairwise interactions, state sharing = >=22 test cases)
- Tier 4: Real-World Application Scenarios (end-to-end user journeys, classroom flows = >=11 test cases)
Total minimum test cases: >= 253 test cases.

## File Ownership
You exclusively own:
- `estudo_oraculos/test/runner.html` (Standalone browser-executable test runner and UI dashboard)
- `estudo_oraculos/test/e2e_spec.js` (Modular test definitions with assertions)
- `estudo_oraculos/test/test_harness.js` (Opaque-box testing harness, mock environment & assert helpers)
- Metadata: `c:\Users\Inteli\workspace\modulo-3\Blockas\Plano_de_aulas\.agents\teamwork\TEST_INFRA.md` (Test architecture, inventory, tiers)
- Metadata: `c:\Users\Inteli\workspace\modulo-3\Blockas\Plano_de_aulas\.agents\teamwork\TEST_READY.md` (Signal that test suite is ready with runner instructions and coverage summary)

## Execution & Verification
Execute the test runner using headless browser or Node.js/command line verification to ensure the test runner loads and executes assertions properly.
Deliver your report in `handoff.md` and publish `TEST_INFRA.md` and `TEST_READY.md`.

## 2026-10-04T19:38:46Z
You are test_writer_m0, a teamwork_preview_test_writer.
Your working directory is: c:\Users\Inteli\workspace\modulo-3\Blockas\Plano_de_aulas\.agents\teamwork\test_writer_m0
Target project directory: c:\Users\Inteli\workspace\modulo-3\Blockas\Plano_de_aulas\estudo_oraculos
MANDATORY: Read the authoritative request file FIRST:
c:\Users\Inteli\workspace\modulo-3\Blockas\Plano_de_aulas\.agents\teamwork\ORIGINAL_REQUEST.md
Also read the project scope document:
c:\Users\Inteli\workspace\modulo-3\Blockas\Plano_de_aulas\.agents\teamwork\PROJECT.md
Also read your dispatch file at:
c:\Users\Inteli\workspace\modulo-3\Blockas\Plano_de_aulas\.agents\teamwork\test_writer_m0\DISPATCH.md

You are the E2E Test Writer for the project. Implement the complete, opaque-box E2E test suite in estudo_oraculos/test/ with runner.html, e2e_spec.js, and test_harness.js covering all 22 features (F01 to F22) across Tiers 1-4 (minimum >=253 test cases).
Generate TEST_INFRA.md and TEST_READY.md in c:\Users\Inteli\workspace\modulo-3\Blockas\Plano_de_aulas\.agents\teamwork\
Verify execution of tests. Write your report to handoff.md and send a message with the path when finished.
