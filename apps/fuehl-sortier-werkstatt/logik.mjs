// Fühl- und Sortier-Werkstatt: reine Logik ohne DOM, testbar.
// Die Karten stehen in daten/werkstatt.json. Hier wird nur gefiltert, gewählt und
// der Kartenaufbau zusammengesetzt. Bildschirm und Druck zeigen denselben Aufbau.
// Keine Speicherung, keine Bewertung von Kindern.

const KOPF = {
  material: 'Materialkarte (Eigenentwurf)',
  sortierung: 'Sortierauftrag (Eigenentwurf)',
  sicherheit: 'Sicherheitskarte (Eigenentwurf)',
};

/**
 * Kennungen aller Karten in Anzeige- und Druckreihenfolge.
 * @param {{ karten: Array<{ id: string }> }} daten
 * @returns {string[]}
 */
export function alleKennungen(daten) {
  return daten.karten.map((k) => k.id);
}

/**
 * Filter nach Material und Sortierauftrag (UND-Verknüpfung). „alle“ hebt den Filter auf.
 * Karten ohne Material (Sicherheit) und Materialkarten ohne Sortierung erscheinen nur bei „alle“.
 * @param {object} daten
 * @param {{ material?: string, sortierung?: string }} [filter]
 * @returns {object[]}
 */
export function filtern(daten, filter = {}) {
  const material = filter.material ?? 'alle';
  const sortierung = filter.sortierung ?? 'alle';
  return daten.karten.filter((k) =>
    (material === 'alle' || k.materialien.includes(material)) &&
    (sortierung === 'alle' || k.sortierung === sortierung));
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
 * Fügt Karten zur Auswahl hinzu; liefert eine neue Menge ohne Dubletten.
 * @param {Iterable<string>} auswahl
 * @param {Iterable<string>} kennungen
 * @returns {Set<string>}
 */
export function hinzufuegen(auswahl, kennungen) {
  return new Set([...auswahl, ...kennungen]);
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
 * Lernziel aus der Quelle, mit Seite. Die deutsche Übertragung ist Eigenentwurf.
 * @param {object} karte
 * @returns {string}
 */
export function zielZeile(karte) {
  const z = karte.ziel;
  return `„${z.quelltext}“ (${z.seite}): ${z.deutsch} (Eigenentwurf)`;
}

/**
 * Begriffe aus der Quelle je Materialkarte, mit Seite. Nur Materialkarten haben welche.
 * @param {object} karte
 * @returns {string[]}
 */
export function begriffZeilen(karte) {
  return (karte.begriffe ?? []).map((b) => `„${b.quelltext}“ (${b.seite}): ${b.deutsch} (Eigenentwurf)`);
}

/**
 * Gegenstände aus dem Alltag (Eigenentwurf, deutsch). Keine Quellenaussage.
 * @param {object} karte
 * @returns {string[]}
 */
export function gegenstandZeilen(karte) {
  return karte.gegenstaende ?? [];
}

/**
 * Der gesamte Aufbau einer Karte: Kopf, Titel, Quellenzeile, Abschnitte und Pflichtmarkierung.
 * Abschnitte ohne Zeilen entfallen. Bildschirm, Druck und Tests lesen diesen Aufbau.
 * @param {{ pflichtmarkierung: string }} daten
 * @param {object} karte
 * @returns {{ kopf: string, titel: string, quelle: string, abschnitte: Array<[string, string[]]>, pflicht: string }}
 */
export function kartenAufbau(daten, karte) {
  const abschnitte = [
    ['Lernziel aus der Quelle', [zielZeile(karte)]],
    ['Begriff in der Quelle', begriffZeilen(karte)],
    ['Gegenstände aus dem Alltag (Eigenentwurf)', gegenstandZeilen(karte)],
    ['Aufgabe (Eigenentwurf)', karte.aufgabe ? [karte.aufgabe] : []],
    ['Frage an das Kind (Eigenentwurf)', karte.frage ? [karte.frage] : []],
    ['Hinweis (Eigenentwurf)', karte.hinweis ? [karte.hinweis] : []],
  ].filter(([, zeilen]) => zeilen.length > 0);
  return {
    kopf: KOPF[karte.art] ?? 'UNBEKANNT',
    titel: karte.titel,
    quelle: `Quelle: Praleska, ${karte.ziel.seite}`,
    abschnitte,
    pflicht: daten.pflichtmarkierung,
  };
}

/**
 * Gesamttext einer Karte, so wie sie gedruckt wird.
 * @param {object} daten
 * @param {object} karte
 * @returns {string}
 */
export function kartenText(daten, karte) {
  const a = kartenAufbau(daten, karte);
  return [
    a.kopf,
    a.titel,
    a.quelle,
    ...a.abschnitte.flatMap(([ueberschrift, zeilen]) => [ueberschrift, ...zeilen]),
    a.pflicht,
  ].join('\n');
}
