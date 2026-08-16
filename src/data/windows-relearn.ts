// One task, twelve releases: "start a program".
//
// This is the claim in its smallest possible form. Nothing here is a new
// subject — it is the same subject the rest of the page argues, reduced to the
// one thing every visitor has actually done on every one of these systems. The
// places below are where Microsoft put it, in order, and `place` is what a
// visitor has to relearn each time it changes.
//
// `placeIndex` groups releases that kept the same answer, so the count of
// distinct places is derived rather than asserted: releases sharing an index
// did not move it, and a change of index is a relearning event.

export interface RelearnStep {
  /** Matches WindowsRelease.id. */
  id: string;
  /** Distinct location. Equal indexes mean the answer did not move. */
  placeIndex: number;
  /** Short noun phrase naming the place, used mid-sentence. */
  place: string;
  /** What the visitor is looking at when they get it right. */
  detail: string;
}

export const relearnTask = "Start a program.";

export const relearnSteps: RelearnStep[] = [
  {
    id: "win1",
    placeIndex: 1,
    place: "the MS-DOS Executive file list",
    detail: "There is no list of programs — only a list of files. You start one by finding its .EXE and running it.",
  },
  {
    id: "win2",
    placeIndex: 1,
    place: "the MS-DOS Executive file list",
    detail: "Unchanged from Windows 1.0. Overlapping windows arrived; the way you launch anything did not.",
  },
  {
    id: "win3",
    placeIndex: 2,
    place: "a Program Manager group",
    detail: "Programs become icons living inside group windows — Main, Accessories — that you open first.",
  },
  {
    id: "win95",
    placeIndex: 3,
    place: "the Start button",
    detail: "One button, bottom left, opening a menu: Start → Programs. Microsoft advertised it with a song.",
  },
  {
    id: "win98",
    placeIndex: 3,
    place: "the Start button",
    detail: "Still Start → Programs. Quick Launch appears beside it, but the answer has not moved.",
  },
  {
    id: "win2000",
    placeIndex: 3,
    place: "the Start button",
    detail: "Still Start → Programs, now on the business line as well as the home one.",
  },
  {
    id: "winxp",
    placeIndex: 4,
    place: "the start button",
    detail: "The menu becomes two columns and Programs is renamed All Programs — the same place, relabelled.",
  },
  {
    id: "vista",
    placeIndex: 5,
    place: "the Start orb",
    detail: "The word Start disappears from the button itself, and a search box takes over from browsing the list.",
  },
  {
    id: "win7",
    placeIndex: 5,
    place: "the Start orb",
    detail: "Same orb, same search box. Pinning to the taskbar becomes the faster route for programs you use daily.",
  },
  {
    id: "win8",
    placeIndex: 6,
    place: "the full-screen Start screen",
    detail: "The button is gone. Start is now the whole screen, and there is nothing in the corner to click.",
  },
  {
    id: "win10",
    placeIndex: 7,
    place: "the Start button",
    detail: "The button returns after the backlash, opening a menu with the tiles folded into its right half.",
  },
  {
    id: "win11",
    placeIndex: 8,
    place: "the centred Start button",
    detail: "The button survives but the corner does not: Start moves to the middle of the taskbar.",
  },
];

export function getRelearnStep(id: string) {
  const step = relearnSteps.find((item) => item.id === id);
  if (!step) throw new Error(`no relearn step for release ${id}`);
  return step;
}

/** The release before this one, or undefined for Windows 1.0. */
export function getPreviousRelearnStep(id: string) {
  const index = relearnSteps.findIndex((item) => item.id === id);
  return index > 0 ? relearnSteps[index - 1] : undefined;
}

/** Distinct places across all twelve releases. */
export function countRelearnPlaces() {
  return new Set(relearnSteps.map((step) => step.placeIndex)).size;
}

/** How many times the answer moved: one fewer than the number of places. */
export function countRelearnMoves() {
  return countRelearnPlaces() - 1;
}

/** Which place this release is, counting from 1. */
export function relearnPlaceNumber(id: string) {
  return getRelearnStep(id).placeIndex;
}

/** True when this release moved the answer from where the previous one put it. */
export function movedThisRelease(id: string) {
  const previous = getPreviousRelearnStep(id);
  return previous ? previous.placeIndex !== getRelearnStep(id).placeIndex : false;
}
