// Puppentheater-Werkstatt: reine Logik ohne DOM, testbar.
// Die Gestaltungsaufträge und Bausteine stehen in daten/werkstatt.json. Hier wird
// gewählt und als Text zusammengesetzt. Der Zufall kommt von außen (rng), damit
// diese Datei ohne Zufallsquelle läuft. Keine Speicherung, keine Bewertung von Kindern.

/**
 * Eine Zahl aus [0, laenge) als Index. Liefert der rng einen Wert außerhalb von
 * [0, 1), wird er auf den gültigen Bereich begrenzt; ein fehlender Wert wird 0.
 * @param {number} laenge positive ganze Zahl
 * @param {() => number} rng liefert Zahlen von 0 (einschließlich) bis 1 (ausschließlich)
 * @returns {number}
 */
export function zufallsIndex(laenge, rng) {
  if (!Number.isInteger(laenge) || laenge < 1) {
    throw new RangeError('laenge muss eine positive ganze Zahl sein');
  }
  if (typeof rng !== 'function') {
    throw new TypeError('rng fehlt: eine Funktion, die Zahlen von 0 bis 1 liefert');
  }
  const wert = Number(rng());
  const roh = Number.isFinite(wert) ? Math.floor(wert * laenge) : 0;
  return Math.min(laenge - 1, Math.max(0, roh));
}

/**
 * Ein Eintrag aus einer Liste, zufällig über rng.
 * @template T
 * @param {T[]} liste
 * @param {() => number} rng
 * @returns {T}
 */
export function waehle(liste, rng) {
  return liste[zufallsIndex(liste.length, rng)];
}

/**
 * Ein neuer Vorschlag: ein Gestaltungsauftrag und ein Stückanfang aus vier Bausteinen.
 * Die Reihenfolge der Ziehungen ist fest: Auftrag, Figur, Ort, Problem, Ende.
 * @param {object} daten
 * @param {() => number} rng
 * @returns {{ gestaltung: object, teile: { figur: string, ort: string, problem: string, ende: string }, stueckanfang: string }}
 */
export function neuerVorschlag(daten, rng) {
  const gestaltung = waehle(daten.gestaltung, rng);
  const teile = {
    figur: waehle(daten.bausteine.figur, rng),
    ort: waehle(daten.bausteine.ort, rng),
    problem: waehle(daten.bausteine.problem, rng),
    ende: waehle(daten.bausteine.ende, rng),
  };
  return {
    gestaltung,
    teile,
    stueckanfang: stueckanfangText(teile),
  };
}

/**
 * Der Stückanfang als Text: die vier Teile hintereinander, mit Leerzeichen.
 * @param {{ figur: string, ort: string, problem: string, ende: string }} teile
 * @returns {string}
 */
export function stueckanfangText(teile) {
  return [teile.figur, teile.ort, teile.problem, teile.ende].join(' ');
}

/**
 * Begriffe aus der Quelle, je Zeile mit Seite. Eine Übertragung steht dahinter und
 * ist als Eigenentwurf gekennzeichnet.
 * @param {{ begriffe: Array<{ quelltext: string, seite: string, deutsch?: string }> }} gestaltung
 * @returns {string[]}
 */
export function begriffZeilen(gestaltung) {
  return gestaltung.begriffe.map((b) => {
    const basis = `„${b.quelltext}“ (${b.seite})`;
    return b.deutsch ? `${basis}: ${b.deutsch} (Eigenentwurf)` : basis;
  });
}

/**
 * Alle Angaben des Druckblatts als Zeilen, so wie sie auf dem Blatt stehen.
 * @param {object} daten
 * @param {ReturnType<typeof neuerVorschlag>} vorschlag
 * @returns {{ kopf: string, gestaltungKopf: string, titel: string, quelle: string, auftrag: string, begriffe: string[], stueckanfang: string, pflicht: string }}
 */
export function kartenZeilen(daten, vorschlag) {
  const g = vorschlag.gestaltung;
  return {
    kopf: daten.titel,
    gestaltungKopf: daten.beschriftung.kopf,
    titel: g.titel,
    quelle: `Quelle: ${g.quelle}`,
    auftrag: g.aufgabe,
    begriffe: begriffZeilen(g),
    stueckanfang: vorschlag.stueckanfang,
    pflicht: daten.pflichtmarkierung,
  };
}

/**
 * Gesamttext des Druckblatts: Kopf, Titel, Quellenzeile, Auftrag, Begriffe,
 * Stückanfang und Pflichtmarkierung.
 * @param {object} daten
 * @param {ReturnType<typeof neuerVorschlag>} vorschlag
 * @returns {string}
 */
export function kartenText(daten, vorschlag) {
  const z = kartenZeilen(daten, vorschlag);
  return [
    z.kopf,
    z.gestaltungKopf,
    z.titel,
    z.quelle,
    daten.beschriftung.auftrag,
    z.auftrag,
    daten.beschriftung.begriffe,
    ...z.begriffe,
    daten.beschriftung.stueckanfang,
    z.stueckanfang,
    z.pflicht,
  ].join('\n');
}
