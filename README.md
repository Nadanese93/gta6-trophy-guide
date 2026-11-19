[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Nadanese93/gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/Nadanese93/gta6-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

# Leonida Trophy Atlas — GTA VI Trophy Guide & Tracker

Entry for the make.fun bounty **"Build the best GTA 6 trophy guide"** — [https://make.fun/bounty/gta6-trophy-guide-01](https://make.fun/bounty/gta6-trophy-guide-01).
$250 USDC over the top 50, deadline **Friday 21 Nov 2026 18:00 WIB (11:00 UTC)**. Free entry.

## What it is

An offline guide and tracker for all **55 official PlayStation 5 trophies of Grand Theft Auto VI** (1 Platinum, 2 Gold, 6 Silver, 46 Bronze; 1,000 Gamerscore on Xbox; 28 hidden; 0 online). Open `app/index.html` in desktop Chrome — every file loads locally, no network.

- **Saved checklist** — tick trophies as you earn them (localStorage), with progress counters for the 20 trophies that carry a PSN target (250 stunts, 18 meditation spots, 100 WAiNK locations…), plus export/import of your progress as JSON.
- **Filters & spoiler setting** — filter by grade, kind, missable-only, earned-only; search by name or keyword. The 12 story trophies stay locked (name and description hidden) until you earn them, while the spoiler setting is on.
- **Platinum roadmap** — 3 phases (~200 hours) and the full 35-item 100% completion checklist with its exact numbers, plus a 6-step save strategy for a game with no mission replay.
- **Missables** — the one trophy that can truly be missed (Positive Mental Attitude, Lucia’s Chapter 1 balcony meditation) and the time-sensitive Race Against Yago, flagged in their own view.
- **Cited guides** — every trophy’s guide is written in the author’s own words and names its sources (PSNProfiles, Output Lag, KeenGamer). Five trophies had no confirmed unlock method at launch and are marked `verified: false` instead of guessed.

## Running it

```sh
node serve.ts        # serves app/ at http://localhost:8080
```

Then open `http://localhost:8080` in desktop Chrome. (Opening `app/index.html` directly does not load the data, because browsers block `fetch` from `file://` — the page tells you so.)

`main.ts` (Node 22, standard library only) hands the guide in: it copies `app/` and `screenshots/` to `/output` and writes `/output/dossier.json` with `vendor/makefun-frontend.ts` (the kit’s file, byte-for-byte).

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Data

`app/data/trophies.json` — the 55 official trophies with their official names, descriptions, grades, Gamerscore, PSN progress targets, kind, hidden/story/missable flags, a guide in the author’s own words, sources and verification status. Names, descriptions and grades match the official PS5 list (PSNProfiles) and the kit’s frozen list, verified 19 Nov 2026.

`app/data/roadmap.json` — the 3-phase roadmap, the 35-item 100% checklist and the save strategy.

## Sources

- PSNProfiles — Grand Theft Auto VI Trophies (psnprofiles.com/trophies/43531-grand-theft-auto-vi): official names, descriptions, PSN progress targets
- Output Lag — GTA 6 Trophy List (outputlag.com/guides/gta-6-trophy-list/): grades, Gamerscore, unlock methods, missable and time-sensitive warnings
- KeenGamer — GTA 6 Trophy Guide & Platinum Roadmap (keengamer.com/articles/guides/gta-6-trophy-guide-platinum-roadmap-all-55-trophies/): roadmap and 100% checklist numbers
- GTA VI Vice City Hub (gtavicecityhub.com/achievements): full list and 100% checklist

Unofficial fan guide. Grand Theft Auto and GTA are trademarks of Rockstar Games / Take-Two Interactive. No Rockstar logo, artwork or game screenshots are used here.

## Judging

An AI judge compares guides pairwise from their screenshots and source outlines, ranking by win rate; the top 50 share $250. The first valid entry is hosted on makefun.sh.
