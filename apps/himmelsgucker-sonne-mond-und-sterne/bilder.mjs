// Himmelsgucker: die Bilder als SVG-Text, ohne DOM und ohne Zufall, testbar.
// Eigenentwurf. Die Bilder stehen für Sonne, Mond und Sternenhimmel; die Mondgestalten sind
// einfache Flächen (voll, halb, Sichel). Es gibt keine fünfzackigen Zeichen als Schmuck und
// keine Schrift im Bild. Jede Zeichnung hat entweder ein Textlabel (role="img") oder ist reiner
// Schmuck (aria-hidden). Im Druck gibt es nur die einzelnen Mondgestalten: schwarze Linie,
// weiße helle Fläche, graue dunkle Fläche, damit das Kind die helle Fläche ausmalen kann.

const MITTE = 50;
const RADIUS = 44;
// Halbachse der inneren Ellipse der Sichel: je kleiner, desto dicker die Sichel.
const SICHEL_INNEN = 24;

export const MONDGESTALTEN = Object.freeze(['voll', 'halb', 'sichel']);
export const BILD_IDS = Object.freeze([
  'sonne', 'mond', 'sternenhimmel', 'mond-voll', 'mond-teilweise', 'mond-sichel',
]);
const GESTALT_VON_BILD = { 'mond-voll': 'voll', 'mond-teilweise': 'halb', 'mond-sichel': 'sichel' };
export const DRUCK_BILD_IDS = Object.freeze(Object.keys(GESTALT_VON_BILD));

const FARBEN = {
  bildschirm: { nacht: '#1e293b', dunkel: '#475569', licht: '#fde68a', linie: 'none' },
  druck: { nacht: 'none', dunkel: '#d1d5db', licht: '#ffffff', linie: '#000000' },
};

const rund = (zahl) => Number(zahl.toFixed(1));
/** Maskiert Text für HTML und SVG: &, <, > und beide Arten von Anführungszeichen. */
export const maskiere = (text) => String(text)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

/**
 * Der Anteil der Scheibe, der hell ist: voll 1, halb 0,5, Sichel deutlich weniger.
 * @param {'voll'|'halb'|'sichel'} gestalt
 * @returns {number}
 */
export function lichtAnteil(gestalt) {
  if (gestalt === 'voll') return 1;
  if (gestalt === 'halb') return 0.5;
  if (gestalt === 'sichel') return (RADIUS - SICHEL_INNEN) / (2 * RADIUS);
  throw new RangeError(`unbekannte Mondgestalt: ${gestalt}`);
}

/** Der Umriss der hellen Fläche als Pfad (die helle Seite liegt rechts); null bei voll. */
export function lichtPfad(gestalt) {
  const oben = MITTE - RADIUS;
  const unten = MITTE + RADIUS;
  if (gestalt === 'voll') return null;
  if (gestalt === 'halb') return `M${MITTE} ${oben}A${RADIUS} ${RADIUS} 0 0 1 ${MITTE} ${unten}Z`;
  if (gestalt === 'sichel') {
    return `M${MITTE} ${oben}A${RADIUS} ${RADIUS} 0 0 1 ${MITTE} ${unten}A${SICHEL_INNEN} ${RADIUS} 0 0 0 ${MITTE} ${oben}Z`;
  }
  throw new RangeError(`unbekannte Mondgestalt: ${gestalt}`);
}

/** Eine Mondscheibe im Raster 100 mal 100 (ohne Hintergrund). */
function scheibe(gestalt, modus) {
  const f = FARBEN[modus];
  const strich = f.linie === 'none' ? '' : ` stroke="${f.linie}" stroke-width="2.5" stroke-linejoin="round"`;
  const dunkel = `<circle cx="${MITTE}" cy="${MITTE}" r="${RADIUS}" fill="${f.dunkel}"${strich}/>`;
  if (gestalt === 'voll') {
    return `<circle cx="${MITTE}" cy="${MITTE}" r="${RADIUS}" fill="${f.licht}"${strich}/>`;
  }
  return `${dunkel}<path d="${lichtPfad(gestalt)}" fill="${f.licht}"${strich}/>`;
}

