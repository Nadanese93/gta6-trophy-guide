/* Data access: loads the trophy list and the roadmap, and names the sources. */
export const SOURCES = {
  "PSNProfiles": "https://psnprofiles.com/trophies/43531-grand-theft-auto-vi",
  "Output Lag": "https://outputlag.com/guides/gta-6-trophy-list/",
  "KeenGamer": "https://www.keengamer.com/articles/guides/gta-6-trophy-guide-platinum-roadmap-all-55-trophies/",
  "Press Start": "https://press-start.com.au/news/2026/11/18/gta-6-trophy-list/"
};

/** Fetches app/data/trophies.json and returns its trophies array. */
export async function loadTrophies() {
  const res = await fetch("data/trophies.json");
  if (!res.ok) throw new Error("trophies.json could not be loaded");
  const doc = await res.json();
  return doc.trophies;
}

/** Fetches app/data/roadmap.json and returns the roadmap document. */
export async function loadRoadmap() {
  const res = await fetch("data/roadmap.json");
  if (!res.ok) throw new Error("roadmap.json could not be loaded");
  return res.json();
}

/** Finds one trophy by its official name. */
export function trophyByName(trophies, name) {
  return trophies.find((t) => t.name === name);
}

/** The 12 unmissable story trophies: narrative trophies outside the side-story stage. */
export function isUnmissableStory(trophy) {
  return trophy.kind === "story" && trophy.stage !== 5;
}

/** A trophy's progress as a share: 1 when earned, else its PSN counter over its target. */
export function trophyProgress(trophy, state) {
  if (state.earned.has(trophy.name)) return 1;
  if (trophy.psn_target) {
    const count = state.counts[trophy.name] || 0;
    return Math.min(1, count / trophy.psn_target);
  }
  return 0;
}

/** Gamerscore earned from the trophies the player has earned. */
export function gamerscoreEarned(trophies, state) {
  return trophies.reduce((sum, t) => sum + (state.earned.has(t.name) ? t.gamerscore : 0), 0);
}
