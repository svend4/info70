import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pruefeFragen } from '../../../packages/quiz-kern/src/schema.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/fragen.json', import.meta.url), 'utf8'));

test('Fragenbank: Schema gültig (quiz-kern)', () => {
  assert.deepEqual(pruefeFragen(daten, { mindestFragen: 12 }), []);
});

test('Mischung binär/wahl; binär mit ja UND nein (Brücken UND falsche Freunde)', () => {
  const typen = new Set(daten.fragen.map((f) => f.typ));
  assert.ok(typen.has('binaer') && typen.has('wahl'));
  const bin = daten.fragen.filter((f) => f.typ === 'binaer');
  const antworten = new Set(bin.map((f) => f.korrekt));
  assert.ok(antworten.has('ja') && antworten.has('nein'), 'Brücken-Wörter (ja) UND falsche Freunde (nein)');
});

test('inhaltliche Abdeckung: Brücken-Wörter, falsche Freunde, Vielfalt', () => {
  const kategorien = new Set(daten.fragen.map((f) => f.kategorie));
  assert.ok(kategorien.has('Brücken-Wörter'), 'Kognate/Internationalismen');
  assert.ok(kategorien.has('Falsche Freunde'), 'falsche Freunde');
  assert.ok(kategorien.has('Vielfalt'), 'Mehrsprachigkeit als Stärke');
  const alles = JSON.stringify(daten.fragen);
  assert.match(alles, /Russisch/, 'Russisch benannt');
  assert.match(alles, /Ukrainisch/, 'Ukrainisch benannt');
  // Transliteration in Klammern für Nicht-Kyrillisch-Lesende
  assert.match(alles, /\([a-z' ]+\)/i, 'Transliteration angeboten');
});

test('bekannte falsche Freunde sind als „nein“ markiert (inhaltliche Korrektheit)', () => {
  const dom = daten.fragen.find((f) => /„Dom“/.test(f.aussage ?? ''));
  assert.ok(dom && dom.korrekt === 'nein', 'Dom ≠ дом (Haus) ist falscher Freund');
  const angel = daten.fragen.find((f) => /„Angel“/.test(f.aussage ?? ''));
  assert.ok(angel && angel.korrekt === 'nein', 'Angel ≠ ангел (Engel) ist falscher Freund');
});

test('Ränge in einer 11er-Runde erreichbar', () => {
  const maxAb = Math.max(...daten.raenge.map((r) => r.ab));
  assert.ok(maxAb <= 11);
  assert.ok(daten.fragen.length >= 12);
});
