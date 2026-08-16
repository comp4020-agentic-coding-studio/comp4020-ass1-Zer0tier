import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";
import { windowsReleases } from "../src/data/windows";
import { appSlug, windowsMemoryScenes } from "../src/data/windows-memories";
import { appStories } from "../src/data/windows-apps";

const pairs = windowsReleases.flatMap((release) =>
  windowsMemoryScenes[release.id].applications.map((application) => ({
    release,
    application,
    slug: appSlug(application.name),
  })),
);

const docFor = (releaseSlug: string, slug: string) =>
  new JSDOM(readFileSync(resolve("dist", releaseSlug, "apps", slug, "index.html"), "utf8")).window.document;

describe("the app pages", () => {
  it("covers all forty-eight apps with no orphans in either direction", () => {
    expect(pairs).toHaveLength(48);
    expect(appStories).toHaveLength(48);

    const built = new Set(pairs.map(({ release, slug }) => `${release.id}/${slug}`));
    const written = new Set(appStories.map((story) => `${story.release}/${story.slug}`));

    // Both directions on purpose. A story with no card is dead content; a card
    // with no story throws at build time, but this names it rather than
    // leaving a stack trace to read.
    expect([...built].filter((key) => !written.has(key)), "cards with no story").toEqual([]);
    expect([...written].filter((key) => !built.has(key)), "stories with no card").toEqual([]);
  });

  it("builds a page for every card", () => {
    for (const { release, slug } of pairs) {
      const path = resolve("dist", release.slug, "apps", slug, "index.html");
      expect(existsSync(path), `${release.slug}/apps/${slug}/ was not built`).toBe(true);
    }
  });

  it("links every card to the page that exists for it", () => {
    for (const release of windowsReleases) {
      const doc = new JSDOM(readFileSync(resolve("dist", release.slug, "index.html"), "utf8")).window.document;
      const links = [...doc.querySelectorAll<HTMLAnchorElement>(".memory-app-link")];
      expect(links, `${release.slug}: expected four linked app cards`).toHaveLength(4);

      for (const link of links) {
        const href = link.getAttribute("href")!;
        expect(link.textContent?.trim().length, `${release.slug}: empty link text`).toBeGreaterThan(0);

        // Resolved the way a browser on the deployed URL would, then followed
        // to a real file. This is the assertion that would catch a base-path
        // mistake — the failure mode that looks perfect locally and 404s on
        // Pages — as well as a card pointing at a page that was never built.
        const resolved = new URL(href, `https://example.test/comp4020-ass1-Zer0tier/${release.slug}/`).pathname;
        const withinSite = resolved.replace(/^\/comp4020-ass1-Zer0tier\//, "");
        expect(withinSite, `${release.slug}: ${href} escaped the site root`).not.toMatch(/^\//);
        expect(withinSite, `${release.slug}: ${href} is not an app link`).toMatch(/^[^/]+\/apps\/[^/]+\/$/);
        expect(
          existsSync(resolve("dist", withinSite, "index.html")),
          `${release.slug}: ${href} resolves to ${withinSite}, which was not built`,
        ).toBe(true);
      }
    }
  });

  // Every claim about a real product carries a reference, per CLAUDE.md. The
  // URLs themselves were checked with curl before they were committed; this
  // asserts none of them goes missing later.
  it("cites a working-looking reference on every page", () => {
    for (const { release, slug } of pairs) {
      const source = docFor(release.slug, slug).querySelector<HTMLAnchorElement>(".app-source a");
      expect(source, `${release.slug}/${slug}: no reference`).not.toBeNull();
      expect(source!.getAttribute("href"), `${release.slug}/${slug}`).toMatch(/^https:\/\//);
      expect(source!.getAttribute("rel"), `${release.slug}/${slug}`).toBe("noreferrer");
      expect(source!.textContent?.trim().length).toBeGreaterThan(0);
    }
  });

  it("gives every page both halves of the argument and a route home", () => {
    for (const { release, slug } of pairs) {
      const doc = docFor(release.slug, slug);
      expect(doc.querySelector("#why-heading")?.textContent, `${release.slug}/${slug}`).toBe("Why it took over");
      expect(doc.querySelector("#relearn-heading")?.textContent, `${release.slug}/${slug}`).toBe("What it left behind");
      expect(doc.querySelector("h1")?.textContent?.trim().length, `${release.slug}/${slug}`).toBeGreaterThan(0);
      const backHome = [...doc.querySelectorAll("a")].some((a) => (a.getAttribute("href") ?? "").endsWith(`${release.slug}/`));
      expect(backHome, `${release.slug}/${slug}: no link back to the release`).toBe(true);
    }
  });

  // Literal fixtures. The mechanism of adoption is the point of these pages,
  // so a couple of them are pinned from outside the data file.
  it("says why the ones that matter most spread", () => {
    const story = (release: string, slug: string) => appStories.find((s) => s.release === release && s.slug === slug)!;
    expect(story("win3", "solitaire").why).toContain("teach the mouse");
    expect(story("vista", "microsoft-word-2007").why).toContain("Ribbon");
    expect(story("win98", "internet-explorer-5").why).toContain("antitrust");
    expect(story("win8", "windows-store").relearn).toContain(".exe");
  });
});
