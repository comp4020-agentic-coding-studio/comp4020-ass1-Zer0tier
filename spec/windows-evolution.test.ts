import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";

const versions = ["windows-1", "windows-2", "windows-3", "windows-95", "windows-98", "windows-2000", "windows-xp", "windows-vista", "windows-7", "windows-8", "windows-10", "windows-11"];
const homeHtml = readFileSync(resolve("dist/index.html"), "utf8");
const home = new JSDOM(homeHtml).window.document;

describe("Windows Desktop Evolution", () => {
  it("ships a separate static page for every major release", () => {
    for (const version of versions) expect(existsSync(resolve("dist", version, "index.html")), version).toBe(true);
  });

  it("places all twelve releases in the scroll-controlled homepage timeline", () => {
    const scenes = [...home.querySelectorAll<HTMLElement>("[data-timeline-scene]")];
    expect(scenes).toHaveLength(versions.length);
    expect(scenes.every((scene, index) => scene.getAttribute("data-href")?.endsWith(`/${versions[index]}/`))).toBe(true);
    expect(home.querySelector("[data-timeline-enter]")?.getAttribute("href")?.endsWith("/windows-1/")).toBe(true);
  });

  it("renders a period-specific system recreation on every release page", () => {
    for (const version of versions) {
      const html = readFileSync(resolve("dist", version, "index.html"), "utf8");
      const doc = new JSDOM(html).window.document;
      expect(doc.querySelector(".desktop"), version).not.toBeNull();
      expect(doc.querySelector(".release-details"), version).not.toBeNull();
      expect(doc.querySelector("[data-startup-sound]"), version).not.toBeNull();
      expect(doc.querySelector("nav.version-nav"), version).not.toBeNull();
    }
  });

  it("gives every release page its own full-page theme and system cursor", () => {
    const themeIds = ["win1", "win2", "win3", "win95", "win98", "win2000", "winxp", "vista", "win7", "win8", "win10", "win11"];
    for (const [index, version] of versions.entries()) {
      const html = readFileSync(resolve("dist", version, "index.html"), "utf8");
      const doc = new JSDOM(html).window.document;
      expect(doc.body.classList.contains(`page-${themeIds[index]}`), version).toBe(true);
      expect(html, version).toContain(`.page-${themeIds[index]}`);
      expect(html, version).toContain("--system-cursor:");
    }
  });

  it("keeps system controls keyboard reachable", () => {
    for (const version of versions) {
      const html = readFileSync(resolve("dist", version, "index.html"), "utf8");
      const doc = new JSDOM(html).window.document;
      const controls = [...doc.querySelectorAll(".desktop button")];
      expect(controls.length, version).toBeGreaterThan(0);
      expect(controls.every((control) => control.getAttribute("type") === "button"), version).toBe(true);
    }
  });

  it("contains no Chinese text in the generated experience", () => {
    const pages = [resolve("dist/index.html"), ...versions.map((version) => resolve("dist", version, "index.html"))];
    for (const page of pages) expect(readFileSync(page, "utf8"), page).not.toMatch(/\p{Script=Han}/u);
  });

  it("includes a sourced story and named contributors on every release page", () => {
    for (const version of versions) {
      const html = readFileSync(resolve("dist", version, "index.html"), "utf8");
      const doc = new JSDOM(html).window.document;
      const story = doc.querySelector(".release-story");
      const contributors = [...doc.querySelectorAll(".contributor-card")];

      expect(story?.querySelector("h2")?.textContent?.trim(), version).toBeTruthy();
      expect(story?.querySelector('a[target="_blank"]')?.getAttribute("href"), version).toMatch(/^https:\/\//);
      expect(contributors.length, version).toBeGreaterThanOrEqual(2);
      expect(contributors.every((card) => card.querySelector("img")?.getAttribute("alt")?.startsWith("Portrait of ")), version).toBe(true);
      expect(contributors.every((card) => card.querySelector("h3")?.textContent?.trim()), version).toBe(true);
    }
  });
});
