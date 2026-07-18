// Freunde in der Gruppe: reine Logik (ohne DOM), testbar. Szenario-Trainer
// 2/1/0 zu sozialem Verhalten in der Kindergruppe. Praleska docs/10 (Nr. 10).

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

/** Abschluss-Satz mit Rang. */
export function ergebnisSatz(raenge, punkte, anzahl) {
  const r = rangFuer(raenge, punkte);
  return `${r.emoji} ${r.titel} – ${punkte} von ${maxPunkte(anzahl)} Freundschafts-Punkten`;
}
