import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { pruefeRegeln, sammleVertrag, PFLICHT_KATEGORIEN } from '../vertrag.mjs';

const daten = JSON.parse(readFileSync(new URL('../daten/regeln.json', import.meta.url)));

test('daten/regeln.json erfüllt das Schema', () => {
  assert.deepEqual(pruefeRegeln(daten), []);
});

test('alle drei Pflicht-Kategorien sind vorhanden', () => {
  const ids = daten.kategorien.map((k) => k.id);
  for (const pflicht of PFLICHT_KATEGORIEN) assert.ok(ids.includes(pflicht), `${pflicht} fehlt`);
  assert.equal(daten.kategorien.length, PFLICHT_KATEGORIEN.length);
});

test('jede Kategorie hat mindestens 6 Regeln', () => {
  for (const kat of daten.kategorien) {
    assert.ok(kat.regeln.length >= 6, `${kat.id} hat nur ${kat.regeln.length} Regeln`);
  }
});

test('jede Regel ist mindestens 20 Zeichen lang', () => {
  for (const kat of daten.kategorien) {
    for (const r of kat.regeln) {
      assert.ok(r.text.trim().length >= 20, `${kat.id}/${r.id} ist zu kurz: "${r.text}"`);
    }
  }
});

test('alle Regel-IDs sind eindeutig', () => {
  const ids = daten.kategorien.flatMap((k) => k.regeln.map((r) => r.id));
  assert.equal(new Set(ids).size, ids.length);
});

test('pruefeRegeln meldet fehlende Pflicht-Kategorien', () => {
  const fehler = pruefeRegeln({
    kategorien: [{ id: 'kind', name: 'Kind', regeln: Array.from({ length: 6 }, (_, i) => ({ id: `k${i}`, text: 'Das ist eine lange Regel.' })) }],
  });
  assert.ok(fehler.some((f) => f.includes('eltern')));
  assert.ok(fehler.some((f) => f.includes('gemeinsam')));
});

test('pruefeRegeln meldet zu kurze Regeln und zu wenige Regeln', () => {
  const daten = {
    kategorien: PFLICHT_KATEGORIEN.map((id) => ({
      id,
      name: id,
      regeln: [{ id: `${id}1`, text: 'zu kurz' }],
    })),
  };
  const fehler = pruefeRegeln(daten);
  assert.ok(fehler.some((f) => f.includes('weniger als 6')));
  assert.ok(fehler.some((f) => f.includes('kürzer als 20')));
});

test('pruefeRegeln meldet doppelte Regel-IDs', () => {
  const langerText = 'Eine ausreichend lange Regel für den Test.';
  const daten = {
    kategorien: PFLICHT_KATEGORIEN.map((id) => ({
      id,
      name: id,
      regeln: Array.from({ length: 6 }, () => ({ id: 'doppelt', text: langerText })),
    })),
  };
  assert.ok(pruefeRegeln(daten).some((f) => f.includes('doppelte Regel-IDs')));
});

test('pruefeRegeln lehnt Unfug ab', () => {
  assert.ok(pruefeRegeln(null).length > 0);
  assert.ok(pruefeRegeln({}).length > 0);
  assert.ok(pruefeRegeln({ kategorien: 'nein' }).length > 0);
});

test('sammleVertrag übernimmt nur ausgewählte Regeln', () => {
  const ergebnis = sammleVertrag(daten, { k1: true, e1: true }, ['  Kein Handy im Bad.  ', '   ']);
  const kind = ergebnis.abschnitte.find((a) => a.id === 'kind');
  const eltern = ergebnis.abschnitte.find((a) => a.id === 'eltern');
  const gemeinsam = ergebnis.abschnitte.find((a) => a.id === 'gemeinsam');
  assert.equal(kind.regeln.length, 1);
  assert.equal(eltern.regeln.length, 1);
  assert.equal(gemeinsam.regeln.length, 0);
  assert.deepEqual(ergebnis.eigene, ['Kein Handy im Bad.'], 'leere eigene Regeln fallen raus, Ränder werden getrimmt');
  assert.equal(ergebnis.anzahl, 3);
});

test('sammleVertrag ohne Auswahl liefert leeren Vertrag', () => {
  const ergebnis = sammleVertrag(daten);
  assert.equal(ergebnis.anzahl, 0);
  assert.equal(ergebnis.abschnitte.length, 3);
});
