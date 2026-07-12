import { test } from 'node:test';
import assert from 'node:assert/strict';
import { wahrscheinlichkeiten, ziehe, erwartungswert, pechQuantil, ITEMS, TRUHEN_PREIS, START_TASCHENGELD } from '../logik.mjs';

// Deterministischer Zufall (LCG), damit die Tests reproduzierbar sind
function lcg(saat = 42) {
  let zustand = saat;
  return () => {
    zustand = (zustand * 1664525 + 1013904223) % 4294967296;
    return zustand / 4294967296;
  };
}

test('wahrscheinlichkeiten: Summe genau 100 %, offengelegte Stufen 1/9/90', () => {
  const summe = wahrscheinlichkeiten.reduce((s, w) => s + w.prozent, 0);
  assert.equal(summe, 100);
  const prozent = Object.fromEntries(wahrscheinlichkeiten.map((w) => [w.id, w.prozent]));
  assert.equal(prozent.legendaer, 1);
  assert.equal(prozent.selten, 9);
  assert.equal(prozent.haeufig, 90);
  for (const w of wahrscheinlichkeiten) {
    assert.ok(ITEMS[w.id]?.length > 0, `Item-Pool für ${w.id} fehlt`);
  }
});

test('ziehe: Grenzwerte des Zufalls treffen die richtige Stufe', () => {
  assert.equal(ziehe(() => 0).seltenheit.id, 'legendaer');
  assert.equal(ziehe(() => 0.0099).seltenheit.id, 'legendaer');
  assert.equal(ziehe(() => 0.01).seltenheit.id, 'selten');
  assert.equal(ziehe(() => 0.0999).seltenheit.id, 'selten');
  assert.equal(ziehe(() => 0.1).seltenheit.id, 'haeufig');
  assert.equal(ziehe(() => 0.999999).seltenheit.id, 'haeufig');
});

test('ziehe: liefert immer ein Item aus dem Pool der gezogenen Stufe', () => {
  const zufall = lcg(7);
  for (let i = 0; i < 500; i++) {
    const { seltenheit, item } = ziehe(zufall);
    assert.ok(ITEMS[seltenheit.id].includes(item), `Item ${item?.id} gehört nicht zu ${seltenheit.id}`);
  }
});

test('Verteilung bei 10000 Ziehungen grob korrekt (1 % / 9 % / 90 %)', () => {
  const zufall = lcg();
  const anzahl = { legendaer: 0, selten: 0, haeufig: 0 };
  for (let i = 0; i < 10000; i++) anzahl[ziehe(zufall).seltenheit.id]++;
  assert.equal(anzahl.legendaer + anzahl.selten + anzahl.haeufig, 10000);
  assert.ok(anzahl.legendaer >= 50 && anzahl.legendaer <= 200, `legendaer=${anzahl.legendaer} nicht nahe 100`);
  assert.ok(anzahl.selten >= 700 && anzahl.selten <= 1100, `selten=${anzahl.selten} nicht nahe 900`);
  assert.ok(anzahl.haeufig >= 8700 && anzahl.haeufig <= 9300, `haeufig=${anzahl.haeufig} nicht nahe 9000`);
});

test('erwartungswert: bei 1 % und 2 € pro Truhe im Mittel 100 Truhen = 200 €', () => {
  const ew = erwartungswert();
  assert.equal(ew.truhen, 100);
  assert.equal(ew.kosten, 200);
  // Formel gilt allgemein: truhen = 100/prozent, kosten = truhen * preis
  const selten = erwartungswert(9, 2);
  assert.ok(Math.abs(selten.truhen - 100 / 9) < 1e-9);
  assert.ok(Math.abs(selten.kosten - 200 / 9) < 1e-9);
  assert.equal(erwartungswert(50, 4).kosten, 8);
});

test('pechQuantil: jedes zehnte Kind braucht mehr als 230 Truhen (bei 1 %)', () => {
  assert.equal(pechQuantil(), 230);
  assert.equal(pechQuantil(1, 0.1), 230);
  // Plausibilität: (1-p)^n erst bei n=230 unter 10 %
  assert.ok(0.99 ** 229 > 0.1);
  assert.ok(0.99 ** 230 <= 0.1);
});

test('Startwerte: 20 € Taschengeld, 2 € pro Truhe → genau 10 Truhen pro Experiment', () => {
  assert.equal(START_TASCHENGELD, 20);
  assert.equal(TRUHEN_PREIS, 2);
  assert.equal(START_TASCHENGELD / TRUHEN_PREIS, 10);
});
