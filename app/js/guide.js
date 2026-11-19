/** The per-trophy detail dialog: guide, sources, PSN-target counter, earned toggle. */
let current = null;
let onToggleRef = null;

export function openTrophyDialog(trophy, state, onToggle) {
  current = trophy;
  onToggleRef = onToggle;
  const dialog = document.getElementById('trophyDialog');
  const earned = state.earned.includes(trophy.name);
  document.getElementById('dialogName').textContent = trophy.name;
  document.getElementById('dialogMeta').textContent =
    `${trophy.grade} · ${trophy.gamerscore}G · ${trophy.kind}${trophy.hidden ? ' · hidden' : ''}${trophy.missable ? ' · missable' : ''}${trophy.verified ? '' : ' · unverified'}`;
  document.getElementById('dialogDesc').textContent = trophy.description;
  document.getElementById('dialogGuide').textContent = trophy.guide;
  document.getElementById('dialogSources').textContent = `Sources: ${trophy.sources.join(', ')}.`;
  const counter = document.getElementById('dialogCounter');
  if (trophy.target) {
    counter.hidden = false;
    document.getElementById('counterTarget').textContent = `of ${trophy.target.n} ${trophy.target.unit}`;
    document.getElementById('counterInput').value = state.counts[trophy.name] || 0;
  } else {
    counter.hidden = true;
  }
  const earnedBtn = document.getElementById('dialogEarned');
  earnedBtn.textContent = earned ? 'Mark not earned' : 'Mark earned';
  earnedBtn.onclick = () => {
    onToggle(trophy.name, !state.earned.includes(trophy.name));
    dialog.close();
  };
  dialog.showModal();
}

export function wireDialogCounter(state, onCount) {
  document.getElementById('counterInput').addEventListener('change', (event) => {
    if (!current || !current.target) return;
    const value = Math.max(0, Math.floor(Number(event.target.value) || 0));
    onCount(current.name, value);
  });
}
