import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";

function bsodPage(page = "index.html") {
  const html = readFileSync(resolve("dist", page), "utf8");
  const dom = new JSDOM(html, { runScripts: "outside-only", url: "https://example.test/" });
  dom.window.eval(readFileSync(resolve("src/bsod-easter-egg.js"), "utf8"));
  return dom;
}

describe("DO NOT CLICK BSOD easter egg", () => {
  it("ships the hidden fixed trigger and BSOD on the home and release pages", () => {
    expect(readFileSync(resolve("src/components/BsodEasterEgg.astro"), "utf8")).toContain("background: #0000AA");
    for (const page of ["index.html", "windows-1/index.html", "windows-11/index.html"]) {
      const dom = bsodPage(page);
      const doc = dom.window.document;
      expect(doc.querySelector("[data-bsod-trigger]")?.textContent).toBe("DO NOT CLICK");
      expect(doc.querySelector<HTMLElement>("[data-bsod-screen]")?.hidden).toBe(true);
      expect(doc.querySelector("[data-bsod-screen]")?.textContent).toContain("Press F5 to refresh and restart.");
      dom.window.close();
    }
  });

  it("instantly covers and makes the normal page content inert after activation", () => {
    const dom = bsodPage();
    const doc = dom.window.document;
    const trigger = doc.querySelector<HTMLButtonElement>("[data-bsod-trigger]")!;
    const screen = doc.querySelector<HTMLElement>("[data-bsod-screen]")!;

    trigger.click();

    expect(screen.hidden).toBe(false);
    expect(doc.documentElement.classList.contains("bsod-active")).toBe(true);
    expect(doc.body.classList.contains("bsod-active")).toBe(true);
    expect(doc.activeElement).toBe(screen);
    expect(doc.querySelector("main")?.hasAttribute("inert")).toBe(true);
    expect(doc.querySelector("main")?.getAttribute("aria-hidden")).toBe("true");
    dom.window.close();
  });
});
