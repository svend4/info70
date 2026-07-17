import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FILTER, abstandGesamt, einordnung, LEKTIONEN } from '../filter.mjs';

test('Filter-Katalog: 5 Filter mit Versprechen und Wahrheit', () => {
  assert.equal(FILTER.length, 5);
  const codes = FILTER.map((f) => f.code);
  assert.equal(new Set(codes).size, codes.length);
  for (const f of FILTER) {
    assert.ok(f.name && f.emoji, `${f.code}: Name/Emoji fehlt`);
    assert.ok(f.abstand >= 10 && f.abstand <= 30, `${f.code}: Abstand plausibel`);
    assert.ok(f.verspricht?.length >= 15, `${f.code}: Versprechen fehlt`);
    assert.ok(f.wahrheit?.length >= 50, `${f.code}: Wahrheit fehlt (dort passiert das Lernen)`);
  }
});

test('abstandGesamt: summiert, klemmt bei 100, alle Filter zusammen erreichen fiktiv', () => {
  assert.equal(abstandGesamt([]), 0);
  assert.equal(abstandGesamt(['haut']), 20);
  assert.equal(abstandGesamt(['haut', 'augen']), 40);
  const alle = FILTER.map((f) => f.code);
  assert.equal(abstandGesamt(alle), 100, 'volle Filterung = 100');
});

test('einordnung: vier Stufen mit klaren Grenzen', () => {
  assert.equal(einordnung(0).stufe, 'echt');
  assert.equal(einordnung(39).stufe, 'bearbeitet');
  assert.equal(einordnung(40).stufe, 'konstruiert');
  assert.equal(einordnung(80).stufe, 'fiktiv');
  assert.ok(einordnung(100).satz.includes('EXISTIERT NICHT'));
});

test('Lektionen: Vergleichsspirale, Kennzeichnungs-Gesetze, Geschäftsmodell, Hilfe', () => {
  const text = LEKTIONEN.join(' ');
  assert.ok(/Zerrspiegel|vergleichst/.test(text), 'Vergleichs-Mechanik');
  assert.ok(/Frankreich|Norwegen|kennzeichnen/.test(text), 'Kennzeichnungs-Regeln als Kontext');
  assert.ok(/Industrie|nützt/.test(text), 'Geschäftsmodell benannt');
  assert.ok(text.includes('116 111'), 'Hilfeadresse');
});
