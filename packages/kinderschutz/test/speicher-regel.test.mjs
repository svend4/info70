import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { appVerletzungen, speicherBefund, verletzung, vergleiche } from '../src/speicher-regel.mjs';

// Speicherregel: Speicher ⇒ Löschknopf, kein Speicher ⇒ kein Löschknopf (Entscheidung Max 30б).
// Der Stand docs/speicher-stand.json führt Apps, die die Regel noch verletzen; er schrumpft nur.
const WURZEL = fileURLToPath(new URL('../../../', import.meta.url));

test('Befund: Speicher, Löschmöglichkeit und Karte werden aus dem Code erkannt, Kommentare zählen nicht', () => {
  assert.deepEqual(speicherBefund("localStorage.setItem('a.b', '1');\ndatenKarte({ schluessel: 'a.b' });"), { speichert: true, loeschbar: true, karte: true });
  assert.deepEqual(speicherBefund("localStorage.setItem('a.b', '1');\nel('button', { onclick: () => { localStorage.removeItem('a.b'); start(); } }, '🧹 Wahl löschen')"), { speichert: true, loeschbar: true, karte: false });
  assert.deepEqual(speicherBefund("// localStorage.setItem('x', 1)\nconst a = 1;"), { speichert: false, loeschbar: false, karte: false });
  assert.deepEqual(speicherBefund("import { sprachwahl } from '../../packages/kinder-ui/js/sprache.mjs';"), { speichert: true, loeschbar: false, karte: false });
  assert.deepEqual(speicherBefund("try { localStorage.removeItem('uhr.rekord'); } catch {}"), { speichert: false, loeschbar: true, karte: false }, 'die Migration beim Start ist keine Karte');
});

test('Regel: beide Verletzungen werden gefunden, die zwei erlaubten Fälle und die Migration nicht', () => {
  assert.equal(verletzung({ speichert: true, loeschbar: false, karte: false }), 'speichert ohne Löschknopf');
  assert.equal(verletzung({ speichert: false, loeschbar: true, karte: true }), 'Löschknopf ohne Speicher');
  assert.equal(verletzung({ speichert: true, loeschbar: true, karte: true }), null);
  assert.equal(verletzung({ speichert: false, loeschbar: false, karte: false }), null);
  assert.equal(verletzung({ speichert: false, loeschbar: true, karte: false }), null, 'Migration ohne Karte und ohne Speicher');
});

test('Vergleich: eine neue Verletzung ist ein Fehler, eine behobene muss aus dem Stand', () => {
  assert.deepEqual(vergleiche({}, { x: 'speichert ohne Löschknopf' }), ['x: neu mit Regelverletzung (speichert ohne Löschknopf)']);
  assert.match(vergleiche({ y: 'a' }, {})[0], /^y: Regel erfüllt/);
  assert.deepEqual(vergleiche({ z: 'a' }, { z: 'a' }), []);
});

test('Alle Apps: keine neue Verletzung der Speicherregel gegenüber docs/speicher-stand.json', async () => {
  const stand = JSON.parse(await readFile(join(WURZEL, 'docs', 'speicher-stand.json'), 'utf8')).apps;
  assert.deepEqual(vergleiche(stand, await appVerletzungen(WURZEL)), []);
});
