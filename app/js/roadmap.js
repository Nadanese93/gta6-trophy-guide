/* Roadmap view: the 7-stage platinum roadmap with per-stage progress strips,
   and the Missables view: the one missable, the time-sensitive race and the save plan. */
import { trophyByName } from "./data.js";
import { toggleTask } from "./state.js";

/** Renders the 7-stage roadmap into #roadmapRoot. */
export function renderRoadmap(trophies, roadmap, state) {
  const root = document.getElementById("roadmapRoot");
  root.innerHTML = "";
  const intro = document.createElement("div");
  intro.className = "card";
  const h = document.createElement("h2");
  h.textContent = "Platinum roadmap — 7 stages, ~200 hours";
  intro.appendChild(h);
  const p = document.createElement("p");
  p.className = "muted";
  p.textContent = "One playthrough, no online trophies, no mission replay. Each stage lists its trophies with a progress strip and a task checklist. Ticking a trophy in the Tracker moves its stage strip.";
  intro.appendChild(p);
  root.appendChild(intro);
  for (const stage of roadmap.stages) {
    const stageTrophies = stage.trophies.map((n) => trophyByName(trophies, n)).filter(Boolean);
    const earned = stageTrophies.filter((t) => state.earned.has(t.name)).length;
    const pct = stageTrophies.length === 0 ? 0 : Math.round((earned / stageTrophies.length) * 100);
    const card = document.createElement("div");
    card.className = "card";
    const head = document.createElement("div");
    head.className = "stage-head";
    const title = document.createElement("h3");
    title.textContent = `Stage ${stage.id} — ${stage.title}`;
    head.appendChild(title);
    const hours = document.createElement("span");
    hours.className = "muted";
    hours.textContent = stage.hours;
    head.appendChild(hours);
    card.appendChild(head);
    const sub = document.createElement("p");
    sub.className = "muted";
    sub.textContent = stage.subtitle;
    card.appendChild(sub);
    const strip = document.createElement("div");
    strip.className = "stage-strip";
    const bar = document.createElement("div");
    bar.className = "bar";
    const fill = document.createElement("div");
    fill.style.width = `${pct}%`;
    bar.appendChild(fill);
    strip.appendChild(bar);
    const pctLabel = document.createElement("span");
    pctLabel.className = "pct";
    pctLabel.textContent = `${earned}/${stageTrophies.length} · ${pct}%`;
    strip.appendChild(pctLabel);
    card.appendChild(strip);
    const chips = document.createElement("div");
    chips.className = "stage-trophies";
    for (const t of stageTrophies) {
      const pill = document.createElement("span");
      pill.className = "pill" + (state.earned.has(t.name) ? " done" : "") + (t.story ? " story" : "");
      pill.textContent = t.name;
      chips.appendChild(pill);
    }
    card.appendChild(chips);
    const tip = document.createElement("p");
    tip.textContent = stage.tip;
    card.appendChild(tip);
    const taskHead = document.createElement("h3");
    taskHead.textContent = "Checklist";
    card.appendChild(taskHead);
    const tasks = document.createElement("ul");
    tasks.className = "task-list";
    stage.tasks.forEach((task, i) => {
      const key = `s${stage.id}t${i}`;
      const li = document.createElement("li");
      const box = document.createElement("input");
      box.type = "checkbox";
      box.checked = !!state.tasks[key];
      box.setAttribute("aria-label", task);
      box.addEventListener("change", () => {
        toggleTask(state, key);
        li.querySelector("span").className = box.checked ? "done" : "";
      });
      const label = document.createElement("span");
      label.textContent = task;
      label.className = box.checked ? "done" : "";
      li.append(box, label);
      tasks.appendChild(li);
    });
    card.appendChild(tasks);
    root.appendChild(card);
  }
  const totals = document.createElement("div");
  totals.className = "card";
  const th = document.createElement("h2");
  th.textContent = "100% completion — the numbers for A Long Road";
  totals.appendChild(th);
  for (const [group, text] of Object.entries(roadmap.checklist_100)) {
    const h3 = document.createElement("h3");
    h3.textContent = group[0].toUpperCase() + group.slice(1);
    totals.appendChild(h3);
    const pp = document.createElement("p");
    pp.textContent = text;
    totals.appendChild(pp);
  }
  root.appendChild(totals);
}

/** Renders the Missables view into #missablesRoot. */
export function renderMissables(trophies, roadmap, state) {
  const root = document.getElementById("missablesRoot");
  root.innerHTML = "";
  const pma = trophyByName(trophies, "Positive Mental Attitude");
  const warn = document.createElement("div");
  warn.className = "warn";
  const wh = document.createElement("h3");
  wh.textContent = "⚠ The one missable trophy";
  warn.appendChild(wh);
  const wp = document.createElement("p");
  wp.textContent = pma
    ? "Positive Mental Attitude — meditate at every spot across Leonida (18). Lucia's balcony meditation in Chapter 1 disappears once Chapter 1 ends, and there is no mission replay. Do it the morning after Down to Earth and keep a Chapter 1 save until it pops."
    : "";
  warn.appendChild(wp);
  root.appendChild(warn);
  const race = document.createElement("div");
  race.className = "card";
  const rh = document.createElement("h2");
  rh.textContent = "Time-sensitive: Race Against Yago";
  race.appendChild(rh);
  const rp = document.createElement("p");
  rp.textContent = "This Chapter 3 race in Yago's street racing strand is time-sensitive (hourglass icon) and the strand counts toward Strangers & Freaks. Do it the moment it appears — save first, then race.";
  race.appendChild(rp);
  root.appendChild(race);
  const save = document.createElement("div");
  save.className = "card";
  const sh = document.createElement("h2");
  sh.textContent = "Save plan — 6 steps, 15 slots";
  save.appendChild(sh);
  const list = document.createElement("ol");
  for (const step of roadmap.save_strategy) {
    const li = document.createElement("li");
    li.textContent = step;
    list.appendChild(li);
  }
  save.appendChild(list);
  root.appendChild(save);
  const unv = document.createElement("div");
  unv.className = "card";
  const uh = document.createElement("h2");
  uh.textContent = "5 trophies with no confirmed method yet";
  unv.appendChild(uh);
  const up = document.createElement("p");
  up.className = "muted";
  up.textContent = "These five have no confirmed unlock method at launch. Their descriptions are the only hint, and some may pop while you play normally. They are marked unverified in the tracker — do not trust unconfirmed methods.";
  unv.appendChild(up);
  const ul = document.createElement("ul");
  for (const t of trophies.filter((x) => !x.verified)) {
    const li = document.createElement("li");
    li.textContent = `${t.name} — ${t.description}`;
    ul.appendChild(li);
  }
  unv.appendChild(ul);
  root.appendChild(unv);
  void state;
}
