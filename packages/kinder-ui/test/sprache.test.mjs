import { test } from 'node:test';
import assert from 'node:assert/strict';
import { erstelleSprache } from '../js/sprache.mjs';

const kataloge = {
  de: { gruss: 'Hallo, {name}!', nur_de: 'nur deutsch' },
  uk: { gruss: 'Привіт, {name}!' },
};

test('t() liefert Text der aktuellen Sprache mit Platzhaltern', () => {
  const s = erstelleSprache({ kataloge });
  assert.equal(s.aktuelle(), 'de');
  assert.equal(s.t('gruss', { name: 'Mia' }), 'Hallo, Mia!');
});

test('setze() wechselt Sprache; fehlende Schlüssel fallen auf Standard zurück', () => {
  const s = erstelleSprache({ kataloge });
  assert.ok(s.setze('uk'));
  assert.equal(s.t('gruss', { name: 'Іра' }), 'Привіт, Іра!');
  assert.equal(s.t('nur_de'), 'nur deutsch', 'Fallback auf Standardkatalog');
  assert.equal(s.t('gibt_es_nicht'), 'gibt_es_nicht', 'Schlüssel selbst als letzter Fallback');
});

test('unbekannte Sprache wird abgelehnt, verfuegbare() listet Kataloge', () => {
  const s = erstelleSprache({ kataloge });
  assert.ok(!s.setze('xx'));
  assert.equal(s.aktuelle(), 'de');
  assert.deepEqual(s.verfuegbare(), ['de', 'uk']);
});
