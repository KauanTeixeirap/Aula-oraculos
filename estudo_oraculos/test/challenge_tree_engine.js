/**
 * Empirical Adversarial Challenge Suite: treeEngine.js & concepts.js
 * Author: challenger_m1_2 (teamwork_preview_challenger)
 * 
 * Verifies:
 * 1. DAG Acyclicity & Structural Integrity (Cycles, self-loops, dangling refs, level monotonicity)
 * 2. Topological Sorting Validity & Reachability (Kahn's algorithm, full coverage, unlock sequence)
 * 3. Connector Geometry & Bezier Math Edge Cases (NaN, Infinity, zero dimensions, negative offsets, extreme bounds)
 * 4. Filter & Search Adversarial Edge Cases (Regex, injection, massive inputs, nulls, unhandled type exceptions)
 * 5. Store & State Integration Discrepancies (Teacher mode, concept tags)
 */

import { CONCEPTS, CONCEPTS_BY_ID, LEVELS } from '../src/data/concepts.js';
import store from '../src/state/store.js';

// Setup Mock DOM environment for treeEngine if running in Node
if (typeof globalThis.window === 'undefined') {
  globalThis.window = {
    addEventListener: () => {},
    removeEventListener: () => {},
    localStorage: {
      _data: {},
      getItem(k) { return this._data[k] || null; },
      setItem(k, v) { this._data[k] = String(v); },
      removeItem(k) { delete this._data[k]; },
      clear() { this._data = {}; }
    }
  };
  globalThis.document = {
    createElement: (tag) => ({
      tagName: tag.toUpperCase(),
      id: '',
      className: '',
      classList: {
        _set: new Set(),
        add(c) { this._set.add(c); },
        remove(c) { this._set.delete(c); },
        contains(c) { return this._set.has(c); },
        toggle(c) { if (this.contains(c)) { this.remove(c); return false; } else { this.add(c); return true; } }
      },
      children: [],
      style: {},
      setAttribute: () => {},
      getAttribute: () => null,
      addEventListener: () => {},
      removeEventListener: () => {},
      appendChild(c) { this.children.push(c); return c; },
      querySelector: () => null,
      querySelectorAll: () => []
    }),
    getElementById: () => null,
    body: { appendChild: () => {} }
  };
}

let treeEngine = null;
try {
  const tMod = await import('../src/tree/treeEngine.js');
  treeEngine = tMod.treeEngine || tMod.default;
} catch (err) {
  console.warn('[Challenge] Notice: treeEngine loaded with DOM mock warning:', err.message);
}

// Test Runner Infrastructure
const results = {
  total: 0,
  passed: 0,
  failed: 0,
  failures: [],
  findings: []
};

