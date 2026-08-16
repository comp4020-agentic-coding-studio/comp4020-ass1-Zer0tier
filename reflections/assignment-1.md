# Insight: smooth animation and era-specific themes transformed the homepage

My breakthrough was realising that a collection of interactive pages was not
yet an interactive explainer. Before commit `9aa6e9b`, I had asked the agent to
build a Windows archive. It produced a polished editorial homepage with a large
introduction and twelve release cards. Each card linked to a themed recreation,
but the visitor's role was still passive: scroll past a catalogue, choose a
version, and read about it. The page said that Windows evolved, but its
interaction did not demonstrate that evolution.

## Before

![Before: twelve-card release archive.](assets/assignment-1-before.png)

I stopped directing the agent mainly through visual requests and changed the
interaction contract. I specified one mechanic: scrolling or pressing an arrow
key must move through Windows history one release at a time. I encoded that
decision in `timeline-entry.test.ts`. The test required one central window,
forward and backward navigation, an updating version label, and a link that
always opens the release currently shown. It also explicitly rejected the old
`.release-grid`, preventing the discarded design from quietly returning.

## After `9aa6e9b`

![After: scroll-driven Windows timeline.](assets/assignment-1-after.png)

After that change, the agent replaced the long card page with a single
full-screen Windows-style window. As the visitor moves from Windows 1.0 to
Windows 11, the layout, colour, typography, and system preview transform with
the selected era. This worked because the visitor's action now maps directly to
the idea: moving through the interface means moving through time.

The process taught me that directing an agent is more reliable when I define
the behaviour to remove, the mechanic that should replace it, and the checks
that decide whether the output is acceptable. The breakthrough was not a
better-looking homepage; it was making the interaction perform the explanation.
