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

// The app pages are plain links to static pages, so the interesting failure is
// not JavaScript — it is the base path. A wrong one looks perfect on
// 127.0.0.1 and 404s on …github.io/<repo>/, which is why this walks the
// journey rather than asserting an href.
test("an app card opens its page, which links onward and back", async ({ page }) => {
  await page.setViewportSize(phone);
  await page.goto("./windows-xp/");

  const card = page.locator(".memory-app-link").first();
  const appName = (await card.textContent())!.trim();
  await card.click();

  await expect(page).toHaveURL(/\/windows-xp\/apps\/[a-z0-9-]+\/$/);
  await expect(page.getByRole("heading", { level: 1, name: appName })).toBeVisible();
  await expect(page.locator("#why-heading")).toHaveText("Why it took over");
  await expect(page.locator("#relearn-heading")).toHaveText("What it left behind");
  await expect(page.locator(".app-source a")).toHaveAttribute("href", /^https:\/\//);
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

  await page.locator(".next-app").click();
  await expect(page).toHaveURL(/\/windows-xp\/apps\/[a-z0-9-]+\/$/);
  await expect(page.getByRole("heading", { level: 1 })).not.toHaveText(appName);

  await page.locator(".app-return a").click();
  await expect(page).toHaveURL(/\/windows-xp\/#memory-heading-winxp$/);
  await expect(page.locator(".memory-app-link").first()).toBeVisible();
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

test("the release switcher fills the desktop with twelve equal edge-to-edge cells", async ({ page }) => {
  await page.setViewportSize(desktop);
  await page.goto("./windows-xp/");

  const nav = page.locator("[data-version-nav]");
  const track = nav.locator(":scope > ol");
  const trackBox = await track.boundingBox();
  const cells = await track.locator(":scope > li").evaluateAll((items) => items.map((item) => {
    const box = item.getBoundingClientRect();
    return { left: box.left, right: box.right, width: box.width };
  }));

  expect(trackBox).not.toBeNull();
  expect(cells).toHaveLength(12);
  expect(Math.max(...cells.map(({ width }) => width)) - Math.min(...cells.map(({ width }) => width))).toBeLessThanOrEqual(1);
  expect(Math.abs(cells[0].left - trackBox!.x)).toBeLessThanOrEqual(1);
  expect(Math.abs(cells.at(-1)!.right - (trackBox!.x + trackBox!.width))).toBeLessThanOrEqual(1);
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
