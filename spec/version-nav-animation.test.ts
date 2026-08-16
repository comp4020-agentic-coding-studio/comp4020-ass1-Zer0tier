import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";

function releasePage(version: string) {
  const html = readFileSync(resolve("dist", version, "index.html"), "utf8");
  const dom = new JSDOM(html, { runScripts: "outside-only", url: `https://example.test/${version}/` });
  dom.window.eval(readFileSync(resolve("src/system-interactions.js"), "utf8"));
  return dom;
}

describe("release-page version switcher animation", () => {
  it.each(["windows-1", "windows-xp", "windows-11"])("adds one animated glider to %s", (version) => {
    const dom = releasePage(version);
    const nav = dom.window.document.querySelector<HTMLElement>("[data-version-nav]")!;

    expect(nav.querySelectorAll("a[data-version-index]")).toHaveLength(12);
    expect(nav.querySelectorAll("[data-version-nav-glider]")).toHaveLength(1);
    expect(nav.classList.contains("is-enhanced")).toBe(true);
    dom.window.close();
  });

  it("starts the glider and page-exit states before following a clicked version", () => {
    const dom = releasePage("windows-xp");
    const doc = dom.window.document;
    const nav = doc.querySelector<HTMLElement>("[data-version-nav]")!;
    const target = nav.querySelector<HTMLAnchorElement>('a[data-version-index="8"]')!;
    const click = new dom.window.MouseEvent("click", { bubbles: true, cancelable: true, button: 0 });

    target.dispatchEvent(click);

    expect(click.defaultPrevented).toBe(true);
    expect(nav.classList.contains("is-navigating")).toBe(true);
    expect(target.classList.contains("is-transition-target")).toBe(true);
    expect(doc.body.classList.contains("is-version-leaving")).toBe(true);
    dom.window.close();
  });

  it("uses the same transition for keyboard navigation and pulses at a boundary", () => {
    const middle = releasePage("windows-xp");
    middle.window.document.dispatchEvent(new middle.window.KeyboardEvent("keydown", { key: "d", bubbles: true }));
    expect(middle.window.document.querySelector("[data-version-nav]")?.classList.contains("is-navigating")).toBe(true);
    middle.window.close();

    const first = releasePage("windows-1");
    first.window.document.dispatchEvent(new first.window.KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }));
    expect(first.window.document.querySelector("[data-version-nav]")?.classList.contains("is-current-pulsing")).toBe(true);
    expect(first.window.document.body.classList.contains("is-version-leaving")).toBe(false);
    first.window.close();
  });
});
