/* Boot: loads the data, wires the tabs, filters and settings, then renders. */
import { loadTrophies, loadRoadmap } from "./data.js";
import { loadState, saveState, exportState, importState, seedDemo } from "./state.js";
import { renderTracker, renderOverall } from "./tracker.js";
import { renderRoadmap, renderMissables } from "./roadmap.js";

const state = loadState();
let trophies = [];
let roadmap = null;

async function boot() {
  try {
    trophies = await loadTrophies();
    roadmap = await loadRoadmap();
  } catch (err) {
    document.getElementById("trophyList").innerHTML =
      `<li class="muted">Could not load the trophy list (${err.message}). Check that data/trophies.json and data/roadmap.json are next to index.html.</li>`;
    return;
  }
  const params = new URLSearchParams(location.search);
  if (params.get("demo") === "1") {
    seedDemo(state);
    saveState(state);
  }
  renderAll();
  wireTabs();
  wireFilters();
  wireSettings();
}

/** Renders every view and the header. */
function renderAll() {
  renderTracker(trophies, state);
  renderOverall(trophies, state);
  renderRoadmap(trophies, roadmap, state);
  renderMissables(trophies, roadmap, state);
  syncSpoilerToggles();
}

/** Keeps the two spoiler checkboxes in sync. */
function syncSpoilerToggles() {
  document.getElementById("spoilerToggle").checked = state.spoiler;
  document.getElementById("spoilerToggle2").checked = state.spoiler;
}

/** Wires the four view tabs. */
function wireTabs() {
  document.querySelectorAll(".tabs button").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tabs button").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));
      document.getElementById(`view-${btn.dataset.view}`).classList.add("active");
    });
  });
}

/** Wires the filter bar so any change re-renders the tracker. */
function wireFilters() {
  for (const id of ["searchBox", "gradeFilter", "kindFilter", "missableOnly", "earnedOnly", "todoOnly"]) {
    document.getElementById(id).addEventListener("input", () => renderTracker(trophies, state));
  }
  for (const id of ["spoilerToggle", "spoilerToggle2"]) {
    document.getElementById(id).addEventListener("change", (e) => {
      state.spoiler = e.target.checked;
      saveState(state);
      renderAll();
    });
  }
  document.addEventListener("progress-changed", () => {
    renderOverall(trophies, state);
    renderRoadmap(trophies, roadmap, state);
  });
}

/** Wires export, import and reset in Settings. */
function wireSettings() {
  document.getElementById("exportBtn").addEventListener("click", () => {
    const blob = new Blob([exportState(state)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "leonida-field-guide-progress.json";
    a.click();
    URL.revokeObjectURL(a.href);
  });
  document.getElementById("importFile").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const next = importState(await file.text());
    if (!next) {
      alert("That file is not a Leonida Field Guide export.");
      return;
    }
    Object.assign(state, next);
    saveState(state);
    renderAll();
  });
  document.getElementById("resetBtn").addEventListener("click", () => {
    if (!confirm("Reset all progress? Earned trophies, counters and checklist ticks are all cleared.")) return;
    state.earned = new Set();
    state.counts = {};
    state.tasks = {};
    saveState(state);
    renderAll();
  });
}

boot();
