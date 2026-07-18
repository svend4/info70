// Impressum-Generator: reine Logik (ohne DOM), testbar.
// Formular-zu-Dokument-Engine (docs/09 Nr. 57): Aus Rechtsform + ausgefuellten
// Feldern entsteht ein fertiges Impressum als Text/HTML. Wiederverwendbares
// Muster (auch fuer Datenschutzerklaerung-Baukasten). Alles laeuft lokal.

// Feld-Katalog: Beschriftung + Platzhalter je Feld-Code.
export const FELDER = Object.freeze({
  name: { label: 'Name / Firma', platzhalter: 'Vor- und Nachname oder Firmenname' },
  strasse: { label: 'Straße und Hausnummer', platzhalter: 'Musterstraße 1' },
  plz_ort: { label: 'PLZ und Ort', platzhalter: '12345 Musterstadt' },
  email: { label: 'E-Mail-Adresse', platzhalter: 'kontakt@beispiel.de' },
  telefon: { label: 'Telefon (optional)', platzhalter: '030 1234567' },
  vertretung: { label: 'Vertretungsberechtigte Person', platzhalter: 'z. B. 1. Vorsitzende*r / Geschäftsführung' },
  register: { label: 'Register & Registernummer', platzhalter: 'z. B. Vereinsregister Amtsgericht Musterstadt, VR 1234' },
  ustid: { label: 'Umsatzsteuer-ID (falls vorhanden)', platzhalter: 'DE123456789' },
  traeger: { label: 'Schulträger', platzhalter: 'z. B. Stadt Musterstadt' },
  redakteur: { label: 'Verantwortlich für den Inhalt (Name)', platzhalter: 'Vor- und Nachname' },
  redakteur_adresse: { label: 'Anschrift der verantwortlichen Person', platzhalter: 'Straße, PLZ Ort' },
});

// Rechtsformen mit ihren Pflichtfeldern.
export const RECHTSFORMEN = Object.freeze([
  { code: 'privat', name: 'Privatperson', felder: ['name', 'strasse', 'plz_ort', 'email', 'telefon'] },
  { code: 'verein', name: 'Verein (e. V.)', felder: ['name', 'strasse', 'plz_ort', 'email', 'telefon', 'vertretung', 'register'] },
  { code: 'ggmbh', name: 'gGmbH / GmbH', felder: ['name', 'strasse', 'plz_ort', 'email', 'telefon', 'vertretung', 'register', 'ustid'] },
  { code: 'schule', name: 'Schule', felder: ['name', 'strasse', 'plz_ort', 'email', 'telefon', 'traeger', 'vertretung'] },
]);

// Optionale Felder (nicht Pflicht) je Code.
const OPTIONAL = new Set(['telefon', 'ustid']);

export function rechtsform(code) {
  return RECHTSFORMEN.find((r) => r.code === code) ?? RECHTSFORMEN[0];
}

/** Sichtbare Felder fuer eine Rechtsform (+ redaktionelle Zusatzfelder). */
export function sichtbareFelder(code, redaktionell) {
  const basis = [...rechtsform(code).felder];
  if (redaktionell) basis.push('redakteur', 'redakteur_adresse');
  return basis;
}

/** Pflichtfelder (ohne die optionalen). */
export function pflichtFelder(code, redaktionell) {
  return sichtbareFelder(code, redaktionell).filter((f) => !OPTIONAL.has(f));
}

/** Fehlende Pflichtfelder fuer die gegebenen Werte. */
export function fehlendeFelder(code, redaktionell, werte = {}) {
  return pflichtFelder(code, redaktionell).filter((f) => !String(werte[f] ?? '').trim());
}

/** Baut das Impressum als reinen Text. */
export function baueImpressum(code, redaktionell, werte = {}) {
  const w = (f) => String(werte[f] ?? '').trim();
  const rf = rechtsform(code);
  const zeilen = ['Impressum', '', 'Angaben gemäß § 5 DDG:', ''];
  zeilen.push(w('name'));
  zeilen.push(w('strasse'));
  zeilen.push(w('plz_ort'));
  if (code === 'schule' && w('traeger')) zeilen.push(`Schulträger: ${w('traeger')}`);
  zeilen.push('');
  if (w('vertretung')) { zeilen.push(`Vertreten durch: ${w('vertretung')}`, ''); }
  zeilen.push('Kontakt:');
  if (w('telefon')) zeilen.push(`Telefon: ${w('telefon')}`);
  zeilen.push(`E-Mail: ${w('email')}`);
  zeilen.push('');
  if (w('register')) { zeilen.push(`Register: ${w('register')}`, ''); }
  if (w('ustid')) { zeilen.push(`Umsatzsteuer-ID: ${w('ustid')}`, ''); }
  if (redaktionell) {
    zeilen.push('Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV:');
    zeilen.push(w('redakteur'));
    if (w('redakteur_adresse')) zeilen.push(w('redakteur_adresse'));
    zeilen.push('');
  }
  return zeilen.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

/** Baut das Impressum als einfaches HTML (zum Einbetten). */
export function baueImpressumHtml(code, redaktionell, werte = {}) {
  return baueImpressum(code, redaktionell, werte)
    .split('\n\n')
    .map((block, i) => {
      const zeilen = block.split('\n');
      if (i === 0) return `<h1>${zeilen.join('<br>')}</h1>`;
      return `<p>${zeilen.join('<br>')}</p>`;
    })
    .join('\n');
}

// Haeufig vergessene Angaben bei Kinderseiten - als Hinweise in der App.
export const HINWEISE = Object.freeze([
  'Bei redaktionellen Inhalten (eigene Nachrichten, Meinungen) ist die verantwortliche Person nach § 18 MStV Pflicht – bei Kinderseiten oft vergessen.',
  'Eine ladungsfähige Anschrift ist Pflicht – ein Postfach reicht nicht.',
  'Die E-Mail muss echt erreichbar sein; ein reines Kontaktformular genügt als alleinige Angabe nicht.',
  'Vereine nennen das Vereinsregister samt Registernummer und die vertretungsberechtigte Person.',
]);
