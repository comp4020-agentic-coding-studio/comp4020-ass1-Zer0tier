import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";
import { beforeAll, describe, expect, it } from "vitest";
import { windowsReleases } from "../src/data/windows";
import { detailFacets, detailNotes, getDetailNote } from "../src/data/windows-detail";

const pages = new Map<string, Document>();

beforeAll(() => {
  for (const release of windowsReleases) {
    pages.set(release.id, new JSDOM(readFileSync(resolve("dist", release.slug, "index.html"), "utf8")).window.document);
  }
});

describe("the long form of What this interface changed", () => {
  it("has a note for all four cards on all twelve releases", () => {
    expect(detailFacets).toHaveLength(4);
    expect(detailNotes).toHaveLength(48);

    for (const release of windowsReleases) {
      for (const { facet } of detailFacets) {
        // getDetailNote throws rather than returning undefined, so a missing
        // note fails the build; this names which one before it gets there.
        expect(() => getDetailNote(release.id, facet), `${release.id}/${facet}`).not.toThrow();
      }
    }

    const keys = detailNotes.map((note) => `${note.release}/${note.facet}`);
    expect(new Set(keys).size, "duplicate notes").toBe(48);
  });

  it("says more than the card it opens from", () => {
    for (const release of windowsReleases) {
      for (const { facet } of detailFacets) {
        const note = getDetailNote(release.id, facet);
        const short = release[facet];
        // The whole point of the control is that pressing it is worth it.
        expect(note.long.length, `${release.id}/${facet}: not longer than the card`).toBeGreaterThan(short.length * 2);
        expect(note.long, `${release.id}/${facet}: repeats the card verbatim`).not.toBe(short);
        expect(note.source.url, `${release.id}/${facet}`).toMatch(/^https:\/\//);
        expect(note.source.label.trim().length, `${release.id}/${facet}`).toBeGreaterThan(0);
      }
    }
  });

  it("wires all four cards on every release page to a dialog that exists", () => {
    for (const release of windowsReleases) {
      const doc = pages.get(release.id)!;
      const dialog = doc.querySelector("[data-detail-dialog]");
      expect(dialog, `${release.slug}: no detail dialog`).not.toBeNull();

      const triggers = [...doc.querySelectorAll<HTMLButtonElement>("[data-detail-open]")];
      expect(triggers, `${release.slug}`).toHaveLength(4);

      triggers.forEach((trigger, index) => {
        const where = `${release.slug}/${detailFacets[index].facet}`;
        expect(trigger.tagName, `${where}: must be a real button`).toBe("BUTTON");
        expect(trigger.getAttribute("type"), where).toBe("button");
        expect(trigger.getAttribute("aria-haspopup"), where).toBe("dialog");
        expect(trigger.getAttribute("aria-controls"), where).toBe(dialog!.id);
        expect(doc.getElementById(trigger.getAttribute("aria-controls")!), `${where}: aria-controls dangles`).not.toBeNull();

        expect(trigger.dataset.detailNumber, where).toBe(detailFacets[index].number);
        expect(trigger.dataset.detailHeading, where).toBe(detailFacets[index].heading);
        for (const key of ["detailShort", "detailLong", "detailSourceLabel", "detailSourceUrl"]) {
          expect(trigger.dataset[key]?.trim().length, `${where}: empty data-${key}`).toBeGreaterThan(0);
        }
        expect(trigger.dataset.detailLong, `${where}: card and dialog disagree`).toBe(getDetailNote(release.id, detailFacets[index].facet).long);
      });
    }
  });

  // With no script the cards are still the four one-liners they always were,
  // so nothing is hidden behind an interaction that may not run.
  it("leaves the short version readable with no script", () => {
    for (const release of windowsReleases) {
      const cards = [...pages.get(release.id)!.querySelectorAll(".detail-grid article > p")];
      expect(cards, release.slug).toHaveLength(4);
      for (const card of cards) {
        expect(card.textContent?.trim().length, `${release.slug}: empty card`).toBeGreaterThan(20);
      }
    }
  });

  // Literal fixtures, from outside the data file: these are the specific facts
  // the long version exists to carry.
  it("carries the dates and names the one-liners drop", () => {
    expect(getDetailNote("win95", "signature").long).toContain("24 August 1995");
    expect(getDetailNote("win3", "tradeoff").long).toContain("cooperative");
    expect(getDetailNote("winxp", "tradeoff").long).toContain("Blaster");
    expect(getDetailNote("win8", "tradeoff").long).toContain("8.1");
    expect(getDetailNote("win11", "tradeoff").long).toContain("TPM 2.0");
    expect(getDetailNote("win2", "signature").long).toContain("Apple");
  });
});
