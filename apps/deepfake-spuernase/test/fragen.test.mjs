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
  assert.ok(antworten.has('ja') && antworten.has('nein'), 'sonst lernt das Kind "alles ist KI"');
});

test('Mischung aus Aussagen und Wissensfragen', () => {
  const typen = new Set(daten.fragen.map((f) => f.typ));
  assert.ok(typen.has('binaer') && typen.has('wahl'));
});

test('inhaltliche Abdeckung: Prüfmerkmale, Quelle/Kennzeichnung, Richtig handeln', () => {
  const kat = (name) => daten.fragen.filter((f) => f.kategorie === name);
  assert.ok(kat('KI-Prüfmerkmale').length >= 4, 'konkrete Prüfmerkmale');
  assert.ok(kat('Quelle & Kennzeichnung').length >= 2, 'Quelle + KI-Kennzeichnungspflicht');
  assert.ok(kat('Richtig handeln').length >= 1, 'erst prüfen, dann teilen');
});

test('die konkreten KI-Prüfmerkmale + AI-Act-Kennzeichnung kommen vor', () => {
  const alles = JSON.stringify(daten.fragen).toLowerCase();
  assert.match(alles, /finger|hände|hand/, 'Hände/Finger');
  assert.match(alles, /licht|schatten/, 'Licht/Schatten');
  assert.match(alles, /text|schild|buchstab/, 'Text-Fehler');
  assert.match(alles, /quelle/, 'fehlende Quelle');
  assert.match(alles, /kennzeichn|ki-verordnung|eu-ki/, 'KI-Kennzeichnungspflicht (AI Act)');
  assert.match(alles, /weiterschick|weiterleit|teilen/, 'erst prüfen, dann teilen');
});

test('Ränge sind mit einer 12er-Runde erreichbar', () => {
  const maxAb = Math.max(...daten.raenge.map((r) => r.ab));
  assert.ok(maxAb <= daten.fragen.length);
  assert.ok(daten.fragen.length >= 12);
});
