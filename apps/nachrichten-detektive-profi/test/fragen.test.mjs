import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pruefeFragen } from '../../../packages/quiz-kern/src/schema.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/fragen.json', import.meta.url), 'utf8'));

test('Fragenbank: quiz-kern-Schema gültig, genug für eine 12er-Runde', () => {
  assert.deepEqual(pruefeFragen(daten, { mindestFragen: 12 }), []);
  assert.ok(daten.fragen.length >= 12, `mindestens 12 Fragen (ist: ${daten.fragen.length})`);
});

test('Zielgruppe 13-15, gemischte Typen, keine Ränge in den Daten', () => {
  assert.equal(daten.zielgruppe, '13-15');
  assert.ok(daten.fragen.some((f) => f.typ === 'wahl'), 'Profi-Stufe nutzt auch Mehrfachwahl');
  assert.ok(daten.fragen.some((f) => f.typ === 'binaer'), 'auch Ja/Nein dabei');
  assert.equal(daten.raenge, undefined, 'kein Kind wird eingestuft');
});

test('Profi-Themen abgedeckt: Deepfake, KI-Texte, Quellencheck', () => {
  const alles = JSON.stringify(daten.fragen);
  assert.match(alles, /Deepfake|Rückwärts-Bildersuche|Hände/, 'Deepfake-/Bildprüfung fehlt');
  assert.match(alles, /KI/, 'KI-Inhalte fehlen');
  assert.match(alles, /Quelle|Wer sagt das|Wo steht es|Wie alt/, 'Quellencheck fehlt');
});

test('wahl-Fragen: korrekt-Index zeigt auf eine gültige Antwort', () => {
  for (const f of daten.fragen.filter((x) => x.typ === 'wahl')) {
    assert.ok(f.korrekt >= 0 && f.korrekt < f.antworten.length, `${f.id}: korrekt-Index ungültig`);
    assert.ok(f.antworten.length >= 3, `${f.id}: 13-15 sollte 3 Optionen bieten`);
  }
});

test('der App-Code wertet nichts und speichert nichts (keine Karte, kein Löschknopf)', async () => {
  const code = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');
  assert.doesNotMatch(code, /ergebnisSatz|Geschafft|localStorage|setItem|datenKarte|Meine Daten/);
  assert.match(code, /^\s*rekordSchluessel: 'ndp\.rekord',\s*$/m, 'alter Schlüssel nur für die einmalige Entfernung');
});
