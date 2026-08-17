import { expect, test } from "@playwright/test";

const desktop = { width: 1920, height: 1080 };
const phone = { width: 390, height: 844 };

test("the core timeline survives keyboard use and a desktop-to-phone resize", async ({ page }) => {
  await page.setViewportSize(desktop);
  await page.goto("./");

  const body = page.locator("body");
  await expect(page.locator("[data-core-interaction]")).toHaveAttribute("data-core-interaction", "change-version");
  await expect(body).toHaveAttribute("data-entry-version", "win1");

  await page.keyboard.press("End");
  await expect(body).toHaveAttribute("data-entry-version", "win11");
  await expect(page.locator('[data-timeline-step][aria-current="step"]')).toContainText("11");

  await page.setViewportSize(phone);
  const selected = page.locator('[data-timeline-step][aria-current="step"]');
  await expect(selected).toBeInViewport();
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

  await page.keyboard.press("ArrowLeft");
  await expect(body).toHaveAttribute("data-entry-version", "win10");
  await expect(page.locator("[data-reach-count]")).toHaveText("1B");
});

test("the timeline has visible keyboard focus and a phone-friendly instruction", async ({ page }) => {
  await page.setViewportSize(phone);
  await page.goto("./");

  await page.keyboard.press("Tab");
  await expect(page.locator(".skip-link")).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.locator("[data-timeline-step]").first()).toBeFocused();
  await expect(page.locator("[data-core-instructions]")).toBeVisible();
  await expect(page.locator("[data-core-instructions]")).toContainText("swipe");

  const instruction = page.locator("[data-core-instructions]");
  expect(await instruction.boundingBox()).not.toBeNull();
  const covering = await instruction.evaluate((element) => {
    const box = element.getBoundingClientRect();
    const stack = document.elementsFromPoint(box.left + box.width / 2, box.top + box.height / 2);
    const self = stack.indexOf(element);
    if (self === -1) return ["<instruction is not hit-testable at its own centre>"];
    return stack
      .slice(0, self)
      .filter((node) => !node.contains(element) && !node.closest(".timeline-enter-nav"))
      .map((node) => `${node.tagName.toLowerCase()}.${String(node.className).split(" ")[0]}`);
  });
  expect(covering, "something other than the enter overlay is covering the core instruction").toEqual([]);
});

