// Mess-Labor der kleinen Forscher: reine Logik (ohne DOM), testbar.
// Didaktik „Vermutung → Prüfung → Schlussfolgerung“ (Stiftung-Kinder-
// forschen-Ansatz, eigene Inhalte): Die App sammelt die Vermutung, das echte
// Experiment passiert OHNE Bildschirm, danach wird verglichen – ohne Scham:
// falsche Vermutungen sind Forschung. Praleska docs/10 (Top-30 Nr. 27).

/** Prüft die Experiment-Bank. Liefert Fehlerliste (leer = gültig). */
export function pruefeExperimente(daten) {
  const fehler = [];
  if (!Array.isArray(daten?.experimente) || daten.experimente.length < 6) return ['zu wenige Experimente'];
  const ids = new Set();
  for (const e of daten.experimente) {
    if (!e.id || ids.has(e.id)) fehler.push(`Id fehlt/doppelt: ${e.id}`);
    ids.add(e.id);
    for (const feld of ['titel', 'frage', 'material', 'erkenntnis']) {
      if (!e[feld] || e[feld].length < 5) fehler.push(`${e.id}: ${feld} fehlt`);
    }
    if (!Array.isArray(e.anleitung) || e.anleitung.length < 2) fehler.push(`${e.id}: Anleitung zu kurz`);
    if (!Array.isArray(e.vermutungen) || e.vermutungen.length !== 3) fehler.push(`${e.id}: 3 Vermutungen`);
    if (!Array.isArray(e.ergebnisse) || e.ergebnisse.length !== 3) fehler.push(`${e.id}: 3 Ergebnisse`);
    if (e.erkenntnis && e.erkenntnis.length < 60) fehler.push(`${e.id}: Erkenntnis zu kurz (dort passiert das Lernen)`);
  }
  return fehler;
}

/**
 * Vergleicht Vermutung (Index) und beobachtetes Ergebnis (Index).
 * Bewusst OHNE richtig/falsch-Wertung des Kindes: Auch eine widerlegte
 * Vermutung ist ein Forschungserfolg.
 * @returns {{stimmte: boolean, botschaft: string}}
 */
export function vergleicheVermutung(vermutungIndex, ergebnisIndex) {
  const stimmte = vermutungIndex === ergebnisIndex;
  return {
    stimmte,
    botschaft: stimmte
      ? 'Deine Vermutung hat gestimmt! Du hast sie geprüft wie eine echte Forscherin, ein echter Forscher.'
      : 'Überraschung – es kam anders als vermutet! Genau dafür forscht man: Erst durch das Ausprobieren weiß man es wirklich.',
  };
}

/** Merkzettel-Text eines abgeschlossenen Experiments (zum Vorlesen/Erzählen). */
export function forscherSatz(experiment, vermutungIndex, ergebnisIndex) {
  const v = experiment.vermutungen[vermutungIndex];
  const e = experiment.ergebnisse[ergebnisIndex];
  return `Ich habe vermutet: ${v}. Herausgefunden habe ich: ${e}.`;
}
