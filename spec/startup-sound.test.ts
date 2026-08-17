import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, it, vi } from "vitest";

const versions = ["windows-1", "windows-2", "windows-3", "windows-95", "windows-98", "windows-2000", "windows-xp", "windows-vista", "windows-7", "windows-8", "windows-10", "windows-11"];

describe("release startup sounds", () => {
  it("provides an accurate transition sound state for every release", () => {
    for (const [index, version] of versions.entries()) {
      const html = readFileSync(resolve("dist", version, "index.html"), "utf8");
      const panel = html.match(/<aside class="startup-sound" data-startup-sound[^>]*>/)?.[0];
      const audio = html.match(/<audio[^>]*data-startup-audio[^>]*>/)?.[0];

      expect(panel, version).toBeDefined();
      if (index < 2) {
        expect(panel, version).toContain('data-silent="true"');
        expect(audio, version).toBeUndefined();
      } else {
        expect(audio, version).not.toContain("autoplay");
        expect(audio, version).toContain('preload="none"');
        expect(audio, version).toMatch(/src="[^"]*\/media\/startup\/.+\.wav"/);
        expect(html.includes("data-sound-play"), version).toBe(true);
      }
    }
  });

  it("waits for a deliberate click before playing", async () => {
    const html = readFileSync(resolve("dist/windows-xp/index.html"), "utf8");
    const dom = new JSDOM(html, { runScripts: "outside-only" });
    const play = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(dom.window.HTMLMediaElement.prototype, "play", { configurable: true, value: play });
    Object.defineProperty(dom.window.HTMLMediaElement.prototype, "pause", { configurable: true, value: vi.fn() });

    dom.window.eval(readFileSync(resolve("src/startup-sound.js"), "utf8"));

    const doc = dom.window.document;
    const status = doc.querySelector("[data-sound-status]");
    const button = doc.querySelector<HTMLButtonElement>("[data-sound-play]");
    expect(play).not.toHaveBeenCalled();
    expect(status?.getAttribute("data-state")).toBe("ready");
    expect(button?.textContent).toBe("Play sound");

    button?.click();
    await Promise.resolve();
    await Promise.resolve();
    expect(play).toHaveBeenCalledTimes(1);
    expect(status?.getAttribute("data-state")).toBe("playing");
    dom.window.close();
  });

  it("lets each long-page player start independently and stops the previous sound", async () => {
    const panel = (name: string) => `<aside data-startup-sound aria-label="${name}"><p data-sound-status data-state="ready">Ready</p><button data-sound-play>Play sound</button><audio data-startup-audio preload="none"></audio></aside>`;
    const dom = new JSDOM(`${panel("first")} ${panel("second")}`, { runScripts: "outside-only" });
    const play = vi.fn().mockResolvedValue(undefined);
    const pause = vi.fn();
    Object.defineProperty(dom.window.HTMLMediaElement.prototype, "play", { configurable: true, value: play });
    Object.defineProperty(dom.window.HTMLMediaElement.prototype, "pause", { configurable: true, value: pause });

    dom.window.eval(readFileSync(resolve("src/startup-sound.js"), "utf8"));
    const buttons = [...dom.window.document.querySelectorAll<HTMLButtonElement>("[data-sound-play]")];
    const statuses = [...dom.window.document.querySelectorAll<HTMLElement>("[data-sound-status]")];

    buttons[0].click();
    await Promise.resolve();
    buttons[1].click();
    await Promise.resolve();
    await Promise.resolve();

    expect(play).toHaveBeenCalledTimes(2);
    expect(statuses[0].getAttribute("data-state")).toBe("stopped");
    expect(statuses[1].getAttribute("data-state")).toBe("playing");
    expect(buttons[1].disabled).toBe(false);
    dom.window.close();
  });
});
