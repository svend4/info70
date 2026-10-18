import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// Quelltext-Prüfung: app.mjs importiert Browser-Module und lässt sich in node nicht ausführen.
const app = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');
const helfer = app.slice(app.indexOf('function eingabe('), app.indexOf('function aktualisiereVorschau'));

test('Hinweistext steht als Konstante: „Keine Namen von Kindern eingeben.“', () => {
  assert.match(app, /const KINDER_HINWEIS = 'Keine Namen von Kindern eingeben\.';/);
});

test('Hinweis ist sichtbar: nicht versteckt, nicht aria-hidden, nicht sr-only', () => {
  assert.ok(helfer.length > 0, 'Hilfsfunktion eingabe() nicht gefunden');
  assert.doesNotMatch(helfer, /display:\s*none|visibility:\s*hidden|sr-only|aria-hidden|hidden/);
});

test('Hinweis steht als eigenes Element direkt vor dem Feld, nicht im label-Text', () => {
  assert.match(helfer, /el\('span', \{ id: hinweisId, style: [^}]*\}, KINDER_HINWEIS\) : null,\s*feld\);/);
});

test('Feld verweist per aria-describedby auf den Hinweis; die id ist je Feld eindeutig', () => {
  assert.match(helfer, /const hinweisId = `bfe-hinweis-\$\{key\}`;/);
  assert.match(helfer, /\.\.\.\(opts\.hinweis \? \{ 'aria-describedby': hinweisId \} : \{\}\)/);
});

test('Alle sechs freien Felder haben den Hinweis (Anbieter, URL, Stand, Barrieren, Kontakt-Name, Kontakt-E-Mail)', () => {
  const felder = [...app.matchAll(/eingabe\('[^']*', '(\w+)', cfg, \{[^}]*\}/g)];
  assert.equal(felder.length, 6, 'Anzahl freier Felder');
  const mit = felder.filter((m) => /hinweis: true/.test(m[0])).map((m) => m[1]).sort();
  assert.deepEqual(mit, ['anbieter', 'bekannteBarrieren', 'kontaktEmail', 'kontaktName', 'stand', 'url']);
});
