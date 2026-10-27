import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pruefeFragen } from '../../../packages/quiz-kern/src/schema.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/fragen.json', import.meta.url), 'utf8'));

test('Fragenbank: quiz-kern-Schema gültig, genug für eine 12er-Runde', () => {
  assert.deepEqual(pruefeFragen(daten, { mindestFragen: 12 }), []);
  assert.ok(daten.fragen.length >= 12);
});

test('beide Welten vertreten: Kinderwelt und Seniorenwelt', () => {
  const kats = daten.fragen.map((f) => f.kategorie);
  assert.ok(kats.filter((k) => k === 'Kinderwelt').length >= 4, 'Kinderwelt-Fälle');
  assert.ok(kats.filter((k) => k === 'Seniorenwelt').length >= 4, 'Seniorenwelt-Fälle');
});

test('Kernbotschaft: dieselbe Masche bei Jung und Alt', () => {
  const alles = JSON.stringify(daten.fragen).toLowerCase();
  assert.match(alles, /enkeltrick/, 'Enkeltrick (Senioren)');
  assert.match(alles, /phishing/, 'Phishing');
  assert.match(alles, /gewinn|gewonnen/, 'Fake-Gewinn (Kinder & Senioren)');
  assert.match(alles, /druck|eile|countdown|sofort/, 'Druck/Eile als gemeinsames Warnzeichen');
  assert.match(alles, /derselbe|denselben|gleich|dieselbe masche/, 'gleiche Masche benannt');
});

test('Balance der binaer-Antworten', () => {
  const antworten = new Set(daten.fragen.filter((f) => f.typ === 'binaer').map((f) => f.korrekt));
  assert.ok(antworten.has('ja') && antworten.has('nein'));
});

test('Kinder werden nicht bewertet: die Daten haben keine Ränge, die 12er-Runde bleibt möglich', () => {
  assert.ok(!('raenge' in daten), 'keine Rang- oder Punkteschwellen in den Daten');
  assert.ok(daten.fragen.length >= 12);
});

test('App-Code und Eltern-Seite: keine Wertung, kein Speicher, keine Karte „Meine Daten löschen“', async () => {
  const code = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');
  const eltern = await readFile(new URL('../eltern.html', import.meta.url), 'utf8');
  assert.doesNotMatch(code, /ergebnisSatz|raenge|geschafft/i, 'kein Ergebnissatz, keine Ränge, kein „Geschafft“');
  assert.doesNotMatch(code, /setItem|datenKarte|daten-karte/, 'die App speichert nichts und hat keine Löschkarte');
  assert.doesNotMatch(eltern, /Meine Daten löschen|löschbar per Knopf/, 'ohne Speicher kein Löschknopf');
});
