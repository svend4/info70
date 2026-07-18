import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { RTL_SPRACHEN, basis, istRtl, richtung, setzeRichtung } from '../js/richtung.mjs';

test('basis: entfernt Region/Variante', () => {
  assert.equal(basis('ar-EG'), 'ar');
  assert.equal(basis('de-ls'), 'de');
  assert.equal(basis('EN'), 'en');
  assert.equal(basis(null), '');
});

test('istRtl / richtung: RTL-Sprachen erkannt, LTR sonst', () => {
  assert.equal(istRtl('ar'), true);
  assert.equal(istRtl('ar-EG'), true);
  assert.equal(istRtl('he'), true);
  assert.equal(istRtl('fa'), true);
  assert.equal(istRtl('de'), false);
  assert.equal(istRtl('en'), false);
  assert.equal(richtung('ar'), 'rtl');
  assert.equal(richtung('de'), 'ltr');
  assert.ok(RTL_SPRACHEN.length >= 5);
});

test('setzeRichtung: setzt dir am Wurzel-Element', () => {
  const root = {};
  setzeRichtung('ar', root);
  assert.equal(root.dir, 'rtl');
  setzeRichtung('de', root);
  assert.equal(root.dir, 'ltr');
});

test('kinder.css nutzt logische Eigenschaften (RTL-tauglich)', async () => {
  const css = await readFile(new URL('../css/kinder.css', import.meta.url), 'utf8');
  // physische, RTL-brechende Eigenschaften dürfen im geteilten CSS nicht vorkommen
  const verboten = [/margin-left\s*:/i, /margin-right\s*:/i, /padding-left\s*:/i, /padding-right\s*:/i, /border-left\s*:/i, /border-right\s*:/i, /text-align\s*:\s*(left|right)/i];
  const treffer = verboten.filter((re) => re.test(css)).map((re) => re.source);
  assert.deepEqual(treffer, [], `RTL-brechende Eigenschaften im geteilten CSS: ${treffer.join(', ')}`);
});
