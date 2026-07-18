import { test } from 'node:test';
import assert from 'node:assert/strict';
import { neueWahl, stimmeAb, fertig, offen, ergebnis } from '../logik.mjs';

test('neueWahl: Zähler auf 0, erwartete Wählerzahl gesetzt', () => {
  const w = neueWahl('Ausflug?', ['Zoo', 'Museum', 'Wald'], 5);
  assert.deepEqual(w.stimmen, [0, 0, 0]);
  assert.equal(w.abgegeben, 0);
  assert.equal(w.erwartet, 5);
  // keine Wähler-Zuordnung im Datenmodell
  assert.ok(!('waehler' in w) && !('stimmenVon' in w), 'geheim: keine Personen-Zuordnung');
});

test('stimmeAb: erhöht nur den gewählten Zähler', () => {
  let w = neueWahl('F', ['A', 'B'], 3);
  w = stimmeAb(w, 1);
  assert.deepEqual(w.stimmen, [0, 1]);
  assert.equal(w.abgegeben, 1);
  w = stimmeAb(w, 0);
  assert.deepEqual(w.stimmen, [1, 1]);
});

test('fertig/offen: erst nach der letzten erwarteten Stimme', () => {
  let w = neueWahl('F', ['A', 'B'], 2);
  assert.equal(fertig(w), false);
  assert.equal(offen(w), 2);
  w = stimmeAb(w, 0);
  assert.equal(fertig(w), false);
  assert.equal(offen(w), 1);
  w = stimmeAb(w, 1);
  assert.equal(fertig(w), true);
  assert.equal(offen(w), 0);
  // nach „fertig“ zählt keine weitere Stimme
  const nachher = stimmeAb(w, 0);
  assert.deepEqual(nachher.stimmen, w.stimmen, 'keine Überstimmen');
});

test('ergebnis: absteigend sortiert, eindeutiger Gewinner', () => {
  let w = neueWahl('F', ['Zoo', 'Museum'], 3);
  w = stimmeAb(w, 0); w = stimmeAb(w, 0); w = stimmeAb(w, 1);
  const e = ergebnis(w);
  assert.equal(e.zeilen[0].text, 'Zoo');
  assert.equal(e.zeilen[0].stimmen, 2);
  assert.equal(e.gewinner, 'Zoo');
  assert.equal(e.gleichstand, false);
  assert.equal(e.gesamt, 3);
});

test('ergebnis: Gleichstand wird erkannt (kein Gewinner)', () => {
  let w = neueWahl('F', ['A', 'B'], 2);
  w = stimmeAb(w, 0); w = stimmeAb(w, 1);
  const e = ergebnis(w);
  assert.equal(e.gleichstand, true);
  assert.equal(e.gewinner, null);
});
