// Schulfreigabe-Dossier „Null-Daten-Nachweis“ (für schulische Datenschutz-
// beauftragte, docs/09 Ось E). Reine Logik ohne DOM, testbar.
// Formular-zu-Dokument-Engine: Aus wenigen Angaben (Schule, Träger, DSB,
// Angebot, Datum) entsteht ein fertiges Prüfdossier mit technischer Erklärung,
// Muster-Verfahrensbeschreibung, Checkliste und BFSG/EAA-Erklärung.
// Personenbezogene Angaben werden NUR ins Dokument gedruckt, nicht gespeichert.

/** Feld-Katalog: Beschriftung + Platzhalter je Feld-Code. */
export const FELDER = Object.freeze({
  schule: { label: 'Schule', platzhalter: 'Name der Schule' },
  traeger: { label: 'Schulträger', platzhalter: 'z. B. Stadt Musterstadt' },
  dsb: { label: 'Datenschutzbeauftragte*r', platzhalter: 'Name (verantwortlich für die Prüfung)' },
  angebot: { label: 'Geprüftes Angebot', platzhalter: 'z. B. Kinder-Werkstatt info70 (alle Apps)' },
  datum: { label: 'Datum der Prüfung', platzhalter: 'TT.MM.JJJJ' },
});

/** Prüf-Checkliste: durch die Architektur des Baukastens alle erfüllt. */
export const PRUEFPUNKTE = Object.freeze([
  'Content-Security-Policy „default-src \'self\'“ – die Seite darf nur eigene Dateien laden.',
  'Keine externen Requests (ein „Netzwerk-Wächter“ blockiert und meldet jeden Fremd-Aufruf).',
  'Kein Tracking, keine Cookies, keine Werbung, keine Drittanbieter-Skripte.',
  'Keine Benutzerkonten, keine Anmeldung, keine Registrierung.',
  'Es werden keine personenbezogenen Daten verarbeitet oder übertragen.',
  'Lokale Speicherung (localStorage) nur für eigene Einstellungen, jederzeit per Knopf löschbar.',
  'Quelloffen (AGPL-3.0), vollständig offline im Browser lauffähig.',
  'Barrierefreiheit nach BFSG/EAA berücksichtigt (Kontrast, Tastatur, Vorlesen, Leichte Sprache).',
]);

const platz = (code) => `[${FELDER[code].platzhalter}]`;

/**
 * Baut das Dossier als Text. Leere Felder werden zu Platzhaltern in [eckigen
 * Klammern], damit sie sichtbar von Hand ergänzt werden können.
 * @param {Record<string,string>} werte
 */
export function baueDossier(werte = {}) {
  const w = (code) => {
    const roh = String(werte[code] ?? '').trim();
    return roh || platz(code);
  };
  const zeilen = [
    'Schulfreigabe-Dossier: Null-Daten-Nachweis',
    '',
    `Schule: ${w('schule')}`,
    `Schulträger: ${w('traeger')}`,
    `Geprüftes Angebot: ${w('angebot')}`,
    `Datenschutzbeauftragte*r: ${w('dsb')}`,
    `Datum der Prüfung: ${w('datum')}`,
    '',
    '## 1. Zusammenfassung',
    'Das geprüfte Angebot verarbeitet keine personenbezogenen Daten. Es findet',
    'keine Datenübertragung an Dritte statt. Eine Einwilligung nach DSGVO Art. 8',
    'ist nicht erforderlich, da keine Verarbeitung stattfindet.',
    '',
    '## 2. Technische Erklärung',
    ...PRUEFPUNKTE.map((p) => `- ${p}`),
    '',
    '## 3. Muster-Verfahrensbeschreibung',
    'Verarbeitungstätigkeit: keine. Es werden weder Bestandsdaten noch Nutzungs-',
    'daten personenbezogen erhoben, gespeichert oder übermittelt. Eine',
    'Auftragsverarbeitung (DSGVO Art. 28) entfällt, da kein Hosting mit',
    'Datenverarbeitung erfolgt (rein clientseitig, offline nutzbar).',
    '',
    '## 4. Prüf-Checkliste (Schuldatenschutz der Länder)',
    ...PRUEFPUNKTE.map((p) => `[x] ${p}`),
    '',
    '## 5. BFSG/EAA-Konformitätserklärung',
    'Das Angebot berücksichtigt die Anforderungen des Barrierefreiheits-',
    'stärkungsgesetzes (BFSG/EAA): ausreichende Kontraste, Tastaturbedienbarkeit,',
    'Vorlese-Funktion und Inhalte in Leichter Sprache (WCAG 2.1 AA als Maßstab).',
    '',
    'Hinweis: Selbstauskunft des Anbieters/Prüfenden, kein amtliches Testat.',
  ];
  return zeilen.join('\n');
}

/** Einfache HTML-Escapes für die HTML-Fassung. */
export function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/** Dossier als einfaches HTML (Überschriften + Absätze), für Druck/Export. */
export function baueDossierHtml(werte = {}) {
  return baueDossier(werte)
    .split('\n')
    .map((z) => {
      if (z.startsWith('## ')) return `<h2>${escapeHtml(z.slice(3))}</h2>`;
      if (z === '') return '';
      if (z.startsWith('Schulfreigabe-Dossier')) return `<h1>${escapeHtml(z)}</h1>`;
      return `<p>${escapeHtml(z)}</p>`;
    })
    .filter(Boolean)
    .join('\n');
}
