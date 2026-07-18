import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TAGE, AMPEL, neueWette, fuegeMitglied, entferneMitglied, setzeTag, wochenBilanz, bewertung, familienBilanz } from '../wette.mjs';

test('TAGE: sieben Wochentage, AMPEL: drei Stufen', () => {
  assert.equal(TAGE.length, 7);
  assert.deepEqual(Object.keys(AMPEL).sort(), ['gelb', 'gruen', 'rot']);
});

test('fuegeMitglied: fügt Mitglied mit Ziel hinzu, leerer Name ignoriert', () => {
  let w = neueWette();
  w = fuegeMitglied(w, 'Mama', 'unter 1 Stunde');
  w = fuegeMitglied(w, '  ', 'x');
  assert.equal(w.mitglieder.length, 1);
  assert.equal(w.mitglieder[0].name, 'Mama');
  assert.equal(w.mitglieder[0].ziel, 'unter 1 Stunde');
  assert.deepEqual(w.mitglieder[0].tage, {});
});

test('setzeTag: setzt Selbstauskunft, ungültiger Tag/Ampel ignoriert', () => {
  let w = fuegeMitglied(neueWette(), 'Kind', 'Ziel');
  w = setzeTag(w, 0, 'Mo', 'gruen');
  w = setzeTag(w, 0, 'Di', 'rot');
  w = setzeTag(w, 0, 'XX', 'gruen'); // ungültiger Tag
  w = setzeTag(w, 0, 'Mi', 'lila'); // ungültige Ampel
  assert.deepEqual(w.mitglieder[0].tage, { Mo: 'gruen', Di: 'rot' });
});

test('wochenBilanz: zählt Ampelfarben und erfasste Tage', () => {
  let w = fuegeMitglied(neueWette(), 'Kind', 'Ziel');
  w = setzeTag(w, 0, 'Mo', 'gruen');
  w = setzeTag(w, 0, 'Di', 'gruen');
  w = setzeTag(w, 0, 'Mi', 'gelb');
  w = setzeTag(w, 0, 'Do', 'rot');
  const b = wochenBilanz(w.mitglieder[0]);
  assert.deepEqual(b, { gruen: 2, gelb: 1, rot: 1, erfasst: 4 });
});

test('bewertung: Schwellen (leer, stark, gut, schwer)', () => {
  assert.match(bewertung({ gruen: 0, gelb: 0, rot: 0, erfasst: 0 }), /Noch keine/);
  assert.match(bewertung({ gruen: 5, gelb: 0, rot: 0, erfasst: 5 }), /Stark/);
  assert.match(bewertung({ gruen: 2, gelb: 2, rot: 1, erfasst: 5 }), /Gut dabei/);
  assert.match(bewertung({ gruen: 0, gelb: 1, rot: 4, erfasst: 5 }), /schwer/);
});

test('familienBilanz: je Mitglied eigene Bilanz (Selbstauskunft, kein Fremdzugriff)', () => {
  let w = neueWette();
  w = fuegeMitglied(w, 'Mama', 'unter 1h');
  w = fuegeMitglied(w, 'Kind', 'Pausen machen');
  w = setzeTag(w, 0, 'Mo', 'gruen');
  w = setzeTag(w, 1, 'Mo', 'rot');
  const fb = familienBilanz(w);
  assert.equal(fb.length, 2);
  assert.equal(fb[0].name, 'Mama');
  assert.equal(fb[0].bilanz.gruen, 1);
  assert.equal(fb[1].bilanz.rot, 1);
  // Datenmodell trägt keine Fremdüberwachungs-Felder
  assert.ok(!JSON.stringify(w).match(/ueberwach|fremd|tracking/i), 'keine Überwachungsfelder');
});

test('entferneMitglied: entfernt per Index', () => {
  let w = fuegeMitglied(fuegeMitglied(neueWette(), 'A', ''), 'B', '');
  w = entferneMitglied(w, 0);
  assert.equal(w.mitglieder.length, 1);
  assert.equal(w.mitglieder[0].name, 'B');
});
