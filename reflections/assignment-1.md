# Breakthrough: turning the thesis into a measurable rule

## Before

I directed the agent component by component. The quiz, games, easter eggs,
history, and desktop recreations each seemed relevant when viewed alone.
Together, however, they made the prototype feel like a Windows museum. The
lesson was unclear.

A phone-width measurement exposed the problem: only **28%** of the substantive
rendered height supported the claim that redesign
makes people relearn familiar actions.

![Before: the feature-heavy release page.](assets/assignment-1-before.png)

## The change

The breakthrough was a harness rule, not a request for “more educational
content.” I added an acceptance gate to `CLAUDE.md` and Playwright. At
390×844, the test:

- finds the ten substantive sections in every release;
- measures their actual browser height;
- requires version-specific relearning evidence in each section; and
- rejects any chapter below 90% coverage.

I then deleted four finished mechanics. I reframed the desktop, Start challenge,
adoption data, history, applications, reviews, system notes, story, and
contributors around one learned habit: where to start a program.

## After

All twelve chapters now measure 100%. The homepage remains a focused index, and
the releases form one top-to-bottom explainer. W/S moves between chapters, while
sound plays only after a deliberate click.

![After: the desktop changing across the focused Windows explainer.](assets/assignment-1-after-animation.gif)

## Why it worked

“Make it more educational” could have produced another unrelated section. The
rendered-height gate made dilution fail. It gave the agent a clear standard and
gave me evidence for what to keep or remove.

This changed how I want to work. More mechanics do not guarantee engagement. I
want to state the lesson, measure whether visitors encounter it, remove work
that weakens it, and preserve each important correction as a test.
