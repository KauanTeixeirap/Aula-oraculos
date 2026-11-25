window.OracleDeck = window.OracleDeck || {};

/**
 * Extracted from https://www.inteliblockchain.org/ (zN6i WebGL knot module).
 * Renders the 3D extruded Inteli Blockchain knot with vertex color gradient
 * (#1739a8 -> #5b1f96), 5-light physical shading, floating bob, hover tilt, and drag.
 */
window.OracleDeck.initIbcKnot3D = function initIbcKnot3D() {
  const container = document.getElementById('ibc-knot-container');
  const canvas = document.getElementById('ibc-knot-canvas');
  if (!container || !canvas) return null;

  const THREE = window.THREE;
  if (!THREE) return null;

  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let isReducedMotion = reducedMotionQuery.matches;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true
    });
  } catch (_) {
    return null;
  }

  const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

  const KNOT_PATHS = [
    [
      [258.01, 70.464], [206.994, 121.479], [308.985, 223.47], [342.942, 189.512],
      [308.991, 155.56], [282.071, 182.48], [265.054, 165.463], [309.025, 121.492],
      [377.131, 189.598], [309.098, 257.632], [257.99, 206.524], [156.028, 308.486],
      [189.999, 342.457], [223.941, 308.515], [197.005, 281.579], [214.026, 264.558],
      [258.1, 308.632], [190.002, 376.73], [121.896, 308.624], [172.982, 257.538],
      [70.994, 155.55], [37.045, 189.499], [70.994, 223.448], [97.935, 196.507],
      [114.949, 213.52], [70.869, 257.601], [2.836, 189.568], [70.94, 121.464],
      [121.981, 172.504], [223.954, 70.531], [189.983, 36.561], [156.05, 70.494],
      [182.986, 97.43], [165.939, 114.477], [121.931, 70.47], [189.973, 2.427]
    ],
    [
      [139.016, 189.487], [189.999, 240.47], [240.949, 189.52], [189.966, 138.537]
    ]
  ];

  const outerShape = new THREE.Shape();
  KNOT_PATHS[0].forEach(([x, y], idx) => {
    if (idx === 0) outerShape.moveTo(x, -y);
    else outerShape.lineTo(x, -y);
  });
  outerShape.closePath();

  const innerHole = new THREE.Path();
  KNOT_PATHS[1].forEach(([x, y], idx) => {
    if (idx === 0) innerHole.moveTo(x, -y);
    else innerHole.lineTo(x, -y);
  });
  innerHole.closePath();
  outerShape.holes.push(innerHole);

  const geometry = new THREE.ExtrudeGeometry(outerShape, {
    depth: 27,
    bevelEnabled: true,
    bevelThickness: 27 * 0.09,
    bevelSize: 2.7,
    bevelSegments: 3,
    curveSegments: 8
  });
  geometry.center();
  geometry.computeBoundingBox();

  const bbox = geometry.boundingBox;
  const minB = bbox.min;
  const maxB = bbox.max;
  const colorPurple = new THREE.Color('#5b1f96');
  const colorBlue = new THREE.Color('#1739a8');
  const posAttr = geometry.attributes.position;
  const colors = new Float32Array(posAttr.count * 3);
  const tmpColor = new THREE.Color();

  for (let i = 0; i < posAttr.count; i++) {
    const nx = (posAttr.getX(i) - minB.x) / (maxB.x - minB.x);
    const ny = (posAttr.getY(i) - minB.y) / (maxB.y - minB.y);
    const t = clamp(((nx + ny) / 2 - 0.42) / 0.16, 0, 1);
    tmpColor.copy(colorBlue).lerp(colorPurple, t);
    tmpColor.toArray(colors, i * 3);
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.MeshPhysicalMaterial({
    vertexColors: true,
    metalness: 0.05,
    roughness: 0.25,
    clearcoat: 0.6,
    clearcoatRoughness: 0.25
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.scale.setScalar(0.0086);

  const scene = new THREE.Scene();
  scene.add(mesh);
  scene.add(new THREE.AmbientLight(0xffffff, 0.35));

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.1);
  keyLight.position.set(6, 9, 5);
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xffffff, 0.35);
  fillLight.position.set(-4, -3, 6);
  scene.add(fillLight);

  const rimCyan = new THREE.DirectionalLight(0x1b98e0, 1.6);
  rimCyan.position.set(-6, 3, -4);
  scene.add(rimCyan);

  const accentMagenta = new THREE.PointLight(0x9f0e5d, 0.9, 20);
  accentMagenta.position.set(3, -2, 4);
  scene.add(accentMagenta);

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 0, 7);

  if ('outputEncoding' in renderer && THREE.sRGBEncoding) {
    renderer.outputEncoding = THREE.sRGBEncoding;
  }
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  function syncSize() {
    const rect = canvas.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return false;
    renderer.setSize(rect.width, rect.height, false);
    camera.aspect = rect.width / rect.height;
    camera.updateProjectionMatrix();
    return true;
  }

  if (!syncSize()) {
    geometry.dispose();
    material.dispose();
    renderer.dispose();
    return null;
  }

  const baseRx = 0.18;
  const baseRy = -0.32;
  const swingAmp = 0.68;
  let phase = 0;
  const targetTilt = { x: 0, y: 0 };
  const currentTilt = { x: 0, y: 0 };
  let dragOffset = 0;
  let smoothDrag = 0;
  let isDragging = false;
  let dragStartX = 0;
  let dragStartOffset = 0;
  let lastInteract = 0;
  let frames = 0;
  let rafId = null;

  function stepTransform(animateFloat) {
    currentTilt.x += 0.06 * (targetTilt.x - currentTilt.x);
    currentTilt.y += 0.06 * (targetTilt.y - currentTilt.y);
    smoothDrag += 0.15 * (dragOffset - smoothDrag);

    if (performance.now() - lastInteract > 1500) {
      targetTilt.x += 0.04 * (0 - targetTilt.x);
      targetTilt.y += 0.04 * (0 - targetTilt.y);
      dragOffset += 0.06 * (0 - dragOffset);
    }

    if (animateFloat) {
      phase += 0.012;
      mesh.position.y = Math.sin(phase * 1.8) * 0.055;
    }

    mesh.rotation.x = baseRx + currentTilt.x;
    mesh.rotation.y = baseRy + Math.sin(phase) * swingAmp + currentTilt.y + smoothDrag;
  }

  function renderOnce(animateFloat) {
    stepTransform(animateFloat);
    renderer.render(scene, camera);
    frames++;
  }

  function loop() {
    if (isReducedMotion) {
      rafId = null;
      return;
    }
    renderOnce(true);
    rafId = requestAnimationFrame(loop);
  }

  renderOnce(false);
  if (renderer.getContext().getError() !== 0) {
    geometry.dispose();
    material.dispose();
    renderer.dispose();
    return null;
  }

  container.classList.add('knot--gl');
  if (!isReducedMotion) {
    rafId = requestAnimationFrame(loop);
  }

  container.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'mouse' && !isDragging) {
      const rect = container.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      targetTilt.x = clamp(-0.32 * ny, -0.32, 0.32);
      targetTilt.y = clamp(0.26 * nx, -0.26, 0.26);
      lastInteract = performance.now();
    }
  });

  container.addEventListener('pointerdown', (e) => {
    isDragging = true;
    dragStartX = e.clientX;
    dragStartOffset = dragOffset;
    container.setPointerCapture(e.pointerId);
    lastInteract = performance.now();
  });

  window.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    dragOffset = clamp(dragStartOffset + 0.018 * (e.clientX - dragStartX), -0.8, 0.8);
    lastInteract = performance.now();
    if (isReducedMotion) renderOnce(false);
  });

  window.addEventListener('pointerup', () => {
    if (!isDragging) return;
    isDragging = false;
    lastInteract = performance.now();
  });

  window.addEventListener('resize', syncSize);

  reducedMotionQuery.addEventListener('change', (e) => {
    isReducedMotion = e.matches;
    if (!isReducedMotion && !rafId) {
      rafId = requestAnimationFrame(loop);
    }
  });

  window.__ibcKnot3d = () => ({
    frames,
    error: renderer.getContext().getError(),
    rotY: mesh.rotation.y,
    rotX: mesh.rotation.x
  });

  return {
    destroy() {
      if (rafId) cancelAnimationFrame(rafId);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      delete window.__ibcKnot3d;
    }
  };
};
