# Process overview

## What I built

Windows Desktop Evolution argues that interface progress has a human cost:
every redesign asks a larger public to relearn the same machine. The homepage
remains a compact index. Changing its selected release updates one desktop,
date, reach figure, source, and destination together. Entering it opens twelve
complete, era-themed chapters in one vertical explainer from Windows 1.0 to
Windows 11. Each chapter asks the visitor to find where programs start.

## The moments that mattered

### 1. I measured the thesis, then deleted working features

I first made a Chinese-dynasties wiki, then moved it to `legacy/` when I could
not name one explanatory interaction. The replacement accepted a single data
model for twelve Windows releases
([`58bb221`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Zer0tier/commit/58bb221)).

Scope drift returned as a quiz, games, and easter eggs. Polishing them was the
obvious response because they worked. Instead, I measured every top-level
section at 390px: only **28%** of the rendered page supported the relearning
claim. I removed four finished mechanics and wrote the rule into `CLAUDE.md`
([`72147c8`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Zer0tier/commit/72147c8)).

The final correction made that judgement executable. Every chapter now frames
all ten substantive sections around the same learned habit. Playwright sums
their rendered heights at 390×844, requires substantial version-specific
evidence in each, and fails below 90%. The measured result is 100% in all twelve
chapters
([`58fc0b7`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Zer0tier/commit/58fc0b7)).

### 2. I changed the interaction contract, not the visual treatment

Twelve polished cards let visitors select and read, but did not make change
felt. I replaced them with one stateful desktop: wheel, arrows or A/D, swipe,
and the rail must change the interface and its evidence together. Tests named
that contract before I accepted the animation
([`9aa6e9b`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Zer0tier/commit/9aa6e9b)).

Later, I kept that homepage unchanged as the index and joined the full releases
into one chronological document with direct hash routes
([`f0a1c11`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Zer0tier/commit/f0a1c11)).
The latest keyboard route adds W/S previous/next movement only there, advertises
it in each chapter header, updates the hash, and ignores form fields
([`4a9ec33`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Zer0tier/commit/4a9ec33)).

### 3. I stopped accepting DOM-shaped evidence

The relearning answer was dead on nine releases because Start buttons stopped
event propagation. jsdom saw valid markup and listeners. A browser test instead
clicks the real answer, requires the result, and then proves the Start menu
still opens
([`8429cd5`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Zer0tier/commit/8429cd5)).

I extended that harness to the failures visible only after rendering: empty
layout columns, overlapping adoption figures, wide meters, phone overflow, and
contrast. The final test measures box geometry at both marking viewports and
runs axe across all twelve standalone releases at both sizes. That correction
also removed “about” from measured share, restricted displayed portraits and
profile links to Wikipedia/Wikimedia, and fixed Joe Belfiore's crop
([`4a9ec33`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Zer0tier/commit/4a9ec33)).

### 4. A loading bug became a slow-connection rule

Ten WAV files originally preloaded and one attempted autoplay. The first player
worked; later controls could remain at “Loading”. Retrying could not fix shared
media state. I removed autoplay, set `preload="none"`, kept loading cancellable,
and made one controller stop the previous sound. The browser test starts
Windows 3.1, switches to 95, and requires both state transitions. The same
commit restores the normal browser cursor
([`f0a1c11`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Zer0tier/commit/f0a1c11)).
