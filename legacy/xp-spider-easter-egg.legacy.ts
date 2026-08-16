import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, it, vi } from "vitest";

const versions = ["windows-1", "windows-2", "windows-3", "windows-95", "windows-98", "windows-2000", "windows-xp", "windows-vista", "windows-7", "windows-8", "windows-10", "windows-11"];

function xpPage() {
  const html = readFileSync(resolve("dist/windows-xp/index.html"), "utf8");
  const dom = new JSDOM(html, { runScripts: "outside-only" });
  dom.window.eval(readFileSync(resolve("legacy/xp-spider-easter-egg.js"), "utf8"));
  return dom;
}

describe("Windows XP Spider Solitaire Easter egg", () => {
  it("uses the original XP card-face sheet and spider-web card back", () => {
    const html = readFileSync(resolve("dist/windows-xp/index.html"), "utf8");

    expect(html).toContain("xp-spider-cards.webp");
    expect(html).toContain("xp-spider-card-back.webp");
    expect(existsSync(resolve("public/media/xp-spider-cards.webp"))).toBe(true);
    expect(existsSync(resolve("public/media/xp-spider-card-back.webp"))).toBe(true);
  });

  it("appears only on the Windows XP release page", () => {
    for (const version of versions) {
      const html = readFileSync(resolve("dist", version, "index.html"), "utf8");
      expect(html.includes("data-xp-spider-easter-egg"), version).toBe(version === "windows-xp");
    }
  });

  it("squashes the crawler and immediately opens a playable XP game window", () => {
    const dom = xpPage();
    const doc = dom.window.document;
    const layer = doc.querySelector<HTMLElement>("[data-spider-game-layer]");
    const crawler = doc.querySelector<HTMLButtonElement>("[data-xp-spider]");
    const instantTimeout = vi.spyOn(dom.window, "setTimeout").mockImplementation(((handler: TimerHandler) => {
      if (typeof handler === "function") handler();
      return 1;
    }) as typeof dom.window.setTimeout);

    expect(layer?.hidden).toBe(true);
    crawler?.click();

    expect(crawler?.classList.contains("is-squashed")).toBe(true);
    expect(crawler?.hidden).toBe(true);
    expect(layer?.hidden).toBe(false);
    expect(doc.querySelector("[role='dialog']")?.getAttribute("aria-labelledby")).toBe("spider-game-title");
    expect(doc.querySelectorAll(".xp-spider-column")).toHaveLength(10);
    expect(doc.querySelectorAll(".xp-spider-card")).toHaveLength(54);
    expect(doc.querySelector("#spider-game-title")?.textContent).toBe("Spider");
    expect(doc.querySelectorAll(".xp-spider-stock span")).toHaveLength(5);
    instantTimeout.mockRestore();
    dom.window.close();
  });

  it("deals a full row from the stock and updates the move counter", () => {
    const dom = xpPage();
    const doc = dom.window.document;

    expect(doc.querySelector("[data-spider-stock-count]")?.textContent).toBe("50");
    doc.querySelector<HTMLButtonElement>("[data-spider-deal]")?.click();

    expect(doc.querySelector("[data-spider-stock-count]")?.textContent).toBe("40");
    expect(doc.querySelector("[data-spider-moves]")?.textContent).toBe("1");
    expect(doc.querySelectorAll(".xp-spider-card")).toHaveLength(64);
    expect(doc.querySelector("[data-spider-status]")?.textContent).toBe("A new row was dealt.");
    dom.window.close();
  });

  it("immediately plays the completed-game animation for Alt+Shift+2", () => {
    const dom = xpPage();
    const doc = dom.window.document;
    const shortcut = new dom.window.KeyboardEvent("keydown", {
      altKey: true,
      shiftKey: true,
      code: "Digit2",
      bubbles: true,
      cancelable: true,
    });

    doc.dispatchEvent(shortcut);

    const victory = doc.querySelector<HTMLElement>("[data-spider-victory]");
    expect(shortcut.defaultPrevented).toBe(true);
    expect(doc.querySelector<HTMLElement>("[data-spider-game-layer]")?.hidden).toBe(false);
    expect(victory?.hidden).toBe(false);
    expect(victory?.classList.contains("is-playing")).toBe(true);
    expect(doc.querySelectorAll(".xp-spider-firework")).toHaveLength(5);
    expect(doc.querySelector(".xp-spider-victory-message")?.textContent?.replace(/\s+/g, " ").trim()).toBe("You Won!");
    expect(doc.querySelectorAll(".xp-spider-card")).toHaveLength(0);
    expect(doc.querySelectorAll(".xp-spider-completed .is-complete")).toHaveLength(8);
    expect(doc.querySelector("[data-spider-score]")?.textContent).toBe("1300");
    expect(doc.querySelector("[data-spider-status]")?.textContent).toContain("You won!");
    dom.window.close();
  });
});
