// Förder-Navigator: reine Filter-/Sortier-/Rechenlogik (ohne DOM), testbar.

/**
 * Filtert Programme nach Bedarf und Trägersitz.
 * Programme ohne Sitz-Anforderung (sitz === null) passen zu jedem Standort.
 * @param {Array<object>} programme
 * @param {{ bedarf?: string|null, sitz?: string|null }} [filter]
 */
export function filtereProgramme(programme, { bedarf = null, sitz = null } = {}) {
  return programme.filter((p) =>
    (!bedarf || p.passtZu.includes(bedarf))
    && (!sitz || p.sitz === null || p.sitz === sitz));
}

const STATUS_RANG = { termin: 0, erwartet: 1, laufend: 2, geschlossen: 3 };

/**
 * Sortiert: feste/erwartete Termine nach Datum aufsteigend (abgelaufene ans
 * Ende ihrer Gruppe), dann laufend, dann geschlossen.
 * @param {Array<object>} programme
 * @param {string} heute JJJJ-MM-TT
 */
export function sortiereNachFrist(programme, heute) {
  return [...programme].sort((a, b) => {
    const rangA = STATUS_RANG[a.fristStatus] ?? 9;
    const rangB = STATUS_RANG[b.fristStatus] ?? 9;
    if (rangA !== rangB) return rangA - rangB;
    const abgelaufenA = istAbgelaufen(a, heute) ? 1 : 0;
    const abgelaufenB = istAbgelaufen(b, heute) ? 1 : 0;
    if (abgelaufenA !== abgelaufenB) return abgelaufenA - abgelaufenB;
    return (a.naechsteFrist ?? '9999').localeCompare(b.naechsteFrist ?? '9999');
  });
}

/** @param {object} programm @param {string} heute */
export function istAbgelaufen(programm, heute) {
  return Boolean(programm.naechsteFrist) && programm.naechsteFrist < heute;
}

/**
 * Anteilsfinanzierung: Förderanteil und Eigenanteil aus Gesamtkosten.
 * Standardquote 80 % (BzKJ-Regel; Eigenanteil mind. 20 %).
 * @param {number} kosten Gesamtkosten in Euro
 * @param {number} [quote] Förderquote 0..1
 */
export function anteilsRechnung(kosten, quote = 0.8) {
  const k = Math.max(0, kosten);
  const foerderung = Math.round(k * quote);
  return { foerderung, eigenanteil: Math.round(k - foerderung), quote };
}
