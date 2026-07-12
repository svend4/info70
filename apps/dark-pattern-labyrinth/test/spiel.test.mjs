import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { neuesSpiel, waehle, istVorbei, ehrlicheOption, rang, lexikon } from '../spiel.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/stationen.json', import.meta.url), 'utf8'));

test('waehle: ehrliche Wahl gibt einen Punkt, Falle keinen; Stand ist unveränderlich', () => {
  const start = neuesSpiel(7);
  const nachEhrlich = waehle(start, false);
  assert.deepEqual({ index: nachEhrlich.index, punkte: nachEhrlich.punkte }, { index: 1, punkte: 1 });
  const nachFalle = waehle(nachEhrlich, true);
  assert.deepEqual({ index: nachFalle.index, punkte: nachFalle.punkte }, { index: 2, punkte: 1 });
  assert.deepEqual(start, neuesSpiel(7), 'waehle darf den alten Stand nicht verändern');
});

test('kompletter Lauf: nach 7 Entscheidungen vorbei, nur ehrliche Wahlen ergeben volle Punktzahl', () => {
  let stand = neuesSpiel(daten.stationen.length);
  for (const s of daten.stationen) {
    assert.ok(!istVorbei(stand), `${s.id}: Lauf darf noch nicht vorbei sein`);
    stand = waehle(stand, ehrlicheOption(s).istFalle);
  }
  assert.ok(istVorbei(stand));
  assert.equal(stand.punkte, daten.stationen.length, 'volle Punktzahl bei lauter ehrlichen Wahlen');
  assert.equal(waehle(stand, false).index, stand.index, 'nach dem Ende ändert waehle nichts mehr');
});

test('ehrlicheOption liefert für jede Station genau die Nicht-Falle', () => {
  for (const s of daten.stationen) {
    const o = ehrlicheOption(s);
    assert.ok(o, `${s.id}: ehrliche Option fehlt`);
    assert.equal(o.istFalle, false, s.id);
  }
});

test('rang: 0 Punkte = niedrigster Rang, volle Punkte = höchster, jeder Punktestand hat einen Rang', () => {
  assert.equal(rang(0, daten.raenge).titel, daten.raenge[0].titel);
  const voll = rang(daten.stationen.length, daten.raenge);
  assert.equal(voll.ab, Math.max(...daten.raenge.map((r) => r.ab)));
  for (let punkte = 0; punkte <= daten.stationen.length; punkte++) {
    const r = rang(punkte, daten.raenge);
    assert.ok(r && r.ab <= punkte, `Punktestand ${punkte} braucht einen erreichten Rang`);
  }
});

test('lexikon: alle 7 Muster mit Name und Erklärung für den Abschluss-Bildschirm', () => {
  const eintraege = lexikon(daten.stationen);
  assert.equal(eintraege.length, daten.stationen.length);
  for (const e of eintraege) {
    assert.ok(e.name.length >= 5 && e.erklaerung.length >= 40);
  }
});
