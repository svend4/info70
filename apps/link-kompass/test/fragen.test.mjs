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
  assert.ok(antworten.has('ja') && antworten.has('nein'), 'sonst lernt das Kind "immer ja"');
});

test('Mischung aus Aussagen und Wissensfragen', () => {
  const typen = new Set(daten.fragen.map((f) => f.typ));
  assert.ok(typen.has('binaer') && typen.has('wahl'));
});

test('inhaltliche Abdeckung: Link-Arten, Werbung, Vor dem Klicken', () => {
  const kat = (name) => daten.fragen.filter((f) => f.kategorie === name);
  assert.ok(kat('Link-Arten').length >= 3, 'die verschiedenen Link-Arten');
  assert.ok(kat('Werbung erkennen').length >= 1, 'Werbe-Links');
  assert.ok(kat('Vor dem Klicken').length >= 3, 'Prüf-Gewohnheiten');
});

test('die Link-Arten kommen vor: intern, extern gekennzeichnet, Download, App-Store', () => {
  const alles = JSON.stringify(daten.fragen).toLowerCase();
  assert.match(alles, /intern/, 'interner Link');
  assert.match(alles, /extern/, 'externer Link (gekennzeichnet)');
  assert.match(alles, /download|herunterladen/, 'Download');
  assert.match(alles, /app-store|app-store|installier/, 'App-Store');
  assert.match(alles, /werbung|anzeige/, 'Werbung gekennzeichnet');
  assert.match(alles, /adresse|url/, 'URL prüfen');
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
  assert.match(code, /^\s*rekordSchluessel: 'lk\.rekord',\s*$/m, 'der alte Schlüssel wird nur über die Migrationszeile genannt');
  assert.doesNotMatch(eltern, /Meine Daten löschen|löschbar per Knopf|in der App löschen/, 'ohne Speicher kein Löschknopf');
});
