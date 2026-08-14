import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, it, vi } from "vitest";

const versions = ["windows-1", "windows-2", "windows-3", "windows-95", "windows-98", "windows-2000", "windows-xp", "windows-vista", "windows-7", "windows-8", "windows-10", "windows-11"];

describe("release startup sounds", () => {
  it("provides an accurate transition sound state for every release", () => {
    for (const [index, version] of versions.entries()) {
      const html = readFileSync(resolve("dist", version, "index.html"), "utf8");
      const doc = new JSDOM(html).window.document;
      const panel = doc.querySelector("[data-startup-sound]");
      const audio = panel?.querySelector("audio[data-startup-audio]");

      expect(panel, version).not.toBeNull();
      if (index < 2) {
        expect(panel?.getAttribute("data-silent"), version).toBe("true");
        expect(audio, version).toBeNull();
      } else {
        expect(audio?.hasAttribute("autoplay"), version).toBe(true);
        expect(audio?.getAttribute("src"), version).toMatch(/\/media\/startup\/.+\.wav$/);
        expect(panel?.querySelector("button[data-sound-play]"), version).not.toBeNull();
      }
    }
  });

  it("attempts automatic playback and offers a fallback when the browser blocks it", async () => {
    const html = readFileSync(resolve("dist/windows-xp/index.html"), "utf8");
    const dom = new JSDOM(html, { runScripts: "outside-only" });
    const play = vi.fn().mockRejectedValueOnce(new Error("autoplay blocked")).mockResolvedValue(undefined);
    Object.defineProperty(dom.window.HTMLMediaElement.prototype, "play", { configurable: true, value: play });
    Object.defineProperty(dom.window.HTMLMediaElement.prototype, "pause", { configurable: true, value: vi.fn() });

    dom.window.eval(readFileSync(resolve("src/startup-sound.js"), "utf8"));
    await Promise.resolve();
    await Promise.resolve();

    const doc = dom.window.document;
    const status = doc.querySelector("[data-sound-status]");
    const button = doc.querySelector<HTMLButtonElement>("[data-sound-play]");
    expect(play).toHaveBeenCalledTimes(1);
    expect(status?.getAttribute("data-state")).toBe("blocked");
    expect(button?.textContent).toBe("Play sound");

    button?.click();
    await Promise.resolve();
    await Promise.resolve();
    expect(play).toHaveBeenCalledTimes(2);
    expect(status?.getAttribute("data-state")).toBe("playing");
    dom.window.close();
  });
});
