import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { entropieBits, knackzeitText, kombiniere } from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/woerter.json', import.meta.url), 'utf8'));

test('Wörterbank: genau 3 Listen (Farbe/Tier/Ding) mit je 12 Wörtern', () => {
  assert.equal(daten.version, 1);
  assert.equal(daten.zielgruppe, '8-12');
  assert.equal(daten.listen.length, 3);
  assert.deepEqual(daten.listen.map((liste) => liste.id), ['farbe', 'tier', 'ding']);
  for (const liste of daten.listen) {
    assert.ok(liste.titel?.length >= 3, `${liste.id}: Titel fehlt`);
    assert.ok(liste.emoji?.length >= 1, `${liste.id}: Emoji fehlt`);
    assert.equal(liste.woerter.length, 12, `${liste.id}: genau 12 Wörter`);
  }
});

test('jedes Wort: großer Anfang, nur A-Z (auf jeder Tastatur tippbar), 3-12 Zeichen, einzigartig', () => {
  const alle = daten.listen.flatMap((liste) => liste.woerter);
  assert.equal(new Set(alle).size, alle.length, 'kein Wort doppelt (auch nicht über Listen hinweg)');
  for (const wort of alle) {
    assert.match(wort, /^[A-Z][a-z]{2,11}$/,
      `"${wort}" muss groß beginnen, nur a-z enthalten (keine Umlaute/Leerzeichen) und 3-12 Zeichen lang sein`);
  }
});

test('sogar die kürzeste Kombination ergibt einen grünen Passsatz', () => {
  const [farben, tiere, dinge] = daten.listen.map((liste) => liste.woerter);
  const kuerzestes = (liste) => liste.reduce((a, b) => (b.length < a.length ? b : a));
  const satz = kombiniere([kuerzestes(farben), kuerzestes(tiere), 7, kuerzestes(dinge)]);
  const bits = entropieBits(satz);
  assert.ok(satz.length >= 13, `kürzester Satz "${satz}" ist zu kurz`);
  assert.ok(bits > 75, `kürzester Satz "${satz}" hat nur ${bits} Bits`);
  assert.equal(knackzeitText(bits).stufe, 'gruen', `kürzester Satz "${satz}" muss grün sein`);
});

test('der Beispiel-Passsatz der Idee lässt sich aus der Bank bauen', () => {
  const [farben, tiere, dinge] = daten.listen.map((liste) => liste.woerter);
  assert.ok(farben.includes('Blauer'));
  assert.ok(tiere.includes('Dachs'));
  assert.ok(dinge.includes('Regenschirm'));
  assert.equal(kombiniere(['Blauer', 'Dachs', 42, 'Regenschirm']), 'BlauerDachs42Regenschirm');
});
