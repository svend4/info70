// Familienschatz (Reime/Kniereiter/Wiegenlieder): reine Logik (ohne DOM),
// testbar. Praleska docs/10 (Top-30 Nr. 13). Beispieltexte sind Eigenproduktion;
// der eigentliche Schatz ist die (lokal gesammelte) Familiensammlung.

/** Prüft die Schatz-Daten (Arten + Beispiele). Liefert Fehlerliste. */
export function pruefeSchatz(daten) {
  const fehler = [];
  if (!Array.isArray(daten?.arten) || daten.arten.length < 3) fehler.push('zu wenige Arten');
  if (!Array.isArray(daten?.beispiele) || daten.beispiele.length < 3) fehler.push('zu wenige Beispiele');
  const artIds = new Set((daten.arten ?? []).map((a) => a.id));
  for (const b of daten.beispiele ?? []) {
    if (!artIds.has(b.artId)) fehler.push(`Beispiel ${b.id}: unbekannte Art ${b.artId}`);
    if (!b.text || b.text.length < 20) fehler.push(`Beispiel ${b.id}: Text fehlt`);
  }
  return fehler;
}

/** Name einer Art anhand der id. */
export function artName(daten, artId) {
  return daten.arten.find((a) => a.id === artId)?.name ?? artId;
}

/** Nächster Index im Kreis (für „noch ein Beispiel“). */
export function naechsterIndex(aktuell, laenge) {
  if (laenge <= 0) return 0;
  return (aktuell + 1) % laenge;
}

/** Normalisiert einen eigenen Eintrag der Familiensammlung (Titel Pflicht). */
export function normalisiereEintrag(roh) {
  const titel = String(roh?.titel ?? '').trim().slice(0, 80);
  const text = String(roh?.text ?? '').trim().slice(0, 800);
  return { titel, text };
}

/** Ein eigener Eintrag ist gültig, wenn er einen Titel hat. */
export function eintragOk(eintrag) {
  return typeof eintrag?.titel === 'string' && eintrag.titel.trim().length >= 1;
}