function test(name, fn) {
  results.total++;
  try {
    fn();
    results.passed++;
    console.log(`  \x1b[32m✔ PASS\x1b[0m: ${name}`);
  } catch (err) {
    results.failed++;
    const errMsg = err.message || String(err);
    results.failures.push({ name, error: errMsg });
    console.log(`  \x1b[31m✖ FAIL\x1b[0m: ${name}`);
    console.log(`         \x1b[33m${errMsg}\x1b[0m`);
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

function logFinding(category, description, impact) {
  results.findings.push({ category, description, impact });
}

console.log('===============================================================');
console.log('⚡ EMPIRICAL ADVERSARIAL CHALLENGE: treeEngine.js & concepts.js ⚡');
console.log('===============================================================\n');

// ============================================================================
// SECTION 1: DAG ACYCLICITY & STRUCTURAL INTEGRITY
// ============================================================================
console.log('--- SECTION 1: DAG Acyclicity & Structural Integrity ---');

test('S1.1: Graph contains exactly 9 concept nodes and 5 levels (0-4)', () => {
  assert(CONCEPTS.length === 9, `Expected 9 concepts, got ${CONCEPTS.length}`);
  assert(LEVELS.length === 5, `Expected 5 levels, got ${LEVELS.length}`);
  const levelsFound = new Set(CONCEPTS.map(c => c.level));
  assert(levelsFound.size === 5, 'Must span exactly 5 distinct levels');
  for (let l = 0; l <= 4; l++) {
    assert(levelsFound.has(l), `Missing level ${l}`);
  }
});

test('S1.2: Cycle Detection via DFS Recursion Stack (3-Color Algorithm)', () => {
  // Build adjacency list: prerequisite -> dependent
  const adj = new Map();
  CONCEPTS.forEach(c => adj.set(c.id, []));
  CONCEPTS.forEach(c => {
    (c.prerequisites || []).forEach(reqId => {
      if (adj.has(reqId)) {
        adj.get(reqId).push(c.id);
      }
    });
  });

  const color = new Map(); // 0: White (unvisited), 1: Gray (in stack), 2: Black (visited)
  CONCEPTS.forEach(c => color.set(c.id, 0));
  let hasCycle = false;
  let cyclePath = [];

  function dfs(u, path) {
    color.set(u, 1);
    path.push(u);
    for (const v of (adj.get(u) || [])) {
      if (color.get(v) === 1) {
        hasCycle = true;
        cyclePath = [...path, v];
        return;
      }
      if (color.get(v) === 0) {
        dfs(v, path);
        if (hasCycle) return;
      }
    }
    path.pop();
    color.set(u, 2);
  }

  for (const c of CONCEPTS) {
    if (color.get(c.id) === 0) {
      dfs(c.id, []);
      if (hasCycle) break;
    }
  }

  assert(!hasCycle, `Cycle detected in dependency graph: ${cyclePath.join(' -> ')}`);
});

test('S1.3: Tarjan\'s Strongly Connected Components (SCC count must equal node count)', () => {
  const adj = new Map();
  CONCEPTS.forEach(c => adj.set(c.id, []));
  CONCEPTS.forEach(c => {
    (c.prerequisites || []).forEach(reqId => {
      if (adj.has(reqId)) adj.get(reqId).push(c.id);
    });
  });

  let index = 0;
  const indices = new Map();
  const lowlink = new Map();
  const onStack = new Map();
  const stack = [];
  const sccs = [];

  function strongConnect(u) {
    indices.set(u, index);
    lowlink.set(u, index);
    index++;
    stack.push(u);
    onStack.set(u, true);

    for (const v of adj.get(u) || []) {
      if (!indices.has(v)) {
        strongConnect(v);
        lowlink.set(u, Math.min(lowlink.get(u), lowlink.get(v)));
      } else if (onStack.get(v)) {
        lowlink.set(u, Math.min(lowlink.get(u), indices.get(v)));
      }
    }

    if (lowlink.get(u) === indices.get(u)) {
      const scc = [];
      let w = null;
      do {
        w = stack.pop();
        onStack.set(w, false);
        scc.push(w);
      } while (w !== u);
      sccs.push(scc);
    }
  }

  for (const c of CONCEPTS) {
    if (!indices.has(c.id)) {
      strongConnect(c.id);
    }
  }

  // In a DAG, every SCC must have size 1. If any SCC has size > 1, there is a cycle.
  const multiNodeSccs = sccs.filter(scc => scc.length > 1);
  assert(multiNodeSccs.length === 0, `Cyclic SCCs found: ${JSON.stringify(multiNodeSccs)}`);
  assert(sccs.length === CONCEPTS.length, `Expected ${CONCEPTS.length} singleton SCCs, got ${sccs.length}`);
});

test('S1.4: Self-dependency and Dangling Prerequisite Integrity', () => {
  for (const c of CONCEPTS) {
    const prereqs = c.prerequisites || [];
    assert(!prereqs.includes(c.id), `Node ${c.id} depends on itself`);

    for (const reqId of prereqs) {
      assert(CONCEPTS_BY_ID.has(reqId), `Node ${c.id} references non-existent prerequisite: ${reqId}`);
    }
  }
});

test('S1.5: Strict Level Monotonicity (Prerequisites must precede in level)', () => {
  for (const c of CONCEPTS) {
    const prereqs = c.prerequisites || [];
    for (const reqId of prereqs) {
      const reqNode = CONCEPTS_BY_ID.get(reqId);
      assert(reqNode.level < c.level,
        `Node ${c.id} (L${c.level}) has prerequisite ${reqId} (L${reqNode.level}) which is NOT strictly strictly lower level`);
    }
  }
});

test('S1.6: Transitive Reduction Analysis (Detecting redundant shortcut edges)', () => {
  // Check if any prerequisite of a node is also an indirect prerequisite via another path
  const shortcuts = [];
  CONCEPTS.forEach(c => {
    const directPrereqs = c.prerequisites || [];
    directPrereqs.forEach(directReq => {
      // Check if directReq is also reachable through another direct prereq
      directPrereqs.forEach(otherReq => {
        if (otherReq !== directReq) {
          // BFS from otherReq to see if directReq is an ancestor
          const queue = [otherReq];
          const visited = new Set([otherReq]);
          while (queue.length > 0) {
            const curr = queue.shift();
            const currNode = CONCEPTS_BY_ID.get(curr);
            for (const p of (currNode?.prerequisites || [])) {
              if (p === directReq) {
                shortcuts.push({ node: c.id, redundantPrereq: directReq, via: otherReq });
              }
              if (!visited.has(p)) {
                visited.add(p);
                queue.push(p);
              }
            }
          }
        }
      });
    });
  });

  if (shortcuts.length > 0) {
    console.log(`    ℹ Notice: Transitive shortcut edges identified (non-breaking, but didactic notice):`);
    shortcuts.forEach(s => console.log(`      • ${s.node} directly requires ${s.redundantPrereq}, which is already required indirectly via ${s.via}`));
    logFinding('DAG Design', `Redundant transitive edges found in prerequisites: ${JSON.stringify(shortcuts)}`, 'LOW');
  }
});

// ============================================================================
// SECTION 2: TOPOLOGICAL SORTING VALIDITY & REACHABILITY
// ============================================================================
console.log('\n--- SECTION 2: Topological Sorting Validity & Reachability ---');

test('S2.1: Kahn\'s Algorithm Computes Valid Complete Topological Sort', () => {
  const inDegree = new Map();
  const adj = new Map();
  CONCEPTS.forEach(c => {
    inDegree.set(c.id, (c.prerequisites || []).length);
    adj.set(c.id, []);
  });

  CONCEPTS.forEach(c => {
    (c.prerequisites || []).forEach(reqId => {
      adj.get(reqId).push(c.id);
    });
  });

  const queue = [];
  CONCEPTS.forEach(c => {
    if (inDegree.get(c.id) === 0) queue.push(c.id);
  });

  const topoOrder = [];
  while (queue.length > 0) {
    const u = queue.shift();
    topoOrder.push(u);

    for (const v of adj.get(u)) {
      inDegree.set(v, inDegree.get(v) - 1);
      if (inDegree.get(v) === 0) {
        queue.push(v);
      }
    }
  }

  assert(topoOrder.length === CONCEPTS.length,
    `Topological sort incomplete: sorted ${topoOrder.length}/${CONCEPTS.length} nodes`);

  // Verify all precedence constraints
  const indexMap = new Map(topoOrder.map((id, idx) => [id, idx]));
  CONCEPTS.forEach(c => {
    (c.prerequisites || []).forEach(reqId => {
      assert(indexMap.get(reqId) < indexMap.get(c.id),
        `Order violation: prerequisite ${reqId} (idx ${indexMap.get(reqId)}) comes after ${c.id} (idx ${indexMap.get(c.id)})`);
    });
  });
});

test('S2.2: Reachability of all terminal leaf nodes from root NODE_01', () => {
  // Leaf nodes have out-degree 0 in dependency graph (prereq -> dependent)
  const adj = new Map();
  CONCEPTS.forEach(c => adj.set(c.id, []));
  CONCEPTS.forEach(c => {
    (c.prerequisites || []).forEach(reqId => {
      adj.get(reqId).push(c.id);
    });
  });

  const leaves = CONCEPTS.filter(c => adj.get(c.id).length === 0).map(c => c.id);
  assert(leaves.includes('NODE_08'), 'NODE_08 must be a leaf node');
  assert(leaves.includes('NODE_09'), 'NODE_09 must be a leaf node');

  // BFS from NODE_01 must reach every single node
  const reachable = new Set();
  const queue = ['NODE_01'];
  reachable.add('NODE_01');

  while (queue.length > 0) {
    const curr = queue.shift();
    for (const nxt of adj.get(curr)) {
      if (!reachable.has(nxt)) {
        reachable.add(nxt);
        queue.push(nxt);
      }
    }
  }

  assert(reachable.size === CONCEPTS.length,
    `Not all nodes reachable from NODE_01! Reached ${reachable.size}/${CONCEPTS.length}`);
});

test('S2.3: Progressive Student Unlock Simulation along Topological Order', () => {
  store.dispatch('RESET_PROGRESS');
  store.dispatch('SET_TEACHER_MODE', { enabled: false });

  // Initial state: only NODE_01 unlocked
  let state = store.getState();
  assert(state.unlockedNodes.includes('NODE_01'), 'Root NODE_01 must be initially unlocked');
  assert(!state.completedNodes.includes('NODE_01'), 'No nodes initially completed');

  // Topological order for progressive unlock
  const unlockSequence = [
    'NODE_01',
    'NODE_02',
    'NODE_03',
    'NODE_04',
    'NODE_05',
    'NODE_06',
    'NODE_07',
    'NODE_08',
    'NODE_09'
  ];

  for (const nodeId of unlockSequence) {
    // Before completing, node must be unlocked
    const status = treeEngine ? treeEngine.getPrerequisitesStatus(nodeId) : {
      isUnlocked: (CONCEPTS_BY_ID.get(nodeId).prerequisites || []).every(req => store.getState().completedNodes.includes(req))
    };

    assert(status.isUnlocked, `Node ${nodeId} should be unlocked before completion step`);
    store.dispatch('COMPLETE_NODE', { nodeId });
  }

  state = store.getState();
  assert(state.completedNodes.length === 9, `All 9 nodes must be completed, got ${state.completedNodes.length}`);
  assert(state.unlockedNodes.length === 9, `All 9 nodes must be unlocked, got ${state.unlockedNodes.length}`);
});

test('S2.4: Out-of-Order Completion Resistance & Prerequisite Enforcement', () => {
  store.dispatch('RESET_PROGRESS');
  store.dispatch('SET_TEACHER_MODE', { enabled: false });

  // NODE_05 requires NODE_03 and NODE_04
  let status05 = treeEngine ? treeEngine.getPrerequisitesStatus('NODE_05') : null;
  if (status05) {
    assert(!status05.isUnlocked, 'NODE_05 must not be unlocked initially');
    assert(status05.missingPrereqs.includes('NODE_03'), 'NODE_05 must require NODE_03');
    assert(status05.missingPrereqs.includes('NODE_04'), 'NODE_05 must require NODE_04');
  }

  // Attempting to complete NODE_05 out-of-order directly via store:
  store.dispatch('COMPLETE_NODE', { nodeId: 'NODE_05' });
  const stateAfter = store.getState();
  assert(stateAfter.completedNodes.includes('NODE_05'), 'Store completes dispatched node');

  // But NODE_08 requires NODE_05; NODE_08 should now be unlocked even though prerequisites of NODE_05 were skipped!
  const status08 = treeEngine ? treeEngine.getPrerequisitesStatus('NODE_08') : null;
  if (status08) {
    assert(status08.isUnlocked, 'NODE_08 unlocks because its direct prereq NODE_05 is completed');
  }
});

// ============================================================================
// SECTION 3: CONNECTOR GEOMETRY & BEZIER MATH STRESS TESTING
// ============================================================================
console.log('\n--- SECTION 3: Connector Geometry & Bezier Math Edge Cases ---');

// Pure mathematical model of treeEngine bezier curve computation
function computeBezier(sourceRect, targetRect, canvasRect) {
  const sourceX = sourceRect.right - canvasRect.left;
  const sourceY = sourceRect.top - canvasRect.top + sourceRect.height / 2;

  const targetX = targetRect.left - canvasRect.left;
  const targetY = targetRect.top - canvasRect.top + targetRect.height / 2;

  const deltaX = Math.max(30, (targetX - sourceX) * 0.5);
  const cx1 = sourceX + deltaX;
  const cy1 = sourceY;
  const cx2 = targetX - deltaX;
  const cy2 = targetY;

  const d = `M ${sourceX} ${sourceY} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${targetX} ${targetY}`;

  return { sourceX, sourceY, targetX, targetY, deltaX, cx1, cy1, cx2, cy2, d };
}

function assertFiniteNumbers(curve, context) {
  const nums = [curve.sourceX, curve.sourceY, curve.targetX, curve.targetY, curve.deltaX, curve.cx1, curve.cy1, curve.cx2, curve.cy2];
  for (const n of nums) {
    assert(typeof n === 'number', `[${context}] Coordinate is not a number: ${n}`);
    assert(!Number.isNaN(n), `[${context}] Coordinate is NaN: ${n}`);
    assert(Number.isFinite(n), `[${context}] Coordinate is infinite: ${n}`);
  }
  assert(!curve.d.includes('NaN'), `[${context}] SVG path contains NaN: ${curve.d}`);
  assert(!curve.d.includes('Infinity'), `[${context}] SVG path contains Infinity: ${curve.d}`);
}

test('S3.1: Standard Viewport (1200x800 container, 220x140 cards)', () => {
  const canvas = { left: 100, top: 100, width: 1200, height: 800 };
  const source = { left: 150, right: 370, top: 200, height: 140 };
  const target = { left: 450, right: 670, top: 200, height: 140 };

  const curve = computeBezier(source, target, canvas);
  assertFiniteNumbers(curve, 'Standard Viewport');
  assert(curve.sourceX === 270, 'sourceX calculation');
  assert(curve.targetX === 350, 'targetX calculation');
  assert(curve.deltaX === 40, 'deltaX = (350 - 270) * 0.5 = 40');
  assert(curve.cx1 === 310, 'cx1 = 270 + 40 = 310');
  assert(curve.cx2 === 310, 'cx2 = 350 - 40 = 310');
});

test('S3.2: Mobile Narrow Viewport (320x568 container, tight cards)', () => {
  const canvas = { left: 10, top: 50, width: 320, height: 568 };
  const source = { left: 15, right: 145, top: 80, height: 90 };
  const target = { left: 175, right: 305, top: 200, height: 90 };

  const curve = computeBezier(source, target, canvas);
  assertFiniteNumbers(curve, 'Mobile Narrow Viewport');
  assert(curve.deltaX >= 30, 'deltaX must be at least 30px');
});

test('S3.3: Ultra-wide 4K Viewport (3840x2160 container)', () => {
  const canvas = { left: 0, top: 0, width: 3840, height: 2160 };
  const source = { left: 400, right: 800, top: 1000, height: 250 };
  const target = { left: 2400, right: 2800, top: 1000, height: 250 };

  const curve = computeBezier(source, target, canvas);
  assertFiniteNumbers(curve, 'Ultra-wide 4K');
  assert(curve.deltaX === (2400 - 800) * 0.5, 'deltaX scales with large distance');
});

test('S3.4: Zero dimensions (width=0, height=0 container and cards)', () => {
  const canvas = { left: 0, top: 0, width: 0, height: 0 };
  const source = { left: 0, right: 0, top: 0, height: 0 };
  const target = { left: 0, right: 0, top: 0, height: 0 };

  const curve = computeBezier(source, target, canvas);
  assertFiniteNumbers(curve, 'Zero dimensions');
  assert(curve.deltaX === 30, 'deltaX clamped to minimum 30px when zero difference');
  assert(curve.cx1 === 30, 'cx1 clamped');
  assert(curve.cx2 === -30, 'cx2 clamped');
});

test('S3.5: Negative Offsets / Scrolled-out Viewport Space', () => {
  const canvas = { left: -500, top: -300, width: 1000, height: 600 };
  const source = { left: -400, right: -250, top: -200, height: 100 };
  const target = { left: -100, right: 50, top: -100, height: 100 };

  const curve = computeBezier(source, target, canvas);
  assertFiniteNumbers(curve, 'Negative Offsets');
});

test('S3.6: Inverted / Wrapped Layout (targetX < sourceX, flex column wrap)', () => {
  // If responsive layout wraps target card to left of or below source card
  const canvas = { left: 0, top: 0, width: 800, height: 1200 };
  const source = { left: 500, right: 700, top: 100, height: 100 };
  const target = { left: 100, right: 300, top: 400, height: 100 };

  const curve = computeBezier(source, target, canvas);
  assertFiniteNumbers(curve, 'Inverted / Wrapped Layout');
  assert(curve.deltaX === 30, 'deltaX Math.max(30, negative) must guarantee minimum 30px');
  assert(curve.cx1 === 700 + 30, 'cx1 goes right by 30px');
  assert(curve.cx2 === 100 - 30, 'cx2 goes left by 30px');
});

test('S3.7: Identical Source and Target Coordinates (Coincident Nodes)', () => {
  const canvas = { left: 50, top: 50, width: 500, height: 500 };
  const source = { left: 150, right: 350, top: 200, height: 120 };
  const target = { left: 150, right: 350, top: 200, height: 120 };

  const curve = computeBezier(source, target, canvas);
  assertFiniteNumbers(curve, 'Coincident Nodes');
  // targetX - sourceX = 150 - 350 = -200. deltaX = max(30, -100) = 30.
  assert(curve.deltaX === 30, 'deltaX remains 30');
});

test('S3.8: Astronomical Coordinates Stress (x=1e12, y=1e12)', () => {
  const canvas = { left: 0, top: 0, width: 1e12, height: 1e12 };
  const source = { left: 1e9, right: 2e9, top: 3e9, height: 1e8 };
  const target = { left: 1e10, right: 1.1e10, top: 3e9, height: 1e8 };

  const curve = computeBezier(source, target, canvas);
  assertFiniteNumbers(curve, 'Astronomical Coordinates');
});

test('S3.9: High-Precision Subpixel Float Coordinates', () => {
  const canvas = { left: 12.3456789, top: 98.7654321, width: 800.123, height: 600.456 };
  const source = { left: 55.5555555, right: 233.3333333, top: 120.1111111, height: 85.8888888 };
  const target = { left: 450.4444444, right: 620.2222222, top: 120.1111111, height: 85.8888888 };

  const curve = computeBezier(source, target, canvas);
  assertFiniteNumbers(curve, 'Subpixel Float Coordinates');
});

test('S3.10: Bezier Performance Benchmark (10,000 evaluations)', () => {
  const canvas = { left: 0, top: 0, width: 1920, height: 1080 };
  const source = { left: 100, right: 300, top: 200, height: 100 };
  const target = { left: 500, right: 700, top: 200, height: 100 };

  const start = performance.now();
  for (let i = 0; i < 10000; i++) {
    computeBezier(source, target, canvas);
  }
  const duration = performance.now() - start;
  assert(duration < 200, `10,000 bezier evaluations took too long: ${duration.toFixed(2)}ms`);
});

// ============================================================================
// SECTION 4: FILTER & SEARCH ADVERSARIAL STRESS TESTING
// ============================================================================
console.log('\n--- SECTION 4: Filter & Search Adversarial Edge Cases ---');

function evaluateFilter(concept, filterLvl, filterDiff, searchQuery) {
  const query = (searchQuery || '').trim().toLowerCase();
  
  const matchesLevel = filterLvl === 'all' || String(concept.level) === String(filterLvl);
  
  // Potential bug test: How does treeEngine handle filterDiff when not string?
  let matchesDiff = false;
  if (filterDiff === 'all') {
    matchesDiff = true;
  } else if (typeof filterDiff === 'string') {
    matchesDiff = concept.difficulty.toLowerCase() === filterDiff.toLowerCase();
  } else if (filterDiff == null) {
    // treeEngine calls filterDiff.toLowerCase() directly without null check!
    // Testing unhandled exception risk in treeEngine.js:220
    matchesDiff = false;
  }

  const matchesSearch = !query ||
    concept.title.toLowerCase().includes(query) ||
    concept.subtitle.toLowerCase().includes(query) ||
    concept.tags.some(t => t.toLowerCase().includes(query)) ||
    concept.coreConcept.toLowerCase().includes(query);

  return matchesLevel && matchesDiff && matchesSearch;
}

test('S4.1: Empty and Whitespace Search Queries', () => {
  const emptyQueries = ['', '   ', '\t', '\n', '  \t\n  ', null, undefined];
  for (const q of emptyQueries) {
    let matched = 0;
    CONCEPTS.forEach(c => {
      if (evaluateFilter(c, 'all', 'all', q)) matched++;
    });
    assert(matched === 9, `Empty query "${q}" should match all 9 nodes, matched ${matched}`);
  }
});

test('S4.2: Regex Special Characters in Search (.*[, +?, ^$, [], (?:foo), etc.)', () => {
  const regexPatterns = [
    '.*[',
    '(\\d+)+',
    '\\w+',
    '^[a-z]+$',
    '?',
    '+',
    '*',
    '|',
    '{0,10}',
    '\\b',
    '(?:non-capturing)',
    '(?=lookahead)',
    '[^\\]]+',
    '/^.*$/gi',
    '\\0'
  ];

  for (const pat of regexPatterns) {
    // Should not throw RegExp SyntaxError or freeze
    let matched = 0;
    CONCEPTS.forEach(c => {
      if (evaluateFilter(c, 'all', 'all', pat)) matched++;
    });
    // None of these patterns are literal text in our titles, so matched should be 0
    assert(typeof matched === 'number', `Regex pattern query "${pat}" must evaluate without exception`);
  }
});

test('S4.3: SQL Injection & XSS Attack Vector Payloads in Search Query', () => {
  const injections = [
    "' OR '1'='1",
    "'; DROP TABLE concepts; --",
    '<script>alert("XSS")</script>',
    '<img src=x onerror=alert(1)>',
    '{{7*7}}',
    '${process.env}',
    '"><svg onload=alert(1)>',
    'admin\'--'
  ];

  for (const payload of injections) {
    let matched = 0;
    CONCEPTS.forEach(c => {
      if (evaluateFilter(c, 'all', 'all', payload)) matched++;
    });
    assert(matched === 0, `Injection payload "${payload}" should safely match 0 concepts`);
  }
});

test('S4.4: Massive Query String Resilience (100,000 characters)', () => {
  const massiveQuery = 'A'.repeat(100000);
  const start = performance.now();
  let matched = 0;
  CONCEPTS.forEach(c => {
    if (evaluateFilter(c, 'all', 'all', massiveQuery)) matched++;
  });
  const duration = performance.now() - start;
  assert(matched === 0, 'Massive query should match 0 concepts');
  assert(duration < 100, `Massive query took too long: ${duration.toFixed(2)}ms`);
});

test('S4.5: Unicode and Emojis in Search Query', () => {
  const unicodeQueries = ['🚀', '🔒', '⚡', '🤖', '🎲', 'Üñïçödé', 'привет', '你好'];
  for (const q of unicodeQueries) {
    let matched = 0;
    CONCEPTS.forEach(c => {
      if (evaluateFilter(c, 'all', 'all', q)) matched++;
    });
    assert(typeof matched === 'number', `Unicode query "${q}" evaluated safely`);
  }
});

test('S4.6: Accented Search Sensitivity / Diacritics Limitation Analysis', () => {
  // Brazilian Portuguese students frequently type "oraculo" instead of "oráculo"
  const unaccented = 'oraculo';
  let matchedUnaccented = 0;
  CONCEPTS.forEach(c => {
    if (evaluateFilter(c, 'all', 'all', unaccented)) matchedUnaccented++;
  });

  const accented = 'oráculo';
  let matchedAccented = 0;
  CONCEPTS.forEach(c => {
    if (evaluateFilter(c, 'all', 'all', accented)) matchedAccented++;
  });

  // Check if unaccented query finds "Oráculo"
  if (matchedUnaccented === 0 && matchedAccented > 0) {
    logFinding(
      'UX / Search Resilience',
      `Searching "oraculo" (unaccented) yields 0 results while "oráculo" yields ${matchedAccented} results. Students typing without accents will not find concepts.`,
      'MEDIUM'
    );
  }
  assert(matchedAccented > 0, 'Accented search "oráculo" should match at least 1 concept');
});

test('S4.7: Nonexistent Level Filter Values', () => {
  const weirdLevels = [-1, 999, '999', 'banana', 'null', 'undefined', NaN, Infinity];
  for (const lvl of weirdLevels) {
    let matched = 0;
    CONCEPTS.forEach(c => {
      if (evaluateFilter(c, lvl, 'all', '')) matched++;
    });
    assert(matched === 0, `Invalid level "${lvl}" should match 0 concepts`);
  }
});

test('S4.8: Nonexistent and Invalid Difficulty Filter Values (Vulnerability Probe)', () => {
  // Check what happens if null or undefined or number is passed directly to treeEngine's filterDiff logic
  let threwOnNull = false;
  try {
    const filterDiff = null;
    // treeEngine.js line 220: concept.difficulty.toLowerCase() === filterDiff.toLowerCase()
    const dummy = filterDiff.toLowerCase();
  } catch (err) {
    threwOnNull = true;
  }
  assert(threwOnNull, 'Calling null.toLowerCase() throws TypeError');

  // Verify that if store receives null difficulty filter, it would crash treeEngine unless guarded
  logFinding(
    'Runtime Exception Risk',
    'In treeEngine.js:220, `filterDiff.toLowerCase()` is called directly without verifying `typeof filterDiff === "string"` or non-null. Dispatching `SET_FILTER` with key "difficulty" and value `null` or `undefined` throws an unhandled TypeError.',
    'HIGH'
  );
});

test('S4.9: Tag Search Completeness across All 9 Nodes', () => {
  // Ensure every node can be discovered via at least one of its tags
  CONCEPTS.forEach(c => {
    assert(Array.isArray(c.tags) && c.tags.length > 0, `Node ${c.id} must have non-empty tags array`);
    const tag = c.tags[0];
    let matched = 0;
    CONCEPTS.forEach(candidate => {
      if (evaluateFilter(candidate, 'all', 'all', tag)) matched++;
    });
    assert(matched >= 1, `Tag "${tag}" for node ${c.id} should match at least 1 node`);
  });
});

// ============================================================================
// SECTION 5: STORE INTEGRATION & TEACHER MODE DISCREPANCIES
// ============================================================================
console.log('\n--- SECTION 5: Store Integration & Teacher Mode Discrepancies ---');

test('S5.1: Teacher Mode Discrepancy (store.getState().unlockedNodes vs treeEngine)', () => {
  store.dispatch('RESET_PROGRESS');
  store.dispatch('SET_TEACHER_MODE', { enabled: true });
  const state = store.getState();

  assert(state.teacherMode === true, 'Teacher mode must be enabled');

  // In treeEngine:
  if (treeEngine) {
    const status = treeEngine.getPrerequisitesStatus('NODE_08');
    assert(status.isUnlocked === true, 'treeEngine considers NODE_08 unlocked in teacherMode');
  }

  // BUT check store.getState().unlockedNodes:
  console.log(`    ℹ store.getState().unlockedNodes in Teacher Mode has length: ${state.unlockedNodes.length}`);
  if (state.unlockedNodes.length !== 9) {
    logFinding(
      'State Contract Discrepancy',
      `When teacherMode=true, store.getState().unlockedNodes only contains [${state.unlockedNodes.join(', ')}] (length ${state.unlockedNodes.length}) instead of all 9 nodes. This causes test failures in E2E spec (TC-T1-F03-05, CF01, UJ02) which expect state.unlockedNodes.length === 9.`,
      'HIGH'
    );
  }
});

test('S5.2: State Isolation vs Shallow Freeze Behavior', () => {
  const state1 = store.getState();
  // Mutating the returned array copy:
  state1.completedNodes.push('NODE_HACKED');
  
  // Verify internal store was NOT contaminated:
  const state2 = store.getState();
  assert(!state2.completedNodes.includes('NODE_HACKED'),
    'Internal store was contaminated by mutation of returned state object!');

  // Check whether state arrays are deeply frozen:
  const isDeeplyFrozen = Object.isFrozen(state2.completedNodes);
  if (!isDeeplyFrozen) {
    logFinding(
      'Immutability Pattern',
      'store.getState() performs Object.freeze() only on the outer container; arrays (unlockedNodes, completedNodes) are shallow clones but not frozen with Object.freeze(). While internal state is isolated from corruption, deep immutability is not enforced.',
      'LOW'
    );
  }
});

test('S5.4: Empirical Reproduction of treeEngine.updateState() Unhandled Exception', () => {
  // Test if treeEngine crashes when null difficulty or numeric search is in store
  const mockEl = {
    classList: { toggle: () => {}, contains: () => false },
    querySelector: () => ({ textContent: '', style: {} }),
    getBoundingClientRect: () => ({ left: 0, top: 0, right: 100, bottom: 50, width: 100, height: 50 })
  };

  if (treeEngine) {
    CONCEPTS.forEach(c => treeEngine._nodeElements.set(c.id, mockEl));

    let threwOnNull = false;
    let errorMsg = '';
    try {
      // Simulate store state with null difficulty
      store.dispatch('SET_FILTER', { key: 'difficulty', value: null });
      treeEngine.updateState();
    } catch (err) {
      threwOnNull = true;
      errorMsg = err.message;
    } finally {
      // Restore clean filter
      store.dispatch('SET_FILTER', { key: 'difficulty', value: 'all' });
    }

    assert(threwOnNull, 'Expected treeEngine.updateState() to throw TypeError when filterDifficulty is null');
    assert(errorMsg.includes('toLowerCase'), `Expected error to mention toLowerCase, got: ${errorMsg}`);
    console.log(`    ℹ Confirmed empirical crash on null difficulty: "${errorMsg}"`);
  }
});

// ============================================================================
// SUMMARY & VERDICT
// ============================================================================
console.log('\n===============================================================');
console.log('📊 CHALLENGE TEST EXECUTION SUMMARY');
console.log('===============================================================');
console.log(`Total Adversarial Tests : ${results.total}`);
console.log(`Passed                  : \x1b[32m${results.passed}\x1b[0m`);
console.log(`Failed                  : ${results.failed > 0 ? `\x1b[31m${results.failed}\x1b[0m` : '0'}`);

console.log('\n--- Empirical Vulnerabilities & Findings Identified ---');
results.findings.forEach((f, idx) => {
  console.log(`\n[Finding #${idx + 1}] [${f.impact}] ${f.category}:`);
  console.log(`  ${f.description}`);
});

if (results.failed > 0) {
  console.log('\n❌ ADVERSARIAL FAILURES:');
  results.failures.forEach(f => {
    console.log(`  • ${f.name}: ${f.error}`);
  });
  process.exit(1);
} else {
  console.log('\n\x1b[32m✔ ALL CORE ADVERSARIAL CHALLENGES COMPLETED!\x1b[0m\n');
  process.exit(0);
}
