import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";

describe("release-page adoption milestone", () => {
  it("reveals the final sourced count immediately when reduced motion is requested", () => {
    const html = readFileSync(resolve("dist/windows-11/index.html"), "utf8");
    const dom = new JSDOM(html, { runScripts: "outside-only", url: "https://example.test/windows-11/" });
    Object.defineProperty(dom.window, "matchMedia", {
      configurable: true,
      value: () => ({ matches: true, addEventListener() {}, removeEventListener() {} }),
    });
    dom.window.eval(readFileSync(resolve("src/adoption-milestone.js"), "utf8"));

    const section = dom.window.document.querySelector("[data-adoption-milestone]");
    expect(section?.classList.contains("is-visible")).toBe(true);
    expect(section?.querySelector("[data-adoption-count]")?.textContent).toBe("1B+");
    expect(section?.textContent).toContain("devices powered by Windows 11");
    dom.window.close();
  });

  // No script runs in this test on purpose. This is what a visitor with
  // JavaScript off reads, and what everyone reads on a slow connection before
  // the inline script gets its turn. The counter used to ship a hardcoded 0
  // here, which is not a pending number — it is a wrong one.
  //
  // The expected figures are written as literals rather than read back from
  // windows-adoption.ts, so that changing the data cannot quietly move the
  // goalposts: a test that asks the source what the source says can only ever
  // check consistency, never correctness.
  it.each([
    ["windows-1", "500K"],
    ["windows-xp", "485M"],
    ["windows-11", "1B+"],
  ])("serves the real %s figure before any script runs", (slug, expected) => {
    const html = readFileSync(resolve(`dist/${slug}/index.html`), "utf8");
    const dom = new JSDOM(html); // scripts never execute: runScripts is not set

    const count = dom.window.document.querySelector("[data-adoption-count]");
    expect(count?.textContent?.trim()).toBe(expected);
    dom.window.close();
  });
});
