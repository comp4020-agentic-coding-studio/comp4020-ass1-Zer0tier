# Assignment 1 reflection — the browser became the brief

My breakthrough was realising that “works at desktop and phone” was not a CSS
description; it was a sequence of actions the marker would perform. The unit
suite could prove that Arrow Left changed state and that mobile media queries
existed, but jsdom has no layout and never resizes a rendered interface. I was
about to treat 162 green tests as evidence for a claim they could not measure.

I turned the marking sentence into a Playwright scenario instead: open at
1920×1080, jump to Windows 11, resize mid-animation to 390×844, confirm the
active version remains visible, then press Arrow Left. That first run failed.
The resize occurred while the transition lock was active, so the keystroke was
silently ignored. The important correction was not another prompt asking for a
smoother animation; it was adding the marker's behaviour to CI and settling the
transition state on resize. The unchanged scenario then passed.

The same pass changed how I judged visual polish. A 390×844 screenshot showed
the fixed “DO NOT CLICK” easter egg covering the core instruction even though
both elements independently passed structural tests. I moved the timeline clear
of that corner and added an overlap assertion. I also made the browser abort all
media requests and verified that the release explanation and controls still
worked, plus a no-JavaScript route test for the static fallback.

This made the project click conceptually too. The point is not “here are many
old Windows screens.” It is that each redesign asked more people to relearn the
same machine. Changing versions updates both the interface and reported reach;
the interaction performs the argument. At the retro I will demo the failing
resize sequence first, because it shows the difference between a large green
test count and a harness that actually observes the brief.
