// render.js — one job: paint one frame of the game on the canvas.
// It draws the two scene panels (via scene.js), the header and HUD, the
// found-difference markers, hint pulses, wrong-tap marks, the keyboard
// cursor, and the win overlay. It never owns game state — main.js does.
import { CANVAS_W, CANVAS_H, PANEL_W, PANEL_H, PANEL_Y, LEFT_X, RIGHT_X } from './config.js';
import { drawPanel } from './scene.js';

function panelLabel(ctx, x, y, text) {
  ctx.fillStyle = 'rgba(20, 18, 28, 0.75)';
  ctx.beginPath();
  ctx.roundRect(x, y, 92, 26, 8);
  ctx.fill();
  ctx.fillStyle = '#ffd98a';
  ctx.font = 'bold 13px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x + 46, y + 14);
}

function drawMarker(ctx, x, y, r, pulse) {
  // A warm ring with a tick — the satisfying mark on each find.
  const rad = r + (pulse ? Math.sin(performance.now() / 160) * 2.5 : 0);
  ctx.strokeStyle = '#ffcf6e';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(x, y, rad, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = '#2e7d32';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - rad * 0.45, y);
  ctx.lineTo(x - rad * 0.1, y + rad * 0.4);
  ctx.lineTo(x + rad * 0.5, y - rad * 0.35);
  ctx.stroke();
}

function drawHintRing(ctx, x, y, r, until) {
  const left = until - performance.now();
  if (left <= 0) return;
  const t = 1 - left / 3000;
  const rad = r + 6 + Math.sin(t * Math.PI * 4) * 4;
  ctx.strokeStyle = `rgba(255, 220, 120, ${0.45 + 0.55 * (1 - t)})`;
  ctx.lineWidth = 4;
  ctx.setLineDash([10, 6]);
  ctx.beginPath();
  ctx.arc(x, y, rad, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
}

export function render(ctx, state) {
  const level = state.level;
  const now = performance.now();

  // Backdrop.
  const bg = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
  bg.addColorStop(0, '#171423');
  bg.addColorStop(1, '#241d33');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Header.
  ctx.fillStyle = '#f6e3c2';
  ctx.font = 'bold 30px Georgia, serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText('Harbour Café — Spot the Difference', 24, 42);
  ctx.fillStyle = '#c9b8d8';
  ctx.font = '16px Georgia, serif';
  ctx.fillText(level.tag + '  ·  ' + level.name, 24, 68);
  ctx.textAlign = 'right';
  ctx.fillStyle = '#ffd98a';
  ctx.font = 'bold 20px Georgia, serif';
  ctx.fillText('⏱ ' + formatTime(state.elapsedS), CANVAS_W - 24, 40);
  ctx.fillStyle = '#c9b8d8';
  ctx.font = '16px Georgia, serif';
  ctx.fillText('Score ' + state.score + '  ·  Mistakes ' + state.mistakes, CANVAS_W - 24, 66);
  ctx.textAlign = 'left';

  // Panels with borders.
  for (const [px, variant, tag] of [[LEFT_X, 0, 'PICTURE A'], [RIGHT_X, 1, 'PICTURE B']]) {
    ctx.fillStyle = '#0e0c16';
    ctx.fillRect(px - 4, PANEL_Y - 4, PANEL_W + 8, PANEL_H + 8);
    drawPanel(ctx, px, PANEL_Y, level, variant);
    ctx.strokeStyle = '#ffd98a';
    ctx.lineWidth = 2;
    ctx.strokeRect(px - 4, PANEL_Y - 4, PANEL_W + 8, PANEL_H + 8);
    panelLabel(ctx, px + 12, PANEL_Y + 12, tag);
  }

  // Found markers on BOTH panels, at the mirrored spot.
  for (const diff of level.differences) {
    if (!state.found.has(diff.id)) continue;
    const pulse = now - (state.foundAt[diff.id] || 0) < 600;
    drawMarker(ctx, LEFT_X + diff.x, PANEL_Y + diff.y, diff.r, pulse);
    drawMarker(ctx, RIGHT_X + diff.x, PANEL_Y + diff.y, diff.r, pulse);
  }

  // Hint pulse on the still-hidden difference.
  if (state.hint && state.hint.until > now) {
    const d = state.hint.diff;
    drawHintRing(ctx, LEFT_X + d.x, PANEL_Y + d.y, d.r, state.hint.until);
    drawHintRing(ctx, RIGHT_X + d.x, PANEL_Y + d.y, d.r, state.hint.until);
  }

  // Wrong-tap marks, fading.
  for (const mark of state.misses) {
    const age = now - mark.at;
    if (age > 900) continue;
    const alpha = 1 - age / 900;
    ctx.strokeStyle = `rgba(224, 82, 82, ${alpha})`;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    const s = 10;
    ctx.beginPath();
    ctx.moveTo(mark.x - s, mark.y - s); ctx.lineTo(mark.x + s, mark.y + s);
    ctx.moveTo(mark.x + s, mark.y - s); ctx.lineTo(mark.x - s, mark.y + s);
    ctx.stroke();
  }

  // Keyboard cursor: a roving crosshair the arrow keys move.
  if (state.keyboardMode) {
    const cx = state.cursorPanel === 0 ? LEFT_X + state.cursor.x : RIGHT_X + state.cursor.x;
    const cy = PANEL_Y + state.cursor.y;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, 18, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - 26, cy); ctx.lineTo(cx - 12, cy);
    ctx.moveTo(cx + 12, cy); ctx.lineTo(cx + 26, cy);
    ctx.moveTo(cx, cy - 26); ctx.lineTo(cx, cy - 12);
    ctx.moveTo(cx, cy + 12); ctx.lineTo(cx, cy + 26);
    ctx.stroke();
  }

  // HUD bar under the panels.
  const hudY = PANEL_Y + PANEL_H + 18;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.07)';
  ctx.beginPath();
  ctx.roundRect(24, hudY, CANVAS_W - 48, 96, 12);
  ctx.fill();

  const remaining = level.differences.length - state.found.size;
  ctx.fillStyle = '#f6e3c2';
  ctx.font = 'bold 24px Georgia, serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(remaining + ' difference' + (remaining === 1 ? '' : 's') + ' left', 48, hudY + 30);
  ctx.fillStyle = '#c9b8d8';
  ctx.font = '16px Georgia, serif';
  const last = state.lastFoundLabel || 'Click a difference in either picture — or press H for a hint.';
  ctx.fillText(last, 48, hudY + 62);

  // Progress dots: one per difference, filled gold when found.
  let dotX = 48;
  const dotY = hudY + 88;
  for (const diff of level.differences) {
    ctx.fillStyle = state.found.has(diff.id) ? '#ffcf6e' : 'rgba(255,255,255,0.25)';
    ctx.beginPath();
    ctx.arc(dotX, dotY, 7, 0, Math.PI * 2);
    ctx.fill();
    dotX += 22;
  }

  // Buttons row (also the click targets input.js checks).
  drawButtons(ctx, state, hudY);

  // Footer help line.
  ctx.fillStyle = '#8f829e';
  ctx.font = '14px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText('Mouse: click a difference  ·  Keyboard: arrows move, Enter selects, H hint, 1–3 levels, M mute', CANVAS_W / 2, CANVAS_H - 14);
  ctx.textAlign = 'left';

  if (state.won) drawWinOverlay(ctx, state);
}

