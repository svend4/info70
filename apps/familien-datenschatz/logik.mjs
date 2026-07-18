// Familien-Datenschatz: reine Logik (ohne DOM), testbar (docs/09 Ось F Nr. 271).
// Szenario-Content-Pack als Familien-Duett: Kind und Eltern antworten getrennt
// und vergleichen. Wertung wie im szenario-Muster (beste 2, auchOk 1).

export const CODES = ['geben', 'ablehnen', 'fragen'];

/** Punkte einer Antwort für ein Szenario: beste=2, auchOk=1, sonst 0. */
export function bewerte(szenario, antwort) {
  if (antwort === szenario.beste) return 2;
  if (Array.isArray(szenario.auchOk) && szenario.auchOk.includes(antwort)) return 1;
  return 0;
}

/** Vergleicht die Antworten von Kind und Eltern für ein Szenario. */
export function vergleiche(szenario, kindAntwort, elternAntwort) {
  return {
    kindPunkte: bewerte(szenario, kindAntwort),
    elternPunkte: bewerte(szenario, elternAntwort),
    einig: kindAntwort === elternAntwort,
    beste: szenario.beste,
  };
}

/**
 * Ergebnis einer ganzen Runde.
 * @param {object[]} szenarien
 * @param {string[]} kindAntworten   parallel zu szenarien
 * @param {string[]} elternAntworten parallel zu szenarien
 */
export function rundeErgebnis(szenarien, kindAntworten = [], elternAntworten = []) {
  let kindGesamt = 0;
  let elternGesamt = 0;
  let einigCount = 0;
  szenarien.forEach((s, i) => {
    kindGesamt += bewerte(s, kindAntworten[i]);
    elternGesamt += bewerte(s, elternAntworten[i]);
    if (kindAntworten[i] === elternAntworten[i]) einigCount++;
  });
  return {
    kindGesamt,
    elternGesamt,
    einigCount,
    gesamt: szenarien.length,
    maxPunkte: szenarien.length * 2,
  };
}

/** Familien-Botschaft je nach Einigkeit (Gesprächsanlass, kein Gewinner). */
export function familienBotschaft(ergebnis) {
  const { einigCount, gesamt } = ergebnis;
  if (gesamt === 0) return 'Noch keine Runde gespielt.';
  const anteil = einigCount / gesamt;
  if (anteil === 1) return `Ihr wart euch bei allen ${gesamt} Situationen einig – tolles Familien-Team!`;
  if (anteil >= 0.6) return `Bei ${einigCount} von ${gesamt} wart ihr einig. Über den Rest lohnt sich ein kurzes Gespräch.`;
  return `Ihr habt oft unterschiedlich entschieden (${einigCount} von ${gesamt} gleich). Genau darüber lohnt sich das Familiengespräch – niemand hat „verloren“.`;
}
