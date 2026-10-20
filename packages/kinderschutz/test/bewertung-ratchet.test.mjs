import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { appTreffer, appTrefferIn, kernTreffer, vergleiche } from '../src/bewertung-stand.mjs';

// Ergebnis-Wertung (Rekord, Punkte, Ränge) ist aus dem Einzel-Ablauf der Quiz-Apps entfernt.
// Der Stand in docs/bewertung-stand.json schrumpft nur; node tools/bewertung-stand.mjs --schreiben
// streicht erledigte Einträge. Duett und Staffel stehen bis zur Entscheidung im Stand.
const WURZEL = fileURLToPath(new URL('../../../', import.meta.url));

const stand = async () => JSON.parse(await readFile(join(WURZEL, 'docs', 'bewertung-stand.json'), 'utf8'));

test('Ergebnis-Wertung: quiz-kern und Apps stimmen mit dem Stand überein, nichts Neues ohne Entscheidung', async () => {
  const probleme = vergleiche(await stand(), await kernTreffer(WURZEL), await appTreffer(WURZEL));
  assert.deepEqual(probleme, [], probleme.join('\n'));
});

test('Ausnahmen im Stand haben eine Begründung', async () => {
  for (const [app, grund] of Object.entries((await stand()).ausnahmen ?? {})) {
    assert.ok(grund.length > 20, `Ausnahme ${app} braucht eine Begründung`);
  }
});

test('Verneinungen zählen nicht; ein Rang in den Daten zählt', () => {
  assert.equal(appTrefferIn('app.mjs', '// Rekord im Kommentar\nkein Rekord, keine Ränge\n'), 0);
  assert.equal(appTrefferIn('app.mjs', 'const r = daten.raenge;\n'), 1);
  assert.equal(appTrefferIn('app.mjs', 'el(\'p\', {}, `Dein Rekord: ${rekord}`);\n'), 1);
  assert.equal(appTrefferIn('index.html', '<p>Gespeichert wird nur der Punkte-Rekord.</p>\n'), 1);
});
