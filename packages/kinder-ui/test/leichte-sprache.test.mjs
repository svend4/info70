import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  istLeichteSprache, lsCode, basisCode, pruefeLeichteSpracheAbdeckung, LS_SUFFIX,
} from '../js/leichte-sprache.mjs';
import { erstelleSprache } from '../js/sprache.mjs';

test('Suffix-Helfer: erkennen, bauen, zurueckrechnen', () => {
  assert.equal(LS_SUFFIX, '-ls');
  assert.ok(istLeichteSprache('de-ls'));
  assert.ok(!istLeichteSprache('de'));
  assert.ok(!istLeichteSprache(undefined));
  assert.equal(lsCode('de'), 'de-ls');
  assert.equal(basisCode('de-ls'), 'de');
  assert.equal(basisCode('de'), 'de', 'ohne LS unveraendert');
});

test('Abdeckungs-Pruefer: vollstaendige LS-Fassung meldet nichts', () => {
  const kataloge = {
    de: { a: '1', b: '2', c: '3' },
    'de-ls': { a: 'eins', b: 'zwei', c: 'drei' },
    uk: { a: 'один' },
  };
  const bericht = pruefeLeichteSpracheAbdeckung(kataloge);
  assert.deepEqual(Object.keys(bericht), ['de-ls'], 'nur -ls-Kataloge werden geprueft, uk nicht');
  assert.deepEqual(bericht['de-ls'].fehlend, []);
  assert.deepEqual(bericht['de-ls'].ueberzaehlig, []);
  assert.equal(bericht['de-ls'].basis, 'de');
});

test('Abdeckungs-Pruefer: fehlende und ueberzaehlige Schluessel werden benannt', () => {
  const kataloge = {
    de: { a: '1', b: '2', c: '3' },
    'de-ls': { a: 'eins', c: 'drei', z: 'extra' },
  };
  const bericht = pruefeLeichteSpracheAbdeckung(kataloge);
  assert.deepEqual(bericht['de-ls'].fehlend, ['b'], 'b fehlt in Leichter Sprache');
  assert.deepEqual(bericht['de-ls'].ueberzaehlig, ['z'], 'z hat kein Gegenstueck in de');
});

test('erstelleSprache traegt de-ls wie jede andere Locale, mit Fallback auf de', () => {
  const kataloge = {
    de: { gruss: 'Guten Tag', nur_de: 'Detailtext' },
    'de-ls': { gruss: 'Hallo' },
  };
  const s = erstelleSprache({ kataloge, standard: 'de' });
  assert.ok(s.setze('de-ls'));
  assert.equal(s.t('gruss'), 'Hallo', 'LS-Fassung greift');
  assert.equal(s.t('nur_de'), 'Detailtext', 'fehlende LS-Schluessel fallen auf de zurueck');
  assert.ok(s.verfuegbare().includes('de-ls'));
});
