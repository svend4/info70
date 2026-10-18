import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// Projektregeln der Kinder-App Kinderrat, gegen den Quelltext geprüft (ohne DOM):
// Die Redeliste nimmt nur Initiale oder Nummer. Das Feld ist auf 3 Zeichen begrenzt,
// der Hinweis steht sichtbar direkt vor dem Feld und ist per aria-describedby verknüpft.
// eltern.html, README.md und GDD.md nennen dieselbe Angabe.

const APP = new URL('../', import.meta.url);
const lese = (datei) => readFile(new URL(datei, APP), 'utf8');
const app = await lese('app.mjs');

test('Redeliste: das Eingabefeld nimmt höchstens 3 Zeichen', () => {
  const feld = app.match(/el\('input',\s*\{[^}]*'aria-label': 'Name auf die Redeliste'[^}]*\}/);
  assert.ok(feld, 'Redeliste-Feld nicht gefunden');
  assert.match(feld[0], /maxlength: '3'/);
});

test('Redeliste: sichtbarer Hinweis direkt vor dem Feld, per aria-describedby verknüpft, nicht versteckt', () => {
  const hinweis = app.match(/el\('p',\s*\{\s*id: 'redeliste-hinweis',\s*style: '([^']*)'\s*\},\s*'([^']*)'\)/);
  assert.ok(hinweis, 'Hinweis-Element redeliste-hinweis fehlt');
  assert.equal(hinweis[2], 'Nur Initiale oder Nummer, keine Namen.');
  assert.doesNotMatch(hinweis[1], /display:\s*none|visibility:\s*hidden|nur-bildschirm|sr-only/);
  assert.match(app, /'aria-describedby': 'redeliste-hinweis'/);
  assert.ok(app.indexOf("id: 'redeliste-hinweis'") < app.indexOf('nameFeld, el('), 'Hinweis steht nicht vor dem Feld');
});

test('Angaben stimmen überein: eltern.html, README.md und GDD.md nennen „Initiale oder Nummer“, nicht „Vornamen“', async () => {
  for (const datei of ['eltern.html', 'README.md', 'GDD.md']) {
    const text = await lese(datei);
    assert.match(text, /Initiale oder Nummer/, `${datei}: Angabe „Initiale oder Nummer“ fehlt`);
    assert.doesNotMatch(text, /Vornamen/, `${datei}: alte Angabe „Vornamen“`);
  }
});
