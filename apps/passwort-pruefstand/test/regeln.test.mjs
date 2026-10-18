import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// Eingabe-Regeln des Prüfstands: Das Testfeld ist nur für ein erfundenes Beispiel da.
// Geprüft wird der Quelltext des Feldes (pruefstandBildschirm in app.mjs), nicht die Laufzeit.
// Die Testdateien selbst dürfen die verbotenen Wörter nennen, um sie zu verbieten.

const APP = new URL('../', import.meta.url);
const lese = (datei) => readFile(new URL(datei, APP), 'utf8');
const app = await lese('app.mjs');
const index = await lese('index.html');

// Nur der Block des Prüfstand-Bildschirms, dort steht das Testfeld.
const bildschirm = app.slice(app.indexOf('function pruefstandBildschirm'), app.indexOf('function werkstattBildschirm'));
// Feldhinweis und Feld selbst (bis zum Probier-Knopf).
const feld = app.slice(app.indexOf('const feldHinweis'), app.indexOf('const probier'));
const HINWEIS = 'Kein echtes Passwort eingeben, nur ein erfundenes Beispiel.';

test('Feld: sichtbarer Hinweis „Kein echtes Passwort eingeben“ direkt vor dem Feld', () => {
  assert.ok(bildschirm.includes(HINWEIS), `Hinweistext fehlt: "${HINWEIS}"`);
  assert.match(bildschirm, /id: 'test-eingabe-hinweis'/, 'Hinweis braucht eine id');
  assert.match(bildschirm, /'aria-describedby': 'test-eingabe-hinweis'/, 'Feld verweist nicht per aria-describedby auf den Hinweis');
  assert.match(bildschirm, /feldHinweis,\s*eingabe,/, 'Hinweis steht nicht direkt vor dem Feld');
  assert.ok(!/sr-only|visually-hidden|aria-hidden/.test(feld), 'Hinweis darf nicht nur für Screenreader sein');
});

test('Feld: bleibt ein Textfeld mit Längenbremse 40, die Warnung „NIE dein echtes“ bleibt', () => {
  assert.match(feld, /type: 'text'/);
  assert.match(feld, /maxlength: '40'/);
  assert.ok(app.includes('Tippe hier NIE dein echtes Passwort ein!'), 'Warnung fehlt');
});

test('Feld: kein Speicher- und kein Netzaufruf im Feld-Code (Wert bleibt im Arbeitsspeicher)', () => {
  const verboten = /localStorage|sessionStorage|indexedDB|document\.cookie|cookieStore|navigator\.storage|caches\.|sendBeacon|XMLHttpRequest|WebSocket|EventSource|new Worker|(?<![\p{L}\p{N}_])fetch\s*\(/u;
  assert.ok(!verboten.test(feld), 'Feld-Code enthält Speicher- oder Netzaufruf');
  assert.ok(!verboten.test(bildschirm), 'Prüfstand-Bildschirm enthält Speicher- oder Netzaufruf');
  // Die einzige Netzanfrage der ganzen App lädt die lokale Wörterbank.
  assert.equal((app.match(/(?<![\p{L}\p{N}_])fetch\s*\(/gu) ?? []).length, 1, 'genau ein fetch erwartet');
  assert.ok(app.includes("fetch('daten/woerter.json')"), 'das fetch lädt nicht die lokale Wörterbank');
});
