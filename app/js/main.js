/** Boot: loads the data, renders the three views, wires filters, tabs and import/export. */
import { loadData } from './data.js';
import { loadState, saveState, applyDemo, exportProgress, importProgress } from './state.js';
import { renderTracker } from './tracker.js';
import { renderRoadmap, renderCompletionTasks, renderMissables } from './roadmap.js';
import { wireDialogCounter } from './guide.js';

const filters = { query: '', grade: '', kind: '', missableOnly: false, earnedOnly: false, todoOnly: false };

async function boot() {
  const { trophies, roadmap } = await loadData();
  let state = applyDemo(loadState());
  if (!state.completionTasks) state.completionTasks = {};

  const listEl = document.getElementById('trophyList');
  const hintEl = document.getElementById('trackerHint');
  const ringEl = document.getElementById('earnedCount');

  function renderAll() {
    saveState(state);
    ringEl.textContent = String(state.earned.length);
    renderTracker(listEl, hintEl, trophies, filters, state, toggleEarned);
    renderRoadmap(document.getElementById('roadmapStages'), trophies, roadmap, state);
    renderCompletionTasks(document.getElementById('completionTasks'), roadmap, state, toggleTask);
    renderMissables(
      document.getElementById('missableCards'),
      document.getElementById('unverifiedList'),
      trophies,
      roadmap,
      state,
    );
    document.getElementById('spoilerToggle').textContent = state.spoilers ? 'Spoilers: hidden' : 'Spoilers: shown';
    document.getElementById('spoilerToggle').setAttribute('aria-pressed', String(state.spoilers));
  }

  function toggleEarned(name, earned) {
    if (earned && !state.earned.includes(name)) state.earned.push(name);
    if (!earned) state.earned = state.earned.filter((n) => n !== name);
    renderAll();
  }

  function toggleTask(key, done) {
    if (!state.completionTasks) state.completionTasks = {};
    state.completionTasks[key] = done;
    saveState(state);
  }

  wireDialogCounter(state, (name, value) => {
    state.counts[name] = value;
    renderAll();
  });

  document.getElementById('searchBox').addEventListener('input', (e) => {
    filters.query = e.target.value;
    renderTracker(listEl, hintEl, trophies, filters, state, toggleEarned);
  });
  document.getElementById('gradeFilter').addEventListener('change', (e) => {
    filters.grade = e.target.value;
    renderTracker(listEl, hintEl, trophies, filters, state, toggleEarned);
  });
  document.getElementById('kindFilter').addEventListener('change', (e) => {
    filters.kind = e.target.value;
    renderTracker(listEl, hintEl, trophies, filters, state, toggleEarned);
  });
  document.getElementById('missableOnly').addEventListener('change', (e) => {
    filters.missableOnly = e.target.checked;
    renderTracker(listEl, hintEl, trophies, filters, state, toggleEarned);
  });
  document.getElementById('earnedOnly').addEventListener('change', (e) => {
    filters.earnedOnly = e.target.checked;
    renderTracker(listEl, hintEl, trophies, filters, state, toggleEarned);
  });
  document.getElementById('todoOnly').addEventListener('change', (e) => {
    filters.todoOnly = e.target.checked;
    renderTracker(listEl, hintEl, trophies, filters, state, toggleEarned);
  });
  document.getElementById('spoilerToggle').addEventListener('click', () => {
    state.spoilers = !state.spoilers;
    renderAll();
  });
  document.getElementById('exportBtn').addEventListener('click', () => exportProgress(state));
  document.getElementById('importBtn').addEventListener('click', () => {
    document.getElementById('importFile').click();
  });
  document.getElementById('importFile').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      state = await importProgress(file);
      if (!state.completionTasks) state.completionTasks = {};
      renderAll();
    } catch {
      alert('That file is not a Leonida Ledger progress export.');
    }
    e.target.value = '';
  });

  document.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach((t) => t.classList.remove('active'));
      document.querySelectorAll('.view').forEach((v) => v.classList.remove('active'));
      tab.classList.add('active');
      document.getElementById(`view-${tab.dataset.view}`).classList.add('active');
      const showControls = tab.dataset.view === 'tracker';
      document.getElementById('controls').style.display = showControls ? '' : 'none';
    });
  });

  renderAll();
}

boot().catch((err) => {
  document.getElementById('trophyList').innerHTML = `<li class="trophy-row">The guide could not load its data (${err.message}).</li>`;
});
