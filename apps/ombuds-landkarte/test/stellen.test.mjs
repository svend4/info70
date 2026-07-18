import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { filtereStellen, themaHinweis } from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/stellen.json', import.meta.url), 'utf8'));

test('Stellen: genug Einträge, eindeutige IDs, Pflichtfelder', () => {
  assert.ok(daten.stellen.length >= 7);
  const ids = daten.stellen.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length, 'doppelte IDs');
  for (const s of daten.stellen) {
    assert.ok(s.name && s.ebene, `${s.id}: Name/Ebene fehlt`);
    assert.ok(s.wofuer?.length >= 40, `${s.id}: Wofür zu kurz`);
    assert.ok(s.soFindenSie?.length >= 30, `${s.id}: So-erreichen fehlt`);
    assert.ok(s.grundlage?.length >= 8, `${s.id}: Rechtsgrundlage fehlt`);
    assert.ok(Array.isArray(s.themen) && s.themen.length >= 1, `${s.id}: kein Thema`);
  }
});

test('Themen-Abdeckung: die zentralen Anlaufstellen sind vertreten', () => {
  const alles = JSON.stringify(daten.stellen);
  assert.match(alles, /§ 9a SGB VIII/, 'Ombudsstelle Jugendhilfe');
  assert.match(alles, /DSGVO Art\. 77/, 'Datenschutz-Beschwerde');
  assert.match(alles, /DSA|Digital Services Act/, 'Bundesnetzagentur/DSA');
  assert.match(alles, /jugendschutz\.net/, 'Melde-Stelle');
  assert.match(alles, /116 111/, 'Nummer gegen Kummer');
  assert.match(alles, /JMStV/, 'Jugendmedienschutz');
});

test('Jedes Filter-Thema hat mindestens eine Stelle und einen Wegweiser-Satz', () => {
  for (const t of daten.themen) {
    const treffer = filtereStellen(daten.stellen, t.code);
    assert.ok(treffer.length >= 1, `Thema ${t.code} hat keine Stelle`);
    assert.ok(themaHinweis(t.code).length >= 20, `Thema ${t.code}: Wegweiser-Satz fehlt`);
  }
});

test('filtereStellen: null zeigt alle, unbekanntes Thema zeigt keine', () => {
  assert.equal(filtereStellen(daten.stellen, null).length, daten.stellen.length);
  assert.equal(filtereStellen(daten.stellen, 'gibtsnicht').length, 0);
});
