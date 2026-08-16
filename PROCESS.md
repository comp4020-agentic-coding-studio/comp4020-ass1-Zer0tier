# Process overview

## What I built

Windows Desktop Evolution is an interactive explainer about how familiar
interfaces keep changing and asking users to relearn the same machine. Visitors
move through twelve Windows releases with the timeline, keyboard, wheel, or
touch; the desktop recreation and user-reach milestone change with them. It
started as an annoyance — Windows nagging me to auto-update while I watched
videos about Apple's product evolution — that became a question: how did
Windows arrive at what I use today?

## The moments that mattered

### 1. Twice I deleted work that already worked

I began with a wiki-like explainer of the Chinese dynasties. The prototype
worked; it was also becoming a broad catalogue for a niche audience rather than
one interactive idea I could direct. The obvious move was to polish it, because
substantial code already existed. Instead I moved the implementation and its
tests into `legacy/`, where the abandoned judgement stays inspectable, and
accepted the Windows direction only once one shared interaction generated all
twelve release routes through keyboard-reachable controls
([`58bb221`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Zer0tier/commit/58bb221)).

The same call returned, harder, at the end. My release pages had grown a quiz,
playable games, and two easter eggs, and I had been judging each addition alone,
where each looked defensible. So I stopped arguing and measured: summing every
section's rendered height at 390px showed that only 28% of the page argued the
claim the prototype exists to make. That number is why four finished, passing
features left for `legacy/` with their specs, and why `CLAUDE.md` now says to
measure the page rather than the component
([`72147c8`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Zer0tier/commit/72147c8)).

### 2. I changed the harness, not just the prompt

The dynasty work exposed a deeper problem: a layout test reused the
implementation's own overlap rule, so reversing the interval convention still
produced a green test. Retrying the prompt could produce another plausible
answer without detecting the mistake. I added a literal historical boundary
fixture—Ming ends when Southern Ming begins—and recorded in `CLAUDE.md` that a
foundational convention needs an expected answer independent of its
implementation. I knew this correction worked because an injected off-by-one
made the fixture fail, while restoring the half-open rule made the unchanged
fixture pass. I also committed the next interaction contract red on purpose,
making unfinished work visible rather than treating a green build as proof of
quality
([`06c8141...ef309a0`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Zer0tier/compare/06c8141...ef309a0)).

### 3. “Looks authentic” became checkable

Claude's early Windows output gave me approximated interfaces and invented
period comments. Switching to Codex improved the visuals, but no amount of
prompt detail could guarantee authenticity. So I made provenance an acceptance
criterion instead: local historical icons, binary
cursor files, an asset notice, and source metadata plus visible links for every
period review. Tests now reject missing assets, inline fake cursors, unsourced
review cards, and the earlier fictional-review disclaimer. I knew the change
was real—not merely more convincing—when filesystem checks found every asset
and rendered modal tests preserved each attribution
([`6baff07`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Zer0tier/commit/6baff07),
[`d9602a0`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Zer0tier/commit/d9602a0),
[`29c4ba5`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Zer0tier/commit/29c4ba5)).

### 4. Phone failures became permanent tests

The desktop build looked convincing, but on my phone the miniature command
windows overlapped other apps, and resizing during a timeline animation could
drop a key press. Rather than keep making screenshot-specific CSS fixes, I
reproduced the marker's journey in Playwright: start at 1920×1080, interact,
resize to 390×844, continue by keyboard, then repeat with slow media. I added
geometry and stacking assertions for covered windows, plus the acceptance gate
in `CLAUDE.md`. Those scenarios passed unchanged through the deletions in
moment 1: the harness outlived the code it was written against. CI verifies the
deployed URL
([`296b6db`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Zer0tier/commit/296b6db)).
