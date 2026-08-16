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

  const instructionBox = await page.locator("[data-core-instructions]").boundingBox();
  const easterEggBox = await page.locator("[data-bsod-trigger]").boundingBox();
  expect(instructionBox).not.toBeNull();
  expect(easterEggBox).not.toBeNull();
  const overlaps = instructionBox && easterEggBox
    ? instructionBox.x < easterEggBox.x + easterEggBox.width
      && instructionBox.x + instructionBox.width > easterEggBox.x
      && instructionBox.y < easterEggBox.y + easterEggBox.height
      && instructionBox.y + instructionBox.height > easterEggBox.y
    : true;
  expect(overlaps).toBe(false);
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
