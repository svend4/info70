// Kindertänze Europas: reine Logik ohne DOM, testbar.
// Die Tanzkarten stehen in daten/tanze.json. Hier wird nur gewählt, gefiltert
// und als Text zusammengesetzt. Keine Speicherung, keine Bewertung von Kindern.

/** Die Pflichtmarkierung der Seitenangaben. Sie steht auf jeder gedruckten Karte. */
export const PFLICHTSATZ = 'Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.';

/** Die Kennzeichnung für alles, was nicht aus der Quelle stammt. */
export const EIGENENTWURF = 'Eigenentwurf';

/** Filter nach Tanzart. „alle“ zeigt alles. */
export const ARTEN = [
  { id: 'alle', titel: 'Alle Tanzarten' },
  { id: 'tanz', titel: 'Tanz, Melodie laut Quelle' },
  { id: 'komponist', titel: 'Tanzart mit Komponistenangabe' },
];

/**
 * Kennungen aller Tanzkarten in Anzeige- und Druckreihenfolge.
 * @param {{ tanze: Array<{ id: string }> }} daten
 * @returns {string[]}
 */
export function alleKennungen(daten) {
  return daten.tanze.map((t) => t.id);
}

/**
 * Auswahl beim Start: alle Tanzkarten gewählt.
 * @param {{ tanze: Array<{ id: string }> }} daten
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
 * Die Tanzkarten, die der Filter zeigt. Der Wert „alle“ zeigt alles.
 * @param {{ tanze: object[] }} daten
 * @param {{ art?: string }} [filter]
 * @returns {object[]}
 */
export function sichtbar(daten, filter = {}) {
  const art = filter.art ?? 'alle';
  return daten.tanze.filter((t) => art === 'alle' || t.art === art);
}

/**
 * Wählt die sichtbaren Tanzkarten aus. Nicht sichtbare bleiben, wie sie waren.
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
 * Wählt die sichtbaren Tanzkarten ab. Nicht sichtbare bleiben, wie sie waren.
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
 * Die gewählten Tanzkarten in fester Reihenfolge. Unbekannte Kennungen werden
 * ignoriert; jede Karte kommt höchstens einmal vor.
 * @param {{ tanze: Array<{ id: string }> }} daten
 * @param {Iterable<string>} auswahl
 * @returns {object[]}
 */
export function gewaehlteTanze(daten, auswahl) {
  const gewaehlt = new Set(auswahl);
  return daten.tanze.filter((t) => gewaehlt.has(t.id));
}

/**
 * Druck ist möglich, sobald mindestens eine Karte gewählt ist.
 * @param {object[]} tanze
 * @returns {boolean}
 */
export function kannDrucken(tanze) {
  return tanze.length > 0;
}

/** Kennung eines Auswahlknopfs. */
export function auswahlKennung(id) {
  return `auswahl-${id}`;
}

/** Kennung eines Filterknopfs. */
export function filterKennung(id) {
  return `filter-${id}`;
}

/**
 * Beschriftung eines Auswahlknopfs: deutscher Name, dahinter der Quelltitel.
 * @param {{ name_de: string, quelltitel: string }} t
 * @returns {string}
 */
export function auswahlBeschriftung(t) {
  return t.quelltitel ? `${t.name_de} («${t.quelltitel}»)` : t.name_de;
}

/** Zähler über den Knöpfen. */
export function zaehlerText(gewaehlt, gesamt) {
  return `${gewaehlt} von ${gesamt} Tanzkarten gewählt. Jede Karte kommt auf ein eigenes Blatt A4 quer.`;
}

/**
 * Quellenzeile mit Seite. Das Zitat steht unverändert aus der Quelle, der
 * Absatz ebenso.
 * @param {{ seite: number, absatz: string, quelle_zitat: string }} t
 * @returns {string}
 */
export function quelleText(t) {
  const absatz = t.absatz ? `, Absatz „${t.absatz}“` : '';
  return `Quelle: Praleska, S. ${t.seite}${absatz}: ${t.quelle_zitat}`;
}

/** Tanzart-Zeile mit Seite. */
export function tanzartText(t) {
  return t.art === 'tanz'
    ? `Tanz, Melodie laut Quelle (S. ${t.seite})`
    : `Tanzart mit Komponistenangabe (S. ${t.seite})`;
}

/** Melodie-Herkunft mit Seite; nur bei Tanzkarten mit Volksmelodie-Angabe. */
export function melodieText(t) {
  return t.art === 'tanz' ? `${t.melodie} (Quelle S. ${t.seite})` : '';
}

/** Alternativtitel aus der Quelle, mit Seite; leer, wenn es keinen gibt. */
export function alternativText(t) {
  return t.alternativ_zitat ? `Alternativtitel in der Quelle (S. ${t.seite}): «${t.alternativ_zitat}»` : '';
}

/**
 * Gesamttext einer gedruckten Tanzkarte: Name, Quelle, Abschnitte, Fußzeile
 * und die Pflichtmarkierung. So wie er auf dem Blatt steht.
 * @param {object} t
 * @param {{ altersgruppe: string, sprachhinweis: string }} daten
 * @returns {string}
 */
export function kartenText(t, daten) {
  return [
    t.name_de,
    t.zusatz_de ? `Zusatz (${EIGENENTWURF}): ${t.zusatz_de}` : '',
    quelleText(t),
    `Tanzart: ${tanzartText(t)}`,
    t.art === 'tanz' ? `Melodie: ${melodieText(t)}` : '',
    alternativText(t),
    `Schrittbeschreibung (${EIGENENTWURF}): ${t.schritte}`,
    `Hinweis zur Bewegung (${EIGENENTWURF}): ${t.hinweis}`,
    `Altersgruppe: ${daten.altersgruppe}`,
    `Tanzbezeichnung und Beschreibungen sind ${EIGENENTWURF}. Die Quelle nennt für diesen Tanz nur die Angabe oben.`,
    daten.sprachhinweis,
    PFLICHTSATZ,
  ].filter(Boolean).join('\n');
}

/**
 * Zahl der Sätze in einem Text. Trennt nach Satzzeichen mit Leerzeichen danach.
 * @param {string} text
 * @returns {number}
 */
export function satzZahl(text) {
  return text.split(/(?<=[.!?])\s+/).filter((s) => s.trim() !== '').length;
}
