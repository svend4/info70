import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { zeigerWinkel, uhrText, uhrOptionen, pruefeFragen, rangFuer } from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/fragen.json', import.meta.url), 'utf8'));

test('zeigerWinkel: Stunden- und Minutenzeiger stimmen', () => {
  assert.deepEqual(zeigerWinkel(3, 0), { minute: 0, stunde: 90 });
  assert.deepEqual(zeigerWinkel(6, 30), { minute: 180, stunde: 195 });
  assert.deepEqual(zeigerWinkel(9, 45), { minute: 270, stunde: 292.5 });
  assert.deepEqual(zeigerWinkel(12, 0), { minute: 0, stunde: 0 });
});

test('uhrText: kindgerechte Sprache (voll, halb, Viertel nach/vor)', () => {
  assert.equal(uhrText(3, 0), '3 Uhr');
  assert.equal(uhrText(4, 30), 'halb 5');
  assert.equal(uhrText(2, 15), 'Viertel nach 2');
  assert.equal(uhrText(5, 45), 'Viertel vor 6');
  assert.equal(uhrText(12, 30), 'halb 1', 'Übergang über 12');
  assert.equal(uhrText(12, 0), '12 Uhr');
});

test('Fragenbank gültig: beide Typen, Uhr-Minuten nur 0/15/30/45, Optionen eindeutig', () => {
  assert.deepEqual(pruefeFragen(daten), []);
  assert.ok(daten.fragen.filter((q) => q.typ === 'uhr').length >= 5);
  assert.ok(daten.fragen.filter((q) => q.typ === 'kalender').length >= 5);
});

test('uhrOptionen: erste Option ist die richtige Zeit', () => {
  const q = daten.fragen.find((x) => x.id === 'u03');
  const opt = uhrOptionen(q);
  assert.equal(opt[0], 'halb 5');
  assert.equal(opt.length, 3);
  assert.equal(new Set(opt).size, 3);
});

test('Kalender-Wissen stimmt (Stichproben)', () => {
  const woche = daten.fragen.find((q) => /Tage hat eine Woche/.test(q.frage ?? ''));
  assert.equal(woche.antworten[woche.korrekt], 'Sieben');
  const dienstag = daten.fragen.find((q) => /nach dem Dienstag/.test(q.frage ?? ''));
  assert.equal(dienstag.antworten[dienstag.korrekt], 'Der Mittwoch');
  const jahreszeiten = daten.fragen.find((q) => /Jahreszeiten/.test(q.frage ?? ''));
  assert.equal(jahreszeiten.antworten[jahreszeiten.korrekt], 'Vier');
});

test('pruefeFragen erkennt kaputte Uhr-Frage (Ablenker == richtige Zeit)', () => {
  const kaputt = { fragen: [...daten.fragen, { id: 'x', typ: 'uhr', zeit: { stunde: 3, minute: 0 }, ablenker: [{ stunde: 3, minute: 0 }, { stunde: 5, minute: 0 }], erklaerung: 'Ablenker gleich richtige Zeit – ungültig' }] };
  assert.ok(pruefeFragen(kaputt).some((f) => /klingt wie die richtige/.test(f)));
});

test('rangFuer', () => {
  assert.equal(rangFuer(daten.raenge, 0).ab, 0);
  assert.equal(rangFuer(daten.raenge, 100).titel, daten.raenge[daten.raenge.length - 1].titel);
});
