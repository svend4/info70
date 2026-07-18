import { test } from 'node:test';
import assert from 'node:assert/strict';
import { baueBalken } from '../plakat.mjs';
import { pruefeKoffer, packeKoffer } from '../../mitmach-arena/koffer.mjs';

test('baueBalken: sortiert absteigend, Prozente, eindeutiger Gewinner', () => {
  const p = baueBalken({ frage: 'Ausflug?', optionen: ['Zoo', 'Museum', 'Wald'], stimmen: [5, 2, 3] });
  assert.equal(p.frage, 'Ausflug?');
  assert.equal(p.gesamt, 10);
  assert.equal(p.balken[0].text, 'Zoo');
  assert.equal(p.balken[0].prozent, 50);
  assert.equal(p.balken[0].gewinner, true);
  assert.equal(p.gewinner, 'Zoo');
  assert.equal(p.gleichstand, false);
});

test('baueBalken: Gleichstand wird erkannt (kein Gewinner)', () => {
  const p = baueBalken({ frage: 'F', optionen: ['A', 'B'], stimmen: [3, 3] });
  assert.equal(p.gleichstand, true);
  assert.equal(p.gewinner, null);
  assert.ok(p.balken.every((b) => b.gewinner));
});

test('baueBalken: keine Stimmen -> 0 %, kein Gewinner', () => {
  const p = baueBalken({ frage: 'F', optionen: ['A', 'B'], stimmen: [0, 0] });
  assert.equal(p.gesamt, 0);
  assert.equal(p.gewinner, null);
  assert.ok(p.balken.every((b) => b.prozent === 0 && !b.gewinner));
});

test('Plakat liest den mitmach-arena Klassen-Koffer (Format-kompatibel)', () => {
  const koffer = JSON.parse(packeKoffer({ frage: 'Regel?', optionen: ['Leiser', 'Aufräumen'], stimmen: [4, 1] }));
  assert.deepEqual(pruefeKoffer(koffer), [], 'gültiger Koffer');
  const p = baueBalken(koffer);
  assert.equal(p.gewinner, 'Leiser');
  assert.equal(p.balken[0].prozent, 80);
});
