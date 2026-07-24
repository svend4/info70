import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { alleKriterien, ampel, bewerte, massnahmenKatalog, pruefeKriterien } from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/kriterien.json', import.meta.url), 'utf8'));

test('Kriterien-Katalog ist gültig: 4 Bereiche × 3 = 12 Kooperationsziele', () => {
  assert.deepEqual(pruefeKriterien(daten), []);
  assert.equal(daten.bereiche.length, 4);
  assert.equal(alleKriterien(daten.bereiche).length, 12);
});

test('Haltungs-Dimension (Eltern als Experten, Abschied von Belehrung) ist verankert', () => {
  const haltung = daten.bereiche.find((b) => b.id === 'haltung');
  assert.ok(haltung, 'Bereich haltung existiert');
  assert.ok(haltung.kriterien.some((k) => /Experten.*ihr Kind/.test(k.these)));
  const kaputt = structuredClone(daten);
  for (const b of kaputt.bereiche) for (const k of b.kriterien) k.these = k.these.replace(/Experten/g, 'Kenner');
  assert.ok(pruefeKriterien(kaputt).some((f) => f.includes('Experten')));
});

test('Selbstcheck bewertet Teampraxis, nie einzelne Kinder (kein Kind-Bezug in Thesen)', () => {
  for (const k of alleKriterien(daten.bereiche)) {
    assert.ok(k.these.startsWith('Wir ') || k.these.startsWith('Unsere ') || /^(Eltern|Familien|Kritik|Aufnahme|Tür|Entwicklungsgespräche)/.test(k.these),
      `These beschreibt Teampraxis: ${k.these}`);
  }
});

test('ampel: Grenzen 80 % grün, 50 % gelb, darunter rot', () => {
  assert.equal(ampel(24, 24), 'gruen');
  assert.equal(ampel(20, 24), 'gruen');   // 83 %
  assert.equal(ampel(19, 24), 'gelb');    // 79 %
  assert.equal(ampel(12, 24), 'gelb');    // genau 50 %
  assert.equal(ampel(11, 24), 'rot');
  assert.equal(ampel(0, 0), 'rot');
});

test('bewerte: alles „Trifft zu“ → grün überall, offen 0', () => {
  const antworten = Object.fromEntries(alleKriterien(daten.bereiche).map((k) => [k.id, 2]));
  const e = bewerte(antworten, daten.bereiche);
  assert.equal(e.gesamt.punkte, 24);
  assert.equal(e.gesamt.ampel, 'gruen');
  assert.ok(e.jeBereich.every((b) => b.ampel === 'gruen' && b.max === 6));
  assert.equal(e.offen, 0);
});

test('bewerte: gemischt → Bereichs-Ampeln unabhängig, offen zählt Unbeantwortete', () => {
  const ks = alleKriterien(daten.bereiche);
  const antworten = {};
  for (const k of ks) antworten[k.id] = k.bereichId === 'haltung' ? 0 : 2;
  delete antworten[ks.find((k) => k.bereichId === 'kennen').id];
  const e = bewerte(antworten, daten.bereiche);
  assert.equal(e.jeBereich.find((b) => b.id === 'haltung').ampel, 'rot');
  assert.equal(e.jeBereich.find((b) => b.id === 'informieren').ampel, 'gruen');
  assert.equal(e.jeBereich.find((b) => b.id === 'kennen').punkte, 4);
  assert.equal(e.offen, 1);
});

test('massnahmenKatalog: nur Kriterien < 2, mit Maßnahmen aus dem Datenbestand', () => {
  const ks = alleKriterien(daten.bereiche);
  const antworten = Object.fromEntries(ks.map((k) => [k.id, 2]));
  antworten.beschwerden = 0;
  antworten.verstaendlich = 1;
  const katalog = massnahmenKatalog(antworten, daten.bereiche);
  assert.deepEqual(katalog.map((m) => m.id).sort(), ['beschwerden', 'verstaendlich']);
  assert.ok(katalog.every((m) => m.massnahmen.length >= 2));
  assert.deepEqual(massnahmenKatalog(Object.fromEntries(ks.map((k) => [k.id, 2])), daten.bereiche), []);
});
