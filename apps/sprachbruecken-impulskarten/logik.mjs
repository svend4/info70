// Sprachbrücken-Impulskarten: reine Logik (ohne DOM), testbar. Dreisprachige
// Gesprächs-Impulskarten (de/uk/ru + Aussprachehilfe) für alltagsintegrierte
// Sprachbildung in der Kita. Praleska docs/10 (Top-30 Nr. 18).

const KYRILLISCH = /[Ѐ-ӿ]/;
const NUR_LATEIN = /^[^Ѐ-ӿ]+$/;

/** Prüft die Karten-Bank. Liefert Fehlerliste (leer = gültig). */
export function pruefeKarten(daten) {
  const fehler = [];
  if (!Array.isArray(daten?.situationen) || daten.situationen.length < 4) fehler.push('zu wenige Situationen');
  if (!Array.isArray(daten?.karten) || daten.karten.length < 8) fehler.push('zu wenige Karten');
  const situationIds = new Set((daten?.situationen ?? []).map((s) => s.id));
  const ids = new Set();
  for (const k of daten?.karten ?? []) {
    if (!k.id || ids.has(k.id)) fehler.push(`Karten-Id fehlt/doppelt: ${k.id}`);
    ids.add(k.id);
    if (!situationIds.has(k.situation)) fehler.push(`${k.id}: unbekannte Situation`);
    for (const feld of ['de', 'uk', 'ukLat', 'ru', 'ruLat']) {
      if (!k[feld] || k[feld].length < 2) fehler.push(`${k.id}: Feld ${feld} fehlt`);
    }
    if (k.uk && !KYRILLISCH.test(k.uk)) fehler.push(`${k.id}: uk nicht kyrillisch`);
    if (k.ru && !KYRILLISCH.test(k.ru)) fehler.push(`${k.id}: ru nicht kyrillisch`);
    if (k.ukLat && !NUR_LATEIN.test(k.ukLat)) fehler.push(`${k.id}: ukLat enthält Kyrillisch`);
    if (k.ruLat && !NUR_LATEIN.test(k.ruLat)) fehler.push(`${k.id}: ruLat enthält Kyrillisch`);
  }
  for (const s of daten?.situationen ?? []) {
    const n = (daten.karten ?? []).filter((k) => k.situation === s.id).length;
    if (n < 2) fehler.push(`Situation ${s.id}: mindestens 2 Karten (ist ${n})`);
    if (!s.tipp || s.tipp.length < 20) fehler.push(`Situation ${s.id}: Praxis-Tipp fehlt`);
  }
  return fehler;
}

/** Karten einer Situation (oder alle bei null). */
export function kartenFuer(daten, situationId = null) {
  if (!situationId) return daten.karten;
  return daten.karten.filter((k) => k.situation === situationId);
}

/** Vorlese-Text einer Karte (de + beide Aussprachehilfen). */
export function vorleseText(karte) {
  return `${karte.de} – Ukrainisch: ${karte.ukLat} – Russisch: ${karte.ruLat}`;
}
