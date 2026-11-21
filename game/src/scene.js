// scene.js — one job: draw the harbour café scene, procedurally, into a panel.
// drawPanel(ctx, ox, oy, level, variant) paints one 600x520 picture.
// variant 0 is the original; variant 1 is the same picture with that level's
// seven differences applied, so the two panels sit side by side and differ
// only where a difference says so. No images, no assets — pure canvas paths.
import { PANEL_W, PANEL_H, PALETTES } from './config.js';

function isChanged(level, variant, id) {
  return variant === 1 && level.differences.some((d) => d.id === id);
}

function circle(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function ellipse(ctx, x, y, rx, ry) {
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();
}

export function drawPanel(ctx, ox, oy, level, variant) {
  const pal = PALETTES[level.palette];
  const ch = (id) => isChanged(level, variant, id);
  ctx.save();
  ctx.translate(ox, oy);
  ctx.beginPath();
  ctx.rect(0, 0, PANEL_W, PANEL_H);
  ctx.clip();

  drawSky(ctx, pal, level, ch);
  drawSea(ctx, pal, level, ch);
  drawDock(ctx, pal, level, ch);
  drawCafe(ctx, pal, level, ch);
  drawLampPost(ctx, pal, level, ch);
  drawUmbrella(ctx, pal, level, ch);
  drawTable(ctx, pal, level, ch);
  drawBench(ctx, pal, level, ch);
  drawBoat(ctx, pal, level, ch);
  drawFlowerpot(ctx, pal, level, ch);
  drawDockBits(ctx, pal, level, ch);

  ctx.restore();
}

function drawSky(ctx, pal, level, ch) {
  const g = ctx.createLinearGradient(0, 0, 0, 235);
  g.addColorStop(0, pal.skyTop);
  g.addColorStop(0.55, pal.skyMid);
  g.addColorStop(1, pal.skyBot);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, PANEL_W, 235);

  // Fixed stars (night + dawn) and the bright star difference.
  if (level.palette !== 'dusk') {
    ctx.fillStyle = '#f5edd0';
    const stars = [[60, 40], [150, 30], [230, 52], [350, 34], [420, 58], [545, 40], [200, 90], [390, 92]];
    for (const [x, y] of stars) circle(ctx, x, y, 2.2);
    if (!ch('star')) {
      ctx.fillStyle = '#fff8d0';
      circle(ctx, 486, 66, 5);
      ctx.strokeStyle = '#fff8d0';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(486, 54); ctx.lineTo(486, 78);
      ctx.moveTo(474, 66); ctx.lineTo(498, 66);
      ctx.stroke();
    }
  }

  // The setting sun (dusk + dawn); absent on the right in level 1.
  if (!ch('sun') && level.palette !== 'night') {
    ctx.fillStyle = level.palette === 'dusk' ? '#ffcf6e' : '#ffe9b0';
    circle(ctx, 92, 82, 27);
    ctx.fillStyle = 'rgba(255, 207, 110, 0.35)';
    circle(ctx, 92, 82, 38);
  }

  // The seagull; flown away on the right in level 1.
  if (!ch('gull')) {
    ctx.strokeStyle = '#2c2c34';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(288, 74); ctx.quadraticCurveTo(297, 62, 305, 72);
    ctx.moveTo(305, 72); ctx.quadraticCurveTo(313, 62, 322, 74);
    ctx.stroke();
  }

  // Soft clouds, same in both panels.
  ctx.fillStyle = 'rgba(255, 235, 210, 0.55)';
  ellipse(ctx, 180, 130, 52, 13);
  ellipse(ctx, 440, 110, 60, 14);
  ellipse(ctx, 520, 170, 42, 11);

  // The mast flag (level 3): red flying right on the left, teal flying left on the right.
  if (level.id === 2) {
    ctx.strokeStyle = '#3a2c1e';
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(252, 52); ctx.lineTo(252, 112); ctx.stroke();
    ctx.fillStyle = ch('flag') ? '#2f8f7a' : '#d94f3d';
    ctx.beginPath();
    if (ch('flag')) { ctx.moveTo(252, 56); ctx.lineTo(226, 64); ctx.lineTo(252, 74); }
    else { ctx.moveTo(252, 56); ctx.lineTo(280, 64); ctx.lineTo(252, 74); }
    ctx.closePath(); ctx.fill();
  }
}

