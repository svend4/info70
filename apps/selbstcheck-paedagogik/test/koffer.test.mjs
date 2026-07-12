import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { packeKoffer, pruefeKoffer, vereinigeKoffer, KOFFER_ART, KOFFER_VERSION } from '../koffer.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/fragen.json', import.meta.url), 'utf8'));
const aussageIds = daten.bereiche.flatMap((b) => b.aussagen.map((a) => a.id));
const stufenIds = daten.stufen.map((s) => s.id);

const status = { [aussageIds[0]]: 'voll', [aussageIds[7]]: 'eher-nicht' };

test('packeKoffer -> pruefeKoffer: Rundreise ist gültig', () => {
  const geparst = JSON.parse(packeKoffer(status));
  assert.equal(geparst.art, KOFFER_ART);
  assert.equal(geparst.version, KOFFER_VERSION);
  assert.deepEqual(pruefeKoffer(geparst, { aussageIds, stufenIds }), []);
  assert.deepEqual(geparst.status, status);
});

test('pruefeKoffer erkennt kaputte Dateien', () => {
  assert.ok(pruefeKoffer(null).length > 0);
  assert.ok(pruefeKoffer({ art: 'anders' }).length > 0);
  assert.ok(pruefeKoffer({ art: KOFFER_ART, version: 99, status: {} })
    .some((f) => f.includes('Version')));
  assert.ok(pruefeKoffer({ art: KOFFER_ART, version: KOFFER_VERSION, status: [] })
    .some((f) => f.includes('Antworten')));
  assert.ok(pruefeKoffer({ art: KOFFER_ART, version: KOFFER_VERSION, status: { fremd: 'voll' } }, { aussageIds, stufenIds })
    .some((f) => f.includes('Unbekannte Aussage')));
  assert.ok(pruefeKoffer({ art: KOFFER_ART, version: KOFFER_VERSION, status: { [aussageIds[0]]: 'super' } }, { aussageIds, stufenIds })
    .some((f) => f.includes('Ungültige Selbsteinschätzung')));
});

test('vereinigeKoffer: eigene Antworten behalten Vorrang, Import füllt Lücken', () => {
  const importiert = { [aussageIds[0]]: 'nicht', [aussageIds[1]]: 'eher' };
  const ergebnis = vereinigeKoffer(status, importiert);
  assert.equal(ergebnis[aussageIds[0]], 'voll', 'eigene Antwort bleibt');
  assert.equal(ergebnis[aussageIds[1]], 'eher', 'Lücke wird gefüllt');
  assert.equal(ergebnis[aussageIds[7]], 'eher-nicht', 'eigene Antwort bleibt erhalten');
  assert.deepEqual(status, { [aussageIds[0]]: 'voll', [aussageIds[7]]: 'eher-nicht' }, 'Original unverändert');
});

test('vereinigeKoffer: ohne laufenden Stand wird der Import übernommen (als Kopie)', () => {
  const ergebnis = vereinigeKoffer(null, status);
  assert.deepEqual(ergebnis, status);
  assert.notEqual(ergebnis, status, 'Kopie, keine Referenz');
});
