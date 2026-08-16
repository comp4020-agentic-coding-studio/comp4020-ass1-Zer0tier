# What I abandoned, kept inspectable

Nothing in here ships. Astro only builds `src/pages/`, so none of this reaches
`dist/`; `tsconfig.json` includes only `*.ts`, `spec`, and `src`, so none of it
is typechecked either. It is here to be read, not run — PROCESS.md moment 1 is
about the judgement to stop, and this directory is the thing that judgement
produced.

## The Chinese dynasties explainer

The first direction: a wiki-like explainer of the Chinese dynasties, with a
parallel-track timeline for the years when more than one regime ruled at once.
It worked. I stopped it anyway, because it was becoming a broad catalogue for a
niche audience rather than one interactive idea I could direct.

| file | what it was |
| --- | --- |
| `index-legacy.astro` | the whole page |
| `components/` | era bands, regime cards, the concurrency strip, the detail panel, the quiz, the scoreboard, the reference list |
| `data/dynasties.ts` | the regimes and periods, with their spans |
| `data/layout.ts` | the interval packing that put concurrent regimes in separate columns |
| `data/layout.legacy.ts` | its tests, including the fixture below |
| `enhance.js` `detail.js` `scoreboard.js` `quiz-pool.js` `quiz.js` `modes.js` | the interactive layer |
| `styles/legacy-global.css` | its stylesheet |
| `assignment-1.legacy.ts` `timeline.legacy.ts` `quiz.legacy.ts` `quiz-pool.legacy.ts` | the spec tests it was built against |

`data/layout.legacy.ts` is worth reading even though the page is gone. It holds
the literal boundary fixture — Ming ends 1644, Southern Ming begins 1644, a
succession and not a rivalry — that caught an inverted interval convention the
structural test could not, because that test asked `overlaps()` to validate what
`overlaps()` had produced. The rule that came out of it is in `CLAUDE.md`, and
it is the reason the Windows work has fixture tests as well as structural ones.

## Cut for scope

These four worked, were tested, and shipped for a while. I cut them because the
brief asks for one idea and nothing else, and because `CLAUDE.md` already said
every visible addition has to support the claim that each redesign made a larger
public relearn the same machine. None of these did.

| file | what it was | why it went |
| --- | --- | --- |
| `components/ReleaseQuiz.astro` `release-quiz.js` `data/windows-quiz.ts` | a random multiple-choice question per release | tests trivia recall, not relearning |
| `components/ClassicGame.astro` `classic-games.js` | playable Reversi, Minesweeper, Purble Place | a toy; a second mechanic with nothing to say |
| `components/XPSpiderEasterEgg.astro` `xp-spider-easter-egg.js` `styles/xp-spider.css` | a Spider Solitaire deal hidden on the XP page | same |
| `components/BsodEasterEgg.astro` `bsod-easter-egg.js` | a "DO NOT CLICK" button on **all thirteen pages** that faked a fatal exception | a prank, and it had already collided with the core instruction on a phone once |

Their spec suites are here too, retired to `*.legacy.ts`: `release-quiz`,
`classic-games`, `xp-spider-easter-egg`, `bsod-easter-egg`. They passed when
they were removed. Nothing about them was broken — that is the point of the
moment in PROCESS.md.

## The first Windows attempt

`desktop-evolution.js` is an earlier, discarded take on the Windows idea: five
hardcoded eras and a tone generator, driven by buttons rather than by one
continuous mechanic. Replaced by `src/timeline-entry.js`, where a single
`change-version` interaction drives all twelve releases.