test("the explainer keeps all twelve themed releases in one vertical document", async ({ page }) => {
  await page.setViewportSize(phone);
  await page.goto("./windows/");

  const sections = page.locator("[data-version-section]");
  await expect(sections).toHaveCount(12);
  await expect(sections.first()).toHaveAttribute("id", "windows-1");
  await expect(sections.last()).toHaveAttribute("id", "windows-11");
  expect((await sections.last().boundingBox())!.y).toBeGreaterThan((await sections.first().boundingBox())!.y);

  await page.locator('#windows-xp [data-version-nav] a[href$="#windows-xp"]').click();
  await expect(page).toHaveURL(/\/windows\/#windows-xp$/);
  await expect(page.locator("#windows-xp")).toBeInViewport();
  await expect(page.locator("#windows-xp [data-desktop]")).toBeVisible();
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

  await page.goto("./windows/#windows-xp");
  await expect(page.locator("#windows-xp")).toBeInViewport();
});

// "More relearning content" is an acceptance rule rather than a visual
// impression. At the phone marking viewport, add the rendered heights of the
// ten substantive sections in each chapter. A section counts only when its
// framing explicitly connects the material to the habit users had to relearn.
// Navigation and decorative gaps are deliberately outside the denominator.
test("relearning evidence carries at least ninety percent of every release chapter", async ({ page }) => {
  await page.setViewportSize(phone);
  await page.goto("./windows/");

  const coverage = await page.locator("[data-version-section]").evaluateAll((chapters) =>
    chapters.map((chapter) => {
      const sections = [...chapter.querySelectorAll<HTMLElement>(
        ":scope > .startup-sound, :scope > .version-content > section",
      )];
      const totalHeight = sections.reduce((sum, section) => sum + section.getBoundingClientRect().height, 0);
      const relearningSections = sections.filter((section) => {
        const evidence = section.querySelector<HTMLElement>("[data-relearning-evidence]");
        return section.hasAttribute("data-relearning-content")
          && (evidence?.textContent?.trim().length ?? 0) >= 80;
      });
      const relearningHeight = relearningSections.reduce(
        (sum, section) => sum + section.getBoundingClientRect().height,
        0,
      );

      return {
        chapter: chapter.id,
        sectionCount: sections.length,
        relearningSectionCount: relearningSections.length,
        ratio: totalHeight === 0 ? 0 : relearningHeight / totalHeight,
      };
    }),
  );

  expect(coverage).toHaveLength(12);
  for (const chapter of coverage) {
    expect(chapter.sectionCount, `${chapter.chapter}: substantive section count drifted`).toBe(10);
    expect(chapter.relearningSectionCount, `${chapter.chapter}: a section lacks a relearning lens`).toBe(10);
    expect(chapter.ratio, `${chapter.chapter}: only ${(chapter.ratio * 100).toFixed(1)}% is relearning content`).toBeGreaterThanOrEqual(0.9);
  }
});

test("startup sounds wait for input and every long-page player can take over", async ({ page }) => {
  await page.goto("./windows/");

  const first = page.locator("#windows-3 [data-startup-sound]");
  const second = page.locator("#windows-95 [data-startup-sound]");
  await expect(page.locator('[data-sound-status][data-state="loading"], [data-sound-status][data-state="playing"]')).toHaveCount(0);

  await first.locator("[data-sound-play]").click();
  await expect(first.locator("[data-sound-status]")).toHaveAttribute("data-state", "playing");

  await second.locator("[data-sound-play]").click();
  await expect(first.locator("[data-sound-status]")).toHaveAttribute("data-state", "stopped");
  await expect(second.locator("[data-sound-status]")).toHaveAttribute("data-state", "playing");
  await expect(second.locator("[data-sound-play]")).toBeEnabled();
});

// This exists because the first version of the relearning test was silently
// dead on nine of the twelve releases. The answer there is the Start button,
// and system-interactions.js calls stopPropagation() on it so opening the
// Start menu does not trip the desktop's click-outside handler — so a
// bubble-phase listener never saw the only click that mattered. jsdom could
// not have caught it: the markup was correct and the handler was attached.
// Both assertions matter — the guess must register AND the recreation must
// still behave, since the fix runs in the capture phase alongside it.
test("the relearning answer registers on click and keyboard without breaking the recreation", async ({ page }) => {
  for (const [version, viewport] of [["windows-95", desktop], ["windows-11", phone]] as const) {
    await page.setViewportSize(viewport);
    await page.goto(`./${version}/`);

    const section = page.locator("[data-relearn]");
    await expect(section).toHaveAttribute("data-relearn-state", "asking");
    await expect(page.locator("[data-relearn-answer]")).toBeHidden();

    // The wrong guess is the desktop's own top-left corner rather than a named
    // element. Two earlier attempts picked a desktop shortcut and then any
    // visible button, and both broke on Windows 11 at phone width: that
    // recreation ships with its Start panel open — correctly, it is how
    // Windows 11 first looks — so the shortcuts underneath are covered and the
    // panel itself overflows the stage. The corner is always present, always
    // hittable, and is the answer on no release.
    const answerBox = await page.locator("[data-relearn-target]").boundingBox();
    const desktopBox = await page.locator("[data-desktop]").boundingBox();
    expect(answerBox, version).not.toBeNull();
    expect(desktopBox, version).not.toBeNull();
    expect(
      answerBox!.x > desktopBox!.x + 24 || answerBox!.y > desktopBox!.y + 24,
      `${version}: the answer sits in the corner this test clicks as a miss`,
    ).toBe(true);

    await page.locator("[data-desktop]").click({ position: { x: 6, y: 6 } });
    await expect(section, `${version}: a wrong guess should not settle it`).toHaveAttribute("data-relearn-state", "missed");

    await page.locator("[data-relearn-target]").click();
    await expect(section, `${version}: the answer did not register`).toHaveAttribute("data-relearn-state", "correct");
    await expect(page.locator("[data-relearn-answer]")).toBeVisible();
    await expect(page.locator("[data-relearn-target]")).toHaveClass(/is-relearn-found/);
    await expect(page.locator("[data-start-panel]"), `${version}: the Start menu should still open`).toBeVisible();
  }

  // Enter on a focused answer must take the same path as a pointer, so the
  // whole mechanic has a keyboard route rather than a pointer-only one.
  await page.setViewportSize(phone);
  await page.goto("./windows-xp/");
  await page.locator("[data-relearn-target]").focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("[data-relearn]")).toHaveAttribute("data-relearn-state", "correct");
});

