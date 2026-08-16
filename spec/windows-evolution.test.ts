import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";

const versions = ["windows-1", "windows-2", "windows-3", "windows-95", "windows-98", "windows-2000", "windows-xp", "windows-vista", "windows-7", "windows-8", "windows-10", "windows-11"];
const homeHtml = readFileSync(resolve("dist/index.html"), "utf8");
const home = new JSDOM(homeHtml).window.document;
const globalStyles = readFileSync(resolve("src/styles/global.css"), "utf8");
const releasePages = new Map(versions.map((version) => {
  const html = readFileSync(resolve("dist", version, "index.html"), "utf8");
  return [version, { html, doc: new JSDOM(html).window.document }] as const;
}));

describe("Windows Desktop Evolution", () => {
  it("ships a separate static page for every major release", () => {
    for (const version of versions) expect(existsSync(resolve("dist", version, "index.html")), version).toBe(true);
  });

  it("places all twelve releases in the scroll-controlled homepage timeline", () => {
    const scenes = [...home.querySelectorAll<HTMLElement>("[data-timeline-scene]")];
    expect(scenes).toHaveLength(versions.length);
    expect(scenes.every((scene, index) => scene.getAttribute("data-href")?.endsWith(`/${versions[index]}/`))).toBe(true);
    expect(home.querySelector("[data-timeline-enter]")?.getAttribute("href")?.endsWith("/windows-1/")).toBe(true);
    expect(home.querySelector(".timeline-window")).not.toBeNull();
    expect(home.querySelector(".timeline-system-preview")).not.toBeNull();
  });

  it("gives the homepage progress rail a complete theme for every selected Windows era", () => {
    const themeIds = ["win1", "win2", "win3", "win95", "win98", "win2000", "winxp", "vista", "win7", "win8", "win10", "win11"];
    for (const id of themeIds) {
      const theme = globalStyles.match(new RegExp(`\\.home-page\\[data-entry-version="${id}"\\] \\.timeline-selector \\{([^}]+)\\}`));
      expect(theme, id).not.toBeNull();
      expect(theme?.[1], id).toContain("--selector-active-surface");
      expect(theme?.[1], id).toContain("--selector-accent");
      expect(theme?.[1], id).toContain("--selector-font");
    }
  });

  it("renders a period-specific system recreation on every release page", () => {
    for (const version of versions) {
      const { doc } = releasePages.get(version)!;
      expect(doc.querySelector(".desktop"), version).not.toBeNull();
      expect(doc.querySelector(".release-details"), version).not.toBeNull();
      expect(doc.querySelector("[data-startup-sound]"), version).not.toBeNull();
      expect(doc.querySelector("nav.version-nav"), version).not.toBeNull();
      expect(doc.querySelector("[data-adoption-milestone]"), version).not.toBeNull();
      expect(doc.querySelector("[data-adoption-milestone] a[target=\"_blank\"]")?.getAttribute("href"), version).toMatch(/^https:\/\//);
    }
  });

  it("builds a four-application background scene with four accessible time-capsule memories for every release", () => {
    for (const version of versions) {
      const { doc } = releasePages.get(version)!;
      const scene = doc.querySelector("[data-memory-scene]");
      const applications = [...doc.querySelectorAll(".memory-app-window")];
      const appIcons = [...doc.querySelectorAll(".memory-app-icon")];
      const appDescriptions = [...doc.querySelectorAll(".memory-app-copy > p")];
      const bubbles = [...doc.querySelectorAll<HTMLButtonElement>("[data-memory-bubble]")];

      expect(scene, version).not.toBeNull();
      expect(applications, version).toHaveLength(4);
      expect(appIcons, version).toHaveLength(4);
      expect(appIcons.every((icon) => icon.tagName === "IMG" && /\/media\/app-icons\/.+\.(?:png|svg)$/.test(icon.getAttribute("src") || "")), version).toBe(true);
      for (const icon of appIcons) {
        const source = icon.getAttribute("src") || "";
        const mediaPath = source.slice(source.indexOf("media/app-icons/"));
        expect(existsSync(resolve("public", mediaPath)), `${version}: ${source}`).toBe(true);
      }
      expect(appDescriptions, version).toHaveLength(4);
      expect(appDescriptions.every((description) => (description.textContent?.trim().length || 0) > 35), version).toBe(true);
      expect(bubbles, version).toHaveLength(4);
      expect(bubbles.every((bubble) => bubble.type === "button" && bubble.getAttribute("aria-haspopup") === "dialog"), version).toBe(true);
      expect(doc.querySelector("[data-memory-dialog]"), version).not.toBeNull();
      expect(scene?.textContent, version).toContain("Typography");
      expect(scene?.textContent, version).toContain("UI styling");
    }
  });

  it("gives every release page its own full-page theme and system cursor", () => {
    const themeIds = ["win1", "win2", "win3", "win95", "win98", "win2000", "winxp", "vista", "win7", "win8", "win10", "win11"];
    for (const [index, version] of versions.entries()) {
      const { html, doc } = releasePages.get(version)!;
      expect(doc.body.classList.contains(`page-${themeIds[index]}`), version).toBe(true);
      expect(html, version).toContain(`.page-${themeIds[index]}`);
      expect(html, version).toContain("--system-cursor:");
    }
  });

  it("uses local original artwork in every interactive system recreation", () => {
    for (const version of versions) {
      const { doc } = releasePages.get(version)!;
      const desktop = doc.querySelector<HTMLElement>('[data-system-assets="original-extracted"]');
      const style = desktop?.getAttribute("style") || "";
      const sources = [...style.matchAll(/url\("([^"]+)"\)/g)].map((match) => match[1]);

      expect(desktop, version).not.toBeNull();
      expect(sources.length, version).toBeGreaterThan(0);
      expect(sources.every((source) => /\/media\/(?:system-icons|app-icons)\/.+\.(?:png|svg)$/.test(source)), version).toBe(true);

      for (const source of sources) {
        const mediaPath = source.slice(source.indexOf("media/"));
        expect(existsSync(resolve("public", mediaPath)), `${version}: ${source}`).toBe(true);
      }
    }
  });

  it("keeps system controls keyboard reachable", () => {
    for (const version of versions) {
      const { doc } = releasePages.get(version)!;
      const controls = [...doc.querySelectorAll(".desktop button")];
      expect(controls.length, version).toBeGreaterThan(0);
      expect(controls.every((control) => control.getAttribute("type") === "button"), version).toBe(true);
    }
  });

  it("adds a period-labelled interactive command prompt to every desktop recreation", () => {
    for (const version of versions) {
      const { doc } = releasePages.get(version)!;
      const shell = doc.querySelector("[data-command-shell]");
      const window = shell?.querySelector("[data-command-window]");
      const launcher = shell?.querySelector<HTMLButtonElement>("[data-command-open]");
      const input = shell?.querySelector<HTMLInputElement>("[data-command-input]");

      expect(shell, version).not.toBeNull();
      expect(shell?.getAttribute("data-command-version"), version).toContain("Microsoft");
      expect(window?.hasAttribute("hidden"), version).toBe(true);
      expect(launcher?.type, version).toBe("button");
      expect(launcher?.querySelector("img")?.getAttribute("src"), version).toMatch(/\/media\/system-icons\/Windows(?:Dos|95MSDOSPrompt)\.png$/);
      expect(input?.getAttribute("aria-label"), version).toBe("Command Prompt input");
    }
  });

  it("contains no Chinese text in the generated experience", () => {
    const pages = [resolve("dist/index.html"), ...versions.map((version) => resolve("dist", version, "index.html"))];
    for (const page of pages) expect(readFileSync(page, "utf8"), page).not.toMatch(/\p{Script=Han}/u);
  });

  it("includes a sourced story and named contributors on every release page", () => {
    for (const version of versions) {
      const { doc } = releasePages.get(version)!;
      const story = doc.querySelector(".release-story");
      const contributors = [...doc.querySelectorAll(".contributor-card")];

      expect(story?.querySelector("h2")?.textContent?.trim(), version).toBeTruthy();
      expect(story?.querySelector('a[target="_blank"]')?.getAttribute("href"), version).toMatch(/^https:\/\//);
      expect(contributors.length, version).toBeGreaterThanOrEqual(2);
      expect(contributors.every((card) => card.querySelector("img")?.getAttribute("alt")?.startsWith("Portrait of ")), version).toBe(true);
      expect(contributors.every((card) => card.querySelector("h3")?.textContent?.trim()), version).toBe(true);
    }
  });

  it("uses only English text in the Windows XP Easter egg", () => {
    const easterEgg = releasePages.get("windows-xp")?.doc.querySelector("[data-xp-spider-easter-egg]");
    expect(easterEgg?.textContent).not.toMatch(/\p{Script=Han}/u);
  });
});