export function buttonRects(state) {
  const hudY = PANEL_Y + PANEL_H + 18;
  return {
    hint: { x: CANVAS_W - 560, y: hudY + 14, w: 150, h: 40 },
    level1: { x: CANVAS_W - 392, y: hudY + 14, w: 116, h: 40 },
    level2: { x: CANVAS_W - 268, y: hudY + 14, w: 116, h: 40 },
    level3: { x: CANVAS_W - 144, y: hudY + 14, w: 116, h: 40 },
    next: state.won ? { x: CANVAS_W / 2 - 130, y: 520, w: 260, h: 54 } : null,
  };
}

function drawButtons(ctx, state, hudY) {
  const rects = buttonRects(state);
  const defs = [
    ['hint', '💡 Hint (' + state.hintsLeft + ')', state.hintsLeft > 0 && !state.won],
    ['level1', 'Level 1', true],
    ['level2', 'Level 2', true],
    ['level3', 'Level 3', true],
  ];
  for (const [key, label, enabled] of defs) {
    const r = rects[key];
    const active = key === 'level' + (state.level.id + 1);
    ctx.fillStyle = active ? '#ffcf6e' : enabled ? '#3a2f52' : '#2a2438';
    ctx.beginPath();
    ctx.roundRect(r.x, r.y, r.w, r.h, 9);
    ctx.fill();
    ctx.strokeStyle = active ? '#ffd98a' : '#6b5a8a';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = active ? '#241d33' : enabled ? '#f6e3c2' : '#8f829e';
    ctx.font = 'bold 15px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, r.x + r.w / 2, r.y + r.h / 2 + 1);
  }
  ctx.textAlign = 'left';
}

function drawWinOverlay(ctx, state) {
  ctx.fillStyle = 'rgba(14, 12, 22, 0.82)';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.fillStyle = '#ffcf6e';
  ctx.font = 'bold 44px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText(state.level.id === 2 ? 'You found them all — café master!' : 'All 7 found!', CANVAS_W / 2, 300);
  ctx.fillStyle = '#f6e3c2';
  ctx.font = '22px Georgia, serif';
  ctx.fillText(state.level.name + ' cleared in ' + formatTime(state.elapsedS) + ' · Score ' + state.score, CANVAS_W / 2, 352);
  const stars = state.mistakes === 0 ? '★★★' : state.mistakes <= 3 ? '★★☆' : '★☆☆';
  ctx.fillStyle = '#ffd98a';
  ctx.font = '40px Georgia, serif';
  ctx.fillText(stars, CANVAS_W / 2, 412);
  ctx.fillStyle = '#c9b8d8';
  ctx.font = '18px Georgia, serif';
  ctx.fillText(
    state.level.id === 2 ? 'That was the hardest set. Play again or try another level!' : 'Press Next for a harder set — the hunt stays fun after ten finds.',
    CANVAS_W / 2, 462,
  );
  const r = buttonRects(state).next;
  ctx.fillStyle = '#ffcf6e';
  ctx.beginPath();
  ctx.roundRect(r.x, r.y, r.w, r.h, 12);
  ctx.fill();
  ctx.fillStyle = '#241d33';
  ctx.font = 'bold 20px Georgia, serif';
  ctx.textBaseline = 'middle';
  ctx.fillText(state.level.id === 2 ? '↻ Play again' : 'Next level →', CANVAS_W / 2, r.y + r.h / 2 + 1);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
}

export function formatTime(totalS) {
  const m = Math.floor(totalS / 60);
  const s = Math.floor(totalS % 60);
  return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
}
