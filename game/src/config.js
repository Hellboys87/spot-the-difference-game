// Harbour Café — Spot the Difference
// config.js — one job: the game's fixed data. Canvas size, panel layout,
// the three difficulty sets (levels) and every difference in each set.
// A difference is a point in panel space (600 x 520) with a hit radius,
// a short label shown when it is found, and a difficulty hint for the HUD.
export const CANVAS_W = 1280;
export const CANVAS_H = 800;

export const PANEL_W = 600;
export const PANEL_H = 520;
export const PANEL_Y = 92;
export const LEFT_X = 24;
export const RIGHT_X = 656;

export const HINTS_PER_LEVEL = 3;
export const WRONG_CLICK_PENALTY_S = 5;

export const LEVELS = [
  {
    id: 0,
    name: 'Dusk at the Harbour Café',
    tag: 'Level 1 · Easy',
    palette: 'dusk',
    blurb: 'Seven big changes hide in the dusk light. Warm up your eyes.',
    differences: [
      { id: 'sun', label: 'The setting sun', x: 92, y: 82, r: 34, note: 'gone from the sky' },
      { id: 'gull', label: 'The seagull', x: 305, y: 72, r: 24, note: 'flown away' },
      { id: 'cat', label: 'The café cat', x: 472, y: 348, r: 30, note: 'off the bench' },
      { id: 'sail', label: 'The boat sail', x: 168, y: 372, r: 32, note: 'red sail turned teal' },
      { id: 'window', label: 'The café window', x: 428, y: 196, r: 34, note: 'its warm light is out' },
      { id: 'flowers', label: 'The flowerpot blooms', x: 96, y: 452, r: 28, note: 'red blooms turned blue' },
      { id: 'steam', label: 'The coffee steam', x: 330, y: 400, r: 24, note: 'no steam over the cup' },
    ],
  },
  {
    id: 1,
    name: 'Lantern Night',
    tag: 'Level 2 · Medium',
    palette: 'night',
    blurb: 'Lanterns are lit and the changes get sneakier. Look twice.',
    differences: [
      { id: 'lantern', label: 'The paper lantern', x: 176, y: 158, r: 28, note: 'amber lantern turned green' },
      { id: 'sign', label: 'The café sign', x: 300, y: 132, r: 30, note: 'CAFÉ lost its accent' },
      { id: 'fish', label: 'The fish in the harbour', x: 408, y: 352, r: 26, note: 'swum away' },
      { id: 'umbrella', label: 'The parasol stripe', x: 522, y: 128, r: 30, note: 'its stripe changed colour' },
      { id: 'clock', label: 'The wall clock', x: 300, y: 208, r: 26, note: 'its hands moved' },
      { id: 'star', label: 'The bright star', x: 486, y: 66, r: 22, note: 'faded from the sky' },
      { id: 'rope', label: 'The coiled rope', x: 196, y: 478, r: 26, note: 'uncoiled on the dock' },
    ],
  },
  {
    id: 2,
    name: 'Stormy Dawn',
    tag: 'Level 3 · Hard',
    palette: 'dawn',
    blurb: 'Small, quiet changes in the grey dawn. Only sharp eyes finish this.',
    differences: [
      { id: 'flag', label: 'The mast flag', x: 256, y: 66, r: 24, note: 'flying the other way' },
      { id: 'anchor', label: 'The little anchor', x: 524, y: 436, r: 24, note: 'gone from the dock' },
      { id: 'pebble', label: 'The pale pebble', x: 352, y: 484, r: 20, note: 'missing from the boards' },
      { id: 'chimney', label: 'The chimney smoke', x: 478, y: 118, r: 26, note: 'no smoke in the cold air' },
      { id: 'shutter', label: 'The window shutter', x: 372, y: 228, r: 26, note: 'swung shut' },
      { id: 'bucket', label: 'The dock bucket', x: 84, y: 472, r: 24, note: 'tipped over' },
      { id: 'farboat', label: 'The far little boat', x: 528, y: 306, r: 22, note: 'sailed out of sight' },
    ],
  },
];

// Palettes per time of day: sky top/bottom, sea, dock wood, café wall, roof.
export const PALETTES = {
  dusk: {
    skyTop: '#2e3a6e', skyMid: '#c96f4a', skyBot: '#f2b879',
    sea: '#3d5a80', seaDark: '#2c4361', dock: '#7a5230', dockDark: '#5d3d22',
    wall: '#f6e3c2', roof: '#a4442e', awning: '#d95f43',
  },
  night: {
    skyTop: '#0b1030', skyMid: '#1c2a55', skyBot: '#33477e',
    sea: '#16263f', seaDark: '#0f1c30', dock: '#6b4a2c', dockDark: '#4e3319',
    wall: '#e8d9b8', roof: '#7e2f22', awning: '#b34a34',
  },
  dawn: {
    skyTop: '#5b6b7f', skyMid: '#a8a49a', skyBot: '#e8c9a0',
    sea: '#5d7a8c', seaDark: '#476273', dock: '#7d5a38', dockDark: '#5f4226',
    wall: '#efe0c0', roof: '#8f3a28', awning: '#c65a40',
  },
};
