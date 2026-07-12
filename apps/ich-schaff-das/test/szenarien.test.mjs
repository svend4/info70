import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const daten = JSON.parse(await readFile(new URL('../daten/szenarien.json', import.meta.url), 'utf8'));

test('Szenarienbank: Grundstruktur, IDs, erreichbare Ränge', () => {
  assert.equal(daten.version, 1);
  assert.ok(daten.szenarien.length >= 10, 'mindestens 10 Szenarien');
  const ids = daten.szenarien.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(daten.raenge.length, 4, 'vier Ränge: Anfänger-Mut bis Durchhalte-Held*in');
  assert.equal(daten.raenge[0].ab, 0);
  for (let i = 1; i < daten.raenge.length; i++) {
    assert.ok(daten.raenge[i].ab > daten.raenge[i - 1].ab, 'Ränge aufsteigend');
  }
  assert.ok(Math.max(...daten.raenge.map((r) => r.ab)) <= daten.szenarien.length * 2);
});

test('jedes Szenario: Situation, Erklärung, genau ein stärkster Zug (wert 2), eine Falle (wert 0)', () => {
  for (const s of daten.szenarien) {
    assert.ok(s.situation?.length >= 20, `${s.id}: Situation fehlt/zu kurz`);
    assert.ok(s.erklaerung?.length >= 40, `${s.id}: Erklärung fehlt/zu kurz (dort passiert das Lernen!)`);
    assert.ok(Array.isArray(s.optionen) && s.optionen.length === 3, `${s.id}: genau 3 Optionen`);
    for (const o of s.optionen) {
      assert.ok(o.text?.length >= 5, `${s.id}: Optionstext fehlt`);
      assert.ok([0, 1, 2].includes(o.wert), `${s.id}: wert muss 0, 1 oder 2 sein`);
    }
    const werte = s.optionen.map((o) => o.wert);
    assert.equal(werte.filter((w) => w === 2).length, 1, `${s.id}: genau EIN stärkster Zug`);
    assert.ok(werte.includes(0), `${s.id}: mindestens eine Option, die es schwerer macht`);
  }
});

test('didaktische Schwerpunkte: Pause, Plan/Schritte, Hilfe holen kommen als Strategien vor', () => {
  const alles = JSON.stringify(daten.szenarien);
  assert.ok(/pause/i.test(alles), 'Strategie „erst Pause“ muss vorkommen');
  assert.ok(/plan|schritt/i.test(alles), 'Strategie „Plan / kleine Schritte“ muss vorkommen');
  assert.ok(/hilfe/i.test(alles), 'Strategie „um Hilfe bitten“ muss vorkommen');
});
