// Dark-Pattern-Labyrinth: reine Spiel-Logik (ohne DOM), damit sie testbar ist.
// Modell: 7 Stationen der Fake-App "Glitzi", pro Station genau EINE ehrliche
// Option. Das Kind wird nicht bewertet: der Stand kennt nur die Station.

/**
 * Startet einen neuen Lauf durchs Labyrinth.
 * @param {number} anzahl Zahl der Stationen
 * @returns {{ index: number, anzahl: number }}
 */
export function neuesSpiel(anzahl) {
  return { index: 0, anzahl };
}

/**
 * Verarbeitet eine Entscheidung: geht zur nächsten Station, egal wie gewählt
 * wurde (Falle oder ehrlicher Ausweg). Liefert einen NEUEN Stand (unveränderlich).
 * @param {{ index: number, anzahl: number }} stand
 */
export function waehle(stand) {
  if (istVorbei(stand)) return stand;
  return { ...stand, index: stand.index + 1 };
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
 * Muster-Lexikon für den Abschluss-Bildschirm: alle Patterns mit Erklärung.
 * @param {Array<{ name: string, erklaerung: string }>} stationen
 */
export function lexikon(stationen) {
  return stationen.map((s) => ({ name: s.name, erklaerung: s.erklaerung }));
}
