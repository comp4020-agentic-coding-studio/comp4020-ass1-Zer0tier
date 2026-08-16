import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";
import { windowsReleases } from "../src/data/windows";

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
    ["windows-1", ".win1-iconbar"],
    ["windows-2", ".file-table"],
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

describe("one way in, per era", () => {
  // Six eras used to ship a hidden floating shortcut on top of the launcher
  // their recreation already had. Counting elements is only equivalent to
  // counting what a visitor sees now that none of them are hidden — which is
  // the reason for not rendering them rather than setting display: none.
  it.each(windowsReleases.map((release) => [release.slug] as const))(
    "gives %s exactly one way to open the prompt",
    (slug) => {
      const doc = new JSDOM(readFileSync(resolve("dist", slug, "index.html"), "utf8")).window.document;
      const desktop = doc.querySelector("[data-desktop]")!;
      const openers = desktop.querySelectorAll("[data-command-open], [data-command-external-open]");
      expect(openers, `${slug}: expected one launcher`).toHaveLength(1);
      expect(openers[0].tagName, `${slug}: the launcher must be a real button`).toBe("BUTTON");
    },
  );

  it("launches Windows 1.0 from the icon bar and Windows 2.0 from MS-DOS.EXE", () => {
    const one = new JSDOM(readFileSync(resolve("dist/windows-1/index.html"), "utf8")).window.document;
    const oneLauncher = one.querySelector(".win1-iconbar [data-command-external-open]");
    expect(oneLauncher?.textContent?.trim()).toBe("MS-DOS");

    const two = new JSDOM(readFileSync(resolve("dist/windows-2/index.html"), "utf8")).window.document;
    const cells = [...two.querySelectorAll(".file-table > *")].map((cell) => cell.textContent?.trim());
    expect(cells).toContain("MS-DOS.EXE");
    // Three-column grid: the eleventh cell lands directly under the eighth,
    // which is REVERSI.EXE. Stated as literals so a reordered file list has to
    // come back here and think about it.
    expect(cells[7]).toBe("REVERSI.EXE");
    expect(cells[10]).toBe("MS-DOS.EXE");
    expect(two.querySelector(".file-table [data-command-external-open]")?.textContent?.trim()).toBe("MS-DOS.EXE");
  });
});
