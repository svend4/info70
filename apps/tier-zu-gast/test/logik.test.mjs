import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { maxPunkte, rangFuer, ergebnisSatz, pruefeSzenarien } from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/szenarien.json', import.meta.url), 'utf8'));
const RUNDE = 10;

test('Szenarien sind gültig: je Szene genau eine 2er- und mindestens eine 0er-Option', () => {
  assert.deepEqual(pruefeSzenarien(daten, RUNDE), []);
  assert.equal(daten.szenarien.length, 10);
});

test('Tierschutz-Kernbotschaften sitzen: nie einzeln, nachtaktiv, nicht hochheben, Tierarzt', () => {
  const je = Object.fromEntries(daten.szenarien.map((s) => [s.id, s]));
  assert.match(je.t01.erklaerung, /Artgenossen/);
  assert.match(je.t02.erklaerung, /nachtaktiv/);
  assert.match(je.t03.erklaerung, /Fluchttiere|Angst/);
  assert.match(je.t08.erklaerung, /Tierärzt|Tierarzt/);
  assert.match(je.t10.erklaerung, /nicht schwitzen/);
});

test('Die beste Option ist nie Wegschauen: 2-Punkte-Texte enthalten aktives Handeln', () => {
  for (const s of daten.szenarien) {
    const beste = s.optionen.find((o) => o.wert === 2);
    assert.ok(beste.text.length > 20, `${s.id}: beste Option ist konkret`);
    assert.doesNotMatch(beste.text, /^Nichts/, s.id);
  }
});

test('rangFuer/ergebnisSatz: Ränge erreichbar und monoton', () => {
  assert.equal(rangFuer(daten.raenge, 0).emoji, '🌱');
  assert.equal(rangFuer(daten.raenge, maxPunkte(RUNDE)).emoji, '🏅');
  assert.equal(maxPunkte(RUNDE), 20);
  const abs = daten.raenge.map((r) => r.ab);
  assert.deepEqual([...abs].sort((a, b) => a - b), abs);
  assert.match(ergebnisSatz(daten.raenge, 20, RUNDE), /Verantwortungs-Profi/);
});

test('Validator meldet kaputte Szenen (zwei 2er-Optionen, unerreichbarer Rang)', () => {
  const kaputt = structuredClone(daten);
  kaputt.szenarien[0].optionen[1].wert = 2;
  assert.ok(pruefeSzenarien(kaputt, RUNDE).some((f) => f.includes('genau EINE')));
  const rang = structuredClone(daten);
  rang.raenge.push({ ab: 99, titel: 'Unerreichbar', emoji: '🚫' });
  assert.ok(pruefeSzenarien(rang, RUNDE).some((f) => f.includes('unerreichbar')));
});

test('Halbe Punkte nur für halb richtige Handlungen: Spiegel und Wecken geben 0', () => {
  const spiegel = daten.szenarien.flatMap((s) => s.optionen.filter((o) => /Spiegel/.test(o.text)));
  assert.ok(spiegel.length >= 2, 'Spiegel kommt als Scheinlösung vor');
  for (const o of spiegel) assert.equal(o.wert, 0, 'ein Spiegel ersetzt keinen Artgenossen');
  const hamster = daten.szenarien.find((s) => s.id === 't02');
  for (const o of hamster.optionen.filter((o) => /weck|hole ihn/i.test(o.text))) {
    assert.equal(o.wert, 0, 'nachtaktives Tier am Tag wecken ist nie halb richtig');
  }
});

test('Kein Beschämen in Erklärungen, Erwachsene werden bei Gefahr einbezogen', () => {
  for (const s of daten.szenarien) {
    assert.doesNotMatch(s.erklaerung, /dumm|böse|schäm|Versager/i, s.id);
  }
  for (const id of ['t07', 't08', 't10']) {
    const s = daten.szenarien.find((x) => x.id === id);
    const beste = s.optionen.find((o) => o.wert === 2);
    assert.match(beste.text + s.erklaerung, /Erwachsen|Tierärzt|Tierarzt/, `${id}: Erwachsene im Boot`);
  }
});
