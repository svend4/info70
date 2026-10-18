// Prüft den Quelltext: Gruppenname und Regelvorschlag haben einen sichtbaren
// Hinweis „Keine Namen von Mitschüler*innen eintragen.“. Er steht direkt vor dem
// Feld, ist per aria-describedby verknüpft, steht nicht im Feldnamen und wird
// nicht versteckt. Gelesen wird der Quelltext, weil app.mjs ein DOM braucht.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const app = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');
const HINWEIS = 'Keine Namen von Mitschüler*innen eintragen.';

test('Hinweistext steht genau einmal als Konstante im Quelltext', () => {
  assert.equal(app.split(HINWEIS).length - 1, 1, 'Hinweistext genau einmal');
  assert.match(app, /const NAMEN_HINWEIS = 'Keine Namen von Mitschüler\*innen eintragen\.';/);
});

test('Gruppenname und Regelvorschlag: Hinweis direkt vor dem Feld, per aria-describedby verknüpft, ids eindeutig', () => {
  const felder = [['titelFeld', ', titelFeld)'], ['neuFeld', ', neuFeld,']];
  const ids = [];
  for (const [variable, aufruf] of felder) {
    const block = app.match(new RegExp(`const ${variable} = el\\('input', \\{[\\s\\S]*?\\}\\);`))?.[0];
    assert.ok(block, `${variable} nicht gefunden`);
    const id = block.match(/'aria-describedby': '([^']+)'/)?.[1];
    assert.ok(id, `${variable} ohne aria-describedby`);
    ids.push(id);
    const position = app.indexOf(`namenHinweis('${id}')`);
    assert.ok(position > 0, `Hinweis ${id} wird nicht angezeigt`);
    assert.ok(position < app.indexOf(aufruf), `Hinweis ${id} steht nicht direkt vor dem Feld`);
  }
  assert.equal(new Set(ids).size, ids.length, 'Hinweis-ids eindeutig');
});

test('Der Hinweis steht nicht im Feldnamen (aria-label)', () => {
  assert.ok(!/'aria-label': '[^']*(Namen|Mitschüler)/.test(app), 'Hinweis steckt im aria-label');
  assert.match(app, /'aria-label': 'Name der Klasse'/);
  assert.match(app, /'aria-label': 'Neue Regel vorschlagen'/);
});

test('Der Hinweis wird nicht versteckt (keine Nur-Bildschirm- oder Verbergen-Klasse)', () => {
  const helfer = app.match(/const namenHinweis = \(id\) => el\('p', \{[\s\S]*?\}, NAMEN_HINWEIS\);/)?.[0];
  assert.ok(helfer, 'Hinweis-Helfer namenHinweis nicht gefunden');
  assert.doesNotMatch(helfer, /pw-nur|hidden|display:\s*none|aria-hidden/);
});
