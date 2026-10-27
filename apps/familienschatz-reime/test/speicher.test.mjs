import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const app = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');

test('Speicher: nur die eigene Sammlung unter einem Schlüssel, ganz löschbar über die Daten-Karte', () => {
  assert.equal([...app.matchAll(/localStorage\.setItem\(/g)].length, 1, 'ein einziger Schreibweg');
  assert.match(app, /const SCHLUESSEL = 'schatz\.eigene';/);
  assert.match(app, /localStorage\.setItem\(SCHLUESSEL,/);
  assert.match(app, /import \{ datenKarte \} from '\.\.\/\.\.\/packages\/kinder-ui\/js\/daten-karte\.mjs';/);
  assert.match(app, /datenKarte\(\{\s*schluessel: SCHLUESSEL\b/, 'die Karte „Meine Daten löschen“ trägt den Schlüssel der Sammlung');
});

test('Druck: die Karte „Meine Daten löschen“ trägt die Nur-Bildschirm-Klasse, druck.css blendet sie aus', async () => {
  assert.match(app, /klasse: 'fsr-nur-bildschirm'/);
  const css = await readFile(new URL('../druck.css', import.meta.url), 'utf8');
  assert.match(css, /@media print\s*\{[^}]*\.fsr-nur-bildschirm\s*\{\s*display:\s*none\s*!important/);
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /<link rel="stylesheet" href="druck\.css" \/>/);
});

test('Einzelner Eintrag bleibt löschbar (Knopf je Eintrag)', () => {
  assert.match(app, /aria-label': `„\$\{e\.titel\}“ löschen`/);
});
