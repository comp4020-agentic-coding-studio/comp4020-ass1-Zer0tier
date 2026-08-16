# Process overview

## What I built

Windows Desktop Evolution is an interactive explainer about how familiar
interfaces keep changing and asking users to relearn the same machine. Visitors
move through twelve Windows releases with the timeline, keyboard, wheel, or
touch; the desktop recreation and user-reach milestone change with them. My
interest came from watching videos about Apple product evolution while Windows
was repeatedly asking to auto-update. That annoyance became a question: how did
Windows arrive at what I use today?

## The moments that mattered

### 1. I kept the first idea I rejected

I began with Claude and planned a wiki-like explainer of Chinese dynasties such
as Tang, Ming, and Qing. The prototype worked, but I did not like the result. I
also felt the subject was becoming a broad catalogue for a niche audience,
rather than one interactive idea I could confidently direct. The obvious move
was to polish it because substantial code already existed, or quietly delete
it. Instead, I pivoted and moved the dynasty implementation and tests into
`legacy/`, so the abandoned judgement remains inspectable. I accepted the
Windows direction only when one shared interaction generated all twelve
release routes and worked through keyboard-reachable controls
([`58bb221`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Zer0tier/commit/58bb221)).

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
period comments. I later switched to Codex because its visual results were
closer to what I wanted, and used design skills to improve the layout. However,
more specific prompts alone could not guarantee authenticity. Instead, I made
provenance part of the acceptance criteria: local historical icons, binary
cursor files, an asset notice, and source metadata plus visible links for every
period review. Tests now reject missing assets, inline fake cursors, unsourced
review cards, and the earlier fictional-review disclaimer. I knew the change
was real—not merely more convincing—when filesystem checks found every asset
and rendered modal tests preserved each attribution
([`6baff07`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Zer0tier/commit/6baff07),
[`d9602a0`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Zer0tier/commit/d9602a0),
[`29c4ba5`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Zer0tier/commit/29c4ba5)).

### 4. Phone failures became permanent tests

I added quizzes, classic games, commands, and authentic themes after noticing
how many real Windows releases hid playful easter eggs. The desktop version
looked convincing, but on my phone the miniature command windows overlapped
other apps, and resizing during a timeline animation could drop a key press.
Rather than keep making screenshot-specific CSS fixes, I reproduced the
marker's journey in Playwright: start at 1920×1080, interact, resize to 390×844,
continue by keyboard, then repeat with slow media. I added geometry and stacking
assertions for covered windows and the BSOD control, plus the acceptance gate in
`CLAUDE.md`. The unchanged scenarios now pass at both marking viewports and CI
verifies the deployed URL
([`296b6db`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Zer0tier/commit/296b6db)).
