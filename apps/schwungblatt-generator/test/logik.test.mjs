import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MUSTER, EINHEIT, HOEHE, musterFuerStufe, pfad, zeilenSVG, pruefeMuster } from '../logik.mjs';

test('Muster-Katalog gültig: 6 Muster, je Stufe mindestens 2, Pfade ohne NaN', () => {
  assert.deepEqual(pruefeMuster(), []);
  assert.equal(MUSTER.length, 6);
  assert.equal(musterFuerStufe(1).length, 2);
  assert.equal(musterFuerStufe(2).length, 2);
  assert.equal(musterFuerStufe(3).length, 2);
});

test('Progression: Stufe 1 große Bögen, Stufe 3 feine Formen', () => {
  assert.deepEqual(musterFuerStufe(1).map((m) => m.id), ['welle', 'berge']);
  assert.deepEqual(musterFuerStufe(3).map((m) => m.id), ['schleifen', 'kreise']);
});

test('pfad: beginnt auf der Grundlinie, wiederholt die Einheit', () => {
  const d = pfad('welle', 4);
  assert.match(d, /^M 0 55/, 'Grundlinie bei HOEHE-15');
  assert.equal((d.match(/q 15 -50 30 0/g) ?? []).length, 4, '4 Wellen-Einheiten');
  const z = pfad('zickzack', 3);
  assert.equal((z.match(/l 15 -45/g) ?? []).length, 6, 'Zickzack: 2 Spitzen je Einheit');
  assert.equal(pfad('gibtnicht', 2), null);
});

test('zeilenSVG: selbst erzeugtes SVG mit Nachspur-Strich und Startpunkt', () => {
  const svg = zeilenSVG('schleifen', 5);
  assert.match(svg, /^<svg viewBox="0 0 300 70"/);
  assert.match(svg, /stroke-dasharray/, 'gepunkteter Nachspur-Strich');
  assert.match(svg, /circle cx="0" cy="55" r="6" fill="#16a34a"/, 'grüner Startpunkt');
  assert.match(svg, /aria-label="Schwungübung/);
  assert.ok(!/NaN|undefined|http/.test(svg), 'keine kaputten Werte, keine externen Referenzen');
  assert.equal(zeilenSVG('gibtnicht', 2), null);
});

test('Konstanten: Einheit und Höhe sind druckfreundlich', () => {
  assert.equal(EINHEIT, 60);
  assert.equal(HOEHE, 70);
});
