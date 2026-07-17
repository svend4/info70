import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CHECKLISTE, MAX_PUNKTE, punkte, einordnung, rangliste, LEKTIONEN } from '../logik.mjs';

test('Checkliste: mind. 6 Kriterien, je Frage + Warum + Wofür, eindeutige Codes', () => {
  assert.ok(CHECKLISTE.length >= 6);
  assert.equal(MAX_PUNKTE, CHECKLISTE.length);
  const codes = CHECKLISTE.map((k) => k.code);
  assert.equal(new Set(codes).size, codes.length, 'doppelte Codes');
  for (const k of CHECKLISTE) {
    assert.ok(k.frage?.length >= 15, `${k.code}: Frage fehlt`);
    assert.ok(k.warum?.length >= 20, `${k.code}: Warum fehlt (Perspektivwechsel!)`);
    assert.ok(k.fuer, `${k.code}: Kurz-Label fehlt`);
  }
  // Kernkriterien der Idee müssen dabei sein
  for (const pflicht of ['vorlesen', 'kontrast', 'ohne_ton']) {
    assert.ok(codes.includes(pflicht), `Pflichtkriterium fehlt: ${pflicht}`);
  }
});

test('punkte: zählt nur echte ja-Antworten', () => {
  assert.equal(punkte({}), 0);
  assert.equal(punkte({ vorlesen: true, kontrast: true }), 2);
  assert.equal(punkte({ vorlesen: true, kontrast: false, ohne_ton: 'ja' }), 1, 'nur boolean true zählt');
  const alle = Object.fromEntries(CHECKLISTE.map((k) => [k.code, true]));
  assert.equal(punkte(alle), MAX_PUNKTE);
});

test('einordnung: drei klare Stufen', () => {
  assert.equal(einordnung(6).stufe, 'fair');
  assert.equal(einordnung(5).stufe, 'fair');
  assert.equal(einordnung(4).stufe, 'mittel');
  assert.equal(einordnung(3).stufe, 'mittel');
  assert.equal(einordnung(2).stufe, 'unfair');
  assert.equal(einordnung(0).stufe, 'unfair');
});

test('rangliste: fairste zuerst, bei Gleichstand stabil (Eingabe-Reihenfolge)', () => {
  const apps = [
    { name: 'A', antworten: { vorlesen: true } },                        // 1
    { name: 'B', antworten: { vorlesen: true, kontrast: true, ohne_ton: true } }, // 3
    { name: 'C', antworten: { kontrast: true } },                        // 1
  ];
  const r = rangliste(apps);
  assert.deepEqual(r.map((x) => x.name), ['B', 'A', 'C'], 'B vorn; A vor C bei Gleichstand (Eingabe-Reihenfolge)');
  assert.equal(r[0].punkte, 3);
  assert.ok(r[0].emoji, 'Einordnung ist eingemischt');
});

test('Lektionen: Barriere erklärt, "barrierefrei = fair", betrifft viele, BFSG', () => {
  const text = LEKTIONEN.join(' ');
  assert.match(text, /Barriere/, 'Begriff erklärt');
  assert.match(text, /fair/i, 'Fairness-Kern');
  assert.match(text, /alle|ALLE/, 'Teilhabe');
  assert.match(text, /Barrierefreiheitsstärkungsgesetz|BFSG|2025/, 'Rechtsrahmen');
});
