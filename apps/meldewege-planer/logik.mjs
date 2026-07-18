// Meldewege-Planer: reine Logik (ohne DOM), testbar (docs/09 Nr. 177).
// Baut aus der Betreiber-Konfiguration (a) einen kindgerechten Melde-Textblock
// in de/uk/ru und (b) eine Prozess-Dokumentation für den Meldeweg
// (Auslöser, Erreichbarkeit, Rückmeldung, Hilfeverweis). DSA/JuSchG/UN-KRK.

const REIHENFOLGE = ['knopf', 'einleitung', 'kein_petzen', 'eingang', 'was_passiert', 'hilfe'];

/** Kindgerechter Melde-Textblock in der gewählten Sprache. */
export function baueMeldetexte(daten, sprache = 'de') {
  const k = daten.melde_texte[sprache] ?? daten.melde_texte.de;
  return [
    `[Knopf] ${k.knopf}`,
    '',
    k.einleitung,
    k.kein_petzen,
    '',
    `Nach dem Melden: ${k.eingang} ${k.was_passiert}`,
    '',
    k.hilfe,
  ].join('\n');
}

/**
 * Prozess-Dokumentation aus der Konfiguration.
 * @param {object} daten  meldewege.json
 * @param {{gruende?:string[], reaktion?:string, bestaetigung?:boolean, rueckmeldung?:boolean, ansprechpartner?:string}} cfg
 */
export function baueProzessDoku(daten, cfg = {}) {
  const gruende = daten.ausloeser.filter((a) => (cfg.gruende ?? []).includes(a.id));
  const reaktion = daten.reaktionszeiten.find((r) => r.id === cfg.reaktion);
  const z = [
    'Meldeweg-Konzept (kindgerecht)',
    'Rechtsrahmen: DSA Art. 16/20 (Melde- und Beschwerdeverfahren), § 24a JuSchG (Vorsorgemaßnahmen), UN-KRK Art. 12/19.',
    '',
    '1) Was kann gemeldet werden (Auslöser):',
    ...(gruende.length ? gruende.map((a) => `   - ${a.name}`) : ['   - (noch nicht festgelegt – bitte auswählen)']),
    '',
    '2) Erreichbarkeit / Reaktionszeit:',
    `   - ${reaktion ? reaktion.doku : '(noch nicht festgelegt)'}`,
    `   - Ansprechperson: ${cfg.ansprechpartner?.trim() ? cfg.ansprechpartner.trim() : '(im Impressum benannt)'}`,
    '',
    '3) Rückmeldung an das Kind:',
    `   - Eingangsbestätigung: ${cfg.bestaetigung ? 'ja' : 'nein'}`,
    `   - Rückmeldung über das Ergebnis: ${cfg.rueckmeldung ? 'ja' : 'nein'}`,
    '',
    '4) Verweis auf Hilfeangebote:',
    '   - Nummer gegen Kummer 116 111 (kostenlos, anonym) ist im Meldeweg sichtbar.',
    '   - „Melden ist kein Petzen“ wird kindgerecht erklärt.',
    '',
    'Hinweis: Der Melde-Knopf ist niedrigschwellig, ohne Login erreichbar und in einfacher Sprache beschriftet. Kinder-Eingaben werden datensparsam behandelt.',
  ];
  return z.join('\n');
}

export { REIHENFOLGE };
