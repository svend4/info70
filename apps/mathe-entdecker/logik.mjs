// Mathe-Entdecker, Logik für den Modus „Reihen legen“ und die Prüfung der Fragenbank.
// Reine Funktionen: keine Zufallsquelle, keine Uhr, kein Speicher, kein DOM. Die Zahlenreihe kommt als
// Parameter (zufallsReihe: ganze, nicht negative Zahlen); die Folge der Aufgaben ist fest (folgeZu). Eigenentwurf.
// Themen aus Praleska S. 136–138 (Mengen, Zählen, Reihen aus 3 bis 5 Objekten, Linienarten, Richtung,
// Wochentage, Jahreszeiten); die Begriffe und Aufgaben sind eigene Formulierungen.
// Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.
import { pruefeFragen } from '../../packages/quiz-kern/src/schema.mjs';

/** Namen je Regel: der Index ist die Rangzahl (0 = kleinste oder hellste). Eigenentwurf. */
export const NAMEN = {
  groesse: ['sehr klein', 'klein', 'mittel', 'groß', 'sehr groß'],
  farbe: ['sehr hell', 'hell', 'mittel', 'dunkel', 'sehr dunkel'],
};

/** Die Themen der Fragenbank: je Thema mindestens eine Frage (Bauauftrag GEM-8, Abschnitt 5). */
export const THEMEN = ['mengen', 'zaehlen', 'formen', 'reihen', 'groesse', 'richtung', 'haelfte', 'zeit', 'linien', 'wochentage', 'jahreszeiten'];

/**
 * Zwölf feste Zahlenreihen (je eine Anordnung der Zahlen 0 bis 9), von Hand festgelegt: jede Regel, jede Anzahl
 * von 3 bis 5 und jede Lage der Lücke kommen vor. Keine Zufallsquelle.
 */
export const FOLGEN = [
  [0, 6, 3, 1, 2, 4, 5, 7, 8, 9],
  [5, 9, 2, 0, 1, 3, 4, 6, 7, 8],
  [1, 4, 3, 0, 2, 5, 6, 7, 8, 9],
  [6, 1, 9, 0, 2, 3, 4, 5, 7, 8],
  [2, 5, 4, 0, 1, 3, 6, 7, 8, 9],
  [7, 8, 0, 1, 2, 3, 4, 5, 6, 9],
  [9, 3, 4, 0, 1, 2, 5, 6, 7, 8],
  [4, 0, 8, 1, 2, 3, 5, 6, 7, 9],
  [8, 4, 0, 1, 2, 3, 5, 6, 7, 9],
  [3, 7, 6, 0, 1, 2, 4, 5, 8, 9],
  [9, 2, 3, 0, 1, 4, 5, 6, 7, 8],
  [0, 8, 1, 2, 3, 4, 5, 6, 7, 9],
];

/** Die feste Zahlenreihe der Aufgabe mit dieser Nummer: die Aufgabe n nimmt die Reihe n mod 12. */
export function folgeZu(nummer) {
  return FOLGEN[nummer % FOLGEN.length];
}

/** Rangzahl eines Objekts nach der Regel. */
export function merkmal(objekt, regel) {
  return objekt[regel];
}

/**
 * Aufgabe: die Reihe, nach der Regel sortiert, mit einer freien Stelle (luecke, null in der Reihe).
 * @param {Array<{groesse: number, farbe: number}>} objekte 3 bis 5 Objekte mit verschiedenen Rangzahlen
 * @param {'groesse' | 'farbe'} regel
 * @param {number[]} zufallsReihe ganze Zahlen; die erste bestimmt die freie Stelle
 */
export function erstelleReihe(objekte, regel, zufallsReihe) {
  const reihe = [...objekte].sort((a, b) => merkmal(a, regel) - merkmal(b, regel));
  const luecke = zufallsReihe[0] % reihe.length;
  return {
    regel,
    luecke,
    richtig: reihe[luecke],
    reihe: reihe.map((objekt, i) => (i === luecke ? null : objekt)),
  };
}

/**
 * Prüft eine gelegte Reihe: 3 bis 5 Objekte, und die Rangzahl wächst von Stelle zu Stelle.
 * @returns {{ ok: boolean, fehlerIndex: number | null }}
 */
export function pruefeReihe(gelegt, regel) {
  if (gelegt.length < 3 || gelegt.length > 5) return { ok: false, fehlerIndex: 0 };
  for (let i = 1; i < gelegt.length; i++) {
    if (merkmal(gelegt[i], regel) <= merkmal(gelegt[i - 1], regel)) return { ok: false, fehlerIndex: i };
  }
  return { ok: true, fehlerIndex: null };
}

/**
 * Aufgabe aus einer Zahlenreihe (eine Anordnung der Zahlen 0 bis 9, siehe folgeZu): Regel, Zahl der Objekte
 * (3 bis 5), verschiedene Rangzahlen und freie Stelle. Gleiche Zahlenreihe, gleiche Aufgabe.
 */
export function neueAufgabe(zufallsReihe) {
  const regel = zufallsReihe[0] < 5 ? 'groesse' : 'farbe';
  const anzahl = 3 + (zufallsReihe[1] % 3);
  const werte = zufallsReihe.filter((z) => z < 5).slice(0, anzahl);
  const objekte = werte.map((wert) => (regel === 'groesse' ? { groesse: wert, farbe: 2 } : { groesse: 2, farbe: wert }));
  return { objekte, ...erstelleReihe(objekte, regel, zufallsReihe.slice(2)) };
}

/**
 * Prüfung der Fragenbank: Schema (quiz-kern), Thema und Eigenentwurf je Frage, Seitenangabe je Frage,
 * je Thema eine Frage, mindestens 12 Fragen. Eine leere Liste heißt: in Ordnung.
 * @returns {string[]}
 */
export function pruefeMatheFragen(fragen) {
  const fehler = pruefeFragen({ fragen }, { mindestFragen: 12 });
  for (const f of fragen) {
    if (!THEMEN.includes(f.thema)) fehler.push(`${f.id}: Thema fehlt oder ist unbekannt`);
    if (typeof f.eigenentwurf !== 'boolean') fehler.push(`${f.id}: eigenentwurf fehlt`);
    if (!f.quelle?.seite) fehler.push(`${f.id}: Seitenangabe fehlt`);
  }
  for (const thema of THEMEN) {
    if (!fragen.some((f) => f.thema === thema)) fehler.push(`Thema ohne Frage: ${thema}`);
  }
  return fehler;
}

/** Die Fragen mit ihren Angaben aus dem Block quellen (Thema, Seitenangabe, Eigenentwurf), je Frage-Kennung. */
export function mitQuellen(daten) {
  return daten.fragen.map((frage) => ({ ...frage, ...daten.quellen[frage.id] }));
}
