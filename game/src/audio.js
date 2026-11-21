// audio.js — one job: every sound the game makes, synthesised with WebAudio.
// No audio files, no network: small oscillator blips for a find, a wrong tap,
// a hint, a level win and the final fanfare. Audio starts only after the
// player first interacts, so browsers never block it.
let ctx = null;
let muted = false;

function ensureCtx() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function tone(freq, startAt, dur, type, vol) {
  const ac = ensureCtx();
  if (!ac || muted) return;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001, ac.currentTime + startAt);
  gain.gain.exponentialRampToValueAtTime(vol, ac.currentTime + startAt + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + startAt + dur);
  osc.connect(gain);
  gain.connect(ac.destination);
  osc.start(ac.currentTime + startAt);
  osc.stop(ac.currentTime + startAt + dur + 0.05);
}

export function unlockAudio() {
  ensureCtx();
}

export function playFound() {
  // A satisfying two-note chime, rising.
  tone(660, 0, 0.16, 'sine', 0.22);
  tone(990, 0.09, 0.28, 'sine', 0.22);
  tone(1320, 0.18, 0.22, 'triangle', 0.1);
}

export function playWrong() {
  // A soft low buzz — a miss, not a punishment.
  tone(140, 0, 0.18, 'sawtooth', 0.08);
  tone(110, 0.1, 0.2, 'sawtooth', 0.07);
}

export function playHint() {
  // A gentle ping that points the eye.
  tone(880, 0, 0.2, 'sine', 0.14);
  tone(1174, 0.12, 0.25, 'sine', 0.12);
}

export function playClick() {
  tone(520, 0, 0.06, 'triangle', 0.1);
}

export function playWin() {
  // A short fanfare arpeggio when a level is cleared.
  const notes = [523, 659, 784, 1047];
  notes.forEach((n, i) => tone(n, i * 0.11, 0.3, 'triangle', 0.18));
  tone(1319, 0.46, 0.5, 'sine', 0.16);
}

export function toggleMute() {
  muted = !muted;
  return muted;
}

export function isMuted() {
  return muted;
}
