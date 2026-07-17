import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pruefeLeichteSpracheAbdeckung } from '../../../packages/kinder-ui/js/leichte-sprache.mjs';

const kataloge = JSON.parse(await readFile(new URL('../daten/sprachen.json', import.meta.url), 'utf8'));
const ALLE = ['de', 'uk', 'ru', 'de-ls'];
const THEMEN = ['katzen', 'fussball', 'weltraum', 'backen', 'dinos', 'musik'];

test('drei Basissprachen plus Leichte Sprache (de-ls) vorhanden', () => {
  assert.deepEqual(Object.keys(kataloge).sort(), [...ALLE].sort());
});

test('alle Kataloge haben exakt dieselben Schlüssel (keine Übersetzungslücken)', () => {
  const referenz = Object.keys(kataloge.de).sort();
  for (const code of ALLE) {
    assert.deepEqual(Object.keys(kataloge[code]).sort(), referenz, `Katalog ${code} weicht ab`);
  }
});

test('jedes Thema ist in jeder Sprache benannt, Platzhalter bleiben konsistent', () => {
  for (const code of ALLE) {
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

test('Leichte Sprache (de-ls): vollständige Abdeckung des de-Katalogs (BFSG)', () => {
  const bericht = pruefeLeichteSpracheAbdeckung(kataloge);
  assert.deepEqual(Object.keys(bericht), ['de-ls'], 'genau eine Leichte-Sprache-Fassung');
  assert.deepEqual(bericht['de-ls'].fehlend, [], 'kein Schlüssel darf in Leichter Sprache fehlen');
  assert.deepEqual(bericht['de-ls'].ueberzaehlig, [], 'keine überzähligen Schlüssel');
});

test('Leichte Sprache ist wirklich einfacher: kurze Sätze in den Fließtexten', () => {
  // Kein perfekter Sprachtest, aber ein wirksamer Wächter gegen "de kopiert nach
  // de-ls": Die Leichte-Sprache-Regel "ein Gedanke pro Satz" hält Sätze kurz.
  const fliesstexte = ['start_intro', 'daten_hinweis', 'lektion_1', 'lektion_2', 'lektion_3', 'misch_erklaerung'];
  for (const schluessel of fliesstexte) {
    const lsText = kataloge['de-ls'][schluessel];
    const saetze = lsText.split(/(?<=[.!?])\s+/).filter((s) => /\w/.test(s));
    const maxWorte = Math.max(...saetze.map((s) => s.split(/\s+/).length));
    assert.ok(maxWorte <= 12, `de-ls/${schluessel}: längster Satz hat ${maxWorte} Wörter (Leichte Sprache: kurz halten)`);
    assert.notEqual(lsText, kataloge.de[schluessel], `de-ls/${schluessel}: darf nicht wörtlich wie de sein`);
  }
});
