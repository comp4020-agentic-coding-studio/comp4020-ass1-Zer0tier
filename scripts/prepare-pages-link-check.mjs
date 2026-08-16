import { existsSync, symlinkSync } from "node:fs";
import { resolve } from "node:path";

const pagesBase = resolve("dist", "comp4020-ass1-Zer0tier");

// Linkinator serves dist at `/`, while GitHub Pages serves it below the repo
// name. This generated alias gives the local crawler the same URL shape.
if (!existsSync(pagesBase)) symlinkSync(".", pagesBase, "dir");
