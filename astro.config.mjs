import { defineConfig } from "astro/config";

// GitHub Pages serves this repo under a sub-path, so `site` + `base` have to
// match it or every absolute URL Astro emits 404s on the deployed URL while
// looking fine locally (the trap CLAUDE.md warns about in a stack swap).
//
// `inlineStylesheets: "always"` is the belt to that braces: with the CSS
// inlined and no bitmap images, the built page references no external asset at
// all, so there is nothing left for a wrong base path to break — and the
// links check has no generated URL to trip over.
export default defineConfig({
  site: "https://comp4020-agentic-coding-studio.github.io",
  base: "/comp4020-ass1-Zer0tier/",
  build: {
    inlineStylesheets: "always",
  },
});
