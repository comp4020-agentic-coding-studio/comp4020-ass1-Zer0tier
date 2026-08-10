// Pure build-time geometry and concurrency maths. No DOM, no Astro — so it can
// be unit-tested directly, and so the numbers the page prints are the same
// numbers the timeline is drawn from.

import type { Period, Regime, Span, TrackId } from "./dynasties";
import { TRACK_NAMES } from "./dynasties";

// Columns are laid out in this order in every band, so "the north" is always
// left of "the south" and a reader's spatial memory survives scrolling.
const TRACK_ORDER: TrackId[] = ["court", "north", "south", "steppe", "rival"];

/**
 * Intervals are half-open: [start, end). A dynasty that ends in the year its
 * successor begins did not coexist with it.
 */
export function overlaps(a: Span, b: Span): boolean {
  return a.start < b.end && b.start < a.end;
}

export interface Column {
  track: TrackId;
  name: string;
  index: number;
}

export interface Cell {
  regime: Regime;
  /** 1-based grid column. */
  column: number;
  /** Grid row lines, already offset past the header row. */
  from: number;
  to: number;
  /** Runs past this band's own span — rendered with an open edge. */
  continues: boolean;
  begins: boolean;
}

export interface Band {
  period: Period;
  columns: Column[];
  cells: Cell[];
  /** grid-template-rows entries for the segments, excluding the header row. */
  rows: string[];
  peak: number;
}

export function buildBand(period: Period, all: Regime[]): Band {
  const members = all.filter((r) => r.period === period.id);

  // Greedy packing within a fixed track order. A track opens a second column
  // only when two of its own regimes genuinely overlap — which is why the
  // Northern dynasties get two and the Tang gets one.
  const lanes: { track: TrackId; taken: Regime[] }[] = [];
  const columnOf = new Map<string, number>();
  for (const track of TRACK_ORDER) {
    const inTrack = members
      .filter((m) => m.track === track)
      .sort((a, b) => a.start - b.start || a.end - b.end);
    for (const r of inTrack) {
      let lane = lanes.find((l) => l.track === track && !l.taken.some((o) => overlaps(o, r)));
      if (!lane) {
        lane = { track, taken: [] };
        lanes.push(lane);
      }
      lane.taken.push(r);
      columnOf.set(r.id, lanes.indexOf(lane) + 1);
    }
  }

  // Every start and every end becomes a row line, so vertical order and
  // overlap are exact. Heights are NOT proportional to duration — the span
  // ratio here is 275:1, and a linear scale that keeps a two-year regime
  // tappable would run to tens of thousands of pixels. The caption says so.
  const boundaries = [...new Set(members.flatMap((m) => [m.start, m.end]))].sort((a, b) => a - b);
  const lineOf = new Map<number, number>();
  boundaries.forEach((y, i) => lineOf.set(y, i + 2)); // line 1 is the header row

  const rows = boundaries.slice(0, -1).map((y, i) => {
    const years = boundaries[i + 1] - y;
    const rem = Math.min(6, Math.max(1.25, years * 0.05));
    return `minmax(${rem.toFixed(2)}rem, auto)`;
  });

  const cells: Cell[] = members
    .map((r) => ({
      regime: r,
      column: columnOf.get(r.id) ?? 1,
      from: lineOf.get(r.start) ?? 2,
      to: lineOf.get(r.end) ?? boundaries.length + 1,
      continues: r.end > period.end,
      begins: r.start < period.start,
    }))
    // Chronological, so DOM order — and therefore tab and screen-reader order —
    // follows time no matter where the grid puts each card.
    .sort((a, b) => a.regime.start - b.regime.start || a.column - b.column);

  const columns: Column[] = lanes.map((l, i) => ({
    track: l.track,
    name: TRACK_NAMES[l.track],
    index: i + 1,
  }));

  const peak = members
    .filter((r) => r.kind === "regime")
    .reduce((max, r) => Math.max(max, concurrentAt(r.start, members).length), 0);

  return { period, columns, cells, rows, peak };
}

/** Regimes running in a given year. Umbrellas and phases are not regimes. */
export function concurrentAt(year: number, all: Regime[]): Regime[] {
  return all.filter((r) => r.kind === "regime" && r.start <= year && year < r.end);
}

/**
 * Concurrency only ever rises at a start year, so the maximum is guaranteed to
 * be found by checking starts alone — no sampling, no missed spike.
 */
export function peakConcurrency(all: Regime[]): { year: number; n: number } {
  let best = { year: all[0]?.start ?? 0, n: 0 };
  for (const r of all) {
    if (r.kind !== "regime") continue;
    const n = concurrentAt(r.start, all).length;
    if (n > best.n) best = { year: r.start, n };
  }
  return best;
}

/** Exact total, computed over segments rather than sampled. */
export function yearsWithAtLeast(n: number, all: Regime[]): number {
  const real = all.filter((r) => r.kind === "regime");
  const bounds = [...new Set(real.flatMap((r) => [r.start, r.end]))].sort((a, b) => a - b);
  let total = 0;
  for (let i = 0; i < bounds.length - 1; i += 1) {
    if (concurrentAt(bounds[i], real).length >= n) total += bounds[i + 1] - bounds[i];
  }
  return total;
}

/**
 * Buckets for the concurrency strip. Each bar is the MAXIMUM concurrency
 * anywhere inside its window, not a point sample at the window's start.
 * Point sampling at 25 years misses the 1124 peak entirely — it is only 13
 * years wide — so the strip would top out at 4 while the caption said 5.
 * A bar chart of "how many at once" should show the most, not a snapshot.
 */
export function profile(all: Regime[], step = 25): { year: number; n: number }[] {
  const real = all.filter((r) => r.kind === "regime");
  const first = Math.min(...real.map((r) => r.start));
  const last = Math.max(...real.map((r) => r.end));
  const starts = [...new Set(real.map((r) => r.start))].sort((a, b) => a - b);
  const out: { year: number; n: number }[] = [];
  for (let y = first; y < last; y += step) {
    // Concurrency only rises at a start year, so the window maximum is either
    // the count at its left edge or the count at a start year inside it.
    let n = concurrentAt(y, real).length;
    for (const s of starts) {
      if (s > y && s < y + step) n = Math.max(n, concurrentAt(s, real).length);
    }
    out.push({ year: y, n });
  }
  return out;
}
