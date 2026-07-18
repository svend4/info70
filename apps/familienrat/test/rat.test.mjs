import { test } from 'node:test';
import assert from 'node:assert/strict';
import { VORLAGEN, neueAbstimmung, stimme, ergebnis, baueBeschluss, packeFamilienKoffer, pruefeFamilienKoffer, vereinigeFamilienKoffer, KOFFER_ART, KOFFER_VERSION } from '../rat.mjs';

test('VORLAGEN: mindestens 4, jede mit Frage und ≥2 Optionen', () => {
  assert.ok(VORLAGEN.length >= 4);
  for (const v of VORLAGEN) {
    assert.ok(v.titel && v.frage, `Vorlage unvollständig: ${v.titel}`);
    assert.ok(v.optionen.length >= 2, `zu wenige Optionen: ${v.titel}`);
  }
});

test('neueAbstimmung + stimme: Zähler starten bei 0 und steigen einzeln', () => {
  let a = neueAbstimmung('Frage?', ['A', 'B', 'C']);
  assert.deepEqual(a.stimmen, [0, 0, 0]);
  a = stimme(a, 1);
  a = stimme(a, 1);
  a = stimme(a, 0);
  assert.deepEqual(a.stimmen, [1, 2, 0]);
  // ungültiger Index ändert nichts
  assert.deepEqual(stimme(a, 9).stimmen, a.stimmen);
});

test('ergebnis: sortiert, eindeutiger Gewinner und Gleichstand', () => {
  let a = neueAbstimmung('F', ['Zoo', 'Museum']);
  a = stimme(a, 0); a = stimme(a, 0); a = stimme(a, 1);
  const e = ergebnis(a);
  assert.equal(e.zeilen[0].text, 'Zoo');
  assert.equal(e.gewinner, 'Zoo');
  assert.equal(e.gleichstand, false);
  assert.equal(e.gesamt, 3);

  let b = neueAbstimmung('F', ['A', 'B']);
  b = stimme(b, 0); b = stimme(b, 1);
  const eb = ergebnis(b);
  assert.equal(eb.gleichstand, true);
  assert.equal(eb.gewinner, null);
});

test('baueBeschluss: enthält Frage, Beschluss und Unterschriftszeile', () => {
  let a = neueAbstimmung('Handyfreie Essenszeiten?', ['Ja', 'Nein']);
  a = stimme(a, 0); a = stimme(a, 0); a = stimme(a, 1);
  const text = baueBeschluss(a, { datum: '18.07.2026', thema: 'Mediennutzung' });
  assert.match(text, /Familienbeschluss/);
  assert.match(text, /Handyfreie Essenszeiten\?/);
  assert.match(text, /Beschlossen: Ja/);
  assert.match(text, /Unterschriften/);
  assert.match(text, /auch Eltern/);
});

test('Familien-Koffer: pack/prüfe/vereinige (Stimmen addieren)', () => {
  let a = neueAbstimmung('F', ['A', 'B']);
  a = stimme(a, 0);
  const text = packeFamilienKoffer(a);
  const obj = JSON.parse(text);
  assert.equal(obj.art, KOFFER_ART);
  assert.equal(obj.version, KOFFER_VERSION);
  assert.deepEqual(pruefeFamilienKoffer(obj), []);

  // zweites Gerät hat für dieselbe Frage abgestimmt
  const zweit = { art: KOFFER_ART, version: KOFFER_VERSION, frage: 'F', optionen: ['A', 'B'], stimmen: [0, 3] };
  const zusammen = vereinigeFamilienKoffer(a, zweit);
  assert.deepEqual(zusammen.stimmen, [1, 3], 'Stimmen werden addiert');
});

test('pruefeFamilienKoffer: erkennt falsche Art und unpassende Stimmen', () => {
  assert.ok(pruefeFamilienKoffer(null).length >= 1);
  assert.ok(pruefeFamilienKoffer({ art: 'x', version: 1, frage: 'F', optionen: ['A', 'B'], stimmen: [1, 2] }).some((f) => /Familienrat/.test(f)));
  assert.ok(pruefeFamilienKoffer({ art: KOFFER_ART, version: 1, frage: 'F', optionen: ['A', 'B'], stimmen: [1] }).some((f) => /passen nicht/.test(f)));
});

test('vereinigeFamilienKoffer: verschiedene Frage -> null (nicht zusammenführbar)', () => {
  const a = neueAbstimmung('F1', ['A', 'B']);
  const anders = { art: KOFFER_ART, version: 1, frage: 'F2', optionen: ['A', 'B'], stimmen: [1, 1] };
  assert.equal(vereinigeFamilienKoffer(a, anders), null);
});
