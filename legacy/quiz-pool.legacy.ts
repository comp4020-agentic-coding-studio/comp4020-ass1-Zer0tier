import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";
import poolSrc from "./quiz-pool.js?raw";
import { formatSpan, regimes } from "./data/dynasties";

// quiz-pool.js is deliberately DOM-free so it can be evaluated here directly —
// the real shipped source, not a re-implementation of its logic in the test.
const host: { DYN?: Record<string, unknown> } = {};
new Function("window", poolSrc)(host);
const DYN = host.DYN as {
  buildPool: (rs: PoolRegime[]) => Question[];
  pickRound: (pool: Question[], n: number, rng: () => number) => Question[];
};

interface PoolRegime {
  id: string;
  name: string;
  zh: string;
  label: string;
  years: string;
  start: number;
  end: number;
  track: string;
  trackName: string;
  periodName: string;
  artefact: string;
}
interface Choice {
  id: string;
  label: string;
}
interface Question {
  id: string;
  type: string;
  subject: string;
  teach: string;
  prompt: string;
  answer: string;
  choices: Choice[];
  because: string;
  year?: number;
  artefact?: string;
}

const input: PoolRegime[] = regimes
  .filter((r) => r.kind === "regime")
  .map((r) => ({
    id: r.id,
    name: r.name,
    zh: r.chinese,
    label: `${r.name} ${r.chinese}`,
    years: formatSpan(r),
    start: r.start,
    end: r.end,
    track: r.track,
    trackName: r.track,
    periodName: r.period,
    artefact: r.artefacts[0],
  }));

const pool = DYN.buildPool(input);
const at = (id: string): PoolRegime => {
  const r = input.find((x) => x.id === id);
  if (!r) throw new Error(`question names a regime the timeline lacks: ${id}`);
  return r;
};
// Re-derived, not imported. A test that borrows the implementation's predicate
// can only show the code agrees with itself.
const over = (a: PoolRegime, b: PoolRegime): boolean => a.start < b.end && b.start < a.end;

// Deterministic, so a failure reproduces exactly.
const seeded = (s: number) => () => {
  s = (s * 1103515245 + 12345) & 0x7fffffff;
  return s / 0x7fffffff;
};

const TYPES = ["same-time", "never-met", "how-many", "earliest", "which-side", "who-made"];

describe("the question pool", () => {
  it("is big enough that ten questions are a real draw", () => {
    expect(pool.length).toBeGreaterThanOrEqual(50);
  });

  it("uses every question type", () => {
    const seen = new Set(pool.map((q) => q.type));
    expect([...seen].sort()).toEqual([...TYPES].sort());
  });

  it("gives every question four distinct choices and one answer among them", () => {
    for (const q of pool) {
      expect(q.choices.length, `${q.id} has ${q.choices.length} choices`).toBe(4);
      expect(new Set(q.choices.map((c) => c.label)).size, `${q.id} repeats a label`).toBe(4);
      expect(new Set(q.choices.map((c) => c.id)).size, `${q.id} repeats a choice id`).toBe(4);
      expect(
        q.choices.some((c) => c.id === q.answer),
        `${q.id}'s answer is not one of its choices`,
      ).toBe(true);
    }
  });

  it("writes a prompt and an explanation for every question", () => {
    for (const q of pool) {
      expect(q.prompt.trim().length, `${q.id} has no prompt`).toBeGreaterThan(10);
      expect(q.because.trim().length, `${q.id} explains nothing`).toBeGreaterThan(10);
    }
  });

  it("only ever names a regime the timeline ships", () => {
    // The structural guarantee: the quiz cannot ask about something that isn't
    // on the page, because the pool is derived from the page's own nodes.
    const ids = new Set(input.map((r) => r.id));
    for (const q of pool) {
      expect(ids.has(q.subject), `${q.id} subject ${q.subject} is not on the timeline`).toBe(true);
      expect(ids.has(q.teach), `${q.id} teaches ${q.teach}, which is not on the timeline`).toBe(true);
    }
  });
});

