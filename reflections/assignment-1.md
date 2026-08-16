# Insight: the interaction has to perform the explanation

My breakthrough was realising that a collection of interactive pages was not
yet an interactive explainer. Before commit `9aa6e9b` I had asked the agent for
a Windows archive, and it built exactly that: a polished editorial homepage
with twelve release cards, each linking to a themed recreation. The visitor's
role was still passive — scroll a catalogue, pick a version, read about it. The
page *said* Windows kept changing. Its interaction did not.

## Before

![Before: twelve-card release archive.](assets/assignment-1-before.png)

So I stopped directing through visual requests and changed the interaction
contract instead. I specified one mechanic: scrolling or pressing an arrow must
move through Windows history one release at a time. Then I encoded it in
`timeline-entry.test.ts` — one central window, forward and backward navigation,
an updating version label, and a link that always opens the release on screen.
The test also rejected the old `.release-grid` outright, so the design I had
discarded could not quietly return.

## After `9aa6e9b`

![After: scroll-driven Windows timeline.](assets/assignment-1-after.png)

![After animation.](assets/assignment-1-after-animation.gif)

The agent replaced the card page with a single full-screen Windows window that
changes era as you move through it. It worked because the visitor's action now
maps onto the idea: moving through the interface *is* moving through time.

What it changed about me is smaller and more uncomfortable. I used to accept
work once it looked right. Twice here I deleted work that looked right and ran
— the dynasties prototype, then four finished features — because a measurement
said they were not carrying the argument. I want to be the developer who builds
the thing that decides whether the work is good, and then trusts it over my own
eye.
