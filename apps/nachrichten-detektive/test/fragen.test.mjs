import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pruefeFragen } from '../../../packages/quiz-kern/src/schema.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/fragen.json', import.meta.url), 'utf8'));

test('Fragenbank: Schema gültig (quiz-kern)', () => {
  assert.deepEqual(pruefeFragen(daten, { mindestFragen: 20 }), []);
});

test('didaktische Balance: beide binaer-Antworten kommen vor', () => {
  const antworten = new Set(daten.fragen.filter((f) => f.typ === 'binaer').map((f) => f.korrekt));
  assert.ok(antworten.has('ja') && antworten.has('nein'), 'sonst lernt das Kind ein Muster statt Prüfen');
});

test('Werbe-Radar-Paket vorhanden (Pipeline-Idee 1)', () => {
  const werbung = daten.fragen.filter((f) => f.kategorie === 'Werbe-Radar');
  assert.ok(werbung.length >= 10, 'mindestens 10 Werbe-Radar-Fälle');
  const typen = new Set(werbung.map((f) => f.typ));
  assert.ok(typen.has('binaer') && typen.has('wahl'), 'beide Fragetypen auch im Werbe-Paket');
});

test('Ränge sind mit einer 12er-Runde erreichbar', () => {
  const maxAb = Math.max(...daten.raenge.map((r) => r.ab));
  assert.ok(maxAb <= 12, 'höchster Rang muss in einer Runde erreichbar sein');
});
