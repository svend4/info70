import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// Eingabe-Regeln der Briefe: Die Angaben bleiben auf dem Gerät, werden nicht gespeichert und
// nicht gesendet. Geprüft wird der Quelltext der App. Die Testdateien selbst dürfen die
// verbotenen Wörter nennen, um sie zu verbieten.

const APP = new URL('../', import.meta.url);
const lese = (datei) => readFile(new URL(datei, APP), 'utf8');
const app = await lese('app.mjs');
const logik = await lese('logik.mjs');
const druck = await lese('druck.css');
const HINWEIS = 'Eingaben bleiben auf diesem Gerät, sie werden nicht gespeichert und nicht gesendet.';

test('Hinweis bei den Eingabefeldern: sichtbar, per aria-describedby mit jedem Angabenfeld verbunden', () => {
  assert.ok(app.includes(HINWEIS), `Hinweistext fehlt: "${HINWEIS}"`);
  assert.match(app, /id: 'erb-geraet-hinweis'/, 'Hinweis braucht eine id');
  assert.match(app, /'aria-describedby': 'erb-geraet-hinweis'/, 'Angabenfelder verweisen nicht auf den Hinweis');
  assert.ok(!/sr-only|visually-hidden|aria-hidden/.test(app), 'Hinweis darf nicht nur für Screenreader sein');
  assert.match(druck, /\.erb-nur-bildschirm \{ display: none !important; \}/, 'im Druck muss der Hinweis ausgeblendet sein');
});

test('Ausnahme Namensfeld: das Feld „Name des Kindes / der betroffenen Person“ bleibt, ohne Kinder-Standardhinweis', () => {
  // Ausnahme von der Regel „Keine Namen von Kindern eingeben.“: Der Name ist der Zweck des Briefes.
  // Auskunft, Löschung und Widerruf betreffen genau diese Person, ohne den Namen wäre der Brief
  // nicht zuzuordnen. Das Feld bleibt, und die Eingabe bleibt auf dem Gerät (Hinweis oben).
  assert.ok(app.includes("eingabe('Name des Kindes / der betroffenen Person', 'betroffene'"), 'Namensfeld fehlt');
  assert.ok(!app.includes('Keine Namen von Kindern eingeben.'), 'an diesem Feld steht kein Kinder-Standardhinweis');
  assert.ok(logik.includes('Betroffene Person:'), 'der Name fließt in den Brief');
});

test('Keine Speicherung und kein Netzaufruf in den Dateien der App (Ist-Prüfung per Quelltext)', () => {
  const verboten = /localStorage|sessionStorage|indexedDB|document\.cookie|cookieStore|navigator\.storage|caches\.|setItem|sendBeacon|XMLHttpRequest|WebSocket|EventSource|new Worker|(?<![\p{L}\p{N}_])fetch\s*\(/u;
  assert.ok(!verboten.test(app), 'app.mjs: Speicher- oder Netzaufruf gefunden');
  assert.ok(!verboten.test(logik), 'logik.mjs: Speicher- oder Netzaufruf gefunden');
  assert.ok(!/https?:\/\//.test(app + logik), 'externe Adresse im Code');
});
