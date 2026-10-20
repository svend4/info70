import { test } from 'node:test';
import assert from 'node:assert/strict';
import { amZug } from '../src/staffel.mjs';

test('amZug: gerade Frage jüngeres Kind, ungerade älteres', () => {
  assert.equal(amZug(0), 'jung');
  assert.equal(amZug(1), 'alt');
  assert.equal(amZug(2), 'jung');
  assert.equal(amZug(3), 'alt');
});
