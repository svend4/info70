// Familien-Notfall-Fahrplan: reine Logik (ohne DOM), testbar (docs/09 Nr. 224).
// Gemeinsam ausgefüllter, druckbarer Wenn-dann-Fahrplan für den Kühlschrank:
// Was tue ich, wenn online etwas passiert? Feste Schritte + persönliche
// Kontakte. Datenvermeidung: Kontakte werden nur in den Ausdruck getippt und
// NICHT gespeichert. Verweise auf 112, 110, 116 111 und juuuport (als Text, kein Request).

/**
 * Notruf: steht im Ausdruck vor den Schritten, weil er bei akuter Gefahr zuerst gelesen werden muss.
 * Gedruckt wird nur `text`; die Quelle steht im Feld `quelle` desselben Objekts.
 */
export const NOTRUF = {
  text: 'Bei akuter Gefahr: 112 Rettung und Feuerwehr, 110 Polizei.',
  quelle: '§ 164 Absatz 1 TKG (Telekommunikationsgesetz 2021); Wortlaut am 20.10.2026 maschinell nachgelesen, nicht durch Menschen geprüft',
};

/** Feste Wenn-dann-Schritte (die gelten für alle). */
export const SCHRITTE = Object.freeze([
  { wenn: 'Wenn mich online etwas erschreckt, bedroht oder ärgert', dann: 'Nicht sofort antworten. Kurz weg vom Bildschirm, tief durchatmen. Es ist nicht deine Schuld.' },
  { wenn: 'Beweise sichern', dann: 'Mach ein Bildschirmfoto (Screenshot), bevor du etwas löschst – das hilft später.' },
  { wenn: 'Blockieren und Melden', dann: 'Blockiere die Person und nutze den Melde-Knopf der App oder Plattform.' },
  { wenn: 'Bescheid sagen', dann: 'Erzähl es einer erwachsenen Vertrauensperson. Hilfe holen ist kein Petzen, sondern stark.' },
  { wenn: 'Hilfe holen, wenn es dir schlecht geht', dann: 'Nummer gegen Kummer: 116 111 (kostenlos und anonym). Für Jugendliche: juuuport.de – Online-Beratung von jungen Menschen.' },
]);

const P = (wert, platzhalter) => (wert && String(wert).trim() ? String(wert).trim() : platzhalter);

/**
 * Baut den Fahrplan als Text (zum Ausdrucken / an den Kühlschrank).
 * @param {{vertrauensperson?:string, vertrauenstel?:string, elternkontakt?:string, weitere?:string}} cfg
 */
export function baueFahrplan(cfg = {}) {
  const zeilen = [
    'UNSER FAMILIEN-NOTFALL-FAHRPLAN',
    'Wenn im Netz etwas passiert – so gehen wir vor:',
    NOTRUF.text,
    '',
  ];
  SCHRITTE.forEach((s, i) => {
    zeilen.push(`${i + 1}) ${s.wenn}:`);
    zeilen.push(`   ${s.dann}`);
  });
  zeilen.push('');
  zeilen.push('MEINE WICHTIGEN KONTAKTE');
  zeilen.push(`Vertrauensperson: ${P(cfg.vertrauensperson, '________________________')}`);
  zeilen.push(`erreichbar unter: ${P(cfg.vertrauenstel, '________________________')}`);
  zeilen.push(`Eltern erreiche ich unter: ${P(cfg.elternkontakt, '________________________')}`);
  zeilen.push(`Noch jemand, dem ich vertraue: ${P(cfg.weitere, '________________________')}`);
  zeilen.push('');
  zeilen.push('Immer für dich da: Nummer gegen Kummer 116 111 (kostenlos, anonym).');
  return zeilen.join('\n');
}
