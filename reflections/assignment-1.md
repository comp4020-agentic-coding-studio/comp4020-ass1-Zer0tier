# Breakthrough: the interaction has to perform the explanation

Before commit `9aa6e9b`, I had directed the agent to build a polished Windows
archive: twelve cards opened twelve themed recreations. It looked relevant, but
the visitor only chose a version and read. The page *said* that Windows keeps
changing; its interaction did not make that change felt.

## Before

![Twelve-card Windows release archive.](assets/assignment-1-before.png)

The breakthrough was changing the interaction contract rather than requesting
another visual treatment. I specified one central desktop preview where wheel,
arrow/A–D keys, swipe, or the release rail must change the interface, year,
reported reach, and destination together. I also encoded those outcomes in
tests. The interaction worked because the visitor's action—replacing a familiar
desktop with the next one—is the argument about repeated relearning.

## After

![One scroll-driven Windows preview.](assets/assignment-1-after.png)

![The interface changing across releases.](assets/assignment-1-after-animation.gif)

The latest correction made the architecture clearer without redesigning that
homepage. It remains a compact index; entering a release now opens its matching
anchor in one continuous explainer. Scrolling down from Windows 1.0 to Windows
11 therefore becomes movement through time, while every chapter keeps its own
interface language. I also removed autoplay and made each sound player load
only after a deliberate click, because interaction should remain controllable
on a slow connection.

This changed the developer I want to be. I had treated more mechanics as more
engagement, even when quizzes, games, and easter eggs diluted the claim. Now I
ask what one action teaches, delete features that cannot answer, and turn each
failure into a test the next version must satisfy.
