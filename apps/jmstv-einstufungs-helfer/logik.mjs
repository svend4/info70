// JMStV-Einstufungs-Helfer: reine Logik (ohne DOM), testbar
// (docs/09 Ось D Nr. 225). Empfiehlt eine Altersstufe, listet technische
// Mittel des JMStV und erzeugt ein age-de.xml-Label. Kein Rechtsrat.

export const STUFEN = [0, 6, 12, 16, 18];

/**
 * Empfohlene Altersstufe = höchste minStufe der gewählten Merkmale,
 * mindestens angehoben durch Interaktionsrisiken (hebtAuf).
 * @returns {number|null} null, wenn nichts gewählt wurde
 */
export function empfohleneStufe(daten, merkmalIds = [], interaktionIds = []) {
  const gewaehlt = daten.merkmale.filter((m) => merkmalIds.includes(m.id));
  if (gewaehlt.length === 0 && interaktionIds.length === 0) return null;
  let stufe = gewaehlt.reduce((max, m) => Math.max(max, m.minStufe), 0);
  for (const i of daten.interaktion) {
    if (interaktionIds.includes(i.id) && i.hebtAuf) stufe = Math.max(stufe, i.hebtAuf);
  }
  return stufe;
}

/** Technische Mittel nach JMStV für die Stufe + gewählte Interaktionsrisiken. */
export function technischeMittel(daten, stufe, interaktionIds = []) {
  const mittel = [];
  if (stufe === 0) {
    mittel.push('Keine Alterskennzeichnung zwingend. Freiwilliges age-de.xml=0 ist möglich und schafft Klarheit.');
  }
  for (const s of [6, 12, 16, 18]) {
    if (stufe >= s && daten.mittelJeStufe[String(s)]) mittel.push(daten.mittelJeStufe[String(s)]);
  }
  for (const i of daten.interaktion) {
    if (interaktionIds.includes(i.id)) mittel.push(i.mittel);
  }
  return mittel;
}

/** Label-Text der Stufe. */
export function stufeLabel(daten, stufe) {
  const s = daten.altersstufen.find((a) => a.stufe === stufe);
  return s ? `${s.emoji} ${s.label}` : `ab ${stufe}`;
}

/** Erzeugt ein age-de.xml-Label (Template – Element-Namen gegen Spezifikation prüfen). */
export function ageDeXml(stufe, url = 'https://example.org') {
  const u = String(url).trim() || 'https://example.org';
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<!-- Alterslabel im Stil von age-de.xml (auslesbar durch anerkannte',
    '     Jugendschutzprogramme). Vor Einsatz die Element-Namen gegen die',
    '     aktuelle offizielle age-de.xml-Spezifikation (JusProg e. V.) prüfen. -->',
    '<age-declaration>',
    '  <sender>',
    `    <url>${u}</url>`,
    '  </sender>',
    '  <maturity-rating>',
    '    <rating-service>age-de.xml</rating-service>',
    `    <minimum-age>${stufe}</minimum-age>`,
    '  </maturity-rating>',
    '</age-declaration>',
    '',
  ].join('\n');
}

/** Alternatives Meta-Tag für die Einbindung im Seitenkopf. */
export function metaTag(stufe) {
  return `<meta name="age-de.xml" content="age=${stufe}" />`;
}

const stand = () => {
  try { return new Date().toLocaleDateString('de-DE'); } catch { return ''; }
};

/** Text-Prüfbericht der Einstufung. */
export function bericht(daten, merkmalIds = [], interaktionIds = [], url = 'https://example.org') {
  const stufe = empfohleneStufe(daten, merkmalIds, interaktionIds);
  const zeilen = [
    'JMStV-Einstufungs-Helfer – Prüfbericht',
    `Grundlage: ${daten.quelle}`,
    `Stand: ${stand()}`,
    '',
  ];
  if (stufe === null) {
    zeilen.push('Noch keine Merkmale gewählt – bitte Inhaltsmerkmale ankreuzen.');
    return zeilen.join('\n');
  }
  zeilen.push(`## Empfohlene Altersstufe: ${stufeLabel(daten, stufe)}`);
  const gewaehlt = daten.merkmale.filter((m) => merkmalIds.includes(m.id));
  if (gewaehlt.length) {
    zeilen.push('', '## Zugrunde liegende Merkmale');
    for (const m of gewaehlt) zeilen.push(`- (ab ${m.minStufe}) ${m.text}`);
  }
  const mittel = technischeMittel(daten, stufe, interaktionIds);
  zeilen.push('', '## Technische Mittel (JMStV)');
  for (const m of mittel) zeilen.push(`- ${m}`);
  zeilen.push('', '## age-de.xml-Label', ageDeXml(stufe, url), '## Alternatives Meta-Tag', metaTag(stufe), '');
  if (stufe >= 18) zeilen.push('⚠️ Stufe 18: für Kinderangebote grundsätzlich unzulässig – dringend rechtlich prüfen.', '');
  zeilen.push('Hinweis: Selbsteinschätzung, kein offizielles Konformitätsergebnis und kein Rechtsrat.');
  return zeilen.join('\n');
}
