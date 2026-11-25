window.OracleDeck = window.OracleDeck || {};

/**
 * Animates glowing data packets centered exactly along curved SVG <path data-flow-path> elements.
 * Packets start pre-distributed along [0, 1) so nothing freezes at the origin.
 */
window.OracleDeck.createFlowPathAnimator = function createFlowPathAnimator(svgId, dotColor = '#38bdf8') {
  const svg = document.getElementById(svgId);
  if (!svg) return { start() {}, stop() {} };

  const SVG_NS = 'http://www.w3.org/2000/svg';
  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const paths = Array.from(svg.querySelectorAll('path[data-flow-path]'));

  let layer = svg.querySelector('.flow-dots-layer');
  if (!layer) {
    layer = document.createElementNS(SVG_NS, 'g');
    layer.setAttribute('class', 'flow-dots-layer');
    svg.appendChild(layer);
  }

  const items = [];
  paths.forEach((path, pIdx) => {
    const totalLen = path.getTotalLength();
    const color = path.getAttribute('data-dot-color') || dotColor;
    [0, 0.5].forEach((pairOffset) => {
      const circle = document.createElementNS(SVG_NS, 'circle');
      circle.setAttribute('r', '4');
      circle.setAttribute('fill', color);
      circle.setAttribute('class', 'flow-packet-circle');
      circle.style.filter = `drop-shadow(0 0 6px ${color})`;
      layer.appendChild(circle);
      items.push({
        path,
        totalLen,
        circle,
        offset: (pIdx * 0.17 + pairOffset) % 1,
        speed: 0.34 + (pIdx % 3) * 0.04
      });
    });
  });

  let rafId = null;
  let active = false;
  let elapsed = 0;
  let lastTime = performance.now();

  function renderFrame(tSeconds) {
    const reduced = reducedMotionQuery.matches;
    items.forEach((item, idx) => {
      if (reduced) {
        if (idx % 2 === 1) {
          item.circle.setAttribute('opacity', '0');
          return;
        }
        const pt = item.path.getPointAtLength(item.totalLen * 0.5);
        item.circle.setAttribute('cx', pt.x.toFixed(2));
        item.circle.setAttribute('cy', pt.y.toFixed(2));
        item.circle.setAttribute('opacity', '0.85');
        return;
      }

      const progress = (tSeconds * item.speed + item.offset) % 1;
      const pt = item.path.getPointAtLength(progress * item.totalLen);
      const alpha = progress < 0.12
        ? progress / 0.12
        : progress > 0.88
          ? (1 - progress) / 0.12
          : 1;
      item.circle.setAttribute('cx', pt.x.toFixed(2));
      item.circle.setAttribute('cy', pt.y.toFixed(2));
      item.circle.setAttribute('opacity', Math.max(0, Math.min(1, alpha)).toFixed(2));
    });
  }

  function loop(now) {
    if (!active || reducedMotionQuery.matches) {
      rafId = null;
      return;
    }
    const dt = Math.min(0.05, (now - lastTime) / 1000);
    lastTime = now;
    elapsed += dt;
    renderFrame(elapsed);
    rafId = requestAnimationFrame(loop);
  }

  renderFrame(0);

  return {
    start() {
      active = true;
      renderFrame(elapsed);
      if (!reducedMotionQuery.matches && !rafId) {
        lastTime = performance.now();
        rafId = requestAnimationFrame(loop);
      }
    },
    stop() {
      active = false;
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }
  };
};
