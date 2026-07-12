import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const kataloge = JSON.parse(await readFile(new URL('../daten/sprachen.json', import.meta.url), 'utf8'));
const SPRACHEN = ['de', 'uk', 'ru'];
const THEMEN = ['katzen', 'fussball', 'weltraum', 'backen', 'dinos', 'musik'];

test('alle drei Sprachkataloge vorhanden', () => {
  assert.deepEqual(Object.keys(kataloge).sort(), [...SPRACHEN].sort());
});

test('alle Kataloge haben exakt dieselben Schlüssel (keine Übersetzungslücken)', () => {
  const referenz = Object.keys(kataloge.de).sort();
  for (const code of SPRACHEN) {
    assert.deepEqual(Object.keys(kataloge[code]).sort(), referenz, `Katalog ${code} weicht ab`);
  }
});

test('jedes Thema ist in jeder Sprache benannt, Platzhalter bleiben konsistent', () => {
  for (const code of SPRACHEN) {
    for (const th of THEMEN) {
      assert.ok(kataloge[code][`thema_${th}`]?.length >= 2, `${code}: thema_${th} fehlt`);
    }
    for (const schluessel of ['runde', 'blase_alarm', 'lektion_ergebnis', 'vorlage_1', 'vorlage_2', 'vorlage_3']) {
      const platzhalterDe = [...kataloge.de[schluessel].matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
      const platzhalter = [...kataloge[code][schluessel].matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
      assert.deepEqual(platzhalter, platzhalterDe, `${code}: Platzhalter in ${schluessel} weichen ab`);
    }
  }
});
