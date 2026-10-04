import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

const projectDir = 'c:/Users/Inteli/workspace/modulo-3/Blockas/Plano_de_aulas/estudo_oraculos';

// 1. Verify existence of all required files
const requiredFiles = [
  'index.html',
  'styles/main.css',
  'styles/components.css',
  'styles/tree.css',
  'src/main.js',
  'src/state/store.js',
  'src/data/concepts.js',
  'src/tree/treeEngine.js',
  'src/ui/drawer.js',
  'src/ui/notifications.js'
];

console.log('Checking required files:');
for (const rel of requiredFiles) {
  const full = path.join(projectDir, rel);
  if (!fs.existsSync(full)) {
    throw new Error(`Missing required file: ${rel}`);
  }
  const stat = fs.statSync(full);
  console.log(`  ✓ ${rel} (${stat.size} bytes)`);
}

// 2. Check index.html contents
const indexHtml = fs.readFileSync(path.join(projectDir, 'index.html'), 'utf8');

const requiredSelectors = [
  'id="tree-section"',
  'id="simulations-section"',
  'id="theory-section"',
  'id="codelab-section"',
  'id="tree-container"',
  'id="concept-drawer"',
  'id="toast-container"',
  'id="teacher-mode-toggle"',
  'id="search-input"',
  'id="filter-level"',
  'id="btn-reset-progress"',
  'id="progress-stat"',
  'id="progress-bar-fill"',
  'src="src/main.js"'
];

console.log('\nChecking index.html structure:');
for (const sel of requiredSelectors) {
  if (!indexHtml.includes(sel)) {
    throw new Error(`Missing expected selector/content in index.html: ${sel}`);
  }
  console.log(`  ✓ Contains ${sel}`);
}

// 3. Test concepts data
const conceptsUrl = pathToFileURL(path.join(projectDir, 'src/data/concepts.js')).href;
const storeUrl = pathToFileURL(path.join(projectDir, 'src/state/store.js')).href;

import(conceptsUrl).then(conceptsMod => {
  const { CONCEPTS, CONCEPTS_BY_ID, LEVELS } = conceptsMod;

  console.log('\nValidating concepts dataset:');
  console.log(`  Total concepts: ${CONCEPTS.length}`);
  if (CONCEPTS.length !== 9) throw new Error(`Expected 9 concepts, got ${CONCEPTS.length}`);

  const requiredIds = ['NODE_01', 'NODE_02', 'NODE_03', 'NODE_04', 'NODE_05', 'NODE_06', 'NODE_07', 'NODE_08', 'NODE_09'];
  for (const id of requiredIds) {
    const c = CONCEPTS_BY_ID.get(id);
    if (!c) throw new Error(`Missing concept: ${id}`);
    if (typeof c.level !== 'number') throw new Error(`Concept ${id} missing level number`);
    if (!c.title) throw new Error(`Concept ${id} missing title`);
    if (!c.coreConcept) throw new Error(`Concept ${id} missing coreConcept`);
    if (!c.technicalImpact) throw new Error(`Concept ${id} missing technicalImpact`);
    if (!c.pitfall) throw new Error(`Concept ${id} missing pitfall`);
    if (!c.didacticQuestion) throw new Error(`Concept ${id} missing didacticQuestion`);
    console.log(`  ✓ ${id}: ${c.title} (Level ${c.level}, ${c.difficulty})`);
  }

  // 4. Test Store State Transitions
  return import(storeUrl).then(storeMod => {
    const store = storeMod.default;
    store.registerConcepts(CONCEPTS);

    console.log('\nTesting Store state transitions:');
    store.dispatch('RESET_PROGRESS');
    let state = store.getState();
    console.log('  State after RESET_PROGRESS:');
    console.log(`    completedNodes: [${state.completedNodes.join(', ')}]`);
    console.log(`    unlockedNodes: [${state.unlockedNodes.join(', ')}]`);
    if (state.completedNodes.length !== 0) throw new Error('completedNodes should be empty');
    if (!state.unlockedNodes.includes('NODE_01')) throw new Error('NODE_01 must be unlocked initially');

    // Complete NODE_01 -> NODE_02 should unlock
    store.dispatch('COMPLETE_NODE', { nodeId: 'NODE_01' });
    state = store.getState();
    if (!state.completedNodes.includes('NODE_01')) throw new Error('NODE_01 should be completed');
    if (!state.unlockedNodes.includes('NODE_02')) throw new Error('NODE_02 should unlock after NODE_01');
    console.log(`  ✓ Completing NODE_01 unlocked: [${state.unlockedNodes.join(', ')}]`);

    // Complete NODE_02 -> NODE_03 and NODE_04 should unlock
    store.dispatch('COMPLETE_NODE', { nodeId: 'NODE_02' });
    state = store.getState();
    if (!state.unlockedNodes.includes('NODE_03') || !state.unlockedNodes.includes('NODE_04')) {
      throw new Error('NODE_03 and NODE_04 should unlock after NODE_02');
    }
    console.log(`  ✓ Completing NODE_02 unlocked: [${state.unlockedNodes.join(', ')}]`);

    // Complete NODE_03 and NODE_04 -> NODE_05 should unlock
    store.dispatch('COMPLETE_NODE', { nodeId: 'NODE_03' });
    store.dispatch('COMPLETE_NODE', { nodeId: 'NODE_04' });
    state = store.getState();
    if (!state.unlockedNodes.includes('NODE_05')) {
      throw new Error('NODE_05 should unlock after NODE_03 and NODE_04');
    }
    console.log(`  ✓ Completing NODE_03 + NODE_04 unlocked NODE_05`);

    // Test Teacher Mode
    store.dispatch('SET_TEACHER_MODE', { enabled: true });
    state = store.getState();
    if (state.teacherMode !== true) throw new Error('Teacher mode should be true');
    console.log(`  ✓ Teacher mode enabled: ${state.teacherMode}`);

    // Test Filter
    store.dispatch('SET_FILTER', { key: 'level', value: '2' });
    store.dispatch('SET_FILTER', { key: 'difficulty', value: 'Intermediário' });
    store.dispatch('SET_FILTER', { key: 'search', value: 'DON' });
    state = store.getState();
    if (state.filterLevel !== '2') throw new Error('filterLevel should be 2');
    if (state.filterDifficulty !== 'Intermediário') throw new Error('filterDifficulty should be Intermediário');
    if (state.searchQuery !== 'DON') throw new Error('searchQuery should be DON');
    console.log(`  ✓ Filters verified: level=${state.filterLevel}, difficulty=${state.filterDifficulty}, search="${state.searchQuery}"`);

    // Reset back
    store.dispatch('RESET_PROGRESS');
    store.dispatch('SET_TEACHER_MODE', { enabled: false });
    store.dispatch('SET_FILTER', { key: 'level', value: 'all' });
    store.dispatch('SET_FILTER', { key: 'difficulty', value: 'all' });
    store.dispatch('SET_FILTER', { key: 'search', value: '' });

    console.log('\n=======================================');
    console.log('ALL VERIFICATION CHECKS PASSED PERFECTLY!');
    console.log('=======================================');
  });
}).catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
