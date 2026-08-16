import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";

// Contracts for the timeline half of the page, on the BUILT site.
//
// What is deliberately not here: any assertion about layout. jsdom computes
// none, so a green "it works at 390px" test would pass on a visibly broken
// page — worse than no test, because it manufactures confidence. The viewport
// contract is verified by rendering the built page in a real browser and
// measuring scrollWidth at both marking sizes (see PROCESS.md).

const html = readFileSync(resolve("dist/index.html"), "utf8");
const doc = new JSDOM(html).window.document;

const triggers = [...doc.querySelectorAll("[data-dynasty]")];
const attr = (el: Element, name: string): string => el.getAttribute(name) ?? "";
const idOf = (el: Element): string => attr(el, "data-dynasty");

interface Shipped {
  id: string;
  start: number;
  end: number;
}
const shipped: Shipped[] = triggers
  .filter((t) => attr(t, "data-kind") === "regime")
  .map((t) => ({
    id: idOf(t),
    start: Number(attr(t, "data-start")),
    end: Number(attr(t, "data-end")),
  }));

// Re-derived here on purpose rather than imported from legacy/data/layout.ts.
// A test that borrows the implementation's own predicate can only check that
// the code is self-consistent, never that the convention is right.
const overlap = (a: Shipped, b: Shipped): boolean => a.start < b.end && b.start < a.end;

describe("the timeline ships every fact the quiz will need", () => {
  it("renders a trigger for every regime", () => {
    expect(triggers.length).toBeGreaterThan(40);
  });

  it("gives each trigger the full attribute set", () => {
    // The quiz builds its pool from these attributes, so a trigger missing one
    // is silently unquizzable — no error, just a regime that can never be
    // asked about. This is the analogue of the data-search test from C2, which
    // caught exactly that class of bug.
    const required = [
      "data-name",
      "data-zh",
      "data-years",
      "data-period",
      "data-period-name",
      "data-track",
      "data-track-name",
      "data-kind",
      "data-artefact",
      "data-detail",
    ];
    const broken = triggers
      .map((t) => ({ id: idOf(t), missing: required.filter((a) => !attr(t, a).trim()) }))
      .filter((r) => r.missing.length > 0)
      .map((r) => `${r.id}: ${r.missing.join(", ")}`);
    expect(broken, `triggers missing attributes:\n${broken.join("\n")}`).toEqual([]);
  });

  it("gives each trigger a numeric span that runs forwards", () => {
    const bad = triggers
      .map((t) => ({ id: idOf(t), s: Number(attr(t, "data-start")), e: Number(attr(t, "data-end")) }))
      .filter((r) => !Number.isFinite(r.s) || !Number.isFinite(r.e) || r.e <= r.s)
      .map((r) => `${r.id} (${r.s}–${r.e})`);
    expect(bad).toEqual([]);
  });

  it("never uses the same id twice", () => {
    // A duplicate would make #d-<id> ambiguous and double-count concurrency.
    const ids = triggers.map(idOf);
    const dupes = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
    expect(dupes, `duplicate data-dynasty: ${dupes.join(", ")}`).toEqual([]);
  });
});

describe("every trigger lands somewhere real", () => {
  it("points at a reference article that exists and has content", () => {
    // linkinator does not resolve same-page fragments, so nothing else in the
    // roster catches a trigger pointing at nothing.
    const broken = triggers
      .map((t) => ({ id: idOf(t), href: attr(t, "href") }))
      .filter(({ href }) => href.startsWith("#"))
      .map(({ id, href }) => ({ id, target: doc.getElementById(href.slice(1)) }))
      .filter(({ target }) => !target || target.querySelectorAll("dd li").length === 0)
      .map(({ id }) => id);
    expect(broken, `triggers with a missing or empty reference article: ${broken}`).toEqual([]);
  });

  it("works without JavaScript, because every trigger is a real link", () => {
    const notLinks = triggers.filter((t) => !t.matches("a[href]")).map(idOf);
    expect(notLinks, `these would be dead with JS off: ${notLinks}`).toEqual([]);
  });
});

