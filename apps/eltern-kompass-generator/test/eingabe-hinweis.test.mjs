import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// Quelltext-Prüfung: app.mjs importiert Browser-Module und lässt sich in node nicht ausführen.
// Die Seite wird öffentlich eingebunden; darum hat jedes Freitext-Feld den Hinweis.
const app = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');
const helfer = app.slice(app.indexOf('function eingabe('), app.indexOf('function render()'));

test('Hinweistext steht als Konstante: „Keine Namen von Kindern eingeben.“', () => {
  assert.match(app, /const KINDER_HINWEIS = 'Keine Namen von Kindern eingeben\.';/);
});

test('Hinweis ist sichtbar: nicht versteckt, nicht aria-hidden, nicht sr-only', () => {
  assert.ok(helfer.length > 0, 'Hilfsfunktion eingabe() nicht gefunden');
  assert.doesNotMatch(helfer, /display:\s*none|visibility:\s*hidden|sr-only|aria-hidden|hidden/);
});

test('Hinweis steht als eigenes Element direkt vor dem Feld, nicht im label-Text', () => {
  assert.match(helfer, /el\('span', \{ id: hinweisId, style: [^}]*\}, KINDER_HINWEIS\),\s*feld,/);
});

test('Feld verweist per aria-describedby auf den Hinweis; die id ist je Feld eindeutig', () => {
  assert.match(helfer, /const hinweisId = `ekg-hinweis-\$\{key\}`;/);
  assert.match(helfer, /'aria-describedby': hinweisId/);
});

test('jedes Freitext-Feld hat den Hinweis: Name, Altersgruppe, Worum, Lernziele, Daten, Interaktion, Hinweis', () => {
  const felder = [...app.matchAll(/eingabe\('[^']*', '(\w+)', cfg/g)].map((m) => m[1]);
  assert.deepEqual([...felder].sort(), ['altersgruppe', 'appName', 'daten', 'hinweise', 'interaktion', 'lernziele', 'worum']);
  assert.equal(new Set(felder).size, felder.length, 'doppelte Feld-id');
});
