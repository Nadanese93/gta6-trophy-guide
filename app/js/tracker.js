/* Tracker view: the filterable checklist of all 55 trophies. */
import { toggleEarned, setCount } from "./state.js";
import { openGuide } from "./guide.js";

/** Reads the current filter values from the filter bar. */
export function readFilters() {
  return {
    search: document.getElementById("searchBox").value.trim().toLowerCase(),
    grade: document.getElementById("gradeFilter").value,
    kind: document.getElementById("kindFilter").value,
    missableOnly: document.getElementById("missableOnly").checked,
    earnedOnly: document.getElementById("earnedOnly").checked,
    todoOnly: document.getElementById("todoOnly").checked
  };
}

/** Whether one trophy passes the current filters. */
function passesFilters(trophy, filters, state) {
  const earned = state.earned.has(trophy.name);
  if (filters.search && !(trophy.name + " " + trophy.description).toLowerCase().includes(filters.search)) return false;
  if (filters.grade && trophy.grade !== filters.grade) return false;
  if (filters.kind && trophy.kind !== filters.kind) return false;
  if (filters.missableOnly && !trophy.missable) return false;
  if (filters.earnedOnly && !earned) return false;
  if (filters.todoOnly && earned) return false;
  return true;
}

/** Whether a story trophy's name and description stay hidden by the spoiler lock. */
export function isSpoilerLocked(trophy, state) {
  return state.spoiler && trophy.story && !state.earned.has(trophy.name);
}

/** Renders the tracker list and the summary line. */
export function renderTracker(trophies, state) {
  const filters = readFilters();
  const list = document.getElementById("trophyList");
  const shown = trophies.filter((t) => passesFilters(t, filters, state));
  const earnedCount = trophies.filter((t) => state.earned.has(t.name)).length;
  document.getElementById("trackerSummary").textContent =
    `Showing ${shown.length} of 55 trophies · ${earnedCount} earned · ` +
    `${trophies.filter((t) => t.hidden).length} hidden · 1 missable · 5 methods unconfirmed`;
  list.innerHTML = "";
  for (const trophy of shown) {
    const earned = state.earned.has(trophy.name);
    const locked = isSpoilerLocked(trophy, state);
    const li = document.createElement("li");
    li.className = `trophy grade-${trophy.grade}${earned ? " earned" : ""}`;
    const box = document.createElement("input");
    box.type = "checkbox";
    box.checked = earned;
    box.setAttribute("aria-label", `Earned: ${trophy.name}`);
    box.addEventListener("change", () => {
      toggleEarned(state, trophy.name);
      renderTracker(trophies, state);
      document.dispatchEvent(new CustomEvent("progress-changed"));
    });
    const body = document.createElement("div");
    const name = document.createElement("div");
    name.className = "t-name";
    name.textContent = locked ? "Hidden — story trophy" : trophy.name;
    body.appendChild(name);
    const desc = document.createElement("div");
    desc.className = "t-desc";
    desc.textContent = locked
      ? "Spoiler lock is on. Earn this trophy to reveal its name and description."
      : trophy.description;
    body.appendChild(desc);
    const meta = document.createElement("div");
    meta.className = "t-meta";
    meta.appendChild(pill(trophy.grade, `grade-${trophy.grade}`));
    meta.appendChild(pill(trophy.kind));
    if (trophy.hidden) meta.appendChild(pill("hidden", "hidden-t"));
    if (trophy.missable) meta.appendChild(pill("MISSABLE", "missable"));
    if (!trophy.verified) meta.appendChild(pill("method unconfirmed", "unverified"));
    meta.appendChild(pill(`Stage ${trophy.stage}`));
    body.appendChild(meta);
    const right = document.createElement("div");
    right.className = "t-right";
    const gs = document.createElement("div");
    gs.className = "t-gs";
    gs.textContent = `${trophy.gamerscore}G`;
    right.appendChild(gs);
    if (trophy.psn_target) {
      const count = state.counts[trophy.name] || 0;
      const counter = document.createElement("div");
      counter.className = "t-count";
      const minus = document.createElement("button");
      minus.type = "button";
      minus.textContent = "−";
      minus.setAttribute("aria-label", `Decrease ${trophy.name} counter`);
      minus.addEventListener("click", (e) => {
        e.stopPropagation();
        setCount(state, trophy.name, count - 1, trophy.psn_target);
        renderTracker(trophies, state);
        document.dispatchEvent(new CustomEvent("progress-changed"));
      });
      const label = document.createElement("span");
      label.textContent = ` ${count}/${trophy.psn_target} `;
      const plus = document.createElement("button");
      plus.type = "button";
      plus.textContent = "+";
      plus.setAttribute("aria-label", `Increase ${trophy.name} counter`);
      plus.addEventListener("click", (e) => {
        e.stopPropagation();
        setCount(state, trophy.name, count + 1, trophy.psn_target);
        renderTracker(trophies, state);
        document.dispatchEvent(new CustomEvent("progress-changed"));
      });
      counter.append(minus, label, plus);
      right.appendChild(counter);
    }
    li.addEventListener("click", (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "BUTTON") return;
      openGuide(trophy, state);
    });
    li.append(box, body, right);
    list.appendChild(li);
  }
  if (shown.length === 0) {
    const empty = document.createElement("li");
    empty.className = "muted";
    empty.textContent = "No trophies match these filters.";
    list.appendChild(empty);
  }
  return { shown: shown.length, earned: earnedCount };
}

/** A small pill tag for the trophy row. */
function pill(text, cls) {
  const el = document.createElement("span");
  el.className = "tag-pill" + (cls ? " " + cls : "");
  el.textContent = text;
  return el;
}

/** Refreshes the header's overall progress bar and counts. */
export function renderOverall(trophies, state) {
  const earned = trophies.filter((t) => state.earned.has(t.name)).length;
  document.getElementById("earnedCount").textContent = String(earned);
  document.getElementById("overallBar").style.width = `${(earned / trophies.length) * 100}%`;
  const gs = trophies.reduce((s, t) => s + (state.earned.has(t.name) ? t.gamerscore : 0), 0);
  document.getElementById("gsEarned").textContent = String(gs);
}
