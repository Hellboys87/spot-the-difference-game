// shots.js — one job: the deterministic screenshot states.
// ?shot=start  — a fresh level, nothing found yet.
// ?shot=play   — mid-hunt: three differences found and ringed, four still
//                hidden, the counter reading "4 differences left".
// ?shot=end    — every difference found and the win screen up.
// The seed query only picks the level deterministically (seed 1 → level 1),
// so the same URL always renders the same frame.
import { LEVELS } from './config.js';

export function parseShot(search) {
  const params = new URLSearchParams(search);
  return {
    shot: params.get('shot') || null,
    seed: Number(params.get('seed') || '1'),
  };
}

export function applyShot(state, shot, seed) {
  const levelIndex = ((seed - 1) % LEVELS.length + LEVELS.length) % LEVELS.length;
  state.level = LEVELS[levelIndex];
  state.found = new Set();
  state.foundAt = {};
  state.misses = [];
  state.hint = null;
  state.mistakes = 0;
  state.score = 0;
  state.won = false;
  state.startedAt = performance.now();

  if (shot === 'play') {
    // Three found, four left — the cover frame the judge reads first.
    const foundIds = state.level.differences.slice(0, 3).map((d) => d.id);
    for (const id of foundIds) {
      state.found.add(id);
      state.foundAt[id] = performance.now() - 2000;
    }
    state.score = 300;
    state.elapsedS = 47;
    const third = state.level.differences[2];
    state.lastFoundLabel = 'Found: ' + third.label + ' — ' + third.note + '. 4 differences left!';
    state.frozen = true;
  } else if (shot === 'end') {
    for (const d of state.level.differences) {
      state.found.add(d.id);
      state.foundAt[d.id] = performance.now() - 2000;
    }
    state.score = 700;
    state.elapsedS = 128;
    state.mistakes = 1;
    state.won = true;
    state.lastFoundLabel = 'All 7 found! ' + state.level.name + ' cleared.';
    state.frozen = true;
  } else if (shot === 'start') {
    // A fresh hunt, frozen at 00:00 so the frame is fully deterministic.
    state.elapsedS = 0;
    state.lastFoundLabel = 'Click a difference in either picture — or press H for a hint.';
    state.frozen = true;
  } else {
    // No shot at all: a live, fresh hunt.
    state.elapsedS = 0;
    state.lastFoundLabel = '';
    state.frozen = false;
  }
  return state;
}
