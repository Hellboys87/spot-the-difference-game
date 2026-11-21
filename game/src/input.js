// input.js — one job: turn mouse clicks and key presses into game actions.
// It knows the canvas geometry (panels, buttons) and asks the game state
// what a tap means; it never draws and never owns the score or timer.
// main.js hands it a small set of callbacks: onPanelTap(x, y, panel),
// onHint(), onLevel(n), onNext(), onToggleMute(), onRestart().
import { PANEL_W, PANEL_H, PANEL_Y, LEFT_X, RIGHT_X } from './config.js';
import { buttonRects } from './render.js';

function inRect(x, y, r) {
  return r && x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
}

function canvasPos(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * canvas.width,
    y: ((event.clientY - rect.top) / rect.height) * canvas.height,
  };
}

export function panelAt(x, y) {
  // Returns { panel: 0 | 1, px, py } in panel space, or null outside the pictures.
  if (y < PANEL_Y || y > PANEL_Y + PANEL_H) return null;
  if (x >= LEFT_X && x <= LEFT_X + PANEL_W) return { panel: 0, px: x - LEFT_X, py: y - PANEL_Y };
  if (x >= RIGHT_X && x <= RIGHT_X + PANEL_W) return { panel: 1, px: x - RIGHT_X, py: y - PANEL_Y };
  return null;
}

export function attachInput(canvas, state, actions) {
  canvas.addEventListener('pointerdown', (event) => {
    const { x, y } = canvasPos(canvas, event);
    actions.onInteract();
    const rects = buttonRects(state);
    if (rects.next && inRect(x, y, rects.next)) { actions.onNext(); return; }
    if (inRect(x, y, rects.hint)) { actions.onHint(); return; }
    if (inRect(x, y, rects.level1)) { actions.onLevel(0); return; }
    if (inRect(x, y, rects.level2)) { actions.onLevel(1); return; }
    if (inRect(x, y, rects.level3)) { actions.onLevel(2); return; }
    const hit = panelAt(x, y);
    if (hit) actions.onPanelTap(hit.px, hit.py, hit.panel, x, y);
  });

  window.addEventListener('keydown', (event) => {
    const k = event.key;
    if (k === 'ArrowLeft' || k === 'ArrowRight' || k === 'ArrowUp' || k === 'ArrowDown') {
      event.preventDefault();
      state.keyboardMode = true;
      const step = event.shiftKey ? 60 : 22;
      if (k === 'ArrowLeft') state.cursor.x = Math.max(10, state.cursor.x - step);
      if (k === 'ArrowRight') state.cursor.x = Math.min(PANEL_W - 10, state.cursor.x + step);
      if (k === 'ArrowUp') state.cursor.y = Math.max(10, state.cursor.y - step);
      if (k === 'ArrowDown') state.cursor.y = Math.min(PANEL_H - 10, state.cursor.y + step);
      return;
    }
    if (k === 'Tab') {
      event.preventDefault();
      state.keyboardMode = true;
      state.cursorPanel = state.cursorPanel === 0 ? 1 : 0;
      return;
    }
    if (k === 'Enter' || k === ' ') {
      event.preventDefault();
      actions.onInteract();
      if (state.won) { actions.onNext(); return; }
      state.keyboardMode = true;
      const cx = state.cursorPanel === 0 ? LEFT_X + state.cursor.x : RIGHT_X + state.cursor.x;
      actions.onPanelTap(state.cursor.x, state.cursor.y, state.cursorPanel, cx, PANEL_Y + state.cursor.y);
      return;
    }
    if (k === 'h' || k === 'H') { actions.onHint(); return; }
    if (k === 'm' || k === 'M') { actions.onToggleMute(); return; }
    if (k === 'r' || k === 'R') { actions.onRestart(); return; }
    if (k === '1') { actions.onLevel(0); return; }
    if (k === '2') { actions.onLevel(1); return; }
    if (k === '3') { actions.onLevel(2); return; }
    if (k === 'n' || k === 'N') { actions.onNext(); return; }
  });
}
