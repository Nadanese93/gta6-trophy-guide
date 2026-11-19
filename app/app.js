// Leonida Trophy Atlas — offline tracker + cited guide for the 55 GTA VI trophies.
// Data lives in data/trophies.json and data/roadmap.json; progress lives in
// localStorage only. Nothing here fetches over the network.
const STORE_KEY = 'leonida-trophy-atlas-v1';
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];

function esc(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function defaultState() {
  return { counts: {}, earned: {}, roadmap: {}, spoilers: true };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return { ...defaultState(), ...parsed };
  } catch {
    return defaultState();
  }
}

function saveState() {
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
}

let trophies = [];
let roadmap = null;
let sourceList = {};
let state = loadState();

function gradeLabel(grade) {
  return grade.charAt(0).toUpperCase() + grade.slice(1);
}

function isLocked(trophy) {
  return state.spoilers && trophy.story && !state.earned[trophy.id];
}

function earnedCount() {
  return trophies.filter((t) => state.earned[t.id]).length;
}

function scoreSum() {
  return trophies
    .filter((t) => state.earned[t.id])
    .reduce((sum, t) => sum + (t.gamerscore || 0), 0);
}

function renderScoreboard() {
  const earned = earnedCount();
  $('#earnedCount').textContent = String(earned);
  $('#scoreCount').textContent = `${scoreSum()}G`;
  $('#pctCount').textContent = `${Math.round((earned / Math.max(trophies.length, 1)) * 100)}%`;
  const bar = $('#progressBar');
  bar.setAttribute('aria-valuenow', String(earned));
  bar.setAttribute('aria-valuemax', String(trophies.length));
  $('#progressFill').style.width = `${(earned / Math.max(trophies.length, 1)) * 100}%`;
}

function trophyMatches(trophy) {
  const q = $('#q').value.trim().toLowerCase();
  if (q) {
    const hay = `${trophy.name} ${trophy.description} ${trophy.guide} ${trophy.kind}`.toLowerCase();
    if (!hay.includes(q)) return false;
  }
  const grade = $('#gradeFilter').value;
  if (grade !== 'all' && trophy.grade !== grade) return false;
  const kind = $('#kindFilter').value;
  if (kind !== 'all') {
    if (kind === 'missable') {
      if (!trophy.missable) return false;
    } else if (kind === 'story') {
      if (!trophy.story) return false;
    } else if (trophy.kind !== kind) return false;
  }
  if ($('#missableOnly').checked && !trophy.missable) return false;
  if ($('#earnedOnly').checked && !state.earned[trophy.id]) return false;
  if ($('#hideEarned').checked && state.earned[trophy.id]) return false;
  return true;
}

function counterHtml(trophy) {
  if (!trophy.target) return '';
  const current = state.counts[trophy.id] || 0;
  const unit = trophy.target_unit ? ` ${esc(trophy.target_unit)}` : '';
  return `<span class="counter">
    <button type="button" data-count="${esc(trophy.id)}" data-delta="-1" aria-label="Decrease progress">−</button>
    <span>${current}/${trophy.target}${unit}</span>
    <button type="button" data-count="${esc(trophy.id)}" data-delta="1" aria-label="Increase progress">+</button>
  </span>`;
}

function cardHtml(trophy) {
  const locked = isLocked(trophy);
  const earned = Boolean(state.earned[trophy.id]);
  const tags = [];
  if (trophy.hidden) tags.push('<span class="tag">Hidden</span>');
  if (trophy.story) tags.push('<span class="tag spoiler">Story</span>');
  if (trophy.missable) tags.push('<span class="tag warn">Missable</span>');
  if (trophy.verified === false) tags.push('<span class="tag warn">Unverified method</span>');
  const name = locked ? '??? — story trophy' : esc(trophy.name);
  const desc = locked ? 'Hidden until earned (spoiler setting is on).' : esc(trophy.description);
  return `<article class="card grade-${esc(trophy.grade)}${earned ? ' earned' : ''}" data-trophy="${esc(trophy.id)}" tabindex="0" role="button" aria-label="${locked ? 'Locked story trophy' : esc(trophy.name)}">
    <div class="card-top"><span class="chip ${esc(trophy.grade)}">${gradeLabel(trophy.grade)}</span><span class="gscore">${trophy.gamerscore}G</span></div>
    <div class="card-name">${name}</div>
    <div class="card-desc">${desc}</div>
    <div class="card-meta">${tags.join('')}</div>
    <div class="card-foot">
      <label class="earned-box"><input type="checkbox" data-earned="${esc(trophy.id)}"${earned ? ' checked' : ''}> Earned</label>
      ${counterHtml(trophy)}
    </div>
  </article>`;
}

function renderGrid() {
  const grid = $('#trophyGrid');
  const shown = trophies.filter(trophyMatches);
  grid.innerHTML = shown.map(cardHtml).join('');
  $('#emptyNote').hidden = shown.length > 0;
}

