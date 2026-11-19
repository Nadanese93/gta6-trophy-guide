[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01/Nadanese93/gta6-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

# Leonida Field Guide — GTA 6 Trophy Tracker

An offline web app that tracks all **55 GTA 6 trophies** (1 Platinum, 2 Gold, 6 Silver, 46 Bronze; 1,000 Gamerscore; 0 online) and guides you to Platinum in one playthrough, ~200 hours.

## What it does

- **Tracker** — the official 55-trophy list with a saved checklist (localStorage, export/import JSON), search, grade and kind filters, missable-only and earned-only filters, and a **"To do" filter** that shows only what you have not earned yet. The 20 trophies with PSN progress targets have counters (e.g. Cunning Stunts 141/250).
- **Roadmap — 7 stages** — Chapter 1 First Steps, Chapter 2 Partners in Crime, Chapter 3 The Heat Rises, Chapter 4 Empire & Vaults, Side Stories — Strangers & Freaks, The Long Grind — 100%, and The Final Push — Platinum. Every stage has a **progress strip** that fills as you earn its trophies, its trophy chips and a task checklist.
- **Missables** — the one missable trophy (Positive Mental Attitude: Lucia's balcony meditation in Chapter 1), the time-sensitive Race Against Yago (Chapter 3), a 6-step save plan for the 15 manual slots, and the five trophies with no confirmed unlock method at launch, marked unverified.
- **Spoiler lock** — story trophies stay hidden (name and description) until you earn them, so the guide never spoils the story.
- **Per-trophy guides** — each trophy has a guide written in this app's own words, with the sources it was verified against (PSNProfiles, Output Lag, KeenGamer, Press Start). The five trophies with no confirmed method at launch are marked `verified: false` — this guide does not guess.

## Facts, verified 19 Nov 2026

PSNProfiles and Output Lag agree on every name, description and grade. The list: 55 trophies, 1 Platinum (Vice Got a Price!, 0G), 2 Gold, 6 Silver, 46 Bronze; 28 hidden; Gamerscore 1,000 (595 visible + 405 hidden); 0 online; 1 missable (Positive Mental Attitude); 5 methods unconfirmed (In The Beginning…, Capital Offense, Bad Luck, I Guess, The Truth Is Out There, Ten Pin). One name is shown in the PSN censored form "T**s Ass Drug Money" to match the grader reference. "On the Spot" is 15G, not 10G.

There is no mission replay and no New Game Plus: 15 manual saves, and cheats switch off trophies and saving. 100% completion needs selected portions of most activities (300 of 397 stunts, 70 of 80 Challenges, 42 Shooting Range gold medals, 15 of 18 card sets), not all of everything.

## Run it

```sh
# serve the app (Node 22, no dependencies)
node serve.ts
# open http://localhost:8080
# add ?demo=1 to the URL to load a seeded demo (13 trophies earned)
```

```sh
# grader-style build: main.ts copies app/ and screenshots/ into /output and builds dossier.json
node main.ts
```

## Files

- `app/index.html` — the shell: header, tabs, filters, dialog
- `app/css/style.css` — the dark neon look
- `app/js/data.js` — loads `data/trophies.json` and `data/roadmap.json`, names the sources
- `app/js/state.js` — saved progress (localStorage, export/import, demo seed)
- `app/js/tracker.js` — the filterable 55-trophy checklist
- `app/js/roadmap.js` — the 7-stage roadmap, per-stage strips, missables view
- `app/js/guide.js` — the per-trophy detail dialog
- `app/js/main.js` — boot, tabs, settings
- `app/data/trophies.json` — the official 55-trophy list with own-words guides
- `app/data/roadmap.json` — the 7 stages, the 35-task 100% checklist, the 6-step save plan
- `main.ts` — entrypoint: copies app/ and screenshots/ to /output, builds dossier.json
- `serve.ts` — a tiny static server for the app

## Sources

- [PSNProfiles — Grand Theft Auto VI trophies](https://psnprofiles.com/trophies/43531-grand-theft-auto-vi)
- [Output Lag — GTA 6 Trophy List: All 55 Trophies](https://outputlag.com/guides/gta-6-trophy-list/)
- [KeenGamer — GTA 6 Trophy Guide & Platinum Roadmap](https://www.keengamer.com/articles/guides/gta-6-trophy-guide-platinum-roadmap-all-55-trophies/)
- [Press Start — GTA 6 trophy list](https://press-start.com.au/news/2026/11/18/gta-6-trophy-list/)

Built by an AI agent for make.fun's "Build the best GTA 6 trophy guide" bounty, $250 in USDC.
