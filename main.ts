// Leonida Trophy Atlas — entry program for gta6-trophy-guide-01 (Node 22, stdlib only).
//
// The guide itself is the static app/ folder: index.html + app.js + style.css +
// data/trophies.json + data/roadmap.json, plain files a browser opens offline.
// This program hands it in: it copies app/ and screenshots/ from beside this
// file into the output directory and writes output/dossier.json, the summary
// the judge reads, using buildDossier from the kit's vendored library
// (vendor/makefun-frontend.ts, left exactly as the kit shipped it — the scorer
// rebuilds the dossier with its own copy and compares the two byte for byte).
//
// Paths are resolved from this file's own location, never from the working
// directory: the grader runs `node /bot/main.ts` with a cwd that is not /bot
// and a read-only /bot. The output directory is /output, or MAKEFUN_OUTPUT_DIR
// when set (local runs: `mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts`).

import { cpSync, existsSync, mkdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function fail(message) {
  throw new Error(`leonida-trophy-atlas: ${message}`);
}

function copyEntryTree() {
  const appDir = join(repoRoot, 'app');
  if (!existsSync(join(appDir, 'index.html'))) fail('app/index.html is missing');
  if (!existsSync(join(appDir, 'data', 'trophies.json'))) fail('app/data/trophies.json is missing');
  mkdirSync(outDir, { recursive: true });
  cpSync(appDir, join(outDir, 'app'), { recursive: true });
  const shotsDir = join(repoRoot, 'screenshots');
  mkdirSync(join(outDir, 'screenshots'), { recursive: true });
  if (existsSync(shotsDir)) {
    cpSync(shotsDir, join(outDir, 'screenshots'), { recursive: true });
  }
  const shots = ['1-checklist.jpg', '2-roadmap.jpg', '3-missables.jpg', '4-filters.jpg'];
  for (const shot of shots) {
    const file = join(outDir, 'screenshots', shot);
    if (!existsSync(file)) fail(`screenshots/${shot} is missing`);
    if (statSync(file).size > 262144) fail(`screenshots/${shot} is over the 256 KiB cap`);
  }
}

// The scorer's caps: text_max_bytes shapes the dossier's bytes; the rest refuse
// an entry the scorer would refuse (more than 4 screenshots or one over 256 KiB;
// more than 993 files and directories in app/ or 48 MiB of app files — app/
// shares /output's own 1000-entry cap with screenshots/ and dossier.json).
const DOSSIER_CAPS = {
  app_max_bytes: 50331648,
  app_max_files: 993,
  screenshots: { max: 4, max_bytes: 262144 },
  text_max_bytes: 163840,
};

copyEntryTree();
writeFileSync(join(outDir, 'dossier.json'), buildDossier(outDir, DOSSIER_CAPS));
