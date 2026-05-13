# Degrees & Disparities

> An empirical analysis of leadership disparities for Black women with advanced degrees across four U.S. industry sectors, using 2023 ACS IPUMS microdata. Presented as an interactive scrollytelling report.

**Research question:** Is there a statistically significant disparity between the proportion of Black women who earn advanced degrees and their representation in higher leadership positions across various industries?

**Key finding:** Across all four sectors examined (Corporate, Healthcare, Public Sector, Academia), Black women are significantly underrepresented in leadership relative to their share of the advanced-degree pool. A logistic regression controlling for industry yields an odds ratio of **0.707 (p < 0.001)** — Black women have approximately 29.3% lower odds of holding leadership compared to all other groups.

---

## Live demo

Open `index.html` in any modern browser, or visit the GitHub Pages deployment (see Setup below).

---

## Project structure

```
degrees-disparities/
├── index.html              Main page markup
├── README.md               This file
├── LICENSE                 MIT license
├── .gitignore              Standard ignores
│
├── assets/
│   └── hero_image.png      Hero section background
│
├── css/
│   └── styles.css          All page styles (CSS custom properties + responsive grid)
│
└── js/
    ├── data.js             Static data (chart values, methodology copy)
    ├── charts.js           Chart builders + animation functions
    ├── methodology.js      Auto-looping step animation
    └── main.js             Entry point: IntersectionObserver wiring, tab switching, init
```

### Script load order

The scripts are dependency-ordered in `index.html`:

1. **`data.js`** populates `window.AppData` with chart data and methodology copy.
2. **`charts.js`** reads `AppData` and exposes `window.Charts` with all chart builders and animation functions.
3. **`methodology.js`** exposes `window.Methodology` for entering/exiting the auto-loop.
4. **`main.js`** is the orchestrator. On `DOMContentLoaded` it builds the static chart DOM, sets up an IntersectionObserver for scene fade-ins, wires each visualization to a per-element trigger, binds the tab-switching handler, and starts the scroll listener.

---

## Setup

### Run locally

The project is plain HTML/CSS/JS with no build step. Any static server works:

```bash
# Option 1 — Python's built-in server
cd degrees-disparities
python3 -m http.server 8080
# then open http://localhost:8080
```

```bash
# Option 2 — Node's http-server (one-time install)
npx http-server -p 8080
```

> **Note:** opening `index.html` directly via `file://` works for everything except scroll-triggered animations on some browsers, which require an http(s) origin. Use a local server for the full experience.

### Deploy to GitHub Pages

1. Push this repository to GitHub.
2. Open the repository's **Settings → Pages**.
3. Under "Build and deployment", select **Deploy from a branch** and choose `main` / `/ (root)`.
4. Save. GitHub will publish the site at `https://<username>.github.io/<repo>/`.

---

## Methodology

The full methodology is documented in the scrollytelling page itself, but in summary:

1. **Data acquisition** — 2023 1-year ACS IPUMS extract, filtered to civilian employed adults 25+ holding a Master's, Professional, or Doctoral degree (N = 372,226).
2. **Data preparation** — Constructed binary indicators for advanced degree, leadership, and Black-woman status. Mapped ~500 OCC2010 codes into four sector categories and a leadership classifier.
3. **Descriptive analysis** — Calculated leadership proportions by group × sector. Produced grouped bar charts, a diverging chart, and proportion tables.
4. **Chi-square testing** — Pearson chi-square tests of independence on Group × Leadership contingency tables, overall and stratified by sector. Examined standardized residuals.
5. **Logistic regression** — Estimated `glm(leadership ~ is_black_woman + industry, family = binomial)`. Reported odds ratios with 95% CIs.
6. **Validation & reporting** — Diagnostic checks, cross-validation against Tableau Public summary, final visualizations produced in ggplot2 and corrplot.

---

## Data sources

- **Primary data:** U.S. Census Bureau, American Community Survey 2023 (1-year) via [IPUMS USA](https://usa.ipums.org/usa/).
- **Sample:** N = 372,226 civilian employed adults aged 25+ holding advanced degrees.

---

## Tech stack

- **HTML5 / CSS3** — Vanilla CSS using custom properties for theming; responsive via CSS Grid + Flexbox.
- **JavaScript (ES6+)** — No build tooling. Uses IntersectionObserver for scroll-triggered animations.
- **Fonts** — EB Garamond, Source Serif 4, IBM Plex Mono via Google Fonts.

No external JavaScript libraries are loaded at runtime — every visualization is built from scratch with DOM APIs.

---

## Author

**Amen Hailu**
Pratt Institute · School of Information · 2026

---

## References

- AAUW (2018). *The Simple Truth About the Gender Pay Gap.* American Association of University Women.
- Crenshaw, K. (1989). Demarginalizing the intersection of race and sex: A Black feminist critique of antidiscrimination doctrine, feminist theory and antiracist politics. *University of Chicago Legal Forum.*
- Turner, C. S. V., González, J. C., & Wood, J. L. (2008). Faculty of Color in Academe: What 20 Years of Literature Tells Us. *Journal of Diversity in Higher Education,* 1(3), 139–168.

---

## License

[MIT](LICENSE) — feel free to fork, remix, and build on this work. Attribution appreciated.
