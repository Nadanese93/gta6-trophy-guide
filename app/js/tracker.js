/** The tracker: the 55-trophy checklist with search, grade/kind filters and the To do filter. */
import { openTrophyDialog } from './guide.js';

export function trophyDisplayName(trophy, state) {
  if (trophy.hidden && state.spoilers && !state.earned.includes(trophy.name)) {
    return 'Hidden Trophy';
  }
  return trophy.name;
}

export function trophyDisplayDesc(trophy, state) {
  if (trophy.hidden && state.spoilers && !state.earned.includes(trophy.name)) {
    return 'Hidden on PlayStation until earned. Earn it to reveal its name and description.';
  }
  return trophy.description;
}

function matchesFilters(trophy, filters, state) {
  const earned = state.earned.includes(trophy.name);
  if (filters.grade && trophy.grade !== filters.grade) return false;
  if (filters.kind && trophy.kind !== filters.kind) return false;
  if (filters.missableOnly && !trophy.missable) return false;
  if (filters.earnedOnly && !earned) return false;
  if (filters.todoOnly && earned) return false;
  if (filters.query) {
    const q = filters.query.toLowerCase();
    const hay = `${trophy.name} ${trophy.description} ${trophy.guide}`.toLowerCase();
    if (!hay.includes(q)) return false;
  }
  return true;
}

export function renderTracker(listEl, hintEl, trophies, filters, state, onToggle) {
  const shown = trophies.filter((t) => matchesFilters(t, filters, state));
  const earnedCount = state.earned.length;
  hintEl.textContent = `Showing ${shown.length} of 55 trophies · ${earnedCount} earned · ${55 - earnedCount} to go.`;
  listEl.innerHTML = '';
  for (const trophy of shown) {
    const earned = state.earned.includes(trophy.name);
    const li = document.createElement('li');
    li.className = `trophy-row${earned ? ' earned' : ''}`;
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned;
    box.setAttribute('aria-label', `Mark ${trophy.name} earned`);
    box.addEventListener('click', (event) => {
      event.stopPropagation();
      onToggle(trophy.name, box.checked);
    });
    const body = document.createElement('div');
    const name = document.createElement('div');
    name.className = 'trophy-name';
    name.textContent = trophyDisplayName(trophy, state);
    const desc = document.createElement('div');
    desc.className = 'trophy-desc';
    desc.textContent = trophyDisplayDesc(trophy, state);
    const flags = document.createElement('div');
    flags.className = 'trophy-flags';
    if (trophy.hidden) {
      const f = document.createElement('span');
      f.className = 'flag hidden-flag';
      f.textContent = 'Hidden';
      flags.appendChild(f);
    }
    if (trophy.missable) {
      const f = document.createElement('span');
      f.className = 'flag missable';
      f.textContent = 'Missable';
      flags.appendChild(f);
    }
    if (!trophy.verified) {
      const f = document.createElement('span');
      f.className = 'flag unverified';
      f.textContent = 'Unverified';
      flags.appendChild(f);
    }
    if (trophy.target) {
      const current = state.counts[trophy.name] || 0;
      const f = document.createElement('span');
      f.className = 'target-note';
      f.textContent = `PSN target: ${current}/${trophy.target.n} ${trophy.target.unit}`;
      flags.appendChild(f);
    }
    body.append(name, desc, flags);
    const grade = document.createElement('div');
    grade.innerHTML = `<span class="grade-dot grade-${trophy.grade}"></span><span class="grade-label">${trophy.grade}</span> · ${trophy.gamerscore}G`;
    li.append(box, body, grade);
    li.addEventListener('click', () => openTrophyDialog(trophy, state, onToggle));
    listEl.appendChild(li);
  }
  if (shown.length === 0) {
    const li = document.createElement('li');
    li.className = 'trophy-row';
    li.textContent = 'No trophies match these filters.';
    listEl.appendChild(li);
  }
}
