// Lootbox-Labor: reine Zufalls- und Rechenlogik (ohne DOM), damit sie testbar ist.
// Modell: Eine Glitzer-Truhe kostet TRUHEN_PREIS Euro. Beim Öffnen entscheidet
// der Zufall über die Seltenheitsstufe (Wahrscheinlichkeiten offengelegt),
// danach über das konkrete Item aus dem Pool der Stufe - Duplikate sind möglich.

export const TRUHEN_PREIS = 2;
export const START_TASCHENGELD = 20;

/**
 * Offengelegte Wahrscheinlichkeiten (in Prozent, Summe = 100).
 * Reihenfolge = Ziehungsreihenfolge: kumulative Grenzen von oben nach unten.
 */
export const wahrscheinlichkeiten = [
  { id: 'legendaer', name: 'Legendär', emoji: '💎', prozent: 1 },
  { id: 'selten', name: 'Selten', emoji: '⭐', prozent: 9 },
  { id: 'haeufig', name: 'Häufig', emoji: '🧦', prozent: 90 },
];

/** Item-Pools pro Seltenheitsstufe. Die häufigen Items sind absichtlich öde. */
export const ITEMS = {
  legendaer: [
    { id: 'drache', name: 'Galaxie-Drache', emoji: '🐉' },
  ],
  selten: [
    { id: 'einhorn', name: 'Regenbogen-Einhorn', emoji: '🦄' },
    { id: 'roboter', name: 'Turbo-Roboter', emoji: '🤖' },
    { id: 'magierin', name: 'Sternen-Magierin', emoji: '🧙' },
  ],
  haeufig: [
    { id: 'socke', name: 'Einzelne Socke', emoji: '🧦' },
    { id: 'stein', name: 'Grauer Stein', emoji: '🪨' },
    { id: 'loeffel', name: 'Verbogener Löffel', emoji: '🥄' },
    { id: 'blatt', name: 'Welkes Blatt', emoji: '🍂' },
    { id: 'klammer', name: 'Büroklammer', emoji: '📎' },
    { id: 'schnipsel', name: 'Papierschnipsel', emoji: '🧻' },
  ],
};

/**
 * Öffnet eine Truhe: erst Seltenheitsstufe (kumulative Prozent-Grenzen),
 * dann konkretes Item aus dem Pool der Stufe.
 * @param {() => number} [zufall] Zahl in [0, 1); injizierbar für Tests
 * @returns {{ seltenheit: { id: string, name: string, emoji: string, prozent: number },
 *             item: { id: string, name: string, emoji: string } }}
 */
export function ziehe(zufall = Math.random) {
  const wurf = zufall() * 100;
  let grenze = 0;
  let seltenheit = wahrscheinlichkeiten[wahrscheinlichkeiten.length - 1];
  for (const stufe of wahrscheinlichkeiten) {
    grenze += stufe.prozent;
    if (wurf < grenze) {
      seltenheit = stufe;
      break;
    }
  }
  const pool = ITEMS[seltenheit.id];
  const item = pool[Math.floor(zufall() * pool.length)];
  return { seltenheit, item };
}

/**
 * Erwartete Kosten bis zum ersten Legendär (geometrische Verteilung):
 * im Mittel 100/prozent Truhen, also (100/prozent) * preis Euro.
 * Bei 1 % und 2 € pro Truhe: 100 Truhen = 200 Euro im Mittel.
 * @param {number} [prozent] Legendär-Wahrscheinlichkeit in Prozent
 * @param {number} [preis] Preis pro Truhe in Euro
 * @returns {{ truhen: number, kosten: number }}
 */
export function erwartungswert(prozent = wahrscheinlichkeiten[0].prozent, preis = TRUHEN_PREIS) {
  const truhen = 100 / prozent;
  return { truhen, kosten: truhen * preis };
}

/**
 * Pech-Quantil: Nach wie vielen Truhen hat immer noch ein Anteil `anteil`
 * der Spieler KEIN Legendär? (kleinstes n mit (1-p)^n <= anteil)
 * Bei 1 % und anteil 0.1: 230 Truhen - jedes zehnte Kind braucht mehr.
 * @param {number} [prozent] Legendär-Wahrscheinlichkeit in Prozent
 * @param {number} [anteil] Rest-Anteil ohne Legendär, z. B. 0.1 = jedes zehnte Kind
 * @returns {number} Anzahl Truhen (ganzzahlig, aufgerundet)
 */
export function pechQuantil(prozent = wahrscheinlichkeiten[0].prozent, anteil = 0.1) {
  return Math.ceil(Math.log(anteil) / Math.log(1 - prozent / 100));
}
