import { test } from 'node:test';
import assert from 'node:assert/strict';
import { KRITERIEN } from '../../../packages/kinderschutz/src/index.mjs';
import { gruppiere, zaehleErfuellt, baueBericht, baueJson } from '../logik.mjs';

test('gruppiere: nach Quellen-Präfix, alle Kriterien einsortiert', () => {
  const g = gruppiere(KRITERIEN);
  const summe = [...g.values()].reduce((s, l) => s + l.length, 0);
  assert.equal(summe, KRITERIEN.length, 'kein Kriterium verloren');
  assert.ok(g.size >= 2, 'mehrere Quellen-Gruppen');
});

test('zaehleErfuellt', () => {
  assert.equal(zaehleErfuellt(KRITERIEN, {}), 0);
  const alle = Object.fromEntries(KRITERIEN.map((k) => [k.id, true]));
  assert.equal(zaehleErfuellt(KRITERIEN, alle), KRITERIEN.length);
});

test('baueBericht: Kopf, Zählung, [x]/[ ]-Marken', () => {
  const status = { [KRITERIEN[0].id]: true };
  const t = baueBericht(KRITERIEN, status, { stand: '18.07.2026' });
  assert.match(t, /Kriterien-Check/);
  assert.match(t, /Stand: 18\.07\.2026/);
  assert.match(t, new RegExp(`Erfüllt: 1 von ${KRITERIEN.length}`));
  assert.match(t, /\[x\]/);
  assert.match(t, /\[ \]/);
  assert.match(t, /Selbstprüfung/);
});

test('baueJson: strukturierter Export mit korrekter Zählung', () => {
  const status = { [KRITERIEN[0].id]: true, [KRITERIEN[1].id]: true };
  const j = baueJson(KRITERIEN, status, { stand: '18.07.2026' });
  assert.equal(j.typ, 'kriterien-check-bericht');
  assert.equal(j.gesamt, KRITERIEN.length);
  assert.equal(j.erfuellt, 2);
  assert.equal(j.kriterien.length, KRITERIEN.length);
  assert.equal(j.kriterien.find((k) => k.id === KRITERIEN[0].id).erfuellt, true);
  assert.ok(j.kriterien.every((k) => typeof k.erfuellt === 'boolean' && k.id && k.text));
  // JSON serialisierbar
  assert.doesNotThrow(() => JSON.stringify(j));
});

test('leerer Stand: kein "Stand"-Kopf, JSON-stand null', () => {
  assert.ok(!/Stand:/.test(baueBericht(KRITERIEN, {})));
  assert.equal(baueJson(KRITERIEN, {}).stand, null);
});
