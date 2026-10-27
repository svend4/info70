// Takt-Pause: reine Logik (ohne DOM), damit sie testbar ist.
// Nichts hier bewertet das Kind: Es gibt eine Zeitphase, die Zeitanzeige und die Tageszeile.

/**
 * Phase der geplanten Zeit. Rein zeitlich, ohne Wertung: 'laeuft', 'fastUm'
 * (der Hinweis „such dir einen guten Stopp-Punkt“) oder 'um' (die Pause beginnt).
 * @param {number} anteil 0..∞ (1 = Zeit voll verbraucht)
 * @returns {'laeuft'|'fastUm'|'um'}
 */
export function taktPhase(anteil) {
  if (anteil < 0.8) return 'laeuft';
  if (anteil < 1) return 'fastUm';
  return 'um';
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
 * Tageszeile fortschreiben (geplante Minuten und gemachte Pausen von heute);
 * bei Datumswechsel wird neu begonnen. Es gibt keinen Verlauf über mehrere Tage.
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
