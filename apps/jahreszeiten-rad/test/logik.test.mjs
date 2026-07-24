import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { REIHENFOLGE, pruefeDaten, jahreszeitFuerMonat, naechste, lichtBalken, vergleicheTage } from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/jahreszeiten.json', import.meta.url), 'utf8'));
const von = (id) => daten.jahreszeiten.find((j) => j.id === id);

test('Daten gültig: 4 Jahreszeiten, 12 Monate lückenlos, 3 Tiere, Quiz', () => {
  assert.deepEqual(pruefeDaten(daten), []);
  const monate = daten.jahreszeiten.flatMap((j) => j.monate).sort((a, b) => a - b);
  assert.deepEqual(monate, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
});

test('Naturwissen stimmt: Tageslängen-Ordnung und Überwinterungs-Strategien', () => {
  assert.ok(von('sommer').tageslaengeStunden > von('fruehling').tageslaengeStunden);
  assert.ok(von('fruehling').tageslaengeStunden > von('winter').tageslaengeStunden);
  assert.ok(von('herbst').tageslaengeStunden > von('winter').tageslaengeStunden);
  // Strategien: Igel Winterschlaf, Schwalbe Zug, Eichhörnchen wach
  assert.match(von('winter').tiere.igel, /Winterschlaf/);
  assert.match(von('herbst').tiere.schwalbe, /Süden|Vogelzug/);
  assert.match(von('winter').tiere.eichhoernchen, /keinen Winterschlaf|Winterfell/);
});

test('jahreszeitFuerMonat: meteorologische Zuordnung', () => {
  assert.equal(jahreszeitFuerMonat(daten, 1).id, 'winter');
  assert.equal(jahreszeitFuerMonat(daten, 4).id, 'fruehling');
  assert.equal(jahreszeitFuerMonat(daten, 7).id, 'sommer');
  assert.equal(jahreszeitFuerMonat(daten, 10).id, 'herbst');
  assert.equal(jahreszeitFuerMonat(daten, 12).id, 'winter');
});

test('naechste: Rad läuft zyklisch in fester Reihenfolge', () => {
  assert.equal(naechste(daten, 'fruehling').id, 'sommer');
  assert.equal(naechste(daten, 'winter').id, 'fruehling');
  assert.deepEqual(REIHENFOLGE, ['fruehling', 'sommer', 'herbst', 'winter']);
});

test('lichtBalken: mehr Sonne im Sommer als im Winter', () => {
  const sommer = lichtBalken(von('sommer').tageslaengeStunden);
  const winter = lichtBalken(von('winter').tageslaengeStunden);
  const sonnen = (s) => [...s].filter((c) => c === '☀').length;
  assert.ok(sonnen(sommer) > sonnen(winter));
});

test('vergleicheTage: nennt Differenz und richtige Richtung', () => {
  const satz = vergleicheTage(von('sommer'), von('winter'));
  assert.match(satz, /Sommer.*8 Stunden länger.*Winter/);
});

test('Quiz-Antworten stimmen mit den Daten überein (Stichproben)', () => {
  const igelFrage = daten.quiz.find((q) => /Igel.*Winterschlaf/.test(q.frage));
  assert.equal(igelFrage.antworten[igelFrage.korrekt], 'Im Winter');
  const tageFrage = daten.quiz.find((q) => /am längsten/.test(q.frage));
  assert.equal(tageFrage.antworten[tageFrage.korrekt], 'Im Sommer');
});
