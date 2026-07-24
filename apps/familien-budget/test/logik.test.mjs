import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pruefeBudget, festeSumme, frei, summe, bewerteAuswahl } from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/budget.json', import.meta.url), 'utf8'));
const idsVon = (art) => daten.posten.filter((p) => p.art === art).map((p) => p.id);

test('Budget-Daten gültig: Arten vertreten, Budget knapp genug zum Abwägen', () => {
  assert.deepEqual(pruefeBudget(daten), []);
  assert.ok(frei(daten) > 0);
  assert.ok(frei(daten) < summe(daten.posten), 'nicht alles ist bezahlbar → Abwägen nötig');
  assert.match(daten.hinweis, /Spielgeld|nichts wirklich gekauft/i, 'Spielgeld-Hinweis');
});

test('festeSumme + frei rechnen korrekt', () => {
  const fest = daten.festeKosten.reduce((s, f) => s + f.betrag, 0);
  assert.equal(festeSumme(daten), fest);
  assert.equal(frei(daten), daten.einkommen - fest);
});

test('überzogen: mehr auswählen als das Budget hergibt', () => {
  const alles = daten.posten.map((p) => p.id);
  const e = bewerteAuswahl(daten, alles);
  assert.equal(e.ueberzogen, true);
  assert.equal(e.stufe, 'ueberzogen');
  assert.ok(e.rest < 0);
  assert.match(e.hinweise[0], /reicht so nicht/);
});

test('Bedürfnis-vor-Wunsch-Hinweis: Wunsch gewählt, Bedürfnis offen', () => {
  const nurWunsch = [idsVon('wunsch')[0]];
  const e = bewerteAuswahl(daten, nurWunsch);
  assert.equal(e.ueberzogen, false);
  assert.equal(e.stufe, 'ueberlegen');
  assert.ok(e.offeneBeduerfnisse.length >= 3);
  assert.ok(e.hinweise.some((h) => /wichtiger|gebraucht/.test(h)));
});

test('super: alle Bedürfnisse versorgt + gespart (und bezahlbar)', () => {
  const beduerfnisse = idsVon('beduerfnis');
  const sparen = idsVon('sparen');
  const auswahl = [...beduerfnisse, ...sparen];
  assert.ok(summe(daten.posten.filter((p) => auswahl.includes(p.id))) <= frei(daten), 'Bedürfnisse+Sparen müssen bezahlbar sein');
  const e = bewerteAuswahl(daten, auswahl);
  assert.equal(e.stufe, 'super');
  assert.equal(e.offeneBeduerfnisse.length, 0);
  assert.ok(e.hinweise.some((h) => /Bedürfnisse sind versorgt/.test(h)));
  assert.ok(e.hinweise.some((h) => /Spartopf/.test(h)));
});

test('gut: Bedürfnisse versorgt, Budget exakt aufgebraucht ohne Spartopf', () => {
  // konstruiert: Bedürfnisse + Wünsche bis exakt zum Budget (rest 0, kein sparen)
  const beduerfnisse = daten.posten.filter((p) => p.art === 'beduerfnis');
  const budget = frei(daten);
  let rest = budget - summe(beduerfnisse);
  const wuensche = [];
  for (const w of daten.posten.filter((p) => p.art === 'wunsch').sort((a, b) => b.preis - a.preis)) {
    if (w.preis <= rest) { wuensche.push(w); rest -= w.preis; }
  }
  const auswahl = [...beduerfnisse, ...wuensche].map((p) => p.id);
  const e = bewerteAuswahl(daten, auswahl);
  assert.equal(e.ueberzogen, false);
  assert.equal(e.offeneBeduerfnisse.length, 0);
  assert.equal(e.stufe, e.rest > 0 ? 'super' : 'gut');
});

test('bewerteAuswahl ist rein (Daten unverändert)', () => {
  const vorher = JSON.stringify(daten);
  bewerteAuswahl(daten, idsVon('beduerfnis'));
  assert.equal(JSON.stringify(daten), vorher);
});
