import { test } from 'node:test';
import assert from 'node:assert/strict';
import { NOTRUF_ZEILE, baueFahrplan } from '../logik.mjs';

// Bei akuter Gefahr steht der Notruf im Ausdruck vor dem ersten Schritt, auch ohne ausgefüllte Kontakte.
test('Notruf 112 und 110 steht als erste Zeile nach dem Kopf', () => {
  const zeilen = baueFahrplan().split('\n');
  assert.equal(zeilen[2], NOTRUF_ZEILE);
  assert.match(NOTRUF_ZEILE, /\b112\b/);
  assert.match(NOTRUF_ZEILE, /\b110\b/);
});

test('Notruf steht vor dem ersten Schritt', () => {
  const text = baueFahrplan();
  assert.ok(text.indexOf('112') < text.indexOf('1) '), 'der Notruf kommt vor Schritt 1');
});

test('Notruf bleibt im Fahrplan, auch wenn Kontakte eingetragen sind', () => {
  assert.ok(baueFahrplan({ vertrauensperson: 'Frau M.' }).includes(NOTRUF_ZEILE));
});