function drawSea(ctx, pal, level, ch) {
  ctx.fillStyle = pal.sea;
  ctx.fillRect(0, 235, PANEL_W, 165);
  // Sun / moon glitter on the water.
  ctx.fillStyle = 'rgba(255, 220, 150, 0.4)';
  for (let i = 0; i < 5; i++) ctx.fillRect(70 + i * 14, 250 + i * 22, 46 - i * 6, 3);
  // Wave lines.
  ctx.strokeStyle = pal.seaDark;
  ctx.lineWidth = 2;
  for (const [x, y, w] of [[300, 268, 70], [430, 300, 90], [120, 320, 80], [260, 345, 100], [470, 350, 70]]) {
    ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + w / 2, y - 6, x + w, y); ctx.stroke();
  }
  // The far little boat (level 3): present left, sailed away right.
  if (level.id === 2 && !ch('farboat')) {
    ctx.fillStyle = '#2c2c34';
    ctx.beginPath();
    ctx.moveTo(512, 306); ctx.lineTo(544, 306); ctx.lineTo(538, 314); ctx.lineTo(518, 314);
    ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(528, 306); ctx.lineTo(528, 288); ctx.stroke();
    ctx.fillStyle = '#e8e0c8';
    ctx.beginPath(); ctx.moveTo(528, 290); ctx.lineTo(528, 305); ctx.lineTo(542, 305); ctx.closePath(); ctx.fill();
  }
  // The fish (level 2): a flash of silver under the surface, left only.
  if (level.id === 1 && !ch('fish')) {
    ctx.fillStyle = '#c8d8e8';
    ellipse(ctx, 408, 352, 16, 7);
    ctx.beginPath(); ctx.moveTo(422, 352); ctx.lineTo(432, 344); ctx.lineTo(432, 360); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#2c2c34';
    circle(ctx, 400, 350, 1.6);
  }
}

function drawDock(ctx, pal, level, ch) {
  ctx.fillStyle = pal.dock;
  ctx.fillRect(0, 400, PANEL_W, 120);
  ctx.fillStyle = pal.dockDark;
  for (let x = 0; x < PANEL_W; x += 75) ctx.fillRect(x, 400, 3, 120);
  ctx.fillRect(0, 400, PANEL_W, 4);
  ctx.fillRect(0, 452, PANEL_W, 3);
  // Board nails.
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  for (let x = 38; x < PANEL_W; x += 75) { circle(ctx, x, 424, 2.5); circle(ctx, x, 490, 2.5); }
}

function drawCafe(ctx, pal, level, ch) {
  // Main wall and roof.
  ctx.fillStyle = pal.wall;
  ctx.fillRect(258, 118, 322, 282);
  ctx.fillStyle = pal.roof;
  ctx.beginPath();
  ctx.moveTo(244, 122); ctx.lineTo(594, 122); ctx.lineTo(580, 96); ctx.lineTo(258, 96); ctx.closePath(); ctx.fill();
  ctx.fillStyle = pal.roof;
  ctx.fillRect(244, 116, 350, 10);

  // Chimney + smoke (level 3): smoke rises on the left only.
  if (level.id === 2) {
    ctx.fillStyle = '#8a6a52';
    ctx.fillRect(470, 62, 26, 38);
    ctx.fillStyle = '#6e4f38';
    ctx.fillRect(466, 58, 34, 8);
    if (!ch('chimney')) {
      ctx.fillStyle = 'rgba(240, 235, 225, 0.85)';
      circle(ctx, 483, 48, 7); circle(ctx, 488, 36, 9); circle(ctx, 480, 24, 7);
    }
  }

  // Sign board: "CAFÉ" on the left, "CAFE" on the right (level 2).
  ctx.fillStyle = '#2e2620';
  rr(ctx, 258, 128, 96, 34, 6);
  ctx.fillStyle = '#ffd98a';
  ctx.font = 'bold 20px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(ch('sign') ? 'CAFE' : 'CAFÉ', 306, 146);

  // Wall clock (level 2): hands at ten past ten left, at half past four right.
  if (level.id === 1) {
    ctx.fillStyle = '#fdf6e3';
    circle(ctx, 300, 208, 24);
    ctx.strokeStyle = '#2e2620';
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(300, 208, 24, 0, Math.PI * 2); ctx.stroke();
    ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(300, 208);
    if (ch('clock')) { ctx.lineTo(292, 224); ctx.moveTo(300, 208); ctx.lineTo(312, 220); }
    else { ctx.lineTo(288, 196); ctx.moveTo(300, 208); ctx.lineTo(312, 200); }
    ctx.stroke();
    ctx.fillStyle = '#2e2620';
    circle(ctx, 300, 208, 2.5);
  }

  // Big window: warm light left, dark right (level 1). Shutter swung shut right (level 3).
  ctx.fillStyle = '#2e2620';
  ctx.fillRect(386, 162, 88, 72);
  if (ch('window')) {
    ctx.fillStyle = '#1d2733';
    ctx.fillRect(392, 168, 76, 60);
  } else {
    ctx.fillStyle = '#ffd98a';
    ctx.fillRect(392, 168, 76, 60);
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillRect(392, 168, 76, 12);
  }
  ctx.strokeStyle = '#2e2620';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(430, 168); ctx.lineTo(430, 228);
  ctx.moveTo(392, 198); ctx.lineTo(468, 198);
  ctx.stroke();
  if (level.id === 2 && ch('shutter')) {
    ctx.fillStyle = '#5d7a4a';
    ctx.fillRect(392, 168, 76, 60);
    ctx.strokeStyle = '#42582f';
    ctx.lineWidth = 2;
    for (let y = 176; y < 228; y += 10) { ctx.beginPath(); ctx.moveTo(392, y); ctx.lineTo(468, y); ctx.stroke(); }
  }
  // Small round window.
  ctx.fillStyle = '#2e2620';
  circle(ctx, 528, 196, 22);
  ctx.fillStyle = level.palette === 'night' ? '#ffd98a' : '#bfe0ea';
  circle(ctx, 528, 196, 17);

  // Door + awning.
  ctx.fillStyle = '#5d3a22';
  ctx.fillRect(492, 262, 64, 138);
  ctx.fillStyle = '#ffd98a';
  circle(ctx, 502, 330, 3);
  ctx.fillStyle = pal.awning;
  ctx.beginPath();
  ctx.moveTo(480, 252); ctx.lineTo(568, 252); ctx.lineTo(560, 268); ctx.lineTo(488, 268);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  for (let x = 488; x < 568; x += 20) ctx.fillRect(x, 252, 10, 16);
}

