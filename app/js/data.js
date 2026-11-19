/** Loads the guide's data files: the 55 trophies and the 7-stage roadmap. */
export async function loadData() {
  const [trophiesRes, roadmapRes] = await Promise.all([
    fetch('data/trophies.json'),
    fetch('data/roadmap.json'),
  ]);
  if (!trophiesRes.ok) throw new Error('trophies.json did not load');
  if (!roadmapRes.ok) throw new Error('roadmap.json did not load');
  const trophies = (await trophiesRes.json()).trophies;
  const roadmap = await roadmapRes.json();
  return { trophies, roadmap };
}

/** The 12 story trophies the spoiler lock hides until earned. */
export function storyTrophies(trophies) {
  return trophies.filter((t) => t.hidden && t.kind === 'story' && t.stage !== 'side-stories');
}