function sourceLinks(trophy) {
  return (trophy.sources || [])
    .map((key) => {
      const src = sourceList[key];
      if (!src) return esc(key);
      return `<a href="${esc(src.url)}" target="_blank" rel="noopener">${esc(src.name)}</a>`;
    })
    .join(', ');
}

function openDrawer(id) {
  const trophy = trophies.find((t) => t.id === id);
  if (!trophy) return;
  const locked = isLocked(trophy);
  const earned = Boolean(state.earned[trophy.id]);
  const current = state.counts[trophy.id] || 0;
  const targetLine = trophy.target
    ? `<p><strong>Progress:</strong> ${current} / ${trophy.target}${trophy.target_unit ? ` ${esc(trophy.target_unit)}` : ''} — use the − / + buttons on the card to track it.</p>`
    : '';
  const warn = trophy.missable
    ? `<div class="notice">Missable — the Chapter 1 balcony meditation disappears once Chapter 1 ends. There is no mission replay. Keep a Chapter 1 save until this trophy pops.</div>`
    : '';
  const unverified = trophy.verified === false
    ? `<div class="notice">Unverified at launch — no confirmed unlock method exists yet (checked 19 Nov 2026). This guide does not guess the method.</div>`
    : (trophy.verification_note
      ? `<div class="notice">${esc(trophy.verification_note)}</div>`
      : '');
  $('#drawerBody').innerHTML = `
    <span class="chip ${esc(trophy.grade)}">${gradeLabel(trophy.grade)} · ${trophy.gamerscore}G</span>
    <h2>${locked ? '??? — story trophy' : esc(trophy.name)}</h2>
    <p class="official">${locked ? 'Hidden until earned (spoiler setting is on).' : esc(trophy.description)}</p>
    <p><strong>Status:</strong> ${earned ? 'Earned' : 'Not yet earned'}${trophy.hidden ? ' · Hidden on PlayStation until earned' : ''}${trophy.story ? ' · Story trophy' : ''}</p>
    ${targetLine}${warn}${unverified}
    <h3>Guide</h3>
    <p class="guide-text">${locked ? 'Earn this trophy to reveal its guide.' : esc(trophy.guide)}</p>
    <h3>Sources</h3>
    <p>${sourceLinks(trophy)}</p>
    <p class="hint">Guides are written in the author’s own words. The official name and description are shown as PlayStation publishes them.</p>`;
  $('#drawer').hidden = false;
}

function closeDrawer() {
  $('#drawer').hidden = true;
}

function renderRoadmap() {
  const body = $('#roadmapBody');
  if (!roadmap) { body.innerHTML = ''; return; }
  body.innerHTML = roadmap.phases.map((phase) => `
    <section class="phase">
      <h3>${esc(phase.title)}</h3>
      <div class="hours">${esc(phase.hours)} · ~${esc(roadmap.total_hours)} total for the platinum</div>
      <p>${esc(phase.intro)}</p>
      <ol>${phase.steps.map((step) => `<li>${esc(step)}</li>`).join('')}</ol>
      <div class="trophy-chips">${phase.trophies.map((name) => {
        const t = trophies.find((x) => x.name === name);
        return t ? `<button type="button" data-open="${esc(t.id)}">${esc(name)}</button>` : '';
      }).join('')}</div>
    </section>`).join('');
  const tasks = roadmap.checklist_100.tasks;
  const done = tasks.filter((_, i) => state.roadmap[i]).length;
  $('#checklistCount').textContent = `(${done} of ${tasks.length} done)`;
  $('#checklist100').innerHTML = tasks.map((task, i) => {
    const req = task.required != null
      ? (task.total != null ? `${task.required}/${task.total}` : `${task.required}${task.unit === 'dollars' ? ' $' : ''}`)
      : '';
    return `<li class="${state.roadmap[i] ? 'done' : ''}"><input type="checkbox" data-check="${i}"${state.roadmap[i] ? ' checked' : ''}><span>${esc(task.label)}</span><span class="req">${esc(req)}</span></li>`;
  }).join('');
}

function renderMissables() {
  const body = $('#missableBody');
  const missable = trophies.filter((t) => t.missable);
  body.innerHTML = missable.map((t) => `
    <article class="miss-card">
      <h3>${esc(t.name)} — the one missable trophy</h3>
      <p><strong>Official description:</strong> ${esc(t.description)}</p>
      <p>${esc(t.guide)}</p>
      <p><strong>Sources:</strong> ${sourceLinks(t)}</p>
    </article>
    <article class="miss-card">
      <h3>Time-sensitive: Race Against Yago (Chapter 3)</h3>
      <p>Not a trophy of its own, but this Chapter 3 street race carries an hourglass icon and disappears if you wait. It feeds the Strangers &amp; Freaks strand count, so do it the moment it appears — and save first.</p>
      <p><strong>Source:</strong> Output Lag — GTA 6 Trophy List.</p>
    </article>`).join('');
  const steps = (roadmap && roadmap.save_strategy) ? roadmap.save_strategy.steps : [];
  $('#saveSteps').innerHTML = steps.map((s) => `<li>${esc(s)}</li>`).join('');
}

