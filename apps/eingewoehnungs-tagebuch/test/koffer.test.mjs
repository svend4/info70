import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { KOFFER_ART, packeKoffer, pruefeKoffer, vereinigeKoffer } from '../koffer.mjs';

const config = JSON.parse(await readFile(new URL('../daten/config.json', import.meta.url), 'utf8'));
const e = (tag, ampel) => ({ tag, phase: 'grundphase', ampel, trennung: 'keine' });

test('packeKoffer/pruefeKoffer: Roundtrip gültig, eigene Art', () => {
  const daten = { kinder: ['AB'], eintraege: { AB: [e(1, 'gut')] } };
  const json = JSON.parse(packeKoffer(daten));
  assert.equal(json.art, KOFFER_ART);
  assert.deepEqual(pruefeKoffer(json, { config }), []);
});

test('pruefeKoffer: lehnt fremde Art, lange Kürzel, ungültige Einträge ab', () => {
  assert.ok(pruefeKoffer(null).length >= 1);
  assert.ok(pruefeKoffer({ art: 'anderes', version: 1, kinder: [], eintraege: {} }).some((f) => /Eingewöhnungs-Tagebuch-Datei/.test(f)));
  assert.ok(pruefeKoffer({ art: KOFFER_ART, version: 1, kinder: ['LANG'], eintraege: {} }).some((f) => /Kürzel/.test(f)));
  assert.ok(pruefeKoffer({ art: KOFFER_ART, version: 1, kinder: ['AB'], eintraege: { AB: [{ tag: 1, phase: 'x', ampel: 'gut', trennung: 'keine' }] } }, { config }).some((f) => /Phase/.test(f)));
});

test('vereinigeKoffer: eigene Einträge haben Vorrang, Import füllt fehlende Kinder', () => {
  const laufend = { kinder: ['AB'], eintraege: { AB: [e(1, 'gut')] } };
  const importiert = { kinder: ['AB', 'CD'], eintraege: { AB: [e(1, 'schwer'), e(2, 'schwer')], CD: [e(1, 'gut')] } };
  const v = vereinigeKoffer(laufend, importiert);
  assert.deepEqual(v.kinder, ['AB', 'CD']);
  assert.equal(v.eintraege.AB.length, 1, 'eigene Einträge bleiben (kein Überschreiben)');
  assert.equal(v.eintraege.AB[0].ampel, 'gut');
  assert.equal(v.eintraege.CD.length, 1, 'neues Kind übernommen');
  assert.equal(laufend.kinder.length, 1, 'Original unverändert');
});
