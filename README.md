# Bali 2026 — Trip Pitch

A cinematic, single-page scroll-snap presentation pitching a 3-week Bali trip (30 Jun – 20 Jul 2026). Built with Vite + vanilla JS. No framework, no build required for editing copy.

## Quick start

```bash
npm install
npm run dev
```

Then open **http://localhost:5173** in your browser.

## Editing the copy

**Everything you'd want to change lives in [`src/content.js`](src/content.js).** It's a plain JS object — one entry per slide. Edit the strings directly; no HTML knowledge needed.

Supported inline formatting inside any string:
- `**bold**` → **bold**
- `*italic*` → *italic*
- `\n` in a `title` → line break

To add or remove a slide: add or delete an object from the `sections` array. The nav dots and arrow-key navigation update automatically.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Start local dev server with live reload |
| `npm run build` | Build production output to `dist/` |
| `npm run preview` | Serve the built `dist/` locally |
| `npm run test:visual` | Run Playwright visual regression vs saved baselines |
| `npm run test:visual:update` | Regenerate baselines after intentional visual changes |

## Deploying to GitHub Pages

1. Create a GitHub repo and push this folder to the `main` branch.
2. In **Settings → Pages**, set source to **GitHub Actions**.
3. Replace the placeholder in [`public/CNAME`](public/CNAME) with your real domain (e.g. `bali2026.yourdomain.com`).
4. Point your domain's DNS at GitHub Pages (`CNAME` → `<your-username>.github.io`).
5. Push — the Actions workflow builds, smoke-tests, and deploys automatically.

> If you're not using a custom domain, remove `public/CNAME` and set `base` in `vite.config.js` to `"/<repo-name>/"`.

## Project structure

```
├── src/
│   ├── content.js   ← all copy and slide config (edit this)
│   ├── main.js      ← renderer and interactivity (don't need to touch this)
│   └── style.css    ← all styling (touch this for visual tweaks)
├── public/
│   └── CNAME        ← custom domain (replace placeholder)
├── tests/
│   ├── visual.spec.js      ← per-section screenshot regression
│   ├── interaction.spec.js ← vote buttons + hype slider checks
│   └── snapshots/          ← committed baseline screenshots
├── .github/workflows/deploy.yml   ← CI/CD: build → smoke test → deploy
├── index.html
├── vite.config.js
└── CLAUDE.md        ← guidance for editing with Claude Code
```

## Images

Photos are hotlinked from Wikimedia Commons — no downloads needed. To swap an image, find a file on [Wikimedia Commons](https://commons.wikimedia.org) and update the `image` field in `src/content.js` with just the filename (e.g. `"My_New_Photo.jpg"`).
