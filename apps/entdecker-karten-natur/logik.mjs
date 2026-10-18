// Entdecker-Karten: reine Logik ohne DOM, testbar.
// Inhalte: Katalogeintrag Printmaterialien (docs/10), Praleska S. 50–51. Die Karten sind Eigenentwurf nach dieser Quelle.

/** Karten je gedrucktem Blatt (A4, zwei Spalten, drei Reihen). */
export const KARTEN_PRO_BLATT = 6;

/** Meldung, wenn die Kartendaten nicht geladen werden konnten. */
export const FEHLER_LADEN = 'Die Karten konnten nicht geladen werden. Bitte die Seite neu laden.';

/** Karten mit Kleinteilen (Steine, Sand, Ton), für Kinder von 1 bis 3 Jahren. */
export const KLEINTEIL_KARTEN = ['stoff-steine', 'stoff-sand', 'stoff-ton'];

/** Sicherheitssatz für Blätter mit Kleinteil-Karten. Eigenentwurf, keine Quellenaussage. */
export const SICHERHEITSHINWEIS = 'Steine, Sand und Ton nur mit der Fachkraft; kleine Teile von Kleinkindern fernhalten (Eigenentwurf, keine Quellenaussage).';

/**
 * Wertet die Antwort des Datenabrufs aus. Bei einem Fehlerstatus wirft die Funktion,
 * sonst liefert sie die geparsten Daten.
 * @param {{ ok: boolean, status: number, json: () => Promise<unknown> }} antwort
 */
export async function kartenAusAntwort(antwort) {
  if (!antwort.ok) throw new Error(`Datenabruf fehlgeschlagen, Status ${antwort.status}`);
  return antwort.json();
}

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

/**
 * Fußzeile einer Karte: Woher Begriff und Anregung stammen. Bei Pflanzen ist der Begriff
 * die Tätigkeit „benennen“ aus der Quelle; das Suchen draußen ist Eigenentwurf.
 * @param {{ gruppe: string, seite: number }} karte
 */
export function kartenFuss(karte) {
  if (karte.gruppe === 'pflanzen') {
    return `Benennen: Quelle S. ${karte.seite}; draußen suchen: Eigenentwurf`;
  }
  return `Begriff: Quelle S. ${karte.seite}; Beobachtungsanregung: Eigenentwurf`;
}

/**
 * Sicherheitssatz für ein Blatt: nur dann, wenn eine Kleinteil-Karte auf dem Blatt liegt.
 * @param {Array<{ id: string }>} karten
 * @returns {string|null}
 */
export function sicherheitsHinweis(karten) {
  return karten.some((k) => KLEINTEIL_KARTEN.includes(k.id)) ? SICHERHEITSHINWEIS : null;
}
