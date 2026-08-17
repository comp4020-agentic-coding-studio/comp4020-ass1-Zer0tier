# Process overview

## What I built

Windows Desktop Evolution argues that familiar interfaces do not simply
improve: every redesign asks a larger public to relearn the same machine. The
core interaction is `change-version`. On the homepage, wheel, A/D or arrow
keys, swipe, and the version rail change one central desktop preview, its date,
and its reported reach. Entering the preview opens that release inside one
continuous, chronological explainer from Windows 1.0 to Windows 11.

## The moments that mattered

### 1. I deleted working features to recover one idea

I first built a wiki-like Chinese dynasties explainer. The obvious move was to
polish it because the code worked; instead, I moved it into `legacy/` when I
could not state one interaction that carried its argument. The Windows archive
was accepted only after one data structure generated all twelve releases
([`58bb221`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Zer0tier/commit/58bb221)).

Scope drift returned as a quiz, games, and easter eggs. Judging each component
made every addition seem defensible, so I measured every top-level section at
390px. Only **28%** of the page argued the relearning claim. I removed four
finished, passing mechanics and added the measurement rule to `CLAUDE.md`
([`72147c8`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Zer0tier/commit/72147c8)).

### 2. I changed the interaction contract, not the styling prompt

The first Windows homepage was twelve attractive cards. Visitors selected and
read; the page described change without making them experience it. I replaced
the catalogue contract with one window whose interface, year, reach, source,
and destination must change together. Tests named that state transition before
I accepted the animation
([`9aa6e9b`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Zer0tier/commit/9aa6e9b)).

The final correction gave each page one job: the homepage remains the compact
index, while its links target twelve themed chapters in one vertical document.
Static no-JavaScript links and direct hash loads are both tested
([`f0a1c11`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Zer0tier/commit/f0a1c11)).

### 3. I stopped trusting DOM-shaped evidence

The relearning answer was silently dead on nine releases because each Start
button stopped event propagation. jsdom saw correct markup and a registered
listener, so it passed. I moved the contract into Playwright: click the real
control, require the answer state, then require the Start menu still opens
([`8429cd5`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Zer0tier/commit/8429cd5)).
A later Windows 8 strip also survived computed-style checks; reading a rendered
pixel column identified a box-shadow as the actual painter
([`0ccbb5c`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Zer0tier/commit/0ccbb5c)).

### 4. A loading bug became a slow-connection rule

On the long page, ten WAV files used `preload="auto"`; only the first played and
later buttons could remain disabled at “Loading”. Retrying playback would not
fix the shared state. I removed autoplay, changed every sound to
`preload="none"`, and gave each player cancellable state while one controller
stops the previous sound. The browser test starts Windows 3.1, switches to 95,
and requires the first to stop and the second to play. The same commit removes
decorative system cursors and verifies the normal browser cursor remains
([`f0a1c11`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Zer0tier/commit/f0a1c11)).
