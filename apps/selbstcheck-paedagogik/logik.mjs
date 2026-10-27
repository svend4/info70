// Selbstcheck pädagogisches Ich: reine Auswertungslogik (ohne DOM), testbar.
// Bewusst OHNE Punkte, Prozente, Ranglisten oder Vergleiche:
// Die Auswertung sortiert Selbsteinschätzungen nur in Text-Kategorien
// (Stärken / auf gutem Weg) und wählt genau EINEN Wachstumsimpuls je
// Bereich - Selbstreflexion, keine Diagnose und keine Leistungsmessung.

/** Reihenfolge der Selbsteinschätzungs-Stufen (nur für die Impuls-Wahl intern). */
export const STUFEN_REIHENFOLGE = { nicht: 0, 'eher-nicht': 1, eher: 2, voll: 3 };

/** @param {Record<string, string>} status @param {string} id */
const gueltigeAntwort = (status, id) => Object.hasOwn(STUFEN_REIHENFOLGE, status?.[id]);

/**
 * Zählt beantwortete Aussagen (nur gültige Stufen) - für die Fortschritts-
 * Anzeige "beantwortet", niemals als Bewertung.
 * @param {{bereiche: Array<{aussagen: Array<{id: string}>}>}} daten
 * @param {Record<string, string>} status
 */
export function zaehleBeantwortet(daten, status = {}) {
  return daten.bereiche
    .flatMap((b) => b.aussagen)
    .filter((a) => gueltigeAntwort(status, a.id)).length;
}

/**
 * Wertet einen Bereich aus:
 * - staerken: Aussagen mit "trifft zu"
 * - aufGutemWeg: Aussagen mit "trifft eher zu"
 * - impulsText: genau EIN Wachstumsimpuls - der Impuls der am niedrigsten
 *   eingeschätzten Aussage (bei Gleichstand die erste in der Reihenfolge);
 *   sind alle beantworteten Aussagen "trifft zu", greift der wertschätzende
 *   Bereichs-Impuls (impulsWennStark); ohne Antworten bleibt er null.
 * - offen: Zahl der noch unbeantworteten Aussagen.
 * @param {{aussagen: Array<{id: string, staerke: string, impuls: string}>, impulsWennStark: string}} bereich
 * @param {Record<string, string>} status
 */
export function auswertungFuerBereich(bereich, status = {}) {
  const beantwortet = [];
  const staerken = [];
  const aufGutemWeg = [];
  for (const aussage of bereich.aussagen) {
    if (!gueltigeAntwort(status, aussage.id)) continue;
    const stufe = status[aussage.id];
    beantwortet.push({ aussage, stufe });
    if (stufe === 'voll') staerken.push(aussage);
    if (stufe === 'eher') aufGutemWeg.push(aussage);
  }
  let impulsText = null;
  if (beantwortet.length > 0) {
    const schwaechste = [...beantwortet]
      .sort((a, b) => STUFEN_REIHENFOLGE[a.stufe] - STUFEN_REIHENFOLGE[b.stufe])[0];
    impulsText = schwaechste.stufe === 'voll'
      ? bereich.impulsWennStark
      : schwaechste.aussage.impuls;
  }
  return {
    staerken,
    aufGutemWeg,
    impulsText,
    offen: bereich.aussagen.length - beantwortet.length,
  };
}

/**
 * Baut den privaten Reflexionsbericht als reinen Text (für das <textarea>).
 * Je Bereich: Stärken + genau ein Wachstumsimpuls, wertschätzend formuliert.
 * Ohne Zahlenwerte, ohne Prozente, ohne Vergleich.
 * @param {{bereiche: Array<object>}} daten
 * @param {Record<string, string>} status
 * @param {string} [datum] vorformatiertes Datum (Testbarkeit)
 */
export function berichtText(daten, status = {}, datum = new Date().toLocaleDateString('de-DE')) {
  const zeilen = [
    'Selbstcheck pädagogisches Ich - privater Reflexionsbericht',
    `Stand: ${datum}`,
    'Nur für dich: Dieser Bericht entsteht und bleibt auf deinem Gerät - kein Arbeitgeber-Zugriff, kein Versand.',
    'Selbstreflexion, keine Diagnose: kein Punktestand, kein Richtig oder Falsch, kein Vergleich.',
    '',
  ];
  for (const bereich of daten.bereiche) {
    const aus = auswertungFuerBereich(bereich, status);
    zeilen.push(`## ${bereich.emoji} ${bereich.name}`);
    if (aus.impulsText === null) {
      zeilen.push('Diesen Bereich hast du dir noch nicht angeschaut - er wartet auf einen ruhigen Moment.', '');
      continue;
    }
    if (aus.staerken.length > 0) {
      zeilen.push('Deine Stärken:');
      for (const a of aus.staerken) zeilen.push(`- ${a.staerke}`);
    }
    if (aus.aufGutemWeg.length > 0) {
      zeilen.push('Auf gutem Weg:');
      for (const a of aus.aufGutemWeg) zeilen.push(`- ${a.staerke}`);
    }
    zeilen.push('Dein Wachstumsimpuls:', `- ${aus.impulsText}`);
    if (aus.offen > 0) {
      zeilen.push(`(In diesem Bereich ${aus.offen === 1 ? 'wartet noch eine Aussage' : `warten noch ${aus.offen} Aussagen`} auf dich.)`);
    }
    zeilen.push('');
  }
  zeilen.push('Ein neuer Blick lohnt sich in ein paar Monaten wieder - Reflexion ist ein Weg, kein Test.');
  return zeilen.join('\n');
}
