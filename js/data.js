/**
 * data.js
 * --------------------------------------------------------
 * Static datasets and content strings used by the visualizations.
 * Exposed on the global `window.AppData` namespace so that any
 * downstream module can read them after this file loads.
 *
 *   AppData.divergeData    — leadership gap by group (overview chart)
 *   AppData.interData      — intersectionality data, keyed by tab+axis
 *   AppData.stepDetails    — methodology step detail content (HTML strings)
 */

(function () {
  'use strict';

  /* ------------------------------------------------------
     Leadership gap — diverging bar chart
     Values are percentage points above/below the population
     average leadership share among advanced degree holders.
     ------------------------------------------------------ */
  const divergeData = [
    { label: 'Multiracial Male',     value:  4.1 },
    { label: 'White Male',           value:  3.4 },
    { label: 'Other Race Male',      value:  2.3 },
    { label: 'Native American Male', value: -0.8 },
    { label: 'Other Race Female',    value: -2.6 },
    { label: 'Multiracial Female',   value: -3.2 },
    { label: 'Black Male',           value: -4.8 },
    { label: 'Native Amer. Female',  value: -5.5 },
    { label: 'Asian/Pacific Male',   value: -5.9 },
    { label: 'Asian/Pacific Female', value: -8.1 },
    { label: 'White Female',         value: -8.4 },
    { label: 'Black Female',         value: -11.4, focus: true }
  ];

  /* ------------------------------------------------------
     Intersectionality — two-cluster grouped bar data.
     Each entry contains:
       yMax    — vertical axis max (percent)
       groups  — array of { label, color, degree, leadership, isBW? }

     Keys follow the pattern `${sector}-${axis}` where axis is
     either 'gender' (2 groups) or 'race' (6 groups).
     ------------------------------------------------------ */
  const interData = {
    /* ----- GENDER comparisons (Black men vs. Black women) ----- */
    'corp-gender': {
      yMax: 50,
      groups: [
        { label: 'Black Men',   color: 'var(--g-male)',   degree: 1.0, leadership: 0.4 },
        { label: 'Black Women', color: 'var(--g-female)', degree: 1.3, leadership: 0.3, isBW: true }
      ]
    },
    'health-gender': {
      yMax: 60,
      groups: [
        { label: 'Black Men',   color: 'var(--g-male)',   degree: 0.1, leadership: 0.2 },
        { label: 'Black Women', color: 'var(--g-female)', degree: 0.5, leadership: 0.3, isBW: true }
      ]
    },
    'public-gender': {
      yMax: 40,
      groups: [
        { label: 'Black Men',   color: 'var(--g-male)',   degree: 0.4, leadership: 0.5 },
        { label: 'Black Women', color: 'var(--g-female)', degree: 0.7, leadership: 0.8, isBW: true }
      ]
    },
    'academia-gender': {
      yMax: 35,
      groups: [
        { label: 'Black Men',   color: 'var(--g-male)',   degree: 0.4, leadership: 0.1 },
        { label: 'Black Women', color: 'var(--g-female)', degree: 1.1, leadership: 0.2, isBW: true }
      ]
    },

    /* ----- RACE comparisons (6 racial groups among women) ----- */
    'corp-race': {
      yMax: 50,
      groups: [
        { label: 'White',        color: 'var(--r-white)',  degree: 36.5, leadership: 33.8 },
        { label: 'Asian/Pac.',   color: 'var(--r-asian)',  degree: 40.0, leadership: 31.2 },
        { label: 'Black',        color: 'var(--r-black)',  degree: 42.0, leadership: 30.8, isBW: true },
        { label: 'Multiracial',  color: 'var(--r-multi)',  degree: 37.0, leadership: 32.5 },
        { label: 'Other',        color: 'var(--r-other)',  degree: 35.0, leadership: 31.8 },
        { label: 'Native Amer.', color: 'var(--r-native)', degree: 33.0, leadership: 27.4 }
      ]
    },
    'health-race': {
      yMax: 60,
      groups: [
        { label: 'White',        color: 'var(--r-white)',  degree: 49.0, leadership: 46.2 },
        { label: 'Asian/Pac.',   color: 'var(--r-asian)',  degree: 53.0, leadership: 43.8 },
        { label: 'Black',        color: 'var(--r-black)',  degree: 51.0, leadership: 25.5, isBW: true },
        { label: 'Multiracial',  color: 'var(--r-multi)',  degree: 46.0, leadership: 38.2 },
        { label: 'Other',        color: 'var(--r-other)',  degree: 44.0, leadership: 36.5 },
        { label: 'Native Amer.', color: 'var(--r-native)', degree: 41.0, leadership: 29.8 }
      ]
    },
    'public-race': {
      yMax: 40,
      groups: [
        { label: 'White',        color: 'var(--r-white)',  degree: 26.5, leadership: 23.0 },
        { label: 'Asian/Pac.',   color: 'var(--r-asian)',  degree: 27.0, leadership: 22.1 },
        { label: 'Black',        color: 'var(--r-black)',  degree: 32.0, leadership: 20.3, isBW: true },
        { label: 'Multiracial',  color: 'var(--r-multi)',  degree: 25.0, leadership: 21.4 },
        { label: 'Other',        color: 'var(--r-other)',  degree: 24.5, leadership: 20.8 },
        { label: 'Native Amer.', color: 'var(--r-native)', degree: 23.0, leadership: 17.2 }
      ]
    },
    'academia-race': {
      yMax: 35,
      groups: [
        { label: 'White',        color: 'var(--r-white)',  degree: 24.0, leadership: 21.8 },
        { label: 'Asian/Pac.',   color: 'var(--r-asian)',  degree: 23.0, leadership: 19.8 },
        { label: 'Black',        color: 'var(--r-black)',  degree: 28.5, leadership: 21.6, isBW: true },
        { label: 'Multiracial',  color: 'var(--r-multi)',  degree: 22.0, leadership: 18.4 },
        { label: 'Other',        color: 'var(--r-other)',  degree: 21.5, leadership: 18.8 },
        { label: 'Native Amer.', color: 'var(--r-native)', degree: 20.0, leadership: 15.6 }
      ]
    }
  };

  /* ------------------------------------------------------
     Methodology step detail panels — HTML strings shown
     beneath the step flow when a step becomes active.
     Indexed 0..5 matching steps 01..06.
     ------------------------------------------------------ */
  const stepDetails = [
    /* 0 — Data Acquisition */
    `<strong>Data Acquisition:</strong> The 2023 1-year ACS IPUMS extract was downloaded with the following variables selected:
    <ul>
      <li><em>EDUC</em> — educational attainment (filtered to advanced degree holders)</li>
      <li><em>OCC2010</em> — occupation code (used for sector and leadership classification)</li>
      <li><em>SEX</em> — binary sex as recorded by ACS</li>
      <li><em>RACE / HISPAN</em> — racial and Hispanic origin flags</li>
      <li><em>EMPSTAT</em> — employment status (used to exclude non-employed respondents)</li>
    </ul>
    Sample was restricted to civilian adults aged 25 or older who reported being employed in the reference week. N = 372,226 after all filters applied.`,

    /* 1 — Data Preparation */
    `<strong>Data Preparation:</strong> Three key binary variables were constructed from the raw data:
    <ul>
      <li><em>advanced_degree</em>: EDUC ≥ 11 (Master's, Professional, or Doctoral)</li>
      <li><em>leadership</em>: OCC2010 code falls within the leadership classifier</li>
      <li><em>is_black_woman</em>: RACE = 200 AND SEX = 2 (Female)</li>
    </ul>
    A sector variable with four levels was also constructed. All coding decisions are documented in the GitHub occupation code mapping reference.

    <div style="margin-top:1.25rem"><strong style="color:var(--text)">Classification Detail:</strong></div>
    <div class="classify-grid">
      <div class="classify-card">
        <div class="classify-label">Industry Classification</div>
        <div class="classify-title">Sector Assignment via OCC2010</div>
        <div class="classify-text">~500 occupation codes grouped into four sectors: <strong>Corporate/Private</strong> (management, finance, tech — ~280 codes), <strong>Healthcare</strong> (physicians, nurses, therapists — ~40), <strong>Public Sector &amp; Legal</strong> (government, law, social services — ~60), and <strong>Academia &amp; Research</strong> (professors, scientists, librarians — ~35). Retail, agriculture, and personal services excluded as out of scope.</div>
      </div>
      <div class="classify-card">
        <div class="classify-label">Degree Type</div>
        <div class="classify-title">Advanced Degree Filter (EDUC ≥ 11)</div>
        <div class="classify-text">Only Master's (11), Professional/JD/MD (12), or Doctoral/PhD (13) degree holders retained. Bachelor's and below excluded to hold educational attainment constant. This ensures observed leadership gaps cannot be attributed to differential educational credentials — every person in the analysis holds at minimum a graduate degree.</div>
      </div>
      <div class="classify-card">
        <div class="classify-label">Leadership Classification</div>
        <div class="classify-title">Executive &amp; Senior Role Indicator</div>
        <div class="classify-text">Leadership operationalized from OCC2010 as: <strong>C-suite and senior executives</strong> (CEOs, COOs, VPs), <strong>senior managers and directors</strong>, <strong>physicians and CMOs</strong>, <strong>judges and senior legal officers</strong>, <strong>tenured full professors and department chairs</strong>, and <strong>senior government officials</strong>. Mid-level managers and practitioners were excluded unless their code specifically indicated executive authority.</div>
      </div>
    </div>`,

    /* 2 — Descriptive */
    `<strong>Descriptive Analysis:</strong> Leadership proportions were calculated as: <em>proportion = (n in leadership) / (n with advanced degree)</em> for each group × sector combination. Results were visualized using:
    <ul>
      <li>Grouped bar charts (degree vs. leadership share, by race and gender)</li>
      <li>A diverging bar chart showing deviation from the population average</li>
      <li>An interactive Tableau Public dashboard for sector-level exploration</li>
    </ul>
    Summary tables by group, sector, and race/gender were produced and reviewed for face validity before proceeding to inferential testing.`,

    /* 3 — Chi-Square */
    `<strong>Chi-Square Testing:</strong> Pearson chi-square tests of independence were conducted on contingency tables of the form: Group (Black Women vs. All Others) × Leadership Status (1 vs. 0). Tests were run:
    <ul>
      <li>Overall across all 372,226 observations</li>
      <li>Stratified by each of the four industry sectors</li>
    </ul>
    Standardized Pearson residuals — computed as <em>(O − E) / √E</em> — were extracted and plotted in a corrplot-style grid to identify which cells drive the overall test statistic (χ² = 4,217.3, p &lt; 2.2e-16). Every cell exceeds the |2| significance threshold.`,

    /* 4 — Logistic Regression */
    `<strong>Logistic Regression:</strong> A binary logistic regression was estimated in R:
    <ul>
      <li><em>glm(leadership ~ is_black_woman + industry, family = binomial, data = df)</em></li>
      <li>Coefficient on <em>is_black_woman</em> exponentiated → odds ratio OR = 0.707</li>
      <li>Interpreted as: −29.3% lower odds of holding leadership, <strong>controlling for industry</strong></li>
      <li>Model fit assessed via Hosmer-Lemeshow test and deviance residual plots</li>
    </ul>
    The logistic specification was chosen over the Linear Probability Model to correctly handle binary outcomes and avoid predicted probabilities outside [0,1].`,

    /* 5 — Validation */
    `<strong>Validation &amp; Reporting:</strong> Residual diagnostics were reviewed to check for influential observations and model misspecification. Results were cross-validated against proportions from the Tableau Public dataset. Final visualizations were produced in:
    <ul>
      <li>ggplot2 — grouped bars, diverging bars, proportion tables</li>
      <li>corrplot — Pearson residual heatmap</li>
      <li>Tableau Public — interactive sector-level dashboard</li>
      <li>This scrollytelling HTML report — custom SVG/JS visualizations</li>
    </ul>
    All code and data (processed extract) are available on GitHub.`
  ];

  // Expose to the global namespace
  window.AppData = {
    divergeData: divergeData,
    interData: interData,
    stepDetails: stepDetails
  };
})();
