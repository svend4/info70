import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pruefeFragen } from '../../../packages/quiz-kern/src/schema.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/fragen.json', import.meta.url), 'utf8'));

test('Fragenbank: Schema gültig (quiz-kern)', () => {
  assert.deepEqual(pruefeFragen(daten, { mindestFragen: 12 }), []);
});

test('Mischung aus binär und Wahlfragen, binär mit ja UND nein', () => {
  const typen = new Set(daten.fragen.map((f) => f.typ));
  assert.ok(typen.has('binaer') && typen.has('wahl'));
  const bin = daten.fragen.filter((f) => f.typ === 'binaer');
  const antworten = new Set(bin.map((f) => f.korrekt));
  assert.ok(antworten.has('ja') && antworten.has('nein'), 'sonst lernt das Kind "immer ja"');
});

test('inhaltliche Abdeckung: Mengen, Zählen, Formen, Reihen/Muster', () => {
  const kategorien = new Set(daten.fragen.map((f) => f.kategorie));
  assert.ok(kategorien.has('Mengen'), 'Mengen (mehr/weniger/gleich)');
  assert.ok(kategorien.has('Zählen'), 'Zählen');
  assert.ok(kategorien.has('Formen'), 'Formen/Ecken');
  assert.ok(kategorien.has('Reihen'), 'Reihen/Muster');
  const alles = JSON.stringify(daten.fragen).toLowerCase();
  assert.match(alles, /ecke/, 'Ecken zählen (Figuren-Analyse)');
  assert.match(alles, /mehr|weniger|gleich/, 'Mengenvergleich');
});

test('Ränge sind in einer 10er-Runde erreichbar', () => {
  const maxAb = Math.max(...daten.raenge.map((r) => r.ab));
  assert.ok(maxAb <= 10, `höchster Rang (${maxAb}) in 10er-Runde erreichbar`);
  assert.ok(daten.fragen.length >= 12, 'genug Vorrat für Abwechslung');
});
