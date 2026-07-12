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

test('Ränge sind mit einer 12er-Runde erreichbar', () => {
  const maxAb = Math.max(...daten.raenge.map((r) => r.ab));
  assert.ok(maxAb <= 12, 'höchster Rang (Hai-sicher) muss in einer Runde erreichbar sein');
});
