# COMP4020 prototype

This is your starter repo for a COMP4020 prototype: a static site written in
HTML/CSS/TypeScript that builds to plain HTML/CSS/JS and deploys to GitHub
Pages. The **deployed site is what gets marked** --- not this repo, and not "it
works on my machine". It's marked live in Chrome against the deployed URL at two
viewports --- 1920×1080 (desktop) and 390×844 (phone) --- and both count in
full, so make that artefact good at both and use the checks below to know
whether it is.

What you're building this week — the spec — is published on the course website,
and this repo's name tells you which deliverable it is. Run the course plugin's
**start** skill at the start of each week: it pulls the right spec from the
course API, carries your harness forward from last week, and helps you turn the
spec's checkable lines into tests of your own. Read the spec before you build,
and see `spec/README.md` for how the checks in this repo relate to it.

## How to work in here

- Keep the dev server running (`pnpm dev`) so you see changes as you make them.
- Before you push, run `pnpm check`. It runs most of what CI runs --- build,
  lint, and the spec --- so you catch those in seconds instead of waiting for
  the pipeline. The links check, the evidence check, the secrets scan, and the
  deploy itself only run in CI; run `pnpm dlx linkinator ./dist --silent`
  locally against a fresh `pnpm build` for the links check without waiting for
  CI.
