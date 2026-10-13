import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { BEISPIEL_SCHLUESSEL, GATTUNG_SCHLUESSEL, gattungFuer, kartenFuer, pruefeDaten, quelleTextVon } from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/karten.json', import.meta.url), 'utf8'));
const kopie = (x) => JSON.parse(JSON.stringify(x));

test('die Daten sind in Ordnung', () => {
  assert.deepEqual(pruefeDaten(daten), []);
});

test('dreizehn Gattungen, jede mit Seitenangabe aus S. 81–86', () => {
  assert.equal(daten.gattungen.length, 13);
  for (const g of daten.gattungen) {
    assert.match(g.quelle, /^S\. (8[1-6])(–\d+)?(, S\. \d+(–\d+)?)*$/, g.id);
  }
});

test('jedes Beispiel ist ein Titel mit Seite 81–86 und trägt keine Autoren- oder Notenangabe', () => {
  for (const g of daten.gattungen) {
    for (const b of g.beispiele) {
      assert.deepEqual(Object.keys(b).sort(), [...BEISPIEL_SCHLUESSEL].sort(), `${g.id} ${b.titel}`);
      assert.match(b.seite, /^S\. (8[1-6])$/, `${g.id} ${b.titel}`);
      assert.doesNotMatch(b.titel, /(^|[\s,(«])(муз|сл|обр)\./u, b.titel);
    }
  }
});

test('keine Karte nennt Dauer, Gruppengröße oder Ort – die Quelle nennt sie nicht', () => {
  for (const g of daten.gattungen) {
    for (const s of Object.keys(g)) assert.ok(GATTUNG_SCHLUESSEL.includes(s), `${g.id}: ${s}`);
  }
  assert.match(daten.nichtInDerQuelle, /Dauer, Gruppengröße und Ort stehen in der Quelle nicht/);
});

test('keine Gesamtzahl im Text; die Abweichung nennt den Katalog und die Zählregel', () => {
  const text = JSON.stringify(daten.gattungen) + daten.hinweis;
  assert.doesNotMatch(text, /ca\. \d+|rund \d+|insgesamt \d+/i);
  assert.match(daten.quelle.abweichung, /ca\. 50/);
  assert.match(daten.quelle.abweichung, /Zählregel/);
});

test('der Filter nach Gattung liefert genau die gewählte Karte', () => {
  assert.equal(kartenFuer(daten).length, 13);
  assert.deepEqual(kartenFuer(daten, { gattung: 'g07' }).map((g) => g.id), ['g07']);
  assert.equal(gattungFuer(daten, 'g07').gattung, 'Reigen (Хороводы)');
  assert.equal(gattungFuer(daten, 'zz'), null);
});

test('die Quellenzeile nennt die Seite der Gattung', () => {
  assert.equal(quelleTextVon(daten.gattungen[6]), 'Quelle: S. 83');
});

test('ein Feld „dauer“ wird abgewiesen', () => {
  const d = kopie(daten);
  d.gattungen[0].dauer = '10 Minuten';
  assert.ok(pruefeDaten(d).some((f) => /dauer.*nennt diese Angabe bei den Spielen nicht/.test(f)));
});

test('ein Autor im Titel eines Beispiels wird abgewiesen', () => {
  const d = kopie(daten);
  d.gattungen[2].beispiele[0].titel = 'Сорока, муз. Иванова';
  assert.ok(pruefeDaten(d).some((f) => /Autoren- oder Notenangabe/.test(f)));
});

test('eine Zählung im Prinzip wird abgewiesen', () => {
  const d = kopie(daten);
  d.gattungen[0].prinzip = 'Ca. 50 Spielprinzipien sind hier zusammengefasst, und jedes ist eigen formuliert.';
  assert.ok(pruefeDaten(d).some((f) => /enthält eine Zählung/.test(f)));
});

test('ein Beispiel ohne Seite wird abgewiesen', () => {
  const d = kopie(daten);
  d.gattungen[2].beispiele[0].seite = '';
  assert.ok(pruefeDaten(d).some((f) => /ohne Seite/.test(f)));
});

test('zu wenige Gattungen werden abgewiesen', () => {
  const d = kopie(daten);
  d.gattungen = d.gattungen.slice(0, 5);
  assert.ok(pruefeDaten(d).some((f) => /5 Gattungen/.test(f)));
});
