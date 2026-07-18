import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { baueMeldetexte, baueProzessDoku, REIHENFOLGE } from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/meldewege.json', import.meta.url), 'utf8'));

test('Auslöser und Reaktionszeiten: eindeutige IDs, Kinder- und Doku-Text', () => {
  const ids = daten.ausloeser.map((a) => a.id);
  assert.equal(new Set(ids).size, ids.length, 'doppelte Auslöser-IDs');
  assert.ok(daten.ausloeser.length >= 5, 'genug Melde-Anlässe');
  for (const a of daten.ausloeser) assert.ok(a.name && a.kinder?.length >= 15, `${a.id}: Text fehlt`);
  // die zentralen Schutz-Anlässe müssen vorkommen
  for (const pflicht of ['mobbing', 'kontakt', 'inhalt']) assert.ok(ids.includes(pflicht), `Auslöser fehlt: ${pflicht}`);
  const rids = daten.reaktionszeiten.map((r) => r.id);
  assert.equal(new Set(rids).size, rids.length, 'doppelte Reaktionszeit-IDs');
});

test('i18n: de/uk/ru decken exakt dieselben Melde-Schlüssel ab (Vollständigkeit)', () => {
  assert.deepEqual(Object.keys(daten.melde_texte).sort(), ['de', 'ru', 'uk']);
  const deKeys = Object.keys(daten.melde_texte.de).sort();
  assert.deepEqual(deKeys, [...REIHENFOLGE].sort(), 'Schlüssel entsprechen der Reihenfolge');
  for (const code of ['uk', 'ru']) {
    assert.deepEqual(Object.keys(daten.melde_texte[code]).sort(), deKeys, `${code}: Schlüssel weichen von de ab`);
    for (const [k, wert] of Object.entries(daten.melde_texte[code])) {
      assert.ok(typeof wert === 'string' && wert.length >= 5, `${code}/${k}: Text fehlt`);
    }
  }
});

test('jede Sprache trägt die Hilfenummer 116 111 und die „kein Petzen“-Botschaft', () => {
  for (const code of ['de', 'uk', 'ru']) {
    assert.match(daten.melde_texte[code].hilfe, /116 111/, `${code}: Hilfenummer fehlt`);
    assert.ok(daten.melde_texte[code].kein_petzen.length >= 20, `${code}: kein-Petzen-Botschaft fehlt`);
  }
});

test('baueMeldetexte: nicht leerer Block je Sprache, mit Knopf und Hilfe', () => {
  for (const code of ['de', 'uk', 'ru']) {
    const block = baueMeldetexte(daten, code);
    assert.ok(block.includes(daten.melde_texte[code].knopf), 'Knopf-Text enthalten');
    assert.match(block, /116 111/, 'Hilfenummer enthalten');
    assert.ok(!/https?:\/\//.test(block), 'keine externen Links');
  }
});

test('baueProzessDoku: übernimmt Auswahl und nennt DSA/JuSchG + 116 111', () => {
  const doku = baueProzessDoku(daten, { gruende: ['mobbing', 'kontakt'], reaktion: '24h', bestaetigung: true, rueckmeldung: false, ansprechpartner: 'Redaktion Kinderseite' });
  assert.match(doku, /Beleidigung, Mobbing/, 'gewählter Auslöser erscheint');
  assert.match(doku, /Grooming/, 'zweiter Auslöser erscheint');
  assert.ok(!/Datenschutz-Problem/.test(doku), 'nicht gewählter Auslöser fehlt');
  assert.match(doku, /24 Stunden/, 'Reaktionszeit übernommen');
  assert.match(doku, /Eingangsbestätigung: ja/, 'Bestätigung ja');
  assert.match(doku, /Rückmeldung über das Ergebnis: nein/, 'Rückmeldung nein');
  assert.match(doku, /Redaktion Kinderseite/, 'Ansprechperson übernommen');
  assert.match(doku, /DSA Art\. 16/, 'DSA-Bezug');
  assert.match(doku, /JuSchG/, 'JuSchG-Bezug');
  assert.match(doku, /116 111/, 'Hilfeverweis');
});

test('baueProzessDoku: leere Konfiguration liefert trotzdem ein Grundgerüst', () => {
  const doku = baueProzessDoku(daten, {});
  assert.match(doku, /noch nicht festgelegt/, 'markiert offene Punkte');
  assert.match(doku, /116 111/, 'Hilfeverweis auch ohne Auswahl');
  assert.match(doku, /im Impressum benannt/, 'Fallback Ansprechperson');
});
