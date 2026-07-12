// Privat-Koffer: den eigenen Antwort-Stand als Datei sichern und wieder
// einlesen (persönliches Backup, Gerätewechsel) - ganz ohne Server oder
// Konto (Muster: apps/mitmach-arena/koffer.mjs). Die Datei gehört der
// Fachkraft selbst; sie ist NICHT für Arbeitgeber oder Team gedacht.
// Reine Logik ohne DOM, testbar.

export const KOFFER_ART = 'selbstcheck-paedagogik-status';
export const KOFFER_VERSION = 1;

/**
 * Packt den Antwort-Stand (aussageId -> stufeId) in eine JSON-Datei.
 * @param {Record<string, string>} status
 */
export function packeKoffer(status) {
  return JSON.stringify({
    art: KOFFER_ART,
    version: KOFFER_VERSION,
    status: { ...status },
  }, null, 2);
}

/**
 * Prüft eine eingelesene Koffer-Datei. Liefert Fehlerliste (leer = gültig).
 * Optional werden die bekannten Aussage- und Stufen-Kennungen aus
 * daten/fragen.json mitgegeben und dann mitgeprüft.
 * @param {unknown} inhalt geparstes JSON
 * @param {{aussageIds?: string[]|null, stufenIds?: string[]|null}} [gueltig]
 * @returns {string[]}
 */
export function pruefeKoffer(inhalt, { aussageIds = null, stufenIds = null } = {}) {
  if (typeof inhalt !== 'object' || inhalt === null) return ['Keine gültige Selbstcheck-Datei'];
  const fehler = [];
  const k = /** @type {Record<string, unknown>} */ (inhalt);
  if (k.art !== KOFFER_ART) fehler.push('Das ist keine Selbstcheck-Datei');
  if (k.version !== KOFFER_VERSION) fehler.push('Unbekannte Datei-Version');
  if (typeof k.status !== 'object' || k.status === null || Array.isArray(k.status)) {
    fehler.push('Antworten fehlen oder sind ungültig');
    return fehler;
  }
  for (const [id, stufe] of Object.entries(k.status)) {
    if (aussageIds && !aussageIds.includes(id)) fehler.push(`Unbekannte Aussage: ${id}`);
    if (typeof stufe !== 'string' || (stufenIds && !stufenIds.includes(stufe))) {
      fehler.push(`Ungültige Selbsteinschätzung bei: ${id}`);
    }
  }
  return fehler;
}

/**
 * Führt einen importierten Antwort-Stand mit dem laufenden zusammen:
 * Eigene, bereits gegebene Antworten behalten Vorrang, der Import füllt
 * nur Lücken - nichts wird überschrieben. Ohne laufenden Stand wird der
 * Import übernommen. Liefert immer ein neues Objekt (keine Referenzen).
 * @param {Record<string, string>|null} laufend
 * @param {Record<string, string>} importiert
 * @returns {Record<string, string>}
 */
export function vereinigeKoffer(laufend, importiert) {
  return { ...importiert, ...(laufend ?? {}) };
}
