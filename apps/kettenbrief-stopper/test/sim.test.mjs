import { test } from 'node:test';
import assert from 'node:assert/strict';
import { erstelleKlasse, simuliere, vergleiche } from '../sim.mjs';

// Deterministischer Zufall (LCG), damit die Tests reproduzierbar sind
function lcg(saat = 42) {
  let zustand = saat;
  return () => {
    zustand = (zustand * 1664525 + 1013904223) % 4294967296;
    return zustand / 4294967296;
  };
}

test('erstelleKlasse: feste Ziele, Spieler ist Ziel des Start-Kindes, niemand leitet an sich selbst', () => {
  const klasse = erstelleKlasse({ zufall: lcg() });
  assert.equal(klasse.ziele.length, 24);
  assert.ok(klasse.ziele[klasse.start].includes(klasse.spieler));
  klasse.ziele.forEach((ziele, kind) => {
    assert.equal(ziele.length, 2);
    assert.ok(!ziele.includes(kind), `Kind ${kind} leitet an sich selbst`);
  });
});

test('ohne Stopper breitet sich die Nachricht weit aus', () => {
  const klasse = erstelleKlasse({ zufall: lcg(7) });
  const { erhalten, runden } = simuliere(klasse);
  assert.ok(erhalten.size >= klasse.groesse / 2, `nur ${erhalten.size} von ${klasse.groesse} erreicht`);
  assert.ok(runden.length >= 3, 'Ausbreitung über mehrere Runden');
});

test('Stopp + Warnung reduziert die Zahl der erschreckten Kinder', () => {
  const klasse = erstelleKlasse({ zufall: lcg(7) });
  const { alleLeitenWeiter, mitStopp } = vergleiche(klasse);
  assert.ok(mitStopp < alleLeitenWeiter, `mitStopp=${mitStopp} muss < alleLeitenWeiter=${alleLeitenWeiter} sein`);
});

test('gewarnte (immune) Kinder bekommen die Nachricht nie', () => {
  const klasse = erstelleKlasse({ zufall: lcg(3) });
  const immun = new Set([5, 11, 17]);
  const { erhalten } = simuliere(klasse, { immun });
  for (const kind of immun) assert.ok(!erhalten.has(kind), `gewarntes Kind ${kind} wurde erschreckt`);
});

test('Stopper bekommen die Nachricht, leiten aber nicht weiter', () => {
  const klasse = erstelleKlasse({ groesse: 6, weiterleitungen: 1, spieler: 1, start: 0, zufall: lcg(1) });
  // Kette von Hand: 0 -> 1 -> 2 -> ... ; Stopper bei 1 kappt alles dahinter
  klasse.ziele[0] = [1];
  klasse.ziele[1] = [2];
  klasse.ziele[2] = [3];
  const ohne = simuliere(klasse).erhalten;
  const mit = simuliere(klasse, { stopper: new Set([1]) }).erhalten;
  assert.ok(ohne.has(2) && ohne.has(3));
  assert.ok(mit.has(1) && !mit.has(2) && !mit.has(3));
});
