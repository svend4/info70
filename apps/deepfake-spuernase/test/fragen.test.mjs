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
  assert.ok(antworten.has('ja') && antworten.has('nein'), 'sonst lernt das Kind "alles ist KI"');
});

test('Mischung aus Aussagen und Wissensfragen', () => {
  const typen = new Set(daten.fragen.map((f) => f.typ));
  assert.ok(typen.has('binaer') && typen.has('wahl'));
});

test('inhaltliche Abdeckung: Prüfmerkmale, Quelle/Kennzeichnung, Richtig handeln', () => {
  const kat = (name) => daten.fragen.filter((f) => f.kategorie === name);
  assert.ok(kat('KI-Prüfmerkmale').length >= 4, 'konkrete Prüfmerkmale');
  assert.ok(kat('Quelle & Kennzeichnung').length >= 2, 'Quelle + KI-Kennzeichnungspflicht');
  assert.ok(kat('Richtig handeln').length >= 1, 'erst prüfen, dann teilen');
});

test('die konkreten KI-Prüfmerkmale + AI-Act-Kennzeichnung kommen vor', () => {
  const alles = JSON.stringify(daten.fragen).toLowerCase();
  assert.match(alles, /finger|hände|hand/, 'Hände/Finger');
  assert.match(alles, /licht|schatten/, 'Licht/Schatten');
  assert.match(alles, /text|schild|buchstab/, 'Text-Fehler');
  assert.match(alles, /quelle/, 'fehlende Quelle');
  assert.match(alles, /kennzeichn|ki-verordnung|eu-ki/, 'KI-Kennzeichnungspflicht (AI Act)');
  assert.match(alles, /weiterschick|weiterleit|teilen/, 'erst prüfen, dann teilen');
});

test('die Daten kennen keine Ränge; der Vorrat reicht für eine 12er-Runde', () => {
  assert.equal(daten.raenge, undefined, 'kein Kind wird eingestuft');
  assert.ok(daten.fragen.length >= 12);
});

test('der App-Code wertet nichts und speichert nichts (keine Karte, kein Löschknopf)', async () => {
  const code = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');
  assert.doesNotMatch(code, /ergebnisSatz|Geschafft|localStorage|setItem|datenKarte|Meine Daten/);
  assert.match(code, /^\s*rekordSchluessel: 'dfs\.rekord',\s*$/m, 'alter Schlüssel nur für die einmalige Entfernung');
});
