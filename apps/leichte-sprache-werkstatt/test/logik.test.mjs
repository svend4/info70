import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { vorleseText, vorleseStuecke, pruefeLeichteSprache, alleBegriffe, MAX_SATZ } from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/arbeitsblaetter.json', import.meta.url), 'utf8'));
const blaetter = daten.blaetter;

test('Sammlung: mindestens 4 Arbeitsblätter, jedes mit Piktogramm und Bezug', () => {
  assert.ok(blaetter.length >= 4, 'zu wenige Arbeitsblätter');
  for (const b of blaetter) {
    assert.ok(b.id && b.titel && b.piktogramm && b.bezug, `Blatt unvollständig: ${b.id}`);
  }
});

test('Alle Blätter erfüllen die Leichte-Sprache-Regeln (kurze Sätze)', () => {
  for (const b of blaetter) {
    assert.deepEqual(pruefeLeichteSprache(b), [], `Regelverstoß in ${b.id}`);
  }
});

test('Jeder Satz ist kurz (Leichte Sprache)', () => {
  for (const b of blaetter) {
    for (const s of b.saetze) assert.ok(s.length <= MAX_SATZ, `zu lang in ${b.id}: ${s}`);
  }
});

test('Kernbegriffe Kettenbrief, Passwort und Algorithmus sind abgedeckt', () => {
  const begriffe = alleBegriffe(blaetter);
  for (const kern of ['kettenbrief', 'passwort', 'algorithmus']) {
    assert.ok(begriffe.includes(kern), `Kernbegriff fehlt: ${kern}`);
  }
});

test('vorleseText: enthält Titel, Begriffe und Aufgabe des Blatts', () => {
  const blatt = blaetter[0];
  const text = vorleseText(blatt);
  assert.match(text, new RegExp(blatt.titel));
  assert.match(text, /Aufgabe\./);
  assert.ok(vorleseStuecke(blatt).length >= 1 + blatt.begriffe.length + blatt.saetze.length);
});

test('pruefeLeichteSprache: findet einen zu langen Satz', () => {
  const kaputt = { titel: 'Test', begriffe: [{ wort: 'A', piktogramm: '🔑', erklaerung: 'kurz' }], saetze: ['x'.repeat(MAX_SATZ + 1), 'ok eins', 'ok zwei'] };
  assert.ok(pruefeLeichteSprache(kaputt).some((f) => /zu lang/.test(f)));
});

test('Alle referenzierten Stundenentwürfe existieren wirklich', async () => {
  for (const b of blaetter) {
    await assert.doesNotReject(
      access(new URL(`../../${b.bezug}/index.html`, import.meta.url)),
      `App fehlt: apps/${b.bezug}/`);
  }
});
