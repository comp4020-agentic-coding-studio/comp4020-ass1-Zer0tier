import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";
import { beforeAll, describe, expect, it } from "vitest";
import { windowsReleases } from "../src/data/windows";
import { getHistoryBook, historyBooks } from "../src/data/windows-history-book";
import { detailNotes } from "../src/data/windows-detail";

const pages = new Map<string, Document>();

beforeAll(() => {
  for (const release of windowsReleases) {
    pages.set(release.id, new JSDOM(readFileSync(resolve("dist", release.slug, "index.html"), "utf8")).window.document);
  }
});

describe("the history book", () => {
  it("gives every release six pages", () => {
    expect(historyBooks).toHaveLength(12);
    for (const release of windowsReleases) {
      const book = getHistoryBook(release.id);
      expect(book.pages, `${release.id}`).toHaveLength(6);
      expect(book.source.url, `${release.id}`).toMatch(/^https:\/\//);
    }
    expect(new Set(historyBooks.map((book) => book.release)).size, "duplicate books").toBe(12);
  });

  it("writes six different pages rather than six variations of one", () => {
    for (const release of windowsReleases) {
      const book = getHistoryBook(release.id);
      const titles = book.pages.map((page) => page.title);
      const bodies = book.pages.map((page) => page.body);
      expect(new Set(titles).size, `${release.id}: repeated titles`).toBe(6);
      expect(new Set(bodies).size, `${release.id}: repeated bodies`).toBe(6);
      for (const page of book.pages) {
        expect(page.title.trim().length, `${release.id}`).toBeGreaterThan(0);
        // Long enough to be a page of a book rather than a caption.
        expect(page.body.trim().length, `${release.id}/${page.title}: too short to be a page`).toBeGreaterThan(120);
      }
    }
  });

  // Same contract as the adoption figure and the app cards: what the markup
  // says is what a visitor with no JavaScript reads. A book that renders empty
  // and fills itself in would be six blank pages to them.
  it("ships all six pages readable, with the controls off, before any script runs", () => {
    for (const release of windowsReleases) {
      const doc = pages.get(release.id)!;
      const leaves = [...doc.querySelectorAll("[data-book-page]")];
      expect(leaves, `${release.slug}`).toHaveLength(6);

      for (const leaf of leaves) {
        expect(leaf.hasAttribute("hidden"), `${release.slug}: page hidden with no script`).toBe(false);
        expect(leaf.querySelector("h3")?.textContent?.trim().length, `${release.slug}`).toBeGreaterThan(0);
        expect(leaf.querySelector("p")?.textContent?.trim().length, `${release.slug}`).toBeGreaterThan(50);
      }

      // The controls only mean anything once the script can act on them.
      expect(doc.querySelector("[data-book-controls]")?.hasAttribute("hidden"), `${release.slug}`).toBe(true);
      expect(doc.querySelector("[data-book]")?.getAttribute("data-book-spreads"), `${release.slug}`).toBe("3");
    }
  });

  it("announces the page count politely and names both keys", () => {
    const doc = pages.get("win95")!;
    const progress = doc.querySelector("[data-book-progress]");
    expect(progress?.getAttribute("role")).toBe("status");
    expect(progress?.getAttribute("aria-live")).toBe("polite");
    // The keys have to be visible somewhere; a shortcut nobody can see is not
    // a control, and there is no way to press Q on a phone.
    expect(doc.querySelector("[data-book-previous]")?.textContent).toContain("Q");
    expect(doc.querySelector("[data-book-next]")?.textContent).toContain("E");
  });

  it("sits below the adoption milestone, where it was asked for", () => {
    for (const release of windowsReleases) {
      const doc = pages.get(release.id)!;
      const sections = [...doc.querySelectorAll("main > section")].map((section) => section.className.split(" ")[0]);
      const adoption = sections.indexOf("release-adoption");
      const history = sections.indexOf("history");
      expect(adoption, `${release.slug}: no adoption section`).toBeGreaterThan(-1);
      expect(history, `${release.slug}: no history section`).toBeGreaterThan(-1);
      expect(history, `${release.slug}: history is not directly below adoption`).toBe(adoption + 1);
    }
  });

  // The book and the system notes sit on the same page, so prose that drifts
  // between them is read twice. Eight pages were near-verbatim restatements of
  // a note when this was first written — the worst shared ten consecutive
  // eight-word phrases. Shingling is crude, and crude is what catches
  // copy-paste; two shared phrases is incidental, three is a rewrite.
  it("does not say the same thing as the system notes on the same page", () => {
    const normalise = (text: string) => text.toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
    const phrases = (text: string) => {
      const words = normalise(text).split(" ");
      const set = new Set<string>();
      for (let i = 0; i + 8 <= words.length; i += 1) set.add(words.slice(i, i + 8).join(" "));
      return set;
    };

    for (const book of historyBooks) {
      for (const page of book.pages) {
        const pagePhrases = phrases(page.body);
        for (const note of detailNotes.filter((item) => item.release === book.release)) {
          const shared = [...pagePhrases].filter((phrase) => phrases(note.long).has(phrase)).length;
          expect(shared, `${book.release}: "${page.title}" restates the ${note.facet} note`).toBeLessThan(3);
        }
      }
    }
  });

  // Literal fixtures from outside the data file.
  it("tells the story each release is actually known for", () => {
    expect(getHistoryBook("win95").pages[1].body).toContain("24 August 1995");
    expect(getHistoryBook("win95").pages[1].body).toContain("Start Me Up");
    expect(getHistoryBook("win98").pages[2].title).toContain("Comdex");
    expect(getHistoryBook("winxp").pages[4].title).toContain("Service Pack 2");
    expect(getHistoryBook("win8").pages[4].title).toBe("8.1");
    expect(getHistoryBook("vista").pages[0].body).toContain("WinFS");
    expect(getHistoryBook("win11").pages[2].title).toBe("TPM 2.0");
    expect(getHistoryBook("win8").pages[2].body).toContain("Sinofsky");
    expect(getHistoryBook("win10").pages[2].body).toContain("Insider");
  });
});
