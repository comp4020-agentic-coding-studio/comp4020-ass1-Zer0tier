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
});
