// Kettenbrief-Stopper: reine Simulationslogik (ohne DOM), damit sie testbar ist.
// Modell: Jedes Kind hat feste Weiterleitungs-Ziele. Die Nachricht breitet sich
// rundenweise aus. Stopper leiten nicht weiter; Gewarnte (immun) ignorieren die
// Nachricht und leiten nie weiter.

/**
 * Baut eine Klasse mit festen Weiterleitungs-Zielen pro Kind.
 * Das Spieler-Kind ist garantiert erstes Ziel des Start-Kindes,
 * damit die Entscheidung im Spiel immer vorkommt.
 * @param {{ groesse?: number, weiterleitungen?: number, spieler?: number, start?: number, zufall?: () => number }} [optionen]
 */
export function erstelleKlasse({ groesse = 24, weiterleitungen = 2, spieler = 7, start = 0, zufall = Math.random } = {}) {
  const ziele = [];
  for (let kind = 0; kind < groesse; kind++) {
    const eigene = new Set();
    while (eigene.size < weiterleitungen) {
      const ziel = Math.floor(zufall() * groesse);
      if (ziel !== kind) eigene.add(ziel);
    }
    ziele.push([...eigene]);
  }
  if (!ziele[start].includes(spieler)) ziele[start][0] = spieler;
  return { groesse, ziele, spieler, start };
}

/**
 * Simuliert die Ausbreitung rundenweise.
 * @param {{ groesse: number, ziele: number[][], start: number }} klasse
 * @param {{ stopper?: Set<number>, immun?: Set<number>, maxRunden?: number }} [optionen]
 * @returns {{ erhalten: Set<number>, runden: Array<Set<number>> }} erhalten = alle erschreckten Kinder;
 *   runden[i] = wer die Nachricht in Runde i neu bekommen hat
 */
export function simuliere(klasse, { stopper = new Set(), immun = new Set(), maxRunden = 12 } = {}) {
  const erhalten = new Set(immun.has(klasse.start) ? [] : [klasse.start]);
  const runden = [new Set(erhalten)];
  let front = [...erhalten];
  for (let runde = 0; runde < maxRunden && front.length > 0; runde++) {
    const neu = new Set();
    for (const kind of front) {
      if (stopper.has(kind)) continue;
      for (const ziel of klasse.ziele[kind]) {
        if (!erhalten.has(ziel) && !immun.has(ziel)) neu.add(ziel);
      }
    }
    if (neu.size === 0) break;
    for (const kind of neu) erhalten.add(kind);
    runden.push(neu);
    front = [...neu];
  }
  return { erhalten, runden };
}

/**
 * Vergleich für den Abschluss-Bildschirm: Wie viele Kinder erschreckt die
 * Nachricht, wenn alle weiterleiten - und wie viele, wenn das Spieler-Kind
 * stoppt und seine Ziele (plus ein weiteres Kind) warnt?
 * @param {{ groesse: number, ziele: number[][], spieler: number, start: number }} klasse
 */
export function vergleiche(klasse) {
  const alleLeitenWeiter = simuliere(klasse).erhalten.size;
  const gewarnte = new Set(klasse.ziele[klasse.spieler]);
  for (let kind = 0; kind < klasse.groesse; kind++) {
    if (gewarnte.size >= klasse.ziele[klasse.spieler].length + 1) break;
    if (kind !== klasse.spieler && !gewarnte.has(kind)) gewarnte.add(kind);
  }
  const mitStopp = simuliere(klasse, { stopper: new Set([klasse.spieler]), immun: gewarnte }).erhalten.size;
  return { alleLeitenWeiter, mitStopp, gewarnte };
}
