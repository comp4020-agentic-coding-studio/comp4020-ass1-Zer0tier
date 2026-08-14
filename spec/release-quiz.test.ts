import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";

const versions = ["windows-1", "windows-2", "windows-3", "windows-95", "windows-98", "windows-2000", "windows-xp", "windows-vista", "windows-7", "windows-8", "windows-10", "windows-11"];

describe("release quiz", () => {
  it("includes a randomisable question pool on every release page", () => {
    for (const version of versions) {
      const html = readFileSync(resolve("dist", version, "index.html"), "utf8");
      const quizData = html.match(/<script type="application\/json" data-quiz-data>(.*?)<\/script>/)?.[1] ?? "[]";
      const questions = JSON.parse(quizData);
      expect(html.includes("data-release-quiz"), version).toBe(true);
      expect(questions.length, version).toBeGreaterThanOrEqual(2);
      expect(html.match(/type="radio"/g)?.length ?? 0, version).toBeGreaterThanOrEqual(3);
    }
  });

  it("reveals the explanation after the user answers", () => {
    const html = readFileSync(resolve("dist/windows-xp/index.html"), "utf8");
    const dom = new JSDOM(html, { runScripts: "outside-only" });
    const source = readFileSync(resolve("src/release-quiz.js"), "utf8");
    dom.window.eval(source);

    const doc = dom.window.document;
    const questions = JSON.parse(doc.querySelector("[data-quiz-data]")?.textContent ?? "[]");
    const prompt = doc.querySelector("[data-quiz-prompt]")?.textContent;
    const current = questions.find((question: { prompt: string }) => question.prompt === prompt);
    const correct = doc.querySelector<HTMLInputElement>(`input[name='quiz-answer'][value='${current.answer}']`);
    correct?.click();
    doc.querySelector<HTMLFormElement>("[data-quiz-form]")?.dispatchEvent(new dom.window.Event("submit", { bubbles: true, cancelable: true }));

    expect(doc.querySelector("[data-quiz-feedback]")?.getAttribute("data-result")).toBe("correct");
    expect(doc.querySelector("[data-quiz-feedback]")?.textContent).toContain(current.explanation);
    expect(doc.querySelector<HTMLButtonElement>("[data-quiz-next]")?.hidden).toBe(false);
    dom.window.close();
  });
});
