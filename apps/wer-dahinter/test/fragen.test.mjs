import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pruefeFragen } from '../../../packages/quiz-kern/src/schema.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/fragen.json', import.meta.url), 'utf8'));

test('Fragenbank: Schema gültig (quiz-kern)', () => {
  assert.deepEqual(pruefeFragen(daten, { mindestFragen: 10 }), []);
});

test('didaktische Balance: beide binaer-Antworten kommen vor', () => {
  const antworten = new Set(daten.fragen.filter((f) => f.typ === 'binaer').map((f) => f.korrekt));
  assert.ok(antworten.has('ja') && antworten.has('nein'), 'sonst lernt das Kind "immer ja/nein"');
});

test('Mischung aus Aussagen und Wissensfragen', () => {
  const typen = new Set(daten.fragen.map((f) => f.typ));
  assert.ok(typen.has('binaer') && typen.has('wahl'));
});

test('inhaltliche Abdeckung: die drei Transparenz-Merkmale', () => {
  const kat = (name) => daten.fragen.filter((f) => f.kategorie === name);
  assert.ok(kat('Autor').length >= 2, 'Autor');
  assert.ok(kat('Datum').length >= 2, 'Datum');
  assert.ok(kat('Quelle').length >= 2, 'Quelle');
  assert.ok(kat('Transparenz').length >= 2, 'Transparenz gesamt / Detektiv-Fragen');
});

test('die drei Detektiv-Fragen Wer/Wann/Woher werden explizit benannt', () => {
  const alles = JSON.stringify(daten.fragen).toLowerCase();
  assert.match(alles, /autor/, 'Autor (Wer)');
  assert.match(alles, /datum/, 'Datum (Wann)');
  assert.match(alles, /quelle/, 'Quelle (Woher)');
  assert.match(alles, /nachprüf|nachpruef/, 'Nachprüfbarkeit als Ziel');
  assert.match(alles, /weiterschick|weiterleit/, 'erst prüfen, dann weiterschicken');
});

test('Ränge sind mit einer 12er-Runde erreichbar', () => {
  const maxAb = Math.max(...daten.raenge.map((r) => r.ab));
  assert.ok(maxAb <= daten.fragen.length, 'höchster Rang muss im Fragen-Vorrat erreichbar sein');
  assert.ok(daten.fragen.length >= 12, 'genug Fragen für eine 12er-Runde');
});