function drawLampPost(ctx, pal, level, ch) {
  // Wooden post with a hanging paper lantern (level 2).
  if (level.id !== 1) return;
  ctx.fillStyle = '#3a2c1e';
  ctx.fillRect(122, 120, 8, 280);
  ctx.fillRect(122, 120, 60, 6);
  ctx.strokeStyle = '#3a2c1e';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(176, 126); ctx.lineTo(176, 138); ctx.stroke();
  ctx.fillStyle = ch('lantern') ? '#7ec98f' : '#ffb347';
  ellipse(ctx, 176, 158, 22, 26);
  ctx.fillStyle = ch('lantern') ? '#5da86e' : '#e89b2e';
  ctx.fillRect(164, 130, 24, 6);
  ctx.fillRect(164, 180, 24, 6);
  ctx.fillStyle = 'rgba(255, 220, 130, 0.5)';
  if (!ch('lantern')) ellipse(ctx, 176, 158, 30, 34);
}

function drawUmbrella(ctx, pal, level, ch) {
  // Parasol over the bench (level 2): stripe red left, teal right.
  if (level.id !== 1) return;
  ctx.fillStyle = '#3a2c1e';
  ctx.fillRect(518, 128, 6, 220);
  ctx.fillStyle = ch('umbrella') ? '#2f8f7a' : '#d95f43';
  ctx.beginPath();
  ctx.moveTo(452, 128); ctx.quadraticCurveTo(521, 78, 590, 128); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#f6e3c2';
  ctx.beginPath();
  ctx.moveTo(487, 128); ctx.quadraticCurveTo(521, 96, 555, 128); ctx.closePath(); ctx.fill();
  ctx.fillStyle = ch('umbrella') ? '#2f8f7a' : '#d95f43';
  ctx.beginPath();
  ctx.moveTo(512, 112); ctx.lineTo(530, 112); ctx.lineTo(521, 96); ctx.closePath(); ctx.fill();
}

function drawTable(ctx, pal, level, ch) {
  // Round café table with a cup of coffee; steam rises left only (level 1).
  ctx.fillStyle = '#4a2e18';
  ctx.fillRect(326, 440, 8, 44);
  ctx.fillStyle = '#8a5a30';
  ellipse(ctx, 330, 442, 52, 10);
  ctx.fillStyle = '#fdf6e3';
  ctx.beginPath(); ctx.moveTo(312, 414); ctx.lineTo(348, 414); ctx.lineTo(344, 438); ctx.lineTo(316, 438); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#6b3f1d';
  ellipse(ctx, 330, 415, 17, 4);
  ctx.strokeStyle = '#fdf6e3';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(350, 426, 8, -Math.PI / 2, Math.PI / 2); ctx.stroke();
  if (!ch('steam')) {
    ctx.strokeStyle = 'rgba(255,255,255,0.85)';
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(324, 408); ctx.quadraticCurveTo(318, 396, 324, 386);
    ctx.moveTo(336, 408); ctx.quadraticCurveTo(342, 396, 336, 386);
    ctx.stroke();
  }
}

