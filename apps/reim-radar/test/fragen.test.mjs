import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pruefeFragen } from '../../../packages/quiz-kern/src/schema.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/fragen.json', import.meta.url), 'utf8'));

test('Fragenbank: Schema gültig (quiz-kern)', () => {
  assert.deepEqual(pruefeFragen(daten, { mindestFragen: 12 }), []);
});

test('Mischung aus binär (Reim ja/nein) und Wahlfragen', () => {
  const typen = new Set(daten.fragen.map((f) => f.typ));
  assert.ok(typen.has('binaer') && typen.has('wahl'));
  const bin = daten.fragen.filter((f) => f.typ === 'binaer');
  const antworten = new Set(bin.map((f) => f.korrekt));
  assert.ok(antworten.has('ja') && antworten.has('nein'), 'sonst lernt das Kind "immer ja"');
});

test('inhaltliche Abdeckung: Reim, Anlaut, Wortlänge/Silben', () => {
  const kategorien = new Set(daten.fragen.map((f) => f.kategorie));
  assert.ok(kategorien.has('Reimwort finden') || kategorien.has('Reime hören'), 'Reime');
  assert.ok(kategorien.has('Anlaute hören'), 'Anlaute');
  assert.ok(kategorien.has('Wortlänge'), 'Wortlänge');
  assert.ok(kategorien.has('Silben klatschen'), 'Silben');
  const alles = JSON.stringify(daten.fragen).toLowerCase();
  assert.match(alles, /reim/, 'Reim thematisiert');
  assert.match(alles, /silbe/, 'Silben thematisiert');
});

test('Ränge sind in einer 8er-Runde erreichbar', () => {
  const maxAb = Math.max(...daten.raenge.map((r) => r.ab));
  assert.ok(maxAb <= 8, `höchster Rang (${maxAb}) in 8er-Runde erreichbar`);
  assert.ok(daten.fragen.length >= 12, 'genug Vorrat für Abwechslung');
});
