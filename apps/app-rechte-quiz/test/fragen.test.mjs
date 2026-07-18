import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pruefeFragen } from '../../../packages/quiz-kern/src/schema.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/fragen.json', import.meta.url), 'utf8'));

test('Fragenbank: Schema gültig (quiz-kern)', () => {
  assert.deepEqual(pruefeFragen(daten, { mindestFragen: 12 }), []);
});

test('didaktische Balance: es gibt passende UND unpassende Berechtigungen', () => {
  const bin = daten.fragen.filter((f) => f.typ === 'binaer' && f.kategorie === 'Passt das?');
  const antworten = new Set(bin.map((f) => f.korrekt));
  assert.ok(antworten.has('ja') && antworten.has('nein'), 'sonst lernt das Kind "immer Nein" statt Abgleichen');
});

test('Mischung aus Aussagen und Wissensfragen', () => {
  const typen = new Set(daten.fragen.map((f) => f.typ));
  assert.ok(typen.has('binaer') && typen.has('wahl'));
});

test('inhaltliche Abdeckung: die typischen Berechtigungen + Kern-Regel', () => {
  const alles = JSON.stringify(daten.fragen).toLowerCase();
  assert.match(alles, /mikrofon/, 'Mikrofon');
  assert.match(alles, /kamera/, 'Kamera');
  assert.match(alles, /standort/, 'Standort');
  assert.match(alles, /kontakte/, 'Kontakte');
  assert.match(alles, /passt.*aufgabe|aufgabe der app/, 'Abgleich mit der Aufgabe');
  assert.match(alles, /einstellungen.*wegnehmen|wieder wegnehmen/, 'Rechte sind rücknehmbar');
});

test('Ränge sind mit einer 12er-Runde erreichbar', () => {
  const maxAb = Math.max(...daten.raenge.map((r) => r.ab));
  assert.ok(maxAb <= daten.fragen.length);
  assert.ok(daten.fragen.length >= 12);
});
