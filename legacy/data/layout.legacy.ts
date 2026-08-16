import { describe, expect, it } from "vitest";
import { formatSpan, formatYear, periods, regimes } from "./dynasties";
import type { Regime } from "./dynasties";
import {
  buildBand,
  concurrentAt,
  overlaps,
  peakConcurrency,
  profile,
  yearsWithAtLeast,
} from "./layout";

const byId = (id: string): Regime => {
  const r = regimes.find((x) => x.id === id);
  if (!r) throw new Error(`no regime ${id}`);
  return r;
};

describe("overlaps: half-open intervals", () => {
  // These two pairs decide column packing, the "at the same time?" questions
  // and every concurrency count on the page. If the convention is wrong, the
  // whole argument the page makes is wrong with it.
  it("does not count a handover year as an overlap", () => {
    // Ming ends 1644, Southern Ming begins 1644 — a succession, not a rivalry.
    expect(overlaps(byId("ming"), byId("southern-ming"))).toBe(false);
  });

  it("counts a single shared year as an overlap", () => {
    // Liao falls in 1125; Western Liao is founded in 1124. They coexist.
    expect(overlaps(byId("liao"), byId("western-liao"))).toBe(true);
  });

  it("is symmetric", () => {
    for (const [a, b] of [
      ["ming", "southern-ming"],
      ["liao", "western-liao"],
      ["northern-song", "liao"],
    ] as const) {
      expect(overlaps(byId(a), byId(b))).toBe(overlaps(byId(b), byId(a)));
    }
  });

  it("knows Northern Song never had the north to itself", () => {
    expect(overlaps(byId("northern-song"), byId("liao"))).toBe(true);
    expect(overlaps(byId("northern-song"), byId("western-xia"))).toBe(true);
  });
});

describe("buildBand: placing regimes in columns", () => {
  const bands = periods.map((p) => buildBand(p, regimes));

  it("places every regime exactly once, in exactly one band", () => {
    const placed = bands.flatMap((b) => b.cells.map((c) => c.regime.id));
    expect(placed.length).toBe(regimes.length);
    expect(new Set(placed).size).toBe(regimes.length);
  });

  it("never puts two overlapping regimes in the same column", () => {
    for (const band of bands) {
      for (const a of band.cells) {
        for (const b of band.cells) {
          if (a.regime.id >= b.regime.id) continue;
          if (a.column !== b.column) continue;
          expect(
            overlaps(a.regime, b.regime),
            `${a.regime.id} and ${b.regime.id} share column ${a.column} in ${band.period.id} but overlap`,
          ).toBe(false);
        }
      }
    }
  });

  it("gives every cell a real column and a non-empty row span", () => {
    for (const band of bands) {
      for (const c of band.cells) {
        expect(c.column).toBeGreaterThanOrEqual(1);
        expect(c.to).toBeGreaterThan(c.from);
      }
    }
  });

  it("keeps row lines monotone in time", () => {
    for (const band of bands) {
      const sorted = [...band.cells].sort((a, b) => a.regime.start - b.regime.start);
      for (let i = 1; i < sorted.length; i += 1) {
        if (sorted[i].regime.start === sorted[i - 1].regime.start) continue;
        expect(
          sorted[i].from,
          `${sorted[i].regime.id} starts later than ${sorted[i - 1].regime.id} but sits higher`,
        ).toBeGreaterThanOrEqual(sorted[i - 1].from);
      }
    }
  });

  it("emits cells in chronological order, so tab order follows time", () => {
    for (const band of bands) {
      const starts = band.cells.map((c) => c.regime.start);
      expect(starts, `${band.period.id} is out of order`).toEqual([...starts].sort((a, b) => a - b));
    }
  });

  it("declares one grid row per segment, plus the header", () => {
    for (const band of bands) {
      const maxLine = Math.max(...band.cells.map((c) => c.to));
      expect(band.rows.length).toBe(maxLine - 2);
    }
  });

  it("finds the crowded periods crowded and the quiet ones quiet", () => {
    const peak = Object.fromEntries(bands.map((b) => [b.period.id, b.columns.length]));
    expect(peak.bronze).toBe(1);
    expect(peak["song-liao"]).toBeGreaterThanOrEqual(5);
    expect(peak["three-kingdoms"]).toBeGreaterThanOrEqual(4);
  });
});

