import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";

function timelinePage() {
  const html = readFileSync(resolve("dist/index.html"), "utf8");
  const dom = new JSDOM(html, { runScripts: "outside-only", url: "https://example.test/comp4020-ass1-Zer0tier/" });
  Object.defineProperty(dom.window, "matchMedia", {
    configurable: true,
    value: () => ({ matches: true, addEventListener() {}, removeEventListener() {} }),
  });
  let now = 1000;
  dom.window.Date.now = () => { now += 500; return now; };
  dom.window.eval(readFileSync(resolve("src/timeline-entry.js"), "utf8"));
  return dom;
}

describe("scroll-controlled homepage timeline", () => {
  it("starts at Windows 1.0 with one central window", () => {
    const dom = timelinePage();
    const doc = dom.window.document;
    expect(doc.querySelectorAll("[data-timeline-window]")).toHaveLength(1);
    expect(doc.body.getAttribute("data-entry-version")).toBe("win1");
    expect(doc.querySelector("[data-timeline-status]")?.textContent).toBe("Windows 1.0 · 1985");
    expect(doc.querySelectorAll("[data-timeline-scene]:not([hidden])")).toHaveLength(1);
    dom.window.close();
  });

  it("moves forward and backward with the mouse wheel", () => {
    const dom = timelinePage();
    const doc = dom.window.document;

    dom.window.dispatchEvent(new dom.window.WheelEvent("wheel", { deltaY: 100, cancelable: true }));
    expect(doc.body.getAttribute("data-entry-version")).toBe("win2");
    expect(doc.querySelector("[data-timeline-status]")?.textContent).toBe("Windows 2.0 · 1987");

    dom.window.dispatchEvent(new dom.window.WheelEvent("wheel", { deltaY: -100, cancelable: true }));
    expect(doc.body.getAttribute("data-entry-version")).toBe("win1");
    dom.window.close();
  });

  it("updates the full-screen entry link to the displayed release", () => {
    const dom = timelinePage();
    const doc = dom.window.document;
    dom.window.dispatchEvent(new dom.window.KeyboardEvent("keydown", { key: "End", cancelable: true }));

    const enter = doc.querySelector<HTMLAnchorElement>("[data-timeline-enter]");
    expect(doc.body.getAttribute("data-entry-version")).toBe("win11");
    expect(enter?.href).toContain("/windows-11/");
    expect(enter?.getAttribute("aria-label")).toBe("Enter the Windows 11 page");
    dom.window.close();
  });

  it("provides keyboard timeline controls without extra visual clutter", () => {
    const dom = timelinePage();
    const doc = dom.window.document;
    dom.window.dispatchEvent(new dom.window.KeyboardEvent("keydown", { key: "ArrowRight", cancelable: true }));
    expect(doc.body.getAttribute("data-entry-version")).toBe("win2");
    expect(doc.querySelectorAll("main > .timeline-window")).toHaveLength(1);
    expect(doc.querySelector(".release-grid")).toBeNull();
    dom.window.close();
  });
});
