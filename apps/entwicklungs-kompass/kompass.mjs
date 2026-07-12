// Kompass-Koffer: den gesamten Beobachtungs-Stand (Kürzel-Liste + je Kind die
// dokumentierten Stufen) als Datei sichern, wieder einlesen und mit dem
// laufenden Stand zusammenführen - ganz ohne Server, Konto oder Cloud
// (Muster: apps/mitmach-arena/koffer.mjs). So wechselt eine Fachkraft das
// Gerät, sichert ihre Doku oder führt zwei Tablets zusammen. Es reist immer
// nur das Kürzel, nie ein Name. Reine Logik ohne DOM, damit sie testbar ist.

import { kuerzelOk } from './logik.mjs';

export const KOFFER_ART = 'entwicklungs-kompass-daten';
export const KOFFER_VERSION = 1;

/**
 * @typedef {{ kinder: string[], beobachtungen: Record<string, Record<string, string>> }} KompassDaten
 */

/**
 * Packt den Beobachtungs-Stand in eine JSON-Datei.
 * @param {KompassDaten} daten
 * @returns {string}
 */
export function packeKoffer(daten) {
  return JSON.stringify({
    art: KOFFER_ART,
    version: KOFFER_VERSION,
    kinder: [...(daten.kinder ?? [])],
    beobachtungen: { ...(daten.beobachtungen ?? {}) },
  }, null, 2);
}

/**
 * Prüft eine eingelesene Koffer-Datei. Liefert Fehlerliste (leer = gültig).
 * Optional werden die bekannten Indikator- und Stufen-Kennungen mitgegeben und
 * dann mitgeprüft. Der Kürzel-Längen-Deckel (max 3 Zeichen) wird immer geprüft:
 * so kann auch über den Import kein Name eingeschleust werden.
 * @param {unknown} inhalt geparstes JSON
 * @param {{indikatorIds?: string[]|null, stufenIds?: string[]|null}} [gueltig]
 * @returns {string[]}
 */
export function pruefeKoffer(inhalt, { indikatorIds = null, stufenIds = null } = {}) {
  if (typeof inhalt !== 'object' || inhalt === null) return ['Keine gültige Kompass-Datei'];
  const fehler = [];
  const k = /** @type {Record<string, unknown>} */ (inhalt);
  if (k.art !== KOFFER_ART) fehler.push('Das ist keine Entwicklungs-Kompass-Datei');
  if (k.version !== KOFFER_VERSION) fehler.push('Unbekannte Datei-Version');

  if (!Array.isArray(k.kinder)) {
    fehler.push('Kürzel-Liste fehlt oder ist ungültig');
  } else {
    for (const kuerzel of k.kinder) {
      if (!kuerzelOk(kuerzel)) fehler.push(`Ungültiges Kürzel (max 3 Zeichen, keine Namen): "${kuerzel}"`);
    }
  }

  const beob = k.beobachtungen;
  if (typeof beob !== 'object' || beob === null || Array.isArray(beob)) {
    fehler.push('Beobachtungen fehlen oder sind ungültig');
    return fehler;
  }
  const bekannteIds = indikatorIds ? new Set(indikatorIds) : null;
  const bekannteStufen = stufenIds ? new Set(stufenIds) : null;
  for (const [kuerzel, stufen] of Object.entries(beob)) {
    if (!kuerzelOk(kuerzel)) fehler.push(`Ungültiges Kürzel in Beobachtungen (max 3 Zeichen): "${kuerzel}"`);
    if (typeof stufen !== 'object' || stufen === null || Array.isArray(stufen)) {
      fehler.push(`Beobachtungen zu "${kuerzel}" sind ungültig`);
      continue;
    }
    for (const [indId, stufe] of Object.entries(stufen)) {
      if (bekannteIds && !bekannteIds.has(indId)) fehler.push(`Unbekannter Indikator: "${indId}"`);
      if (typeof stufe !== 'string' || (bekannteStufen && !bekannteStufen.has(stufe))) {
        fehler.push(`Ungültige Stufe bei "${indId}"`);
      }
    }
  }
  return fehler;
}

/**
 * Führt einen importierten Stand mit dem laufenden zusammen:
 * - Kürzel-Listen werden vereinigt (Reihenfolge: erst laufende, dann neue).
 * - Je Kind haben eigene, bereits dokumentierte Stufen Vorrang; der Import
 *   füllt nur Lücken - nichts wird überschrieben.
 * Ohne laufenden Stand wird der Import übernommen. Liefert immer ein neues
 * Objekt (keine geteilten Referenzen), das Original bleibt unverändert.
 * @param {KompassDaten|null} laufend
 * @param {KompassDaten} importiert
 * @returns {KompassDaten}
 */
export function vereinigeKoffer(laufend, importiert) {
  const basisKinder = laufend?.kinder ?? [];
  const basisBeob = laufend?.beobachtungen ?? {};
  const kinder = [...basisKinder];
  for (const kuerzel of importiert.kinder ?? []) {
    if (!kinder.includes(kuerzel)) kinder.push(kuerzel);
  }
  const beobachtungen = {};
  const alleKinder = new Set([...Object.keys(basisBeob), ...Object.keys(importiert.beobachtungen ?? {})]);
  for (const kuerzel of alleKinder) {
    beobachtungen[kuerzel] = {
      ...(importiert.beobachtungen?.[kuerzel] ?? {}),
      ...(basisBeob[kuerzel] ?? {}),
    };
  }
  return { kinder, beobachtungen };
}
