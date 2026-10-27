import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pruefeFragen } from '../../../packages/quiz-kern/src/schema.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/fragen.json', import.meta.url), 'utf8'));

test('Fragenbank: Schema gültig (quiz-kern)', () => {
  assert.deepEqual(pruefeFragen(daten, { mindestFragen: 10 }), []);
});

test('didaktische Balance: beide binaer-Antworten kommen vor', () => {
  const antworten = new Set(daten.fragen.filter((f) => f.typ === 'binaer').map((f) => f.korrekt));
  assert.ok(antworten.has('ja') && antworten.has('nein'), 'sonst lernt das Kind "immer ja/nein"');
});

test('Mischung aus Aussagen und Wissensfragen', () => {
  const typen = new Set(daten.fragen.map((f) => f.typ));
  assert.ok(typen.has('binaer') && typen.has('wahl'));
});

test('inhaltliche Abdeckung: die drei Transparenz-Merkmale', () => {
  const kat = (name) => daten.fragen.filter((f) => f.kategorie === name);
  assert.ok(kat('Autor').length >= 2, 'Autor');
  assert.ok(kat('Datum').length >= 2, 'Datum');
  assert.ok(kat('Quelle').length >= 2, 'Quelle');
  assert.ok(kat('Transparenz').length >= 2, 'Transparenz gesamt / Detektiv-Fragen');
});

test('die drei Detektiv-Fragen Wer/Wann/Woher werden explizit benannt', () => {
  const alles = JSON.stringify(daten.fragen).toLowerCase();
  assert.match(alles, /autor/, 'Autor (Wer)');
  assert.match(alles, /datum/, 'Datum (Wann)');
  assert.match(alles, /quelle/, 'Quelle (Woher)');
  assert.match(alles, /nachprüf|nachpruef/, 'Nachprüfbarkeit als Ziel');
  assert.match(alles, /weiterschick|weiterleit/, 'erst prüfen, dann weiterschicken');
});

test('Kinder werden nicht bewertet: die Daten haben keine Ränge, die 12er-Runde bleibt möglich', () => {
  assert.ok(!('raenge' in daten), 'keine Rang- oder Punkteschwellen in den Daten');
  assert.ok(daten.fragen.length >= 12, 'genug Fragen für eine 12er-Runde');
});

test('App-Code und Eltern-Seite: keine Wertung, kein Speicher, keine Karte „Meine Daten löschen“', async () => {
  const code = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');
  const eltern = await readFile(new URL('../eltern.html', import.meta.url), 'utf8');
  assert.doesNotMatch(code, /ergebnisSatz|raenge|Geschafft/, 'kein Ergebnissatz, keine Ränge, kein „Geschafft“');
  assert.doesNotMatch(code, /setItem|datenKarte|daten-karte/, 'die App speichert nichts und hat keine Löschkarte');
  assert.doesNotMatch(eltern, /Meine Daten löschen|löschbar per Knopf|in der App löschen/, 'ohne Speicher kein Löschknopf');
});
