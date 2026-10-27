import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pruefeFragen } from '../../../packages/quiz-kern/src/schema.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/fragen.json', import.meta.url), 'utf8'));

test('Fragenbank: Schema gültig (quiz-kern)', () => {
  assert.deepEqual(pruefeFragen(daten, { mindestFragen: 16 }), []);
});

test('didaktische Balance: beide binaer-Antworten kommen vor', () => {
  const antworten = new Set(daten.fragen.filter((f) => f.typ === 'binaer').map((f) => f.korrekt));
  assert.ok(antworten.has('ja') && antworten.has('nein'), 'sonst lernt das Kind "alles ist Köder" statt Prüfen');
});

test('inhaltliche Abdeckung: Warnzeichen und Handlungswissen sind dabei', () => {
  const warnzeichen = daten.fragen.filter((f) => f.kategorie === 'Warnzeichen');
  assert.ok(warnzeichen.length >= 3, 'die 3 Köder-Warnzeichen (Absender, Druck, Link/Anhang) brauchen eigene Fragen');
  const handeln = daten.fragen.filter((f) => f.kategorie === 'Richtig handeln');
  assert.ok(handeln.length >= 3, 'was tun: nie klicken, Erwachsenen zeigen, offizielle App/Seite selbst öffnen');
  const typen = new Set(daten.fragen.map((f) => f.typ));
  assert.ok(typen.has('binaer') && typen.has('wahl'), 'Mischung aus nachgestellten Nachrichten und Wissensfragen');
});

test('Kinder werden nicht bewertet: die Daten haben keine Ränge', () => {
  assert.ok(!('raenge' in daten), 'keine Rang- oder Punkteschwellen in den Daten');
});

test('App-Code und Eltern-Seite: keine Wertung, kein Speicher, keine Karte „Meine Daten löschen“', async () => {
  const code = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');
  const eltern = await readFile(new URL('../eltern.html', import.meta.url), 'utf8');
  assert.doesNotMatch(code, /ergebnisSatz|raenge|geschafft/i, 'kein Ergebnissatz, keine Ränge, kein „Geschafft“');
  assert.doesNotMatch(code, /setItem|datenKarte|daten-karte/, 'die App speichert nichts und hat keine Löschkarte');
  assert.doesNotMatch(eltern, /Meine Daten löschen|löschbar/, 'ohne Speicher kein Löschknopf');
});
