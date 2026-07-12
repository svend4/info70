import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { packeKoffer, pruefeKoffer, vereinigeKoffer, KOFFER_ART, KOFFER_VERSION } from '../kompass.mjs';
import { alleIndikatorIds, alleStufenIds } from '../logik.mjs';

const katalog = JSON.parse(await readFile(new URL('../daten/indikatoren.json', import.meta.url), 'utf8'));
const indikatorIds = alleIndikatorIds(katalog);
const stufenIds = alleStufenIds(katalog);
const opt = { indikatorIds, stufenIds };

const daten = {
  kinder: ['AB', 'CD'],
  beobachtungen: {
    AB: { [indikatorIds[0]]: 'sicher', [indikatorIds[6]]: 'manchmal' },
    CD: { [indikatorIds[1]]: 'noch-nicht' },
  },
};

test('packeKoffer -> pruefeKoffer: Rundreise ist gültig', () => {
  const geparst = JSON.parse(packeKoffer(daten));
  assert.equal(geparst.art, KOFFER_ART);
  assert.equal(geparst.version, KOFFER_VERSION);
  assert.deepEqual(pruefeKoffer(geparst, opt), []);
  assert.deepEqual(geparst.kinder, ['AB', 'CD']);
  assert.deepEqual(geparst.beobachtungen.AB, daten.beobachtungen.AB);
});

test('pruefeKoffer erkennt kaputte Dateien', () => {
  assert.ok(pruefeKoffer(null).length > 0);
  assert.ok(pruefeKoffer({ art: 'anders' }).length > 0);
  assert.ok(pruefeKoffer({ art: KOFFER_ART, version: 99, kinder: [], beobachtungen: {} })
    .some((f) => f.includes('Version')));
  assert.ok(pruefeKoffer({ art: KOFFER_ART, version: KOFFER_VERSION, kinder: {}, beobachtungen: {} })
    .some((f) => f.includes('Kürzel-Liste')));
  assert.ok(pruefeKoffer({ art: KOFFER_ART, version: KOFFER_VERSION, kinder: [], beobachtungen: [] })
    .some((f) => f.includes('Beobachtungen')));
});

test('pruefeKoffer lehnt Namen ab (Kürzel über 3 Zeichen) - keine Namen über Import', () => {
  const mitName = { art: KOFFER_ART, version: KOFFER_VERSION, kinder: ['Annika'], beobachtungen: {} };
  assert.ok(pruefeKoffer(mitName, opt).some((f) => f.includes('Ungültiges Kürzel')));
  const nameInBeob = { art: KOFFER_ART, version: KOFFER_VERSION, kinder: [], beobachtungen: { 'Max Meier': {} } };
  assert.ok(pruefeKoffer(nameInBeob, opt).some((f) => f.includes('Ungültiges Kürzel in Beobachtungen')));
});

test('pruefeKoffer prüft Indikatoren und Stufen mit', () => {
  const fremderIndikator = { art: KOFFER_ART, version: KOFFER_VERSION, kinder: ['AB'], beobachtungen: { AB: { erfunden: 'sicher' } } };
  assert.ok(pruefeKoffer(fremderIndikator, opt).some((f) => f.includes('Unbekannter Indikator')));
  const falscheStufe = { art: KOFFER_ART, version: KOFFER_VERSION, kinder: ['AB'], beobachtungen: { AB: { [indikatorIds[0]]: 'toll' } } };
  assert.ok(pruefeKoffer(falscheStufe, opt).some((f) => f.includes('Ungültige Stufe')));
});

test('vereinigeKoffer: Kürzel vereinigt, eigene Beobachtungen behalten Vorrang, Import füllt Lücken', () => {
  const importiert = {
    kinder: ['AB', 'EF'],
    beobachtungen: {
      AB: { [indikatorIds[0]]: 'noch-nicht', [indikatorIds[2]]: 'sicher' },
      EF: { [indikatorIds[3]]: 'manchmal' },
    },
  };
  const ergebnis = vereinigeKoffer(daten, importiert);
  assert.deepEqual(ergebnis.kinder, ['AB', 'CD', 'EF'], 'Kürzel vereinigt, keine Dubletten');
  assert.equal(ergebnis.beobachtungen.AB[indikatorIds[0]], 'sicher', 'eigene Beobachtung bleibt');
  assert.equal(ergebnis.beobachtungen.AB[indikatorIds[2]], 'sicher', 'Lücke wird gefüllt');
  assert.equal(ergebnis.beobachtungen.AB[indikatorIds[6]], 'manchmal', 'eigene Beobachtung bleibt erhalten');
  assert.equal(ergebnis.beobachtungen.EF[indikatorIds[3]], 'manchmal', 'neues Kind wird übernommen');
  // Original bleibt unverändert:
  assert.deepEqual(daten.kinder, ['AB', 'CD'], 'Original-Kürzel unverändert');
  assert.equal(daten.beobachtungen.AB[indikatorIds[2]], undefined, 'Original-Beobachtungen unverändert');
});

test('vereinigeKoffer: ohne laufenden Stand wird der Import übernommen (als Kopie)', () => {
  const ergebnis = vereinigeKoffer(null, daten);
  assert.deepEqual(ergebnis.kinder, daten.kinder);
  assert.deepEqual(ergebnis.beobachtungen.AB, daten.beobachtungen.AB);
  assert.notEqual(ergebnis.kinder, daten.kinder, 'Kopie, keine Referenz');
  assert.notEqual(ergebnis.beobachtungen.AB, daten.beobachtungen.AB, 'Kopie, keine Referenz');
});
