import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";
import { beforeAll, describe, expect, it } from "vitest";
import { windowsReleases } from "../src/data/windows";
import {
  countRelearnMoves,
  countRelearnPlaces,
  getNextRelearnMove,
  getRelearnRun,
  relearnSteps,
} from "../src/data/windows-relearn";

const pages = new Map<string, Document>();

beforeAll(() => {
  for (const release of windowsReleases) {
    const html = readFileSync(resolve("dist", release.slug, "index.html"), "utf8");
    pages.set(release.slug, new JSDOM(html).window.document);
  }
});

describe("the relearning test", () => {
  // The mechanic is worthless if the desktop has no answer in it, or more than
  // one. Asserted on every built page rather than a sample, because each era's
  // recreation tags a different element by hand.
  it("puts exactly one answer inside the desktop on every release page", () => {
    for (const release of windowsReleases) {
      const doc = pages.get(release.slug)!;
      const desktop = doc.querySelector("[data-desktop]");
      expect(desktop, release.slug).not.toBeNull();
      expect(desktop!.querySelectorAll("[data-relearn-target]"), release.slug).toHaveLength(1);
      expect(doc.querySelectorAll("[data-relearn-target]"), `${release.slug}: target outside the desktop`).toHaveLength(1);
    }
  });

  // Same reasoning as the adoption figure: no script runs here, so this is
  // what a visitor with JavaScript off actually reads. A challenge they cannot
  // take must still tell them the answer rather than leaving a blank card.
  it("states the answer in the markup before any script runs", () => {
    const doc = pages.get("windows-95")!;
    const answer = doc.querySelector("[data-relearn-answer]");
    expect(answer?.hasAttribute("hidden")).toBe(false);
    expect(answer?.textContent).toContain("the Start button");
    expect(doc.querySelector("[data-relearn-ask]")?.hasAttribute("hidden")).toBe(true);
    expect(doc.querySelector("[data-relearn-reveal]")?.hasAttribute("hidden")).toBe(true);
  });

  it("announces its verdict through a polite live region that does not steal focus", () => {
    const status = pages.get("windows-95")!.querySelector("[data-relearn-status]");
    expect(status?.getAttribute("role")).toBe("status");
    expect(status?.getAttribute("aria-live")).toBe("polite");
    expect(status?.hasAttribute("tabindex")).toBe(false);
  });

  // Literal fixtures, stated from outside the data file. Counting places by
  // asking the data how many places it has would only prove it is
  // self-consistent; these are the answers Microsoft actually shipped.
  it("knows where each answer lived", () => {
    const place = (id: string) => relearnSteps.find((step) => step.id === id)?.place;
    expect(place("win1")).toBe("the MS-DOS Executive file list");
    expect(place("win3")).toBe("a Program Manager group");
    expect(place("win95")).toBe("the Start button");
    expect(place("win8")).toBe("the full-screen Start screen");
    expect(place("win11")).toBe("the centred Start button");
  });

  it("counts eight distinct places and seven moves across the twelve releases", () => {
    expect(relearnSteps).toHaveLength(12);
    expect(countRelearnPlaces()).toBe(8);
    expect(countRelearnMoves()).toBe(7);
  });

  // Windows 1.0 and 2.0 shipped the same launcher, and 95/98/2000 all shipped
  // the Start menu. If a later edit splits those apart the headline number
  // changes, and the sentence on every page changes with it.
  it("treats releases that did not move the answer as the same place", () => {
    const index = (id: string) => relearnSteps.find((step) => step.id === id)?.placeIndex;
    expect(index("win1")).toBe(index("win2"));
    expect(index("win95")).toBe(index("win98"));
    expect(index("win95")).toBe(index("win2000"));
    expect(index("vista")).toBe(index("win7"));
    expect(index("win7")).not.toBe(index("win8"));
    expect(index("win10")).not.toBe(index("win11"));
  });

  it("explains how long a learned place survives and where it moves next", () => {
    expect(getRelearnRun("win95").map((step) => step.id)).toEqual(["win95", "win98", "win2000"]);
    expect(getNextRelearnMove("win95")?.id).toBe("winxp");
    expect(getRelearnRun("win8").map((step) => step.id)).toEqual(["win8"]);
    expect(getNextRelearnMove("win11")).toBeUndefined();
  });

  it("renders the headline count that the data derives", () => {
    expect(pages.get("windows-95")!.querySelector("[data-relearn-lede]")?.textContent).toContain("7 times");
  });
});
