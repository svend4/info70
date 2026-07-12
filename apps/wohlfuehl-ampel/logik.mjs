// Wohlfühl-Ampel Gruppe: reine Logik (ohne DOM), damit sie testbar ist.
// Fachkraft-Werkzeug: tägliche Ampel-Einschätzung des emotionalen
// Wohlbefindens je Kind (nur Kürzel, keine Namen), Wochenansicht,
// sanfter Hinweis-Impuls bei anhaltendem Rot.
// Bewusst OHNE Score, OHNE Ranking, OHNE Kind-Vergleich (Beobachtung,
// keine Diagnose - AI-Act-konforme reine Dokumentation).

export const MAX_KINDER = 20;
export const MAX_KUERZEL_LAENGE = 3;
export const IMPULS_SCHWELLE = 3;
export const WOCHEN_TAGE = 7;

/** Die drei Ampelstufen (feste Liste, kein Zahlenwert = kein Score). */
export const AMPELN = [
  { code: 'gruen', name: 'wohl', punkt: '🟢' },
  { code: 'gelb', name: 'wackelig', punkt: '🟡' },
  { code: 'rot', name: 'braucht Aufmerksamkeit', punkt: '🔴' },
];
export const AMPEL_WERTE = AMPELN.map((a) => a.code);

/** Feste Kontext-Liste - bewusst KEIN Freitext (Datensparsamkeit). */
export const KONTEXTE = [
  { code: 'eingewoehnung', name: 'Eingewöhnung' },
  { code: 'konflikt', name: 'Konflikt' },
  { code: 'muede', name: 'müde' },
  { code: 'abschied', name: 'Abschied schwer' },
  { code: 'neu', name: 'neu in Gruppe' },
];
export const KONTEXT_WERTE = KONTEXTE.map((k) => k.code);

/**
 * Lokaler Tagesschlüssel "JJJJ-MM-TT" (keine UTC-Verschiebung).
 * @param {Date} [datum]
 */
export function tagesSchluessel(datum = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `${datum.getFullYear()}-${p(datum.getMonth() + 1)}-${p(datum.getDate())}`;
}

/**
 * Tagesschlüssel um delta Tage verschieben (kalenderfest, auch über
 * Monats-/Jahresgrenzen).
 * @param {string} tagKey "JJJJ-MM-TT"
 * @param {number} delta z. B. -1 für gestern
 */
export function verschiebeTag(tagKey, delta) {
  const [j, m, t] = tagKey.split('-').map(Number);
  return tagesSchluessel(new Date(j, m - 1, t + delta));
}

/**
 * Wochenansicht für ein Kind: die letzten 7 Tage (ältester zuerst,
 * endet bei bisTag). Tage ohne Eintrag erscheinen mit ampel/kontext = null.
 * @param {Record<string, {ampel: string, kontext: string|null}>} eintraegeJeKind
 *        Einträge des Kindes, Schlüssel = Tagesschlüssel
 * @param {string} [bisTag] Tagesschlüssel des letzten Tages
 * @returns {Array<{datum: string, ampel: string|null, kontext: string|null}>}
 */
export function wochenSicht(eintraegeJeKind = {}, bisTag = tagesSchluessel()) {
  const tage = [];
  for (let i = WOCHEN_TAGE - 1; i >= 0; i--) {
    const datum = verschiebeTag(bisTag, -i);
    const eintrag = eintraegeJeKind[datum] ?? null;
    tage.push({
      datum,
      ampel: eintrag?.ampel ?? null,
      kontext: eintrag?.kontext ?? null,
    });
  }
  return tage;
}

/**
 * Länge der Ampel-Serie am Ende einer chronologischen Tagesliste:
 * Wie viele dokumentierte Tage in Folge zeigen die Farbe?
 * Tage OHNE Eintrag (null) zählen nicht und unterbrechen nicht -
 * ein Wochenende ohne Doku beendet eine Rot-Serie also nicht.
 * @param {Array<{ampel: string|null}|string|null>} tage ältester zuerst
 * @param {string} [farbe]
 */
export function ampelSerie(tage, farbe = 'rot') {
  let serie = 0;
  for (let i = tage.length - 1; i >= 0; i--) {
    const eintrag = tage[i];
    const ampel = eintrag !== null && typeof eintrag === 'object' ? eintrag.ampel : eintrag;
    if (ampel == null) continue;
    if (ampel !== farbe) break;
    serie++;
  }
  return serie;
}

/**
 * Sanfter Hinweis-Impuls fällig? Ja bei >= 3 dokumentierten Rot-Tagen
 * in Folge. Der Impuls ist eine Beobachtungs-Erinnerung, KEINE Diagnose.
 * @param {Array<{ampel: string|null}|string|null>} tage ältester zuerst
 * @param {number} [schwelle]
 */
export function brauchtImpuls(tage, schwelle = IMPULS_SCHWELLE) {
  return ampelSerie(tage, 'rot') >= schwelle;
}

/**
 * Prüft ein neues Kürzel. Liefert eine Fehlermeldung oder null (= gültig).
 * Regeln: 1-3 Zeichen (keine Namen!), einmalig, höchstens 20 Kinder.
 * @param {string} kuerzel
 * @param {string[]} [vorhandene] bereits angelegte Kürzel
 * @returns {string|null}
 */
export function pruefeKuerzel(kuerzel, vorhandene = []) {
  const k = (kuerzel ?? '').trim();
  if (vorhandene.length >= MAX_KINDER) return `Höchstens ${MAX_KINDER} Kinder pro Gruppe.`;
  if (k.length === 0) return 'Bitte ein Kürzel eingeben.';
  if (k.length > MAX_KUERZEL_LAENGE) return `Höchstens ${MAX_KUERZEL_LAENGE} Zeichen - bitte keine Namen!`;
  if (vorhandene.includes(k)) return 'Dieses Kürzel gibt es schon.';
  return null;
}
