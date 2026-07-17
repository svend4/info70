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
  assert.ok(antworten.has('ja') && antworten.has('nein'), 'sonst lernt das Kind "immer ja" statt Prüfen');
});

test('Mischung aus Aussagen und Wissensfragen', () => {
  const typen = new Set(daten.fragen.map((f) => f.typ));
  assert.ok(typen.has('binaer') && typen.has('wahl'), 'binaer + wahl');
});

test('inhaltliche Abdeckung: Pflicht, Finden, Fake-Erkennung', () => {
  const kat = (name) => daten.fragen.filter((f) => f.kategorie === name);
  assert.ok(kat('Warum Pflicht?').length >= 3, 'warum ein Impressum Pflicht ist');
  assert.ok(kat('Wo versteckt?').length >= 3, 'wo man es findet (Footer/Menü)');
  assert.ok(kat('Echt oder Fake?').length >= 3, 'echtes vs. Fake-Impressum');
});

test('Rechtsbezug und Kernbegriffe kommen vor (DDG/MStV, Footer, Adresse)', () => {
  const alles = JSON.stringify(daten.fragen);
  assert.match(alles, /§ 5|§ 18|Digitale-Dienste-Gesetz|Medienstaatsvertrag/, 'Rechtsgrundlage genannt');
  assert.match(alles, /Footer/, 'der übliche Ort wird benannt');
  assert.match(alles, /Adresse/, 'ladungsfähige Adresse als Pflichtangabe');
  assert.match(alles, /Warnzeichen|Warnsignal/, 'fehlendes Impressum als Warnzeichen');
});

test('Ränge sind mit einer 12er-Runde erreichbar', () => {
  const maxAb = Math.max(...daten.raenge.map((r) => r.ab));
  assert.ok(maxAb <= 12, 'höchster Rang muss in einer Runde erreichbar sein');
});
