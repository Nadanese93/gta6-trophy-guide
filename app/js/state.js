/* Saved progress: localStorage only, exportable to a file and importable back. */
const STORAGE_KEY = "leonida-field-guide-v1";

/** The demo seed for screenshots: 13 trophies earned, counters part way. */
const DEMO_EARNED = [
  "Just Like Paradise", "Paradise Lost", "Trust", "Baited My Tackle",
  "Stick Fiddler", "Let's Go Bowling", "Little Boxes", "On the Spot",
  "Catch Me If You Can", "Challenging Tank", "Gunslinger", "Master of None",
  "Whip It Good"
];
const DEMO_COUNTS = {
  "Cunning Stunts": 141, "One Last Thing": 23, "The Goodtime State": 31,
  "You WAiNKer!": 47, "Don't Touch My Deck": 1, "Actions Speak Louder": 212,
  "Positive Mental Attitude": 7, "Top Fun": 6, "Earn Cash, Not Kudos": 9
};

/** A fresh, empty state. */
export function freshState() {
  return {
    earned: new Set(),
    counts: {},
    tasks: {},
    spoiler: true
  };
}

/** Loads the saved state, or a fresh one when nothing is saved. */
export function loadState() {
  const state = freshState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return state;
    const doc = JSON.parse(raw);
    if (Array.isArray(doc.earned)) state.earned = new Set(doc.earned);
    if (doc.counts && typeof doc.counts === "object") state.counts = doc.counts;
    if (doc.tasks && typeof doc.tasks === "object") state.tasks = doc.tasks;
    if (typeof doc.spoiler === "boolean") state.spoiler = doc.spoiler;
  } catch {
    // A corrupt save is ignored; the tracker starts empty instead of crashing.
  }
  return state;
}

/** Persists the state to localStorage. */
export function saveState(state) {
  const doc = {
    earned: [...state.earned],
    counts: state.counts,
    tasks: state.tasks,
    spoiler: state.spoiler,
    savedAt: new Date().toISOString()
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(doc));
}

/** Toggles one trophy's earned flag and persists. */
export function toggleEarned(state, name) {
  if (state.earned.has(name)) state.earned.delete(name);
  else state.earned.add(name);
  saveState(state);
}

/** Sets a PSN progress counter for one trophy and persists. */
export function setCount(state, name, value, target) {
  const n = Math.max(0, Math.min(target, Math.floor(value) || 0));
  if (n === 0) delete state.counts[name];
  else state.counts[name] = n;
  saveState(state);
}

/** Toggles one roadmap task's done flag and persists. */
export function toggleTask(state, key) {
  state.tasks[key] = !state.tasks[key];
  if (!state.tasks[key]) delete state.tasks[key];
  saveState(state);
}

/** Serialises the state for export. */
export function exportState(state) {
  return JSON.stringify({
    app: "Leonida Field Guide",
    version: 1,
    earned: [...state.earned],
    counts: state.counts,
    tasks: state.tasks,
    spoiler: state.spoiler
  }, null, 2);
}

/** Parses an imported state file; returns null when it is not a valid export. */
export function importState(text) {
  try {
    const doc = JSON.parse(text);
    if (!Array.isArray(doc.earned)) return null;
    const state = freshState();
    state.earned = new Set(doc.earned.filter((n) => typeof n === "string"));
    if (doc.counts && typeof doc.counts === "object") state.counts = doc.counts;
    if (doc.tasks && typeof doc.tasks === "object") state.tasks = doc.tasks;
    if (typeof doc.spoiler === "boolean") state.spoiler = doc.spoiler;
    return state;
  } catch {
    return null;
  }
}

/** Seeds the demo state (?demo=1 in the URL) for screenshots: 13 earned, counters part way. */
export function seedDemo(state) {
  state.earned = new Set(DEMO_EARNED);
  state.counts = { ...DEMO_COUNTS };
}
