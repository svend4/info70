// Sport-Schnupper-Stationen: reine Logik ohne DOM, testbar.
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
  ].join('\n');
}
