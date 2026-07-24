import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { erwarteteAntwort, pruefeFragen, rangFuer } from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/fragen.json', import.meta.url), 'utf8'));

test('Fragenbank ist selbstkonsistent (korrekt passt zu Parametern + Wortlaut)', () => {
  assert.deepEqual(pruefeFragen(daten), []);
  assert.ok(daten.fragen.length >= 8);
});

test('alle fünf Klang-Merkmale sind vertreten', () => {
  const typen = new Set(daten.fragen.map((q) => q.typ));
  for (const t of ['hoch-tief', 'laut-leise', 'schnell-langsam', 'hoch-runter', 'weich-scharf']) {
    assert.ok(typen.has(t), `Typ ${t} fehlt`);
  }
});

test('erwarteteAntwort: Polarität des Fragewortlauts wird beachtet', () => {
  assert.equal(erwarteteAntwort({ typ: 'hoch-tief', frage: 'Welcher Ton war höher?', toene: [{ hz: 200 }, { hz: 400 }] }), 1);
  assert.equal(erwarteteAntwort({ typ: 'hoch-tief', frage: 'Welcher Ton war tiefer?', toene: [{ hz: 200 }, { hz: 400 }] }), 0);
  assert.equal(erwarteteAntwort({ typ: 'laut-leise', frage: 'Welcher Ton war leiser?', toene: [{ gain: 0.3 }, { gain: 0.1 }] }), 1);
  assert.equal(erwarteteAntwort({ typ: 'schnell-langsam', frage: 'Welches Klopfen war schneller?', rhythmen: [{ schlaege: 2 }, { schlaege: 9 }] }), 1);
  assert.equal(erwarteteAntwort({ typ: 'hoch-runter', frage: 'oben/unten?', glide: { von: 200, bis: 600 } }), 0);
  assert.equal(erwarteteAntwort({ typ: 'hoch-runter', frage: 'oben/unten?', glide: { von: 600, bis: 200 } }), 1);
  assert.equal(erwarteteAntwort({ typ: 'weich-scharf', frage: 'x', klang: { wellenform: 'sine' } }), 0);
  assert.equal(erwarteteAntwort({ typ: 'weich-scharf', frage: 'x', klang: { wellenform: 'sawtooth' } }), 1);
});

test('pruefeFragen erkennt Inkonsistenz', () => {
  const kaputt = { fragen: [...daten.fragen.slice(0, 8), { id: 'x', typ: 'hoch-tief', frage: 'Welcher Ton war höher?', toene: [{ hz: 200 }, { hz: 400 }], optionen: ['a', 'b'], korrekt: 0, erklaerung: 'falsch herum, sollte 1 sein' }] };
  assert.ok(pruefeFragen(kaputt).some((f) => /korrekt=0.*folgt 1/.test(f)));
});

test('rangFuer', () => {
  assert.equal(rangFuer(daten.raenge, 0).ab, 0);
  assert.equal(rangFuer(daten.raenge, 100).titel, daten.raenge[daten.raenge.length - 1].titel);
});
