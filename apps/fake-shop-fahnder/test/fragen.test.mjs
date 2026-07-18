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
  assert.ok(antworten.has('ja') && antworten.has('nein'), 'sonst lernt das Kind "alles ist Fake" statt Prüfen');
});

test('Mischung aus Aussagen und Wissensfragen', () => {
  const typen = new Set(daten.fragen.map((f) => f.typ));
  assert.ok(typen.has('binaer') && typen.has('wahl'));
});

test('inhaltliche Abdeckung: Warnsignale, Echt/Fake, Richtig handeln', () => {
  const kat = (name) => daten.fragen.filter((f) => f.kategorie === name);
  assert.ok(kat('Warnsignale').length >= 3, 'die Fake-Shop-Warnsignale');
  assert.ok(kat('Echt oder Fake').length >= 2, 'auch echte Shops zum Kontrast');
  assert.ok(kat('Richtig handeln').length >= 2, 'was tun: fragen, nachschlagen, keine Daten');
});

test('die fünf Kern-Warnsignale kommen vor', () => {
  const alles = JSON.stringify(daten.fragen).toLowerCase();
  assert.match(alles, /zu günstig|viel zu günstig|39 euro/, 'unrealistischer Preis');
  assert.match(alles, /impressum/, 'kein Impressum');
  assert.match(alles, /vorkasse/, 'nur Vorkasse');
  assert.match(alles, /siegel/, 'Fantasie-Gütesiegel');
  assert.match(alles, /countdown|nur heute|zeitdruck/, 'Druck-Countdown');
});

test('Ränge sind mit einer 12er-Runde erreichbar', () => {
  const maxAb = Math.max(...daten.raenge.map((r) => r.ab));
  assert.ok(maxAb <= 12);
});
