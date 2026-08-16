import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";

function commandPage(version: string) {
  const html = readFileSync(resolve("dist", version, "index.html"), "utf8");
  const dom = new JSDOM(html, { runScripts: "outside-only", url: `https://example.test/${version}/` });
  dom.window.eval(readFileSync(resolve("src/command-prompt.js"), "utf8"));
  return dom;
}

function submit(dom: JSDOM, command: string) {
  const input = dom.window.document.querySelector<HTMLInputElement>("[data-command-input]")!;
  const form = dom.window.document.querySelector<HTMLFormElement>("[data-command-form]")!;
  input.value = command;
  form.dispatchEvent(new dom.window.Event("submit", { bubbles: true, cancelable: true }));
}

describe("interactive historical command prompt", () => {
  it.each([
    ["windows-3", ".program-icons"],
    ["windows-xp", ".xp-taskbar"],
    ["windows-vista", ".aero-taskbar"],
    ["windows-8", ".metro-grid"],
  ])("opens from the non-overlapping native launcher on %s", (version, container) => {
    const dom = commandPage(version);
    const doc = dom.window.document;
    const launcher = doc.querySelector<HTMLButtonElement>(`${container} [data-command-external-open]`)!;
    const commandWindow = doc.querySelector<HTMLElement>("[data-command-window]")!;

    expect(launcher).not.toBeNull();
    launcher.click();
    expect(commandWindow.hidden).toBe(false);
    dom.window.close();
  });

  it("opens, runs commands, and preserves DOS-era error wording", () => {
    const dom = commandPage("windows-95");
    const doc = dom.window.document;
    const commandWindow = doc.querySelector<HTMLElement>("[data-command-window]")!;

    doc.querySelector<HTMLButtonElement>("[data-command-open]")!.click();
    expect(commandWindow.hidden).toBe(false);

    submit(dom, "ver");
    submit(dom, "dir");
    submit(dom, "launch_the_web");
    const output = doc.querySelector("[data-command-output]")?.textContent || "";
    expect(output).toContain("Microsoft(R) Windows 95");
    expect(output).toContain("Directory of C:\\");
    expect(output).toContain("Bad command or file name");
    dom.window.close();
  });

  it("supports NT commands, command history, clearing, and exit", () => {
    const dom = commandPage("windows-11");
    const doc = dom.window.document;
    const commandWindow = doc.querySelector<HTMLElement>("[data-command-window]")!;
    const input = doc.querySelector<HTMLInputElement>("[data-command-input]")!;

    doc.querySelector<HTMLButtonElement>("[data-command-open]")!.click();
    submit(dom, "whoami");
    expect(doc.querySelector("[data-command-output]")?.textContent).toContain("desktop-evolution\\alex");

    input.dispatchEvent(new dom.window.KeyboardEvent("keydown", { key: "ArrowUp", bubbles: true }));
    expect(input.value).toBe("whoami");
    submit(dom, "cls");
    expect(doc.querySelector("[data-command-output]")?.textContent).toBe("");
    submit(dom, "exit");
    expect(commandWindow.hidden).toBe(true);
    dom.window.close();
  });
});
