# Birp — Tech Stack & Conventions

## Stack
- **Plain HTML5** — one file per page, no templating or build step.
- **Vanilla CSS** — no framework (no Tailwind/Bootstrap). Two files in `css/`.
- **Vanilla JavaScript** — one file, `js/main.js`, no libraries, no bundler.
- **Fonts** — Google Fonts: `Barlow Condensed` (headings, uppercase/condensed) and `Barlow` (body). Loaded via `<link>` in each page `<head>`.
- **Images** — real food photography from Unsplash via their free CDN (`https://images.unsplash.com/...`). No attribution required, no local image files needed.

There is **no backend**. Do not add server code, databases, npm packages, or a build pipeline unless the team explicitly decides to change direction. Keep it a static site that opens directly in a browser.

## Running the site
Just open any `.html` file in a browser. No build, no server needed. (Optional: a static server like VS Code Live Server or `npx http-server` for nicer local testing, but not required.)

## File structure
```
index.html          # Home
deals.html          # Browse deals
farms.html          # Farm surplus programme
about.html          # Story + founders
css/main.css        # All layout & component styles
css/animations.css  # @keyframes + animation/transition rules only
js/main.js          # All interactivity (IIFE modules, see below)
assets/images/      # (empty — photos come from Unsplash CDN)
assets/icons/       # (empty)
```

## CSS conventions
- **Every brand colour lives as a CSS variable** in `:root` at the top of `main.css`. Always use the variable, never hardcode a hex:
  - `--chartreuse: #b2d14f`
  - `--turquoise: #73c4ae`
  - `--yellow: #ffec96`
  - `--violet: #af58cb`
  - `--indigo: #613aa4`
- `main.css` holds structure/layout/components. `animations.css` holds `@keyframes` and animation/transition declarations. Keep that split.
- Class naming is descriptive and hyphenated (`.deal-card`, `.hero-content`, `.nav-search`). Match the existing names — don't introduce a new naming system.
- Responsive breakpoints already used: `max-width: 1024px` and `max-width: 768px`. Reuse these.

## Cache-busting (important!)
Each page links CSS with a version query, e.g. `css/main.css?v=6`. **When you change a CSS file, bump the version number in every HTML page** (all four) so browsers reload the new styles instead of a cached copy. `animations.css` currently uses `?v=4`.

## JavaScript conventions
`js/main.js` is organised as numbered, self-contained IIFE "modules" (navbar, scroll reveal, counters, auth modal, reserve modal, filters, search, toasts, etc.). Each guards with an early `return` if its target elements aren't on the page, so the one file safely runs on all four pages. Add new behaviour as a new numbered IIFE in the same style. Keep `'use strict';` at the top.

## Deployment
The site is hosted on **GitHub Pages** from the `main` branch of `github.com/JoshuaRekaiD/Big-Ideas-Project`. Pushing to `main` updates the live site within ~1 minute. See `git-workflow.md`.
