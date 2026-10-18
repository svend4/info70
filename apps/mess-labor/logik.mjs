// Mess-Labor der kleinen Forscher: reine Logik (ohne DOM), testbar.
// Ablauf „Vermutung → Prüfung → Schlussfolgerung“ (eigener Entwurf, eigene
// Inhalte): Die App sammelt die Vermutung, das echte
// Experiment passiert OHNE Bildschirm, danach wird verglichen – ohne Scham:
// falsche Vermutungen sind Forschung. Praleska docs/10 (Top-30 Nr. 27).

/** Geräte, die das Labor nennen soll; je Gerät muss ein Experiment es verwenden. */
export const GERAETE = {
  Waage: /Waage/,
  Messbecher: /Becher/,
  'Schnur oder Lineal': /Schnur|Lineal/,
  Thermometer: /Thermometer/,
  Lupe: /Lupe/,
};

/** Geräte, die kein Experiment verwendet (leer = alle abgedeckt). */
export function geraeteOhneExperiment(daten) {
  const alles = (daten?.experimente ?? []).map((e) => `${e.material} ${(e.anleitung ?? []).join(' ')}`).join(' ');
  return Object.keys(GERAETE).filter((name) => !GERAETE[name].test(alles));
}

/** Prüft die Experiment-Bank. Liefert Fehlerliste (leer = gültig). */
export function pruefeExperimente(daten) {
  const fehler = [];
  if (!Array.isArray(daten?.experimente) || daten.experimente.length < 10) return ['zu wenige Experimente'];
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
    // Wasser oder Küche: die Angabe „großer Mensch“ oder „Erwachsen“ muss im Material stehen.
    if (/Wasser|Küche/.test(`${e.material} ${e.anleitung?.join(' ')}`) && !/großen Menschen|Erwachsen/.test(e.material)) {
      fehler.push(`${e.id}: Erwachsenen-Hinweis bei Wasser oder Küche fehlt`);
    }
    if (e.eigenentwurf === false && !e.quelle?.seite) fehler.push(`${e.id}: Quelle ohne Seitenangabe`);
  }
  for (const name of geraeteOhneExperiment(daten)) fehler.push(`Gerät ohne Experiment: ${name}`);
  return fehler;
}

/**
 * Vergleicht Vermutung (Index) und beobachteten Befund (Index).
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
