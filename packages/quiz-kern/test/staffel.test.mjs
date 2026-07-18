import { test } from 'node:test';
import assert from 'node:assert/strict';
import { amZug, staffelWertung, staffelSatz } from '../src/staffel.mjs';

test('amZug: gerade Frage jüngeres Kind, ungerade älteres', () => {
  assert.equal(amZug(0), 'jung');
  assert.equal(amZug(1), 'alt');
  assert.equal(amZug(2), 'jung');
  assert.equal(amZug(3), 'alt');
});

test('staffelWertung: Team-Punkte und getrennte Zähler', () => {
  const w = staffelWertung([
    { spieler: 'jung', richtig: true },
    { spieler: 'alt', richtig: true },
    { spieler: 'jung', richtig: false },
    { spieler: 'alt', richtig: true },
  ]);
  assert.equal(w.gesamt, 4);
  assert.equal(w.team, 3, 'drei richtige zusammen');
  assert.deepEqual(w.jung, { richtig: 1, gesamt: 2 });
  assert.deepEqual(w.alt, { richtig: 2, gesamt: 2 });
});

test('staffelWertung: leere Liste -> alles 0', () => {
  const w = staffelWertung([]);
  assert.equal(w.team, 0);
  assert.equal(w.gesamt, 0);
  assert.deepEqual(w.jung, { richtig: 0, gesamt: 0 });
});

test('staffelSatz: Team-Ergebnis wird formuliert', () => {
  assert.match(staffelSatz(staffelWertung([])), /Noch keine/);
  const s = staffelSatz(staffelWertung([{ spieler: 'jung', richtig: true }, { spieler: 'alt', richtig: false }]));
  assert.match(s, /Als Team: 1 von 2/);
  assert.match(s, /Jüngere\*r 1\/1/);
  assert.match(s, /Ältere\*r 0\/1/);
});
