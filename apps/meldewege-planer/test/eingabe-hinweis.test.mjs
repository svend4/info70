import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// Quelltext-Prüfung: app.mjs importiert Browser-Module und lässt sich in node nicht ausführen.
const app = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');
const formular = app.slice(app.indexOf('function render()'));

test('Hinweistext steht als Konstante: „Keine Namen von Kindern eingeben.“', () => {
  assert.match(app, /const KINDER_HINWEIS = 'Keine Namen von Kindern eingeben\.';/);
});

test('Hinweis ist sichtbar: nicht versteckt, nicht aria-hidden, nicht sr-only', () => {
  const stil = app.match(/const HINWEIS_STIL = '([^']*)'/);
  assert.ok(stil, 'Stil des Hinweises nicht gefunden');
  assert.doesNotMatch(stil[1], /display:\s*none|visibility:\s*hidden|sr-only|aria-hidden|hidden/);
  assert.doesNotMatch(formular, /id: 'mwp-hinweis-ansprechperson'[^}]*(aria-hidden|hidden: true)/);
});

test('Feld Ansprechperson: Hinweis steht direkt davor, das Feld verweist per aria-describedby darauf', () => {
  assert.match(formular, /el\('span', \{ id: 'mwp-hinweis-ansprechperson', style: HINWEIS_STIL \}, KINDER_HINWEIS\),\s*nameFeld\)/);
  assert.match(formular, /'aria-describedby': 'mwp-hinweis-ansprechperson'/);
});

test('Feldname und Label bleiben unverändert (kein Kindername)', () => {
  assert.match(formular, /'Ansprechperson \(Rolle, kein Kindername\):'/);
  assert.match(formular, /'aria-label': 'Ansprechperson \(Rolle\/Redaktion, kein Kindername\)'/);
});
