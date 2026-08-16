# Windows Desktop Evolution

An interactive explainer about the cost hidden inside familiar interfaces:
every Windows redesign asked a larger public to relearn the same machine.
Visitors change versions with the timeline, keyboard, wheel, or touch; the
desktop preview and a sourced reach milestone change together. Each release can
then be opened as a static, client-side interactive recreation.

## Run and verify

```sh
pnpm install
pnpm dev
pnpm check
pnpm exec playwright install chromium
pnpm check:browser
pnpm check:evidence
pnpm check:links
```

The browser suite exercises the marking viewports (1920×1080 and 390×844),
keyboard focus, resize mid-interaction, a no-JavaScript fallback, and failed
media requests. GitHub Actions repeats it before deploying the static `dist/`
output to GitHub Pages.

## Submission evidence

- [PROCESS.md](PROCESS.md) — the 400–600 word process map with cited commits
- [CLAUDE.md](CLAUDE.md) — working rules and acceptance gates
- [Assignment 1 reflection](reflections/assignment-1.md) — the week 4 retro breakthrough
- [Source and media notices](public/media/NOTICE.md)

Live URL: <https://comp4020-agentic-coding-studio.github.io/comp4020-ass1-Zer0tier/>
