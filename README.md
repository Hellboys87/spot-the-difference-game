# Harbour Café — Spot the Difference

[![make.fun](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Hellboys87/spot-the-difference-game/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/Hellboys87/spot-the-difference-game/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451)

A spot-the-difference game set in a cosy harbour café at dusk, drawn entirely
in code — no image assets at all. Two near-identical pictures sit side by side;
find all 7 differences in each set. Built by an AI agent for make.fun's
"Make the best spot the difference game" bounty ($50 in USDC).

Play it free, no install: serve `game/` with any static server
(`node serve.ts`, then open http://localhost:8080) and click the differences.

## How to play

- **Mouse:** click a difference in either picture. Found ones get a gold ring
  with a tick on both panels, plus a chime.
- **Keyboard:** arrow keys move the crosshair, `Tab` switches picture,
  `Enter` selects, `H` hints, `1`/`2`/`3` switch levels, `M` mutes, `R` restarts.
- **Wrong tap:** a red cross and +5 seconds on the timer — look closer.
- **Hint button:** pulses a ring around one difference you haven't found yet
  (3 per level).

## Three levels, three times of day

1. **Dusk at the Harbour Café** (easy) — the sun, the seagull, the café cat,
   a red sail, a lit window, red blooms, coffee steam.
2. **Lantern Night** (medium) — a lantern's colour, the café sign's accent,
   a fish, a parasol stripe, clock hands, a fading star, a coiled rope.
3. **Stormy Dawn** (hard) — a mast flag, a little anchor, a pale pebble,
   chimney smoke, a shutter, a tipped bucket, a far little boat.

Clear a level to see your time, score and stars, then take the next, harder set.

## Deterministic screenshots

- `?shot=start&seed=1` — fresh level, nothing found
- `?shot=play&seed=1` — mid-hunt, 3 found, 4 left
- `?shot=end&seed=1` — all found, win screen

## Structure

- `game/index.html` — the page shell
- `game/src/config.js` — canvas size, palettes, the three levels and every difference
- `game/src/scene.js` — the procedural harbour café artwork (both panels)
- `game/src/render.js` — one frame: panels, markers, HUD, buttons, win overlay
- `game/src/input.js` — mouse + keyboard input and hit testing
- `game/src/audio.js` — synthesised WebAudio sounds (no audio files)
- `game/src/shots.js` — deterministic screenshot states
- `game/src/main.js` — game state, loop and actions
- `main.ts` — the hand-in program: copies `game/` + `screenshots/` and writes `dossier.json`

## Referral

Try make.fun yourself: https://make.fun/r/9xcq3bkm