function renderSources() {
  $('#sourceList').innerHTML = Object.values(sourceList)
    .map((src) => `<li><a href="${esc(src.url)}" target="_blank" rel="noopener">${esc(src.name)}</a></li>`)
    .join('');
}

function switchView(name) {
  $$('.tab').forEach((tab) => tab.classList.toggle('active', tab.dataset.view === name));
  $$('.view').forEach((view) => { view.hidden = view.id !== `view-${name}`; });
  $('#toolbar').style.display = name === 'trophies' ? '' : 'none';
  if (name === 'roadmap') renderRoadmap();
  if (name === 'missables') renderMissables();
}

function bindEvents() {
  $$('.tab').forEach((tab) => tab.addEventListener('click', () => switchView(tab.dataset.view)));
  ['q', 'gradeFilter', 'kindFilter', 'missableOnly', 'earnedOnly', 'hideEarned'].forEach((id) => {
    const el = document.getElementById(id);
    el.addEventListener('input', renderGrid);
    el.addEventListener('change', renderGrid);
  });
  $('#trophyGrid').addEventListener('click', (event) => {
    const countBtn = event.target.closest('[data-count]');
    if (countBtn) {
      const id = countBtn.dataset.count;
      const trophy = trophies.find((t) => t.id === id);
      const next = Math.max(0, Math.min(trophy.target, (state.counts[id] || 0) + Number(countBtn.dataset.delta)));
      state.counts[id] = next;
      saveState();
      renderGrid();
      renderScoreboard();
      return;
    }
    const box = event.target.closest('[data-earned]');
    if (box) {
      const id = box.dataset.earned;
      state.earned[id] = box.checked;
      saveState();
      renderGrid();
      renderScoreboard();
      return;
    }
    const card = event.target.closest('[data-trophy]');
    if (card) openDrawer(card.dataset.trophy);
  });
  $('#trophyGrid').addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') return;
    const card = event.target.closest('[data-trophy]');
    if (card) openDrawer(card.dataset.trophy);
  });
  $('#drawerClose').addEventListener('click', closeDrawer);
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeDrawer();
  });
  $('#roadmapBody').addEventListener('click', (event) => {
    const btn = event.target.closest('[data-open]');
    if (!btn) return;
    switchView('trophies');
    openDrawer(btn.dataset.open);
  });
  $('#checklist100').addEventListener('change', (event) => {
    const box = event.target.closest('[data-check]');
    if (!box) return;
    state.roadmap[box.dataset.check] = box.checked;
    saveState();
    renderRoadmap();
  });
  $('#spoilerToggle').addEventListener('change', (event) => {
    state.spoilers = event.target.checked;
    saveState();
    renderGrid();
  });
  $('#exportBtn').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'leonida-trophy-atlas-progress.json';
    a.click();
    URL.revokeObjectURL(a.href);
  });
  $('#importFile').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    const note = $('#importNote');
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      if (!parsed || typeof parsed !== 'object' || !parsed.earned) throw new Error('bad file');
      state = { ...defaultState(), ...parsed };
      saveState();
      $('#spoilerToggle').checked = state.spoilers;
      renderScoreboard();
      renderGrid();
      renderRoadmap();
      note.hidden = false;
      note.textContent = `Imported progress from ${file.name}.`;
    } catch {
      note.hidden = false;
      note.textContent = 'That file could not be imported — it is not a progress export from this guide.';
    }
    event.target.value = '';
  });
  $('#resetBtn').addEventListener('click', () => {
    if (!window.confirm('Reset all earned trophies, counters and checklist ticks?')) return;
    state = defaultState();
    saveState();
    $('#spoilerToggle').checked = state.spoilers;
    renderScoreboard();
    renderGrid();
    renderRoadmap();
  });
}

async function init() {
  try {
    const [trophyDoc, roadDoc] = await Promise.all([
      (await fetch('data/trophies.json')).json(),
      (await fetch('data/roadmap.json')).json(),
    ]);
    trophies = trophyDoc.trophies;
    sourceList = trophyDoc.source_list || {};
    roadmap = roadDoc;
  } catch (error) {
    $('#loadError').hidden = false;
    return;
  }
  $('#spoilerToggle').checked = state.spoilers;
  bindEvents();
  renderScoreboard();
  renderGrid();
  renderSources();
  const params = new URLSearchParams(window.location.search);
  const view = params.get('view');
  if (view && ['trophies', 'roadmap', 'missables', 'settings'].includes(view)) switchView(view);
  const openId = params.get('trophy');
  if (openId) openDrawer(openId);
}

init();
