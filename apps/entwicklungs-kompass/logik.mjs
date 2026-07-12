// Entwicklungs-Kompass Kita: reine Logik (ohne DOM), damit sie testbar ist.
// Wichtig (EU AI Act, docs/02): Es wird ausschließlich je Kind DOKUMENTIERT,
// welche Stufe bei welchem Indikator beobachtet wurde - KEIN Score, KEINE
// Rangfolge, KEIN Vergleich zwischen Kindern. Die Auswertung ist reiner Text
// ("Beobachtung, keine Diagnose"); es gibt bewusst keine Zahl, die ein Kind
// bewertet.

/** Kürzel bleiben absichtlich winzig: max 3 Zeichen, damit KEINE Namen entstehen. */
export const MAX_KUERZEL = 3;

/**
 * Normalisiert ein eingegebenes Kürzel: Rand-Leerzeichen weg, auf höchstens
 * MAX_KUERZEL Zeichen gekürzt. So kann gar kein Name gespeichert werden.
 * @param {unknown} roh
 * @returns {string}
 */
export function normalisiereKuerzel(roh) {
  if (typeof roh !== 'string') return '';
  return roh.trim().slice(0, MAX_KUERZEL);
}

/**
 * Prüft, ob ein Kürzel gültig ist: nicht-leerer String mit 1..MAX_KUERZEL
 * Zeichen (nach Trim). Der harte Längen-Deckel ist die technische Umsetzung
 * der Regel "keine Namen".
 * @param {unknown} kuerzel
 * @returns {boolean}
 */
export function kuerzelOk(kuerzel) {
  if (typeof kuerzel !== 'string') return false;
  const k = kuerzel.trim();
  return k.length >= 1 && k.length <= MAX_KUERZEL;
}

/** Alle Indikator-Kennungen des Katalogs (flach). @param {{bereiche: Array}} katalog */
export function alleIndikatorIds(katalog) {
  return katalog.bereiche.flatMap((b) => b.indikatoren.map((i) => i.id));
}

/** Alle Stufen-Kennungen des Katalogs. @param {{stufen: Array}} katalog */
export function alleStufenIds(katalog) {
  return katalog.stufen.map((s) => s.id);
}

/**
 * Prüft den Indikatoren-Katalog (daten/indikatoren.json).
 * Erwartet: genau 3 Stufen und genau 5 Bereiche mit je genau 6 beobachtbaren
 * Indikatoren; alle Indikator-Kennungen global eindeutig und mit dem Bereichs-
 * Präfix versehen. Liefert Fehlerliste (leer = gültig).
 * @param {unknown} katalog geparstes JSON
 * @returns {string[]}
 */
export function pruefeKatalog(katalog) {
  const k = /** @type {{bereiche?: unknown, stufen?: unknown}} */ (katalog);
  if (typeof katalog !== 'object' || katalog === null
    || !Array.isArray(k.bereiche) || !Array.isArray(k.stufen)) {
    return ['Kein gültiger Indikatoren-Katalog'];
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
 * Reine Vollständigkeits-Anzeige der Dokumentation - ausdrücklich KEIN
 * Leistungswert des Kindes.
 * @param {{bereiche: Array, stufen: Array}} katalog
 * @param {Record<string, string>} [beobKind] indikatorId -> stufeId
 * @returns {number}
 */
export function zaehleDokumentiert(katalog, beobKind = {}) {
  const stufen = new Set(alleStufenIds(katalog));
  return alleIndikatorIds(katalog).filter((id) => stufen.has(beobKind?.[id])).length;
}

/**
 * Baut die Beobachtungs-Dokumentation EINES Kindes als reinen Text (für das
 * <textarea>). Je Bereich werden alle Indikatoren mit ihrer dokumentierten
 * Stufe aufgelistet; nicht Dokumentiertes erscheint als "(offen)". Ohne Zahlen-
 * wertung, ohne Prozente, ohne Vergleich mit anderen Kindern.
 * @param {{bereiche: Array, stufen: Array}} katalog
 * @param {string} kuerzel
 * @param {Record<string, string>} [beobKind] indikatorId -> stufeId
 * @param {string} [datum] vorformatiertes Datum (Testbarkeit)
 * @returns {string}
 */
export function berichtFuerKind(katalog, kuerzel, beobKind = {}, datum = new Date().toLocaleDateString('de-DE')) {
  const stufenText = new Map(katalog.stufen.map((s) => [s.id, s.text]));
  const zeilen = [
    'Entwicklungs-Kompass Kita - Beobachtungs-Dokumentation',
    `Kind (Kürzel): ${kuerzel}`,
    `Stand: ${datum}`,
    '',
    'Beobachtung, keine Diagnose. Diese Dokumentation hält fest, was im Alltag',
    'beobachtet wurde. Sie bewertet, benotet und vergleicht kein Kind; jedes Kind',
    'entwickelt sich in seinem eigenen Tempo. Bei Fragen an Frühförderstellen oder',
    'die Kinderärztin bzw. den Kinderarzt.',
    '',
  ];
  for (const bereich of katalog.bereiche) {
    zeilen.push(`## ${bereich.emoji} ${bereich.name}`);
    for (const ind of bereich.indikatoren) {
      const stufe = beobKind?.[ind.id];
      const marke = stufenText.has(stufe) ? stufenText.get(stufe) : 'offen';
      zeilen.push(`- [${marke}] ${ind.text}`);
    }
    zeilen.push('');
  }
  zeilen.push('Diese Doku gehört in die Bildungsdokumentation der Einrichtung und ist als');
  zeilen.push('Grundlage für das Entwicklungsgespräch mit den Eltern gedacht - nicht als Urteil.');
  return zeilen.join('\n');
}
