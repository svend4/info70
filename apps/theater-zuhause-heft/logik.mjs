// Theater zuhause: reine Logik ohne DOM, testbar.
// Die Inhalte stehen in daten/heft.json. Hier wird nur gefiltert, in feste Reihenfolge
// gebracht und der Text je Seite zusammengestellt. Keine Speicherung, keine Bewertung von Kindern.

/**
 * Alle Seiten des Heftes in Druckreihenfolge: Umschlag, drei Formen, fünf Szenen.
 * Die Reihenfolge kommt aus den Daten und hängt nicht vom Filter ab.
 * @param {object} daten
 * @returns {object[]}
 */
export function druckSeiten(daten) {
  return [
    { ...daten.umschlag, id: 'umschlag', art: 'umschlag' },
    ...daten.formen.map((f) => ({ ...f, art: 'form' })),
    ...daten.szenen.map((s) => ({ ...s, art: 'szene' })),
  ];
}

/**
 * Die Werte des Filters in Anzeigereihenfolge.
 * @param {object} daten
 * @returns {string[]}
 */
export function filterWerte(daten) {
  return ['alle', 'umschlag', ...daten.formen.map((f) => f.id), 'szenen'];
}

/**
 * Anzeigename eines Filterwerts.
 * @param {object} daten
 * @param {string} wert
 * @returns {string}
 */
export function filterName(daten, wert) {
  if (wert === 'alle') return 'Alle Seiten';
  if (wert === 'umschlag') return 'Umschlag';
  if (wert === 'szenen') return 'Spielszenen';
  return daten.formen.find((f) => f.id === wert)?.name ?? '';
}

/**
 * Filter auf dem Bildschirm. Der Druck ist davon nicht betroffen.
 * „alle“ liefert alle Seiten; „szenen“ die fünf Szenen; eine Kennung genau diese Seite.
 * Ein unbekannter Wert liefert nichts.
 * @param {object} daten
 * @param {string} [filter]
 * @returns {object[]}
 */
export function filtern(daten, filter = 'alle') {
  const seiten = druckSeiten(daten);
  if (filter === 'alle') return seiten;
  if (filter === 'szenen') return seiten.filter((s) => s.art === 'szene');
  return seiten.filter((s) => s.id === filter);
}

/**
 * Begriff aus der Quelle, mit Seite. Die deutsche Entsprechung steht dahinter und ist als Eigenentwurf benannt.
 * @param {object} seite
 * @returns {string[]}
 */
export function begriffZeilen(seite) {
  const b = seite.begriff;
  return [`„${b.quelltext}“ (${b.seite}): ${b.deutsch} (Eigenentwurf)`];
}

/**
 * Die passenden Szenen einer Form, mit Titel. Eine unbekannte Kennung wird ausdrücklich genannt.
 * @param {object} daten
 * @param {object} seite
 * @returns {string[]}
 */
export function passendeSzenenZeilen(daten, seite) {
  return seite.passendeSzenen.map((id) => {
    const szene = daten.szenen.find((s) => s.id === id);
    return szene ? `${szene.titel} (Eigenentwurf)` : `UNBEKANNT: ${id}`;
  });
}

/**
 * Die Bausteine einer Seite in Anzeige- und Druckreihenfolge. Bildschirm und Druck
 * zeigen genau diese Bausteine. Jede Seite endet mit der Pflichtmarkierung.
 * @param {object} daten
 * @param {object} seite
 * @returns {object[]}
 */
export function seiteBloecke(daten, seite) {
  const pflicht = { typ: 'pflicht', text: daten.pflichtmarkierung };

  if (seite.art === 'umschlag') {
    return [
      { typ: 'kopf', text: 'Für Erwachsene' },
      { typ: 'titel', text: daten.titel },
      { typ: 'text', text: seite.untertitel },
      { typ: 'abschnitt', ueberschrift: 'Für wen', zeilen: [seite.zielgruppe] },
      { typ: 'abschnitt', ueberschrift: 'Hinweis für Eltern (Eigenentwurf)', zeilen: [seite.hinweis] },
      { typ: 'abschnitt', ueberschrift: 'Anregung der Quelle', zeilen: [seite.anregung, seite.figuren] },
      { typ: 'abschnitt', ueberschrift: 'Im Heft', zeilen: [seite.inhalt] },
      { typ: 'quelle', text: `Quelle: ${seite.quelle}` },
      { typ: 'klein', text: daten.quellenHinweis },
      pflicht,
    ];
  }

  if (seite.art === 'form') {
    return [
      { typ: 'kopf', text: 'Form zum Basteln und Spielen' },
      { typ: 'titel', text: seite.name },
      { typ: 'quelle', text: `Quelle: ${seite.quelle}` },
      { typ: 'abschnitt', ueberschrift: 'Begriff in der Quelle', zeilen: begriffZeilen(seite) },
      { typ: 'abschnitt', ueberschrift: 'Beschreibung (Eigenentwurf)', zeilen: [seite.beschreibung] },
      { typ: 'abschnitt', ueberschrift: 'Material (Eigenentwurf)', zeilen: [seite.material] },
      { typ: 'schritte', ueberschrift: daten.vermerkBastel, schritte: seite.schritte },
      { typ: 'abschnitt', ueberschrift: 'Passende Szenen (Eigenentwurf)', zeilen: passendeSzenenZeilen(daten, seite) },
      { typ: 'abschnitt', ueberschrift: 'Sicherheitssatz', zeilen: [daten.sicherheitssatz] },
      pflicht,
    ];
  }

  return [
    { typ: 'kopf', text: 'Spielszene (Eigenentwurf)' },
    { typ: 'titel', text: `${seite.titel} (Eigenentwurf)` },
    { typ: 'quelle', text: 'Quelle: Eigenentwurf, kein Märchen und kein Vers aus fremden Texten' },
    { typ: 'abschnitt', ueberschrift: 'Gespielt mit (Eigenentwurf)', zeilen: [seite.gespielt] },
    { typ: 'abschnitt', ueberschrift: 'Rollen (Eigenentwurf)', zeilen: [seite.rollen] },
    { typ: 'abschnitt', ueberschrift: 'Text (Eigenentwurf)', zeilen: [seite.text] },
    { typ: 'abschnitt', ueberschrift: 'Offenes Ende (Eigenentwurf)', zeilen: [seite.ende] },
    pflicht,
  ];
}

/**
 * Der gesamte Text einer Seite, so wie er gedruckt wird, Zeile für Zeile.
 * @param {object} daten
 * @param {object} seite
 * @returns {string}
 */
export function seiteText(daten, seite) {
  return seiteBloecke(daten, seite).flatMap((b) => {
    if (b.typ === 'abschnitt') return [b.ueberschrift, ...b.zeilen];
    if (b.typ === 'schritte') return [b.ueberschrift, ...b.schritte];
    return [b.text];
  }).join('\n');
}

/**
 * Anzahl der Sätze eines Textes. Ein Satzende ist ., ! oder ?, gegebenenfalls
 * gefolgt von einem schließenden Anführungszeichen oder einer Klammer, und danach Leerraum.
 * @param {string} text
 * @returns {number}
 */
export function anzahlSaetze(text) {
  return text.trim().split(/(?<=[.!?][“”"’)]?)\s+/).filter((s) => s.length > 0).length;
}