describe("concurrency: the claim the page is making", () => {
  it("counts only real regimes, never the umbrella periods", () => {
    // 汉 is an umbrella over 西汉/新/东汉. Counting it would double every year
    // of the Han and make the headline figure a lie.
    const at100 = concurrentAt(100, regimes).map((r) => r.id);
    expect(at100).toContain("eastern-han");
    expect(at100).not.toContain("han");
  });

  it("knows the Three Kingdoms were three", () => {
    const at250 = concurrentAt(250, regimes).map((r) => r.id).sort();
    expect(at250).toEqual(["cao-wei", "eastern-wu", "shu-han"]);
  });

  it("knows the Song never ruled alone", () => {
    const at1100 = concurrentAt(1100, regimes).map((r) => r.id);
    expect(at1100).toContain("northern-song");
    expect(at1100).toContain("liao");
    expect(at1100).toContain("western-xia");
  });

  it("knows the Yuan court outlived 1368", () => {
    const at1370 = concurrentAt(1370, regimes).map((r) => r.id);
    expect(at1370).toContain("ming");
    expect(at1370).toContain("northern-yuan");
  });

  it("peaks at four or more regimes at once", () => {
    const peak = peakConcurrency(regimes);
    expect(peak.n).toBeGreaterThanOrEqual(4);
    expect(peak.year).toBeGreaterThan(900);
  });

  it("spends centuries, not years, in division", () => {
    // Two centuries is the claim worth making and defending; the exact figure
    // is computed for the caption rather than hard-coded here, so this stays a
    // real assertion instead of a copy of the implementation's own answer.
    expect(yearsWithAtLeast(3, regimes)).toBeGreaterThan(200);
    expect(yearsWithAtLeast(2, regimes)).toBeGreaterThan(yearsWithAtLeast(3, regimes));
    expect(yearsWithAtLeast(99, regimes)).toBe(0);
  });

  it("profiles the whole span without gaps", () => {
    const p = profile(regimes, 25);
    expect(p.length).toBeGreaterThan(100);
    expect(p.every((s) => s.n >= 0)).toBe(true);
    expect(Math.max(...p.map((s) => s.n))).toBeGreaterThanOrEqual(4);
  });
});

describe("formatting years a reader can place", () => {
  it("never prints a bare negative year", () => {
    expect(formatYear(-2070)).toBe("2070 BC");
    expect(formatYear(-202)).toBe("202 BC");
  });

  it("marks early AD years so 25 is not mistaken for a span", () => {
    expect(formatYear(9)).toBe("AD 9");
    expect(formatYear(220)).toBe("AD 220");
    expect(formatYear(1644)).toBe("1644");
  });

  it("carries the c. through an approximate span", () => {
    expect(formatYear(-1046, true)).toBe("c. 1046 BC");
  });

  it("writes a span that crosses the epoch readably", () => {
    expect(formatSpan(byId("western-han"))).toBe("202 BC – AD 9");
    expect(formatSpan(byId("eastern-han"))).toBe("AD 25–220");
    expect(formatSpan(byId("ming"))).toBe("1368–1644");
    expect(formatSpan(byId("warring-states"))).toBe("475–221 BC");
  });

  it("uses the century wording where the data is only century-precise", () => {
    expect(formatSpan(byId("xia"))).toBe("c. 21st–17th century BC");
  });
});

describe("the data itself", () => {
  it("gives every regime a unique id", () => {
    const ids = regimes.map((r) => r.id);
    const dupes = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
    expect(dupes, `duplicate ids would make #d-<id> ambiguous: ${dupes}`).toEqual([]);
  });

  it("gives every regime something to show when you click it", () => {
    const thin = regimes
      .filter(
        (r) =>
          !r.summary.trim() ||
          r.weapons.length === 0 ||
          r.inventions.length === 0 ||
          r.artefacts.length === 0,
      )
      .map((r) => r.id);
    expect(thin, `these would render an empty detail panel: ${thin}`).toEqual([]);
  });

  it("files every regime under a period that exists", () => {
    const orphans = regimes.filter((r) => !periods.some((p) => p.id === r.period)).map((r) => r.id);
    expect(orphans).toEqual([]);
  });

  it("never has a regime ending before it starts", () => {
    const backwards = regimes.filter((r) => r.end <= r.start).map((r) => r.id);
    expect(backwards).toEqual([]);
  });
});
