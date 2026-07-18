import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pruefeFragen } from '../../../packages/quiz-kern/src/schema.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/fragen.json', import.meta.url), 'utf8'));

test('Fragenbank: quiz-kern-Schema gültig, genug für eine 12er-Runde', () => {
  assert.deepEqual(pruefeFragen(daten, { mindestFragen: 12 }), []);
  assert.ok(daten.fragen.length >= 12);
});

test('beide Welten vertreten: Kinderwelt und Seniorenwelt', () => {
  const kats = daten.fragen.map((f) => f.kategorie);
  assert.ok(kats.filter((k) => k === 'Kinderwelt').length >= 4, 'Kinderwelt-Fälle');
  assert.ok(kats.filter((k) => k === 'Seniorenwelt').length >= 4, 'Seniorenwelt-Fälle');
});

test('Kernbotschaft: dieselbe Masche bei Jung und Alt', () => {
  const alles = JSON.stringify(daten.fragen).toLowerCase();
  assert.match(alles, /enkeltrick/, 'Enkeltrick (Senioren)');
  assert.match(alles, /phishing/, 'Phishing');
  assert.match(alles, /gewinn|gewonnen/, 'Fake-Gewinn (Kinder & Senioren)');
  assert.match(alles, /druck|eile|countdown|sofort/, 'Druck/Eile als gemeinsames Warnzeichen');
  assert.match(alles, /derselbe|denselben|gleich|dieselbe masche/, 'gleiche Masche benannt');
});

test('erreichbare Ränge und Balance der binaer-Antworten', () => {
  const maxAb = Math.max(...daten.raenge.map((r) => r.ab));
  assert.ok(maxAb <= daten.fragen.length);
  const antworten = new Set(daten.fragen.filter((f) => f.typ === 'binaer').map((f) => f.korrekt));
  assert.ok(antworten.has('ja') && antworten.has('nein'));
});
