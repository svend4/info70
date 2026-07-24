// Klang-Detektive: reine Logik (ohne DOM), testbar. Die Klänge selbst werden
// lokal per WebAudio erzeugt (kein fremdes Audio, keine externen Requests); die
// Logik hier prüft, dass jede Frage IN SICH stimmig ist – die hinterlegte
// korrekte Antwort passt zu den Klang-Parametern UND zum Fragewortlaut.
// Praleska docs/10 (Top-30 Nr. 20).

const idxMax = (arr, wert) => arr.reduce((best, x, i, a) => (wert(x) > wert(a[best]) ? i : best), 0);
const idxMin = (arr, wert) => arr.reduce((best, x, i, a) => (wert(x) < wert(a[best]) ? i : best), 0);

/**
 * Erwartete korrekte Antwort aus den Parametern + dem Fragewortlaut.
 * @returns {number} Index der richtigen Option
 */
export function erwarteteAntwort(frage) {
  const f = frage.frage;
  switch (frage.typ) {
    case 'hoch-tief':
      return /tiefer/.test(f) ? idxMin(frage.toene, (t) => t.hz) : idxMax(frage.toene, (t) => t.hz);
    case 'laut-leise':
      return /leiser/.test(f) ? idxMin(frage.toene, (t) => t.gain) : idxMax(frage.toene, (t) => t.gain);
    case 'schnell-langsam':
      return /langsamer/.test(f) ? idxMin(frage.rhythmen, (r) => r.schlaege) : idxMax(frage.rhythmen, (r) => r.schlaege);
    case 'hoch-runter':
      return frage.glide.bis > frage.glide.von ? 0 : 1; // 0 = nach oben, 1 = nach unten
    case 'weich-scharf':
      return frage.klang.wellenform === 'sine' ? 0 : 1; // 0 = weich, 1 = scharf
    default:
      return -1;
  }
}

/** Prüft die Fragenbank: Schema + Selbstkonsistenz (korrekt passt zu Parametern). */
export function pruefeFragen(daten) {
  const fehler = [];
  if (!Array.isArray(daten?.fragen) || daten.fragen.length < 8) return ['zu wenige Fragen'];
  const ids = new Set();
  for (const q of daten.fragen) {
    if (!q.id || ids.has(q.id)) fehler.push(`Id fehlt/doppelt: ${q.id}`);
    ids.add(q.id);
    if (!Array.isArray(q.optionen) || q.optionen.length !== 2) fehler.push(`${q.id}: genau 2 Optionen`);
    if (!q.frage || !q.erklaerung || q.erklaerung.length < 15) fehler.push(`${q.id}: Frage/Erklärung fehlt`);
    const erwartet = erwarteteAntwort(q);
    if (erwartet < 0) fehler.push(`${q.id}: unbekannter Typ ${q.typ}`);
    else if (q.korrekt !== erwartet) fehler.push(`${q.id}: korrekt=${q.korrekt}, aber aus Parametern folgt ${erwartet}`);
  }
  return fehler;
}

/** Rang zur Punktzahl (höchster passender „ab“-Wert). */
export function rangFuer(raenge, punkte) {
  let treffer = raenge[0];
  for (const r of raenge) if (punkte >= r.ab) treffer = r;
  return treffer;
}
