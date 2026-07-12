import { test } from 'node:test';
import assert from 'node:assert/strict';
import { KOFFER_ART, KOFFER_VERSION, packeKoffer, pruefeKoffer, vereinigeKoffer } from '../ampel-koffer.mjs';
import { MAX_KINDER } from '../logik.mjs';

const gruppe = {
  kinder: ['MO', 'LI'],
  eintraege: {
    MO: {
      '2026-07-11': { ampel: 'rot', kontext: 'eingewoehnung' },
      '2026-07-12': { ampel: 'gelb', kontext: null },
    },
    LI: { '2026-07-12': { ampel: 'gruen', kontext: null } },
  },
};

const gueltig = (extra = {}) => ({
  art: KOFFER_ART, version: KOFFER_VERSION, kinder: ['MO'], eintraege: {}, ...extra,
});

test('packeKoffer -> pruefeKoffer: Rundreise ist gültig', () => {
  const geparst = JSON.parse(packeKoffer(gruppe));
  assert.deepEqual(pruefeKoffer(geparst), []);
  assert.equal(geparst.art, KOFFER_ART);
  assert.deepEqual(geparst.kinder, ['MO', 'LI']);
  assert.deepEqual(geparst.eintraege.MO['2026-07-11'], { ampel: 'rot', kontext: 'eingewoehnung' });
});

test('pruefeKoffer erkennt kaputte Dateien', () => {
  assert.ok(pruefeKoffer(null).length > 0);
  assert.ok(pruefeKoffer('text').length > 0);
  assert.ok(pruefeKoffer({ art: 'anders' }).length > 0);
  assert.ok(pruefeKoffer(gueltig({ version: 99 })).some((f) => f.includes('Version')));
  assert.ok(pruefeKoffer(gueltig({ kinder: 'MO' })).some((f) => f.includes('Kürzel-Liste')));
});

test('pruefeKoffer erzwingt Datensparsamkeit auch beim Import', () => {
  // Kürzel länger als 3 Zeichen (Klarnamen-Risiko) -> abgelehnt
  assert.ok(pruefeKoffer(gueltig({ kinder: ['MORITZ'] })).length > 0);
  // mehr als 20 Kinder -> abgelehnt
  const zuViele = Array.from({ length: MAX_KINDER + 1 }, (_, i) => `K${i}`);
  assert.ok(pruefeKoffer(gueltig({ kinder: zuViele })).some((f) => f.includes('Zu viele')));
  // doppelte Kürzel -> abgelehnt
  assert.ok(pruefeKoffer(gueltig({ kinder: ['MO', 'MO'] })).some((f) => f.includes('doppelt')));
  // Freitext-Kontext -> abgelehnt (nur feste Liste)
  assert.ok(pruefeKoffer(gueltig({
    eintraege: { MO: { '2026-07-12': { ampel: 'rot', kontext: 'weint oft, Mutter krank' } } },
  })).some((f) => f.includes('feste Kontext-Liste')));
  // unbekannte Ampel -> abgelehnt
  assert.ok(pruefeKoffer(gueltig({
    eintraege: { MO: { '2026-07-12': { ampel: 'blau', kontext: null } } },
  })).length > 0);
  // kaputtes Datum -> abgelehnt
  assert.ok(pruefeKoffer(gueltig({
    eintraege: { MO: { morgen: { ampel: 'rot', kontext: null } } },
  })).some((f) => f.includes('Datum')));
  // Einträge für nicht angelegtes Kürzel -> abgelehnt
  assert.ok(pruefeKoffer(gueltig({
    eintraege: { XX: { '2026-07-12': { ampel: 'rot', kontext: null } } },
  })).some((f) => f.includes('unbekanntes Kürzel')));
});

test('vereinigeKoffer: ohne lokale Daten wird der Import übernommen (Kopie)', () => {
  const ergebnis = vereinigeKoffer(null, gruppe);
  assert.deepEqual(ergebnis, gruppe);
  assert.notEqual(ergebnis.kinder, gruppe.kinder, 'Kopie, keine Referenz');
  assert.notEqual(ergebnis.eintraege.MO, gruppe.eintraege.MO, 'tiefe Kopie');
});

test('vereinigeKoffer führt Kinder und Tage zusammen, lokal gewinnt bei Konflikt', () => {
  const lokal = {
    kinder: ['MO'],
    eintraege: { MO: { '2026-07-12': { ampel: 'gruen', kontext: null } } },
  };
  const importiert = {
    kinder: ['MO', 'AN'],
    eintraege: {
      MO: {
        '2026-07-12': { ampel: 'rot', kontext: 'konflikt' }, // Konflikt: lokal gewinnt
        '2026-07-10': { ampel: 'gelb', kontext: null }, // neu: wird übernommen
      },
      AN: { '2026-07-12': { ampel: 'gruen', kontext: 'neu' } },
    },
  };
  const ergebnis = vereinigeKoffer(lokal, importiert);
  assert.deepEqual(ergebnis.kinder, ['MO', 'AN'], 'lokale Reihenfolge zuerst, kein Duplikat');
  assert.deepEqual(ergebnis.eintraege.MO['2026-07-12'], { ampel: 'gruen', kontext: null });
  assert.deepEqual(ergebnis.eintraege.MO['2026-07-10'], { ampel: 'gelb', kontext: null });
  assert.deepEqual(ergebnis.eintraege.AN['2026-07-12'], { ampel: 'gruen', kontext: 'neu' });
  // Originale unverändert:
  assert.deepEqual(lokal.kinder, ['MO']);
  assert.deepEqual(importiert.eintraege.MO['2026-07-12'], { ampel: 'rot', kontext: 'konflikt' });
});

test('vereinigeKoffer lehnt ab, wenn zusammen mehr als 20 Kinder entstehen', () => {
  const lokal = {
    kinder: Array.from({ length: MAX_KINDER }, (_, i) => `K${i}`),
    eintraege: {},
  };
  const importiert = { kinder: ['NEU'], eintraege: {} };
  assert.equal(vereinigeKoffer(lokal, importiert), null);
  // dieselben Kürzel sind kein Problem (kein Wachstum):
  const gleich = { kinder: ['K0', 'K1'], eintraege: {} };
  assert.ok(vereinigeKoffer(lokal, gleich));
});
