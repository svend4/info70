import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const quelle = await readFile(new URL('../src/quiz.mjs', import.meta.url), 'utf8');
// Kommentare raus: sie erwähnen localStorage.clear() ausdrücklich als das,
// was hier NICHT passieren soll – ein Test darf daran nicht hängenbleiben.
const code = quelle.replace(/^\s*\/\/.*$/gm, '');

test('elternSeite: der Eltern-Link ist abschaltbar – ein Fachkräfte-Quiz hat keine eltern.html', () => {
  // Der Fuß entsteht im DOM; in Node steht kein DOM, geprüft wird deshalb die
  // Quelle. Entscheidend ist, dass der Link an der Option hängt statt fest
  // verdrahtet zu sein – sonst zeigt ein Quiz ohne eltern.html ins Nichts.
  assert.match(quelle, /elternSeite = true/, 'Standard bleibt: Eltern-Link an');
  assert.match(quelle, /elternSeite \? el\('a', \{ href: 'eltern\.html' \}/, 'Link hängt an der Option');
  assert.match(quelle, /\.filter\(Boolean\)/, 'null-Knoten müssen gefiltert werden – el() tut das nicht');
});

test('der Fuß trägt immer Impressum und den Datenschutz-Hinweis', () => {
  assert.match(quelle, /impressum\.html/, 'Impressum ist Pflicht (docs/02 §5)');
  assert.match(quelle, /Daten bleiben auf diesem Gerät/);
  assert.match(quelle, /Werbefrei/);
});

test('Datenlöschung: der Knopf entfernt den Rekord – und nur ihn', () => {
  // docs/02-Checkliste: "localStorage очищается кнопкой".
  assert.match(quelle, /datenLoeschen/, 'Beschriftung vorhanden');
  assert.match(quelle, /loescheDaten\(rekordSchluessel\)/, 'der Knopf löscht wirklich – gezielt');
  // localStorage.clear() würde die Anzeige-Einstellungen (hoher Kontrast,
  // Schriftgröße) mit abräumen. Für ein Kind, das Kontrast braucht, wäre das
  // ein Rückschritt mitten im Spiel – deshalb hier verboten.
  assert.ok(!/localStorage\.clear\(/.test(code), 'kein clear(): es trifft fremde Schlüssel mit');
});
