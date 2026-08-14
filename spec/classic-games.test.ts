import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";

const gameSource = readFileSync(resolve("src/classic-games.js"), "utf8");

function gamePage(version: string) {
  const html = readFileSync(resolve("dist", version, "index.html"), "utf8");
  const dom = new JSDOM(html, { runScripts: "outside-only" });
  dom.window.eval(gameSource);
  return dom;
}

describe("classic built-in games", () => {
  it("plays a valid Reversi move on Windows 1.0", () => {
    const dom = gamePage("windows-1");
    const doc = dom.window.document;
    expect(doc.querySelectorAll("[data-reversi-board] button")).toHaveLength(36);
    expect(doc.querySelectorAll("[data-reversi-board] [data-piece]")).toHaveLength(4);

    doc.querySelector<HTMLButtonElement>("[data-reversi-board] button[data-valid='true']")?.click();
    expect(doc.querySelectorAll("[data-reversi-board] [data-piece]")).toHaveLength(5);
    expect(doc.querySelector("[data-reversi-status]")?.textContent).toContain("flipped");
    dom.window.close();
  });

  it("generates and reveals an XP beginner Minesweeper board", () => {
    const dom = gamePage("windows-xp");
    const doc = dom.window.document;
    const cells = doc.querySelectorAll<HTMLButtonElement>("[data-mines-grid] button");
    expect(cells).toHaveLength(81);

    cells[0].click();
    expect(doc.querySelectorAll("[data-mines-grid] .is-revealed").length).toBeGreaterThan(0);
    doc.querySelector<HTMLButtonElement>("[data-flag-mode]")?.click();
    doc.querySelector<HTMLButtonElement>("[data-mines-grid] button:not(.is-revealed)")?.click();
    expect(doc.querySelectorAll("[data-mines-grid] .is-flagged")).toHaveLength(1);
    dom.window.close();
  });

  it("finds a matching pair in Vista Purble Pairs", () => {
    const dom = gamePage("windows-vista");
    const doc = dom.window.document;
    const cards = [...doc.querySelectorAll<HTMLButtonElement>("[data-purble-grid] button")];
    expect(cards).toHaveLength(16);

    const symbol = cards[0].getAttribute("data-symbol");
    cards[0].click();
    doc.querySelector<HTMLButtonElement>(`[data-purble-grid] button[data-symbol='${symbol}']:not(.is-open)`)?.click();
    expect(doc.querySelector("[data-purble-score]")?.textContent).toBe("1 / 8");
    expect(doc.querySelector("[data-purble-status]")?.textContent).toBe("Pair found.");
    dom.window.close();
  });

  it("keeps games on historically relevant release pages", () => {
    expect(readFileSync(resolve("dist/windows-1/index.html"), "utf8")).toContain("data-reversi");
    expect(readFileSync(resolve("dist/windows-xp/index.html"), "utf8")).toContain("data-minesweeper");
    expect(readFileSync(resolve("dist/windows-vista/index.html"), "utf8")).toContain("data-purble");
    const windows11 = new JSDOM(readFileSync(resolve("dist/windows-11/index.html"), "utf8")).window.document;
    expect(windows11.querySelector("[data-minesweeper]")).toBeNull();
  });
});
