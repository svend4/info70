import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SCHRIFT_STUFEN, STANDARD, naechsteSchrift, wechsleKontrast, normalisiere, ladeEinstellung, speichere, wendeAn, boot } from '../js/anzeige.mjs';

function fakeSpeicher(init = {}) {
  const m = new Map(Object.entries(init));
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, v),
    removeItem: (k) => m.delete(k),
    _map: m,
  };
}

test('naechsteSchrift: zyklisch normal → gross → sehr-gross → normal', () => {
  assert.equal(naechsteSchrift('normal'), 'gross');
  assert.equal(naechsteSchrift('gross'), 'sehr-gross');
  assert.equal(naechsteSchrift('sehr-gross'), 'normal');
  assert.equal(SCHRIFT_STUFEN.length, 3);
});

test('wechsleKontrast: normal ↔ hoch', () => {
  assert.equal(wechsleKontrast('normal'), 'hoch');
  assert.equal(wechsleKontrast('hoch'), 'normal');
});

test('normalisiere: kaputte Werte werden auf Standard gesetzt', () => {
  assert.deepEqual(normalisiere(null), STANDARD);
  assert.deepEqual(normalisiere({ kontrast: 'lila', schrift: 'riesig' }), STANDARD);
  assert.deepEqual(normalisiere({ kontrast: 'hoch', schrift: 'gross' }), { kontrast: 'hoch', schrift: 'gross' });
});

test('ladeEinstellung: aus Speicher, sonst prefers-contrast-Vorwahl', () => {
  const sp = fakeSpeicher({ 'ui.anzeige': JSON.stringify({ kontrast: 'hoch', schrift: 'sehr-gross' }) });
  assert.deepEqual(ladeEinstellung({ speicher: sp }), { kontrast: 'hoch', schrift: 'sehr-gross' });
  // ohne gespeicherte Wahl: prefersHoch steuert den Kontrast
  const leer = fakeSpeicher();
  assert.equal(ladeEinstellung({ speicher: leer, prefersHoch: true }).kontrast, 'hoch');
  assert.equal(ladeEinstellung({ speicher: leer, prefersHoch: false }).kontrast, 'normal');
});

test('speichere: Standard löscht den Eintrag, sonst wird gespeichert', () => {
  const sp = fakeSpeicher({ 'ui.anzeige': 'x' });
  speichere({ kontrast: 'normal', schrift: 'normal' }, sp);
  assert.equal(sp.getItem('ui.anzeige'), null, 'Standard entfernt den Eintrag');
  speichere({ kontrast: 'hoch', schrift: 'gross' }, sp);
  assert.deepEqual(JSON.parse(sp.getItem('ui.anzeige')), { kontrast: 'hoch', schrift: 'gross' });
});

test('wendeAn: setzt/entfernt data-Attribute am Wurzel-Element', () => {
  const root = { dataset: {} };
  wendeAn({ kontrast: 'hoch', schrift: 'gross' }, root);
  assert.equal(root.dataset.kontrast, 'hoch');
  assert.equal(root.dataset.schrift, 'gross');
  wendeAn({ kontrast: 'normal', schrift: 'normal' }, root);
  assert.equal(root.dataset.kontrast, undefined);
  assert.equal(root.dataset.schrift, undefined);
});

test('boot: lädt und wendet an, gibt die Einstellung zurück', () => {
  const sp = fakeSpeicher({ 'ui.anzeige': JSON.stringify({ kontrast: 'hoch', schrift: 'normal' }) });
  const root = { dataset: {} };
  const e = boot({ speicher: sp, root, prefersHoch: false });
  assert.deepEqual(e, { kontrast: 'hoch', schrift: 'normal' });
  assert.equal(root.dataset.kontrast, 'hoch');
});
