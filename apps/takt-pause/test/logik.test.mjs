import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ampelFarbe, formatZeit, tagesSchluessel, aktualisiereTag, mergeWoche, wochenStatistik } from '../logik.mjs';

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

test('mergeWoche: Upsert nach Datum (Wochen-Rückblick, Nr. 239)', () => {
  let w = [];
  w = mergeWoche(w, { datum: '2026-07-13', geplantMin: 30, pausen: 1 });
  w = mergeWoche(w, { datum: '2026-07-14', geplantMin: 20, pausen: 2 });
  assert.equal(w.length, 2);
  // gleicher Tag -> ersetzt statt dupliziert
  w = mergeWoche(w, { datum: '2026-07-14', geplantMin: 25, pausen: 3 });
  assert.equal(w.length, 2, 'kein Duplikat für denselben Tag');
  assert.equal(w.find((t) => t.datum === '2026-07-14').pausen, 3, 'aktualisiert');
  // sortiert
  assert.deepEqual(w.map((t) => t.datum), ['2026-07-13', '2026-07-14']);
});

test('mergeWoche: behält nur die letzten 7 Tage', () => {
  let w = [];
  for (let d = 1; d <= 10; d++) w = mergeWoche(w, { datum: `2026-07-${String(d).padStart(2, '0')}`, geplantMin: 0, pausen: d });
  assert.equal(w.length, 7);
  assert.equal(w[0].datum, '2026-07-04', 'die drei ältesten sind weg');
  assert.equal(w.at(-1).datum, '2026-07-10');
});

test('mergeWoche: null/leerer Tag ändert nichts', () => {
  assert.deepEqual(mergeWoche([{ datum: 'x', geplantMin: 0, pausen: 0 }], null), [{ datum: 'x', geplantMin: 0, pausen: 0 }]);
});

test('wochenStatistik: summiert Pausen und findet Maximum', () => {
  const w = [{ datum: 'a', pausen: 1 }, { datum: 'b', pausen: 3 }, { datum: 'c', pausen: 2 }];
  const s = wochenStatistik(w);
  assert.equal(s.tage, 3);
  assert.equal(s.pausenGesamt, 6);
  assert.equal(s.maxPausen, 3);
  assert.deepEqual(wochenStatistik([]), { tage: 0, pausenGesamt: 0, maxPausen: 0 });
});
