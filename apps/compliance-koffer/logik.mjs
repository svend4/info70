// Compliance-Koffer: reine Logik (ohne DOM), testbar (docs/09 Ось D Nr. 232).
// Export/Import-Funktion nach dem Klassen-Koffer-Muster der mitmach-arena:
// bündelt die Berichte aller Prüfwerkzeuge in EINE versionierte Audit-Datei
// und erzeugt einen druckbaren Gesamtbericht. Kein Server, kein Rechtsrat.

export const KOFFER_ART = 'compliance-koffer';
export const KOFFER_VERSION = 1;

/** Prüfwerkzeuge, deren Berichte in den Koffer gehören. */
export const WERKZEUGE = Object.freeze([
  { id: 'art8', name: 'Einwilligungs-Prüfpfad Art. 8', bezug: 'DSGVO' },
  { id: 'dsa', name: 'DSA-Selbstaudit Minderjährigenschutz', bezug: 'DSA' },
  { id: 'bfsg', name: 'BFSG-Check / Barrierefreiheit', bezug: 'BFSG/EAA' },
  { id: 'aiact', name: 'KI-Transparenz-Check', bezug: 'AI Act' },
  { id: 'juschg24a', name: 'Vorsorge-Check § 24a JuSchG', bezug: 'JuSchG' },
  { id: 'cria', name: 'Kinderrechte-Folgenabschätzung (KRIA)', bezug: 'UN-KRK/GC25' },
  { id: 'jmstv', name: 'JMStV-Einstufung', bezug: 'JMStV' },
  { id: 'darkpattern', name: 'Dark-Pattern-Selbstinspektion', bezug: 'DSA' },
]);

/** Name eines Werkzeugs anhand der ID. */
export function nameVon(werkzeugId) {
  return WERKZEUGE.find((w) => w.id === werkzeugId)?.name ?? werkzeugId;
}

/**
 * Packt einen Koffer.
 * @param {string} angebot   Name des Angebots
 * @param {{werkzeug:string,text:string}[]} eintraege
 * @param {string} stand     Datum (vom Aufrufer, damit die Logik rein bleibt)
 */
export function packeKoffer(angebot, eintraege = [], stand = '') {
  const berichte = eintraege
    .filter((e) => e && typeof e.text === 'string' && e.text.trim().length > 0)
    .map((e) => ({ werkzeug: e.werkzeug, text: e.text.trim() }));
  return {
    art: KOFFER_ART,
    version: KOFFER_VERSION,
    angebot: String(angebot ?? '').trim(),
    erstellt: stand,
    berichte,
  };
}

/**
 * Prüft eine eingelesene Koffer-Datei. Liefert Fehlerliste (leer = gültig).
 * @param {unknown} inhalt geparstes JSON
 * @returns {string[]}
 */
export function pruefeKoffer(inhalt) {
  if (typeof inhalt !== 'object' || inhalt === null) return ['Keine gültige Koffer-Datei'];
  const k = inhalt;
  const fehler = [];
  if (k.art !== KOFFER_ART) fehler.push('Das ist keine Compliance-Koffer-Datei');
  if (k.version !== KOFFER_VERSION) fehler.push('Unbekannte Datei-Version');
  if (typeof k.angebot !== 'string') fehler.push('Angebot fehlt');
  if (!Array.isArray(k.berichte) || !k.berichte.every((b) => b && typeof b.werkzeug === 'string' && typeof b.text === 'string')) {
    fehler.push('Berichte fehlen oder sind ungültig');
  }
  return fehler;
}

/** Menge der im Koffer vorhandenen Werkzeug-IDs (aus dem Katalog). */
export function vorhandeneWerkzeuge(koffer) {
  const ids = new Set((koffer.berichte ?? []).map((b) => b.werkzeug));
  return WERKZEUGE.filter((w) => ids.has(w.id)).map((w) => w.id);
}

/** Fortschritt: wie viele der Katalog-Werkzeuge enthalten sind. */
export function fortschritt(koffer) {
  return { vorhanden: vorhandeneWerkzeuge(koffer).length, gesamt: WERKZEUGE.length };
}

/** Baut den druckbaren Gesamtbericht (Text). */
export function gesamtbericht(koffer) {
  const f = fortschritt(koffer);
  const vorhanden = new Set(vorhandeneWerkzeuge(koffer));
  const zeilen = [
    'Compliance-Koffer – Gesamtbericht (Nachweis-Mappe)',
    `Angebot: ${koffer.angebot || '(ohne Namen)'}`,
    `Erstellt: ${koffer.erstellt || '—'}   Version: ${koffer.version}`,
    `Enthaltene Prüfwerkzeuge: ${f.vorhanden}/${f.gesamt}`,
    '',
    '## Abdeckung',
  ];
  for (const w of WERKZEUGE) {
    zeilen.push(`${vorhanden.has(w.id) ? '✔️' : '◻️'} ${w.name} (${w.bezug})`);
  }
  zeilen.push('');
  for (const b of koffer.berichte ?? []) {
    zeilen.push(`## ${nameVon(b.werkzeug)}`, b.text, '');
  }
  const fehlen = WERKZEUGE.filter((w) => !vorhanden.has(w.id));
  if (fehlen.length) {
    zeilen.push('## Noch offen (fehlende Berichte)');
    for (const w of fehlen) zeilen.push(`- ${w.name} (${w.bezug})`);
    zeilen.push('');
  }
  zeilen.push('Hinweis: Sammlung von Selbsteinschätzungen, kein offizielles Konformitätsergebnis und kein Rechtsrat.');
  return zeilen.join('\n');
}
