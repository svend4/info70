// Werkstatt-Karten: reine Logik ohne DOM, testbar.
// Die Karten stehen in daten/karten.json. Hier wird nur gewählt, gefiltert, geordnet
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
 * Auswahl beim Start: alle Karten gewählt.
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
 * Die Karten, die der Filter zeigt. Der Technik-Filter wirkt nur auf Technik- und
 * Ergänzungskarten, der Themen-Filter nur auf Themenkarten. Der Wert „alle“ zeigt alles.
 * @param {{ karten: object[] }} daten
 * @param {{ technik?: string, gruppe?: string }} [filter]
 * @returns {object[]}
 */
export function sichtbar(daten, filter = {}) {
  const technik = filter.technik ?? 'alle';
  const gruppe = filter.gruppe ?? 'alle';
  return daten.karten.filter((k) => (k.art === 'thema'
    ? gruppe === 'alle' || k.gruppe === gruppe
    : technik === 'alle' || k.technik === technik));
}

/**
 * Wählt die sichtbaren Karten aus. Nicht sichtbare Karten bleiben, wie sie waren.
 * @param {Iterable<string>} auswahl
 * @param {string[]} kennungen die sichtbaren Kennungen
 * @returns {Set<string>}
 */
export function sichtbareWaehlen(auswahl, kennungen) {
  const neu = new Set(auswahl);
  for (const k of kennungen) neu.add(k);
  return neu;
}

/**
 * Wählt die sichtbaren Karten ab. Nicht sichtbare Karten bleiben, wie sie waren.
 * @param {Iterable<string>} auswahl
 * @param {string[]} kennungen die sichtbaren Kennungen
 * @returns {Set<string>}
 */
export function sichtbareAbwaehlen(auswahl, kennungen) {
  const neu = new Set(auswahl);
  for (const k of kennungen) neu.delete(k);
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
 * Pflichtmarkierung der Seitenangaben. Steht auf jeder gedruckten Karte, im Druck
 * sichtbar (app.mjs, druck.css) und im Bildschirmfuß.
 */
export const PFLICHTSATZ = 'Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.';

/**
 * Gesamttext einer Karte, so wie er gedruckt wird: Titel, Quelle,
 * Abschnittsueberschriften mit Zeilen, Fusszeile und Pflichtmarkierung.
 * @param {object} karte
 * @returns {string}
 */
export function kartenText(karte) {
  return [
    karte.titel,
    karte.quelle,
    ...karte.abschnitte.flatMap((a) => [a.ueberschrift, ...a.zeilen.map(zeileText)]),
    karte.fuss,
    PFLICHTSATZ,
  ].join('\n');
}

/**
 * Zaehlzeile unter der Auswahl.
 * @param {number} gewaehlt
 * @param {number} gesamt
 * @returns {string}
 */
export function zaehlerText(gewaehlt, gesamt) {
  return `${gewaehlt} von ${gesamt} Karten gewählt. Jede Karte kommt auf ein eigenes Blatt A4 quer.`;
}

/**
 * Kennung eines Auswahlknopfs: eine Karte, ein Knopf.
 * @param {string} id
 * @returns {string}
 */
export function auswahlKennung(id) {
  return `auswahl-${id}`;
}

/**
 * Kennung eines Filterknopfs. Gruppe ist „technik“ oder „gruppe“.
 * @param {string} gruppe
 * @param {string} wert
 * @returns {string}
 */
export function filterKennung(gruppe, wert) {
  return `filter-${gruppe}-${wert}`;
}

/**
 * Alle Kennungen aller Knöpfe der Oberfläche. Jede muss eindeutig sein,
 * sonst findet der Fokus nach dem Neuaufbau den falschen Knopf.
 * @param {{ techniken: Array<{ id: string }>, gruppen: Array<{ id: string }>, karten: Array<{ id: string }> }} daten
 * @returns {string[]}
 */
export function alleKnopfKennungen(daten) {
  return [
    'alle-sichtbar-waehlen',
    'alle-sichtbar-abwaehlen',
    'drucken',
    filterKennung('technik', 'alle'),
    ...daten.techniken.map((t) => filterKennung('technik', t.id)),
    filterKennung('gruppe', 'alle'),
    ...daten.gruppen.map((g) => filterKennung('gruppe', g.id)),
    ...alleKennungen(daten).map(auswahlKennung),
  ];
}
