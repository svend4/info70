import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// Quelltext-Prüfung: app.mjs importiert Browser-Module und lässt sich in node nicht ausführen.
const app = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');
const druck = await readFile(new URL('../druck.css', import.meta.url), 'utf8');
const formular = app.slice(app.indexOf('function render()'));

test('Hinweistext steht als Konstante: „Keine Namen von Kindern eingeben.“', () => {
  assert.match(app, /const KINDER_HINWEIS = 'Keine Namen von Kindern eingeben\.';/);
});

test('Hinweis ist sichtbar: nicht versteckt, nicht aria-hidden, nicht sr-only', () => {
  const stil = app.slice(app.indexOf('const hinweisStil'), app.indexOf('const angebotFeld'));
  assert.ok(stil.length > 0, 'Stil des Hinweises nicht gefunden');
  assert.doesNotMatch(stil, /display:\s*none|visibility:\s*hidden|sr-only|aria-hidden|hidden/);
  assert.doesNotMatch(formular, /class: 'cok-hinweis'[^}]*(aria-hidden|hidden: true)/);
});

test('Angebot-Feld: Hinweis steht direkt davor, das Feld verweist per aria-describedby darauf', () => {
  assert.match(formular, /el\('span', \{ id: 'cok-hinweis-angebot', class: 'cok-hinweis', style: hinweisStil \}, KINDER_HINWEIS\),\s*angebotFeld\)/);
  assert.match(formular, /'aria-describedby': 'cok-hinweis-angebot'/);
});

test('Berichtsfelder: jedes Textfeld hat direkt davor seinen Hinweis und verweist per aria-describedby darauf', () => {
  assert.match(formular, /el\('span', \{ id: `cok-hinweis-\$\{w\.id\}`, class: 'cok-hinweis', style: hinweisStil \}, KINDER_HINWEIS\),\s*feld,/);
  assert.match(formular, /'aria-describedby': `cok-hinweis-\$\{w\.id\}`/);
});

test('Im Druck ausgeblendet: druck.css blendet .cok-hinweis im @media print aus', () => {
  const imDruck = druck.slice(druck.indexOf('@media print'));
  assert.match(imDruck, /\.cok-hinweis \{ display: none !important; \}/);
});
