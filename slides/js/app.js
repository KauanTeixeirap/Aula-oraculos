(function bootstrapOracleDeck() {
  const Deck = (window.OracleDeck = window.OracleDeck || {});

  let slides = [];
  let currentSlide = 0;
  let currentSubStep = 0;
  let oracle3DScene = null;
  let httpSim = null;
  let pipelineStage = null;
  let supportsDisplayTransition;

  function canTransitionDisplay() {
    if (supportsDisplayTransition !== undefined) return supportsDisplayTransition;
    if (!window.CSS?.supports?.('transition-behavior', 'allow-discrete') || !document.body) {
      return false;
    }
    const probe = document.createElement('div');
    probe.style.cssText = 'transition: display 1s allow-discrete !important; display: block;';
    document.body.appendChild(probe);
    getComputedStyle(probe).display;
    probe.style.display = 'none';
    supportsDisplayTransition = getComputedStyle(probe).display === 'block';
    probe.remove();
    return supportsDisplayTransition;
  }

  async function hideDiscreteElement(el) {
    if (!el || el.hidden) return;
    if (canTransitionDisplay()) {
      el.hidden = true;
      return;
    }
    el.setAttribute('data-closing', '');
    const animations = el.getAnimations ? el.getAnimations() : [];
    if (animations.length > 0) {
      await Promise.race([
        Promise.allSettled(animations.map((a) => a.finished)),
        new Promise((r) => setTimeout(r, 400))
      ]);
    }
    if (el.hasAttribute('data-closing')) {
      el.removeAttribute('data-closing');
      el.hidden = true;
    }
  }

  function showDiscreteElement(el) {
    if (!el) return;
    el.removeAttribute('data-closing');
    el.hidden = false;
  }

  function initDots() {
    const container = document.getElementById('slide-Dots');
    if (!container) return;
    container.innerHTML = '';
    slides.forEach((_, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.onclick = () => Deck.goToSlide(idx, 0);
      btn.className = `h-2 rounded-full transition-all duration-300 ${
        idx === currentSlide ? 'w-7 bg-cyan-400' : 'w-2 bg-slate-700 hover:bg-slate-500'
      }`;
      btn.title = `Ir para Slide ${idx + 1}`;
      btn.setAttribute('aria-label', `Ir para Slide ${idx + 1}`);
      container.appendChild(btn);
    });
  }

  function updateUI(allowMorph = true) {
    slides.forEach((s, idx) => {
      if (idx === currentSlide) s.classList.add('active');
      else s.classList.remove('active');
    });

    const totalSteps = parseInt(slides[currentSlide].dataset.steps || '1', 10);
    const stepBadge = document.getElementById('step-indicator');

    if (totalSteps > 1 && stepBadge) {
      stepBadge.classList.remove('hidden');
      if (currentSlide === 5 && pipelineStage) {
        stepBadge.textContent = pipelineStage.getStepLabel(currentSubStep);
      } else {
        stepBadge.textContent = `Etapa Interna ${currentSubStep + 1} / ${totalSteps}`;
      }
    } else if (stepBadge) {
      stepBadge.classList.add('hidden');
    }

    const counter = document.getElementById('slide-counter');
    if (counter) {
      counter.textContent = `Slide ${String(currentSlide + 1).padStart(2, '0')} / ${slides.length}`;
    }

    const prevBtn = document.getElementById('btn-prev');
    if (prevBtn) {
      prevBtn.disabled = currentSlide === 0 && currentSubStep === 0;
    }

    const nextBtn = document.getElementById('btn-next');
    if (nextBtn) {
      if (currentSlide === slides.length - 1 && currentSubStep === totalSteps - 1) {
        nextBtn.innerHTML = `<span>Reiniciar</span> <i class="fa-solid fa-rotate-left"></i>`;
      } else if (currentSubStep < totalSteps - 1) {
        nextBtn.innerHTML = `<span>Próximo Passo</span> <i class="fa-solid fa-chevron-right"></i>`;
      } else {
        nextBtn.innerHTML = `<span>Próximo Slide</span> <i class="fa-solid fa-arrow-right"></i>`;
      }
    }

    if (pipelineStage) {
      pipelineStage.setActive(currentSlide === 5);
      if (currentSlide === 5) {
        pipelineStage.update(currentSubStep, allowMorph);
      }
    }

    initDots();

    // Update Teacher Notes
    const notes = Deck.TEACHER_NOTES || {};
    const noteKey = `${currentSlide}-${currentSubStep}`;
    const fallbackKey = `${currentSlide}-0`;
    const notesTitle = document.getElementById('notes-title');
    const notesContent = document.getElementById('notes-content');
    if (notesTitle) {
      notesTitle.textContent = `Cola do Professor — Slide ${currentSlide + 1} (Passo ${currentSubStep + 1})`;
    }
    if (notesContent) {
      notesContent.textContent = notes[noteKey] || notes[fallbackKey] || '';
    }

    if (oracle3DScene) {
      oracle3DScene.setActive(currentSlide === 0);
    }
  }

  Deck.setSubStep = function setSubStep(stepIndex) {
    const totalSteps = parseInt(slides[currentSlide]?.dataset.steps || '1', 10);
    currentSubStep = Math.max(0, Math.min(totalSteps - 1, stepIndex));
    updateUI(true);
  };

  Deck.goToSlide = function goToSlide(index, subStep = 0) {
    const prevSlide = currentSlide;
    currentSlide = Math.max(0, Math.min(slides.length - 1, index));
    const totalSteps = parseInt(slides[currentSlide]?.dataset.steps || '1', 10);
    currentSubStep = Math.max(0, Math.min(totalSteps - 1, subStep));
    updateUI(prevSlide === currentSlide);
  };

  Deck.nextStepOrSlide = function nextStepOrSlide() {
    const totalSteps = parseInt(slides[currentSlide].dataset.steps || '1', 10);
    if (currentSubStep < totalSteps - 1) {
      currentSubStep++;
      updateUI(true);
    } else if (currentSlide < slides.length - 1) {
      currentSlide++;
      currentSubStep = 0;
      updateUI(false);
    } else {
      Deck.goToSlide(0, 0);
    }
  };

  Deck.prevStepOrSlide = function prevStepOrSlide() {
    if (currentSubStep > 0) {
      currentSubStep--;
      updateUI(true);
    } else if (currentSlide > 0) {
      currentSlide--;
      const prevTotalSteps = parseInt(slides[currentSlide].dataset.steps || '1', 10);
      currentSubStep = prevTotalSteps - 1;
      updateUI(false);
    }
  };

  Deck.simulateHttpCall = function simulateHttpCall() {
    if (httpSim) httpSim.run();
  };

  Deck.resetHttpSimulator = function resetHttpSimulator() {
    if (httpSim) httpSim.reset();
  };

  Deck.toggleTeacherNotes = function toggleTeacherNotes() {
    const drawer = document.getElementById('teacher-drawer');
    if (!drawer) return;
    if (drawer.hidden || drawer.hasAttribute('data-closing')) {
      showDiscreteElement(drawer);
    } else {
      hideDiscreteElement(drawer);
    }
  };

  Deck.toggleFullScreen = function toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      Deck.nextStepOrSlide();
    } else if (e.key === ' ') {
      if (e.target && e.target.tagName === 'BUTTON') return;
      e.preventDefault();
      Deck.nextStepOrSlide();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      Deck.prevStepOrSlide();
    } else if (e.key.toLowerCase() === 'n') {
      Deck.toggleTeacherNotes();
    } else if (e.key.toLowerCase() === 'f') {
      Deck.toggleFullScreen();
    }
  });

  function mount() {
    const root = document.getElementById('slides-root');
    if (!root) return;

    root.innerHTML = (Deck.SLIDES || []).map((fn) => fn()).join('\n');
    slides = Array.from(root.querySelectorAll('.slide-view'));

    if (typeof Deck.initIbcKnot3D === 'function') {
      Deck.ibcKnot3D = Deck.initIbcKnot3D();
    }
    if (typeof Deck.initOracleCube3D === 'function') {
      oracle3DScene = Deck.initOracleCube3D();
    }
    if (typeof Deck.createHttpSimulator === 'function') {
      httpSim = Deck.createHttpSimulator();
      httpSim.reset();
    }
    if (typeof Deck.createPipelineStage === 'function') {
      pipelineStage = Deck.createPipelineStage();
    }

    updateUI(false);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