- To see what the page actually looks like rather than what you assume it looks
  like, open it in a browser (the `agent-browser` CLI, documented on
  [the course site](https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/topics/backpressure/#agent-browser-the-rendered-page-as-ground-truth),
  works well for this). The rendered page is the truth; your mental model of it
  isn't.
- When a check fails, read its output before changing anything. Each check below
  names what it measures, and the failure message is the instruction: it tells
  you the file, the line, or the contract. Treat a red check as authoritative
  --- the page is wrong until the check is green, not until you decide it should
  be.
- Commit when the checks pass. Never commit a red state.

## The checks (your sensors)

CI runs these on every push once your repo is public. GitHub's checks UI shows
two jobs, `check` and `deploy` --- not one status per sensor below --- and
within `check` the steps run in sequence (`pnpm check` chains typecheck, build,
lint, and the spec with `&&`), so an early failure like a broken build stops the
later sensors from running for that push; fix it and push again to see the rest.
While the repo is private (all week, until you ship) the CI jobs stay skipped
--- `pnpm check` is the same roster on your machine, and it's the faster loop
anyway. They aren't hoops. Each is a different way of finding out something true
about the site that you can't reliably see by looking at it.

They also carry a mark at a crit: the sweep runs fifteen minutes after your
cutoff, and green checks there are worth half that week's shipped mark. Still
running counts as not green, so ship with time for CI to finish.

- **typecheck** --- `tsc --noEmit` runs first in `pnpm check`, so a type error
  stops the roster before the build even starts. The types are extra
  backpressure: a red here is the compiler telling you a claim in the code is
  false.
- **build** --- the site must build (`pnpm build`). A build failure means the
  deployed site is broken or stale, so nothing else matters until this is green.
- **deploy / online** --- the live GitHub Pages URL must load and return the
  page you expect. An asset that 404s on the deployed URL counts as broken even
  if it loads locally.
- **spec** --- `spec/invariants.test.ts` asserts what's true of any good
  website, whatever the week's brief asks; the tests you write for the week's
  own spec run alongside it (any `spec/*.test.ts`). A failure names the contract
  you haven't met yet.
- **lint** --- `stylelint` for CSS, `oxlint` for TypeScript. Flags code that's
  wrong, fragile, or non-idiomatic. Read the rule it names.
- **tests** --- any other tests you write, wherever you put them (co-located
  with your source is fine, not just `spec/`), must pass. Vitest picks up both
  this and the spec suite in one `vitest run`, the last step of `pnpm check`. A
  failing test is a claim about the site that's no longer true.
- **evidence** (`pnpm check:evidence`) --- checks your process evidence:
  `PROCESS.md`'s citations resolve to real commits, the current deliverable's
  exact reflection is in `reflections/` (worked out from this repo's name
  against the public course API), and your `CLAUDE.md` is present. Evidence
  gates the deploy --- `deploy` needs `check` to pass, so failing evidence
  blocks the deploy alongside everything else. See
  [Your process is part of the mark](#your-process-is-part-of-the-mark) below,
  and the course website's
  [assessment page](https://comp.anu.edu.au/courses/comp4020-agentic-coding-studio/topics/assessment/#what-you-submit)
  for what counts as evidence.
- **links** --- internal links must resolve. A broken link is a dead end you
  didn't mean to ship.
- **secrets** --- the repo is scanned for committed credentials. Never put a
  key, token, or password in a tracked file. If one leaks, rotate it. A local
  pre-commit hook (`.githooks/pre-commit`, installed by `pnpm install`) also
  blocks any commit containing something shaped like an API key --- by the time
  CI sees a key it's already pushed, so the hook is the sensor that matters.

Nothing here measures **accessibility** or **performance** --- wiring those
sensors (`axe-core`, Lighthouse, or whatever you choose) is your work, and later
in the course the spec will ask you to show how you tested both. When you do,
read a green performance result honestly: it's a lab estimate from one run on a
CI machine, not proof the site is fast for real users.

## The stack is swappable

Out of the box this is plain HTML/CSS/TypeScript on Vite, and every `.html` file
in the repo is a page: add pages, link them, and the build picks them up with no
config. That's a default, not a rule (unless the week's spec says otherwise).
You can swap in Astro or any other static generator, because nothing in CI names
a tool --- the whole contract is:

- `pnpm build` emits the complete site into `dist/`
- the `package.json` scripts (`check`, `check:evidence`, `build`) keep working
- whatever lands in `dist/` still passes the invariants in `spec/`

Two things bite in a swap. The deployed site lives under a path
(`…github.io/<repo>/`), so configure your generator's base path --- this
template's Vite config uses relative asset URLs to sidestep that, but most
generators (Astro included) need `base` set explicitly, and getting it wrong
looks fine locally while every asset 404s on the live URL. And commit the
updated `pnpm-lock.yaml`: CI installs with `--frozen-lockfile`.

## Your process is part of the mark

The deployed page is only half of it. How you got there is marked too: your
commit history, your agent files, and the decisions visible across them. The
checks above can't see any of that, so a person reads it directly --- which
means building legibly is part of building well.

- **Commit as you go.** Small, frequent commits are the record of how the work
  came together, and that record is read, not just the final state. A trail that
  grew alongside the code is the strongest evidence of your process; a single
  dump the night before is the weakest.
- **Keep a process overview** (`PROCESS.md`). A short reading-guide, not an
  essay: what you built, the moments that mattered --- each pointing at a
  commit, a `CLAUDE.md` change, or a prompt and the commit it produced --- and
  where to look in the history. It points a marker at the evidence; it doesn't
  stand in for it, and claims the history doesn't back don't count. The
  `PROCESS.md` in this repo is a template showing the shape and the citation
  format (link text the commit hash or range, target the commit or compare URL);
  `pnpm check:evidence` verifies your citations resolve to real commits before
  you ship. Markers follow those citations and don't trawl the repo for evidence
  you didn't cite.
- **Write your reflection in `reflections/`** --- a short markdown file in this
  repo, named for the deliverable it answers, so the number in the filename is
  the number in this repo's name (`crit-1.md` in `comp4020-crit1-<you>`,
  `assignment-1.md` in `comp4020-ass1-<you>`); `reflections/README.md` has the
  full rule. `pnpm check:evidence` checks the exact current name against the
  course API, not merely the presence of any well-named file. It answers the two
  standing prompts: the breakthrough that moved the work forward, and what this
  work changed about the developer you want to be. It stays out of the deployed
  site. It's due at the cutoff, and if it isn't in the repo by then the week
  doesn't count as shipped, however good the prototype is.
- **This file is process evidence.** The harness you build to direct the agent,
  this `CLAUDE.md` and any `AGENTS.md`, is itself read as part of how you
  worked. Keep it honest and current (see below).

You don't need a name, a student number, or any identity file in the repo: we
know whose repo it is. Spend the effort on the work.

## This file is yours

This CLAUDE.md is a starting point, not a fixed rulebook. As you learn what your
prototype needs --- a convention to hold the agent to, a sensor that keeps
catching you out, a fact about the stack the agent keeps getting wrong --- write
it down here. Growing this file is the work of harness engineering, and the gap
between this boilerplate and your own version is part of what your prototype
says about the developer you're becoming.

## What I've learned to hold the agent to

Added as each one actually cost me something. Kept short on purpose --- a rule I
won't reread is a rule that doesn't work.

### Read the spec's own tests before writing any code

`spec/*.test.ts` for the week is the contract in executable form, and it holds
requirements a summary of the brief will drop. In C2 my own brief covered the
link to the original but never mentioned the organisation's **contact**
details --- which `spec/crit-2.test.ts` asserts outright. Read those files and
the published spec first, then build. Cheaper than discovering it at the crit.

### Word counts: a crit week is 150--300 words, not an essay

Indicative, not penalised --- but badly overshooting loses marks under the
response criterion, and "badly" is easy to hit by accident. I wrote a 1,182-word
`PROCESS.md` for a 150--300-word slot before checking.

| file | words | shape |
| --- | --- | --- |
| crit-week `PROCESS.md` | 150--300 | **one or two** moments, not four |
| assignment `PROCESS.md` | 400--600 | |
| final-project `PROCESS.md` | 600--900 | folds in stack + workflow |
| any `reflections/*.md` | 150--300 | every week, crit or assignment |

Images and screenshots don't count towards any of these, and are encouraged
where one carries the verification better than a sentence. Tables are a cheap
way to say a lot inside the budget.

### Never let real information be plausible-looking invention

When the week's brief involves a real organisation, its identity, address and
contact details must be **theirs**, fetched and cited --- not generated to look
right. A fabricated address for a real company is worse than no address.
Chinese sites are often GB18030, not UTF-8: if a fetch returns mojibake, pipe it
through `iconv -f gb18030 -t utf-8` rather than guessing at the content.

### The rendered page is the only source of truth for layout

`pnpm check` cannot see the page. It was fully green in C2 while all 24 card
thumbnails rendered as empty tofu boxes (emoji, no emoji font) and three links
had shipped welded to the previous word. Render the built site and measure it at
**both** graded viewports before believing it:

- `document.documentElement.scrollWidth === window.innerWidth` at 1920 and at
  390 --- this is the no-horizontal-scroll contract, and the one thing most
  worth checking
- elements crossing the right edge at 390 should only ever be the contents of a
  deliberate horizontal scroller
- don't assert layout in `spec/` --- jsdom computes none, so the test would pass
  on a visibly broken page. Say so in the test file rather than faking the
  coverage.

Emoji are not safe as load-bearing visuals. Text and CSS need no font that
might be missing.

Run axe-core in that same browser session while it's open --- injecting it from
a CDN and calling `axe.run(document)` at both viewports takes seconds. In C2 it
caught one serious `color-contrast` failure I would not have seen: the Chinese
nav labels sat at ~3.4:1 because I'd dimmed the pill's own colour with
`opacity: 0.65`. Note *why* this isn't a `spec/` test: axe under jsdom cannot
evaluate `color-contrast` at all --- no layout, no computed colours --- so the
wired-up cheap version would have passed on the exact bug it was meant to catch,
and the honest version needs a real browser in CI. Until a spec asks for that,
this is a manual pass to repeat whenever colours change.

### `hidden` loses to any author `display` rule

The UA implements the `hidden` attribute as `display: none` in *its* stylesheet,
so any author rule that sets `display` on the same element outranks it. In C2 an
empty search bar (`display: flex`) rendered 71px tall on every first visit while
carrying `hidden`, and the empty favourites list (`display: grid`) stayed in the
accessibility tree. Ship `[hidden] { display: none !important; }` once, globally.

And measure the right thing: my probe read `el.hidden`, which was `true` the
whole time. The attribute is not the question --- `getComputedStyle(el).display`
and `el.offsetParent !== null` are. Assert what a visitor sees, not what the DOM
property says.

### Make a check fail before trusting it

A test that has never been red is not evidence. Break the thing on purpose,
watch it fail, restore, watch it pass. And any injection or edit used to do that
must **assert it actually matched** --- in C2 a find-and-replace silently hit
nothing (the real markup had a `class` attribute I hadn't accounted for), so the
test never ran and still read as green. A silently-skipped verification is worse
than none, because it manufactures confidence.

**A test that checks a rule by applying that same rule cannot catch the rule
being wrong.** In A1 I inverted `overlaps()` from half-open to closed --- the
classic off-by-one --- and "never puts two overlapping regimes in the same
column" stayed green, because it asks `overlaps()` whether the packing
`overlaps()` produced was right. Only the fixture test ("Ming ends 1644 and
Southern Ming begins 1644 --- not concurrent") went red. So: for any convention
the whole design rests on, write at least one test that states the expected
answer as a **literal**, from outside the implementation. Structural tests check
consistency; only fixtures check correctness.

### "Never commit a red state" has one exception, and only one

The week's own `spec/*.test.ts` encodes the published contract *before* the
thing exists --- red is its correct starting state, and turning each one green
is the commit trail the marker reads. So the rule is: never commit a
**regression**, and never commit with typecheck, build or lint red. A spec test
that has never yet been green is a different thing from a test that just broke.
Say which is which in the commit message, so the distinction is legible rather
than something a reader has to reconstruct.

### Astro, in this repo

- **Base path.** Pages serves under `/<repo>/`, so `astro.config.mjs` sets
  `site` + `base`. `build.inlineStylesheets: "always"` keeps the first render
  independent of a stylesheet request; locally hosted historical media still
  has to use `import.meta.env.BASE_URL`, and the links check must verify it.
- **Whitespace.** Astro strips the newline between trailing text and an inline
  element, so `text\n<a>` renders as `text<a>`. Use an explicit `{" "}`.
- `.astro/` is generated --- gitignored, and oxlint skips it via
  `--ignore-path .gitignore`.
- Keep CSS in a real `.css` file, not only in `<style>` blocks: stylelint's glob
  is `**/*.css`, so styles written inline in a component are never linted. Same
  for JS: a script written straight into a `.astro` file is invisible to oxlint.
  Write it as a real `.js` file and inline it with `import src from "./x.js?raw"`
  plus `<script is:inline set:html={src} />` --- linted *and* inline.
- **Never let Astro emit an external script.** A plain `<script>` gets bundled
  to `/_astro/*.js`, which resolves against `base` and 404s in the links check
  that runs on `./dist`. `is:inline` is the rule, and `spec/redesign.test.ts`
  asserts no script carries a `src`.
- Don't write the literal text `<` + `script>` inside a JS file --- it survives
  into the inlined output and confuses greps, and the closing form would end the
  block early.
- stylelint-config-standard here means kebab-case classes (BEM `__` fails),
  range media queries (`(width >= 48rem)`), and percentage alpha
  (`rgb(255 255 255 / 8%)`). Prefer a class over a bare descendant
  (`.card .zh`, not `.card h3 span`). `no-descending-specificity` is switched
  **off** in `.stylelintrc.json` — this file used to claim it was on, which is
  worth knowing before you reorder a stylesheet to satisfy a rule that is not
  running.

### Test above `--shell`, not just at the two marking viewports

`--shell` is 1440px, so anything full-bleed looks correctly aligned at every
width up to 1440 and wrong above it. The release timeline bar sat in a
different column from the header directly above it — invisible at 1280 and at
390, plainly wrong at **1920, which is a marking viewport**. Checking the two
graded sizes would have caught this one; checking 1280 and 390, as I had been,
would not have.

When a layout bug depends on a breakpoint, put the breakpoint's far side in the
test. `e2e/marking-resilience.pw.ts` now walks 2560 / 1920 / 1440 / 1280 / 768
and compares the bar's box against `.site-header`'s, because the bug lived
entirely in the range a two-viewport test never visits.

Also: `.shell` sets `padding-inline` as well as width. For a bar whose cells
should run edge to edge inside it, take `width: min(100%, var(--shell))` and
`margin-inline: auto` rather than the class.

### A new section must join the era panel rule, or it will look foreign

Each era styles its page furniture through one shared selector list —
`.version-hero, .demo-heading-row, .release-details, .relearn,
.release-adoption, .release-pagination` — which carries that era's border,
background and padding. Two sections I added set their own `currentcolor`
treatment instead, which looked deliberate in isolation and wrong on the page.

Add the section to all twelve of those rules rather than inventing a
"neutral" treatment; the era tokens already carry text colour, so the panel
comes out right on the dark eras too. And assert it: `spec/` cannot, because
jsdom computes no styles, so `e2e/marking-resilience.pw.ts` compares each
section's computed background and border against `.release-details` on all
twelve pages. Comparing to a sibling rather than a hardcoded palette keeps the
test true when an era's colours change.

### A listener on an ancestor is not the same as a listener that fires

The relearning test was silently dead on nine of twelve releases. Its answer is
usually the Start button, and `system-interactions.js` calls
`stopPropagation()` there so opening the Start menu does not immediately trip
the desktop's click-outside-to-close handler. A bubble-phase listener on the
desktop never saw the one click that mattered. `addEventListener(..., true)` —
capture runs ancestor-first, before the target's own handlers.

Nothing in `spec/` could have caught this: the markup was right, the script was
attached, and jsdom dispatches no real click. Only driving it in a browser
found it. **When adding an interaction on top of an existing one, assume the
existing one already stops the event, and prove the new one fires.** The
regression test asserts both halves — the guess registers *and* the Start menu
still opens — because the fix shares the event path with the thing it must not
break.

### Don't dim text with `opacity` — I did it again

C2's contrast failure was `opacity: 0.65` on a nav pill. I reached for
`opacity: 0.78` on the new card's lede without thinking, and on the Windows 95
teal it computes to roughly 2.6:1. These cards sit on twelve different era
backgrounds, so there is no safe opacity. Carry hierarchy with size and weight;
if a muted colour is genuinely needed, set the colour and measure it.

Related, and the same mistake in a different costume: a colour token is named
for the job it does. `--memory-title` is a titlebar *background*, paired with
`--memory-title-ink`, and three rules used it as a *text* colour — which on
Windows 11 put `#f4f8fc` on a `#f1f7fc` card, **1.01:1, an invisible source
link**, on the very attributions moment 3 of `PROCESS.md` is about. They
inherit the surface's own ink now and are told apart by weight and underline.

Two more from the same sweep: Windows 8's `#0078d7` gives white text 4.49:1,
which fails by 0.01 and appeared in five rules — nudged to `#0074d0` (4.76:1),
which is imperceptible next to the real Windows 8 accent. And Windows 8 is the
only era whose *workspace* is a saturated colour rather than a light panel, so
`--memory-workspace` needed a matching `--memory-workspace-ink` instead of the
inherited `#111`. **If a token sets a background, look for its ink token before
using it anywhere else.**

### A link and the route it points at must share one slug function

`MemoryScene.astro` had its own `appSlug`, and the app route needed the same
one. Two copies of that regex is a 404 waiting for the first rename, and
nothing in the build would have said so — Astro generates whatever
`getStaticPaths` returns and the anchor points wherever the template says.
`appSlug` now lives in `windows-memories.ts` and both import it.

Then assert the link, not the intention: `spec/app-pages.test.ts` resolves every
card's `href` against the deployed base and checks the resulting path exists in
`dist/`. That is the assertion that catches a base-path mistake — the failure
that looks perfect on 127.0.0.1 and 404s on `…github.io/<repo>/`. Verified by
dropping `${base}` from the template and watching it go red.

Note `linkinator` will not catch this: `pnpm check:links` runs without
`--recurse`, so it only checks links found on the entry page — 14 of them.
Adding `--recurse` would also start checking every external citation on every
page, which is a lot of network flake for a check that runs on the deadline.
The offline test is the better tool here.

### Run axe on the built pages, at both viewports

`pnpm check` cannot see contrast and neither can jsdom. With the preview server
running, inject `node_modules/axe-core/axe.min.js` and call `axe.run(document)`
at 1920 and 390 across a few eras — light, dark, and a recreation-heavy one.
Doing this once turned up serious violations on every release page. Treat the
recreations' own period-accurate low contrast as a separate judgement from the
site's own chrome, which has no such excuse.

### "Supports the claim" is a measurement, not an opinion

I wrote the rule below — every visible addition must support the single claim —
and then shipped a release page where it wasn't true, because I was checking it
one component at a time as I added each one. Each felt defensible on its own.

Measure the whole page instead. Sum the rendered height of each top-level
section at 390px and work out what share argues the thesis. On `/windows-xp/`
that was **28%**: the desktop recreation, the adoption figure and the four
"what this interface changed" cards. The rest was era atmosphere, a quiz and a
playable Minesweeper. A number I could not argue with is what actually moved me
to cut, after months of "but each part is good".

```js
document.querySelectorAll("main > section, main > nav").forEach((el) =>
  console.log(Math.round(el.getBoundingClientRect().height), el.className));
```

Two things that fell out of doing it:

- A **new mechanic** costs more than a new section. The quiz, the games and the
  easter eggs each taught the visitor a separate interaction that said nothing
  about relearning — which is the opposite of the point.
- When you delete a feature, delete its **responsive** rules too. The block
  comments in `global.css` cover the main rules, but the phone media query at
  the bottom had five more that `grep` found and reading wouldn't have.

### Media in a long explainer loads only after the visitor asks

Ten startup sounds on one page used `preload="auto"`, and the script also tried
to autoplay one. The first sound worked; later buttons could sit disabled at
“Loading” while the browser fetched competing WAV files. Attribute checks
proved that every source existed but could not prove that a second player could
take control.

Do not autoplay media. Use `preload="none"`, leave a loading control cancellable,
and keep at most one player active. Prove the shared state in a browser: start
one real player, start a second, then require the first to stop and the second
to reach `playing`. A test that clicks only the first player cannot catch the
failure this rule exists for.

### Assignment 1 acceptance gate

- The core interaction is `change-version`: wheel, A/D or arrow keys, touch
  swipe, and the timeline links all change the selected Windows release; the
  preview and reported-reach milestone must update together. Keep that
  instruction visible at both marking viewports.
- Every visible addition must support the single claim that each Windows
  redesign made a larger public relearn the same machine. Do not add a new
  mechanic merely as decoration. At 390×844, at least **90%** of each
  chapter's substantive rendered height must carry `data-relearning-content`
  and contain at least 80 characters of version-specific
  `data-relearning-evidence`. The browser test defines the ten-section
  denominator; navigation and decorative gaps never count as content.
- The long `/windows/` explainer alone uses W for the previous chapter and S
  for the next. Show that instruction inside every chapter header, update the
  hash with the move, and never intercept keys typed into form controls.
- Rendered layout is a contract: Start a program and Reach and share must fill
  their panels without vacant columns; adoption figures must not overlap bars,
  and both bars stay slim and long at 1920×1080 and 390×844.
- Every displayed contributor portrait and profile link must come from
  Wikipedia/Wikimedia. Run axe across all twelve release pages at both marking
  viewports; serious or critical WCAG A/AA findings block shipping.
- Before shipping, run `pnpm check`, `pnpm check:browser`, `pnpm
  check:evidence`, and `pnpm check:links`. The browser suite is the authority for
  1920×1080, 390×844, keyboard focus, desktop-to-phone resize, no-JavaScript
  navigation, and unavailable media; jsdom is not evidence for layout.
- `PROCESS.md` stays between 400 and 600 words with three or four cited moments,
  and `reflections/assignment-1.md` contains the one breakthrough to present at
  the week 4 retro.
