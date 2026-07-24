import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pruefeBausteine, waehleElemente, startSatz, baueGeruest } from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/bausteine.json', import.meta.url), 'utf8'));

test('Baustein-Bank gültig: Helden/Orte/Probleme + 4-stufige Treppe', () => {
  assert.deepEqual(pruefeBausteine(daten), []);
  assert.equal(daten.treppe.length, 4);
  const stufenIds = daten.treppe.map((s) => s.id);
  assert.deepEqual(stufenIds, ['anfang', 'los', 'aber', 'ende']);
});

test('Kein Aufnehmen/Speichern: Hinweis nennt das ausdrücklich', () => {
  assert.match(daten.hinweis, /NICHTS.*aufgenommen|kein Mikrofon|erzählt LAUT/i);
});

test('waehleElemente: injizierbarer Wähler liefert Held/Ort/Problem', () => {
  const erste = (l) => l[0];
  const e = waehleElemente(daten, erste);
  assert.equal(e.held, daten.helden[0]);
  assert.equal(e.ort, daten.orte[0]);
  assert.equal(e.problem, daten.probleme[0]);
});

test('startSatz + baueGeruest: Startsatz und 4 Impuls-Stufen', () => {
  const e = { held: 'ein mutiger kleiner Igel', ort: 'in einem tiefen Wald', problem: 'hat etwas verloren' };
  assert.match(startSatz(e), /^Es war einmal ein mutiger kleiner Igel in einem tiefen Wald\./);
  const g = baueGeruest(daten, e);
  assert.equal(g.stufen.length, 4);
  for (const s of g.stufen) assert.ok(s.impuls.length >= 15, `Impuls ${s.id}`);
  assert.match(g.start, /Igel/);
});
