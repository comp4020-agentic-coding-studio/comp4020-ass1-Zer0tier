import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";

const versions = ["windows-1", "windows-2", "windows-3", "windows-95", "windows-98", "windows-2000", "windows-xp", "windows-vista", "windows-7", "windows-8", "windows-10", "windows-11"];
const homeHtml = readFileSync(resolve("dist/index.html"), "utf8");
const home = new JSDOM(homeHtml).window.document;
const explainerHtml = readFileSync(resolve("dist", "windows", "index.html"), "utf8");
const explainer = new JSDOM(explainerHtml).window.document;
const globalStyles = readFileSync(resolve("src/styles/global.css"), "utf8");
const releasePages = new Map(versions.map((version) => {
  const html = readFileSync(resolve("dist", version, "index.html"), "utf8");
  return [version, { html, doc: new JSDOM(html).window.document }] as const;
}));

describe("Windows Desktop Evolution", () => {
  it("ships a separate static page for every major release", () => {
    for (const version of versions) expect(existsSync(resolve("dist", version, "index.html")), version).toBe(true);
  });

  it("keeps the homepage as the original scroll-controlled index", () => {
    const scenes = [...home.querySelectorAll<HTMLElement>("[data-timeline-scene]")];
    expect(scenes).toHaveLength(versions.length);
    expect(scenes.every((scene, index) => scene.getAttribute("data-href")?.endsWith(`/windows/#${versions[index]}`))).toBe(true);
    expect(home.querySelector("[data-timeline-enter]")?.getAttribute("href")?.endsWith("/windows/#windows-1")).toBe(true);
    expect(home.querySelectorAll(".timeline-window")).toHaveLength(1);
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

  it("places every complete themed release in one top-to-bottom explainer", () => {
    const sections = [...explainer.querySelectorAll<HTMLElement>("[data-version-section]")];
    expect(sections).toHaveLength(versions.length);
    expect(sections.map((section) => section.id)).toEqual(versions);
    for (const [index, section] of sections.entries()) {
      expect(section.classList.contains(`page-${["win1", "win2", "win3", "win95", "win98", "win2000", "winxp", "vista", "win7", "win8", "win10", "win11"][index]}`)).toBe(true);
      expect(section.querySelector(".desktop"), versions[index]).not.toBeNull();
      expect(section.querySelector(".release-details"), versions[index]).not.toBeNull();
      expect(section.querySelector("[data-history-book]"), versions[index]).not.toBeNull();
      expect(section.querySelector("[data-memory-scene]"), versions[index]).not.toBeNull();
      expect(section.querySelector("[data-adoption-milestone]"), versions[index]).not.toBeNull();
    }
    const ids = [...explainer.querySelectorAll<HTMLElement>("[id]")].map((element) => element.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("frames every substantive section as evidence of what users had to relearn", () => {
    for (const version of versions) {
      const chapter = explainer.querySelector<HTMLElement>(`#${version}`)!;
      const sections = [...chapter.querySelectorAll<HTMLElement>(
        ":scope > .startup-sound, :scope > .version-content > section",
      )];

      expect(sections, version).toHaveLength(10);
      expect(sections.every((section) => section.hasAttribute("data-relearning-content")), version).toBe(true);
      expect(sections.every((section) => {
        const evidence = section.querySelector<HTMLElement>("[data-relearning-evidence]");
        return (evidence?.textContent?.trim().length ?? 0) >= 80;
      }), version).toBe(true);
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

  it("separates four application windows from three sourced, accessible period reviews on every release", () => {
    for (const version of versions) {
      const { doc } = releasePages.get(version)!;
      const scene = doc.querySelector("[data-memory-scene]");
      const applications = [...doc.querySelectorAll(".memory-app-window")];
      const appIcons = [...doc.querySelectorAll(".memory-app-icon")];
      const appDescriptions = [...doc.querySelectorAll(".memory-app-copy > p")];
      const bubbles = [...doc.querySelectorAll<HTMLButtonElement>("[data-memory-bubble]")];
      const sourceLinks = [...doc.querySelectorAll<HTMLAnchorElement>(".memory-review-source")];
      const reviews = doc.querySelector("[data-memory-reviews]");
      const desktop = doc.querySelector(".memory-desktop");

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
      expect(reviews, version).not.toBeNull();
      expect(bubbles, version).toHaveLength(3);
      expect(sourceLinks, version).toHaveLength(3);
      expect(bubbles.every((bubble) => bubble.type === "button" && bubble.getAttribute("aria-haspopup") === "dialog"), version).toBe(true);
      expect(bubbles.every((bubble) => reviews?.contains(bubble) && !desktop?.contains(bubble)), version).toBe(true);
      expect(bubbles.every((bubble) => (bubble.querySelector(".memory-bubble-quote")?.textContent?.trim().length || 0) > 10), version).toBe(true);
      expect(bubbles.every((bubble) => (bubble.dataset.memorySourceUrl || "").startsWith("https://") && Boolean(bubble.dataset.memorySourceLabel)), version).toBe(true);
      expect(sourceLinks.every((link) => link.href.startsWith("https://") && link.target === "_blank" && link.textContent?.includes("Source:")), version).toBe(true);
      expect(doc.querySelector("[data-memory-dialog]"), version).not.toBeNull();
      expect(doc.querySelector("[data-memory-dialog-source]"), version).not.toBeNull();
      expect(reviews?.textContent, version).not.toContain("fictional");
      expect(doc.querySelector(".memory-notes"), version).toBeNull();
      expect(scene?.textContent, version).not.toContain("Native design language");
    }
  });

  it("gives every release page its own full-page theme without replacing the browser cursor", () => {
    const themeIds = ["win1", "win2", "win3", "win95", "win98", "win2000", "winxp", "vista", "win7", "win8", "win10", "win11"];
    for (const [index, version] of versions.entries()) {
      const { html, doc } = releasePages.get(version)!;
      expect(doc.body.classList.contains(`page-${themeIds[index]}`), version).toBe(true);
      expect(html, version).toContain(`.page-${themeIds[index]}`);
      expect(doc.body.getAttribute("style") ?? "", version).not.toContain("--system-cursor");
      expect(html, version).not.toContain("data:image/svg+xml");
    }
    expect(explainerHtml).not.toContain("--system-cursor");
  });

  it("packages modern Windows pointers as a single normal-size cursor frame", () => {
    for (const version of ["windows-7", "windows-8", "windows-10", "windows-11"]) {
      const cursor = readFileSync(resolve("public", "media", "cursors", `${version}.cur`));
      const width = cursor[6] || 256;
      const height = cursor[7] || 256;

      expect(cursor.readUInt16LE(2), version).toBe(2);
      expect(cursor.readUInt16LE(4), version).toBe(1);
      expect({ width, height }, version).toEqual({ width: 32, height: 32 });
      expect(cursor.readUInt16LE(10), version).toBeLessThan(width);
      expect(cursor.readUInt16LE(12), version).toBeLessThan(height);
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
      // wallpapers/ joins system-icons/ and app-icons/ now that a desktop can
      // carry its real background photograph as well as its icons; webp joins
      // png and svg for the same reason. The contract is unchanged: every
      // source is local, under media/, and the file is on disk.
      expect(sources.every((source) => /\/media\/(?:system-icons|app-icons|wallpapers)\/.+\.(?:png|svg|webp)$/.test(source)), version).toBe(true);

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
      const input = shell?.querySelector<HTMLInputElement>("[data-command-input]");

      // The launcher is not always the floating shortcut. Six recreations open
      // the prompt from a control the era actually had — the Windows 1.0 icon
      // bar, MS-DOS.EXE in the 2.0 file list, a Program Manager icon, the XP
      // and Vista taskbars, a Windows 8 tile — and ship no shortcut of their
      // own, because a second one would be a control that never existed.
      const launcher = doc.querySelector<HTMLButtonElement>("[data-desktop] [data-command-open], [data-desktop] [data-command-external-open]");

      expect(shell, version).not.toBeNull();
      expect(shell?.getAttribute("data-command-version"), version).toContain("Microsoft");
      expect(window?.hasAttribute("hidden"), version).toBe(true);
      expect(launcher?.type, version).toBe("button");
      // The period-correct icon is asserted on the window's own title bar,
      // which every era has; a text launcher like MS-DOS.EXE carries no image.
      expect(window?.querySelector("img")?.getAttribute("src"), version).toMatch(/\/media\/system-icons\/Windows(?:Dos|95MSDOSPrompt)\.png$/);
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

  // Replaces an assertion about the XP Spider Solitaire Easter egg, which was
  // cut for scope. The point it was really making — no leftover Chinese text
  // from the abandoned dynasties prototype — is worth keeping, so it now runs
  // across every release page instead of one component.
  it("carries no leftover Chinese text from the abandoned prototype", () => {
    for (const [version, { doc }] of releasePages) {
      expect(doc.body.textContent, version).not.toMatch(/\p{Script=Han}/u);
    }
  });
});
