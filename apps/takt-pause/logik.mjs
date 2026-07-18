// Takt-Pause: reine Logik (ohne DOM), damit sie testbar ist.

/**
 * Ampelfarbe je nach verbrauchtem Anteil der geplanten Zeit.
 * @param {number} anteil 0..∞ (1 = Zeit voll verbraucht)
 * @returns {'gruen'|'gelb'|'rot'}
 */
export function ampelFarbe(anteil) {
  if (anteil < 0.8) return 'gruen';
  if (anteil < 1) return 'gelb';
  return 'rot';
}

/**
 * Sekunden als "M:SS" (Minuten ohne führende Null, Sekunden mit).
 * Negative Werte werden als 0:00 angezeigt.
 * @param {number} sekunden
 */
export function formatZeit(sekunden) {
  const s = Math.max(0, Math.round(sekunden));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

/**
 * Lokaler Tagesschlüssel "JJJJ-MM-TT" (keine UTC-Verschiebung).
 * @param {Date} [datum]
 */
export function tagesSchluessel(datum = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `${datum.getFullYear()}-${p(datum.getMonth() + 1)}-${p(datum.getDate())}`;
}

/**
 * Tagesstatistik fortschreiben; bei Datumswechsel wird neu begonnen.
 * @param {{datum: string, geplantMin: number, pausen: number}|null} bisher
 * @param {{geplantMin?: number, pausen?: number}} delta
 * @param {string} [heute]
 */
export function aktualisiereTag(bisher, delta, heute = tagesSchluessel()) {
  const basis = bisher && bisher.datum === heute
    ? bisher
    : { datum: heute, geplantMin: 0, pausen: 0 };
  return {
    datum: heute,
    geplantMin: basis.geplantMin + (delta.geplantMin ?? 0),
    pausen: basis.pausen + (delta.pausen ?? 0),
  };
}

/**
 * Führt die Tagesstatistik in die Wochen-Historie ein (Upsert nach Datum,
 * sortiert, nur die letzten `maxTage`). Lokale Wochenkurve für den Rückblick.
 * @param {{datum:string, geplantMin:number, pausen:number}[]} woche
 * @param {{datum:string, geplantMin:number, pausen:number}|null} tag
 */
export function mergeWoche(woche = [], tag, maxTage = 7) {
  if (!tag || !tag.datum) return [...(woche ?? [])];
  const ohne = (woche ?? []).filter((t) => t.datum !== tag.datum);
  const neu = [...ohne, { datum: tag.datum, geplantMin: tag.geplantMin ?? 0, pausen: tag.pausen ?? 0 }];
  neu.sort((a, b) => a.datum.localeCompare(b.datum));
  return neu.slice(-maxTage);
}

/** Kennzahlen für den Wochen-Rückblick. */
export function wochenStatistik(woche = []) {
  const w = woche ?? [];
  return {
    tage: w.length,
    pausenGesamt: w.reduce((s, t) => s + (t.pausen ?? 0), 0),
    maxPausen: w.reduce((m, t) => Math.max(m, t.pausen ?? 0), 0),
  };
}
