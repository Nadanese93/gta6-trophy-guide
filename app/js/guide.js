/* Trophy detail dialog: description, guide, counter and sources for one trophy. */
import { SOURCES, trophyProgress } from "./data.js";
import { isSpoilerLocked } from "./tracker.js";

/** Opens the detail dialog for one trophy. */
export function openGuide(trophy, state) {
  const overlay = document.getElementById("dialogOverlay");
  const box = document.getElementById("dialogBox");
  box.innerHTML = "";
  const close = document.createElement("button");
  close.type = "button";
  close.className = "close-x";
  close.textContent = "Close ✕";
  close.addEventListener("click", closeGuide);
  box.appendChild(close);
  const title = document.createElement("h2");
  const locked = isSpoilerLocked(trophy, state);
  title.textContent = locked ? "Hidden — story trophy" : trophy.name;
  box.appendChild(title);
  const meta = document.createElement("p");
  meta.className = "muted";
  meta.textContent = locked
    ? "Spoiler lock is on. Earn this trophy to reveal its name and description."
    : `${trophy.grade[0].toUpperCase() + trophy.grade.slice(1)} · ${trophy.gamerscore}G · Stage ${trophy.stage} · ` +
      `${trophy.hidden ? "Hidden" : "Visible"} · ${trophy.verified ? "Method confirmed" : "Method unconfirmed"}`;
  box.appendChild(meta);
  if (!locked) {
    const desc = document.createElement("p");
    desc.className = "guide-text";
    desc.textContent = trophy.description;
    box.appendChild(desc);
    if (trophy.psn_target) {
      const count = state.counts[trophy.name] || 0;
      const prog = document.createElement("p");
      prog.textContent = `Progress: ${count}/${trophy.psn_target} — ${Math.round(trophyProgress(trophy, state) * 100)}%`;
      box.appendChild(prog);
    }
    const guide = document.createElement("p");
    guide.className = "guide-text";
    guide.textContent = trophy.guide;
    box.appendChild(guide);
    const src = document.createElement("p");
    src.className = "src-line";
    src.textContent = "Sources: ";
    // Every name, description and grade was verified against PSNProfiles;
    // the trophy's own list names where its guide method comes from.
    const names = ["PSNProfiles", ...trophy.sources.filter((s) => s !== "PSNProfiles")];
    for (const name of names) {
      const a = document.createElement("a");
      a.href = SOURCES[name] || "#";
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = name;
      src.appendChild(a);
    }
    box.appendChild(src);
  }
  overlay.hidden = false;
  overlay.addEventListener("click", onOverlayClick);
}

/** Closes the detail dialog. */
export function closeGuide() {
  const overlay = document.getElementById("dialogOverlay");
  overlay.hidden = true;
  overlay.removeEventListener("click", onOverlayClick);
}

function onOverlayClick(e) {
  if (e.target.id === "dialogOverlay") closeGuide();
}
