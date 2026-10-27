// Familien-Datenschatz: reine Logik (ohne DOM), testbar (docs/09 Ось F Nr. 271).
// Szenario-Content-Pack als Familien-Duett: Kind und Eltern antworten getrennt
// und vergleichen. Es werden keine Punkte vergeben: gezeigt wird nur, ob die Antworten
// gleich oder verschieden sind, dazu die faire Wahl, Erklärung und Gesprächsimpuls.

export const CODES = ['geben', 'ablehnen', 'fragen'];

/** Vergleicht die Antworten von Kind und Eltern für ein Szenario (einig oder nicht, ohne Wertung). */
export function vergleiche(szenario, kindAntwort, elternAntwort) {
  return {
    einig: kindAntwort === elternAntwort,
    beste: szenario.beste,
  };
}

/**
 * Ergebnis einer ganzen Runde: bei wie vielen Situationen waren Kind und Eltern einig.
 * @param {object[]} szenarien
 * @param {string[]} kindAntworten   parallel zu szenarien
 * @param {string[]} elternAntworten parallel zu szenarien
 */
export function rundeErgebnis(szenarien, kindAntworten = [], elternAntworten = []) {
  let einigCount = 0;
  szenarien.forEach((_s, i) => {
    if (kindAntworten[i] === elternAntworten[i]) einigCount++;
  });
  return {
    einigCount,
    gesamt: szenarien.length,
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
