// Schulstart-Begleiter: reine Logik (ohne DOM), damit sie testbar ist.
// Beobachtungsbogen zur Schulfähigkeit für Fachkräfte. Wie beim Entwicklungs-
// Kompass gilt (EU AI Act, docs/02): Es wird je Kind nur DOKUMENTIERT, welche
// Stufe bei welchem Reifemerkmal beobachtet wurde – KEIN Score, KEINE
// Rangfolge, KEIN Vergleich zwischen Kindern, KEINE Schulreife-Note. Die
// Auswertung ist reiner Text ("Beobachtung, keine Diagnose, kein Screening-
// Ersatz"). Engine-Muster: apps/entwicklungs-kompass.

/** Kürzel bleiben absichtlich winzig: max 3 Zeichen, damit KEINE Namen entstehen. */
export const MAX_KUERZEL = 3;

/** Normalisiert ein Kürzel: Rand-Leerzeichen weg, auf höchstens MAX_KUERZEL gekürzt. */
export function normalisiereKuerzel(roh) {
  if (typeof roh !== 'string') return '';
  return roh.trim().slice(0, MAX_KUERZEL);
}

/** Gültiges Kürzel: nicht-leerer String mit 1..MAX_KUERZEL Zeichen (nach Trim). */
export function kuerzelOk(kuerzel) {
  if (typeof kuerzel !== 'string') return false;
  const k = kuerzel.trim();
  return k.length >= 1 && k.length <= MAX_KUERZEL;
}

/** Alle Indikator-Kennungen des Katalogs (flach). */
export function alleIndikatorIds(katalog) {
  return katalog.bereiche.flatMap((b) => b.indikatoren.map((i) => i.id));
}

/** Alle Stufen-Kennungen des Katalogs. */
export function alleStufenIds(katalog) {
  return katalog.stufen.map((s) => s.id);
}

/**
 * Prüft den Katalog: genau 3 Stufen und genau 5 Bereiche mit je genau 6
 * beobachtbaren Indikatoren; alle Indikator-Kennungen global eindeutig und mit
 * dem Bereichs-Präfix versehen. Liefert Fehlerliste (leer = gültig).
 */
export function pruefeKatalog(katalog) {
  const k = /** @type {{bereiche?: unknown, stufen?: unknown}} */ (katalog);
  if (typeof katalog !== 'object' || katalog === null
    || !Array.isArray(k.bereiche) || !Array.isArray(k.stufen)) {
    return ['Kein gültiger Katalog'];
  }
  const fehler = [];
  if (k.stufen.length !== 3) fehler.push(`Es müssen genau 3 Stufen sein (gefunden: ${k.stufen.length})`);
  for (const stufe of k.stufen) {
    if (!stufe || typeof stufe.id !== 'string' || typeof stufe.text !== 'string' || stufe.text.length === 0) {
      fehler.push('Stufe ohne id/text');
    }
  }
  if (k.bereiche.length !== 5) fehler.push(`Es müssen genau 5 Bereiche sein (gefunden: ${k.bereiche.length})`);
  const bereichIds = new Set();
  const indikatorIds = new Set();
  for (const bereich of k.bereiche) {
    if (!bereich || typeof bereich.id !== 'string' || bereich.id.length === 0) {
      fehler.push('Bereich ohne id');
      continue;
    }
    if (bereichIds.has(bereich.id)) fehler.push(`Bereich-Id doppelt: ${bereich.id}`);
    bereichIds.add(bereich.id);
    if (typeof bereich.name !== 'string' || bereich.name.length === 0) fehler.push(`${bereich.id}: Name fehlt`);
    if (typeof bereich.emoji !== 'string' || bereich.emoji.length === 0) fehler.push(`${bereich.id}: Emoji fehlt`);
    if (typeof bereich.fokus !== 'string' || bereich.fokus.length === 0) fehler.push(`${bereich.id}: Fokus fehlt`);
    if (!Array.isArray(bereich.indikatoren) || bereich.indikatoren.length !== 6) {
      fehler.push(`${bereich.id}: es müssen genau 6 beobachtbare Indikatoren sein`);
      continue;
    }
    for (const ind of bereich.indikatoren) {
      if (!ind || typeof ind.id !== 'string' || ind.id.length === 0
        || typeof ind.text !== 'string' || ind.text.length === 0) {
        fehler.push(`${bereich.id}: Indikator ohne id/text`);
        continue;
      }
      if (indikatorIds.has(ind.id)) fehler.push(`Indikator-Id doppelt: ${ind.id}`);
      indikatorIds.add(ind.id);
      if (!ind.id.startsWith(`${bereich.id}-`)) {
        fehler.push(`${ind.id}: Kennung muss zum Bereich ${bereich.id} gehören`);
      }
    }
  }
  return fehler;
}

/**
 * Zählt, wie viele Indikatoren für EIN Kind dokumentiert sind (gültige Stufe).
 * Reine Vollständigkeits-Anzeige der Dokumentation – ausdrücklich KEIN
 * Reifewert des Kindes.
 */
export function zaehleDokumentiert(katalog, beobKind = {}) {
  const stufen = new Set(alleStufenIds(katalog));
  return alleIndikatorIds(katalog).filter((id) => stufen.has(beobKind?.[id])).length;
}

/**
 * Baut die Beobachtungs-Dokumentation EINES Kindes als reinen Text. Je Bereich
 * werden alle Indikatoren mit ihrer dokumentierten Stufe aufgelistet; nicht
 * Dokumentiertes erscheint als "(offen)". Ohne Zahlenwertung, ohne Prozente,
 * ohne Vergleich. Kopf-/Hinweis-/Fuss-Texte kommen aus dem Katalog.
 */
export function berichtFuerKind(katalog, kuerzel, beobKind = {}, datum = new Date().toLocaleDateString('de-DE')) {
  const stufenText = new Map(katalog.stufen.map((s) => [s.id, s.text]));
  const kopf = katalog.berichtKopf ?? 'Beobachtungs-Dokumentation';
  const hinweis = Array.isArray(katalog.berichtHinweis) ? katalog.berichtHinweis : [
    'Beobachtung, keine Diagnose und kein Ersatz für das Schuleingangsverfahren.',
  ];
  const fuss = Array.isArray(katalog.berichtFuss) ? katalog.berichtFuss : [];
  const zeilen = [kopf, `Kind (Kürzel): ${kuerzel}`, `Stand: ${datum}`, '', ...hinweis, ''];
  for (const bereich of katalog.bereiche) {
    zeilen.push(`## ${bereich.emoji} ${bereich.name}`);
    for (const ind of bereich.indikatoren) {
      const stufe = beobKind?.[ind.id];
      const marke = stufenText.has(stufe) ? stufenText.get(stufe) : 'offen';
      zeilen.push(`- [${marke}] ${ind.text}`);
    }
    zeilen.push('');
  }
  if (fuss.length) zeilen.push(...fuss);
  return zeilen.join('\n');
}
