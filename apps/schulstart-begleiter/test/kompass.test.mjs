import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { alleIndikatorIds, alleStufenIds } from '../logik.mjs';
import { KOFFER_ART, packeKoffer, pruefeKoffer, vereinigeKoffer } from '../kompass.mjs';

const katalog = JSON.parse(await readFile(new URL('../daten/indikatoren.json', import.meta.url), 'utf8'));
const IDS = alleIndikatorIds(katalog);
const STUFEN = alleStufenIds(katalog);
const opt = { indikatorIds: IDS, stufenIds: STUFEN };

test('packeKoffer/pruefeKoffer: Roundtrip gültig, eigene Art', () => {
  const daten = { kinder: ['AB'], beobachtungen: { AB: { [IDS[0]]: STUFEN[0] } } };
  const json = JSON.parse(packeKoffer(daten));
  assert.equal(json.art, KOFFER_ART);
  assert.deepEqual(pruefeKoffer(json, opt), []);
});

test('pruefeKoffer: lehnt fremde Art, lange Kürzel, unbekannte Stufe ab', () => {
  assert.ok(pruefeKoffer(null).length >= 1);
  assert.ok(pruefeKoffer({ art: 'entwicklungs-kompass-daten', version: 1, kinder: [], beobachtungen: {} }).some((f) => /Schulstart-Begleiter-Datei/.test(f)));
  assert.ok(pruefeKoffer({ art: KOFFER_ART, version: 1, kinder: ['LANG'], beobachtungen: {} }, opt).some((f) => /Kürzel/.test(f)));
  assert.ok(pruefeKoffer({ art: KOFFER_ART, version: 1, kinder: ['AB'], beobachtungen: { AB: { [IDS[0]]: 'xxx' } } }, opt).some((f) => /Stufe/.test(f)));
  assert.ok(pruefeKoffer({ art: KOFFER_ART, version: 1, kinder: ['AB'], beobachtungen: { AB: { 'nix-1': STUFEN[0] } } }, opt).some((f) => /Unbekannter Indikator/.test(f)));
});

test('vereinigeKoffer: eigene Beobachtungen haben Vorrang, Import füllt Lücken', () => {
  const laufend = { kinder: ['AB'], beobachtungen: { AB: { [IDS[0]]: STUFEN[2] } } };
  const importiert = { kinder: ['AB', 'CD'], beobachtungen: { AB: { [IDS[0]]: STUFEN[0], [IDS[1]]: STUFEN[1] }, CD: { [IDS[0]]: STUFEN[0] } } };
  const v = vereinigeKoffer(laufend, importiert);
  assert.deepEqual(v.kinder, ['AB', 'CD']);
  assert.equal(v.beobachtungen.AB[IDS[0]], STUFEN[2], 'eigener Wert bleibt');
  assert.equal(v.beobachtungen.AB[IDS[1]], STUFEN[1], 'Lücke gefüllt');
  assert.equal(v.beobachtungen.CD[IDS[0]], STUFEN[0], 'neues Kind übernommen');
  // Original unverändert
  assert.equal(laufend.kinder.length, 1);
});

test('vereinigeKoffer: ohne laufenden Stand wird Import übernommen', () => {
  const importiert = { kinder: ['EF'], beobachtungen: { EF: { [IDS[0]]: STUFEN[0] } } };
  const v = vereinigeKoffer(null, importiert);
  assert.deepEqual(v.kinder, ['EF']);
  assert.equal(v.beobachtungen.EF[IDS[0]], STUFEN[0]);
});
