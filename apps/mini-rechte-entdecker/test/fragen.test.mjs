import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pruefeFragen } from '../../../packages/quiz-kern/src/schema.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/fragen.json', import.meta.url), 'utf8'));

test('Fragenbank: Schema gültig (quiz-kern)', () => {
  assert.deepEqual(pruefeFragen(daten, { mindestFragen: 8, mindestErklaerung: 20 }), []);
});

test('für die Kleinen (6-8): NUR binaer, keine Wahl-Fragen', () => {
  assert.ok(daten.fragen.every((f) => f.typ === 'binaer'), 'ab 6 nur Ja/Nein');
});

test('didaktische Balance: beide Antworten kommen vor', () => {
  const antworten = new Set(daten.fragen.map((f) => f.korrekt));
  assert.ok(antworten.has('ja') && antworten.has('nein'), 'sonst lernt das Kind "immer ja"');
});

test('kurze, ermutigende Erklärungen (Leichte Sprache), keine Scham', () => {
  for (const f of daten.fragen) {
    assert.ok(f.aussage.length <= 90, `${f.id}: Aussage zu lang für 6-8`);
    const saetze = f.erklaerung.split(/(?<=[.!?])\s+/).filter((s) => /\w/.test(s));
    const maxWorte = Math.max(...saetze.map((s) => s.split(/\s+/).length));
    assert.ok(maxWorte <= 12, `${f.id}: Erklärungs-Satz zu lang (${maxWorte} Wörter)`);
    assert.ok(!/dumm|falsch gemacht/i.test(f.erklaerung), `${f.id}: kein Scham-Ton`);
  }
});

test('die wichtigsten Rechte sind abgedeckt', () => {
  const kats = new Set(daten.fragen.map((f) => f.kategorie));
  for (const pflicht of ['Schutz', 'Privat', 'Spiel', 'Meinung']) {
    assert.ok(kats.has(pflicht), `Recht fehlt: ${pflicht}`);
  }
  const alles = JSON.stringify(daten.fragen).toLowerCase();
  assert.match(alles, /hilfe|erwachsene/, 'Hilfe holen ist stark');
});

test('Kinder werden nicht bewertet: die Daten haben keine Ränge', () => {
  assert.ok(!('raenge' in daten), 'keine Rang- oder Punkteschwellen in den Daten');
});

test('App-Code und Eltern-Seite: keine Wertung, kein Speicher, keine Karte „Meine Daten löschen“', async () => {
  const code = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');
  const eltern = await readFile(new URL('../eltern.html', import.meta.url), 'utf8');
  assert.doesNotMatch(code, /ergebnisSatz|raenge|Geschafft/, 'kein Ergebnissatz, keine Ränge, kein „Geschafft“');
  assert.doesNotMatch(code, /setItem|datenKarte|daten-karte/, 'die App speichert nichts und hat keine Löschkarte');
  assert.match(code, /^\s*rekordSchluessel: '[^']+',\s*$/m, 'der alte Schlüssel steht nur für die einmalige Entfernung beim Start');
  assert.doesNotMatch(eltern, /Meine Daten löschen|löschbar|löschen/, 'ohne Speicher kein Löschknopf');
});
