/**
 * CLI Test Runner for Node.js
 * Blockchain Oracles Educational Platform
 */

const harness = require('./test_harness.js');

async function runCli() {
  console.log('===============================================================');
  console.log('⚡ Blockchain Oracles Educational Platform — E2E Test Runner ⚡');
  console.log('===============================================================\n');

  // Load the test specifications
  require('./e2e_spec.js');

  const reg = harness.getRegistry();
  let totalTests = 0;
  for (const s of reg.suites) totalTests += s.tests.length;

  console.log(`Discovered ${totalTests} test cases across ${reg.suites.length} suites.\nExecuting test suite...`);

  const results = await harness.run((progress) => {
    if (progress.executed % 50 === 0 || progress.executed === progress.total) {
      process.stdout.write(`\rProgress: ${progress.executed}/${progress.total} tests executed (${progress.passed} passed, ${progress.failed} failed)...`);
    }
  });

  console.log('\n\n===============================================================');
  console.log('📊 TEST EXECUTION SUMMARY');
  console.log('===============================================================');
  console.log(`Total Test Cases : ${results.total}`);
  console.log(`Passed           : \x1b[32m${results.passed}\x1b[0m`);
  console.log(`Failed           : ${results.failed > 0 ? `\x1b[31m${results.failed}\x1b[0m` : '0'}`);
  console.log(`Duration         : ${results.duration} ms\n`);

  console.log('--- Tier Distribution ---');
  for (const [tier, stats] of Object.entries(results.tierStats)) {
    console.log(`Tier ${tier}: ${stats.passed}/${stats.total} passed (${stats.failed} failed)`);
  }

  console.log('\n--- Feature Coverage ---');
  const featEntries = Object.entries(results.featureStats).sort(([a], [b]) => a.localeCompare(b));
  for (const [feat, stats] of featEntries) {
    const status = stats.failed === 0 ? '\x1b[32mPASS\x1b[0m' : '\x1b[31mFAIL\x1b[0m';
    console.log(`  [${status}] ${feat.padEnd(8)}: ${stats.passed}/${stats.total} passed`);
  }

  if (results.failed > 0) {
    console.log('\n===============================================================');
    console.log('❌ FAILURES:');
    console.log('===============================================================');
    for (const r of results.results) {
      if (r.status === 'FAILED') {
        console.log(`\n• [${r.feature}] [Tier ${r.tier}] ${r.suiteTitle} > ${r.title}`);
        console.log(`  Error: ${r.error}`);
      }
    }
    console.log('===============================================================');
    process.exit(1);
  } else {
    console.log('\n\x1b[32m✔ 100% OF TESTS PASSED WITH ZERO INTEGRITY DEFECTS!\x1b[0m\n');
    process.exit(0);
  }
}

runCli().catch((err) => {
  console.error('Fatal test runner error:', err);
  process.exit(1);
});
