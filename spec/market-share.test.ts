import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";
import { beforeAll, describe, expect, it } from "vitest";
import { windowsReleases } from "../src/data/windows";
import { getMarketShare, marketShares } from "../src/data/windows-market-share";

const pages = new Map<string, Document>();

beforeAll(() => {
  for (const release of windowsReleases) {
    pages.set(release.id, new JSDOM(readFileSync(resolve("dist", release.slug, "index.html"), "utf8")).window.document);
  }
});

describe("share of desktops, beside the adoption figure", () => {
  it("has an entry for every release and no duplicates", () => {
    expect(marketShares).toHaveLength(12);
    expect(new Set(marketShares.map((item) => item.release)).size).toBe(12);
    for (const release of windowsReleases) {
      expect(() => getMarketShare(release.id), release.id).not.toThrow();
    }
  });

  // The whole point of the "measured" flag is that six releases predate the
  // measurement. An entry that claims a figure must carry everything needed to
  // check it; an entry that does not must carry no figure at all, rather than
  // a number with a shrug attached.
  it("either cites a figure properly or carries none", () => {
    for (const entry of marketShares) {
      expect(entry.note.trim().length, `${entry.release}: no explanation`).toBeGreaterThan(60);

      if (entry.measured) {
        expect(entry.display, `${entry.release}`).toMatch(/%$/);
        expect(entry.when?.trim().length, `${entry.release}: no date`).toBeGreaterThan(0);
        expect(entry.basis?.trim().length, `${entry.release}: no basis`).toBeGreaterThan(0);
        expect(entry.source?.url, `${entry.release}`).toMatch(/^https:\/\//);
        expect(entry.source?.label.trim().length, `${entry.release}`).toBeGreaterThan(0);
      } else {
        expect(entry.display, `${entry.release}: unmeasured but has a figure`).toBeUndefined();
        expect(entry.source, `${entry.release}: unmeasured but cites a source`).toBeUndefined();
      }
    }
  });

  // Six releases shipped before per-version desktop share was measured at all.
  // If that count ever changes, someone has either found a real source or
  // invented one, and both are worth stopping for.
  it("marks exactly the six pre-measurement releases as unmeasured", () => {
    const unmeasured = marketShares.filter((entry) => !entry.measured).map((entry) => entry.release);
    expect(unmeasured).toEqual(["win1", "win2", "win3", "win95", "win98", "win2000"]);
  });

  it("states its basis on the page, because the sources do not share one", () => {
    // StatCounter's Windows-version chart is a share of Windows desktops; its
    // desktop-OS chart is a share of every desktop. Showing a bare percentage
    // would invite a comparison the numbers do not support.
    expect(getMarketShare("win7").basis).toBe("of desktop computers worldwide");
    expect(getMarketShare("win10").basis).toBe("of Windows desktops");
    expect(getMarketShare("win10").note).toContain("different basis");
  });

  it("renders the figure, or the absence of one, on every release page", () => {
    for (const release of windowsReleases) {
      const doc = pages.get(release.id)!;
      // The measured flag lives on the track (which styles the bar) while the
      // figure is its sibling in the same grid row, so these are queried from
      // the document rather than from inside one another.
      const track = doc.querySelector("[data-market-share]");
      const entry = getMarketShare(release.id);

      expect(track, `${release.slug}: no share track`).not.toBeNull();
      expect(track!.getAttribute("data-market-measured"), release.slug).toBe(String(entry.measured));
      expect(track!.querySelector("[data-market-meter]"), `${release.slug}: no share bar`).not.toBeNull();

      const value = doc.querySelector("[data-market-value]")?.textContent?.trim();
      expect(value, `${release.slug}`).toBe(entry.measured ? entry.display : "—");
      expect(doc.querySelector("[data-market-note]")?.textContent?.trim(), release.slug).toBe(entry.note);
    }
  });

  it("keeps the adoption figure's own source alongside the share's", () => {
    const doc = pages.get("win7")!;
    const links = [...doc.querySelectorAll(".release-adoption-detail a")].map((a) => a.textContent?.trim());
    expect(links.some((text) => text?.startsWith("Source:")), "the reach source went missing").toBe(true);
    expect(links.some((text) => text?.startsWith("Share source:")), "the share source is missing").toBe(true);
  });

  // Literal fixtures, from outside the data file.
  it("knows the numbers it is quoting", () => {
    expect(getMarketShare("win7").display).toBe("55.75%");
    expect(getMarketShare("win7").when).toBe("November 2014");
    expect(getMarketShare("win10").display).toBe("79.79%");
    expect(getMarketShare("win8").display).toBe("8.02%");
    expect(getMarketShare("win8").source?.label).toContain("Net Applications");
    expect(getMarketShare("win1").measured).toBe(false);
  });
});

describe("both figures carry a bar", () => {
  it("gives the reach figure and the share figure a meter each, on every release", () => {
    for (const release of windowsReleases) {
      const doc = pages.get(release.id)!;
      const meters = doc.querySelectorAll(".release-adoption .release-adoption-meter");
      expect(meters, `${release.slug}: expected two bars`).toHaveLength(2);
      expect(doc.querySelector("[data-adoption-meter]"), `${release.slug}: no reach fill`).not.toBeNull();
      expect(doc.querySelector("[data-market-meter]"), `${release.slug}: no share fill`).not.toBeNull();
    }
  });

  // The two bars are not on the same scale and must not pretend to be: copies
  // shipped run from 500K to 1.5B and need a log axis, share is a plain
  // percentage. Both say so next to themselves.
  it("labels the scale each bar is drawn on", () => {
    const captions = [...pages.get("win7")!.querySelectorAll(".adoption-caption")].map((p) => p.textContent?.trim());
    expect(captions).toHaveLength(2);
    expect(captions[0], "the reach bar does not admit its log scale").toContain("log scale");
    expect(captions[1], "the share bar does not state its basis").toContain("of desktop computers worldwide");
  });

  it("scales the share bar from the number it displays", () => {
    for (const release of windowsReleases) {
      const doc = pages.get(release.id)!;
      const style = doc.querySelector(".release-adoption")!.getAttribute("style") ?? "";
      const entry = getMarketShare(release.id);
      const expected = entry.measured && entry.percent !== undefined ? entry.percent / 100 : 0;
      expect(style, `${release.slug}`).toContain(`--market-scale:${expected}`);
    }
  });
});
