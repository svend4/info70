// Jahreszeiten-Rad: reine Logik (ohne DOM), testbar. Verknüpft Tageslänge,
// Temperatur und die Veränderungen bei Pflanzen, Tieren und Menschen über die
// vier Jahreszeiten (meteorologisch). Praleska docs/10 (Top-30 Nr. 22).

/** Feste Rad-Reihenfolge. */
export const REIHENFOLGE = ['fruehling', 'sommer', 'herbst', 'winter'];

/** Prüft die Daten. Liefert Fehlerliste (leer = gültig). */
export function pruefeDaten(daten) {
  const fehler = [];
  if (!Array.isArray(daten?.jahreszeiten) || daten.jahreszeiten.length !== 4) return ['genau 4 Jahreszeiten erwartet'];
  const ids = daten.jahreszeiten.map((j) => j.id);
  for (const id of REIHENFOLGE) if (!ids.includes(id)) fehler.push(`Jahreszeit ${id} fehlt`);
  const tierIds = (daten.tiere ?? []).map((t) => t.id);
  if (tierIds.length < 3) fehler.push('mindestens 3 Tiere');
  const alleMonate = [];
  for (const j of daten.jahreszeiten) {
    if (!Number.isInteger(j.tageslaengeStunden) || j.tageslaengeStunden < 6 || j.tageslaengeStunden > 18) {
      fehler.push(`${j.id}: Tageslänge unplausibel`);
    }
    for (const feld of ['temperatur', 'himmel', 'pflanzen', 'menschen']) {
      if (!j[feld] || j[feld].length < 20) fehler.push(`${j.id}: ${feld} fehlt`);
    }
    if (!Array.isArray(j.monate) || j.monate.length !== 3) fehler.push(`${j.id}: 3 Monate erwartet`);
    else alleMonate.push(...j.monate);
    for (const t of tierIds) {
      if (!j.tiere?.[t] || j.tiere[t].length < 20) fehler.push(`${j.id}: Tier-Text ${t} fehlt`);
    }
  }
  if (alleMonate.length === 12 && new Set(alleMonate).size !== 12) fehler.push('Monate doppelt/fehlend');
  for (const q of daten.quiz ?? []) {
    if (!Array.isArray(q.antworten) || q.antworten.length !== 3) fehler.push(`${q.id}: 3 Antworten`);
    if (!Number.isInteger(q.korrekt) || q.korrekt < 0 || q.korrekt > 2) fehler.push(`${q.id}: korrekt 0..2`);
    if (!q.erklaerung || q.erklaerung.length < 20) fehler.push(`${q.id}: Erklärung fehlt`);
  }
  if ((daten.quiz ?? []).length < 4) fehler.push('mindestens 4 Quizfragen');
  return fehler;
}

/** Jahreszeit zu einem Kalendermonat (1–12, meteorologisch). */
export function jahreszeitFuerMonat(daten, monat) {
  return daten.jahreszeiten.find((j) => j.monate.includes(monat)) ?? null;
}

/** Nächste Jahreszeit im Rad (zyklisch). */
export function naechste(daten, id) {
  const idx = REIHENFOLGE.indexOf(id);
  const nid = REIHENFOLGE[(idx + 1) % REIHENFOLGE.length];
  return daten.jahreszeiten.find((j) => j.id === nid);
}

/** Sonnen-Balken: sichtbare „Licht-Stunden“ von 24 (für die Anzeige). */
export function lichtBalken(stunden) {
  const hell = Math.max(0, Math.min(24, stunden));
  return '☀️'.repeat(Math.round(hell / 2)) + '🌙'.repeat(Math.round((24 - hell) / 2));
}

/** Vergleichssatz zweier Jahreszeiten (Tageslänge). */
export function vergleicheTage(a, b) {
  if (a.tageslaengeStunden === b.tageslaengeStunden) {
    return `Im ${a.name} und im ${b.name} sind die Tage ungefähr gleich lang.`;
  }
  const [laenger, kuerzer] = a.tageslaengeStunden > b.tageslaengeStunden ? [a, b] : [b, a];
  const diff = laenger.tageslaengeStunden - kuerzer.tageslaengeStunden;
  return `Im ${laenger.name} ist es etwa ${diff} Stunden länger hell als im ${kuerzer.name}.`;
}
