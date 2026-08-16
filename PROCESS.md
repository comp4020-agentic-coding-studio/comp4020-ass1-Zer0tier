# Process overview

## What I built

Windows Desktop Evolution is an interactive explainer about how familiar
interfaces keep changing and asking a larger public to relearn the same
machine. Visitors move through twelve releases with the timeline, keyboard,
wheel or touch; the desktop recreation and the reported-reach figure change
with them. It began as an annoyance — Windows nagging me to update while I
watched videos about Apple's product evolution — and became a question: how
did Windows arrive at what I use today?

## The moments that mattered

### 1. Twice I deleted work that already worked

I began with a wiki-like explainer of the Chinese dynasties. It worked, and it
was becoming a broad catalogue for a niche audience rather than one idea I
could direct. The obvious move was to polish it, because the code existed.
Instead I moved the implementation and its tests into `legacy/`, and accepted
the Windows direction only once one interaction generated all twelve release
routes
([`58bb221`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Zer0tier/commit/58bb221)).

The same call returned at the end, when the release pages had grown a quiz,
playable games and two easter eggs. I had been judging each addition alone,
where each looked defensible. So I stopped arguing and measured: summing every
section's rendered height at 390px showed **28%** of the page argued the claim
the prototype exists to make. Four finished, passing features left for
`legacy/`, and `CLAUDE.md` now says to measure the page rather than the
component
([`72147c8`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Zer0tier/commit/72147c8)).

That cut set a standard, not a ceiling. The site is larger now than when I made
it — a relearning test, six history pages per release, a page behind every app
icon — and each had to answer the same question before it shipped
([`8429cd5...319b515`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Zer0tier/compare/8429cd5...319b515)).

### 2. A test that marked its own homework

The dynasty work exposed a deeper problem. A layout test asked `overlaps()`
whether the packing `overlaps()` had produced was correct, so inverting the
interval convention left it green. Retrying the prompt could only have produced
another plausible answer. I added a literal historical fixture — Ming ends
1644, Southern Ming begins 1644 — and recorded in `CLAUDE.md` that a
foundational convention needs an expected answer written from outside the
implementation. I knew the correction held because an injected off-by-one
turned the fixture red while the structural test stayed green
([`3edc8d6`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Zer0tier/commit/3edc8d6)).

### 3. Three checks that could not fail

That rule kept earning its keep. A base-path check passed on a build whose
links were all wrong, until it resolved each `href` against the deployed base
and looked for the file on disk. An overlap check called two figures clear
while they were painted on top of one another, because
`getBoundingClientRect` returns the grid cell, not the glyphs; a `Range` over
the text sees what is drawn. An anti-shake check failed
intermittently on its own anti-vacuity guard, so I drove the strings
deterministically instead of sampling frames. Each was settled the same way:
break the thing on purpose, watch it go red, restore
([`07c0ac1...e202df4`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Zer0tier/compare/07c0ac1...e202df4)).

### 4. What computed styles cannot see

The relearning test was silently dead on nine of twelve releases: its answer is
usually the Start button, where the recreation calls `stopPropagation()`, so a
bubble listener never fired. jsdom could not have found it — the markup and the
handler were both correct
([`8429cd5`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Zer0tier/commit/8429cd5)).
A white strip under the Windows 8 selection then survived a fix because every
border and background reported blue; decoding one pixel column of the
screenshot found a box-shadow drawing it
([`0ccbb5c`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Zer0tier/commit/0ccbb5c)).
Rendering the page, and running axe at both marking viewports, is routine here
now.
