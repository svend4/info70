// Klassen-Koffer: Abstimmungen als Datei exportieren/importieren und
// zusammenführen - so sammelt eine Lehrkraft Stimmen von mehreren Geräten
// ein, ganz ohne Server, Konten oder Chats (fragFINN-konformer Austausch).
// Reine Logik ohne DOM, damit sie testbar ist.

export const KOFFER_ART = 'mitmach-arena-umfrage';
export const KOFFER_VERSION = 1;

/** @param {{frage: string, optionen: string[], stimmen: number[]}} umfrage */
export function packeKoffer(umfrage) {
  return JSON.stringify({
    art: KOFFER_ART,
    version: KOFFER_VERSION,
    frage: umfrage.frage,
    optionen: umfrage.optionen,
    stimmen: umfrage.stimmen,
  }, null, 2);
}

/**
 * Prüft eine eingelesene Koffer-Datei. Liefert Fehlerliste (leer = gültig).
 * @param {unknown} inhalt geparstes JSON
 * @returns {string[]}
 */
export function pruefeKoffer(inhalt) {
  const fehler = [];
  const k = /** @type {Record<string, unknown>} */ (inhalt);
  if (typeof inhalt !== 'object' || inhalt === null) return ['Keine gültige Koffer-Datei'];
  if (k.art !== KOFFER_ART) fehler.push('Das ist keine Mitmach-Arena-Datei');
  if (k.version !== KOFFER_VERSION) fehler.push('Unbekannte Datei-Version');
  if (typeof k.frage !== 'string' || k.frage.length === 0) fehler.push('Frage fehlt');
  if (!Array.isArray(k.optionen) || k.optionen.length < 2 || !k.optionen.every((o) => typeof o === 'string')) {
    fehler.push('Möglichkeiten fehlen oder sind ungültig');
  }
  if (!Array.isArray(k.stimmen) || !k.stimmen.every((s) => Number.isInteger(s) && s >= 0)) {
    fehler.push('Stimmen fehlen oder sind ungültig');
  } else if (Array.isArray(k.optionen) && k.stimmen.length !== k.optionen.length) {
    fehler.push('Stimmen passen nicht zu den Möglichkeiten');
  }
  return fehler;
}

/**
 * Führt einen importierten Koffer mit der laufenden Umfrage zusammen.
 * Gleiche Frage und gleiche Möglichkeiten -> Stimmen werden addiert.
 * Keine laufende Umfrage -> Import wird übernommen.
 * Sonst -> null (nicht zusammenführbar).
 * @param {{frage: string, optionen: string[], stimmen: number[]}|null} laufend
 * @param {{frage: string, optionen: string[], stimmen: number[]}} importiert
 */
export function vereinigeKoffer(laufend, importiert) {
  if (!laufend) {
    return { frage: importiert.frage, optionen: [...importiert.optionen], stimmen: [...importiert.stimmen] };
  }
  const gleich = laufend.frage === importiert.frage
    && laufend.optionen.length === importiert.optionen.length
    && laufend.optionen.every((o, i) => o === importiert.optionen[i]);
  if (!gleich) return null;
  return {
    frage: laufend.frage,
    optionen: [...laufend.optionen],
    stimmen: laufend.stimmen.map((s, i) => s + importiert.stimmen[i]),
  };
}
