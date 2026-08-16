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

  // This used to measure the instruction against the "DO NOT CLICK" button
  // specifically, because that button was what covered it on a phone. The
  // button is gone, but the contract it was standing in for is not: the one
  // line telling a visitor how to work the page must not be sitting under
  // anything. Hit-testing its own centre says that about every future overlay,
  // not just the one that caused the bug.
  const instruction = page.locator("[data-core-instructions]");
  expect(await instruction.boundingBox()).not.toBeNull();
  const covering = await instruction.evaluate((element) => {
    const box = element.getBoundingClientRect();
    const stack = document.elementsFromPoint(box.left + box.width / 2, box.top + box.height / 2);
    const self = stack.indexOf(element);
    if (self === -1) return ["<instruction is not hit-testable at its own centre>"];
    return stack
      .slice(0, self)
      // Ancestors are above it in the stack by definition, and .timeline-enter-nav
      // is the deliberate transparent full-viewport overlay that makes "click to
      // enter" work anywhere on the page. Anything else on top is a bug.
      .filter((node) => !node.contains(element) && !node.closest(".timeline-enter-nav"))
      .map((node) => `${node.tagName.toLowerCase()}.${String(node.className).split(" ")[0]}`);
  });
  expect(covering, "something other than the enter overlay is covering the core instruction").toEqual([]);
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

test("static navigation still explains the selected release without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: phone });
  const page = await context.newPage();
  await page.goto("./");
  await page.locator("[data-timeline-step]").nth(6).click();

  await expect(page).toHaveURL(/\/windows-xp\/$/);
  await expect(page.getByRole("heading", { level: 1, name: "Windows XP" })).toBeVisible();
  await expect(page.locator("[data-desktop]")).toBeVisible();
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
