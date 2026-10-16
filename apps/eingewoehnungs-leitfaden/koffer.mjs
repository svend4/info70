// Eingewöhnungs-Koffer: Verlauf (Kürzel + Tag-Einträge) als Datei sichern,
// einlesen und zusammenführen – ohne Server/Konto/Cloud. Es reist nur das
// Kürzel, nie ein Name. Reine Logik ohne DOM (testbar).
import { kuerzelOk, pruefeEintrag } from './logik.mjs';

export const KOFFER_ART = 'eingewoehnungs-tagebuch-daten';
export const KOFFER_VERSION = 1;

export function packeKoffer(daten) {
  return JSON.stringify({
    art: KOFFER_ART,
    version: KOFFER_VERSION,
    kinder: [...(daten.kinder ?? [])],
    eintraege: { ...(daten.eintraege ?? {}) },
  }, null, 2);
}

/** Prüft eine eingelesene Datei. Optional werden Einträge gegen die Config geprüft. */
export function pruefeKoffer(inhalt, { config = null } = {}) {
  if (typeof inhalt !== 'object' || inhalt === null) return ['Keine gültige Tagebuch-Datei'];
  const fehler = [];
  const k = inhalt;
  if (k.art !== KOFFER_ART) fehler.push('Das ist keine Eingewöhnungs-Tagebuch-Datei');
  if (k.version !== KOFFER_VERSION) fehler.push('Unbekannte Datei-Version');
  if (!Array.isArray(k.kinder)) {
    fehler.push('Kürzel-Liste fehlt oder ist ungültig');
  } else {
    for (const kuerzel of k.kinder) if (!kuerzelOk(kuerzel)) fehler.push(`Ungültiges Kürzel (max 3 Zeichen): "${kuerzel}"`);
  }
  const eintraege = k.eintraege;
  if (typeof eintraege !== 'object' || eintraege === null || Array.isArray(eintraege)) {
    fehler.push('Einträge fehlen oder sind ungültig');
    return fehler;
  }
  for (const [kuerzel, liste] of Object.entries(eintraege)) {
    if (!kuerzelOk(kuerzel)) fehler.push(`Ungültiges Kürzel in Einträgen: "${kuerzel}"`);
    if (!Array.isArray(liste)) { fehler.push(`Einträge zu "${kuerzel}" sind ungültig`); continue; }
    if (config) for (const e of liste) {
      const ef = pruefeEintrag(config, e);
      if (ef.length) { fehler.push(`Eintrag bei "${kuerzel}": ${ef[0]}`); break; }
    }
  }
  return fehler;
}

/**
 * Führt einen Import mit dem laufenden Stand zusammen: Kürzel-Listen vereinigt;
 * je Kind haben vorhandene Einträge Vorrang (der Import füllt nur Kinder ohne
 * eigene Einträge). Liefert immer ein neues Objekt.
 */
export function vereinigeKoffer(laufend, importiert) {
  const basisKinder = laufend?.kinder ?? [];
  const basisEin = laufend?.eintraege ?? {};
  const kinder = [...basisKinder];
  for (const kuerzel of importiert.kinder ?? []) if (!kinder.includes(kuerzel)) kinder.push(kuerzel);
  const eintraege = {};
  const alle = new Set([...Object.keys(basisEin), ...Object.keys(importiert.eintraege ?? {})]);
  for (const kuerzel of alle) {
    const eigene = basisEin[kuerzel];
    eintraege[kuerzel] = (Array.isArray(eigene) && eigene.length > 0)
      ? [...eigene]
      : [...(importiert.eintraege?.[kuerzel] ?? [])];
  }
  return { kinder, eintraege };
}