// An app card opens in place, in the same era window the review bubbles use.
// The card is still a real anchor to a real page — that is the no-JS route and
// what a middle click does — so this checks the enhanced path here and the
// underlying page in the test below.
test("an app card opens its story in the era window and gives focus back", async ({ page }) => {
  await page.setViewportSize(phone);
  await page.goto("./windows-xp/");

  const card = page.locator("[data-app-open]").first();
  const appName = (await card.textContent())!.trim();
  const dialog = page.locator("[data-app-dialog]");

  await expect(card).toHaveAttribute("aria-haspopup", "dialog");
  await expect(dialog).toBeHidden();

  await card.click();
  await expect(dialog).toBeVisible();
  await expect(page, "opening the story should not navigate").toHaveURL(/\/windows-xp\/$/);
  await expect(page.locator("[data-app-dialog-title]")).toHaveText(appName);
  await expect(page.locator("[data-app-dialog-why]")).not.toBeEmpty();
  await expect(page.locator("[data-app-dialog-relearn]")).not.toBeEmpty();
  await expect(page.locator("[data-app-dialog-source]")).toHaveAttribute("href", /^https:\/\//);
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

  // Escape is the native dialog's own affordance; the thing worth asserting is
  // that focus comes back to the card the visitor left, not to the top.
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(card).toBeFocused();

  // A different card must refill the same window rather than repeat the first.
  const other = page.locator("[data-app-open]").nth(2);
  const otherName = (await other.textContent())!.trim();
  await other.click();
  await expect(page.locator("[data-app-dialog-title]")).toHaveText(otherName);
  await page.locator("[data-app-close]").click();
  await expect(dialog).toBeHidden();
});

test("every app card still resolves to a real page without JavaScript", async ({ browser }) => {
  // reducedMotion, and not for cosmetic reasons. With scripting disabled the
  // page's requestAnimationFrame callbacks never run, so Playwright — which
  // compares bounding boxes across animation frames to decide an element has
  // stopped moving — can never observe the release page's 460ms arrival
  // animation finishing, and every click times out as "element is not
  // stable". The global prefers-reduced-motion reset in global.css removes the
  // animation, which is also a setting real visitors have switched on.
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: phone, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("./windows-95/");

  const card = page.locator("[data-app-open]").nth(3);
  const appName = (await card.textContent())!.trim();
  await card.click();

  await expect(page).toHaveURL(/\/windows-95\/apps\/[a-z0-9-]+\/$/);
  await expect(page.getByRole("heading", { level: 1, name: appName })).toBeVisible();
  await expect(page.locator("#why-heading")).toHaveText("Why it took over");
  await expect(page.locator("#relearn-heading")).toHaveText("What it left behind");
  await expect(page.locator(".app-source a")).toHaveAttribute("href", /^https:\/\//);

  await page.locator(".app-return a").click();
  await expect(page).toHaveURL(/\/windows-95\/#memory-heading-win95$/);
  await context.close();
});

// Every era styles its panels through one shared rule, and two sections had
// drifted out of it — they were carrying their own currentcolor treatment and
// read as foreign on the page. Nothing could catch that: jsdom computes no
// styles, so this has to be a browser check. Comparing against .release-details
// rather than against a hardcoded palette means the assertion keeps holding
// when an era's colours change.
test("the relearning test and the reach figure use each era's panel colours", async ({ page }) => {
  const versions = [
    "windows-1", "windows-2", "windows-3", "windows-95", "windows-98", "windows-2000",
    "windows-xp", "windows-vista", "windows-7", "windows-8", "windows-10", "windows-11",
  ];

  const paint = (selector: string) =>
    page.locator(selector).evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        background: style.backgroundColor,
        borderColor: style.borderTopColor,
        borderWidth: style.borderTopWidth,
        borderStyle: style.borderTopStyle,
      };
    });

  for (const version of versions) {
    await page.goto(`./${version}/`);
    const reference = await paint(".release-details");
    expect(await paint(".relearn"), `${version}: the relearning test does not match the page`).toEqual(reference);
    expect(await paint(".release-adoption"), `${version}: the reach figure does not match the page`).toEqual(reference);
  }
});

