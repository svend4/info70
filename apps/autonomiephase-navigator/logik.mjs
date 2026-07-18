// Autonomiephase-Navigator: reine Logik (ohne DOM), testbar. Szenario-Selbst-
// training für Eltern (2/1/0). Grundgedanke: Balance aus Anforderung und
// Zuwendung. Praleska docs/10 (Top-30 Nr. 11).

/** Wertung einer Option (0/1/2). */
export function punkteFuer(option) {
  return option?.wert ?? 0;
}

/** Maximalpunktzahl einer Runde. */
export function maxPunkte(anzahl) {
  return anzahl * 2;
}

/** Rang zur erreichten Punktzahl (höchster passender „ab“-Wert). */
export function rangFuer(raenge, punkte) {
  let treffer = raenge[0];
  for (const r of raenge) if (punkte >= r.ab) treffer = r;
  return treffer;
}

/** Reflexions-Abschluss (kein Urteil über das Kind). */
export function ergebnisSatz(raenge, punkte, anzahl) {
  const r = rangFuer(raenge, punkte);
  return `${r.emoji} ${r.titel} – ${punkte} von ${maxPunkte(anzahl)} Punkten in Richtung „klar und zugewandt“.`;
}
