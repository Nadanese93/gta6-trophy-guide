import { existsSync, mkdirSync, readFileSync, readdirSync, copyFileSync, statSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const SOURCE_DIR = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR || "/output";

function main(): void {
  if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });
  copyDirectory(join(SOURCE_DIR, "app"), join(OUTPUT_DIR, "app"));
  copyDirectory(join(SOURCE_DIR, "screenshots"), join(OUTPUT_DIR, "screenshots"));
  const dossier = buildDossier(OUTPUT_DIR, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  });
  // buildDossier returns the dossier file's bytes, not an object: write them as-is.
  writeFileSync(join(OUTPUT_DIR, "dossier.json"), dossier);
}

function copyDirectory(from: string, to: string): void {
  if (!existsSync(from)) return;
  mkdirSync(to, { recursive: true });
  for (const name of readdirSync(from)) {
    const src = join(from, name);
    const dst = join(to, name);
    if (statSync(src).isDirectory()) copyDirectory(src, dst);
    else copyFileSync(src, dst);
  }
}

main();
