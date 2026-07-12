// Ampel-Koffer: Gruppendaten als Datei exportieren/importieren und
// zusammenführen - für Gerätewechsel, Sicherung oder Übergabe im Team,
// ganz ohne Server, Konto oder Cloud (die Datei bleibt in der Hand der
// Einrichtung). Reine Logik ohne DOM, damit sie testbar ist.
import { AMPEL_WERTE, KONTEXT_WERTE, MAX_KINDER, MAX_KUERZEL_LAENGE } from './logik.mjs';

export const KOFFER_ART = 'wohlfuehl-ampel-gruppe';
export const KOFFER_VERSION = 1;

const TAG_MUSTER = /^\d{4}-\d{2}-\d{2}$/;

/**
 * @typedef {{kinder: string[], eintraege: Record<string, Record<string, {ampel: string, kontext: string|null}>>}} Gruppe
 */

/** @param {Gruppe} daten */
export function packeKoffer(daten) {
  return JSON.stringify({
    art: KOFFER_ART,
    version: KOFFER_VERSION,
    kinder: daten.kinder,
    eintraege: daten.eintraege,
  }, null, 2);
}

/**
 * Prüft eine eingelesene Koffer-Datei. Liefert Fehlerliste (leer = gültig).
 * Erzwingt auch beim Import die Datensparsamkeit: nur Kürzel (max 3 Zeichen,
 * max 20 Kinder), nur bekannte Ampel- und Kontext-Werte, kein Freitext.
 * @param {unknown} inhalt geparstes JSON
 * @returns {string[]}
 */
export function pruefeKoffer(inhalt) {
  if (typeof inhalt !== 'object' || inhalt === null) return ['Keine gültige Koffer-Datei'];
  const fehler = [];
  const k = /** @type {Record<string, unknown>} */ (inhalt);
  if (k.art !== KOFFER_ART) fehler.push('Das ist keine Wohlfühl-Ampel-Datei');
  if (k.version !== KOFFER_VERSION) fehler.push('Unbekannte Datei-Version');

  const kinderOk = Array.isArray(k.kinder)
    && k.kinder.every((x) => typeof x === 'string' && x.trim().length > 0 && x.length <= MAX_KUERZEL_LAENGE);
  if (!kinderOk) {
    fehler.push('Kürzel-Liste fehlt oder ist ungültig (nur Kürzel mit höchstens 3 Zeichen)');
  } else {
    if (k.kinder.length > MAX_KINDER) fehler.push(`Zu viele Kinder (höchstens ${MAX_KINDER})`);
    if (new Set(k.kinder).size !== k.kinder.length) fehler.push('Kürzel kommen doppelt vor');
  }

  if (typeof k.eintraege !== 'object' || k.eintraege === null || Array.isArray(k.eintraege)) {
    fehler.push('Einträge fehlen oder sind ungültig');
  } else {
    for (const [kuerzel, tage] of Object.entries(k.eintraege)) {
      if (kinderOk && !k.kinder.includes(kuerzel)) {
        fehler.push(`Einträge für unbekanntes Kürzel „${kuerzel}"`);
        continue;
      }
      if (typeof tage !== 'object' || tage === null || Array.isArray(tage)) {
        fehler.push(`Einträge für „${kuerzel}" sind ungültig`);
        continue;
      }
      for (const [tag, eintrag] of Object.entries(tage)) {
        if (!TAG_MUSTER.test(tag)) {
          fehler.push(`Ungültiges Datum „${tag}" bei „${kuerzel}"`);
        } else if (typeof eintrag !== 'object' || eintrag === null
          || !AMPEL_WERTE.includes(/** @type {{ampel?: unknown}} */(eintrag).ampel)
          || !(eintrag.kontext === null || KONTEXT_WERTE.includes(eintrag.kontext))) {
          fehler.push(`Ungültiger Eintrag am ${tag} bei „${kuerzel}" (nur Ampel + feste Kontext-Liste erlaubt)`);
        }
      }
    }
  }
  return fehler;
}

/**
 * Führt einen importierten Koffer mit den lokalen Daten zusammen.
 * Kinder werden vereinigt (lokale Reihenfolge zuerst), Einträge Tag für Tag
 * zusammengelegt; bei demselben Kind und Tag gewinnt der LOKALE Eintrag
 * (das eigene Gerät bleibt maßgeblich). Keine lokalen Daten -> Import wird
 * übernommen. Mehr als 20 Kinder zusammen -> null (nicht zusammenführbar).
 * Beide Eingaben bleiben unverändert (tiefe Kopien).
 * @param {Gruppe|null} lokal
 * @param {Gruppe} importiert
 * @returns {Gruppe|null}
 */
export function vereinigeKoffer(lokal, importiert) {
  if (!lokal) return strukturKopie(importiert);
  const kinder = [...lokal.kinder];
  for (const kuerzel of importiert.kinder) {
    if (!kinder.includes(kuerzel)) kinder.push(kuerzel);
  }
  if (kinder.length > MAX_KINDER) return null;

  /** @type {Gruppe['eintraege']} */
  const eintraege = {};
  for (const kuerzel of kinder) {
    const tage = { ...(importiert.eintraege[kuerzel] ?? {}), ...(lokal.eintraege[kuerzel] ?? {}) };
    if (Object.keys(tage).length > 0) {
      eintraege[kuerzel] = Object.fromEntries(
        Object.entries(tage).map(([tag, e]) => [tag, { ampel: e.ampel, kontext: e.kontext ?? null }]));
    }
  }
  return { kinder, eintraege };
}

/** @param {Gruppe} daten @returns {Gruppe} */
function strukturKopie(daten) {
  return {
    kinder: [...daten.kinder],
    eintraege: Object.fromEntries(Object.entries(daten.eintraege).map(([kuerzel, tage]) => [
      kuerzel,
      Object.fromEntries(Object.entries(tage).map(([tag, e]) => [tag, { ampel: e.ampel, kontext: e.kontext ?? null }])),
    ])),
  };
}
