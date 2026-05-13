/**
 * methodology.js
 * --------------------------------------------------------
 * Methodology section step animation.
 *
 * Behavior:
 *   - Loops through the 6 steps every 3 seconds.
 *   - Clicking a step pauses the loop on that step.
 *   - Loop resumes only when the user scrolls out of the
 *     methodology section and then back into it.
 *   - When a step is highlighted, its details panel updates
 *     with the corresponding stepDetails HTML.
 *
 * Depends on: window.AppData.stepDetails
 *
 * Exposes:
 *   window.Methodology.enter()  — called when the user scrolls into the section
 *   window.Methodology.exit()   — called when the user scrolls out
 */

(function () {
  'use strict';

  const STEP_INTERVAL_MS = 3000;
  const TOTAL_STEPS = 6;

  // Module state — kept local to this IIFE
  let stepTimer = null;
  let currentStep = 0;
  let pausedByClick = false;
  let inView = false;


  function highlightStep(idx) {
    document.querySelectorAll('.method-step').forEach((s, i) => {
      s.classList.toggle('active-step', i === idx);
    });
    document.querySelectorAll('.method-arrow').forEach((a, i) => {
      a.classList.toggle('lit', i < idx);
    });
    const detail = document.getElementById('methodDetail');
    if (detail && window.AppData && window.AppData.stepDetails) {
      detail.innerHTML = window.AppData.stepDetails[idx];
      detail.classList.add('open');
    }
  }

  function startLoop() {
    if (stepTimer || pausedByClick) return;
    highlightStep(currentStep);
    stepTimer = setInterval(() => {
      currentStep = (currentStep + 1) % TOTAL_STEPS;
      highlightStep(currentStep);
    }, STEP_INTERVAL_MS);
  }

  function stopLoop() {
    if (stepTimer) {
      clearInterval(stepTimer);
      stepTimer = null;
    }
  }

  /**
   * Called when the user scrolls INTO the methodology section.
   * Resets the pause flag and restarts the loop from step 1.
   */
  function enter() {
    if (inView) return;
    inView = true;
    pausedByClick = false;
    currentStep = 0;
    setTimeout(startLoop, 400);
  }

  /**
   * Called when the user scrolls OUT of the methodology section.
   * Stops the loop so it can restart fresh next time.
   */
  function exit() {
    if (!inView) return;
    inView = false;
    stopLoop();
  }

  /**
   * Bind click handlers to each step card. Clicking pauses the
   * auto-loop and locks the highlight to the clicked step until
   * the user leaves the section.
   */
  function bindClickHandlers() {
    document.querySelectorAll('.method-step').forEach((s, i) => {
      s.addEventListener('click', () => {
        stopLoop();
        pausedByClick = true;
        currentStep = i;
        highlightStep(i);
      });
    });
  }

  // Bind handlers as soon as the script runs (DOM is ready because main.js
  // loads scripts at the end of body or with defer)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindClickHandlers);
  } else {
    bindClickHandlers();
  }

  window.Methodology = {
    enter: enter,
    exit: exit
  };
})();
