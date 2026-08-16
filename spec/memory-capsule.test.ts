import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, it, vi } from "vitest";

describe("time-capsule memories", () => {
  it("opens the selected memory in a dialog, closes it, and restores focus", () => {
    const html = readFileSync(resolve("dist/windows-98/index.html"), "utf8");
    const dom = new JSDOM(html, { runScripts: "outside-only" });
    const dialogPrototype = dom.window.HTMLDialogElement.prototype;
    const showModal = vi.fn(function (this: HTMLDialogElement) { this.open = true; });
    const close = vi.fn(function (this: HTMLDialogElement) {
      this.open = false;
      this.dispatchEvent(new dom.window.Event("close"));
    });
    Object.defineProperty(dialogPrototype, "showModal", { configurable: true, value: showModal });
    Object.defineProperty(dialogPrototype, "close", { configurable: true, value: close });

    dom.window.eval(readFileSync(resolve("src/memory-capsule.js"), "utf8"));

    const doc = dom.window.document;
    const trigger = doc.querySelector<HTMLButtonElement>('[data-memory-bubble][data-memory-index="2"]');
    const closeButton = doc.querySelector<HTMLButtonElement>("[data-memory-close]");
    trigger?.click();

    expect(showModal).toHaveBeenCalledOnce();
    expect(doc.querySelector("[data-memory-dialog-quote]")?.textContent).toContain("Winamp");
    expect(doc.querySelector("[data-memory-dialog-handle]")?.textContent).toContain("1999");

    closeButton?.click();
    expect(close).toHaveBeenCalledOnce();
    expect(doc.activeElement).toBe(trigger);
    dom.window.close();
  });
});