describe("every stated answer is actually true", () => {
  // The highest-value test here: it makes "the quiz teaches the right thing"
  // mechanical rather than a matter of trusting the generator.
  it("same-time: the answer overlapped the subject and no distractor did", () => {
    for (const q of pool.filter((x) => x.type === "same-time")) {
      const subject = at(q.subject);
      for (const c of q.choices) {
        const expected = c.id === q.answer;
        expect(over(at(c.id), subject), `${q.id}: ${c.id} overlap should be ${expected}`).toBe(
          expected,
        );
      }
    }
  });

  it("never-met: the answer overlapped none of the others, and each other overlapped something", () => {
    for (const q of pool.filter((x) => x.type === "never-met")) {
      const others = q.choices.filter((c) => c.id !== q.answer).map((c) => at(c.id));
      const odd = at(q.answer);
      for (const o of others) {
        expect(over(odd, o), `${q.id}: ${q.answer} should not overlap ${o.id}`).toBe(false);
      }
      for (const o of others) {
        expect(
          others.some((p) => p.id !== o.id && over(o, p)),
          `${q.id}: ${o.id} is meant to be one of the three that overlapped`,
        ).toBe(true);
      }
    }
  });

  it("how-many: the answer is the real count in that year", () => {
    for (const q of pool.filter((x) => x.type === "how-many")) {
      const year = q.year ?? Number.NaN;
      const real = input.filter((r) => r.start <= year && year < r.end).length;
      const stated = Number(q.choices.find((c) => c.id === q.answer)?.label);
      expect(stated, `${q.id}: says ${stated} in ${year}, really ${real}`).toBe(real);
    }
  });

  it("earliest: the answer really began first, with no tie", () => {
    for (const q of pool.filter((x) => x.type === "earliest")) {
      const starts = q.choices.map((c) => at(c.id).start);
      const min = Math.min(...starts);
      expect(at(q.answer).start, `${q.id} is not the earliest`).toBe(min);
      expect(starts.filter((s) => s === min).length, `${q.id} has a tied answer`).toBe(1);
    }
  });

  it("which-side: the answer's region differs from the other three, which agree", () => {
    for (const q of pool.filter((x) => x.type === "which-side")) {
      const others = q.choices.filter((c) => c.id !== q.answer).map((c) => at(c.id).track);
      expect(new Set(others).size, `${q.id}: the three distractors disagree`).toBe(1);
      expect(at(q.answer).track, `${q.id}: the answer shares the majority region`).not.toBe(
        others[0],
      );
    }
  });

  it("who-made: the artefact belongs to the answer and to no distractor", () => {
    for (const q of pool.filter((x) => x.type === "who-made")) {
      expect(at(q.answer).artefact).toBe(q.artefact);
      for (const c of q.choices) {
        if (c.id === q.answer) continue;
        expect(at(c.id).artefact, `${q.id}: ${c.id} also made it`).not.toBe(q.artefact);
      }
    }
  });
});

describe("picking a round of ten", () => {
  const round = DYN.pickRound(pool, 10, seeded(7));

  it("is ten questions", () => {
    expect(round.length).toBe(10);
  });

  it("never asks about the same regime twice in one round", () => {
    const subjects = round.map((q) => q.subject);
    expect(new Set(subjects).size, `repeated subjects: ${subjects}`).toBe(10);
  });

  it("never lets one question type take over the round", () => {
    const counts = new Map<string, number>();
    for (const q of round) counts.set(q.type, (counts.get(q.type) ?? 0) + 1);
    for (const [type, n] of counts) {
      expect(n, `${n} of the 10 questions are ${type}`).toBeLessThanOrEqual(3);
    }
  });

  it("gives the same round for the same seed, and a different one otherwise", () => {
    const a = DYN.pickRound(pool, 10, seeded(7)).map((q) => q.id);
    const b = DYN.pickRound(pool, 10, seeded(7)).map((q) => q.id);
    const c = DYN.pickRound(pool, 10, seeded(99)).map((q) => q.id);
    expect(a).toEqual(b);
    expect(a).not.toEqual(c);
  });

  it("does not consume the pool, so a second round is still a full draw", () => {
    const before = pool.length;
    DYN.pickRound(pool, 10, seeded(3));
    DYN.pickRound(pool, 10, seeded(4));
    expect(pool.length).toBe(before);
    expect(DYN.pickRound(pool, 10, seeded(5)).length).toBe(10);
  });
});

describe("the pool matches the page it was built from", () => {
  it("only names regimes that have a trigger in the built HTML", () => {
    const doc = new JSDOM(readFileSync(resolve("dist/index.html"), "utf8")).window.document;
    const onPage = new Set(
      [...doc.querySelectorAll("[data-dynasty]")].map((t) => t.getAttribute("data-dynasty") ?? ""),
    );
    const missing = new Set<string>();
    for (const q of pool) {
      for (const c of q.choices) if (c.id.startsWith("n-")) continue;
      for (const id of [q.subject, q.teach]) if (!onPage.has(id)) missing.add(id);
    }
    expect([...missing], "the quiz would ask about something not on the page").toEqual([]);
  });
});
