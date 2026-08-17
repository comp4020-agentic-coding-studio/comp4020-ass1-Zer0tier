# Process overview

## What I built

Windows Desktop Evolution makes one argument: interface progress carries a
learning cost. The homepage is a compact index. Changing its selected release
updates one desktop, date, reach figure, source, and destination. Entering the
index opens twelve era-themed chapters in one vertical explainer, from Windows
1.0 to Windows 11. Every chapter asks the visitor to repeat one familiar task:
start a program.

## The moments that mattered

### 1. I measured the thesis and deleted finished work

**Before:** I built a Chinese-dynasties wiki, but could not name one interaction
that explained its argument. I moved it to `legacy/` and replaced it with a
single data model that generated twelve Windows releases
([`58bb221`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Zer0tier/commit/58bb221)).

The new prototype also drifted. A quiz, games, and easter eggs all worked, yet
they weakened the central idea.

**Change:** Instead of polishing those features, I measured every top-level
section at the 390px phone width. Only **28%** of the rendered page supported
the relearning claim. I removed four completed mechanics and added the rule to
`CLAUDE.md`
([`72147c8`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Zer0tier/commit/72147c8)).

**Proof:** Playwright now measures the ten substantive sections in every
chapter at 390×844. Each section must contain version-specific relearning
evidence, and each chapter must reach 90% coverage. All twelve currently measure
100%
([`58fc0b7`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Zer0tier/commit/58fc0b7)).

### 2. I changed the interaction contract

**Before:** Twelve polished cards allowed selection, but visitors only opened a
version and read about it. The interface described change without making change
felt.

**Change:** I replaced the catalogue with one stateful desktop. Wheel, arrow or
A/D keys, swipe, and the release rail must update the interface and its evidence
together. I defined this state transition in tests before accepting the
animation
([`9aa6e9b`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Zer0tier/commit/9aa6e9b)).

I later kept that homepage unchanged as the index and joined the detailed
releases into one chronological document
([`f0a1c11`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Zer0tier/commit/f0a1c11)).
On that long page only, W and S move to the previous or next chapter, update the
URL hash, and ignore form inputs
([`4a9ec33`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Zer0tier/commit/4a9ec33)).

### 3. I replaced DOM checks with browser evidence

**Failure:** The relearning answer did nothing on nine releases because Start
buttons stopped event propagation. jsdom still reported valid markup and
listeners.

**Correction:** A Playwright test now clicks the real answer, checks the result,
and confirms that the Start menu still opens
([`8429cd5`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Zer0tier/commit/8429cd5)).

I expanded that browser harness to measure empty columns, adoption-bar overlap,
phone overflow, and accessibility at both marking viewports. Axe also checks all
twelve standalone releases at both sizes. These checks guided the tighter
section layouts, smaller adoption figures, Wikipedia/Wikimedia portrait rule,
and corrected Joe Belfiore crop
([`4a9ec33`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Zer0tier/commit/4a9ec33)).

### 4. A loading bug became a slow-connection rule

**Failure:** Ten WAV files preloaded at once and one attempted autoplay. The
first player worked, while later controls could remain stuck at “Loading”.

**Correction:** Audio now uses `preload="none"`, never autoplays, and stays
cancellable while loading. Starting a new sound stops the previous one. The
browser test plays Windows 3.1, switches to Windows 95, and requires both state
changes. The same change restores the normal browser cursor
([`f0a1c11`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass1-Zer0tier/commit/f0a1c11)).
