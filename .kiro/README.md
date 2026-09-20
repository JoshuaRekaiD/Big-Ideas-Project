# Welcome to the Birp project (Kiro guide for the team)

This folder configures **Kiro** so anyone on the team can jump in and get help without re-explaining the project every time. If you're a Birp partner opening this repo for the first time, read this once.

## What's here

### Steering (`.kiro/steering/`) — auto-loaded into every Kiro chat
These files give Kiro permanent context about the project. You don't need to do anything — Kiro reads them automatically.
- **product.md** — what Birp is, who it's for, who built it, and the tone to use.
- **tech.md** — the tech stack (plain HTML/CSS/JS, no backend) and the coding conventions to follow.
- **structure.md** — the shared page building blocks (navbar, footer, sections, cards, animations) and how to keep them consistent.
- **git-workflow.md** — how to set up Git on your machine, pull/commit/push, use branches, and deploy.

### Skills (`.kiro/skills/`) — on-demand task guides
Skills are step-by-step recipes Kiro loads when relevant.
- **add-deal-card** — adds a new food-deal card to `deals.html` correctly. Just ask Kiro something like *"add a new deal card for a bakery called Sweet Corner"* and it will follow the recipe.

## How to work on the site
1. Get the latest code: `git pull`
2. Ask Kiro for what you want (e.g. *"change the hero heading"*, *"add a founder card for me"*, *"fix the navbar on the about page"*). Kiro already knows the project from the steering files.
3. Preview by opening the `.html` file in your browser.
4. Publish: `git add .` → `git commit -m "what you changed"` → `git push`. The live site updates in ~1 minute.

Live site: **https://joshuarekaid.github.io/Big-Ideas-Project/**
Repo: **https://github.com/JoshuaRekaiD/Big-Ideas-Project**

## Good first tasks / known issues to fix
- The navbar on `index.html` and `about.html` is malformed (see `structure.md`) — repairing it to match `deals.html` is a great first job.
- The deal/farm card photos (`deal-img-*`, `farm-img-*`) aren't defined in `css/main.css` yet, so cards show no images (see the `add-deal-card` skill for how to add them).

## Tips
- Keep using the brand colours by their CSS variables (see `tech.md`).
- After changing any CSS, bump the `?v=` number on the stylesheet links in all four HTML pages so browsers load the new styles.
- For anything non-trivial, work on a branch and open a Pull Request so you don't clash with teammates.
