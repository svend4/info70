// Dark-Pattern-Labyrinth: reine Spiel-Logik (ohne DOM), damit sie testbar ist.
// Modell: 7 Stationen der Fake-App "Glitzi", pro Station genau EINE ehrliche
// Option. Jede durchschaute Falle (= ehrliche Wahl) gibt einen Punkt.

/**
 * Startet einen neuen Lauf durchs Labyrinth.
 * @param {number} anzahl Zahl der Stationen
 * @returns {{ index: number, punkte: number, anzahl: number }}
 */
export function neuesSpiel(anzahl) {
  return { index: 0, punkte: 0, anzahl };
}

/**
 * Verarbeitet eine Entscheidung: ehrliche Wahl (istFalle=false) gibt 1 Punkt,
 * Falle gibt keinen. Liefert einen NEUEN Stand (unveränderlich).
 * @param {{ index: number, punkte: number, anzahl: number }} stand
 * @param {boolean} istFalle
 */
export function waehle(stand, istFalle) {
  if (istVorbei(stand)) return stand;
  return { ...stand, index: stand.index + 1, punkte: stand.punkte + (istFalle ? 0 : 1) };
}

/**
 * Ist der Lauf vorbei (alle Stationen entschieden)?
 * @param {{ index: number, anzahl: number }} stand
 */
export function istVorbei(stand) {
  return stand.index >= stand.anzahl;
}

/**
 * Liefert die (laut Datenschema genau eine) ehrliche Option einer Station.
 * @param {{ optionen: Array<{ text: string, istFalle: boolean }> }} station
 */
export function ehrlicheOption(station) {
  return station.optionen.find((o) => !o.istFalle);
}

/**
 * Rang zum Punktestand: der höchste Rang, dessen Schwelle erreicht ist.
 * @param {number} punkte
 * @param {Array<{ ab: number, titel: string, emoji: string }>} raenge aufsteigend nach `ab`
 */
export function rang(punkte, raenge) {
  return [...raenge].reverse().find((r) => punkte >= r.ab) ?? raenge[0];
}

/**
 * Muster-Lexikon für den Abschluss-Bildschirm: alle Patterns mit Erklärung.
 * @param {Array<{ name: string, erklaerung: string }>} stationen
 */
export function lexikon(stationen) {
  return stationen.map((s) => ({ name: s.name, erklaerung: s.erklaerung }));
}
