import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const LINE =
  "In Tarnwick, 41 mm of uphill rain falls by noon, gusts lifting bicycles onto rooftops. Residents must 'tie down anything lighter than a shed.'";

const chars = [...LINE];
if (chars.length < 1 || chars.length > 160) {
  throw new Error(`entry line must be 1-160 characters, got ${chars.length}`);
}
if (LINE.includes("\n") || LINE.includes("\r") || LINE.trim() !== LINE) {
  throw new Error("entry line must be a single line with no surrounding whitespace");
}
if (Buffer.from(LINE, "utf8").toString("utf8") !== LINE) {
  throw new Error("entry line is not valid UTF-8");
}

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", LINE, "utf8");

const repoRoot = dirname(fileURLToPath(import.meta.url));
const mirrorDir = join(repoRoot, "output");
mkdirSync(mirrorDir, { recursive: true });
writeFileSync(join(mirrorDir, "entry.txt"), LINE, "utf8");

if (
  readFileSync("/output/entry.txt", "utf8") !== LINE ||
  readFileSync(join(mirrorDir, "entry.txt"), "utf8") !== LINE
) {
  throw new Error("written entry.txt does not match the entry line");
}

console.log(LINE);
