// Prüft die Regeln des Auftrags am Quelltext: nichts speichern außer dem
// einmaligen Entfernen des Altbestands, keine fremden Adressen, keine Eingabe
// von Kinderdaten, Druckbogen ohne Namenszeile, keine Modellnamen.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';

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
const config = await lese('daten/config.json');

const appCode = ohneKommentare(app);
const logikCode = ohneKommentare(logik);

test('nichts wird gespeichert: kein Schreibweg in Browser-Speicher, Cookies oder IndexedDB', () => {
  const verboten = ['setItem', 'sessionStorage', 'indexedDB', 'document.cookie', 'localStorage.clear', 'localStorage['];
  for (const [datei, code] of [['app.mjs', appCode], ['logik.mjs', logikCode], ['index.html', index]]) {
    for (const wort of verboten) assert.ok(!code.includes(wort), `${datei} enthält ${wort}`);
  }
});

test('Altbestand: genau ein localStorage-Zugriff, nur removeItem des alten Schlüssels in try/catch', () => {
  assert.equal((appCode.match(/localStorage/g) ?? []).length, 1, 'nur ein Zugriff auf localStorage');
  assert.equal((appCode.match(/removeItem\(/g) ?? []).length, 1, 'genau ein removeItem');
  assert.match(appCode, /const ALTER_SCHLUESSEL = 'et\.daten';/);
  assert.match(appCode, /localStorage\.removeItem\(ALTER_SCHLUESSEL\)/);
  const versuch = appCode.indexOf('try {');
  const entfernen = appCode.indexOf('removeItem(');
  const fangen = appCode.indexOf('} catch');
  assert.ok(versuch >= 0 && versuch < entfernen && entfernen < fangen, 'removeItem muss in try/catch stehen');
  assert.match(appCode, /bereinigeAltbestand\(\);/, 'die Bereinigung läuft beim Start');
});

test('Start: Netzwerk-Wächter wird aufgerufen, Zustand ist eine Variable', () => {
  assert.match(appCode, /installiereNetzwerkWaechter\(\);/);
  assert.match(appCode, /let erledigt = new Set\(\);/);
});

test('keine externen Anfragen: keine Adresse im Quelltext, nur eigene Module importiert', () => {
  for (const [datei, inhalt] of [['app.mjs', app], ['logik.mjs', logik], ['index.html', index], ['druck.css', druck], ['eltern.html', eltern]]) {
    assert.ok(!/https?:\/\//i.test(inhalt), `${datei} enthält eine externe Adresse`);
  }
  const importe = [...app.matchAll(/from '([^']+)'/g)].map((m) => m[1]);
  assert.ok(importe.length >= 3, 'Importe gefunden');
  for (const pfad of importe) {
    assert.ok(pfad === './logik.mjs' || pfad.startsWith('../../packages/'), `fremder Import: ${pfad}`);
  }
  for (const wert of [...index.matchAll(/(?:src|href)="([^"]*)"/g)].map((m) => m[1])) {
    assert.ok(/^(\.\.\/)*\w[\w./-]*$/.test(wert), `index.html lädt nicht Eigenes: ${wert}`);
  }
});

test('keine Eingabefelder: die Seite nimmt nichts entgegen', () => {
  const eingabe = /<input|<textarea|<select|el\(\s*'(input|textarea|select)'|createElement\(\s*'(input|textarea|select)'/;
  assert.ok(!eingabe.test(index), 'index.html enthält ein Eingabefeld');
  assert.ok(!eingabe.test(appCode), 'app.mjs erzeugt ein Eingabefeld');
});

test('keine Begriffe der alten Bewertung und keine Kinder-Kennungen in Code, Oberfläche und Config', () => {
  const verboten = /Ampel|Kürzel|Koffer|Stufe|Prozent|Score|Rangliste|Kinderkarte|Tagesverlauf|Empfehlung/i;
  const dateien = { 'app.mjs': appCode, 'logik.mjs': logikCode, 'index.html': index, 'druck.css': druck, 'daten/config.json': config };
  for (const [datei, inhalt] of Object.entries(dateien)) {
    assert.ok(!verboten.test(inhalt), `${datei} enthält einen Begriff der alten Bewertung`);
  }
});

test('Druckbogen: druck.css mit @media print, Bildschirm aus, Druckteil an, eingebunden, print() aufrufbar', () => {
  assert.match(druck, /@media\s+print/);
  assert.match(druck, /\.k-bildschirm\s*\{[^}]*display:\s*none/);
  assert.match(druck, /\.k-druck\s*\{[^}]*display:\s*none/);
  assert.match(index, /href="druck\.css"/);
  assert.match(appCode, /class: 'k-druck'/);
  assert.match(appCode, /globalThis\.print\?\.\(\)/);
});

test('keine Namenszeile in keiner Datei des Ordners', async () => {
  const namenszeile = /Name\s*:\s*_|_{3,}|Namensfeld/i;
  for (const datei of ['app.mjs', 'logik.mjs', 'index.html', 'druck.css', 'eltern.html', 'daten/config.json']) {
    assert.ok(!namenszeile.test(await lese(datei)), `${datei} enthält eine Zeile für den Namen`);
  }
});

test('keine Modellnamen in den Dateien dieser App', async () => {
  const verboten = /claude|anthropic|haiku|sonnet|opus|gpt|gemini/i;
  const dateien = (await readdir(ordner, { recursive: true })).filter((d) => /\.(md|html|mjs|css|json)$/.test(d) && !d.startsWith('test/'));
  for (const d of dateien) {
    assert.ok(!verboten.test(await lese(d)), `${d} nennt ein Modell`);
  }
  assert.ok(dateien.length >= 6, 'zu wenige Dateien gelesen – greift die Suche noch?');
});

test('eltern.html: Sprache, Titel, eine h1, Karten; keine Ampel als Funktion, keine Kinderdaten', () => {
  assert.match(eltern, /<html lang="de">/);
  assert.match(eltern, /<title>[^<]+<\/title>/);
  assert.equal((eltern.match(/<h1[\s>]/g) ?? []).length, 1, 'genau eine h1');
  assert.ok((eltern.match(/<section class="k-karte">/g) ?? []).length >= 3, 'Karten im main-Bereich');
  assert.match(eltern, /Leitfaden/);
  assert.match(eltern, /keine Kinderdaten/i);
  assert.match(eltern, /keine Ampel/);
  assert.ok(!/Ampel-Verlauf|Ampel-Einschätzung|Ampel-Tagebuch/i.test(eltern), 'eltern.html beschreibt noch eine Ampel');
});

test('index.html: lang de, Zeichensatz, Viewport, CSP, Titel, Stylesheets, Hauptbereich, Modul-Skript', () => {
  assert.ok(index.includes('<html lang="de">'));
  assert.match(index, /<meta charset="utf-8"/);
  assert.match(index, /<meta name="viewport"/);
  assert.match(index, /default-src 'self'; style-src 'self' 'unsafe-inline'/);
  assert.match(index, /<title>[^<]+<\/title>/);
  assert.ok(index.includes('href="../../packages/kinder-ui/css/kinder.css"'));
  assert.ok(index.includes('<main class="k-app" id="app" aria-live="polite">'));
  assert.ok(index.includes('<noscript>'));
  assert.ok(index.includes('<script type="module" src="app.mjs">'));
});

test('der Koffer ist entfernt: koffer.mjs und sein Test existieren nicht mehr', () => {
  assert.equal(existsSync(new URL('koffer.mjs', ordner)), false);
  assert.equal(existsSync(new URL('test/koffer.test.mjs', ordner)), false);
});
