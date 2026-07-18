import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { NACHRICHTEN_TYPEN, baueTyp } from '../nachrichten.mjs';

const kataloge = JSON.parse(await readFile(new URL('../daten/sprachen.json', import.meta.url), 'utf8'));
const ALLE = ['de', 'en'];

test('Zwei Sprachen (de, en) vorhanden', () => {
  assert.deepEqual(Object.keys(kataloge).sort(), ALLE);
});

test('Vollständigkeit: alle Kataloge haben exakt dieselben Schlüssel', () => {
  const referenz = Object.keys(kataloge.de).sort();
  for (const code of ALLE) {
    assert.deepEqual(Object.keys(kataloge[code]).sort(), referenz, `Katalog ${code} weicht ab`);
  }
});

test('Platzhalter bleiben in jeder Sprache konsistent', () => {
  const mitPlatzhalter = ['experiment_starten', 'runde_status', 'erreicht_dich', 'ende_gestoppt', 'ende_alle'];
  for (const schluessel of mitPlatzhalter) {
    const ref = [...String(kataloge.de[schluessel]).matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
    for (const code of ALLE) {
      const ph = [...String(kataloge[code][schluessel]).matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
      assert.deepEqual(ph, ref, `${code}: Platzhalter in ${schluessel} weichen ab`);
    }
  }
});

test('Jeder Typ ist in jeder Sprache vollständig (Nachricht, Frage, Lernpunkte)', () => {
  for (const code of ALLE) {
    const t = (k) => kataloge[code][k];
    for (const struktur of NACHRICHTEN_TYPEN) {
      const typ = baueTyp(struktur, t);
      assert.ok(typ.titel && typ.intro && typ.nachricht && typ.frage, `${code}/${struktur.id}: Text fehlt`);
      assert.ok(typ.weiter && typ.stopp, `${code}/${struktur.id}: Optionen fehlen`);
      assert.ok(Array.isArray(typ.lernpunkte) && typ.lernpunkte.length >= 3, `${code}/${struktur.id}: zu wenige Lernpunkte`);
      if (struktur.hatMelden) assert.ok(typ.melden, `${code}/${struktur.id}: Melden-Option fehlt`);
      if (struktur.hatQuellen) assert.ok(typ.quellenHinweis, `${code}/${struktur.id}: Quellen-Hinweis fehlt`);
    }
  }
});

test('Hilfeadresse 116 111 in beiden Sprachen vorhanden', () => {
  for (const code of ALLE) {
    assert.ok(JSON.stringify(kataloge[code]).includes('116 111'), `${code}: Hilfeadresse fehlt`);
  }
});
