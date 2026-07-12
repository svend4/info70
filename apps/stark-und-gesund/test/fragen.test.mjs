import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pruefeFragen } from '../../../packages/quiz-kern/src/schema.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/fragen.json', import.meta.url), 'utf8'));

test('Fragenbank: Schema gültig (quiz-kern), mindestens 16 Fragen', () => {
  assert.deepEqual(pruefeFragen(daten, { mindestFragen: 16 }), []);
});

test('didaktische Balance: beide binaer-Antworten kommen vor', () => {
  const antworten = new Set(daten.fragen.filter((f) => f.typ === 'binaer').map((f) => f.korrekt));
  assert.ok(antworten.has('ja') && antworten.has('nein'), 'sonst lernt das Kind ein Muster statt Abwägen');
});

test('didaktische Balance: es gibt binaer- UND wahl-Fragen', () => {
  const typen = new Set(daten.fragen.map((f) => f.typ));
  assert.ok(typen.has('binaer') && typen.has('wahl'), 'Mischung aus Stimmt/Stimmt-nicht und Auswahl');
});

test('inhaltliche Abdeckung: Kern-Themen gesunder Lebensstil sind dabei', () => {
  const kategorien = new Set(daten.fragen.map((f) => f.kategorie));
  assert.ok(kategorien.has('Schlaf'), 'Schlaf (9-11 Stunden) muss vorkommen');
  assert.ok(kategorien.has('Bewegung'), 'Bewegung (~60 Min/Tag) muss vorkommen');
  const alles = JSON.stringify(daten);
  assert.ok(alles.includes('Wasser'), 'Wasser als bester Durstlöscher muss vorkommen');
});

test('Bildschirm-Pausen bauen die Brücke zur Takt-Pause-App', () => {
  const bruecke = daten.fragen.some((f) => JSON.stringify(f).includes('Takt-Pause'));
  assert.ok(bruecke, 'Vernetzung mit der Selbstregulations-App der Werkstatt');
});

test('Ränge sind mit einer 12er-Runde erreichbar', () => {
  const maxAb = Math.max(...daten.raenge.map((r) => r.ab));
  assert.ok(maxAb <= 12);
});
