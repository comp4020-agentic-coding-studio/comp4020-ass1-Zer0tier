# Process overview

## What I built

Windows Desktop Evolution is an interactive argument about the hidden cost of
familiar interfaces: every redesign asked a larger public to relearn the same
machine. The visitor changes Windows versions through the timeline, keyboard,
wheel, or touch. The interface preview and a sourced reach milestone update
together, making forty years of redesign something the visitor performs rather
than a catalogue they only read. Twelve static release pages deepen the same
idea through client-side desktop recreations; the homepage remains the core
mechanic.

## The moments that mattered

### 1. A green test briefly proved the wrong rule

I translated the brief into tests before building the first interface. In the
later-discarded dynasty concept, however, a structural layout test reused the
implementation's own overlap predicate. Reversing its interval convention left
that test green. The obvious response was another implementation assertion;
instead, I added a literal boundary fixture—Ming ends when Southern Ming
begins—and recorded in `CLAUDE.md` that foundational conventions need an
expected answer from outside their implementation. I knew the correction
worked because the injected off-by-one made the fixture fail, while restoring
the half-open rule made the unchanged fixture pass. I also committed the new
interaction contract red on purpose, distinguishing an unbuilt specification
from a regression
([`06c8141...ef309a0`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Zer0tier/compare/06c8141...ef309a0)).

### 2. I preserved the answer I rejected

The dynasty prototype worked, but it was not the argument I wanted to own. The
easy choice was to polish it because it already passed; the other easy choice
was to erase it. Instead, I pivoted to Windows interface literacy and moved the
old implementation and tests into `legacy/`. That keeps the discarded
judgement inspectable while preventing an obsolete contract from manufacturing
confidence in a different product. I accepted the pivot only when the build
emitted all twelve release routes and the replacement tests found the shared
timeline, themed recreation, and keyboard-reachable controls on every page
([`58bb221`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Zer0tier/commit/58bb221)).

### 3. Authenticity became a provenance contract

Early recreations used recognisable CSS approximations, and the review bubbles
were explicitly fictional composites. More styling—or simply relabelling the
quotes—could look convincing without becoming true. Instead, I made
authenticity checkable: locally hosted historical icons and binary cursor files,
an asset notice, source metadata for every review excerpt, and visible links to
the period publications. The harness now rejects missing asset paths, fake
inline cursor artwork, unsourced review cards, and the old fictional disclaimer.
Filesystem and binary checks verified the assets; rendered modal tests verified
that attribution survives the interaction
([`6baff07`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Zer0tier/commit/6baff07),
[`d9602a0`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Zer0tier/commit/d9602a0),
[`29c4ba5`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Zer0tier/commit/29c4ba5)).

### 4. The marker's behaviour became the browser harness

The jsdom suite was green, but jsdom cannot observe layout or a resize
mid-interaction. Rather than accepting its test count, I turned the marking
sequence into Playwright: open at 1920×1080, change version, resize to 390×844,
continue by keyboard, then repeat without JavaScript and with media blocked.
The first run exposed a transition lock that dropped Arrow Left. A phone
screenshot then revealed the BSOD button covering the instructions, so that
became a geometry assertion. The link check also exposed a Pages base-path
mismatch. I moved all three corrections into CI and added the acceptance gate
to `CLAUDE.md`. I knew the result was right when the unchanged browser scenarios
passed at both marking viewports, the Pages-shaped link scan was clean, and the
deployed job verified the live URL
([`296b6db`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Zer0tier/commit/296b6db)).