function drawBench(ctx, pal, level, ch) {
  // Bench with the café cat (level 1): cat sits left, bench empty right.
  ctx.fillStyle = '#5d3d22';
  ctx.fillRect(428, 348, 118, 10);
  ctx.fillRect(436, 358, 8, 40);
  ctx.fillRect(530, 358, 8, 40);
  ctx.fillStyle = '#7a5230';
  ctx.fillRect(428, 336, 118, 8);
  if (!ch('cat')) {
    ctx.fillStyle = '#e8a34c';
    ellipse(ctx, 472, 330, 20, 16);           // body
    circle(ctx, 472, 306, 13);                // head
    ctx.beginPath();                          // ears
    ctx.moveTo(462, 296); ctx.lineTo(460, 284); ctx.lineTo(469, 292);
    ctx.moveTo(482, 296); ctx.lineTo(484, 284); ctx.lineTo(475, 292);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#e8a34c';                // tail curl
    ctx.beginPath(); ctx.arc(492, 330, 12, -Math.PI / 2, Math.PI / 2); ctx.stroke();
    ctx.strokeStyle = '#e8a34c'; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.arc(494, 330, 12, -Math.PI / 2, Math.PI / 2); ctx.stroke();
    ctx.fillStyle = '#2c2c34';
    circle(ctx, 467, 304, 1.8); circle(ctx, 477, 304, 1.8);
  }
}

function drawBoat(ctx, pal, level, ch) {
  // Little wooden boat with a sail: red left, teal right (level 1).
  ctx.fillStyle = '#6b3f1d';
  ctx.beginPath();
  ctx.moveTo(96, 388); ctx.lineTo(246, 388); ctx.lineTo(228, 408); ctx.lineTo(114, 408);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#3a2c1e';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(168, 388); ctx.lineTo(168, 296); ctx.stroke();
  ctx.fillStyle = ch('sail') ? '#2f8f7a' : '#d94f3d';
  ctx.beginPath();
  ctx.moveTo(168, 300); ctx.lineTo(168, 384); ctx.lineTo(232, 384);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#f6e3c2';
  ctx.beginPath();
  ctx.moveTo(164, 312); ctx.lineTo(164, 384); ctx.lineTo(118, 384);
  ctx.closePath(); ctx.fill();
}

function drawFlowerpot(ctx, pal, level, ch) {
  // Terracotta pot on the dock; red blooms left, blue right (level 1).
  ctx.fillStyle = '#b0512f';
  ctx.beginPath();
  ctx.moveTo(70, 452); ctx.lineTo(122, 452); ctx.lineTo(114, 486); ctx.lineTo(78, 486);
  ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#8a3a20';
  ctx.fillRect(66, 446, 60, 10);
  ctx.strokeStyle = '#3f7a34';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(84, 448); ctx.lineTo(84, 428); ctx.moveTo(96, 448); ctx.lineTo(96, 424); ctx.moveTo(108, 448); ctx.lineTo(108, 428); ctx.stroke();
  ctx.fillStyle = ch('flowers') ? '#5a7fd6' : '#d94f3d';
  circle(ctx, 84, 424, 8); circle(ctx, 96, 420, 8); circle(ctx, 108, 424, 8);
  ctx.fillStyle = '#ffd98a';
  circle(ctx, 84, 424, 3); circle(ctx, 96, 420, 3); circle(ctx, 108, 424, 3);
}

function drawDockBits(ctx, pal, level, ch) {
  // Coiled rope (level 2): neat coil left, loose line right.
  if (level.id === 1) {
    ctx.strokeStyle = '#c9a86a';
    ctx.lineWidth = 4;
    if (ch('rope')) {
      ctx.beginPath(); ctx.moveTo(170, 484); ctx.quadraticCurveTo(200, 470, 230, 486); ctx.stroke();
    } else {
      ctx.beginPath(); ctx.arc(196, 478, 16, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(196, 478, 9, 0, Math.PI * 2); ctx.stroke();
    }
  }
  // Bucket (level 3): upright left, tipped right.
  if (level.id === 2) {
    ctx.fillStyle = '#7a7f8a';
    if (ch('bucket')) {
      ctx.save(); ctx.translate(84, 472); ctx.rotate(Math.PI / 2.4);
      ctx.fillRect(-14, -10, 28, 20); ctx.restore();
    } else {
      ctx.fillRect(70, 456, 28, 22);
      ctx.fillStyle = '#5d626e';
      ctx.fillRect(66, 452, 36, 6);
    }
  }
  // Little anchor (level 3): present left only.
  if (level.id === 2 && !ch('anchor')) {
    ctx.strokeStyle = '#3a3f4a';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(524, 420); ctx.lineTo(524, 448);
    ctx.moveTo(512, 424); ctx.lineTo(536, 424);
    ctx.moveTo(512, 440); ctx.quadraticCurveTo(524, 456, 536, 440);
    ctx.stroke();
    ctx.fillStyle = '#3a3f4a';
    circle(ctx, 524, 418, 4);
  }
  // Pale pebble (level 3): present left only.
  if (level.id === 2 && !ch('pebble')) {
    ctx.fillStyle = '#e8e0c8';
    ellipse(ctx, 352, 484, 10, 6);
  }
}
