import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pruefeFragen } from '../../../packages/quiz-kern/src/schema.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/fragen.json', import.meta.url), 'utf8'));

test('Fragenbank: Schema gültig (quiz-kern)', () => {
  assert.deepEqual(pruefeFragen(daten, { mindestFragen: 12 }), []);
});

test('didaktische Balance: beide binaer-Antworten kommen vor', () => {
  const antworten = new Set(daten.fragen.filter((f) => f.typ === 'binaer').map((f) => f.korrekt));
  assert.ok(antworten.has('ja') && antworten.has('nein'), 'sonst lernt das Kind ein Muster statt Abwägen');
});

test('inhaltliche Abdeckung: Digital-Rechte und Hilfe-Angebot sind dabei', () => {
  const kategorien = new Set(daten.fragen.map((f) => f.kategorie));
  assert.ok(kategorien.has('Digital'), 'Kinderrechte im Netz (BzKJ-Fokus Demokratiefähigkeit digital)');
  assert.ok(kategorien.has('Mitbestimmung'), 'Beteiligung (Art. 12) muss vorkommen');
  const hilfe = daten.fragen.some((f) => JSON.stringify(f).includes('116 111'));
  assert.ok(hilfe, 'Nummer gegen Kummer (116 111) als konkretes Hilfeangebot');
});

test('Ränge sind mit einer 12er-Runde erreichbar', () => {
  const maxAb = Math.max(...daten.raenge.map((r) => r.ab));
  assert.ok(maxAb <= 12);
});
