// Entdecker-Karten: reine Logik ohne DOM, testbar.
// Inhalte: Praleska, S. 50 bis 51 (Einheit 4). Die Karten sind Eigenentwurf nach dieser Quelle.

/** Karten je gedrucktem Blatt (A4, zwei Spalten, drei Reihen). */
export const KARTEN_PRO_BLATT = 6;

/**
 * Filtert die Karten nach Gruppe. `null` heißt: alle Karten.
 * @param {Array<object>} karten
 * @param {string|null} [gruppe]
 */
export function filtereKarten(karten, gruppe = null) {
  return karten.filter((k) => !gruppe || k.gruppe === gruppe);
}

/**
 * Zählt die Karten je Gruppe.
 * @param {Array<object>} karten
 * @returns {Record<string, number>}
 */
export function zaehleJeGruppe(karten) {
  const summen = {};
  for (const k of karten) summen[k.gruppe] = (summen[k.gruppe] ?? 0) + 1;
  return summen;
}

/**
 * Teilt Karten in Blätter zu `proBlatt` Karten. Die Reihenfolge bleibt erhalten.
 * @param {Array<object>} karten
 * @param {number} [proBlatt]
 * @returns {Array<Array<object>>}
 */
export function blaettern(karten, proBlatt = KARTEN_PRO_BLATT) {
  if (!Number.isInteger(proBlatt) || proBlatt < 1) {
    throw new RangeError('proBlatt muss eine ganze Zahl von 1 oder mehr sein');
  }
  const blaetter = [];
  for (let i = 0; i < karten.length; i += proBlatt) {
    blaetter.push(karten.slice(i, i + proBlatt));
  }
  return blaetter;
}

/**
 * Kopfzeile eines Blattes: Gruppe und Blattnummer. Bewusst ohne Feld für einen Namen.
 * @param {{ gruppe: string, nummer: number, gesamt: number }} angaben
 */
export function blattKopf({ gruppe, nummer, gesamt }) {
  return `${gruppe}, Blatt ${nummer} von ${gesamt}`;
}

/**
 * Seitenangabe und Kennzeichnung für jede Anregung einer Karte.
 * Die Anregungen sind Eigenentwurf nach der Quellenseite der Karte.
 * @param {{ seite: number }} karte
 */
export function anregungsMarke(karte) {
  return `S. ${karte.seite}, Eigenentwurf`;
}
