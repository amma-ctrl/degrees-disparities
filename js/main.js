/**
 * main.js
 * --------------------------------------------------------
 * Application entry point. Wires every visualization to the
 * scroll-based triggers, handles tab switching for the industry
 * breakdown section, and manages the progress bar.
 *
 * Architecture:
 *   - Scene fade-in via a single IntersectionObserver on .scene elements
 *   - Per-chart animation via a small onceVisible() helper that creates
 *     one observer per target, then disconnects after firing
 *   - Scroll-driven progress bar + hero dissolve + methodology tracking
 *
 * Load order required:
 *   data.js  →  charts.js  →  methodology.js  →  main.js
 */

(function () {
  'use strict';

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    window.Charts.buildDiverge();
    window.Charts.buildGCCharts();


    if (typeof IntersectionObserver === 'undefined') {
      revealAllImmediately();
    } else {
      setupSceneFadeIn();
      wireAnimationTriggers();
    }

    setupTabSwitching();
    setupScrollListeners();
  }


  function revealAllImmediately() {
    const C = window.Charts;
    document.querySelectorAll('.scene').forEach(s => s.classList.add('visible'));
    setTimeout(C.animateDiverge, 100);
    setTimeout(C.animateResidSquares, 100);
    setTimeout(C.animateRegTable, 100);
    setTimeout(C.animateConclusion, 100);
    document.querySelectorAll('#indChart [data-anim="ind"]').forEach(b => b.classList.add('animated'));
    const active = document.querySelector('.ind-content.active');
    if (active) {
      C.animateIndHbars(active);
      C.animateGCCharts(active);
    }
    const bigOR = document.getElementById('bigOR');
    if (bigOR) bigOR.style.opacity = '1';
  }

  function setupSceneFadeIn() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, {
      rootMargin: '0px 0px -15% 0px',
      threshold: 0.05
    });

    document.querySelectorAll('.scene').forEach(s => observer.observe(s));
  }


  function onceVisible(selector, callback, threshold) {
    const el = typeof selector === 'string'
      ? document.querySelector(selector)
      : selector;
    if (!el) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          callback(e.target);
          observer.unobserve(e.target);
        }
      });
    }, { threshold: threshold !== undefined ? threshold : 0.25 });

    observer.observe(el);
  }

  // ---------------------------------------------------------
  // Wire each visualization to its scroll trigger
  // ---------------------------------------------------------
  function wireAnimationTriggers() {
    const C = window.Charts;

    // Diverging leadership-gap chart
    onceVisible('#divergeChart', () => {
      setTimeout(C.animateDiverge, 200);
    });

    // Industry overview (paired horizontal bars across 4 sectors)
    onceVisible('#indChart', () => {
      setTimeout(() => {
        document
          .querySelectorAll('#indChart [data-anim="ind"]')
          .forEach(b => b.classList.add('animated'));
      }, 200);
    });

    // Chi-square residual grid
    onceVisible('#residGrid', () => {
      setTimeout(C.animateResidSquares, 200);
    });

    // Logistic regression table
    onceVisible('#regTable', () => {
      setTimeout(C.animateRegTable, 200);
    });

    // Big odds-ratio stat below the regression table
    onceVisible('#bigOR', () => {
      setTimeout(() => {
        const el = document.getElementById('bigOR');
        if (el) el.style.opacity = '1';
      }, 400);
    });

    // Conclusion hypothesis verdict
    onceVisible('#conclusionHypo', () => {
      C.animateConclusion();
    });

    // Industry tabs — the first active tab (Corporate) animates on entry;
    // subsequent tabs animate via the click handler
    onceVisible('#ind-corp', () => {
      setTimeout(() => {
        const active = document.querySelector('.ind-content.active');
        if (active) {
          C.animateIndHbars(active);
          C.animateGCCharts(active);
        }
      }, 250);
    });
  }

  // ---------------------------------------------------------
  // Industry tab switching
  // ---------------------------------------------------------
  function setupTabSwitching() {
    const C = window.Charts;
    document.querySelectorAll('.ind-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.ind-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.ind-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');

        const panel = document.getElementById('ind-' + tab.dataset.ind);
        if (!panel) return;
        panel.classList.add('active');

        // Brief delay so the panel becomes display:block before we measure widths
        setTimeout(() => {
          C.animateIndHbars(panel);
          C.animateGCCharts(panel);
        }, 50);
      });
    });
  }

  // ---------------------------------------------------------
  // Scroll-driven side effects:
  //   - Progress bar at the top of the page
  //   - Hero content dissolve on scroll
  //   - Methodology section enter/exit tracking
  // ---------------------------------------------------------
  function setupScrollListeners() {
    const prog = document.getElementById('prog');
    const methodEl = document.getElementById('s-method');

    function onScroll() {
      // Progress bar — fraction of total scrollable height
      if (prog) {
        const st = window.scrollY;
        const dh = document.documentElement.scrollHeight - window.innerHeight;
        prog.style.width = dh > 0 ? (st / dh * 100) + '%' : '0';
      }

      // Hero dissolve
      window.Charts.handleHeroDissolve();

      // Methodology section enter/exit
      if (methodEl && window.Methodology) {
        const r = methodEl.getBoundingClientRect();
        const visibleNow =
          r.top < window.innerHeight * 0.6 &&
          r.bottom > window.innerHeight * 0.2;
        if (visibleNow) {
          window.Methodology.enter();
        } else {
          window.Methodology.exit();
        }
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll(); // initial paint
  }
})();
