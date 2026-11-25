window.OracleDeck = window.OracleDeck || {};

/**
 * Interactive 3D Blockchain Cube + Orbiting Oracle Nodes for Slide 01.
 */
window.OracleDeck.initOracleCube3D = function initOracleCube3D() {
  const canvas = document.getElementById('oracle-3d-canvas');
  if (!canvas) return null;
  const ctx = canvas.getContext('2d');
  const toggleBtn = document.getElementById('btn-toggle-3d');
  const toggleIcon = document.getElementById('icon-toggle-3d');
  const toggleLabel = document.getElementById('label-toggle-3d');

  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  let isPaused = reducedMotionQuery.matches;
  let isSlideActive = true;
  let rafId = null;

  let rotY = -0.58;
  let rotX = 0.42;
  let velY = 0;
  let velX = 0;
  let isDragging = false;
  let lastX = 0;
  let lastY = 0;
  let time = 0;
  let lastFrame = performance.now();

  function syncToggleUI() {
    if (!toggleBtn) return;
    toggleIcon.className = isPaused ? 'fa-solid fa-play' : 'fa-solid fa-pause';
    toggleLabel.textContent = isPaused ? 'Animar' : 'Pausar';
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
      isPaused = !isPaused;
      syncToggleUI();
      e.currentTarget.blur();
      if (!isPaused && isSlideActive && !rafId) {
        lastFrame = performance.now();
        rafId = requestAnimationFrame(loop);
      } else {
        render();
      }
    });
  }

  reducedMotionQuery.addEventListener('change', (e) => {
    isPaused = e.matches;
    syncToggleUI();
    if (!isPaused && isSlideActive && !rafId) {
      lastFrame = performance.now();
      rafId = requestAnimationFrame(loop);
    }
  });

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.max(260, Math.floor(rect.width));
    const h = Math.max(260, Math.floor(rect.height));
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    render();
  }

  canvas.addEventListener('pointerdown', (e) => {
    isDragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    canvas.setPointerCapture(e.pointerId);
    if (!rafId && isSlideActive) {
      lastFrame = performance.now();
      rafId = requestAnimationFrame(loop);
    }
  });

  canvas.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    rotY += dx * 0.0085;
    rotX = Math.max(-1.05, Math.min(1.15, rotX + dy * 0.0075));
    velY = dx * 0.003;
    velX = dy * 0.002;
    if (isPaused) render();
  });

  const endDrag = () => { isDragging = false; };
  canvas.addEventListener('pointerup', endDrag);
  canvas.addEventListener('pointercancel', endDrag);

  function rotatePoint(p, rx, ry) {
    const cy = Math.cos(ry), sy = Math.sin(ry);
    const x1 = p.x * cy - p.z * sy;
    const z1 = p.x * sy + p.z * cy;
    const cx = Math.cos(rx), sx = Math.sin(rx);
    const y2 = p.y * cx - z1 * sx;
    const z2 = p.y * sx + z1 * cx;
    return { x: x1, y: y2, z: z2 };
  }

  function project(p, width, height) {
    const camDist = 6.4;
    const fov = Math.min(width, height) * 1.18;
    const denom = Math.max(0.5, camDist - p.z);
    const scale = fov / denom;
    return {
      x: width * 0.5 + p.x * scale,
      y: height * 0.52 - p.y * scale,
      z: p.z,
      scale
    };
  }

  function makeCube(halfSize, offset = { x: 0, y: 0, z: 0 }, localRotY = 0) {
    const s = halfSize;
    const raw = [
      { x: -s, y: -s, z: -s }, { x: s, y: -s, z: -s },
      { x: s, y: s, z: -s },   { x: -s, y: s, z: -s },
      { x: -s, y: -s, z: s },  { x: s, y: -s, z: s },
      { x: s, y: s, z: s },    { x: -s, y: s, z: s }
    ];
    const c = Math.cos(localRotY), sn = Math.sin(localRotY);
    const verts = raw.map((v) => ({
      x: v.x * c - v.z * sn + offset.x,
      y: v.y + offset.y,
      z: v.x * sn + v.z * c + offset.z
    }));
    const edges = [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7]
    ];
    const faces = [
      [0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4],
      [2, 3, 7, 6], [0, 3, 7, 4], [1, 2, 6, 5]
    ];
    return { verts, edges, faces };
  }

  const nodes = [
    { id: 'globe', label: 'GLOBE', pos: { x: -1.42, y: 0.78, z: 0.35 }, r: 0.31, color: '#38bdf8' },
    { id: 'api',   label: 'API',   pos: { x: 1.46, y: 0.72, z: -0.25 }, r: 0.31, color: '#2dd4bf' },
    { id: 'mini1', label: 'MINI',  pos: { x: -1.25, y: -0.82, z: 0.78 }, r: 0.14, color: '#38bdf8' },
    { id: 'mini2', label: 'MINI',  pos: { x: 1.28, y: -0.78, z: 0.68 },  r: 0.14, color: '#a855f7' },
    { id: 'mini3', label: 'MINI',  pos: { x: 0.15, y: -0.85, z: -1.35 }, r: 0.12, color: '#38bdf8' }
  ];

  function drawRing(radius, yPos, strokeStyle, lineWidth, width, height, tiltZ = 0, dash = []) {
    const steps = 72;
    ctx.save();
    ctx.beginPath();
    ctx.setLineDash(dash);
    for (let i = 0; i <= steps; i++) {
      const a = (i / steps) * Math.PI * 2;
      const x = Math.cos(a) * radius;
      const y = yPos + Math.sin(a) * Math.sin(tiltZ) * radius * 0.4;
      const z = Math.sin(a) * radius;
      const pr = project(rotatePoint({ x, y, z }, rotX, rotY), width, height);
      if (i === 0) ctx.moveTo(pr.x, pr.y);
      else ctx.lineTo(pr.x, pr.y);
    }
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    ctx.restore();
  }

  function drawCube3D(cube, width, height, opts) {
    const tVerts = cube.verts.map((v) => rotatePoint(v, rotX, rotY));
    const pVerts = tVerts.map((v) => project(v, width, height));

    const sortedFaces = cube.faces
      .map((f) => ({
        f,
        z: (tVerts[f[0]].z + tVerts[f[1]].z + tVerts[f[2]].z + tVerts[f[3]].z) / 4
      }))
      .sort((a, b) => a.z - b.z);

    ctx.save();
    sortedFaces.forEach(({ f }) => {
      ctx.beginPath();
      ctx.moveTo(pVerts[f[0]].x, pVerts[f[0]].y);
      for (let i = 1; i < f.length; i++) {
        ctx.lineTo(pVerts[f[i]].x, pVerts[f[i]].y);
      }
      ctx.closePath();
      ctx.fillStyle = opts.faceFill;
      ctx.fill();
    });

    const grad = ctx.createLinearGradient(width * 0.25, height * 0.2, width * 0.75, height * 0.8);
    grad.addColorStop(0, opts.edgeStart);
    grad.addColorStop(0.55, opts.edgeMid);
    grad.addColorStop(1, opts.edgeEnd);

    ctx.strokeStyle = grad;
    ctx.lineWidth = opts.lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.shadowColor = opts.glow;
    ctx.shadowBlur = opts.blur;

    cube.edges.forEach(([i, j]) => {
      ctx.beginPath();
      ctx.moveTo(pVerts[i].x, pVerts[i].y);
      ctx.lineTo(pVerts[j].x, pVerts[j].y);
      ctx.stroke();
    });

    if (opts.showVertices) {
      ctx.fillStyle = '#e0f2fe';
      ctx.shadowBlur = 10;
      pVerts.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, opts.vertexRadius || 2.4, 0, Math.PI * 2);
        ctx.fill();
      });
    }
    ctx.restore();
  }

  function drawGlobeNode(center3D, radius, width, height) {
    const rp = rotatePoint(center3D, rotX, rotY);
    const pr = project(rp, width, height);
    const rPx = radius * pr.scale;
    const depthAlpha = Math.max(0.45, Math.min(1, 0.78 + rp.z * 0.14));

    ctx.save();
    ctx.globalAlpha = depthAlpha;

    const bg = ctx.createRadialGradient(pr.x - rPx * 0.3, pr.y - rPx * 0.3, rPx * 0.1, pr.x, pr.y, rPx);
    bg.addColorStop(0, 'rgba(56, 189, 248, 0.28)');
    bg.addColorStop(0.7, 'rgba(15, 23, 42, 0.72)');
    bg.addColorStop(1, 'rgba(139, 92, 246, 0.28)');
    ctx.beginPath();
    ctx.arc(pr.x, pr.y, rPx, 0, Math.PI * 2);
    ctx.fillStyle = bg;
    ctx.fill();

    const rim = ctx.createLinearGradient(pr.x - rPx, pr.y - rPx, pr.x + rPx, pr.y + rPx);
    rim.addColorStop(0, '#2dd4bf');
    rim.addColorStop(0.5, '#38bdf8');
    rim.addColorStop(1, '#a855f7');
    ctx.strokeStyle = rim;
    ctx.lineWidth = 1.8;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 14;
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(125, 211, 252, 0.65)';
    ctx.lineWidth = 1;
    const spin = time * 0.6;
    for (let m = 0; m < 3; m++) {
      const rxM = Math.max(0.15, Math.abs(Math.cos(spin + (m * Math.PI) / 3))) * rPx * 0.88;
      ctx.beginPath();
      ctx.ellipse(pr.x, pr.y, rxM, rPx * 0.88, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    [-0.42, 0, 0.42].forEach((lat) => {
      const ly = pr.y + lat * rPx;
      const lw = Math.sqrt(Math.max(0, 1 - lat * lat)) * rPx * 0.88;
      ctx.beginPath();
      ctx.moveTo(pr.x - lw, ly);
      ctx.lineTo(pr.x + lw, ly);
      ctx.stroke();
    });

    ctx.restore();
  }

  function drawApiNode(center3D, radius, width, height) {
    const rp = rotatePoint(center3D, rotX, rotY);
    const pr = project(rp, width, height);
    const rPx = radius * pr.scale;
    const depthAlpha = Math.max(0.45, Math.min(1, 0.78 + rp.z * 0.14));

    ctx.save();
    ctx.globalAlpha = depthAlpha;

    const bg = ctx.createRadialGradient(pr.x - rPx * 0.25, pr.y - rPx * 0.25, rPx * 0.1, pr.x, pr.y, rPx);
    bg.addColorStop(0, 'rgba(45, 212, 191, 0.25)');
    bg.addColorStop(0.7, 'rgba(15, 23, 42, 0.82)');
    bg.addColorStop(1, 'rgba(56, 189, 248, 0.3)');
    ctx.beginPath();
    ctx.arc(pr.x, pr.y, rPx, 0, Math.PI * 2);
    ctx.fillStyle = bg;
    ctx.fill();

    const rim = ctx.createLinearGradient(pr.x - rPx, pr.y - rPx, pr.x + rPx, pr.y + rPx);
    rim.addColorStop(0, '#38bdf8');
    rim.addColorStop(1, '#a855f7');
    ctx.strokeStyle = rim;
    ctx.lineWidth = 1.8;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 14;
    ctx.stroke();

    ctx.shadowBlur = 6;
    ctx.fillStyle = '#f0f9ff';
    ctx.font = `700 ${Math.max(10, Math.round(rPx * 0.56))}px "JetBrains Mono", monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('API', pr.x - rPx * 0.08, pr.y + rPx * 0.06);

    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#2dd4bf';
    ctx.lineWidth = 1.4;
    [0.2, 0.34].forEach((arcR) => {
      ctx.beginPath();
      ctx.arc(pr.x + rPx * 0.3, pr.y - rPx * 0.18, rPx * arcR, -Math.PI * 0.65, -Math.PI * 0.05);
      ctx.stroke();
    });

    ctx.restore();
  }

  function drawConnection(from3D, to3D, width, height, pulseOffset, color) {
    const mid3D = {
      x: (from3D.x + to3D.x) * 0.5,
      y: (from3D.y + to3D.y) * 0.5 + 0.15,
      z: (from3D.z + to3D.z) * 0.5
    };
    const p0 = project(rotatePoint(from3D, rotX, rotY), width, height);
    const p1 = project(rotatePoint(mid3D, rotX, rotY), width, height);
    const p2 = project(rotatePoint(to3D, rotX, rotY), width, height);

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(p0.x, p0.y);
    ctx.quadraticCurveTo(p1.x, p1.y, p2.x, p2.y);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.42)';
    ctx.lineWidth = 1.3;
    ctx.stroke();

    const t = (time * 0.45 + pulseOffset) % 1;
    const mt = 1 - t;
    const px = mt * mt * p0.x + 2 * mt * t * p1.x + t * t * p2.x;
    const py = mt * mt * p0.y + 2 * mt * t * p1.y + t * t * p2.y;

    ctx.beginPath();
    ctx.arc(px, py, 3.2, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.shadowColor = color;
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.restore();
  }

  function render() {
    const rect = canvas.getBoundingClientRect();
    const width = rect.width || 400;
    const height = rect.height || 400;
    ctx.clearRect(0, 0, width, height);

    const aura = ctx.createRadialGradient(width * 0.5, height * 0.54, 8, width * 0.5, height * 0.54, width * 0.46);
    aura.addColorStop(0, 'rgba(56, 189, 248, 0.20)');
    aura.addColorStop(0.45, 'rgba(139, 92, 246, 0.10)');
    aura.addColorStop(1, 'rgba(7, 11, 20, 0)');
    ctx.fillStyle = aura;
    ctx.fillRect(0, 0, width, height);

    drawRing(1.88, -0.92, 'rgba(56, 189, 248, 0.28)', 1.2, width, height);
    drawRing(1.52, -0.92, 'rgba(139, 92, 246, 0.35)', 1.4, width, height);
    drawRing(1.12, -0.92, 'rgba(45, 212, 191, 0.45)', 1.8, width, height);
    drawRing(0.76, -0.92, 'rgba(168, 85, 247, 0.55)', 1.4, width, height, 0, [6, 6]);
    drawRing(1.72, 0.12, 'rgba(125, 211, 252, 0.18)', 1.0, width, height, 0.95);

    [0, Math.PI * 0.85, Math.PI * 1.55].forEach((phase, idx) => {
      const a = time * 0.55 + phase;
      const orbPt = { x: Math.cos(a) * 1.88, y: -0.92, z: Math.sin(a) * 1.88 };
      const pr = project(rotatePoint(orbPt, rotX, rotY), width, height);
      ctx.save();
      ctx.beginPath();
      ctx.arc(pr.x, pr.y, idx === 0 ? 3.2 : 2.2, 0, Math.PI * 2);
      ctx.fillStyle = idx === 1 ? '#c084fc' : '#67e8f9';
      ctx.shadowColor = idx === 1 ? '#a855f7' : '#38bdf8';
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.restore();
    });

    const bob = Math.sin(time * 1.6) * 0.06;
    const cubeCenter = { x: 0, y: 0.06 + bob, z: 0 };

    nodes.forEach((n, idx) => {
      const floatPos = {
        x: n.pos.x,
        y: n.pos.y + Math.sin(time * 1.4 + idx * 1.3) * 0.05,
        z: n.pos.z
      };
      drawConnection(floatPos, cubeCenter, width, height, idx * 0.22, n.color);
    });

    const drawList = [];
    drawList.push({
      z: rotatePoint(cubeCenter, rotX, rotY).z,
      draw: () => {
        const innerCube = makeCube(0.32, cubeCenter, -time * 0.35);
        const outerCube = makeCube(0.62, cubeCenter, 0);
        drawCube3D(innerCube, width, height, {
          faceFill: 'rgba(56, 189, 248, 0.14)',
          edgeStart: '#e0f2fe',
          edgeMid: '#38bdf8',
          edgeEnd: '#c084fc',
          lineWidth: 1.6,
          glow: '#38bdf8',
          blur: 14,
          showVertices: false
        });
        drawCube3D(outerCube, width, height, {
          faceFill: 'rgba(14, 165, 233, 0.08)',
          edgeStart: '#2dd4bf',
          edgeMid: '#38bdf8',
          edgeEnd: '#8b5cf6',
          lineWidth: 2.6,
          glow: '#38bdf8',
          blur: 18,
          showVertices: true,
          vertexRadius: 2.6
        });
      }
    });

    nodes.forEach((n, idx) => {
      const floatPos = {
        x: n.pos.x,
        y: n.pos.y + Math.sin(time * 1.4 + idx * 1.3) * 0.05,
        z: n.pos.z
      };
      const depth = rotatePoint(floatPos, rotX, rotY).z;
      drawList.push({
        z: depth,
        draw: () => {
          if (n.id === 'globe') {
            drawGlobeNode(floatPos, n.r, width, height);
          } else if (n.id === 'api') {
            drawApiNode(floatPos, n.r, width, height);
          } else {
            const miniCube = makeCube(n.r, floatPos, time * 0.7 + idx);
            drawCube3D(miniCube, width, height, {
              faceFill: idx % 2 === 0 ? 'rgba(56, 189, 248, 0.18)' : 'rgba(168, 85, 247, 0.22)',
              edgeStart: '#67e8f9',
              edgeMid: '#38bdf8',
              edgeEnd: '#c084fc',
              lineWidth: 1.3,
              glow: n.color,
              blur: 10,
              showVertices: false
            });
          }
        }
      });
    });

    drawList.sort((a, b) => a.z - b.z);
    drawList.forEach((item) => item.draw());
  }

  function loop(now) {
    const dt = Math.min(0.05, (now - lastFrame) / 1000);
    lastFrame = now;

    if (!isPaused) {
      time += dt;
      if (!isDragging) {
        rotY += dt * 0.28 + velY;
        rotX = Math.max(-1.05, Math.min(1.15, rotX + velX));
        velY *= 0.92;
        velX *= 0.92;
      }
    } else if (!isDragging) {
      velY = 0;
      velX = 0;
    }

    render();

    if (isSlideActive && (!isPaused || isDragging)) {
      rafId = requestAnimationFrame(loop);
    } else {
      rafId = null;
    }
  }

  window.addEventListener('resize', resize);
  if (typeof ResizeObserver === 'function') {
    const ro = new ResizeObserver(() => resize());
    ro.observe(canvas);
  }
  syncToggleUI();
  resize();

  if (!isPaused && isSlideActive) {
    lastFrame = performance.now();
    rafId = requestAnimationFrame(loop);
  }

  return {
    setActive(active) {
      isSlideActive = active;
      if (active) {
        resize();
        if (!isPaused && !rafId) {
          lastFrame = performance.now();
          rafId = requestAnimationFrame(loop);
        }
      } else if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }
  };
};
