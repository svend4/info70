// Fristen-Radar mit ICS-Export: reine Logik (ohne DOM), testbar (docs/09
// Nr. 246). Liest die geprüften Förder-/Preis-Programme des Förder-Navigators,
// sortiert nach Einreichfrist und erzeugt lokal eine .ics-Kalenderdatei
// (RFC 5545) – kein Server, keine externen Requests.

/** Programme mit festem Termin (fristStatus 'termin' + ISO-Datum). */
export function mitTermin(programme = []) {
  return programme.filter((p) => p.fristStatus === 'termin' && /^\d{4}-\d{2}-\d{2}$/.test(p.naechsteFrist ?? ''));
}

/** Nach Einreichfrist aufsteigend sortiert (frühester Termin zuerst). */
export function sortiereNachFrist(programme = []) {
  return [...mitTermin(programme)].sort((a, b) => a.naechsteFrist.localeCompare(b.naechsteFrist));
}

/** Ganze Tage von heute (ISO) bis zum Termin (ISO); negativ = vorbei. */
export function tageBis(terminISO, heuteISO) {
  const tag = 24 * 60 * 60 * 1000;
  const a = Date.parse(`${heuteISO}T00:00:00Z`);
  const b = Date.parse(`${terminISO}T00:00:00Z`);
  return Math.round((b - a) / tag);
}

/** ISO-Datum (YYYY-MM-DD) → ICS-Datumswert (YYYYMMDD). */
export function icsDatum(iso) {
  return String(iso).replace(/-/g, '');
}

/** Escaping für ICS-Textwerte (RFC 5545: , ; \ und Zeilenumbruch). */
export function icsEscape(text) {
  return String(text)
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n');
}

/**
 * Baut eine .ics-Kalenderdatei mit einem ganztägigen Termin je Frist.
 * @param {object[]} programme
 * @param {{dtstamp: string}} opts  dtstamp z. B. "20260718T000000Z"
 */
export function baueICS(programme, { dtstamp }) {
  const zeilen = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//info70//Foerder-Fristen-Radar//DE',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ];
  for (const p of sortiereNachFrist(programme)) {
    zeilen.push('BEGIN:VEVENT');
    zeilen.push(`UID:foerder-${icsEscape(p.id)}@info70`);
    zeilen.push(`DTSTAMP:${dtstamp}`);
    zeilen.push(`DTSTART;VALUE=DATE:${icsDatum(p.naechsteFrist)}`);
    zeilen.push(`SUMMARY:${icsEscape(`Frist: ${p.name}`)}`);
    const beschreibung = [p.fristText, p.traeger ? `Träger: ${p.traeger}` : '', p.quelle ? `Quelle: ${p.quelle}` : ''].filter(Boolean).join('\n');
    zeilen.push(`DESCRIPTION:${icsEscape(beschreibung)}`);
    zeilen.push('END:VEVENT');
  }
  zeilen.push('END:VCALENDAR');
  return zeilen.join('\r\n') + '\r\n';
}
