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
    expect(doc.querySelector("[data-core-interaction]")?.getAttribute("data-core-interaction")).toBe("change-version");
    expect(doc.querySelector("[data-core-instructions]")?.textContent).toContain("A–D");
    expect(doc.querySelector(".timeline-argument")?.textContent).toContain("relearn the same machine");
    expect(doc.body.getAttribute("data-entry-version")).toBe("win1");
    expect(doc.querySelector("[data-timeline-status]")?.textContent).toBe("Windows 1.0 · 1985");
    expect(doc.querySelectorAll("[data-timeline-scene]:not([hidden])")).toHaveLength(1);
    expect(doc.querySelectorAll("[data-timeline-step]")).toHaveLength(12);
    expect(doc.querySelector('[data-timeline-step][aria-current="step"]')?.textContent).toContain("1.0");
    expect(doc.querySelector("[data-timeline-reach] [data-reach-count]")?.textContent).toBe("500K");
    expect(doc.querySelector("[data-timeline-reach] [data-reach-detail]")?.textContent).toContain("copies sold");
    expect(doc.querySelector<HTMLAnchorElement>("[data-timeline-reach] [data-reach-source]")?.href).toMatch(/^https:/);
    expect(doc.querySelectorAll("[data-timeline-scene][data-reach-value][data-reach-source-url]")).toHaveLength(12);
    dom.window.close();
  });

  it("moves forward and backward with the mouse wheel", () => {
    const dom = timelinePage();
    const doc = dom.window.document;

    dom.window.dispatchEvent(new dom.window.WheelEvent("wheel", { deltaY: 100, cancelable: true }));
    expect(doc.body.getAttribute("data-entry-version")).toBe("win2");
    expect(doc.querySelector("[data-timeline-status]")?.textContent).toBe("Windows 2.0 · 1987");
    expect(doc.querySelector("[data-timeline-reach] [data-reach-count]")?.textContent).toBe("1M");

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
    expect(doc.querySelector("[data-timeline-reach] [data-reach-count]")?.textContent).toBe("1B+");
    expect(doc.querySelector("[data-timeline-reach] [data-reach-period]")?.textContent).toBe("reported February 2026");
    expect(doc.querySelector<HTMLAnchorElement>("[data-timeline-reach] [data-reach-source]")?.href).toContain("blogs.windows.com");
    dom.window.close();
  });

  it("moves with arrows and A/D while synchronising the selector", () => {
    const dom = timelinePage();
    const doc = dom.window.document;
    dom.window.dispatchEvent(new dom.window.KeyboardEvent("keydown", { key: "ArrowRight", cancelable: true }));
    expect(doc.body.getAttribute("data-entry-version")).toBe("win2");
    expect(doc.querySelector('[data-timeline-step][aria-current="step"]')?.textContent).toContain("2.0");
    expect(doc.querySelector<HTMLElement>("[data-timeline-selector]")?.style.getPropertyValue("--timeline-offset")).toBe("100%");

    dom.window.dispatchEvent(new dom.window.KeyboardEvent("keydown", { key: "a", cancelable: true }));
    expect(doc.body.getAttribute("data-entry-version")).toBe("win1");
    dom.window.dispatchEvent(new dom.window.KeyboardEvent("keydown", { key: "D", cancelable: true }));
    expect(doc.body.getAttribute("data-entry-version")).toBe("win2");
    expect(doc.querySelectorAll("main > .timeline-window")).toHaveLength(1);
    expect(doc.querySelector(".release-grid")).toBeNull();
    dom.window.close();
  });

  it("holds the first and last selections at the timeline boundaries", () => {
    const dom = timelinePage();
    const doc = dom.window.document;

    dom.window.dispatchEvent(new dom.window.KeyboardEvent("keydown", { key: "ArrowLeft", cancelable: true }));
    expect(doc.body.getAttribute("data-entry-version")).toBe("win1");
    expect(doc.querySelector("[data-timeline-keyboard-status]")?.textContent).toContain("Start of the timeline");

    dom.window.dispatchEvent(new dom.window.KeyboardEvent("keydown", { key: "End", cancelable: true }));
    dom.window.dispatchEvent(new dom.window.KeyboardEvent("keydown", { key: "d", cancelable: true }));
    expect(doc.body.getAttribute("data-entry-version")).toBe("win11");
    expect(doc.querySelector("[data-timeline-keyboard-status]")?.textContent).toContain("End of the timeline");
    dom.window.close();
  });

  it("supports horizontal trackpad movement and touch swipes", () => {
    const dom = timelinePage();
    const doc = dom.window.document;

    dom.window.dispatchEvent(new dom.window.WheelEvent("wheel", { deltaX: 90, cancelable: true }));
    expect(doc.body.getAttribute("data-entry-version")).toBe("win2");

    const touchStart = new dom.window.Event("touchstart");
    Object.defineProperty(touchStart, "changedTouches", { value: [{ clientX: 200, clientY: 100 }] });
    dom.window.dispatchEvent(touchStart);
    const touchEnd = new dom.window.Event("touchend");
    Object.defineProperty(touchEnd, "changedTouches", { value: [{ clientX: 120, clientY: 96 }] });
    dom.window.dispatchEvent(touchEnd);
    expect(doc.body.getAttribute("data-entry-version")).toBe("win3");
    expect(doc.querySelector("[data-timeline-reach] [data-reach-count]")?.textContent).toBe("3M");
    dom.window.close();
  });
});
