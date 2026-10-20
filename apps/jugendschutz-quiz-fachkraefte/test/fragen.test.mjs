import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pruefeFragen } from '../../../packages/quiz-kern/src/schema.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/fragen.json', import.meta.url), 'utf8'));

test('Fragenbank: quiz-kern-Schema gültig, genug für eine 12er-Runde', () => {
  assert.deepEqual(pruefeFragen(daten, { mindestFragen: 12 }), []);
  assert.ok(daten.fragen.length >= 12);
});

test('Zielgruppe Fachkräfte', () => {
  assert.equal(daten.zielgruppe, 'Fachkraefte');
});

test('inhaltliche Abdeckung der Fachkräfte-Themen (Katalog Nr. 188)', () => {
  const text = JSON.stringify(daten.fragen);
  assert.match(text, /USK/, 'USK-Kennzeichen');
  assert.match(text, /FSK/, 'FSK-Kennzeichen');
  assert.match(text, /Lootbox/, 'Lootboxen als Risiko');
  assert.match(text, /Chat|Fremdkontakt|Cybergrooming/, 'Chat-/Interaktionsrisiko');
  assert.match(text, /24a JuSchG|Vorsorge/, 'Plattform-Pflichten § 24a');
  assert.match(text, /Praxis-Tipp/, 'Praxis-Tipp für den Elternabend');
});

test('didaktische Balance: beide binaer-Antworten kommen vor', () => {
  const antworten = new Set(daten.fragen.filter((f) => f.typ === 'binaer').map((f) => f.korrekt));
  assert.ok(antworten.has('ja') && antworten.has('nein'));
});
