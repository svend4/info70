import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import * as logik from '../logik.mjs';
import { erwarteteAntwort, pruefeFragen } from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/fragen.json', import.meta.url), 'utf8'));
const appQuelle = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');
const MIGRATION = /^try \{ localStorage\.removeItem\('klang\.rekord'\); \} catch \{\}$/m;
const elternSeite = await readFile(new URL('../eltern.html', import.meta.url), 'utf8');

test('Fragenbank ist selbstkonsistent (korrekt passt zu Parametern + Wortlaut)', () => {
  assert.deepEqual(pruefeFragen(daten), []);
  assert.ok(daten.fragen.length >= 8);
});

test('alle fünf Klang-Merkmale sind vertreten', () => {
  const typen = new Set(daten.fragen.map((q) => q.typ));
  for (const t of ['hoch-tief', 'laut-leise', 'schnell-langsam', 'hoch-runter', 'weich-scharf']) {
    assert.ok(typen.has(t), `Typ ${t} fehlt`);
  }
});

test('erwarteteAntwort: Polarität des Fragewortlauts wird beachtet', () => {
  assert.equal(erwarteteAntwort({ typ: 'hoch-tief', frage: 'Welcher Ton war höher?', toene: [{ hz: 200 }, { hz: 400 }] }), 1);
  assert.equal(erwarteteAntwort({ typ: 'hoch-tief', frage: 'Welcher Ton war tiefer?', toene: [{ hz: 200 }, { hz: 400 }] }), 0);
  assert.equal(erwarteteAntwort({ typ: 'laut-leise', frage: 'Welcher Ton war leiser?', toene: [{ gain: 0.3 }, { gain: 0.1 }] }), 1);
  assert.equal(erwarteteAntwort({ typ: 'schnell-langsam', frage: 'Welches Klopfen war schneller?', rhythmen: [{ schlaege: 2 }, { schlaege: 9 }] }), 1);
  assert.equal(erwarteteAntwort({ typ: 'hoch-runter', frage: 'oben/unten?', glide: { von: 200, bis: 600 } }), 0);
  assert.equal(erwarteteAntwort({ typ: 'hoch-runter', frage: 'oben/unten?', glide: { von: 600, bis: 200 } }), 1);
  assert.equal(erwarteteAntwort({ typ: 'weich-scharf', frage: 'x', klang: { wellenform: 'sine' } }), 0);
  assert.equal(erwarteteAntwort({ typ: 'weich-scharf', frage: 'x', klang: { wellenform: 'sawtooth' } }), 1);
});

test('pruefeFragen erkennt Inkonsistenz', () => {
  const kaputt = { fragen: [...daten.fragen.slice(0, 8), { id: 'x', typ: 'hoch-tief', frage: 'Welcher Ton war höher?', toene: [{ hz: 200 }, { hz: 400 }], optionen: ['a', 'b'], korrekt: 0, erklaerung: 'falsch herum, sollte 1 sein' }] };
  assert.ok(pruefeFragen(kaputt).some((f) => /korrekt=0.*folgt 1/.test(f)));
});

test('Kinder werden nicht bewertet: keine Rang-Funktion, keine Raenge in den Daten, kein Zaehler im App-Code', () => {
  assert.equal(logik.rangFuer, undefined, 'logik.mjs hat keine Rang-Funktion mehr');
  assert.ok(!('raenge' in daten), 'die Daten haben keine Raenge');
  const ohneMigration = appQuelle.replace(MIGRATION, '');
  assert.doesNotMatch(ohneMigration, /punkte|rangFuer|raenge|rekord|richtig gehört`/i, 'app.mjs fuehrt weder Zaehler noch Rang noch Rekord, nur die Migrationszeile nennt den alten Schluessel');
  assert.doesNotMatch(appQuelle, /Geschafft|🏆|🌟/, 'kein Titel Geschafft, kein Pokal, kein Stern');
});

test('Speicherregel: die App speichert nichts, darum keine Karte und kein Loeschknopf; nur der alte Schluessel wird einmal entfernt', () => {
  assert.doesNotMatch(appQuelle, /setItem|getItem|datenKarte|daten-karte|sprache\.mjs/, 'kein Speicher, keine Loeschkarte, keine Sprachwahl');
  assert.doesNotMatch(appQuelle, /Meine Daten l(ö|oe)schen/, 'ohne Speicher keine Karte');
  assert.match(appQuelle, MIGRATION, 'der alte Rekord-Schluessel wird beim Start in einer eigenen Zeile entfernt');
  assert.match(elternSeite, /speichert <strong>nichts<\/strong>/, 'die Eltern-Seite sagt, dass nichts gespeichert wird');
  assert.doesNotMatch(elternSeite, /Meine Daten l(ö|oe)schen/, 'ohne Speicher keine Karte');
});
