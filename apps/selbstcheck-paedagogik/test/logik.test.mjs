import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { zaehleBeantwortet, auswertungFuerBereich, berichtText } from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/fragen.json', import.meta.url), 'utf8'));
const kinder = daten.bereiche[0];
const id = (i) => kinder.aussagen[i].id;

test('zaehleBeantwortet zählt nur gültige Stufen', () => {
  assert.equal(zaehleBeantwortet(daten, {}), 0);
  assert.equal(zaehleBeantwortet(daten, { [id(0)]: 'voll', [id(1)]: 'eher-nicht' }), 2);
  // Müll, unbekannte Stufen und Prototyp-Schlüssel dürfen nicht zählen:
  assert.equal(zaehleBeantwortet(daten, { [id(0)]: 'super', [id(1)]: 'toString', quatsch: 'voll' }), 0);
});

test('auswertungFuerBereich sortiert in Stärken / auf gutem Weg', () => {
  const status = { [id(0)]: 'voll', [id(1)]: 'voll', [id(2)]: 'eher', [id(3)]: 'eher-nicht' };
  const aus = auswertungFuerBereich(kinder, status);
  assert.deepEqual(aus.staerken.map((a) => a.id), [id(0), id(1)]);
  assert.deepEqual(aus.aufGutemWeg.map((a) => a.id), [id(2)]);
  assert.equal(aus.offen, 2, 'zwei Aussagen unbeantwortet');
});

test('Wachstumsimpuls: genau einer, von der am niedrigsten eingeschätzten Aussage', () => {
  const status = { [id(0)]: 'eher-nicht', [id(1)]: 'nicht', [id(2)]: 'voll' };
  const aus = auswertungFuerBereich(kinder, status);
  assert.equal(aus.impulsText, kinder.aussagen[1].impuls, '"trifft nicht zu" schlägt "eher nicht"');
});

test('Wachstumsimpuls: bei Gleichstand entscheidet die Reihenfolge', () => {
  const status = { [id(2)]: 'eher-nicht', [id(4)]: 'eher-nicht' };
  const aus = auswertungFuerBereich(kinder, status);
  assert.equal(aus.impulsText, kinder.aussagen[2].impuls);
});

test('Wachstumsimpuls: alles "trifft zu" -> wertschätzender Bereichs-Impuls', () => {
  const status = Object.fromEntries(kinder.aussagen.map((a) => [a.id, 'voll']));
  const aus = auswertungFuerBereich(kinder, status);
  assert.equal(aus.impulsText, kinder.impulsWennStark);
  assert.equal(aus.staerken.length, 6);
});

test('Wachstumsimpuls: ohne Antworten bleibt der Bereich offen (null)', () => {
  const aus = auswertungFuerBereich(kinder, {});
  assert.equal(aus.impulsText, null);
  assert.equal(aus.offen, 6);
});

test('berichtText: privater Text mit Hinweis "nur für dich", ohne Zahlen-Wertung', () => {
  const status = { [id(0)]: 'voll', [id(1)]: 'eher-nicht' };
  const bericht = berichtText(daten, status, '12.07.2026');
  assert.ok(bericht.includes('Nur für dich'), 'Privat-Hinweis fehlt');
  assert.ok(bericht.includes('kein Arbeitgeber-Zugriff'), 'Arbeitgeber-Hinweis fehlt');
  assert.ok(bericht.includes('keine Diagnose'), 'Diagnose-Abgrenzung fehlt');
  assert.ok(bericht.includes('12.07.2026'), 'Datum fehlt');
  for (const b of daten.bereiche) assert.ok(bericht.includes(b.name), `Bereich ${b.name} fehlt`);
  assert.ok(bericht.includes(kinder.aussagen[0].staerke), 'Stärke fehlt');
  assert.ok(bericht.includes(kinder.aussagen[1].impuls), 'Wachstumsimpuls fehlt');
  assert.ok(!bericht.includes('%'), 'keine Prozentwerte im Bericht');
  assert.ok(!/\bPunkte?\b/i.test(bericht), 'kein Punktestand im Bericht');
});

test('berichtText: unbearbeitete Bereiche werden freundlich benannt', () => {
  const bericht = berichtText(daten, {}, '12.07.2026');
  const treffer = bericht.match(/noch nicht angeschaut/g) ?? [];
  assert.equal(treffer.length, 4, 'alle 4 Bereiche offen');
});
