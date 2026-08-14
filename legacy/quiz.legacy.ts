import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";

// The quiz and scoreboard shells, as served. jsdom runs no scripts, so what is
// checkable here is the honest starting state: the controls a no-JS visitor is
// offered, the regions the scripts will fill, and the fact that both start
// empty. The generator itself is tested in spec/quiz-pool.test.ts, which
// evaluates the real source file directly.

const html = readFileSync(resolve("dist/index.html"), "utf8");
const doc = new JSDOM(html).window.document;
const css = [...doc.querySelectorAll("style")].map((s) => s.textContent).join("");

describe("the quiz starts honest", () => {
  it("declares how many questions a round is, in one place", () => {
    const quiz = doc.getElementById("quiz");
    expect(quiz, "expected a #quiz section").not.toBeNull();
    expect(quiz?.getAttribute("data-total")).toBe("10");
  });

  it("says ten in the prose it shows the reader, from that same source", () => {
    // Two copies of "10" is how a round silently becomes eleven questions.
    const total = doc.getElementById("quiz")?.getAttribute("data-total") ?? "";
    const intro = doc.querySelector(".quiz-intro")?.textContent ?? "";
    expect(intro).toContain(total);
  });

  it("ships the question region present and empty", () => {
    const region = doc.querySelector("[data-testid='quiz-questions']");
    expect(region, "expected [data-testid='quiz-questions']").not.toBeNull();
    expect(region?.textContent?.trim()).toBe("");
  });

  it("gives the quiz its own detail slot, so a wrong answer teaches in place", () => {
    const slot = doc.querySelector("[data-testid='quiz-detail']");
    expect(slot, "expected [data-testid='quiz-detail']").not.toBeNull();
    expect(slot?.textContent?.trim()).toBe("");
  });

  it("keeps exactly one dynasty-detail region", () => {
    // spec/assignment-1.test.ts uses querySelector, so a second one would be
    // tolerated as long as the first happened to be empty. Pin the count.
    expect(doc.querySelectorAll("[data-testid='dynasty-detail']").length).toBe(1);
  });

  it("offers the start button only once scripts have run", () => {
    const start = doc.getElementById("quiz-start");
    expect(start?.tagName).toBe("BUTTON");
    expect(start?.getAttribute("type")).toBe("button");
    expect(start?.closest(".js-only"), "the start button must be gated on .js-only").not.toBeNull();
  });

  it("tells a no-JS visitor plainly, rather than showing a dead button", () => {
    const note = doc.querySelector(".quiz-nojs");
    expect(note, "expected a .quiz-nojs note").not.toBeNull();
    expect(note?.hasAttribute("hidden"), "the note must be visible without JS").toBe(false);
    expect(note?.textContent?.trim().length ?? 0).toBeGreaterThan(10);
  });

  it("gates every JS-only control behind a class the script adds", () => {
    expect(/\.js-only\s*\{[^}]*display:\s*none/.test(css), "need `.js-only { display: none }`").toBe(
      true,
    );
    expect(/\.js\s+\.js-only\s*\{/.test(css), "need a `.js .js-only` rule to reveal them").toBe(true);
  });

  it("announces results through a live region", () => {
    expect(doc.getElementById("quiz-status")?.getAttribute("role")).toBe("status");
  });
});

describe("the scoreboard starts empty and says so", () => {
  it("is an ordered list, so rank is conveyed without the numerals", () => {
    const list = doc.getElementById("score-list");
    expect(list?.tagName).toBe("OL");
  });

  it("ships the list hidden with nothing in it", () => {
    const list = doc.getElementById("score-list");
    expect(list?.hasAttribute("hidden"), "the list must start hidden").toBe(true);
    expect(list?.children.length).toBe(0);
  });

  it("shows the empty state instead, and makes it focusable", () => {
    const empty = doc.getElementById("score-empty");
    expect(empty, "expected #score-empty").not.toBeNull();
    expect(empty?.hasAttribute("hidden"), "the empty state is what you should see first").toBe(false);
    // Clearing the board destroys whatever had focus inside it; focus has to
    // land somewhere deliberate rather than falling to <body>.
    expect(empty?.getAttribute("tabindex")).toBe("-1");
  });

  it("gates the clear button on scripts too", () => {
    const clear = doc.getElementById("score-clear");
    expect(clear?.tagName).toBe("BUTTON");
    expect(clear?.closest(".js-only")).not.toBeNull();
  });

  it("announces saves and clears through a live region", () => {
    expect(doc.getElementById("score-status")?.getAttribute("role")).toBe("status");
  });
});
