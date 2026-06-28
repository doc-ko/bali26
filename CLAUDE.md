# Bali 2026 — Trip Pitch Presentation

A cinematic, single-page, scroll-snap web presentation pitching a 3-week Bali trip
(**30 Jun – 20 Jul 2026**, a couple). Built with Vite + vanilla JS. Deploys to
GitHub Pages on a custom domain.

## How to edit the copy

**All text lives in [`src/content.js`](src/content.js).** Edit the strings there —
no HTML required. The file is a plain JS object: one entry per section, in display
order. You can use `**bold**` and `*italic*` (markdown) inside any copy string, and
`\n` for line breaks in a `title`.

You do **not** touch layout or styling to change wording. `src/main.js` renders the
DOM from `content.js`; `src/style.css` holds all visual styling.

### Section fields (the schema `main.js` understands)

| field | purpose |
|---|---|
| `id` | DOM id + CSS class suffix (`s-<id>`) — keep unique, lowercase |
| `label` | nav-dot tooltip |
| `image` | Wikimedia Commons **filename only** (e.g. `Sanur_Beach.JPG`); omit for gradient-only |
| `deco` | big faint background number (e.g. `"01"`) |
| `eyebrow` | small uppercase kicker |
| `nights` | date/nights line (gold) |
| `title` | headline (may use `\n`) |
| `body` | paragraph |
| `bullets` | array of feature-list strings (emoji ok) |
| `tags` | array of pill strings (emoji ok) |
| `arc` | array of arc steps (Arc section only) |
| `note` | secondary dim paragraph |
| `dates` | hero date line |
| `decision` | `{ group, label, question, options[] }` — vote block (Nusa & East only) |
| `hypeMeter` | `true` on the close section only |

### Add / remove / reorder a section

Add, delete, or reorder objects in the `sections` array in `content.js`. The nav
dots, scroll-snap, and arrow-key navigation all derive from that array
automatically — nothing else to update. If you add a new `id`, also add a matching
gradient fallback `.s-<id>` in `src/style.css` (otherwise the section falls back to
a plain dark background).

## Images

Photos are hotlinked from Wikimedia Commons via
`https://commons.wikimedia.org/wiki/Special:FilePath/<FILENAME>?width=1600`
(the renderer builds the URL from the bare `image` filename). To swap an image,
change the filename to any valid Commons file. Each section also has a CSS gradient
behind the image as a graceful fallback if a photo ever fails to load.

## Run it

```bash
npm install        # first time
npm run dev        # local dev server with HMR (http://localhost:5173)
npm run build      # production build → dist/
npm run preview    # serve the built dist/ locally
```

## QA

```bash
npm run test:visual          # Playwright visual regression vs baselines
npm run test:visual:update   # (re)generate baseline screenshots — run after intentional visual changes
```

Baselines live in `tests/snapshots/` and are committed so CI can diff against them.
There is also a **build smoke test** in CI (checks `dist/index.html` and JS assets
exist) that gates deploy.

## Deploy

Push to `main` → [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)
builds and deploys to GitHub Pages. The custom domain is set in
[`public/CNAME`](public/CNAME) — **replace the placeholder `bali2026.example.com`
with the real domain** and point the domain's DNS at GitHub Pages. Because of the
custom domain, `base` in `vite.config.js` is `/`; if you ever deploy to
`https://<user>.github.io/<repo>/` instead, change `base` to `/<repo>/`.

## Notes for editing copy

- The **18 Jul birthday is mine** (the trip planner's) — copy is written in the
  first person ("my birthday"). Keep it that way.
- Bali venues/operators turn over fast — keep copy evocative, **not** booking-grade.
  Don't assert any specific bar/club/operator as definitely open.
- Two decisions the pitch actually asks for: the **manta/snorkel** call (Nusa) and
  the **Amed** call (East Bali). Those are the interactive vote blocks.
