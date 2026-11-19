/** Saved progress: earned trophies, PSN-target counters, spoiler setting. */
const KEY = 'leonida-ledger-v1';

function blank() {
  return { earned: [], counts: {}, spoilers: true };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return blank();
    const parsed = JSON.parse(raw);
    return {
      earned: Array.isArray(parsed.earned) ? parsed.earned : [],
      counts: parsed.counts && typeof parsed.counts === 'object' ? parsed.counts : {},
      spoilers: parsed.spoilers !== false,
    };
  } catch {
    return blank();
  }
}

export function saveState(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

/** Demo seed (?demo=1): 13 trophies earned so screenshots show real progress. */
export const DEMO_EARNED = [
  'Just Like Paradise',
  'Paradise Lost',
  'Trust',
  'Family Matters',
  'DWNFALL',
  'Baited My Tackle',
  'Stick Fiddler',
  'Positive Mental Attitude',
  'Sneakthief',
  'Catch Me If You Can',
  'Little Boxes',
  'On the Spot',
  'Master of None',
];

export function applyDemo(state) {
  const params = new URLSearchParams(location.search);
  if (params.get('demo') !== '1') return state;
  const seeded = { ...state, earned: [...new Set([...state.earned, ...DEMO_EARNED])] };
  seeded.counts = {
    ...seeded.counts,
    'Cunning Stunts': 141,
    'One Last Thing': 42,
    "Don't Touch My Deck": 2,
    'Whip It Good': 63,
    'The Goodtime State': 31,
  };
  return seeded;
}

export function exportProgress(state) {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'leonida-ledger-progress.json';
  a.click();
  URL.revokeObjectURL(url);
}

export async function importProgress(file) {
  const text = await file.text();
  const parsed = JSON.parse(text);
  if (!parsed || typeof parsed !== 'object') throw new Error('not a progress file');
  return {
    earned: Array.isArray(parsed.earned) ? parsed.earned : [],
    counts: parsed.counts && typeof parsed.counts === 'object' ? parsed.counts : {},
    spoilers: parsed.spoilers !== false,
  };
}
