# Process overview

## What I built

Windows Desktop Evolution is an interactive argument about the hidden cost of
familiar interfaces: every redesign asked a larger public to relearn the same
machine. The visitor changes Windows versions with the timeline, keyboard,
wheel, or touch. The interface preview and a sourced reach milestone change
together, turning 40 years of redesign into something the visitor operates
rather than a catalogue they only read. The release pages deepen that same
idea through client-side recreations; the homepage remains the core mechanic.

## The moments that mattered

### 1. A green test briefly proved the wrong rule

I started by translating the brief into tests before building a UI. In the
first, later-discarded dynasty concept, a layout test reused the implementation's
own overlap predicate, so reversing its interval convention left the test green.
Instead of retrying the calculation, I added a literal boundary fixture and a
rule to `CLAUDE.md`: conventions need an expected answer derived outside the
implementation. I then committed the interaction contract red on purpose,
clearly separating an unbuilt specification from a regression. The literal
fixture failed on the injected error and passed after restoration
([`06c8141...ef309a0`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Zer0tier/compare/06c8141...ef309a0)).

### 2. I kept the discarded answer visible

The dynasty prototype worked, but it was not the argument I wanted to own. I
changed direction to Windows interface literacy rather than polishing the first
answer. The obvious move was to overwrite it; instead, I moved its implementation
and tests into `legacy/`, then replaced its contract with release-specific
checks. This makes the discarded judgement inspectable and prevents old tests
from manufacturing confidence in a different product. I accepted the pivot
only when the build emitted twelve static routes and every recreation exposed
keyboard-reachable system controls
([`58bb221`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Zer0tier/commit/58bb221)).

### 3. “Looks right” became an asset contract

> make sure all of the Interactive system recreation to be exactaly the same as
> the real ones. do not fake them. use the original real ones.

The early recreations used recognisable CSS approximations. Retrying the styling
would still leave authenticity subjective, so I changed the acceptance rule:
locally hosted extracted icons and cursor files, explicit provenance, and tests
that reject inline fake SVG pointers and missing asset paths. The source notice,
`data-system-assets="original-extracted"`, filesystem assertions, and binary
cursor checks made “real” inspectable rather than rhetorical
([`6baff07`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Zer0tier/commit/6baff07),
[`d9602a0`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Zer0tier/commit/d9602a0)).

### 4. I tested the marker's behaviour, not a simulated layout

All 162 jsdom tests were green, but they could not answer the rubric's resize
question. I added Playwright cases for 1920×1080, 390×844, keyboard focus,
resize mid-transition, no JavaScript, and failed media. The first real run went
red: resizing immediately after selecting Windows 11 left an animation lock, so
Arrow Left was dropped. After settling transitions on resize, all four browser
cases passed. A screenshot then exposed the BSOD button covering phone
instructions, which became a geometry assertion. Finally, the links check found
twelve false 404s because CI ignored the Pages base path; a pinned, Pages-shaped
link harness now scans fourteen links cleanly. Those corrections and the new
`CLAUDE.md` acceptance gate are in
[`296b6db`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Zer0tier/commit/296b6db).
