import { test } from 'node:test';
import assert from 'node:assert/strict';
import { packeKoffer, pruefeKoffer, vereinigeKoffer } from '../koffer.mjs';

const umfrage = { frage: 'Wohin geht der Ausflug?', optionen: ['Zoo', 'Museum', 'Wald'], stimmen: [3, 1, 5] };

test('packeKoffer -> pruefeKoffer: Rundreise ist gültig', () => {
  const geparst = JSON.parse(packeKoffer(umfrage));
  assert.deepEqual(pruefeKoffer(geparst), []);
  assert.equal(geparst.frage, umfrage.frage);
  assert.deepEqual(geparst.stimmen, [3, 1, 5]);
});

test('pruefeKoffer erkennt kaputte Dateien', () => {
  assert.ok(pruefeKoffer(null).length > 0);
  assert.ok(pruefeKoffer({ art: 'anders' }).length > 0);
  assert.ok(pruefeKoffer({ art: 'mitmach-arena-umfrage', version: 1, frage: 'F?', optionen: ['A', 'B'], stimmen: [1] })
    .some((f) => f.includes('passen nicht')));
  assert.ok(pruefeKoffer({ art: 'mitmach-arena-umfrage', version: 1, frage: 'F?', optionen: ['A', 'B'], stimmen: [1, -2] })
    .some((f) => f.includes('Stimmen')));
});

test('vereinigeKoffer addiert Stimmen bei gleicher Umfrage', () => {
  const anderesGeraet = { frage: umfrage.frage, optionen: [...umfrage.optionen], stimmen: [2, 4, 0] };
  const ergebnis = vereinigeKoffer(umfrage, anderesGeraet);
  assert.deepEqual(ergebnis.stimmen, [5, 5, 5]);
  assert.deepEqual(umfrage.stimmen, [3, 1, 5], 'Original bleibt unverändert');
});

test('vereinigeKoffer: ohne laufende Umfrage wird der Import übernommen', () => {
  const ergebnis = vereinigeKoffer(null, umfrage);
  assert.deepEqual(ergebnis, umfrage);
  assert.notEqual(ergebnis.stimmen, umfrage.stimmen, 'Kopie, keine Referenz');
});

test('vereinigeKoffer lehnt andere Umfrage ab', () => {
  const andere = { frage: 'Was gibt es zu essen?', optionen: ['Pizza', 'Nudeln'], stimmen: [1, 1] };
  assert.equal(vereinigeKoffer(umfrage, andere), null);
  const andereReihenfolge = { ...umfrage, optionen: ['Museum', 'Zoo', 'Wald'] };
  assert.equal(vereinigeKoffer(umfrage, andereReihenfolge), null);
});
