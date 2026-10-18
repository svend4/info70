// Bewegungslandschaften-Plakate Krippe: reine Logik ohne DOM, testbar.
// Die Karten stehen in daten/stationen.json. Hier wird nur gewaehlt, geordnet
// und als Text zusammengesetzt. Keine Speicherung, keine Bewertung von Kindern.

/**
 * Kennungen aller Karten in Anzeige- und Druckreihenfolge.
 * @param {{ karten: Array<{ id: string }> }} daten
 * @returns {string[]}
 */
export function alleKennungen(daten) {
  return daten.karten.map((k) => k.id);
}

/**
 * Auswahl beim Start: alle Karten gewaehlt.
 * @param {{ karten: Array<{ id: string }> }} daten
 * @returns {Set<string>}
 */
export function alleGewaehlt(daten) {
  return new Set(alleKennungen(daten));
}

/**
 * Schaltet eine Karte um. Liefert eine neue Menge; das Original bleibt unveraendert.
 * @param {Iterable<string>} auswahl
 * @param {string} kennung
 * @returns {Set<string>}
 */
export function umschalten(auswahl, kennung) {
  const neu = new Set(auswahl);
  if (neu.has(kennung)) neu.delete(kennung);
  else neu.add(kennung);
  return neu;
}

/**
 * Die gewaehlten Karten in fester Reihenfolge. Unbekannte Kennungen werden
 * ignoriert; jede Karte kommt hoechstens einmal vor.
 * @param {{ karten: Array<{ id: string }> }} daten
 * @param {Iterable<string>} auswahl
 * @returns {object[]}
 */
export function gewaehlteKarten(daten, auswahl) {
  const gewaehlt = new Set(auswahl);
  return daten.karten.filter((k) => gewaehlt.has(k.id));
}

/**
 * Druck ist moeglich, sobald mindestens eine Karte gewaehlt ist.
 * @param {object[]} karten
 * @returns {boolean}
 */
export function kannDrucken(karten) {
  return karten.length > 0;
}

/**
 * Eine Zeile so, wie sie auf Bildschirm und Blatt steht: Text, dahinter die Seite.
 * @param {{ text: string, seite?: string }} zeile
 * @returns {string}
 */
export function zeileText(zeile) {
  return zeile.seite ? `${zeile.text} (${zeile.seite})` : zeile.text;
}

/**
 * Gesamttext einer Karte, so wie er gedruckt wird: Titel, Quelle,
 * Abschnittsueberschriften mit Zeilen und Fusszeile.
 * @param {object} karte
 * @returns {string}
 */
export function kartenText(karte) {
  return [
    karte.titel,
    karte.quelle,
    ...karte.abschnitte.flatMap((a) => [a.ueberschrift, ...a.zeilen.map(zeileText)]),
    karte.fuss,
    markierungFuer(karte),
  ].filter(Boolean).join('\n');
}

/** Pflichtmarkierung auf jeder gedruckten Karte mit Seitenangabe (docs/02 Z. 151–152, Pilot 1). */
export const PFLICHTMARKIERUNG = 'Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.';

/** Seitenangabe „S. n“ oder „S. n–m“ in einem Text. */
const SEITE = /S\. \d+/;

/** Maßzahl mit Einheit, zum Beispiel „1,2 m“ oder „50 cm“. */
const MASS = /\d+(?:,\d+)?\s?(?:cm|m)\b/;

/** Die Seiten, auf denen die Übungsmaße stehen (Quelle S. 58 bis 60). */
const MASSSEITE = /^S\. (58|59|60)$/;

/**
 * Hat die Karte eine Seitenangabe, also eine Quellenzeile oder eine Maßzeile mit Seite?
 * @param {object} karte
 * @returns {boolean}
 */
export function hatSeitenangabe(karte) {
  return SEITE.test(karte.quelle) || karte.abschnitte.some((a) => a.zeilen.some((z) => z.seite));
}

/**
 * Pflichtmarkierung für eine Karte: steht darauf, sobald die Karte eine Seitenangabe trägt.
 * @param {object} karte
 * @returns {string|null}
 */
export function markierungFuer(karte) {
  return hatSeitenangabe(karte) ? PFLICHTMARKIERUNG : null;
}

/**
 * Prüft die Maßzeilen einer Karte: Jede Zeile mit einer Maßzahl trägt eine Seite von 58 bis 60.
 * @param {object} karte
 * @returns {string[]} Fehlermeldungen; leer heißt: alles in Ordnung
 */
export function pruefeMasse(karte) {
  return karte.abschnitte
    .filter((a) => a.ueberschrift === 'Übungsmaß laut Quelle')
    .flatMap((a) => a.zeilen)
    .filter((z) => MASS.test(z.text) && !MASSSEITE.test(z.seite ?? ''))
    .map((z) => `${karte.id}: Maßzahl ohne Seite 58 bis 60: ${z.text}`);
}

/**
 * Prüft die Pflichtmarkierung: jede Karte mit Seitenangabe trägt sie im Drucktext.
 * @param {object[]} karten
 * @returns {string[]} Fehlermeldungen; leer heißt: alles in Ordnung
 */
export function pruefeMarkierung(karten) {
  return karten
    .filter(hatSeitenangabe)
    .filter((k) => !kartenText(k).includes(PFLICHTMARKIERUNG))
    .map((k) => `${k.id}: Pflichtmarkierung fehlt`);
}
