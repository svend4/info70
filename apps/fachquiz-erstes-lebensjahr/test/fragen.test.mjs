import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pruefeFragen } from '../../../packages/quiz-kern/src/schema.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/fragen.json', import.meta.url), 'utf8'));
// Seiten der Quelle, auf die sich das Quiz beruft: Kapitel S. 26–43, Einleitung S. 5.
const erlaubteSeiten = new Set([5, ...Array.from({ length: 18 }, (_, i) => 26 + i)]);

test('Fragenbank: quiz-kern-Schema gültig, genug für eine 10er-Runde', () => {
  assert.deepEqual(pruefeFragen(daten, { mindestFragen: 10 }), []);
  assert.ok(daten.fragen.length >= 10);
});

test('die Daten kennen keine Ränge; der Vorrat reicht für eine 10er-Runde', () => {
  assert.equal(daten.raenge, undefined, 'keine Einstufung');
  assert.ok(daten.fragen.length >= 10);
});

test('der App-Code wertet nichts und speichert nichts (keine Karte, kein Löschknopf)', async () => {
  const code = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');
  assert.doesNotMatch(code, /ergebnisSatz|Geschafft|localStorage|setItem|datenKarte|Meine Daten/);
  assert.match(code, /^\s*rekordSchluessel: 'fqel\.rekord',\s*$/m, 'alter Schlüssel nur für die einmalige Entfernung');
});

test('jede Erklärung nennt eine Seite der Quelle im erlaubten Bereich', () => {
  for (const f of daten.fragen) {
    const seiten = [...f.erklaerung.matchAll(/S\. (\d+)/g)].map((m) => Number(m[1]));
    assert.ok(seiten.length > 0, `${f.id}: keine Seitenangabe`);
    for (const s of seiten) assert.ok(erlaubteSeiten.has(s), `${f.id}: S. ${s} liegt außerhalb des Kapitels`);
  }
});

test('Zielgruppe Fachkräfte, kein Kinderbezug', () => {
  assert.equal(daten.zielgruppe, 'Fachkraefte');
  assert.match(daten.hinweis, /kein Test für ein Kind/);
});

test('die Widersprüche der Quelle stehen im Quiz, sie werden nicht geglättet', () => {
  const text = JSON.stringify(daten.fragen);
  assert.match(text, /S\. 34/);
  assert.match(text, /S\. 39/);
  assert.match(text, /nicht auf|nicht zusammenpassen/, 'Greifen-Widerspruch benannt');
});

test('keine Zahl als gesichert, die der Text nicht trägt', () => {
  // Die richtige Antwort zur Merkmalszahl ist 22; die Katalogzahl 25 steht nur als Gegenbeispiel da.
  const merkmale = daten.fragen.find((f) => f.id === 'f10');
  assert.equal(merkmale.antworten[merkmale.korrekt], '22');
  // Die Angabe „(4—20)“ bei den ersten Wörtern (S. 29) ist im Text nicht eindeutig: keine Frage darauf.
  assert.doesNotMatch(JSON.stringify(daten.fragen), /4—20|4-20/);
  assert.match(daten.quelle.abweichung, /22 Merkmale/);
});

test('beide ja/nein-Antworten kommen vor', () => {
  const antworten = new Set(daten.fragen.filter((f) => f.typ === 'binaer').map((f) => f.korrekt));
  assert.ok(antworten.has('ja') && antworten.has('nein'));
});
