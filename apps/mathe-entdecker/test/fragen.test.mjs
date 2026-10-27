import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pruefeFragen } from '../../../packages/quiz-kern/src/schema.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/fragen.json', import.meta.url), 'utf8'));

test('Fragenbank: Schema gültig (quiz-kern)', () => {
  assert.deepEqual(pruefeFragen(daten, { mindestFragen: 12 }), []);
});

test('Mischung aus binär und Wahlfragen, binär mit ja UND nein', () => {
  const typen = new Set(daten.fragen.map((f) => f.typ));
  assert.ok(typen.has('binaer') && typen.has('wahl'));
  const bin = daten.fragen.filter((f) => f.typ === 'binaer');
  const antworten = new Set(bin.map((f) => f.korrekt));
  assert.ok(antworten.has('ja') && antworten.has('nein'), 'sonst lernt das Kind "immer ja"');
});

test('inhaltliche Abdeckung: Mengen, Zählen, Formen, Reihen/Muster', () => {
  const kategorien = new Set(daten.fragen.map((f) => f.kategorie));
  assert.ok(kategorien.has('Mengen'), 'Mengen (mehr/weniger/gleich)');
  assert.ok(kategorien.has('Zählen'), 'Zählen');
  assert.ok(kategorien.has('Formen'), 'Formen/Ecken');
  assert.ok(kategorien.has('Reihen'), 'Reihen/Muster');
  const alles = JSON.stringify(daten.fragen).toLowerCase();
  assert.match(alles, /ecke/, 'Ecken zählen (Figuren-Analyse)');
  assert.match(alles, /mehr|weniger|gleich/, 'Mengenvergleich');
});

test('Kinder werden nicht bewertet: die Daten haben keine Ränge, der Vorrat reicht für die 10er-Runde', () => {
  assert.ok(!('raenge' in daten), 'keine Rang- oder Punkteschwellen in den Daten');
  assert.ok(daten.fragen.length >= 12, 'genug Vorrat für Abwechslung');
});

test('App-Code und Eltern-Seite: keine Wertung, kein Speicher, keine Karte „Meine Daten löschen“', async () => {
  const code = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');
  const eltern = await readFile(new URL('../eltern.html', import.meta.url), 'utf8');
  assert.doesNotMatch(code, /ergebnisSatz|raenge|Geschafft/, 'kein Ergebnissatz, keine Ränge, kein „Geschafft“');
  assert.doesNotMatch(code, /setItem|datenKarte|daten-karte/, 'die App speichert nichts und hat keine Löschkarte');
  assert.match(code, /^\s*rekordSchluessel: '[^']+',\s*$/m, 'der alte Schlüssel steht nur für die einmalige Entfernung beim Start');
  assert.doesNotMatch(eltern, /Meine Daten löschen|löschbar|löschen/, 'ohne Speicher kein Löschknopf');
});
