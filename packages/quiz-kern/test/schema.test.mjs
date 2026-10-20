import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pruefeFragen } from '../src/schema.mjs';

const gueltig = {
  version: 1,
  fragen: [
    { id: 'b1', typ: 'binaer', kategorie: 'Test', aussage: 'Eine lange Testaussage.', korrekt: 'ja', erklaerung: 'Eine ausreichend lange Erklärung dazu.' },
    { id: 'w1', typ: 'wahl', kategorie: 'Test', frage: 'Eine lange Testfrage?', antworten: ['A', 'B', 'C'], korrekt: 2, erklaerung: 'Eine ausreichend lange Erklärung dazu.' },
  ],
};

test('gültiger Datensatz liefert keine Fehler', () => {
  assert.deepEqual(pruefeFragen(gueltig, { mindestFragen: 2 }), []);
});

test('Fehler werden erkannt: doppelte IDs, falscher Typ, korrekt außerhalb', () => {
  const kaputt = {
    fragen: [
      { id: 'x', typ: 'binaer', kategorie: 'T', aussage: 'Eine lange Testaussage.', korrekt: 'vielleicht', erklaerung: 'Eine ausreichend lange Erklärung dazu.' },
      { id: 'x', typ: 'wahl', kategorie: 'T', frage: 'Eine lange Testfrage?', antworten: ['A', 'A'], korrekt: 5, erklaerung: 'kurz' },
      { id: 'y', typ: 'raetsel', kategorie: 'T', erklaerung: 'Eine ausreichend lange Erklärung dazu.' },
    ],
  };
  const fehler = pruefeFragen(kaputt, { mindestFragen: 2 });
  assert.ok(fehler.some((f) => f.includes('doppelte Fragen-IDs')));
  assert.ok(fehler.some((f) => f.includes('"ja" oder "nein"')));
  assert.ok(fehler.some((f) => f.includes('doppelte Antworten')));
  assert.ok(fehler.some((f) => f.includes('korrekt-Index')));
  assert.ok(fehler.some((f) => f.includes('unbekannter Typ')));
  assert.ok(fehler.some((f) => f.includes('Erklärung')));
});
