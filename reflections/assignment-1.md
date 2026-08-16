# Assignment 1 reflection — the browser became the brief

My breakthrough was realising that “works at desktop and phone” was not a CSS
description; it was a sequence of actions the marker would perform. The unit
suite could prove that Arrow Left changed state and that mobile media queries
existed, but jsdom has no layout and cannot resize a rendered interface. I was
treating 162 green tests as evidence for a claim they could not measure.

I turned the marking sentence into a Playwright scenario instead: open at
1920×1080, jump to Windows 11, resize mid-animation to 390×844, confirm the
active version remains visible, then press Arrow Left. That first run failed.
The resize occurred while the transition lock was active, so the keystroke was
silently ignored. The important correction was not another prompt asking for a
smoother animation; it was adding the marker's behaviour to CI and settling the
transition state on resize. The unchanged scenario then passed.

A 390×844 screenshot also showed the fixed “DO NOT CLICK” easter egg covering
the core instruction although both elements passed structural tests. I moved
the timeline clear and added an overlap assertion. I then blocked all media and
verified the explanation and controls, plus a no-JavaScript route fallback.

This also made the concept click. The point is not “here are many old Windows
screens”; it is that each redesign asked more people to relearn the same
machine. Changing versions updates both the interface and reported reach, so
the interaction performs the argument. At the retro I will demo the failing
resize sequence first: it shows the difference between a green test count and a
harness that observes the brief.
