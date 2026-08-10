import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";

// Assignment 1, "an interactive explainer": these hold the mechanically
// checkable half of the spec.
//
// - "deployed and live", "static/client-side, invariants pass" are already
//   covered by invariants.test.ts and CI's deploy/online check.
// - "evidence of process in the repo" is covered by `pnpm check:evidence`.
// - "works at both marking viewports" and "one strong idea, nothing else" are
//   judged by a person: jsdom computes no layout, and "strong idea" isn't a
//   thing a test can hold. Render the built site and measure it at 1920x1080
//   and 390x844 before believing it — don't fake that coverage here.
//
// What's left, and what these tests assert: "the visitor does something that
// changes what they see" — my topic is the dynasties of ancient China, and the
// interaction is clicking a dynasty to see the weapons/inventions/artefacts
// from that period. The contract below is topic-agnostic where it can be:
// - every dynasty has its own clickable, focusable trigger (`[data-dynasty]`)
// - every trigger carries its own content already in the markup — a static
//   site can't fetch it, and jsdom can't run the click handler that would
//   otherwise reveal it
// - a single detail region exists to show it, and starts empty so the page is
//   honest before any click

const html = readFileSync(resolve("dist/index.html"), "utf8");
const home = new JSDOM(html).window.document;

describe("assignment 1: dynasty explainer interaction", () => {
  it("gives every dynasty its own trigger", () => {
    const dynasties = [...home.querySelectorAll("[data-dynasty]")];
    expect(
      dynasties.length,
      "expected one [data-dynasty] element per period on the timeline",
    ).toBeGreaterThan(10);
  });

  it("makes every trigger reachable by keyboard, not just a mouse", () => {
    const dynasties = [...home.querySelectorAll("[data-dynasty]")];
    const unreachable = dynasties.filter(
      (d) => !d.matches("button, a[href], [tabindex]"),
    );
    expect(
      unreachable.map((d) => d.getAttribute("data-dynasty")),
      "every trigger needs to be a button, a link, or carry a tabindex",
    ).toEqual([]);
  });

  it("ships each dynasty's content in the page, not behind a fetch", () => {
    const dynasties = [...home.querySelectorAll("[data-dynasty]")];
    const empty = dynasties.filter(
      (d) => !(d.getAttribute("data-detail") ?? "").trim(),
    );
    expect(
      empty.map((d) => d.getAttribute("data-dynasty")),
      "every trigger needs a data-detail attribute describing what that dynasty is known for",
    ).toEqual([]);
  });

  it("has one place to show the detail, and it starts empty", () => {
    const detail = home.querySelector("[data-testid='dynasty-detail']");
    expect(detail, "expected a [data-testid='dynasty-detail'] element to reveal the click").not.toBeNull();
    expect(
      detail?.textContent?.trim(),
      "the detail panel should start empty — nothing has been clicked yet",
    ).toBe("");
  });
});
