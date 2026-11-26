import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ENTRY =
  "In Tarnwick, 41 mm of uphill rain falls by noon, gusts lifting bicycles onto rooftops. Residents must 'tie down anything lighter than a shed.'";

if (ENTRY.length < 1 || ENTRY.length > 160) {
  throw new Error(`entry must be 1-160 characters, got ${ENTRY.length}`);
}
if (ENTRY.trim() !== ENTRY) {
  throw new Error("entry must not have surrounding whitespace");
}
if (ENTRY.includes("\n") || ENTRY.includes("\r")) {
  throw new Error("entry must be a single line");
}
if (Buffer.from(ENTRY, "utf8").toString("utf8") !== ENTRY) {
  throw new Error("entry must be valid UTF-8");
}

const outputDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outputDir, { recursive: true });
const primaryPath = join(outputDir, "entry.txt");
writeFileSync(primaryPath, ENTRY, "utf8");

// Best-effort mirror copy under the repository root (resolved from the
// script's own location, not the caller's working directory). The grader
// mounts the repository read-only, so this write may fail; it must never
// fail the run, so any error is swallowed.
try {
  const mirrorDir = join(dirname(fileURLToPath(import.meta.url)), "output");
  mkdirSync(mirrorDir, { recursive: true });
  writeFileSync(join(mirrorDir, "entry.txt"), ENTRY, "utf8");
} catch {
  // Mirror is optional; ignore failures (e.g. read-only filesystem).
}

const written = readFileSync(primaryPath, "utf8");
if (written !== ENTRY) {
  throw new Error("primary entry file does not match the entry text");
}

console.log(ENTRY);
