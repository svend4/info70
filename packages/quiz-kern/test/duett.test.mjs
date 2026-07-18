import { test } from 'node:test';
import assert from 'node:assert/strict';
import { duettWertung, duettSatz } from '../src/duett.mjs';

test('duettWertung: zählt Punkte, Team (Vereinigung) und beide (Schnitt)', () => {
  const w = duettWertung([true, false, true, false], [true, true, false, false]);
  assert.equal(w.gesamt, 4);
  assert.equal(w.punkteA, 2);
  assert.equal(w.punkteB, 2);
  assert.equal(w.beide, 1, 'nur Frage 1 wussten beide');
  assert.equal(w.team, 3, 'Team: mind. eine*r wusste es (Fragen 1,2,3)');
  assert.equal(w.fuehrung, 'gleich');
});

test('duettWertung: erkennt Führung von Spieler A und B', () => {
  assert.equal(duettWertung([true, true], [false, true]).fuehrung, 'a');
  assert.equal(duettWertung([false, false], [true, false]).fuehrung, 'b');
});

test('duettWertung: verschieden lange Listen -> kürzere zählt', () => {
  const w = duettWertung([true, true, true], [true]);
  assert.equal(w.gesamt, 1);
  assert.equal(w.punkteA, 1);
  assert.equal(w.punkteB, 1);
});

test('duettWertung: zeilen enthalten je Frage die Richtig-Marker', () => {
  const w = duettWertung([true, false], [false, false]);
  assert.deepEqual(w.zeilen, [{ nr: 1, a: true, b: false }, { nr: 2, a: false, b: false }]);
});

test('duettSatz: Gleichstand und Führung werden formuliert', () => {
  assert.match(duettSatz(duettWertung([true], [true]), 'Oma', 'Kind'), /Unentschieden/);
  const s = duettSatz(duettWertung([true, true], [false, true]), 'Oma', 'Kind');
  assert.match(s, /Oma liegt vorn/);
  assert.match(s, /Als Team: 2 von 2/);
});
