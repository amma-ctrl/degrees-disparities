/**
 * charts.js
 * --------------------------------------------------------
 * Build and animate every visualization in the report:
 *   - Diverging bar chart (leadership gap by group)
 *   - Two-cluster intersectionality charts (degree vs. leadership)
 *   - Chi-square residual squares
 *   - Industry bar charts with gap-bracket visualizer
 *   - Regression table row reveal + OR forest-plot dots
 *   - Conclusion hypothesis verdict animation
 *   - Hero dissolve on scroll
 *
 * All functions are namespaced under window.Charts so main.js
 * can call them in the right order.
 *
 * Depends on: window.AppData (data.js)
 */

(function () {
  'use strict';

  const { divergeData, interData } = window.AppData;

  /* ======================================================
     DIVERGING BAR CHART — leadership gap by group
     ====================================================== */

  /**
   * Build DOM nodes for the diverging chart at #divergeChart.
   * Creates gridlines, a zero-axis line, and a column per data point.
   * Each column holds a hidden bar (height 0) ready to animate.
   */
  function buildDiverge() {
    const root = document.getElementById('divergeChart');
    if (!root) return;

    const absMax = Math.max(...divergeData.map(d => Math.abs(d.value)));
    const scaleMax = Math.ceil(absMax / 2) * 2;

    // Grid lines at ±max and ±max/2
    [scaleMax, scaleMax / 2, -scaleMax / 2, -scaleMax].forEach(gv => {
      const line = document.createElement('div');
      line.className = 'diverge-grid';
      line.style.top = `calc(50% - ${(gv / scaleMax) * 50}%)`;
      const lbl = document.createElement('span');
      lbl.className = 'diverge-grid-label';
      lbl.textContent = (gv > 0 ? '+' : '') + gv;
      line.appendChild(lbl);
      root.appendChild(line);
    });

    // Zero line
    const zero = document.createElement('div');
    zero.className = 'diverge-zero';
    root.appendChild(zero);

    // One column per data point
    divergeData.forEach(d => {
      const col = document.createElement('div');
      col.className = 'diverge-col' + (d.focus ? ' is-bw' : '');

      const barContainer = document.createElement('div');
      barContainer.className = 'diverge-bar-container';

      const isPos = d.value >= 0;
      const bar = document.createElement('div');
      bar.className = 'diverge-bar ' + (isPos ? 'pos' : 'neg') + (d.focus ? ' highlight' : '');
      const hPct = (Math.abs(d.value) / scaleMax) * 50;
      bar.dataset.h = hPct;
      barContainer.appendChild(bar);

      // Value label — positioned just outside the bar, flips inside when bar is tall
      const val = document.createElement('div');
      val.className = 'diverge-val';
      val.textContent = (d.value > 0 ? '+' : '') + d.value.toFixed(1);
      const flip = hPct > 40;
      if (isPos) {
        val.style.bottom = flip ? `calc(50% + ${hPct}% - 16px)` : `calc(50% + ${hPct}% + 4px)`;
      } else {
        val.style.top = flip ? `calc(50% + ${hPct}% - 16px)` : `calc(50% + ${hPct}% + 4px)`;
      }
      if (flip) val.style.color = '#fff';
      col.appendChild(val);

      const lbl = document.createElement('div');
      lbl.className = 'diverge-label';
      lbl.textContent = d.label;
      col.appendChild(lbl);
      col.appendChild(barContainer);
      root.appendChild(col);
    });
  }

  /**
   * Animate each diverging chart column in sequence by growing its bar
   * from 0 to its target height and fading in its value label.
   */
  function animateDiverge() {
    document.querySelectorAll('#divergeChart .diverge-col').forEach((col, i) => {
      setTimeout(() => {
        const bar = col.querySelector('.diverge-bar');
        const val = col.querySelector('.diverge-val');
        if (bar) bar.style.height = bar.dataset.h + '%';
        if (val) val.classList.add('show');
      }, i * 140);
    });
  }

  /* ======================================================
     TWO-CLUSTER INTERSECTIONALITY CHARTS
     Each chart has two side-by-side clusters:
       1. "Share with Advanced Degree"
       2. "Share in Leadership"
     Each cluster contains N bars (one per group), colored
     by sex or race depending on the chart's data key.
     ====================================================== */

  /**
   * Build DOM nodes for every .gc-chart on the page, sourcing data
   * from interData by the chart's data-group attribute. Also populates
   * the matching labels row and legend elements.
   */
  function buildGCCharts() {
    document.querySelectorAll('.gc-chart').forEach(chart => {
      const key = chart.dataset.group;
      const data = interData[key];
      if (!data) return;

      // Horizontal grid lines (5 gridlines: 0%, 25%, 50%, 75%, 100% of yMax)
      const steps = 4;
      for (let i = 0; i <= steps; i++) {
        const gv = (data.yMax / steps) * i;
        const line = document.createElement('div');
        line.className = 'gc-grid';
        line.style.bottom = `${(i / steps) * 100}%`;
        const lbl = document.createElement('span');
        lbl.className = 'gc-grid-label';
        lbl.textContent = gv + '%';
        line.appendChild(lbl);
        chart.appendChild(line);
      }

      // Two clusters — first is degree share, second is leadership share
      ['degree', 'leadership'].forEach(metric => {
        const cluster = document.createElement('div');
        cluster.className = 'gc-cluster';
        cluster.dataset.metric = metric;

        data.groups.forEach(g => {
          const bar = document.createElement('div');
          bar.className = 'gc-bar';
          bar.style.background = g.color;
          const value = metric === 'degree' ? g.degree : g.leadership;
          bar.dataset.h = (value / data.yMax * 100).toFixed(1);
          const gvSpan = document.createElement('span');
          gvSpan.className = 'gv';
          gvSpan.textContent = value + '%';
          bar.appendChild(gvSpan);
          cluster.appendChild(bar);
        });

        chart.appendChild(cluster);
      });

      // Cluster labels row (sits below the chart, matching the cluster gap)
      const labelsRow = document.querySelector(`[data-labels="${key}"]`);
      if (labelsRow) {
        labelsRow.innerHTML = '';
        ['Share with Advanced Degree', 'Share in Leadership'].forEach(lbl => {
          const wrap = document.createElement('div');
          wrap.className = 'gc-cluster-wrap';
          const l = document.createElement('div');
          l.className = 'gc-cluster-label';
          l.textContent = lbl;
          wrap.appendChild(l);
          labelsRow.appendChild(wrap);
        });
      }

      // Color-coded legend (one entry per group)
      const legendEl = document.querySelector(`[data-legend="${key}"]`);
      if (legendEl) {
        legendEl.innerHTML = '';
        data.groups.forEach(g => {
          const item = document.createElement('div');
          item.className = 'gc-legend-item';
          const swatch = document.createElement('div');
          swatch.className = 'gc-legend-swatch';
          swatch.style.background = g.color;
          const lbl = document.createElement('span');
          lbl.textContent = g.label;
          if (g.isBW) lbl.style.fontWeight = '700';
          item.appendChild(swatch);
          item.appendChild(lbl);
          legendEl.appendChild(item);
        });
      }
    });
  }

  /**
   * Animate the grouped-cluster bars within a given scope (default: document).
   * When `scope` is a tab panel, only its bars animate — used on tab switches.
   */
  function animateGCCharts(scope) {
    const root = scope || document;
    root.querySelectorAll('.gc-chart').forEach(chart => {
      chart.querySelectorAll('.gc-bar').forEach((bar, i) => {
        bar.style.height = '0';
        bar.classList.remove('show');
        setTimeout(() => {
          bar.style.height = bar.dataset.h + '%';
          bar.classList.add('show');
        }, 120 + i * 100);
      });
    });
  }

  /* ======================================================
     CHI-SQUARE RESIDUAL SQUARES
     Encodes residual magnitude as background-color alpha so
     the label text inside stays at full opacity regardless
     of intensity.
     ====================================================== */

  function hexToRgb(hex) {
    const h = hex.replace('#', '');
    return {
      r: parseInt(h.substring(0, 2), 16),
      g: parseInt(h.substring(2, 4), 16),
      b: parseInt(h.substring(4, 6), 16)
    };
  }

  /**
   * Color each .resid-square element based on its data-rv value,
   * then stagger its reveal. Positive residuals get teal, negative
   * residuals get purple, and alpha scales with sqrt(|value| / max).
   */
  function animateResidSquares() {
    const squares = document.querySelectorAll('.resid-square[data-rv]');
    let absMax = 0;
    squares.forEach(s => { absMax = Math.max(absMax, Math.abs(parseFloat(s.dataset.rv))); });

    // Resolve CSS color variables so we can encode intensity in alpha
    const rootStyle = getComputedStyle(document.documentElement);
    const tealRGB = rootStyle.getPropertyValue('--teal').trim() || '#2e7068';
    const purpRGB = rootStyle.getPropertyValue('--purple').trim() || '#6b4c8a';
    const teal = hexToRgb(tealRGB);
    const purp = hexToRgb(purpRGB);

    squares.forEach((sq, i) => {
      const v = parseFloat(sq.dataset.rv);
      const norm = Math.sqrt(Math.abs(v) / absMax);
      const alpha = (0.22 + norm * 0.78).toFixed(2);
      const c = v > 0 ? teal : purp;
      sq.style.setProperty('--target-bg', `rgba(${c.r}, ${c.g}, ${c.b}, ${alpha})`);
      setTimeout(() => sq.classList.add('show'), 200 + i * 110);
    });
  }

  /* ======================================================
     INDUSTRY BAR CHART + GAP-BRACKET VISUALIZER
     Each .ind-bar-section has two bars (All Others, Black
     Women) plus a dashed bracket that highlights the gap.
     ====================================================== */

  /**
   * Animate the industry tab's horizontal bars and the gap-bracket
   * overlay that visually highlights the percentage-point gap.
   *
   * @param {Element|Document} scope - Container to look inside (defaults to document)
   */
  function animateIndHbars(scope) {
    const root = scope || document;

    // Step 1: animate the bar fills
    root.querySelectorAll('[data-anim="indhbar"]').forEach(b => {
      b.classList.remove('animated');
      b.style.width = '';
      void b.offsetWidth; // force reflow so the CSS transition retriggers
      b.classList.add('animated');
    });

    // Step 2: position and reveal the gap brackets after the bars finish
    root.querySelectorAll('.ind-bar-section').forEach(section => {
      const bracket = section.querySelector('.ind-gap-bracket');
      if (!bracket) return;

      const allW = parseFloat(section.dataset.allW);
      const bwW = parseFloat(section.dataset.bwW);
      if (isNaN(allW) || isNaN(bwW)) return;

      // Measure the live bar-track width so the bracket sits over the actual bar pixels
      const trackRef = section.querySelector('.bar-track');
      if (!trackRef) return;
      const trackPx = trackRef.getBoundingClientRect().width;
      if (!trackPx) return;

      const leftPct = Math.min(allW, bwW);
      const rightPct = Math.max(allW, bwW);
      const leftPx = (leftPct / 100) * trackPx;
      const rightPx = (rightPct / 100) * trackPx;
      const widthPx = rightPx - leftPx;

      // Parity case (Academia): show a small centered marker so the user can still see "gap zone"
      const MIN_WIDTH = 60;
      bracket.style.left = leftPx + 'px';
      bracket.style.width = (widthPx < MIN_WIDTH ? MIN_WIDTH : widthPx) + 'px';
      if (widthPx < MIN_WIDTH) {
        bracket.style.left = ((leftPx + rightPx) / 2 - MIN_WIDTH / 2) + 'px';
      }

      // Reset and reveal after the bars finish their ~2.2s fill animation
      bracket.classList.remove('show');
      void bracket.offsetWidth;
      setTimeout(() => bracket.classList.add('show'), 1800);
    });
  }

  /* ======================================================
     REGRESSION TABLE ANIMATION
     Row-by-row reveal + dot positioning on a log-scaled OR axis.
     ====================================================== */

  /**
   * Reveal each row of #regTable in sequence and position each OR
   * dot on a log-scaled axis. Dots below 1.0 turn red (reduced odds),
   * above 1.0 turn teal (increased odds), near 1.0 stay neutral.
   */
  function animateRegTable() {
    const rows = document.querySelectorAll('#regTable tbody tr');
    rows.forEach((row, i) => {
      const or = parseFloat(row.dataset.or);
      const dot = row.querySelector('.or-dot');
      if (dot && !isNaN(or)) {
        // log2 scale: 0.5 → 25%, 1.0 → 50%, 2.0 → 75%; clamp to [5%, 95%]
        const log = Math.log2(or);
        const pct = Math.max(5, Math.min(95, 50 + log * 25));
        dot.style.left = pct + '%';
        if (or < 0.95) dot.classList.add('below-1');
        else if (or > 1.05) dot.classList.add('above-1');
      }
      setTimeout(() => row.classList.add('show'), 200 + i * 220);
    });
  }

  /* ======================================================
     CONCLUSION HYPOTHESIS VERDICT
     Highlights the accepted hypothesis card in green and
     fades/desaturates the rejected one.
     ====================================================== */

  /**
   * Animate the conclusion section's hypothesis cards.
   * Adds .accepting to H1 and .rejecting to H0, plus
   * reveals the verdict badges.
   */
  function animateConclusion() {
    setTimeout(() => {
      const h0 = document.getElementById('conc-h0');
      const h1 = document.getElementById('conc-h1');
      const va = document.getElementById('verdict-accept');
      const vr = document.getElementById('verdict-reject');
      if (h0) h0.classList.add('rejecting');
      if (h1) h1.classList.add('accepting');
      if (va) va.style.display = 'inline-block';
      if (vr) vr.style.display = 'inline-block';
    }, 1100);
  }

  /* ======================================================
     HERO SECTION DISSOLVE
     Fades the hero content out as the user scrolls into the
     next section, creating a clean transition.
     ====================================================== */

  /**
   * Toggle .dissolved on the hero content based on scroll position.
   * Called on every scroll/resize event from main.js.
   */
  function handleHeroDissolve() {
    const content = document.getElementById('heroContent');
    const hero = document.getElementById('s-hero');
    if (!content || !hero) return;
    if (window.scrollY > hero.offsetHeight * 0.3) {
      content.classList.add('dissolved');
    } else {
      content.classList.remove('dissolved');
    }
  }

  // Expose chart API to the global namespace
  window.Charts = {
    buildDiverge: buildDiverge,
    animateDiverge: animateDiverge,
    buildGCCharts: buildGCCharts,
    animateGCCharts: animateGCCharts,
    animateResidSquares: animateResidSquares,
    animateIndHbars: animateIndHbars,
    animateRegTable: animateRegTable,
    animateConclusion: animateConclusion,
    handleHeroDissolve: handleHeroDissolve
  };
})();
