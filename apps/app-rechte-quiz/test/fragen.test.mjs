import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pruefeFragen } from '../../../packages/quiz-kern/src/schema.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/fragen.json', import.meta.url), 'utf8'));

test('Fragenbank: Schema gültig (quiz-kern)', () => {
  assert.deepEqual(pruefeFragen(daten, { mindestFragen: 12 }), []);
});

test('didaktische Balance: es gibt passende UND unpassende Berechtigungen', () => {
  const bin = daten.fragen.filter((f) => f.typ === 'binaer' && f.kategorie === 'Passt das?');
  const antworten = new Set(bin.map((f) => f.korrekt));
  assert.ok(antworten.has('ja') && antworten.has('nein'), 'sonst lernt das Kind "immer Nein" statt Abgleichen');
});

test('Mischung aus Aussagen und Wissensfragen', () => {
  const typen = new Set(daten.fragen.map((f) => f.typ));
  assert.ok(typen.has('binaer') && typen.has('wahl'));
});

test('inhaltliche Abdeckung: die typischen Berechtigungen + Kern-Regel', () => {
  const alles = JSON.stringify(daten.fragen).toLowerCase();
  assert.match(alles, /mikrofon/, 'Mikrofon');
  assert.match(alles, /kamera/, 'Kamera');
  assert.match(alles, /standort/, 'Standort');
  assert.match(alles, /kontakte/, 'Kontakte');
  assert.match(alles, /passt.*aufgabe|aufgabe der app/, 'Abgleich mit der Aufgabe');
  assert.match(alles, /einstellungen.*wegnehmen|wieder wegnehmen/, 'Rechte sind rücknehmbar');
});

test('Kinder werden nicht bewertet: die Daten haben keine Ränge, die 12er-Runde bleibt möglich', () => {
  assert.ok(!('raenge' in daten), 'keine Rang- oder Punkteschwellen in den Daten');
  assert.ok(daten.fragen.length >= 12);
});

test('App-Code und Eltern-Seite: keine Wertung, kein Speicher, keine Karte „Meine Daten löschen“', async () => {
  const code = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');
  const eltern = await readFile(new URL('../eltern.html', import.meta.url), 'utf8');
  assert.doesNotMatch(code, /ergebnisSatz|raenge|Geschafft/, 'kein Ergebnissatz, keine Ränge, kein „Geschafft“');
  assert.doesNotMatch(code, /setItem|datenKarte|daten-karte/, 'die App speichert nichts und hat keine Löschkarte');
  assert.doesNotMatch(eltern, /Meine Daten löschen|löschbar per Knopf/, 'ohne Speicher kein Löschknopf');
});
