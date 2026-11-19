/** The roadmap: 7 stages with per-stage progress strips, the 100% checklist, missables and the save plan. */
import { trophyDisplayName } from './tracker.js';

export function renderRoadmap(container, trophies, roadmap, state) {
  container.innerHTML = '';
  for (const stage of roadmap.stages) {
    const members = trophies.filter((t) => t.stage === stage.id);
    const earned = members.filter((t) => state.earned.includes(t.name)).length;
    const pct = members.length === 0 ? 0 : Math.round((earned / members.length) * 100);
    const card = document.createElement('article');
    card.className = 'stage-card';
    const title = document.createElement('h2');
    title.textContent = stage.title;
    const blurb = document.createElement('p');
    blurb.textContent = stage.blurb;
    const strip = document.createElement('div');
    strip.className = 'strip';
    const fill = document.createElement('span');
    fill.style.width = `${pct}%`;
    strip.appendChild(fill);
    const count = document.createElement('div');
    count.className = 'stage-count';
    count.textContent = `${earned} of ${members.length} trophies · ${pct}%`;
    const tasks = document.createElement('ul');
    tasks.className = 'stage-tasks';
    for (const task of stage.tasks) {
      const li = document.createElement('li');
      li.textContent = task;
      tasks.appendChild(li);
    }
    const names = document.createElement('div');
    names.className = 'stage-trophies';
    names.textContent = members.map((t) => trophyDisplayName(t, state)).join(' · ');
    card.append(title, blurb, strip, count, tasks, names);
    container.appendChild(card);
  }
}

export function renderCompletionTasks(listEl, roadmap, state, onToggleTask) {
  listEl.innerHTML = '';
  roadmap.completion_tasks.forEach((task, i) => {
    const key = `task-${i}`;
    const li = document.createElement('li');
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = Boolean(state.completionTasks && state.completionTasks[key]);
    box.addEventListener('change', () => onToggleTask(key, box.checked));
    const label = document.createElement('span');
    label.textContent = task.label;
    li.append(box, label);
    listEl.appendChild(li);
  });
}

export function renderMissables(cardsEl, unverifiedEl, trophies, roadmap, state) {
  const pma = trophies.find((t) => t.name === 'Positive Mental Attitude');
  const card = document.createElement('article');
  card.className = 'missable-card';
  const title = document.createElement('h2');
  title.textContent = 'Positive Mental Attitude — the one missable trophy';
  const body = document.createElement('p');
  body.textContent = pma ? pma.guide : '';
  const race = document.createElement('p');
  race.textContent = 'Race Against Yago is time-sensitive: this Chapter 3 race in Yago’s street racing strand carries an hourglass icon and counts toward Strangers & Freaks. Save first, then race the moment it appears.';
  card.append(title, body, race);
  cardsEl.innerHTML = '';
  cardsEl.appendChild(card);

  const planEl = document.getElementById('savePlan');
  planEl.innerHTML = '';
  for (const step of roadmap.save_plan) {
    const li = document.createElement('li');
    li.textContent = step.text;
    planEl.appendChild(li);
  }

  const unverified = trophies.filter((t) => !t.verified);
  unverifiedEl.innerHTML = '';
  for (const trophy of unverified) {
    const li = document.createElement('li');
    li.className = 'trophy-row';
    const name = document.createElement('div');
    name.className = 'trophy-name';
    name.textContent = trophy.name;
    const desc = document.createElement('div');
    desc.className = 'trophy-desc';
    desc.textContent = `${trophy.description} — no confirmed unlock method at launch.`;
    const wrap = document.createElement('div');
    wrap.append(name, desc);
    li.appendChild(wrap);
    unverifiedEl.appendChild(li);
  }
}
