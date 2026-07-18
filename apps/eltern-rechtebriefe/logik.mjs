// Eltern-Rechtebriefe: reine Logik (ohne DOM), testbar (docs/09 Nr. 189).
// Musterbrief-Sammlung für Eltern und Fachkräfte: Auskunftsersuchen (Art. 15),
// Löschantrag (Art. 17, mit Hinweis auf das besonders starke Löschrecht bei
// Kinderdaten, Erwägungsgrund 65) und Widerruf der Einwilligung (Art. 7).
// Formular-zu-Text-Engine. Datenvermeidung: Angaben nur zum Ausdruck.

const P = (wert, platzhalter) => (wert && String(wert).trim() ? String(wert).trim() : platzhalter);

export const BRIEFE = Object.freeze([
  {
    id: 'auskunft',
    name: 'Auskunftsersuchen',
    artikel: 'Art. 15 DSGVO',
    betreff: 'Auskunftsersuchen nach Art. 15 DSGVO',
    einleitung: 'hiermit mache ich von meinem Auskunftsrecht nach Art. 15 DSGVO Gebrauch.',
    kern: 'Bitte teilen Sie mir mit, ob und welche personenbezogenen Daten Sie über die betroffene Person verarbeiten. Ich bitte um eine Kopie dieser Daten sowie um Angaben zu Zwecken, Empfängern, Speicherdauer und Herkunft der Daten.',
  },
  {
    id: 'loeschung',
    name: 'Löschantrag',
    artikel: 'Art. 17 DSGVO',
    betreff: 'Antrag auf Löschung nach Art. 17 DSGVO',
    einleitung: 'hiermit beantrage ich die Löschung der personenbezogenen Daten der betroffenen Person nach Art. 17 DSGVO.',
    kern: 'Bitte löschen Sie alle zu dieser Person gespeicherten Daten und informieren Sie ggf. Empfänger über die Löschung. Bei Daten, die im Kindesalter erhoben wurden, besteht ein besonders starkes Löschrecht (Art. 17 DSGVO i. V. m. Erwägungsgrund 65).',
  },
  {
    id: 'widerruf',
    name: 'Widerruf der Einwilligung',
    artikel: 'Art. 7 Abs. 3 DSGVO',
    betreff: 'Widerruf der Einwilligung nach Art. 7 Abs. 3 DSGVO',
    einleitung: 'hiermit widerrufe ich die erteilte Einwilligung in die Verarbeitung personenbezogener Daten nach Art. 7 Abs. 3 DSGVO.',
    kern: 'Der Widerruf betrifft die Einwilligung zu folgendem Zweck: {einwilligung}. Bitte stellen Sie die darauf gestützte Verarbeitung ab sofort ein und löschen Sie die betroffenen Daten, soweit keine andere Rechtsgrundlage besteht.',
  },
]);

export function findeBrief(id) {
  return BRIEFE.find((b) => b.id === id) ?? BRIEFE[0];
}

/**
 * Baut den Musterbrief als Text.
 * @param {string} id
 * @param {{empfaenger?:string, dienst?:string, absender?:string, adresse?:string,
 *          datum?:string, betroffene?:string, einwilligung?:string}} cfg
 */
export function baueBrief(id, cfg = {}) {
  const b = findeBrief(id);
  const empfaenger = P(cfg.empfaenger, '[Verantwortliche Stelle / Datenschutzbeauftragte]');
  const dienst = P(cfg.dienst, '[Name des Dienstes / der Seite]');
  const absender = P(cfg.absender, '[Ihr Name]');
  const adresse = P(cfg.adresse, '[Ihre Anschrift]');
  const datum = P(cfg.datum, '[Datum]');
  const betroffene = P(cfg.betroffene, '[Name des Kindes / der betroffenen Person]');
  const kern = b.kern.replace('{einwilligung}', P(cfg.einwilligung, '[Zweck der Einwilligung]'));

  return [
    `${absender}`,
    `${adresse}`,
    '',
    `An: ${empfaenger}`,
    `Dienst/Angebot: ${dienst}`,
    '',
    `Ort, Datum: ${datum}`,
    '',
    `Betreff: ${b.betreff}`,
    '',
    'Sehr geehrte Damen und Herren,',
    '',
    b.einleitung,
    '',
    `Betroffene Person: ${betroffene} (ich handle als sorgeberechtigte Person).`,
    '',
    kern,
    '',
    'Bitte bestätigen Sie den Eingang und antworten Sie unentgeltlich innerhalb eines Monats (Art. 12 Abs. 3 DSGVO). Bei Nichtreaktion behalte ich mir eine Beschwerde bei der zuständigen Datenschutz-Aufsichtsbehörde vor (Art. 77 DSGVO).',
    '',
    'Mit freundlichen Grüßen',
    absender,
    '',
  ].join('\n');
}
