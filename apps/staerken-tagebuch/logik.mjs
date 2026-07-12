// Stärken-Tagebuch: reine Logik (ohne DOM), damit sie testbar ist.
// Wichtig (AI Act, docs/02): Es wird ausschließlich HÄUFIGKEIT gezählt -
// kein Score, kein Ranking-Urteil, kein Vergleich zwischen Kindern.
// Die Zählung wählt nur aus, zu welchen Feldern Spielideen angezeigt werden.

/**
 * Prüft den Beobachtungs-Katalog (daten/beobachtungen.json).
 * Erwartet: genau 4 Stärkenfelder mit je genau 8 beobachtbaren Momenten
 * und je genau 5 Spiel-Impulsen. Liefert Fehlerliste (leer = gültig).
 * @param {unknown} katalog geparstes JSON
 * @returns {string[]}
 */
export function pruefeKatalog(katalog) {
  const k = /** @type {{felder?: unknown}} */ (katalog);
  if (typeof katalog !== 'object' || katalog === null || !Array.isArray(k.felder)) {
    return ['Kein gültiger Beobachtungs-Katalog'];
  }
  const fehler = [];
  if (k.felder.length !== 4) fehler.push(`Es müssen genau 4 Stärkenfelder sein (gefunden: ${k.felder.length})`);
  const feldIds = new Set();
  const momentIds = new Set();
  for (const feld of k.felder) {
    if (!feld || typeof feld.id !== 'string' || feld.id.length === 0) {
      fehler.push('Feld ohne id');
      continue;
    }
    if (feldIds.has(feld.id)) fehler.push(`Feld-Id doppelt: ${feld.id}`);
    feldIds.add(feld.id);
    if (typeof feld.name !== 'string' || feld.name.length === 0) fehler.push(`${feld.id}: Name fehlt`);
    if (typeof feld.emoji !== 'string' || feld.emoji.length === 0) fehler.push(`${feld.id}: Emoji fehlt`);
    if (typeof feld.beschreibung !== 'string' || feld.beschreibung.length === 0) fehler.push(`${feld.id}: Beschreibung fehlt`);
    if (!Array.isArray(feld.momente) || feld.momente.length !== 8) {
      fehler.push(`${feld.id}: es müssen genau 8 beobachtbare Momente sein`);
    } else {
      for (const moment of feld.momente) {
        if (!moment || typeof moment.id !== 'string' || moment.id.length === 0
          || typeof moment.text !== 'string' || moment.text.length === 0) {
          fehler.push(`${feld.id}: Moment ohne id/text`);
          continue;
        }
        if (momentIds.has(moment.id)) fehler.push(`Moment-Id doppelt: ${moment.id}`);
        momentIds.add(moment.id);
      }
    }
    if (!Array.isArray(feld.impulse) || feld.impulse.length !== 5
      || !feld.impulse.every((i) => typeof i === 'string' && i.length > 0)) {
      fehler.push(`${feld.id}: es müssen genau 5 Spiel-Impulse sein`);
    }
  }
  return fehler;
}

/**
 * Summiert Markierungen je Stärkenfeld (nur Häufigkeit der eigenen
 * Beobachtungen, keine Bewertung).
 * @param {Array<{id: string, momente: Array<{id: string}>}>} felder
 * @param {Record<string, number>} [markierungen] Moment-Id -> Anzahl
 * @returns {Record<string, number>} Feld-Id -> Summe
 */
export function zaehleJeFeld(felder, markierungen = {}) {
  const summen = {};
  for (const feld of felder) {
    summen[feld.id] = feld.momente.reduce((summe, m) => summe + (markierungen[m.id] ?? 0), 0);
  }
  return summen;
}

/**
 * Die (höchstens) `anzahl` am häufigsten beobachteten Felder - nur Felder
 * mit mindestens einer Markierung; bei Gleichstand entscheidet die
 * Katalog-Reihenfolge. Dient allein der Auswahl passender Spiel-Impulse.
 * @param {Array<{id: string, momente: Array<{id: string}>}>} felder
 * @param {Record<string, number>} markierungen
 * @param {number} [anzahl]
 * @returns {string[]} Feld-Ids
 */
export function haeufigsteFelder(felder, markierungen, anzahl = 2) {
  const summen = zaehleJeFeld(felder, markierungen);
  return felder
    .map((feld, index) => ({ id: feld.id, summe: summen[feld.id], index }))
    .filter((eintrag) => eintrag.summe > 0)
    .sort((a, b) => b.summe - a.summe || a.index - b.index)
    .slice(0, Math.max(0, anzahl))
    .map((eintrag) => eintrag.id);
}

/**
 * Markierung erhöhen/senken, ohne das Original zu verändern.
 * Anzahlen sinken nie unter 0; Nulleinträge werden entfernt (Datensparsamkeit).
 * @param {Record<string, number>} markierungen
 * @param {string} momentId
 * @param {number} delta z. B. +1 oder -1
 * @returns {Record<string, number>}
 */
export function aendereMarkierung(markierungen, momentId, delta) {
  const kopie = { ...markierungen };
  const neu = Math.max(0, (kopie[momentId] ?? 0) + delta);
  if (neu === 0) delete kopie[momentId];
  else kopie[momentId] = neu;
  return kopie;
}

/**
 * Gesamtzahl aller Markierungen.
 * @param {Record<string, number>|null} [markierungen]
 */
export function gesamtZahl(markierungen) {
  return Object.values(markierungen ?? {}).reduce((a, b) => a + b, 0);
}