// 01-04 open the long version in the same era window. The dialog is styled
// only by the twelve shared panel rules, so this also checks it did not miss
// one — the failure would be a modal in some other era's colours.
test("each of the four system notes opens its long version and gives focus back", async ({ page }) => {
  for (const [version, viewport] of [["windows-95", desktop], ["windows-8", phone]] as const) {
    await page.setViewportSize(viewport);
    await page.goto(`./${version}/`);

    const dialog = page.locator("[data-detail-dialog]");
    await expect(dialog).toBeHidden();

    const triggers = page.locator("[data-detail-open]");
    await expect(triggers).toHaveCount(4);

    const seen: string[] = [];
    for (let index = 0; index < 4; index += 1) {
      const trigger = triggers.nth(index);
      const heading = (await trigger.textContent())!.trim();
      await expect(trigger).toHaveAttribute("aria-haspopup", "dialog");

      await trigger.click();
      await expect(dialog).toBeVisible();
      await expect(page.locator("[data-detail-dialog-title]"), `${version}: card ${index + 1}`).toHaveText(heading);
      await expect(page.locator("[data-detail-dialog-number]")).toHaveText(["01", "02", "03", "04"][index]);
      await expect(page.locator("[data-detail-dialog-source]")).toHaveAttribute("href", /^https:\/\//);

      const long = (await page.locator("[data-detail-dialog-long]").textContent())!.trim();
      const short = (await page.locator("[data-detail-dialog-short]").textContent())!.trim();
      expect(long.length, `${version}: card ${index + 1} is not longer than the card`).toBeGreaterThan(short.length);
      seen.push(long);

      await page.keyboard.press("Escape");
      await expect(dialog).toBeHidden();
      await expect(trigger, `${version}: focus did not return to card ${index + 1}`).toBeFocused();
    }

    // Four different notes, not the same one refilled — the failure mode if
    // the triggers all carried the same data.
    expect(new Set(seen).size, `${version}: the four cards do not open four different notes`).toBe(4);
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
});

test("the system-note window wears the same era panel as the section it opens from", async ({ page }) => {
  for (const version of ["windows-1", "windows-3", "windows-xp", "windows-8", "windows-10", "windows-11"]) {
    await page.goto(`./${version}/`);
    const reference = await page.locator(".release-details").evaluate((element) => {
      const style = getComputedStyle(element);
      return { background: style.backgroundColor, borderColor: style.borderTopColor, borderStyle: style.borderTopStyle };
    });

    await page.locator("[data-detail-open]").first().click();
    const windowPaint = await page.locator(".detail-dialog-window").evaluate((element) => {
      const style = getComputedStyle(element);
      return { background: style.backgroundColor, borderColor: style.borderTopColor, borderStyle: style.borderTopStyle };
    });

    expect(windowPaint, `${version}: the note window is not in this era's colours`).toEqual(reference);
  }
});

// Six pages, two at a time, turned with Q and E or the buttons.
test("the history book turns two pages at a time and stops at both covers", async ({ page }) => {
  for (const viewport of [desktop, phone]) {
    await page.setViewportSize(viewport);
    await page.goto("./windows-95/");

    const visible = () => page.locator("[data-book-page]:not([hidden])");
    const progress = page.locator("[data-book-progress]");
    const previous = page.locator("[data-book-previous]");
    const next = page.locator("[data-book-next]");

    await expect(visible()).toHaveCount(2);
    await expect(progress).toHaveText("Pages 1–2 of 6");
    await expect(previous, "there is nothing before page one").toBeDisabled();

    await page.keyboard.press("e");
    await expect(progress).toHaveText("Pages 3–4 of 6");
    await page.keyboard.press("e");
    await expect(progress).toHaveText("Pages 5–6 of 6");
    await expect(next, "there is nothing after page six").toBeDisabled();

    // Past the last page must do nothing rather than empty the book.
    await page.keyboard.press("e");
    await expect(progress).toHaveText("Pages 5–6 of 6");
    await expect(visible()).toHaveCount(2);

    await page.keyboard.press("q");
    await expect(progress).toHaveText("Pages 3–4 of 6");
    await previous.click();
    await expect(progress).toHaveText("Pages 1–2 of 6");
    await page.keyboard.press("q");
    await expect(progress).toHaveText("Pages 1–2 of 6");

    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }
});

// Q and E are ordinary letters, and this page has a command prompt with a text
// input in it. Typing a word containing either must type it, not turn a page.
test("typing q or e into the command prompt does not turn the page", async ({ page }) => {
  await page.setViewportSize(desktop);
  await page.goto("./windows-95/");

  await page.locator("[data-command-open], [data-command-external-open]").first().click();
  const input = page.locator("[data-command-input]");
  await input.fill("");
  await input.type("queue");

  await expect(input).toHaveValue("queue");
  await expect(page.locator("[data-book-progress]")).toHaveText("Pages 1–2 of 6");
});

// Reach and share are two rows of label / figure / bar, and the two bars have
// to line up. They are cells of one grid rather than two nested ones, so this
// is really a check that the grid stays one grid. Widths either side of the
// 64rem collapse, because a column that overflows does it quietly: the first
// attempt at this layout pushed the page 6px wide at 768 and 360px wide at
// 390, from a media query written above the rule it was meant to override.
test("both adoption bars are parallel and neither pushes the page wide", async ({ page }) => {
  for (const width of [2560, 1920, 1440, 1280, 1024, 900, 768, 600, 390]) {
    await page.setViewportSize({ width, height: 900 });
    for (const version of ["windows-7", "windows-1"]) {
      await page.goto(`./${version}/`);
      const bars = await page.evaluate(() => {
        const [reach, share] = [...document.querySelectorAll(".release-adoption .release-adoption-meter")]
          .map((element) => element.getBoundingClientRect());
        return {
          count: document.querySelectorAll(".release-adoption .release-adoption-meter").length,
          left: Math.abs(reach.left - share.left),
          width: Math.abs(reach.width - share.width),
          stacked: share.top > reach.top,
        };
      });

      expect(bars.count, `${width}px ${version}: expected two bars`).toBe(2);
      expect(bars.left, `${width}px ${version}: bars start in different places`).toBeLessThanOrEqual(0.5);
      expect(bars.width, `${width}px ${version}: bars are different lengths`).toBeLessThanOrEqual(0.5);
      expect(bars.stacked, `${width}px ${version}: share bar is not below the reach bar`).toBe(true);
      await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    }
  }
});

// The reach figure counts up, and every frame changes the string: "0", "116K",
// "904K", "1.2M". While the middle grid track was `auto` it resized to fit each
// one, shoving the label and the bar sideways — the shake, worst at K -> M
// because the string gains a character. Windows 2.0 and 3.1 are the cases that
// actually cross that boundary; the larger releases jump straight into M and
// would let a broken build pass.
test("nothing moves while the adoption figure counts up", async ({ page }) => {
  await page.setViewportSize(desktop);

  for (const version of ["windows-2", "windows-3"]) {
    await page.goto(`./${version}/`);

    // The strings are driven rather than sampled from the live animation. A
    // first version watched real frames and was flaky: the eased curve crosses
    // K to M in a few milliseconds, so the sampler sometimes stepped over the
    // one transition the test exists to cover, and the run failed on its own
    // anti-vacuity guard rather than on the page. Setting each string makes the
    // case deterministic, and the layout contract — whatever the counter shows,
    // nothing moves — is the same either way.
    const samples = await page.evaluate((strings) => {
      const value = document.querySelector(".adoption-value")!;
      const bar = document.querySelector(".release-adoption-meter")!;
      const label = document.querySelector(".adoption-label")!;
      const counter = document.querySelector("[data-adoption-count]")!;

      return strings.map((text) => {
        counter.textContent = text;
        // Read after writing so the measurement is of this string, not the last.
        return {
          text,
          valueWidth: Number(value.getBoundingClientRect().width.toFixed(2)),
          barLeft: Number(bar.getBoundingClientRect().left.toFixed(2)),
          labelRight: Number(label.getBoundingClientRect().right.toFixed(2)),
        };
      });
    }, ["0", "3K", "116K", "904K", "1.2M", "40M", "485M", "1B", "1B+"]);

    expect(samples, `${version}`).toHaveLength(9);
    for (const key of ["valueWidth", "barLeft", "labelRight"] as const) {
      const distinct = new Set(samples.map((frame) => frame[key]));
      expect([...distinct], `${version}: ${key} changed with the counter's text`).toHaveLength(1);
    }

    // And the counter really does animate, so the contract above is about
    // something that happens rather than a static page.
    await page.reload();
    const live = await page.evaluate(async () => {
      const counter = document.querySelector("[data-adoption-count]")!;
      const seen = new Set<string>();
      document.querySelector(".release-adoption")!.scrollIntoView({ block: "center" });
      for (let i = 0; i < 60; i += 1) {
        seen.add(counter.textContent!.trim());
        await new Promise((resolve) => requestAnimationFrame(resolve));
      }
      return seen.size;
    });
    expect(live, `${version}: the counter never animated`).toBeGreaterThan(3);
  }
});

// The early recreations put fixed-percentage windows on the desktop and fill
// them with text, so a phone squeezes the window without squeezing what is
// inside it. Windows 1.0 spilled three filenames out of the MS-DOS Executive
// frame — `repeat(3, 1fr)` keeps an auto minimum per track, so "CARDFILE.EXE"
// set a floor and the grid grew past its own window — and Windows 2.0's
// Control Panel gave 28px buttons to labels needing 65px. Neither shows up in
// jsdom, and neither widens the page, so the horizontal-scroll checks stay
// green through both.
test("the early desktops keep their contents inside their own windows on a phone", async ({ page }) => {
  for (const width of [390, 360, 320]) {
    await page.setViewportSize({ width, height: 844 });

    await page.goto("./windows-1/");
    const spilled = await page.evaluate(() => {
      const frame = document.querySelector(".early-executive")!.getBoundingClientRect();
      return [...document.querySelectorAll(".file-table > *")]
        .filter((cell) => {
          const box = cell.getBoundingClientRect();
          return box.right > frame.right + 0.5 || box.bottom > frame.bottom + 0.5
            || cell.scrollWidth > Math.ceil(box.width);
        })
        .map((cell) => cell.textContent!.trim());
    });
    expect(spilled, `${width}px: filenames outside the MS-DOS Executive window`).toEqual([]);

    await page.goto("./windows-2/");
    const cramped = await page.evaluate(() => {
      const frame = document.querySelector(".early-tool")!.getBoundingClientRect();
      return [...document.querySelectorAll(".early-controls button")]
        .filter((button) => {
          const box = button.getBoundingClientRect();
          return button.scrollWidth > Math.ceil(box.width) || box.bottom > frame.bottom + 0.5;
        })
        .map((button) => `${button.textContent!.trim()} (${Math.round(button.getBoundingClientRect().width)}px < ${button.scrollWidth}px)`);
    });
    expect(cramped, `${width}px: Control Panel labels do not fit their buttons`).toEqual([]);
  }

  // Windows 3.1's Program Manager, same class again: four icons in a row left
  // about 12px per button, so "MS-DOS Prompt" was laid out past the Main
  // group's right edge. Measured as a Range over the label's own text node —
  // the button box stayed inside the group the whole time, which is why a
  // box-based check called this clean while the glyphs were outside.
  //
  // 320px is not asserted: the group windows clip like the real thing, so a
  // narrow enough viewport truncates a label rather than spilling it, and that
  // is below the 390 marking viewport.
  for (const width of [390, 360]) {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("./windows-3/");

    const outside = await page.evaluate(() => {
      const escaped: string[] = [];
      for (const group of document.querySelectorAll(".program-group")) {
        const frame = group.getBoundingClientRect();
        for (const button of group.querySelectorAll("button")) {
          const textNode = [...button.childNodes].find((node) => node.nodeType === 3 && node.textContent!.trim());
          if (!textNode) continue;
          const range = document.createRange();
          range.selectNodeContents(textNode);
          const label = range.getBoundingClientRect();
          const over = Math.max(
            label.right - frame.right,
            frame.left - label.left,
            label.bottom - frame.bottom,
            frame.top - label.top,
          );
          if (over > 0.5) escaped.push(`${button.textContent!.trim()} (+${over.toFixed(1)}px)`);
        }
      }
      return escaped;
    });
    expect(outside, `${width}px: Program Manager labels laid out outside their group`).toEqual([]);
  }
});

test("static navigation still explains the selected release without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: phone });
  const page = await context.newPage();
  await page.goto("./");
  await page.locator("[data-timeline-step]").nth(6).click();

  await expect(page).toHaveURL(/\/windows\/#windows-xp$/);
  await expect(page.locator("#windows-xp").getByRole("heading", { level: 2, name: "Windows XP", exact: true })).toBeVisible();
  await expect(page.locator("#windows-xp [data-desktop]")).toBeVisible();
  await context.close();
});

test("release content remains usable when media is unavailable", async ({ page }) => {
  await page.setViewportSize(phone);
  await page.route("**/media/**", (route) => route.abort());
  await page.goto("./windows-xp/");

  await expect(page.getByRole("heading", { level: 1, name: "Windows XP" })).toBeVisible();
  await expect(page.locator("[data-desktop]")).toBeVisible();
  await expect(page.getByRole("button", { name: /start/i }).first()).toBeEnabled();
});

// The bar sat in a different column from the header it sits under, and only
// above 1440px — the shell's max width — so every viewport narrower than that
// looked correct while the 1920 marking viewport did not. 2560 is here because
// the bug lived entirely in the range this test would otherwise never visit.
test("the release switcher shares the header's column and fills it with twelve equal cells", async ({ page }) => {
  for (const width of [2560, 1920, 1440, 1280, 768]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("./windows-xp/");

    const headerBox = (await page.locator(".site-header").boundingBox())!;
    const navBox = (await page.locator("[data-version-nav]").boundingBox())!;
    expect(headerBox, `${width}px`).not.toBeNull();
    expect(navBox, `${width}px`).not.toBeNull();
    expect(Math.abs(navBox.x - headerBox.x), `${width}px: left edges differ`).toBeLessThanOrEqual(0.5);
    expect(Math.abs(navBox.width - headerBox.width), `${width}px: widths differ`).toBeLessThanOrEqual(0.5);

    const track = page.locator("[data-version-nav] > ol");
    const trackBox = (await track.boundingBox())!;
    const cells = await track.locator(":scope > li").evaluateAll((items) => items.map((item) => {
      const box = item.getBoundingClientRect();
      return { left: box.left, right: box.right, width: box.width };
    }));

    expect(cells, `${width}px`).toHaveLength(12);
    expect(
      Math.max(...cells.map(({ width: w }) => w)) - Math.min(...cells.map(({ width: w }) => w)),
      `${width}px: cells are not equal`,
    ).toBeLessThanOrEqual(1);
    expect(Math.abs(cells[0].left - trackBox.x), `${width}px: gap at the left edge`).toBeLessThanOrEqual(1);
    expect(Math.abs(cells.at(-1)!.right - (trackBox.x + trackBox.width)), `${width}px: gap at the right edge`).toBeLessThanOrEqual(1);
  }
});

test("Windows 3.1 and 95 active cells have an uninterrupted navy fill", async ({ page }) => {
  for (const version of ["windows-3", "windows-95"]) {
    await page.goto(`./${version}/`);
    const active = page.locator('[data-version-nav] a[aria-current="page"]');
    const cell = active.locator("..");
    const [activeBox, cellBox, paint] = await Promise.all([
      active.boundingBox(),
      cell.boundingBox(),
      active.evaluate((element) => {
        const style = getComputedStyle(element);
        return {
          background: style.backgroundColor,
          borderBottom: style.borderBottomColor,
          borderRightWidth: style.borderRightWidth,
        };
      }),
    ]);

    expect(activeBox, `${version}: active cell is missing`).not.toBeNull();
    expect(cellBox, `${version}: timeline cell is missing`).not.toBeNull();
    expect(Math.abs(activeBox!.x - cellBox!.x), `${version}: blank left edge`).toBeLessThanOrEqual(0.5);
    expect(Math.abs(activeBox!.width - cellBox!.width), `${version}: blank right edge`).toBeLessThanOrEqual(0.5);
    expect(paint.background, `${version}: active fill`).toBe("rgb(0, 0, 128)");
    expect(paint.borderBottom, `${version}: bottom edge should match fill`).toBe(paint.background);
    expect(paint.borderRightWidth, `${version}: bright inset strip should be removed`).toBe("0px");
  }
});

test("requested command shortcuts stay left and yield to overlapping windows on a phone", async ({ page }) => {
  await page.setViewportSize(phone);

  for (const version of ["windows-95", "windows-98", "windows-2000", "windows-7", "windows-10", "windows-11"]) {
    await page.goto(`./${version}/`);
    const desktopBox = await page.locator("[data-desktop]").boundingBox();
    const commandBox = await page.locator("[data-command-open]").boundingBox();
    const shortcutBoxes = await page.locator(".desktop-shortcuts > button").evaluateAll((items) => items.map((item) => {
      const box = item.getBoundingClientRect();
      return { x: box.x, y: box.y, width: box.width, height: box.height };
    }));

    expect(desktopBox, version).not.toBeNull();
    expect(commandBox, version).not.toBeNull();
    expect(commandBox!.x + commandBox!.width / 2, version).toBeLessThan(desktopBox!.x + desktopBox!.width / 2);
    for (const shortcut of shortcutBoxes) {
      const overlaps = commandBox!.x < shortcut.x + shortcut.width
        && commandBox!.x + commandBox!.width > shortcut.x
        && commandBox!.y < shortcut.y + shortcut.height
        && commandBox!.y + commandBox!.height > shortcut.y;
      expect(overlaps, `${version}: command shortcut overlaps a desktop icon`).toBe(false);
    }

    const isCoveredByWindow = await page.evaluate(() => {
      const desktop = document.querySelector<HTMLElement>("[data-desktop]")!;
      const command = document.querySelector<HTMLElement>("[data-command-open]")!;
      const frontWindow = [...desktop.querySelectorAll<HTMLElement>("[data-window]")].find((item) => getComputedStyle(item).display !== "none")!;
      const desktopRect = desktop.getBoundingClientRect();
      const windowRect = frontWindow.getBoundingClientRect();
      command.style.inset = `${windowRect.top - desktopRect.top + 12}px auto auto ${windowRect.left - desktopRect.left + 12}px`;
      const commandRect = command.getBoundingClientRect();
      const topElement = document.elementFromPoint(commandRect.left + commandRect.width / 2, commandRect.top + commandRect.height / 2);
      return topElement !== command && !command.contains(topElement);
    });
    expect(isCoveredByWindow, `${version}: an overlapping window should cover the command shortcut`).toBe(true);
  }
});