/** Kopf des SVG-Elements: mit Label ein Bild, ohne Label reiner Schmuck. */
function kopf(viewBox, label) {
  const lesbar = label === null || label === undefined
    ? 'aria-hidden="true"'
    : `role="img" aria-label="${maskiere(label)}"`;
  return `<svg viewBox="${viewBox}" ${lesbar} focusable="false">`;
}

function mondGestalt(gestalt, modus, label) {
  const hintergrund = modus === 'bildschirm'
    ? `<rect x="0" y="0" width="100" height="100" rx="12" fill="${FARBEN.bildschirm.nacht}"/>`
    : '';
  return `${kopf('0 0 100 100', label)}${hintergrund}${scheibe(gestalt, modus)}</svg>`;
}

function mondDrei(label) {
  const gruppen = MONDGESTALTEN.map((g, i) =>
    `<g transform="translate(${10 + i * 95} 10) scale(0.9)">${scheibe(g, 'bildschirm')}</g>`).join('');
  return `${kopf('0 0 300 110', label)}<rect x="0" y="0" width="300" height="110" rx="12" fill="${FARBEN.bildschirm.nacht}"/>${gruppen}</svg>`;
}

function sonne(label) {
  const strahlen = Array.from({ length: 12 }, (_, i) => {
    const winkel = (i * 30 * Math.PI) / 180;
    const [c, s] = [Math.cos(winkel), Math.sin(winkel)];
    return `<line x1="${rund(60 + 32 * c)}" y1="${rund(60 + 32 * s)}" x2="${rund(60 + 48 * c)}" y2="${rund(60 + 48 * s)}"/>`;
  }).join('');
  return `${kopf('0 0 120 120', label)}<rect x="0" y="0" width="120" height="120" rx="14" fill="#bae6fd"/>`
    + `<g stroke="#d97706" stroke-width="5" stroke-linecap="round">${strahlen}</g>`
    + '<circle cx="60" cy="60" r="23" fill="#fbbf24" stroke="#d97706" stroke-width="3"/></svg>';
}

/** Ein vierzackiges Funkeln (kein fünfzackiges Zeichen). */
function funkeln(x, y, g) {
  const k = g * 0.25;
  const ecken = [[x, y - g], [x + k, y - k], [x + g, y], [x + k, y + k], [x, y + g], [x - k, y + k], [x - g, y], [x - k, y - k]];
  return `<path d="M${ecken.map(([px, py]) => `${rund(px)} ${rund(py)}`).join('L')}Z"/>`;
}

function sternenhimmel(label) {
  const funken = [[24, 28, 9], [78, 22, 6], [96, 56, 8], [42, 72, 6], [66, 94, 9], [16, 100, 5]]
    .map(([x, y, g]) => funkeln(x, y, g)).join('');
  const tupfen = [[52, 14], [108, 32], [12, 60], [86, 78], [30, 108], [106, 98], [60, 46]]
    .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.8"/>`).join('');
  return `${kopf('0 0 120 120', label)}<rect x="0" y="0" width="120" height="120" rx="14" fill="${FARBEN.bildschirm.nacht}"/>`
    + `<g fill="#fde68a">${funken}${tupfen}</g></svg>`;
}

/**
 * Ein Bild als SVG-Text. Ohne Label (null) ist es reiner Schmuck.
 * Im Druck gibt es nur die drei einzelnen Mondgestalten.
 * @param {string} id eine Kennung aus BILD_IDS
 * @param {{ modus?: 'bildschirm'|'druck', label?: string|null }} [optionen]
 * @returns {string}
 */
export function bildSvg(id, { modus = 'bildschirm', label = null } = {}) {
  if (!BILD_IDS.includes(id)) throw new RangeError(`unbekanntes Bild: ${id}`);
  if (!FARBEN[modus]) throw new RangeError(`unbekannter Modus: ${modus}`);
  if (modus === 'druck' && !DRUCK_BILD_IDS.includes(id)) throw new RangeError(`im Druck nur Mondgestalten, nicht: ${id}`);
  if (id in GESTALT_VON_BILD) return mondGestalt(GESTALT_VON_BILD[id], modus, label);
  if (id === 'mond') return mondDrei(label);
  if (id === 'sonne') return sonne(label);
  return sternenhimmel(label);
}
