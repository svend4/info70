import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const app = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');

test('Speicher: „Alles löschen“ entfernt den Schlüssel der Stationsliste, nicht nur den Inhalt', () => {
  assert.match(app, /const SCHLUESSEL = 'sk\.stationen';/);
  assert.equal([...app.matchAll(/localStorage\.setItem\(/g)].length, 1, 'ein einziger Schreibweg, nur der eine Schlüssel');
  const knopf = app.match(/🧹 Alles löschen/);
  assert.ok(knopf, 'Knopf „Alles löschen“ vorhanden');
  const handler = app.match(/confirm\('Alle Stationen löschen\?'\)\)[^\n]*/);
  assert.ok(handler, 'Bestätigung vor dem Löschen');
  assert.match(handler[0], /localStorage\.removeItem\(SCHLUESSEL\)/);
});
