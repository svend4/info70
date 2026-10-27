import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { baueBalken, fussText } from '../plakat.mjs';
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

test('fussText: neutral, „Meiste Stimmen“ statt Siegerwort', () => {
  const eindeutig = fussText(baueBalken({ frage: 'F', optionen: ['Zoo', 'Wald'], stimmen: [4, 1] }));
  assert.equal(eindeutig, 'Meiste Stimmen: Zoo · 5 Stimmen insgesamt.');
  assert.equal(fussText(baueBalken({ frage: 'F', optionen: ['A', 'B'], stimmen: [2, 2] })), '🤝 Unentschieden – 4 Stimmen insgesamt.');
  assert.equal(fussText(baueBalken({ frage: 'F', optionen: ['A', 'B'], stimmen: [0, 0] })), 'Noch keine Stimmen abgegeben.');
});

test('Abwesenheit: kein Pokal-Symbol und kein „Gewonnen“ im Plakat-Code', () => {
  const pokal = String.fromCodePoint(0x1f3c6);
  for (const datei of ['../app.mjs', '../plakat.mjs']) {
    const text = readFileSync(new URL(datei, import.meta.url), 'utf8');
    assert.ok(!text.includes(pokal), `${datei}: kein Pokal-Symbol`);
    assert.ok(!/gewonnen/i.test(text), `${datei}: keine Siegerformulierung`);
  }
});
