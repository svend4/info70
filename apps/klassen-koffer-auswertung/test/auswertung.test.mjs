import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pruefeKoffer, aggregiere, stufe, baueBericht, KOFFER_ART, KOFFER_VERSION } from '../auswertung.mjs';

function koffer(tier, antworten, quelle = 'nachrichten-detektive') {
  return { art: KOFFER_ART, version: KOFFER_VERSION, quelle, tier, antworten };
}

test('pruefeKoffer: gültige Datei hat keine Fehler', () => {
  const k = koffer('Fuchs', [{ id: 'f1', text: 'Frage 1', richtig: true }]);
  assert.deepEqual(pruefeKoffer(k), []);
});

test('pruefeKoffer: erkennt falsche Art, Version und fehlende Felder', () => {
  assert.ok(pruefeKoffer(null).length >= 1);
  assert.ok(pruefeKoffer({ art: 'anderes', version: 1, quelle: 'x', tier: 'Fuchs', antworten: [{ id: 'a', richtig: true }] }).some((f) => /keine Ergebnis-Koffer/.test(f)));
  assert.ok(pruefeKoffer({ art: KOFFER_ART, version: 99, quelle: 'x', tier: 'Fuchs', antworten: [{ id: 'a', richtig: true }] }).some((f) => /Version/.test(f)));
  assert.ok(pruefeKoffer({ art: KOFFER_ART, version: 1, quelle: '', tier: '', antworten: [] }).length >= 3);
});

test('pruefeKoffer: verbietet personenbezogene Felder (name/klarname)', () => {
  const k = { ...koffer('Fuchs', [{ id: 'f1', richtig: true }]), name: 'Max Mustermann' };
  assert.ok(pruefeKoffer(k).some((f) => /Personendaten/.test(f)), 'name muss abgelehnt werden');
});

test('aggregiere: zählt richtig/falsch je Frage über mehrere Geräte', () => {
  const liste = [
    koffer('Fuchs', [{ id: 'f1', text: 'Werbung erkennen', richtig: false }, { id: 'f2', text: 'Quelle prüfen', richtig: true }]),
    koffer('Igel', [{ id: 'f1', text: 'Werbung erkennen', richtig: false }, { id: 'f2', text: 'Quelle prüfen', richtig: true }]),
    koffer('Dachs', [{ id: 'f1', text: 'Werbung erkennen', richtig: true }, { id: 'f2', text: 'Quelle prüfen', richtig: true }]),
  ];
  const agg = aggregiere(liste);
  assert.equal(agg.geraete, 3);
  assert.deepEqual(agg.tiere, ['Fuchs', 'Igel', 'Dachs']);
  assert.equal(agg.quelle, 'nachrichten-detektive');
  const f1 = agg.fragen.find((f) => f.id === 'f1');
  assert.equal(f1.falsch, 2);
  assert.equal(f1.richtig, 1);
  assert.ok(Math.abs(f1.quoteFalsch - 2 / 3) < 1e-9);
});

test('aggregiere: schwierigste Frage (höchste Falsch-Quote) steht oben', () => {
  const liste = [
    koffer('A', [{ id: 'leicht', richtig: true }, { id: 'schwer', richtig: false }]),
    koffer('B', [{ id: 'leicht', richtig: true }, { id: 'schwer', richtig: false }]),
  ];
  const agg = aggregiere(liste);
  assert.equal(agg.fragen[0].id, 'schwer', 'schwerste zuerst');
  assert.equal(agg.fragen[0].stufe, 'schwer');
  assert.equal(agg.fragen.at(-1).id, 'leicht');
  assert.equal(agg.fragen.at(-1).stufe, 'leicht');
});

test('stufe: Schwellen leicht/mittel/schwer', () => {
  assert.equal(stufe(0), 'leicht');
  assert.equal(stufe(0.29), 'leicht');
  assert.equal(stufe(0.3), 'mittel');
  assert.equal(stufe(0.59), 'mittel');
  assert.equal(stufe(0.6), 'schwer');
  assert.equal(stufe(1), 'schwer');
});

test('baueBericht: enthält App, Gerätezahl und keine Personendaten-Zusage', () => {
  const agg = aggregiere([koffer('Fuchs', [{ id: 'f1', text: 'Frage 1', richtig: false }])]);
  const bericht = baueBericht(agg, { stand: '2026-07-18' });
  assert.match(bericht, /Klassen-Koffer-Auswertung/);
  assert.match(bericht, /nachrichten-detektive/);
  assert.match(bericht, /Geräte \(Tiernamen\): 1/);
  assert.match(bericht, /keine personenbezogenen Daten/);
});
