// Quiz-Kartenspiel-Druck (docs/09 Ось H): reine Logik ohne DOM, testbar.
// Aus den vorhandenen Quiz-JSON-Daten (quiz-kern-Schema) werden Karten:
// Vorderseite = Frage, Rückseite = richtige Antwort + Erklärung. Zum
// Ausdrucken, Ausschneiden und analog Spielen – ohne Server.

/**
 * Baut Karten aus einer Fragenliste (binaer oder wahl).
 * @param {Array<object>} fragen
 * @returns {Array<{nr:number, kategorie:string, vorne:string, hinten:string, antwort:string}>}
 */
export function baueKarten(fragen = []) {
  return fragen.map((f, i) => {
    if (f.typ === 'binaer') {
      const antwort = f.korrekt === 'ja' ? '✅ Stimmt' : '❌ Stimmt nicht';
      return {
        nr: i + 1,
        kategorie: f.kategorie ?? '',
        vorne: `„${f.aussage}“ – Stimmt das?`,
        antwort,
        hinten: `${antwort}. ${f.erklaerung}`,
      };
    }
    // typ 'wahl'
    const loesung = f.antworten?.[f.korrekt] ?? '';
    const optionen = (f.antworten ?? []).map((a, k) => `${String.fromCharCode(65 + k)}) ${a}`).join('  ');
    return {
      nr: i + 1,
      kategorie: f.kategorie ?? '',
      vorne: `${f.frage}${optionen ? `\n${optionen}` : ''}`,
      antwort: loesung,
      hinten: `Richtig: ${loesung}. ${f.erklaerung}`,
    };
  });
}

/** Kleiner Konsistenzcheck einer Fragenliste (leere Liste = Fehler). */
export function pruefeFragenListe(fragen) {
  if (!Array.isArray(fragen) || fragen.length === 0) return ['Keine Fragen gefunden'];
  const fehler = [];
  for (const f of fragen) {
    if (f.typ === 'binaer') {
      if (!f.aussage || !['ja', 'nein'].includes(f.korrekt)) fehler.push(`binaer unvollständig: ${f.id ?? '?'}`);
    } else if (f.typ === 'wahl') {
      if (!f.frage || !Array.isArray(f.antworten) || typeof f.korrekt !== 'number') fehler.push(`wahl unvollständig: ${f.id ?? '?'}`);
    } else {
      fehler.push(`unbekannter Typ: ${f.typ}`);
    }
    if (!f.erklaerung) fehler.push(`Erklärung fehlt: ${f.id ?? '?'}`);
  }
  return fehler;
}
