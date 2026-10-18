import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// Quelltext-Prüfung: app.mjs importiert Browser-Module und lässt sich in node nicht ausführen.
const app = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');

test('Hinweistext steht als Konstante: „Keine Namen von Kindern eingeben.“', () => {
  assert.match(app, /const KINDER_HINWEIS = 'Keine Namen von Kindern eingeben\.';/);
});

test('Hinweis ist sichtbar: nicht versteckt, nicht aria-hidden, nicht sr-only', () => {
  const zeile = app.match(/const kinderHinweis = \(id\) => [^\n]+/);
  assert.ok(zeile, 'Hilfsfunktion kinderHinweis nicht gefunden');
  assert.doesNotMatch(zeile[0], /display:\s*none|visibility:\s*hidden|sr-only|aria-hidden|hidden/);
});

test('Hinweis steht als eigenes Element direkt vor dem Notizfeld, nicht im label-Text', () => {
  assert.match(app, /kinderHinweis\('ffst-hinweis-notiz'\),\s*notizFeld\),/);
});

test('Notizfeld verweist per aria-describedby auf den Hinweis; die id kommt genau zweimal vor (Element und Verweis)', () => {
  assert.match(app, /'aria-describedby': 'ffst-hinweis-notiz'/);
  assert.equal(app.split("'ffst-hinweis-notiz'").length - 1, 2, 'id im Element und im Verweis');
});

test('Feldname bleibt: aria-label „Notizen“', () => {
  assert.match(app, /'aria-label': 'Notizen'/);
});
