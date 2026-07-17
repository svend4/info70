// Spiral-Stopper: reine Eskalationslogik (ohne DOM), testbar.
// Ein Kommentar-Thread hat eine "Temperatur" 0..100. Reaktionen des Kindes
// verändern sie; die Stufe (ruhig/gereizt/heiss) bestimmt, wie gemein der
// nächste Kommentar ausfällt.

export const REAKTIONEN = Object.freeze([
  { code: 'poebeln', text: '🔥 Zurückpöbeln', wirkung: +25, lehre: 'Zurückpöbeln füttert die Spirale: Jetzt streiten zwei - und alle schauen zu.' },
  { code: 'ignorieren', text: '🤐 Nichts tun, weiterscrollen', wirkung: +5, lehre: 'Wegsehen stoppt nichts: Ohne Widerspruch wirkt der Hass normal und wächst leise weiter.' },
  { code: 'gegenrede', text: '💬 Freundlich widersprechen (Gegenrede)', wirkung: -15, lehre: 'Gegenrede wirkt: Ein ruhiger Satz zeigt allen Mitlesenden, dass Gemeinheit hier nicht normal ist.' },
  { code: 'melden', text: '🚩 Melden + blockieren', wirkung: -25, lehre: 'Melden ist der Not-Aus: Die Plattform muss reagieren (DSA), und der Account verliert seine Bühne.' },
]);

export const STUFEN = Object.freeze([
  { ab: 0, name: 'ruhig', emoji: '🌤️' },
  { ab: 35, name: 'gereizt', emoji: '⛈️' },
  { ab: 70, name: 'heiss', emoji: '🌋' },
]);

/** @param {number} temperatur @returns {{ab:number,name:string,emoji:string}} */
export function stufe(temperatur) {
  return [...STUFEN].reverse().find((s) => temperatur >= s.ab) ?? STUFEN[0];
}

/** Temperatur nach einer Reaktion (geklemmt auf 0..100). */
export function reagiere(temperatur, code) {
  const reaktion = REAKTIONEN.find((r) => r.code === code);
  if (!reaktion) throw new Error(`unbekannte Reaktion: ${code}`);
  return Math.max(0, Math.min(100, temperatur + reaktion.wirkung));
}

/**
 * Bewertung am Ende: Wie kühl wurde der Thread gehalten?
 * @param {number[]} verlauf Temperatur nach jeder Runde
 */
export function bewertung(verlauf) {
  const ende = verlauf[verlauf.length - 1] ?? 0;
  const spitze = Math.max(...verlauf, 0);
  if (ende <= 20 && spitze < 70) return { emoji: '🧯', titel: 'Spiral-Stopper*in', satz: 'Du hast den Thread abgekühlt, bevor er brennen konnte.' };
  if (ende <= 45) return { emoji: '🌥️', titel: 'Abkühler*in', satz: 'Der Thread ist wieder auf dem Weg nach unten - dranbleiben wirkt.' };
  return { emoji: '🌋', titel: 'Heißer Thread', satz: 'Die Spirale hat gewonnen - probiere Gegenrede und Melden früher aus!' };
}
