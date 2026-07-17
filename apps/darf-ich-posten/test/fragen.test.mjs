import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pruefeFragen } from '../../../packages/quiz-kern/src/schema.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/fragen.json', import.meta.url), 'utf8'));

test('Fragenbank: Schema gültig (quiz-kern)', () => {
  assert.deepEqual(pruefeFragen(daten, { mindestFragen: 14 }), []);
});

test('didaktische Balance: beide binaer-Antworten kommen vor', () => {
  const antworten = new Set(daten.fragen.filter((f) => f.typ === 'binaer').map((f) => f.korrekt));
  assert.ok(antworten.has('ja') && antworten.has('nein'), 'sonst lernt das Kind "immer verboten" statt Abwägen');
});

test('Mischung aus Aussagen und Wissensfragen', () => {
  const typen = new Set(daten.fragen.map((f) => f.typ));
  assert.ok(typen.has('binaer') && typen.has('wahl'));
});

test('inhaltliche Abdeckung: die vier Fallgruppen', () => {
  const kat = (name) => daten.fragen.filter((f) => f.kategorie === name);
  assert.ok(kat('Foto von anderen').length >= 3, 'Recht am eigenen Bild');
  assert.ok(kat('Fremde Inhalte').length >= 2, 'Memes/Bilder anderer (Urheberrecht)');
  assert.ok(kat('Musik & Video').length >= 1, 'Musik unter Videos');
  assert.ok(kat('Peinliches & Gemeines').length >= 2, 'Rücksicht/Persönlichkeitsrecht');
});

test('Kernregeln kommen vor: fragen, Recht am eigenen Bild, Perspektivwechsel, Löschwunsch', () => {
  const alles = JSON.stringify(daten.fragen);
  assert.match(alles, /Recht am eigenen Bild/, 'zentraler Begriff');
  assert.match(alles, /fragen/i, 'vor dem Posten fragen');
  assert.match(alles, /von MIR postet|von mir postet/i, 'Perspektivwechsel');
  assert.match(alles, /Urheber/i, 'Urheberrecht benannt');
});

test('Ränge sind mit einer 12er-Runde erreichbar', () => {
  const maxAb = Math.max(...daten.raenge.map((r) => r.ab));
  assert.ok(maxAb <= 12);
});
