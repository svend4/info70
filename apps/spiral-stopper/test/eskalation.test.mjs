import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { REAKTIONEN, stufe, reagiere, bewertung } from '../eskalation.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/kommentare.json', import.meta.url), 'utf8'));

test('Reaktionen: alle vier Wege vorhanden, Wirkung plausibel gerichtet', () => {
  const codes = REAKTIONEN.map((r) => r.code);
  assert.deepEqual(codes.sort(), ['gegenrede', 'ignorieren', 'melden', 'poebeln']);
  assert.ok(REAKTIONEN.find((r) => r.code === 'poebeln').wirkung > 0, 'Pöbeln heizt auf');
  assert.ok(REAKTIONEN.find((r) => r.code === 'ignorieren').wirkung > 0, 'Ignorieren kühlt NICHT (kleine Erwärmung)');
  assert.ok(REAKTIONEN.find((r) => r.code === 'gegenrede').wirkung < 0, 'Gegenrede kühlt');
  assert.ok(REAKTIONEN.find((r) => r.code === 'melden').wirkung < REAKTIONEN.find((r) => r.code === 'gegenrede').wirkung, 'Melden kühlt am stärksten');
  for (const r of REAKTIONEN) assert.ok(r.lehre?.length >= 40, `${r.code}: Lehre fehlt`);
});

test('reagiere: klemmt auf 0..100, unbekannte Codes werfen', () => {
  assert.equal(reagiere(10, 'melden'), 0);
  assert.equal(reagiere(90, 'poebeln'), 100);
  assert.equal(reagiere(50, 'gegenrede'), 35);
  assert.throws(() => reagiere(50, 'tanzen'));
});

test('stufe: Grenzen korrekt', () => {
  assert.equal(stufe(0).name, 'ruhig');
  assert.equal(stufe(34).name, 'ruhig');
  assert.equal(stufe(35).name, 'gereizt');
  assert.equal(stufe(70).name, 'heiss');
  assert.equal(stufe(100).name, 'heiss');
});

test('bewertung: kühler Verlauf gewinnt, heißer verliert', () => {
  assert.equal(bewertung([30, 15, 5, 0]).titel, 'Spiral-Stopper*in');
  assert.equal(bewertung([30, 55, 80, 90]).titel, 'Heißer Thread');
});

test('Kommentarbank: 6 Runden mit allen drei Stufen-Varianten', () => {
  assert.equal(daten.runden.length, 6);
  const ids = daten.runden.map((r) => r.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const r of daten.runden) {
    for (const s of ['ruhig', 'gereizt', 'heiss']) {
      assert.ok(r[s]?.length >= 15, `${r.id}: Variante ${s} fehlt`);
    }
  }
  assert.ok(daten.lektionen.length >= 4, 'mindestens 4 Lektionen');
  assert.ok(JSON.stringify(daten.lektionen).includes('DSA'), 'DSA-Meldeweg muss vorkommen');
});
