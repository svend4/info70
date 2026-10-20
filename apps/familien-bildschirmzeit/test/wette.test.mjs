import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { TAGE, AUSKUNFT, NAME_MAX, neueWette, fuegeMitglied, entferneMitglied, setzeTag, wochenBilanz, familienBilanz } from '../wette.mjs';

const APP = new URL('../app.mjs', import.meta.url);
const WETTE = new URL('../wette.mjs', import.meta.url);

test('TAGE: sieben Wochentage, AUSKUNFT: drei Wörter ohne Farbe', () => {
  assert.equal(TAGE.length, 7);
  assert.deepEqual(Object.keys(AUSKUNFT), ['ja', 'teils', 'nein']);
  for (const a of Object.values(AUSKUNFT)) assert.doesNotMatch(a.text + a.kurz, /\p{Extended_Pictographic}/u);
});

test('fuegeMitglied: Name höchstens 3 Zeichen, leerer Name ignoriert', () => {
  let w = neueWette();
  w = fuegeMitglied(w, 'M.', 'unter 1 Stunde');
  w = fuegeMitglied(w, '  ', 'x');
  assert.equal(w.mitglieder.length, 1);
  assert.equal(w.mitglieder[0].name, 'M.');
  assert.equal(w.mitglieder[0].ziel, 'unter 1 Stunde');
  assert.deepEqual(w.mitglieder[0].tage, {});
});

test('Länge: ein voller Name wird auf NAME_MAX Zeichen gekürzt, die Eingabe ist auf dieselbe Grenze begrenzt', async () => {
  assert.equal(NAME_MAX, 3);
  const w = fuegeMitglied(neueWette(), 'Benjamin', '');
  assert.equal(w.mitglieder[0].name, 'Ben');
  assert.ok(w.mitglieder[0].name.length <= NAME_MAX);
  assert.match(await readFile(APP, 'utf8'), /maxlength: NAME_MAX/);
});

test('setzeTag: setzt die Auskunft, ungültiger Tag, Auskunft oder alte Farbe werden ignoriert', () => {
  let w = fuegeMitglied(neueWette(), 'Kind', 'Ziel');
  w = setzeTag(w, 0, 'Mo', 'ja');
  w = setzeTag(w, 0, 'Di', 'nein');
  w = setzeTag(w, 0, 'XX', 'ja'); // ungültiger Tag
  w = setzeTag(w, 0, 'Mi', 'lila'); // ungültige Auskunft
  w = setzeTag(w, 0, 'Do', 'gruen'); // alte Farbe, nicht mehr gültig
  w = setzeTag(w, 0, 'Fr', 'constructor'); // geerbte Eigenschaft ist keine Auskunft
  assert.deepEqual(w.mitglieder[0].tage, { Mo: 'ja', Di: 'nein' });
});

test('wochenBilanz: zählt die Auskünfte und die erfassten Tage', () => {
  let w = fuegeMitglied(neueWette(), 'Kind', 'Ziel');
  w = setzeTag(w, 0, 'Mo', 'ja');
  w = setzeTag(w, 0, 'Di', 'ja');
  w = setzeTag(w, 0, 'Mi', 'teils');
  w = setzeTag(w, 0, 'Do', 'nein');
  assert.deepEqual(wochenBilanz(w.mitglieder[0]), { ja: 2, teils: 1, nein: 1, erfasst: 4 });
});

test('keine Wertung: familienBilanz trägt keine Rückmeldung, Quelltext ohne Bewertung und ohne Ampelfarben', async () => {
  let w = fuegeMitglied(neueWette(), 'M.', 'Ziel');
  w = setzeTag(w, 0, 'Mo', 'ja');
  const fb = familienBilanz(w);
  assert.equal('rueckmeldung' in fb[0], false);
  assert.equal(fb[0].bilanz.ja, 1);
  const quelle = (await readFile(WETTE, 'utf8')) + (await readFile(APP, 'utf8'));
  assert.doesNotMatch(quelle, /bewertung/i, 'keine Bewertungsfunktion und keine Rückmeldung');
  assert.doesNotMatch(quelle, /[🟢🟡🔴🌟👍💪]/u, 'keine Ampelfarben und keine Wertungs-Emojis');
});

test('alter Schlüssel mit den Namen wird gelöscht, der eigene Schlüssel bleibt', async () => {
  const app = await readFile(APP, 'utf8');
  assert.match(app, /ALTER_SCHLUESSEL = 'fbz\.wette'/);
  assert.match(app, /removeItem\(ALTER_SCHLUESSEL\)/);
  assert.match(app, /SCHLUESSEL = 'fbz\.auskunft'/);
});

test('entferneMitglied: entfernt per Index', () => {
  let w = fuegeMitglied(fuegeMitglied(neueWette(), 'A', ''), 'B', '');
  w = entferneMitglied(w, 0);
  assert.equal(w.mitglieder.length, 1);
  assert.equal(w.mitglieder[0].name, 'B');
});
