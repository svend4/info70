import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { packeKoffer, pruefeKoffer, vereinigeKoffer, KOFFER_ART, KOFFER_VERSION } from '../koffer.mjs';

const katalog = JSON.parse(await readFile(new URL('../daten/beobachtungen.json', import.meta.url), 'utf8'));
const MOMENT_IDS = katalog.felder.flatMap((f) => f.momente.map((m) => m.id));

const markierungen = { 'denken-1': 2, 'sozial-1': 1, 'bewegung-5': 3 };

test('packeKoffer -> pruefeKoffer: Rundreise ist gültig', () => {
  const geparst = JSON.parse(packeKoffer(markierungen));
  assert.deepEqual(pruefeKoffer(geparst), []);
  assert.deepEqual(pruefeKoffer(geparst, MOMENT_IDS), [], 'auch gegen den Katalog gültig');
  assert.equal(geparst.art, KOFFER_ART);
  assert.equal(geparst.version, KOFFER_VERSION);
  assert.deepEqual(geparst.markierungen, markierungen);
});

test('pruefeKoffer erkennt kaputte Dateien', () => {
  assert.ok(pruefeKoffer(null).length > 0);
  assert.ok(pruefeKoffer('text').length > 0);
  assert.ok(pruefeKoffer({ art: 'anders', version: KOFFER_VERSION, markierungen: {} }).length > 0);
  assert.ok(pruefeKoffer({ art: KOFFER_ART, version: 99, markierungen: {} }).length > 0);
  assert.ok(pruefeKoffer({ art: KOFFER_ART, version: KOFFER_VERSION, markierungen: [] })
    .some((f) => f.includes('Markierungen')));
  assert.ok(pruefeKoffer({ art: KOFFER_ART, version: KOFFER_VERSION, markierungen: { 'denken-1': -2 } })
    .some((f) => f.includes('Anzahl')));
  assert.ok(pruefeKoffer({ art: KOFFER_ART, version: KOFFER_VERSION, markierungen: { 'denken-1': 1.5 } })
    .some((f) => f.includes('Anzahl')));
});

test('pruefeKoffer lehnt unbekannte Moment-Ids ab (kein Einschleusen von Freitext)', () => {
  const fremd = { art: KOFFER_ART, version: KOFFER_VERSION, markierungen: { 'Max ist begabt': 1 } };
  assert.deepEqual(pruefeKoffer(fremd), [], 'ohne Katalog-Liste formal gültig');
  assert.ok(pruefeKoffer(fremd, MOMENT_IDS).some((f) => f.includes('Unbekannter Beobachtungs-Moment')));
});

test('vereinigeKoffer addiert Anzahlen je Moment', () => {
  const anderesGeraet = { 'denken-1': 1, 'kreativ-2': 2 };
  const ergebnis = vereinigeKoffer(markierungen, anderesGeraet);
  assert.deepEqual(ergebnis, { 'denken-1': 3, 'sozial-1': 1, 'bewegung-5': 3, 'kreativ-2': 2 });
  assert.deepEqual(markierungen, { 'denken-1': 2, 'sozial-1': 1, 'bewegung-5': 3 }, 'Original bleibt unverändert');
});

test('vereinigeKoffer: ohne lokale Markierungen wird der Import übernommen (als Kopie)', () => {
  const ergebnis = vereinigeKoffer(null, markierungen);
  assert.deepEqual(ergebnis, markierungen);
  assert.notEqual(ergebnis, markierungen, 'Kopie, keine Referenz');
});
