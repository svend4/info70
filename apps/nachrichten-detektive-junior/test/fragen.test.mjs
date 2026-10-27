import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pruefeFragen } from '../../../packages/quiz-kern/src/schema.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/fragen.json', import.meta.url), 'utf8'));

test('Fragenbank: quiz-kern-Schema gültig, genug für eine volle Runde', () => {
  assert.deepEqual(pruefeFragen(daten, { mindestFragen: 12 }), []);
  assert.ok(daten.fragen.length >= 12, `mindestens 12 Fragen (ist: ${daten.fragen.length})`);
});

test('Zielgruppe 6-8, nur binaer (für die Kleinen), keine Ränge in den Daten', () => {
  assert.equal(daten.zielgruppe, '6-8');
  assert.ok(daten.fragen.every((f) => f.typ === 'binaer'), 'nur Ja/Nein für 6-8');
  assert.equal(daten.raenge, undefined, 'kein Kind wird eingestuft');
});

test('didaktische Balance: echt und ausgedacht kommen etwa gleich oft vor', () => {
  const echt = daten.fragen.filter((f) => f.korrekt === 'ja').length;
  const ausgedacht = daten.fragen.filter((f) => f.korrekt === 'nein').length;
  assert.ok(echt >= 4 && ausgedacht >= 4, 'beide Antworten häufig genug');
  assert.ok(Math.abs(echt - ausgedacht) <= 2, 'kein starres Muster');
});

test('Lernkern „Kann das wirklich sein?“ und kurze Sätze', () => {
  const alles = JSON.stringify(daten.fragen);
  assert.match(alles, /Kann das wirklich sein|ausgedacht|erfunden|Computer/, 'Prüf-Frage/Konzept vorhanden');
  for (const f of daten.fragen) {
    assert.ok(f.aussage.length <= 100, `${f.id}: Aussage für 6-8 zu lang`);
  }
});

test('der App-Code wertet nichts und speichert nichts (keine Karte, kein Löschknopf)', async () => {
  const code = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');
  assert.doesNotMatch(code, /ergebnisSatz|Geschafft|localStorage|setItem|datenKarte|Meine Daten/);
  assert.match(code, /^\s*rekordSchluessel: 'ndj\.rekord',\s*$/m, 'alter Schlüssel nur für die einmalige Entfernung');
});
