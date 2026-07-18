// Kriterien-Check: reine Logik (ohne DOM), testbar (docs/09 Nr. 244).
// Erzeugt aus dem Kriterienkatalog + Haken-Status einen Prüfbericht als Text
// UND als strukturiertes JSON (Muster Klassen-Koffer) für den Export – direkt
// beilegbar zu fragFINN-/Seitenstark-Anträgen. Alles lokal.

/** Gruppiert die Kriterien nach dem Quellen-Präfix (vor dem ":"). */
export function gruppiere(kriterien) {
  const gruppen = new Map();
  for (const k of kriterien) {
    const quelle = k.quelle.split(':')[0].trim();
    if (!gruppen.has(quelle)) gruppen.set(quelle, []);
    gruppen.get(quelle).push(k);
  }
  return gruppen;
}

export function zaehleErfuellt(kriterien, status = {}) {
  return kriterien.filter((k) => status[k.id]).length;
}

/** Prüfbericht als Text (zum Kopieren/Speichern). */
export function baueBericht(kriterien, status = {}, { stand = '' } = {}) {
  const zeilen = [
    'Kriterien-Check – Selbst-Audit Kinderangebot',
    stand ? `Stand: ${stand}` : '',
    `Erfüllt: ${zaehleErfuellt(kriterien, status)} von ${kriterien.length}`,
    '',
  ].filter((z) => z !== '');
  for (const [quelle, liste] of gruppiere(kriterien)) {
    zeilen.push(`## ${quelle}`);
    for (const k of liste) zeilen.push(`${status[k.id] ? '[x]' : '[ ]'} ${k.text} (${k.quelle})`);
    zeilen.push('');
  }
  zeilen.push('Hinweis: Selbstprüfung, kein offizielles Testat.');
  return zeilen.join('\n');
}

/** Strukturierter Bericht als JSON-Objekt (für Datei-Export / Anträge). */
export function baueJson(kriterien, status = {}, { stand = '' } = {}) {
  return {
    typ: 'kriterien-check-bericht',
    version: 1,
    stand: stand || null,
    erfuellt: zaehleErfuellt(kriterien, status),
    gesamt: kriterien.length,
    kriterien: kriterien.map((k) => ({ id: k.id, text: k.text, quelle: k.quelle, erfuellt: Boolean(status[k.id]) })),
  };
}
