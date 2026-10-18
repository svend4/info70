// Spielideen-Kartei: reine Logik ohne DOM, testbar.
// Die Karten stehen in daten/spielideen.json. Hier wird nur gefiltert, gewählt
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
 * Filter nach Gegenstand und Handlung (UND-Verknüpfung). „alle“ hebt den Filter auf.
 * Karten ohne Gegenstand erscheinen nur bei „alle“ beim Gegenstand.
 * @param {object} daten
 * @param {{ gegenstand?: string, handlung?: string }} [filter]
 * @returns {object[]}
 */
export function filtern(daten, filter = {}) {
  const gegenstand = filter.gegenstand ?? 'alle';
  const handlung = filter.handlung ?? 'alle';
  return daten.karten.filter((k) =>
    (handlung === 'alle' || k.id === handlung) &&
    (gegenstand === 'alle' || k.gegenstaende.some((b) => b.id === gegenstand)));
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
 * Begriffe aus der Quelle, je Zeile mit Seite. Eine Glosse steht dahinter und
 * ist als Eigenentwurf gekennzeichnet. Ein Verweis ist so benannt.
 * @param {object} karte
 * @returns {string[]}
 */
export function begriffZeilen(karte) {
  return karte.begriffe.map((b) => {
    const kopf = b.verweis ? 'Verweis: ' : '';
    const basis = `${kopf}„${b.quelltext}“ (${b.seite})`;
    return b.deutsch ? `${basis}: ${b.deutsch} (Eigenentwurf)` : basis;
  });
}

/**
 * Gegenstaende der Karte, je Zeile mit Seite. Ohne Gegenstand steht das ausdruecklich da.
 * @param {{ gegenstaende: Array<{ id: string, seite: string }> }} daten
 * @param {object} karte
 * @returns {string[]}
 */
export function gegenstandZeilen(daten, karte) {
  if (karte.gegenstaende.length === 0) {
    return ['Die Quelle nennt bei dieser Handlung keinen Gegenstand (S. 40).'];
  }
  return karte.gegenstaende.map((bezug) => {
    const g = daten.gegenstaende.find((x) => x.id === bezug.id);
    return g ? `${g.name} („${g.quelltext}“, ${bezug.seite})` : `UNBEKANNT: ${bezug.id}`;
  });
}

/**
 * Gesamttext einer Karte, so wie sie gedruckt wird: Handlung, Quelle, Begriffe,
 * Gegenstaende, Spielidee, Sicherheitssatz und Pflichtmarkierung.
 * @param {object} daten
 * @param {object} karte
 * @returns {string}
 */
export function kartenText(daten, karte) {
  return [
    karte.handlung,
    karte.quelle,
    ...begriffZeilen(karte),
    ...gegenstandZeilen(daten, karte),
    karte.spielidee,
    daten.sicherheitssatz,
    daten.pflichtmarkierung,
  ].join('\n');
}
