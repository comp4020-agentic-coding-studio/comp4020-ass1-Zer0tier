// What share of desktops each release held during its own period.
//
// This sits beside the adoption figure because the two answer different
// questions: one is how many copies went out, the other is how much of the
// world was actually running it at the time.
//
// Two honesty problems had to be handled rather than smoothed over.
//
// First, per-version desktop share is a web-analytics measurement, and the
// panels that produce it did not exist until the late 2000s. Six releases here
// shipped before anyone was counting operating systems by page view, so they
// carry no figure at all — inventing one, or quietly borrowing a units-shipped
// number and calling it share, is the exact failure CLAUDE.md warns about.
//
// Second, the services that do measure it disagree, and they do not all use the
// same denominator: StatCounter's Windows-version chart is a share of Windows
// desktops, while its desktop-OS chart is a share of every desktop. Every entry
// therefore states its own basis on the page, so two figures are never silently
// compared when they are measuring different things.

export interface MarketShare {
  /** WindowsRelease.id */
  release: string;
  /** False where no measurement of this kind exists for the period. */
  measured: boolean;
  /** e.g. "55.75%" */
  display?: string;
  /** The month the figure is from. */
  when?: string;
  /** What the percentage is a percentage of. Differs between sources. */
  basis?: string;
  /** One sentence: what the number means, or why there is not one. */
  note: string;
  source?: { label: string; url: string };
}

const STATCOUNTER = {
  label: "StatCounter Global Stats",
  url: "https://gs.statcounter.com/os-version-market-share/windows/desktop/worldwide",
};

export const marketShares: MarketShare[] = [
  {
    release: "win1",
    measured: false,
    note: "Nobody was counting. Desktop share is measured by sampling web traffic, and there was no web to sample — the figure beside this one, copies sold, is how reach was reported in 1985.",
  },
  {
    release: "win2",
    measured: false,
    note: "Still unmeasured. Analysts sized the market by units shipped and licences sold; counting which operating system a machine was actually running had to wait for those machines to be online.",
  },
  {
    release: "win3",
    measured: false,
    note: "Windows was on most business PCs by the end of this release's run, but no service was measuring per-version share, and a confident percentage here would be a guess wearing a decimal point.",
  },
  {
    release: "win95",
    measured: false,
    note: "The web existed and almost nobody was measuring operating systems with it yet. Contemporary reporting counted copies sold, which is the figure beside this one.",
  },
  {
    release: "win98",
    measured: false,
    note: "Browser statistics from this period exist but were gathered from individual sites rather than a global panel, and they disagree wildly. None of them is worth quoting as a share of all desktops.",
  },
  {
    release: "win2000",
    measured: false,
    note: "Sold to businesses rather than through shops, so even the shipped-copies figure is an estimate. Continuous per-version measurement began roughly a decade after this release.",
  },
  {
    release: "winxp",
    measured: true,
    display: "18.93%",
    when: "January 2015",
    basis: "of desktop computers worldwide",
    note: "Thirteen years after release, and nine months after Microsoft stopped supporting it, nearly a fifth of the world's desktops were still running it. Its actual peak came before anyone was measuring versions this way.",
    source: STATCOUNTER,
  },
  {
    release: "vista",
    measured: true,
    display: "about 23%",
    when: "October 2009",
    basis: "of desktop computers worldwide",
    note: "Its highest month, reached in the same October that Windows 7 arrived to replace it. Vista is remembered as a failure and still outran Windows 8 at the equivalent point.",
    source: STATCOUNTER,
  },
  {
    release: "win7",
    measured: true,
    display: "55.75%",
    when: "November 2014",
    basis: "of desktop computers worldwide",
    note: "Its peak, five years after release: more than half of every desktop on Earth, at a moment when its successor had already been on sale for two years.",
    source: STATCOUNTER,
  },
  {
    release: "win8",
    measured: true,
    display: "8.02%",
    when: "September 2013",
    basis: "of desktop computers worldwide",
    note: "Its highest month, from Net Applications rather than StatCounter — the two services differ in method. Counting Windows 8.1 with it, the pair peaked near 16%, against Windows 7's 55%.",
    source: { label: "Neowin, on Net Applications data", url: "https://www.neowin.net/news/windows-8s-market-share-peaks-at-a-little-over-16/" },
  },
  {
    release: "win10",
    measured: true,
    display: "79.79%",
    when: "5 October 2021",
    basis: "of Windows desktops",
    note: "Its peak, reached on the day Windows 11 was released. Note the different basis: this is a share of Windows machines rather than of all desktops.",
    source: { label: "Usage share of operating systems", url: "https://en.wikipedia.org/wiki/Usage_share_of_operating_systems" },
  },
  {
    release: "win11",
    measured: true,
    display: "69.92%",
    when: "June 2026",
    basis: "of Windows desktops",
    note: "The most recent measurement rather than a peak, because this one is still moving: Windows 10 support ended in October 2025 and the machines that could take the upgrade have been taking it.",
    source: STATCOUNTER,
  },
];

export function getMarketShare(release: string) {
  const share = marketShares.find((item) => item.release === release);
  if (!share) throw new Error(`no market share entry for release ${release}`);
  return share;
}
