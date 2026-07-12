// Team-Koffer: Wochenpläne als Datei exportieren/importieren und
// zusammenführen - so planen Früh- und Spätdienst auf getrennten Geräten
// und führen alles auf einem Gerät zusammen, ganz ohne Server oder Konten
// (Muster: apps/mitmach-arena/koffer.mjs). Reine Logik ohne DOM, testbar.
import { TAGE } from './logik.mjs';

export const KOFFER_ART = 'kita-wochenplaner-plan';
export const KOFFER_VERSION = 1;

/** @param {{woche?: string, angebote: Array<object>}} plan */
export function packeKoffer(plan) {
  return JSON.stringify({
    art: KOFFER_ART,
    version: KOFFER_VERSION,
    woche: plan.woche ?? '',
    angebote: plan.angebote,
  }, null, 2);
}

/**
 * Prüft eine eingelesene Koffer-Datei. Liefert Fehlerliste (leer = gültig).
 * Optional werden die erlaubten Bereichs-/Altersgruppen-Kennungen aus
 * daten/bereiche.json mitgegeben und dann mitgeprüft.
 * @param {unknown} inhalt geparstes JSON
 * @param {{bereichIds?: string[]|null, alterIds?: string[]|null}} [gueltig]
 * @returns {string[]}
 */
export function pruefeKoffer(inhalt, { bereichIds = null, alterIds = null } = {}) {
  if (typeof inhalt !== 'object' || inhalt === null) return ['Keine gültige Plan-Datei'];
  const fehler = [];
  const k = /** @type {Record<string, unknown>} */ (inhalt);
  if (k.art !== KOFFER_ART) fehler.push('Das ist keine Kita-Wochenplaner-Datei');
  if (k.version !== KOFFER_VERSION) fehler.push('Unbekannte Datei-Version');
  if (typeof k.woche !== 'string') fehler.push('Wochen-Titel fehlt oder ist ungültig');
  if (!Array.isArray(k.angebote)) {
    fehler.push('Angebote fehlen oder sind ungültig');
    return fehler;
  }
  const tagIds = TAGE.map((t) => t.id);
  k.angebote.forEach((a, i) => {
    const wo = `Angebot ${i + 1}`;
    if (typeof a !== 'object' || a === null) {
      fehler.push(`${wo}: kein gültiger Eintrag`);
      return;
    }
    if (typeof a.id !== 'string' || a.id.length === 0) fehler.push(`${wo}: Kennung fehlt`);
    if (!tagIds.includes(a.tag)) fehler.push(`${wo}: unbekannter Tag`);
    if (typeof a.bereich !== 'string' || (bereichIds && !bereichIds.includes(a.bereich))) {
      fehler.push(`${wo}: unbekannter Bildungsbereich`);
    }
    if (typeof a.alter !== 'string' || (alterIds && !alterIds.includes(a.alter))) {
      fehler.push(`${wo}: unbekannte Altersgruppe`);
    }
    if (!Number.isInteger(a.dauer) || a.dauer < 1 || a.dauer > 240) fehler.push(`${wo}: Dauer ungültig`);
    if (typeof a.titel !== 'string') fehler.push(`${wo}: Titel ungültig`);
  });
  return fehler;
}

/**
 * Führt einen importierten Plan mit dem laufenden Plan zusammen:
 * Angebote mit neuer Kennung werden ergänzt, bereits vorhandene (gleiche id)
 * bleiben einfach - nichts wird überschrieben oder doppelt gezählt.
 * Ohne laufenden Plan wird der Import übernommen.
 * @param {{woche?: string, angebote: Array<{id: string}>}|null} laufend
 * @param {{woche?: string, angebote: Array<{id: string}>}} importiert
 */
export function vereinigeKoffer(laufend, importiert) {
  const basis = laufend?.angebote ?? [];
  const vorhandene = new Set(basis.map((a) => a.id));
  const neue = importiert.angebote.filter((a) => !vorhandene.has(a.id));
  return {
    woche: laufend?.woche || importiert.woche || '',
    angebote: [...basis, ...neue].map((a) => ({ ...a })),
  };
}
