import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ergebnis, istBehandelt, packeProtokoll, protokollText, pruefeProtokoll, TOP_VORSCHLAEGE, KOFFER_ART } from '../koffer.mjs';

test('ergebnis: dafür/dagegen/unentschieden', () => {
  assert.equal(ergebnis(5, 2), 'angenommen');
  assert.equal(ergebnis(1, 4), 'abgelehnt');
  assert.equal(ergebnis(3, 3), 'unentschieden');
  assert.equal(ergebnis(0, 0), 'unentschieden');
});

test('istBehandelt: erst mit Abstimmung UND Begründung', () => {
  assert.ok(!istBehandelt({ abgestimmt: false, begruendung: 'x' }));
  assert.ok(!istBehandelt({ abgestimmt: true, begruendung: '' }));
  assert.ok(istBehandelt({ abgestimmt: true, begruendung: 'weil es fair ist' }));
});

test('packeProtokoll: gültige Datei, Ergebnis eingerechnet', () => {
  const datei = packeProtokoll({
    titel: 'Klassenrat 4b', datum: '2026-07-18',
    tops: [{ thema: 'Neue Regel', dafuer: 12, dagegen: 4, enthaltung: 2, begruendung: 'Mehrheit dafür' }],
  });
  const inhalt = JSON.parse(datei);
  assert.equal(inhalt.art, KOFFER_ART);
  assert.equal(inhalt.tops[0].ergebnis, 'angenommen');
  assert.deepEqual(pruefeProtokoll(inhalt), []);
});

test('protokollText: enthält TOP, Abstimmung, Ergebnis, Begründung', () => {
  const text = protokollText({
    titel: 'Rat', datum: '2026-07-18',
    tops: [{ thema: 'Pausenhof', dafuer: 3, dagegen: 1, enthaltung: 0, begruendung: 'sinnvoll' }],
  });
  assert.match(text, /TOP 1: Pausenhof/);
  assert.match(text, /3 dafür \/ 1 dagegen/);
  assert.match(text, /Ergebnis: angenommen/);
  assert.match(text, /Begründung: sinnvoll/);
});

test('pruefeProtokoll: erkennt fremde/kaputte Dateien', () => {
  assert.ok(pruefeProtokoll(null).length >= 1);
  assert.ok(pruefeProtokoll({ art: 'fremd' }).length >= 1);
  assert.ok(pruefeProtokoll({ art: KOFFER_ART, version: 1, titel: '', tops: [] }).length >= 1);
  assert.ok(pruefeProtokoll({ art: KOFFER_ART, version: 1, titel: 'x', tops: [{ thema: '' }] }).length >= 1);
});

test('Startvorschläge: sinnvolle Tagesordnungspunkte', () => {
  assert.ok(TOP_VORSCHLAEGE.length >= 3);
  for (const v of TOP_VORSCHLAEGE) assert.ok(v.length >= 10, `Vorschlag unpassend: ${v}`);
});
