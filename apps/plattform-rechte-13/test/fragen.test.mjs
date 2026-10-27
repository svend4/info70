import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pruefeFragen } from '../../../packages/quiz-kern/src/schema.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/fragen.json', import.meta.url), 'utf8'));

test('Fragenbank: Schema gültig (quiz-kern), genug für eine 12er-Runde', () => {
  assert.deepEqual(pruefeFragen(daten, { mindestFragen: 12 }), []);
  assert.ok(daten.fragen.length >= 12, `mindestens 12 Fragen (ist: ${daten.fragen.length})`);
});

test('Zielgruppe 13-15; Kinder werden nicht bewertet: die Daten haben keine Ränge', () => {
  assert.equal(daten.zielgruppe, '13-15');
  assert.ok(!('raenge' in daten), 'keine Rang- oder Punkteschwellen in den Daten');
  assert.ok(daten.fragen.length >= 12, 'genug Fragen für die 12er-Runde');
});

test('inhaltliche Abdeckung der konkreten Plattform-Rechte (Katalog Nr. 147)', () => {
  const text = JSON.stringify(daten.fragen);
  assert.match(text, /DSA.*Artikel 17|Artikel 17/, 'Begründung von Moderationsentscheidungen (DSA Art. 17)');
  assert.match(text, /Artikel 20/, 'Widerspruch/Beschwerde (DSA Art. 20)');
  assert.match(text, /Artikel 15/, 'Auskunftsrecht (DSGVO Art. 15)');
  assert.match(text, /Artikel 8/, 'Einwilligungsalter (DSGVO Art. 8)');
  assert.match(text, /16/, 'DE-Grenze 16 Jahre');
  assert.match(text, /Artikel 28/, 'Werbeverbot für Minderjährige (DSA Art. 28)');
  assert.match(text, /AI Act|KI-Verordnung/, 'KI-Kennzeichnung (AI Act)');
});

test('didaktische Balance: beide binaer-Antworten kommen vor', () => {
  const antworten = new Set(daten.fragen.filter((f) => f.typ === 'binaer').map((f) => f.korrekt));
  assert.ok(antworten.has('ja') && antworten.has('nein'));
});

test('App-Code und Eltern-Seite: keine Wertung, kein Speicher, keine Karte „Meine Daten löschen“', async () => {
  const code = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');
  const eltern = await readFile(new URL('../eltern.html', import.meta.url), 'utf8');
  assert.doesNotMatch(code, /ergebnisSatz|raenge|Geschafft/, 'kein Ergebnissatz, keine Ränge, kein „Geschafft“');
  assert.doesNotMatch(code, /setItem|datenKarte|daten-karte/, 'die App speichert nichts und hat keine Löschkarte');
  assert.match(code, /^\s*rekordSchluessel: 'pr13\.rekord',\s*$/m, 'der alte Schlüssel steht allein in einer Zeile (Migration)');
  assert.doesNotMatch(eltern, /Meine Daten löschen|löschbar/, 'ohne Speicher kein Löschknopf');
});
