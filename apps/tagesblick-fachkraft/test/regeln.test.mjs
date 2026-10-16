// Prüft die Regeln des Auftrags am Quelltext: nichts speichern, keine fremden
// Adressen, keine Kinder-Eingabe, Druckbogen ohne Häkchen und ohne Namenszeile,
// keine Modellnamen. Gelesen wird der Quelltext, nicht die laufende Seite.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

const ordner = new URL('../', import.meta.url);
const lese = (datei) => readFile(new URL(datei, ordner), 'utf8');

/** Kommentare entfernen, damit nur Code und Ausgabetexte geprüft werden. */
function ohneKommentare(js) {
  return js
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:])\/\/[^\n]*/g, '$1');
}

const app = await lese('app.mjs');
const logik = await lese('logik.mjs');
const index = await lese('index.html');
const druck = await lese('druck.css');
const eltern = await lese('eltern.html');

const appCode = ohneKommentare(app);
const logikCode = ohneKommentare(logik);
const ausgabe = { 'app.mjs': appCode, 'logik.mjs': logikCode, 'index.html': index, 'druck.css': druck, 'eltern.html': eltern };

test('kein Link nach außen: kein http(s) im Quelltext, nur eigene Dateien geladen', () => {
  for (const [datei, inhalt] of Object.entries({ 'app.mjs': app, 'logik.mjs': logik, 'index.html': index, 'druck.css': druck, 'eltern.html': eltern })) {
    assert.ok(!/https?:\/\//i.test(inhalt), `${datei} enthält eine externe Adresse`);
  }
  for (const wert of [...index.matchAll(/(?:src|href)="([^"]*)"/g)].map((m) => m[1])) {
    assert.ok(/^(\.\.\/)*[\w][\w./-]*$/.test(wert), `index.html lädt nicht Eigenes: ${wert}`);
  }
});

test('nichts wird gespeichert: kein Schreibzugriff auf Browser-Speicher oder Cookies', () => {
  const verboten = /setItem|sessionStorage|indexedDB|document\.cookie|localStorage\.clear|localStorage\s*\[|localStorage\s*=/;
  assert.ok(!verboten.test(appCode), 'app.mjs schreibt in den Browser-Speicher');
  assert.ok(!verboten.test(logikCode), 'logik.mjs schreibt in den Browser-Speicher');
  assert.ok(!/setItem|indexedDB|document\.cookie/.test(index), 'index.html schreibt in den Browser-Speicher');
});

test('der Altbestand wird nur entfernt, und zwar in try/catch', () => {
  assert.equal((appCode.match(/removeItem\(/g) ?? []).length, 1, 'genau ein removeItem erwartet');
  assert.match(appCode, /localStorage\.removeItem\(ALTER_SCHLUESSEL\)/);
  const versuch = appCode.indexOf('try {');
  const entfernen = appCode.indexOf('removeItem(');
  const fangen = appCode.indexOf('} catch');
  assert.ok(versuch >= 0 && versuch < entfernen && entfernen < fangen, 'removeItem muss in try/catch stehen');
});

test('keine Eingabefelder: die App nimmt keine Kinderdaten entgegen', () => {
  const eingabe = /<input|<textarea|<select|el\(\s*'(input|textarea|select)'/;
  assert.ok(!eingabe.test(index), 'index.html enthält ein Eingabefeld');
  assert.ok(!eingabe.test(appCode), 'app.mjs erzeugt ein Eingabefeld');
});

test('keine Begriffe der alten Bewertung in Oberfläche und Logik', () => {
  // eltern.html ist ausgenommen: dort wird die Änderung erklärt und die alte
  // Fassung beim Namen genannt.
  const verboten = /Ampel|Kürzel|Kontext|Wochenansicht|Serie|Prozent|Ranglis|Punktzahl|Score|Kinderkarte|Koffer|Stufe/i;
  const oberflaeche = { 'app.mjs': appCode, 'logik.mjs': logikCode, 'index.html': index, 'druck.css': druck };
  for (const [datei, inhalt] of Object.entries(oberflaeche)) {
    assert.ok(!verboten.test(inhalt), `${datei} enthält einen Begriff der alten Bewertung`);
  }
});

test('Tagesbogen: eigenes druck.css mit @media print, blendet den Bildschirm aus, ist eingebunden', () => {
  assert.match(druck, /@media\s+print/);
  assert.match(druck, /\.k-bildschirm\s*\{[^}]*display:\s*none/);
  assert.match(index, /href="druck\.css"/);
  assert.match(appCode, /window\.print\(\)/);
});

test('Der Druckbogen zeigt keine Häkchen vom Bildschirm und keine Namenszeile', () => {
  const funktion = app.match(/function druckBogen\(\) \{([\s\S]*?)\n\}\n/);
  assert.ok(funktion, 'druckBogen nicht gefunden');
  assert.ok(!/zustand|erledigt|☑/.test(funktion[1]), 'der Druckbogen liest den Bildschirm-Zustand');
  const namenszeile = /Name\s*:\s*_{3,}|Namenszeile|Namensfeld/i;
  for (const [datei, inhalt] of Object.entries(ausgabe)) {
    assert.ok(!namenszeile.test(inhalt), `${datei} enthält eine Zeile für den Namen`);
  }
});

test('keine Modellnamen in den Dateien dieser App', async () => {
  const verboten = /claude|anthropic|haiku|sonnet|opus|gpt|gemini/i;
  const dateien = (await readdir(ordner, { recursive: true })).filter((d) => /\.(md|html|mjs|css|json)$/.test(d) && !d.startsWith('test/'));
  for (const d of dateien) {
    assert.ok(!verboten.test(await lese(d)), `${d} nennt ein Modell`);
  }
  assert.ok(dateien.length >= 5, 'zu wenige Dateien gelesen – greift die Suche noch?');
});

test('eltern.html: Sprache und Titel, keine Behauptung über Kinder, die die App nicht hält', () => {
  assert.match(eltern, /<html lang="de">/);
  assert.match(eltern, /<title>[^<]+<\/title>/);
  assert.ok(!/berechnet keine Werte/i.test(eltern), 'eltern.html enthält die verworfene Formel');
  assert.ok(!/Ampel-Einschätzung|Ampel-Verlauf/i.test(eltern), 'eltern.html beschreibt noch eine Ampel');
});

test('die App startet den Netzwerk-Wächter und hat die CSP mit default-src self', () => {
  assert.match(appCode, /installiereNetzwerkWaechter\(\)/);
  assert.match(index, /default-src 'self'/);
});
