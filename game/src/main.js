// main.js — one job: own the game state and wire everything together.
// It builds the initial state, runs the animation loop (timer + render),
// and implements the actions input.js calls: taps, hints, level switches,
// mute and restart. The scene, the drawing and the sounds live elsewhere.
import { CANVAS_W, CANVAS_H, LEVELS, HINTS_PER_LEVEL, WRONG_CLICK_PENALTY_S } from './config.js';
import { render } from './render.js';
import { attachInput } from './input.js';
import { parseShot, applyShot } from './shots.js';
import { unlockAudio, playFound, playWrong, playHint, playClick, playWin, toggleMute } from './audio.js';

const canvas = document.getElementById('game');
canvas.width = CANVAS_W;
canvas.height = CANVAS_H;
const ctx = canvas.getContext('2d');
const statusEl = document.getElementById('status');

function freshState(levelIndex) {
  return {
    level: LEVELS[levelIndex],
    found: new Set(),
    foundAt: {},
    misses: [],
    hint: null,
    hintsLeft: HINTS_PER_LEVEL,
    mistakes: 0,
    score: 0,
    elapsedS: 0,
    startedAt: performance.now(),
    pausedS: 0,
    won: false,
    frozen: false,
    lastFoundLabel: '',
    keyboardMode: false,
    cursorPanel: 0,
    cursor: { x: 300, y: 260 },
  };
}

let state = freshState(0);

// Reset the level in place (never reassign `state`): input.js holds a
// reference to this same object, so a new object would leave its handlers
// reading a stale game.
function resetTo(levelIndex, keepScore) {
  const next = freshState(levelIndex);
  next.score = keepScore;
  for (const key of Object.keys(state)) delete state[key];
  Object.assign(state, next);
}

function announce(text) {
  statusEl.textContent = text;
}

function remainingCount() {
  return state.level.differences.length - state.found.size;
}

function nearestDiff(px, py) {
  let best = null;
  let bestD = Infinity;
  for (const d of state.level.differences) {
    if (state.found.has(d.id)) continue;
    const dist = Math.hypot(px - d.x, py - d.y);
    if (dist < bestD) { bestD = dist; best = d; }
  }
  return best && bestD <= best.r + 14 ? best : null;
}

const actions = {
  onInteract() {
    unlockAudio();
  },
  onPanelTap(px, py, panel, cx, cy) {
    if (state.won) return;
    if (state.frozen) return;
    const diff = nearestDiff(px, py);
    if (diff) {
      state.found.add(diff.id);
      state.foundAt[diff.id] = performance.now();
      state.score += 100;
      state.lastFoundLabel = 'Found: ' + diff.label + ' — ' + diff.note + '.';
      playFound();
      announce('Found ' + diff.label + '. ' + remainingCount() + ' differences left.');
      if (remainingCount() === 0) {
        state.won = true;
        state.score += Math.max(0, 300 - Math.floor(state.elapsedS));
        playWin();
        announce('All differences found in ' + state.level.name + '. Score ' + state.score + '.');
      }
    } else {
      state.mistakes += 1;
      state.elapsedS += WRONG_CLICK_PENALTY_S;
      state.misses.push({ x: cx, y: cy, at: performance.now() });
      state.lastFoundLabel = 'Not quite — that spot matches. +5s penalty. Look closer!';
      playWrong();
      announce('No difference there. Five second penalty.');
    }
  },
  onHint() {
    if (state.won || state.frozen) return;
    if (state.hintsLeft <= 0) {
      state.lastFoundLabel = 'Out of hints for this level — your eyes will have to do it.';
      return;
    }
    const left = state.level.differences.filter((d) => !state.found.has(d.id));
    if (left.length === 0) return;
    state.hintsLeft -= 1;
    const diff = left[Math.floor(left.length / 2)];
    state.hint = { diff, until: performance.now() + 3000 };
    state.lastFoundLabel = 'Hint: look near ' + diff.label.charAt(0).toLowerCase() + diff.label.slice(1) + '…';
    playHint();
    announce('Hint: look near ' + diff.label.toLowerCase() + '.');
  },
  onLevel(n) {
    resetTo(n, state.score);
    playClick();
    announce('Level ' + (n + 1) + ': ' + state.level.name + '.');
  },
  onNext() {
    if (!state.won) return;
    const next = (state.level.id + 1) % LEVELS.length;
    resetTo(next, state.score);
    playClick();
    announce('Level ' + (next + 1) + ': ' + state.level.name + '.');
  },
  onToggleMute() {
    const muted = toggleMute();
    state.lastFoundLabel = muted ? 'Sound off.' : 'Sound on.';
  },
  onRestart() {
    resetTo(state.level.id, 0);
    announce('Restarted ' + state.level.name + '.');
  },
};

attachInput(canvas, state, actions);

// Screenshot states: ?shot=start|play|end&seed=1 freeze the frame so the
// same URL always renders the same picture.
const { shot, seed } = parseShot(window.location.search);
if (shot) applyShot(state, shot, seed);

function frame() {
  if (!state.frozen && !state.won) {
    state.elapsedS = (performance.now() - state.startedAt) / 1000 + state.pausedS;
  }
  state.misses = state.misses.filter((m) => performance.now() - m.at < 1000);
  if (state.hint && state.hint.until <= performance.now()) state.hint = null;
  render(ctx, state);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
