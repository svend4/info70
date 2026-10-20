// quiz-kern/schema: gemeinsames Fragen-Schema aller Quiz-Apps + Prüfung.
// Fragetypen:
//  - "binaer": { aussage, korrekt: "ja"|"nein" } - Beschriftung der zwei
//    Knöpfe bestimmt die App (z. B. "Echt/Fake" oder "Stimmt/Stimmt nicht").
//  - "wahl":   { frage, antworten: string[], korrekt: <Index> }
// Jede Frage braucht id, kategorie und eine Erklärung (dort passiert das Lernen).

/**
 * Prüft einen Fragen-Datensatz und liefert eine Liste von Fehlern (leer = ok).
 * @param {{version?: number, fragen: Array<object>}} daten
 * @param {{ mindestFragen?: number, mindestErklaerung?: number }} [optionen]
 * @returns {string[]}
 */
export function pruefeFragen(daten, { mindestFragen = 10, mindestErklaerung = 20 } = {}) {
  const fehler = [];
  if (!Array.isArray(daten?.fragen)) return ['fragen fehlt oder ist kein Array'];
  if (daten.fragen.length < mindestFragen) fehler.push(`weniger als ${mindestFragen} Fragen`);

  const ids = daten.fragen.map((f) => f?.id);
  if (new Set(ids).size !== ids.length) fehler.push('doppelte Fragen-IDs');

  for (const f of daten.fragen) {
    const wo = f?.id ?? '<ohne id>';
    if (!f?.id || !f?.kategorie) fehler.push(`${wo}: id/kategorie fehlt`);
    if (!(f?.erklaerung?.length >= mindestErklaerung)) fehler.push(`${wo}: Erklärung fehlt oder zu kurz`);
    if (f?.typ === 'binaer') {
      if (!(f.aussage?.length > 10)) fehler.push(`${wo}: aussage fehlt/zu kurz`);
      if (!['ja', 'nein'].includes(f.korrekt)) fehler.push(`${wo}: korrekt muss "ja" oder "nein" sein`);
    } else if (f?.typ === 'wahl') {
      if (!(f.frage?.length > 10)) fehler.push(`${wo}: frage fehlt/zu kurz`);
      if (!Array.isArray(f.antworten) || f.antworten.length < 2) fehler.push(`${wo}: mindestens 2 Antworten`);
      else {
        if (new Set(f.antworten).size !== f.antworten.length) fehler.push(`${wo}: doppelte Antworten`);
        if (!(Number.isInteger(f.korrekt) && f.korrekt >= 0 && f.korrekt < f.antworten.length)) {
          fehler.push(`${wo}: korrekt-Index außerhalb`);
        }
      }
    } else {
      fehler.push(`${wo}: unbekannter Typ "${f?.typ}"`);
    }
  }

  return fehler;
}
