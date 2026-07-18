// quiz-kern Duett-Modus: reine Wertungs-Logik (ohne DOM), testbar.
// Zwei Spieler*innen (z. B. Eltern + Kind) beantworten am selben Gerät
// nacheinander dieselben Fragen; danach werden die Ergebnisse verglichen.
// Ergebnisse bleiben lokal, kein Rekord wird überschrieben (Familienspiel).

/**
 * Vergleicht die Antwort-Richtigkeit zweier Spieler*innen.
 * @param {boolean[]} a Richtig-Marker Spieler 1
 * @param {boolean[]} b Richtig-Marker Spieler 2
 * @returns {{punkteA:number, punkteB:number, beide:number, team:number,
 *   gesamt:number, fuehrung:'a'|'b'|'gleich', zeilen:Array<{nr:number,a:boolean,b:boolean}>}}
 */
export function duettWertung(a = [], b = []) {
  const gesamt = Math.min(a.length, b.length);
  let punkteA = 0;
  let punkteB = 0;
  let beide = 0;
  let team = 0;
  const zeilen = [];
  for (let i = 0; i < gesamt; i++) {
    const ra = !!a[i];
    const rb = !!b[i];
    if (ra) punkteA++;
    if (rb) punkteB++;
    if (ra && rb) beide++;
    if (ra || rb) team++; // Team-Punkt: mindestens eine*r wusste es
    zeilen.push({ nr: i + 1, a: ra, b: rb });
  }
  const fuehrung = punkteA === punkteB ? 'gleich' : punkteA > punkteB ? 'a' : 'b';
  return { punkteA, punkteB, beide, team, gesamt, fuehrung, zeilen };
}

/** Kurzer Ergebnissatz für die Anzeige. */
export function duettSatz(wertung, namenA = 'Spieler 1', namenB = 'Spieler 2') {
  if (wertung.fuehrung === 'gleich') return `Unentschieden: ${namenA} und ${namenB} je ${wertung.punkteA} von ${wertung.gesamt}.`;
  const vorn = wertung.fuehrung === 'a' ? namenA : namenB;
  const p = Math.max(wertung.punkteA, wertung.punkteB);
  return `${vorn} liegt vorn mit ${p} von ${wertung.gesamt}. Als Team: ${wertung.team} von ${wertung.gesamt}.`;
}
