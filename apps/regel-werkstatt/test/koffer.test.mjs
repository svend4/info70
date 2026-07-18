import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sortiere, packeKoffer, pruefeKoffer, vereinigeKoffer, VORSCHLAEGE, KOFFER_ART } from '../koffer.mjs';

test('sortiere: meiste Stimmen zuerst, stabil bei Gleichstand', () => {
  const regeln = [
    { text: 'A', stimmen: 1 },
    { text: 'B', stimmen: 3 },
    { text: 'C', stimmen: 1 },
  ];
  assert.deepEqual(sortiere(regeln).map((r) => r.text), ['B', 'A', 'C']);
});

test('packeKoffer/pruefeKoffer: gültige Datei besteht die Prüfung', () => {
  const datei = packeKoffer({ titel: 'Klasse 4b', regeln: [{ text: 'Handys aus beim Essen', stimmen: 5 }] });
  const inhalt = JSON.parse(datei);
  assert.equal(inhalt.art, KOFFER_ART);
  assert.deepEqual(pruefeKoffer(inhalt), []);
});

test('pruefeKoffer: erkennt fremde Dateien und kaputte Regeln', () => {
  assert.ok(pruefeKoffer(null).length >= 1);
  assert.ok(pruefeKoffer({ art: 'was-anderes' }).length >= 1);
  assert.ok(pruefeKoffer({ art: KOFFER_ART, version: 1, regeln: [] }).length >= 1, 'leere Regeln');
  assert.ok(pruefeKoffer({ art: KOFFER_ART, version: 1, regeln: [{ text: '', stimmen: -1 }] }).length >= 1);
});

test('vereinigeKoffer: gleiche Regel addiert Stimmen, neue Regel wird angehängt', () => {
  const laufend = [{ text: 'Handys aus', stimmen: 3 }, { text: 'Kein Bildschirm nachts', stimmen: 2 }];
  const importiert = { regeln: [{ text: 'Handys aus', stimmen: 4 }, { text: 'Passwort geheim', stimmen: 1 }] };
  const zusammen = vereinigeKoffer(laufend, importiert);
  const map = Object.fromEntries(zusammen.map((r) => [r.text, r.stimmen]));
  assert.equal(map['Handys aus'], 7, 'Stimmen addiert');
  assert.equal(map['Kein Bildschirm nachts'], 2, 'unverändert');
  assert.equal(map['Passwort geheim'], 1, 'neue Regel angehängt');
  assert.equal(zusammen.length, 3);
});

test('Startvorschläge: sinnvolle Medienregeln, kurze Sätze', () => {
  assert.ok(VORSCHLAEGE.length >= 4);
  for (const v of VORSCHLAEGE) {
    assert.ok(v.length >= 12 && v.endsWith('.'), `Vorschlag unpassend: ${v}`);
  }
  const alle = VORSCHLAEGE.join(' ').toLowerCase();
  assert.match(alle, /passwort|foto|hilfe|handy|bildschirm/, 'deckt typische Medien-Themen ab');
});
