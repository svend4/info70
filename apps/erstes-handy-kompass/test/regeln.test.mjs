import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// Eingabe-Regeln der Urkunde: Im Namensfeld steht nur ein Kürzel (Initialen oder Spitzname),
// und dieser Wert wird nirgends gespeichert. Geprüft wird der Quelltext (render in app.mjs).
// Die Testdateien selbst dürfen die verbotenen Wörter nennen, um sie zu verbieten.

const APP = new URL('../', import.meta.url);
const lese = (datei) => readFile(new URL(datei, APP), 'utf8');
const app = await lese('app.mjs');
const druck = await lese('druck.css');

// Namensfeld mit allem, was dazugehört (Anlegen bis zur Live-Spiegelung in die Urkunde).
const namensFeld = app.slice(app.indexOf('const nameFeld'), app.indexOf('app.replaceChildren('));
const HINWEIS = 'Nur Initialen oder einen Spitznamen eintragen, keinen vollen Namen.';

test('Namensfeld: Initialen oder Spitzname, maxlength 12, neue Feldbeschriftung', () => {
  assert.match(namensFeld, /maxlength: '12'/, 'maxlength 12 fehlt');
  assert.match(namensFeld, /'aria-label': 'Initialen oder Spitzname \(nur für die Urkunde\)'/);
  assert.match(app, /<label|el\('label', \{ for: 'ehk-name'/, 'sichtbare Beschriftung fehlt');
  assert.ok(app.includes('Initialen oder Spitzname (nur für die Urkunde)'), 'Feldbeschriftung fehlt');
  assert.ok(!app.includes('Name des Kindes'), 'alte Beschriftung „Name des Kindes“ ist noch im Code');
});

test('Hinweis am Feld: sichtbar, direkt vor dem Feld, per aria-describedby verbunden', () => {
  assert.ok(app.includes(HINWEIS), `Hinweistext fehlt: "${HINWEIS}"`);
  assert.match(app, /id: 'ehk-name-hinweis'/, 'Hinweis braucht eine id');
  assert.match(namensFeld, /'aria-describedby': 'ehk-name-hinweis'/, 'Feld verweist nicht auf den Hinweis');
  assert.match(app, new RegExp(`'${HINWEIS.replace(/[.]/g, '\\.')}'\\),\\s*nameFeld,`), 'Hinweis steht nicht direkt vor dem Feld');
  assert.ok(!/sr-only|visually-hidden|aria-hidden/.test(namensFeld), 'Hinweis darf nicht nur für Screenreader sein');
  assert.match(druck, /\.ehk-nur-bildschirm \{ display: none !important; \}/, 'im Druck muss der Hinweis ausgeblendet sein');
});

test('Datenvermeidung: der Namenswert wird nie gespeichert, nur ehk.status wird geschrieben', () => {
  assert.equal((app.match(/localStorage\.setItem\(/g) ?? []).length, 1, 'genau ein setItem (in speichere) erwartet');
  assert.equal((app.match(/speichere\(/g) ?? []).length, 1, 'genau ein Aufruf von speichere erwartet');
  assert.ok(app.includes('speichere(s)'), 'speichere darf nur den Status s übergeben');
  assert.ok(!/speichere\([^)]*(name|nameFeld|wert|ziel)/i.test(app), 'Name darf nicht an speichere übergeben werden');
  assert.ok(!/speichere|localStorage|sessionStorage|setItem|indexedDB|document\.cookie|fetch\(/.test(namensFeld),
    'Namensfeld-Code enthält Speicher- oder Netzaufruf');
  assert.ok(app.includes("const SCHLUESSEL = 'ehk.status'"), 'der Schlüssel für die Häkchen bleibt ehk.status');
});

test('Urkunde: zeigt den eingetragenen Kürzel-Wert wie bisher (live, nur im Ausdruck sichtbar)', () => {
  assert.ok(app.includes("nameFeld.value.trim() || '________________'"), 'Live-Spiegelung fehlt');
  assert.match(app, /id: 'ehk-urkunde-name'/);
  assert.match(app, /class: 'k-karte ehk-nur-druck'/, 'Urkunde ist nicht als Druckteil markiert');
});
