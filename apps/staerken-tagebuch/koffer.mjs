// Beobachtungs-Koffer: Markierungen als Datei exportieren/importieren und
// zusammenführen - so führen z. B. zwei Elternteile ihre Beobachtungen von
// zwei Geräten zusammen oder nehmen sie beim Gerätewechsel mit. Ganz ohne
// Server, Konten oder Cloud (Muster: apps/mitmach-arena/koffer.mjs).
// Reine Logik ohne DOM, damit sie testbar ist.

export const KOFFER_ART = 'staerken-tagebuch-beobachtungen';
export const KOFFER_VERSION = 1;

/** @param {Record<string, number>} markierungen Moment-Id -> Anzahl */
export function packeKoffer(markierungen) {
  return JSON.stringify({
    art: KOFFER_ART,
    version: KOFFER_VERSION,
    markierungen,
  }, null, 2);
}

/**
 * Prüft eine eingelesene Koffer-Datei. Liefert Fehlerliste (leer = gültig).
 * @param {unknown} inhalt geparstes JSON
 * @param {Iterable<string>} [bekannteIds] erlaubte Moment-Ids aus dem Katalog;
 *   wenn angegeben, werden unbekannte Ids abgelehnt - so kann auch über den
 *   Import kein Freitext über das Kind eingeschleust werden.
 * @returns {string[]}
 */
export function pruefeKoffer(inhalt, bekannteIds = null) {
  if (typeof inhalt !== 'object' || inhalt === null) return ['Keine gültige Koffer-Datei'];
  const fehler = [];
  const k = /** @type {Record<string, unknown>} */ (inhalt);
  if (k.art !== KOFFER_ART) fehler.push('Das ist keine Stärken-Tagebuch-Datei');
  if (k.version !== KOFFER_VERSION) fehler.push('Unbekannte Datei-Version');
  const m = k.markierungen;
  if (typeof m !== 'object' || m === null || Array.isArray(m)) {
    fehler.push('Markierungen fehlen oder sind ungültig');
    return fehler;
  }
  const erlaubt = bekannteIds ? new Set(bekannteIds) : null;
  for (const [id, anzahl] of Object.entries(m)) {
    if (!Number.isInteger(anzahl) || anzahl < 1) fehler.push(`Ungültige Anzahl für "${id}"`);
    if (erlaubt && !erlaubt.has(id)) fehler.push(`Unbekannter Beobachtungs-Moment: "${id}"`);
  }
  return fehler;
}

/**
 * Führt importierte Markierungen mit den lokalen zusammen: Anzahlen werden
 * je Moment addiert (nur Häufigkeit, keine Bewertung). Original bleibt
 * unverändert.
 * @param {Record<string, number>|null} lokal
 * @param {Record<string, number>} importiert
 * @returns {Record<string, number>}
 */
export function vereinigeKoffer(lokal, importiert) {
  const ergebnis = { ...(lokal ?? {}) };
  for (const [id, anzahl] of Object.entries(importiert)) {
    ergebnis[id] = (ergebnis[id] ?? 0) + anzahl;
  }
  return ergebnis;
}
