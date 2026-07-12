import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ampelFarbe, formatZeit, tagesSchluessel, aktualisiereTag } from '../logik.mjs';

test('ampelFarbe: grün bis 80 %, gelb bis 100 %, dann rot', () => {
  assert.equal(ampelFarbe(0), 'gruen');
  assert.equal(ampelFarbe(0.79), 'gruen');
  assert.equal(ampelFarbe(0.8), 'gelb');
  assert.equal(ampelFarbe(0.99), 'gelb');
  assert.equal(ampelFarbe(1), 'rot');
  assert.equal(ampelFarbe(1.5), 'rot');
});

test('formatZeit: M:SS, negative Werte werden 0:00', () => {
  assert.equal(formatZeit(0), '0:00');
  assert.equal(formatZeit(59), '0:59');
  assert.equal(formatZeit(60), '1:00');
  assert.equal(formatZeit(605), '10:05');
  assert.equal(formatZeit(-5), '0:00');
});

test('tagesSchluessel: lokales Datum als JJJJ-MM-TT', () => {
  assert.equal(tagesSchluessel(new Date(2026, 6, 12)), '2026-07-12');
  assert.equal(tagesSchluessel(new Date(2026, 0, 3)), '2026-01-03');
});

test('aktualisiereTag: addiert am selben Tag, setzt bei Datumswechsel zurück', () => {
  const tag1 = aktualisiereTag(null, { geplantMin: 30 }, '2026-07-12');
  assert.deepEqual(tag1, { datum: '2026-07-12', geplantMin: 30, pausen: 0 });
  const tag2 = aktualisiereTag(tag1, { pausen: 1 }, '2026-07-12');
  assert.deepEqual(tag2, { datum: '2026-07-12', geplantMin: 30, pausen: 1 });
  const tag3 = aktualisiereTag(tag2, { geplantMin: 15 }, '2026-07-13');
  assert.deepEqual(tag3, { datum: '2026-07-13', geplantMin: 15, pausen: 0 });
});