describe("the page shows concurrency rather than claiming it", () => {
  it("ships enough genuinely overlapping regimes to make the point", () => {
    let pairs = 0;
    for (let i = 0; i < shipped.length; i += 1) {
      for (let j = i + 1; j < shipped.length; j += 1) {
        if (overlap(shipped[i], shipped[j])) pairs += 1;
      }
    }
    expect(pairs, "the whole argument is that these overlap").toBeGreaterThan(30);
  });

  it("has at least one year with four regimes running at once", () => {
    const years = [...new Set(shipped.map((r) => r.start))];
    const best = Math.max(
      ...years.map((y) => shipped.filter((r) => r.start <= y && y < r.end).length),
    );
    expect(best).toBeGreaterThanOrEqual(4);
  });

  it("never puts two overlapping regimes in the same column of a band", () => {
    // The one layout property that IS in the markup, so it can honestly be
    // checked: the grid column is an inline custom property.
    for (const band of doc.querySelectorAll(".era-tracks")) {
      const cells = [...band.querySelectorAll(".cell")]
        .map((cell) => {
          const t = cell.querySelector("[data-dynasty]");
          const col = /--col:\s*(\d+)/.exec(attr(cell, "style"))?.[1] ?? "";
          return t
            ? { col, id: idOf(t), start: Number(attr(t, "data-start")), end: Number(attr(t, "data-end")) }
            : null;
        })
        .filter((c): c is NonNullable<typeof c> => c !== null);
      for (const a of cells) {
        for (const b of cells) {
          if (a.id >= b.id || a.col !== b.col) continue;
          expect(
            overlap(a, b),
            `${a.id} and ${b.id} share column ${a.col} but ran at the same time`,
          ).toBe(false);
        }
      }
    }
  });

  it("reads chronologically in DOM order, so tab order follows time", () => {
    for (const band of doc.querySelectorAll(".era-tracks")) {
      const starts = [...band.querySelectorAll("[data-dynasty]")].map((t) =>
        Number(attr(t, "data-start")),
      );
      expect(starts, "cells are out of chronological order").toEqual(
        [...starts].sort((a, b) => a - b),
      );
    }
  });

  it("states a thesis the shipped data actually supports", () => {
    // The caption carries real numbers. Recompute them from the page's own
    // attributes so the sentence can never drift from the timeline under it.
    const caption = doc.querySelector(".strip-caption")?.textContent ?? "";
    const claimedPeak = Number(/peak is (\d+)/.exec(caption)?.[1] ?? "0");
    const claimedYears = Number(/([\d,]+) of/.exec(caption)?.[1]?.replace(/,/g, "") ?? "0");

    const bounds = [...new Set(shipped.flatMap((r) => [r.start, r.end]))].sort((a, b) => a - b);
    const countAt = (y: number): number => shipped.filter((r) => r.start <= y && y < r.end).length;
    const realPeak = Math.max(...bounds.map(countAt));
    let realYears = 0;
    for (let i = 0; i < bounds.length - 1; i += 1) {
      if (countAt(bounds[i]) >= 3) realYears += bounds[i + 1] - bounds[i];
    }

    expect(claimedPeak, `caption claims a peak of ${claimedPeak}`).toBe(realPeak);
    expect(claimedYears, `caption claims ${claimedYears} years at 3+`).toBe(realYears);
  });
});

describe("dates a reader can place", () => {
  it("never prints a bare negative year", () => {
    const text = doc.body.textContent ?? "";
    const negatives = text.match(/(?:^|\s)-\d{2,4}\b/g) ?? [];
    expect(negatives, `these read as minus signs, not BC: ${negatives}`).toEqual([]);
  });

  it("says BC or AD wherever a year could be either", () => {
    const bare = triggers
      .filter((t) => !/BC|AD|\d{4}|century/.test(attr(t, "data-years")))
      .map((t) => `${idOf(t)}: "${attr(t, "data-years")}"`);
    expect(bare).toEqual([]);
  });
});

// Carried forward from C2 — each of these caught a real bug there.
describe("static means static", () => {
  it("keeps every script inline, so none can 404 under the Pages base path", () => {
    const withSrc = [...doc.querySelectorAll("script")]
      .filter((s) => s.hasAttribute("src"))
      .map((s) => s.getAttribute("src"));
    expect(withSrc, `external scripts would break the base path: ${withSrc}`).toEqual([]);
  });

  it("references no asset a wrong base path could 404", () => {
    const external = [...doc.querySelectorAll("[src], link[href]")]
      .map((el) => el.getAttribute("src") ?? el.getAttribute("href") ?? "")
      .filter((url) => !/^(https?:|mailto:|tel:|#|data:)/.test(url));
    expect(external, `these would resolve against the base path: ${external}`).toEqual([]);
  });

  it("makes the hidden attribute actually hide things", () => {
    // The UA implements `hidden` as a low-priority display:none that any author
    // `display` rule beats. #score-list is a flex container and #quiz-questions
    // is a block — both ship hidden. This exact bug shipped green in C2.
    const css = [...doc.querySelectorAll("style")].map((s) => s.textContent).join("");
    expect(css.length).toBeGreaterThan(500);
    expect(
      /\[hidden\][^{]*\{[^}]*display:\s*none\s*!important/.test(css),
      "global.css needs `[hidden] { display: none !important }`",
    ).toBe(true);
  });

  it("renders the whole timeline without running a line of JavaScript", () => {
    // jsdom executes no scripts, so everything every test above found is
    // server-rendered HTML. That is the no-JS baseline, asserted.
    expect(doc.querySelectorAll(".era-tracks").length).toBeGreaterThanOrEqual(8);
    expect(doc.querySelectorAll("article[id^='d-']").length).toBeGreaterThan(40);
  });

  it("has no form that would try to reach a server", () => {
    expect([...doc.querySelectorAll("form[action]")]).toEqual([]);
  });
});
