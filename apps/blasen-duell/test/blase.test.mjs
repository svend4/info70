import { test } from 'node:test';
import assert from 'node:assert/strict';
import { THEMEN, neueBlase, tippe, anteil, dominant, ziehe, verschieden } from '../blase.mjs';

test('neueBlase: alle Themen gleich gewichtet', () => {
  const b = neueBlase();
  assert.equal(Object.keys(b.gewichte).length, THEMEN.length);
  assert.ok(Object.values(b.gewichte).every((g) => g === 1));
  // gleicher Anteil für alle
  assert.ok(Math.abs(anteil(b, 'katzen') - 1 / THEMEN.length) < 1e-9);
});

test('tippe: verstärkt nur das getippte Thema, unveränderlich', () => {
  const b = neueBlase();
  const b2 = tippe(b, 'katzen', 2);
  assert.equal(b.gewichte.katzen, 1, 'Original unverändert');
  assert.equal(b2.gewichte.katzen, 2);
  assert.equal(b2.gewichte.fussball, 1);
  // unbekanntes Thema ändert nichts
  assert.deepEqual(tippe(b, 'gibtsnicht'), b);
});

test('dominant: nach mehreren Tipps führt das getippte Thema', () => {
  let b = neueBlase();
  b = tippe(b, 'weltraum');
  b = tippe(b, 'weltraum');
  b = tippe(b, 'weltraum');
  const d = dominant(b);
  assert.equal(d.id, 'weltraum');
  assert.ok(d.anteil > 1 / THEMEN.length, 'Anteil über dem Gleichstand');
});

test('ziehe: deterministisch mit fester Zufallsquelle', () => {
  const b = neueBlase();
  // zufall() = 0 wählt immer das erste Thema
  const feed = ziehe(b, 3, () => 0);
  assert.equal(feed.length, 3);
  assert.ok(feed.every((id) => id === THEMEN[0].id));
});

test('ziehe: stark verstärktes Thema dominiert den Feed', () => {
  let b = neueBlase();
  for (let i = 0; i < 8; i++) b = tippe(b, 'dinos');
  // mittiger Zufall -> fast immer das dominante Thema
  const feed = ziehe(b, 10, () => 0.5);
  const anteilDinos = feed.filter((id) => id === 'dinos').length / feed.length;
  assert.ok(anteilDinos >= 0.7, `Feed sollte von Dinos dominiert sein (war ${anteilDinos})`);
});

test('verschieden: zwei unterschiedlich trainierte Blasen sind verschieden', () => {
  let a = neueBlase(); let b = neueBlase();
  a = tippe(tippe(a, 'katzen'), 'katzen');
  b = tippe(tippe(b, 'fussball'), 'fussball');
  assert.equal(verschieden(a, b), true);
  // gleich trainiert -> nicht verschieden
  assert.equal(verschieden(a, tippe(tippe(neueBlase(), 'katzen'), 'katzen')), false);
});
