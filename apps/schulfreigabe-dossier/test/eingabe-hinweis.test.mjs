import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { FELDER } from '../dossier.mjs';

// Quelltext-Prüfung: app.mjs importiert Browser-Module und lässt sich in node nicht ausführen.
const app = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');
const druck = await readFile(new URL('../druck.css', import.meta.url), 'utf8');
const formular = app.slice(app.indexOf('function render()'), app.indexOf('function aktualisierePreview()'));

test('Hinweistext steht als Konstante: „Keine Namen von Kindern eingeben.“', () => {
  assert.match(app, /const KINDER_HINWEIS = 'Keine Namen von Kindern eingeben\.';/);
});

test('Hinweis ist sichtbar: nicht versteckt, nicht aria-hidden, nicht sr-only', () => {
  const stil = app.match(/const HINWEIS_STIL = '([^']*)'/);
  assert.ok(stil, 'Stil des Hinweises nicht gefunden');
  assert.doesNotMatch(stil[1], /display:\s*none|visibility:\s*hidden|sr-only|aria-hidden|hidden/);
  assert.doesNotMatch(formular, /class: 'sd-hinweis'[^}]*(aria-hidden|hidden: true)/);
});

test('Die fünf freien Felder des Dossiers sind erfasst', () => {
  assert.equal(Object.keys(FELDER).length, 5, 'Feld-Katalog hat nicht fünf Felder');
});

test('Über dem Formular steht der Hinweis einmal', () => {
  assert.match(formular, /el\('span', \{ id: 'sd-hinweis-formular', class: 'sd-hinweis', style: HINWEIS_STIL \}, KINDER_HINWEIS\),\s*\.\.\.felder,/);
});

test('Jedes Feld: Hinweis steht direkt davor, das Feld verweist per aria-describedby darauf', () => {
  assert.match(formular, /el\('span', \{ id: `sd-hinweis-\$\{code\}`, class: 'sd-hinweis', style: HINWEIS_STIL \}, KINDER_HINWEIS\),\s*eingabe\)/);
  assert.match(formular, /'aria-describedby': `sd-hinweis-\$\{code\}`/);
});

test('Feldnamen (label und aria-label) bleiben unverändert', () => {
  assert.match(formular, /el\('label', \{ for: `sd-feld-\$\{code\}`, style: 'font-weight:600;display:block' \}, def\.label\)/);
  assert.match(formular, /'aria-label': def\.label/);
});

test('Im Druck ausgeblendet: druck.css blendet .sd-hinweis im @media print aus', () => {
  const imDruck = druck.slice(druck.indexOf('@media print'));
  assert.match(imDruck, /\.sd-hinweis \{ display: none !important; \}/);
});
