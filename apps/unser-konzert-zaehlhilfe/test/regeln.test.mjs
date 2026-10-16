// Prüft die Regeln des Auftrags am Quelltext: keine fremden Adressen, kein
// Zugriff auf Browser-Speicher, nur ein Eingabefeld für den Titel, keine
// Kästchen, Zahlen oder Zeilen für einen Namen auf den Druckbögen, eigene
// druck.css, keine Bewertung von Kindern, keine Modellnamen. Gelesen wird der
// Quelltext, nicht die laufende Seite.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { TEXTE } from '../logik.mjs';

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
const appCode = ohneKommentare(app);
const logikCode = ohneKommentare(logik);

/** Alle Dateien dieser App außer den Tests, zum Prüfen von Wörtern und Namen. */
const alleDateien = (await readdir(ordner, { recursive: true }))
  .filter((d) => /\.(md|html|mjs|css|json)$/.test(d) && !d.startsWith('test/'));
const inhalte = new Map();
for (const d of alleDateien) inhalte.set(d, await lese(d));

test('kein Link nach außen: kein http(s) im Quelltext, nur eigene Dateien geladen', () => {
  for (const [datei, inhalt] of Object.entries({ 'app.mjs': app, 'logik.mjs': logik, 'index.html': index, 'druck.css': druck })) {
    assert.ok(!/https?:\/\//i.test(inhalt), `${datei} enthält eine externe Adresse`);
  }
  for (const wert of [...index.matchAll(/(?:src|href)="([^"]*)"/g)].map((m) => m[1])) {
    assert.ok(/^(\.\.\/)*[\w][\w./-]*$/.test(wert), `index.html lädt nichts Eigenes: ${wert}`);
  }
  assert.ok(!/\b(fetch|XMLHttpRequest|WebSocket|sendBeacon)\s*\(/.test(appCode), 'app.mjs sendet eine Anfrage');
});

test('nichts wird gespeichert: kein Zugriff auf Browser-Speicher, Cookies oder Caches', () => {
  const verboten = /localStorage|sessionStorage|indexedDB|document\.cookie|cookieStore|setItem|getItem|removeItem|\.clear\(|caches\.|Storage/;
  for (const [datei, inhalt] of Object.entries({ 'app.mjs': app, 'logik.mjs': logik, 'index.html': index, 'druck.css': druck })) {
    assert.ok(!verboten.test(inhalt), `${datei} greift auf den Browser-Speicher zu`);
  }
});

test('nur ein Eingabefeld, für den Titel; keine Auswahl- oder Textfelder für Kinder', () => {
  const felder = appCode.match(/el\(\s*'input'/g) ?? [];
  assert.equal(felder.length, 1, 'genau ein Eingabefeld erwartet (der Titel)');
  assert.ok(!/<input|<textarea|<select/i.test(index), 'index.html enthält ein Feld');
  assert.ok(!/el\(\s*'(textarea|select)'/.test(appCode), 'app.mjs erzeugt ein Auswahl- oder Textfeld');
});

test('kein Feld mit Namen oder Untergruppen', () => {
  // Die Beschriftung des einen Feldes darf weder Namen noch Untergruppen,
  // Jungen oder Mädchen meinen. Der Hinweis „Keine Namen“ steht nicht am Feld,
  // sondern darunter als Warnung.
  assert.ok(!/Name|Untergruppe|Teilgruppe|Jungen|Mädchen|Kind/i.test(TEXTE.titelFeld), `Beschriftung: ${TEXTE.titelFeld}`);
  assert.ok(!/Untergruppe|Teilgruppe|Jungen|Mädchen|Geschlecht/i.test(appCode + logikCode), 'Untergruppen, Jungen oder Mädchen im Code');
});

test('keine Kästchen, Häkchen oder Sterne in den Quellen', () => {
  const glyphen = /[☐☑☒□■▢✓✔✗✘★☆]/u;
  for (const [datei, inhalt] of Object.entries({ 'app.mjs': app, 'logik.mjs': logik, 'index.html': index, 'druck.css': druck })) {
    assert.ok(!glyphen.test(inhalt), `${datei} enthält ein Kästchen, Häkchen oder einen Stern`);
  }
});

test('Druckbogen: ohne Zahl, ohne Kästchen, ohne Zeile für einen Namen', () => {
  const funktion = app.match(/function druckZaehlbogen\(\) \{([\s\S]*?)\n\}\n/);
  assert.ok(funktion, 'druckZaehlbogen nicht gefunden');
  // Tagnamen wie 'h1' sind keine Ausgabe; sie fallen aus der Prüfung heraus.
  const ohneTagnamen = funktion[1].replace(/'h[1-6]'/g, "''");
  assert.ok(!/\d/.test(ohneTagnamen), 'der Zählbogen enthält eine Zahl im Quelltext');
  assert.ok(!/[☐☑☒□■▢✓✔✗✘★☆]/u.test(funktion[1]), 'der Zählbogen enthält ein Kästchen');
  assert.ok(!/zustand|erledigt|handzeichen|vorschlaege/i.test(funktion[1]), 'der Zählbogen liest den Bildschirm-Zustand');
  const namenszeile = /Name\s*:\s*_{2,}|Namenszeile|Namensfeld/i;
  for (const [datei, inhalt] of Object.entries({ 'app.mjs': app, 'logik.mjs': logik, 'index.html': index, 'druck.css': druck })) {
    assert.ok(!namenszeile.test(inhalt), `${datei} enthält eine Zeile für den Namen`);
  }
});

test('druck.css: eigenes @media print, blendet den Bildschirm aus, ist eingebunden, der Knopf wählt den Bogen', () => {
  assert.match(druck, /@media\s+print/);
  assert.match(druck, /\.k-bildschirm\s*\{[^}]*display:\s*none/);
  assert.match(druck, /\[data-druck="programm"\] \.k-druck-zaehl/);
  assert.match(druck, /\[data-druck="zaehlbogen"\] \.k-druck-programm/);
  assert.match(index, /href="druck\.css"/);
  assert.match(appCode, /window\.print\(\)/);
  assert.match(appCode, /afterprint/);
});

test('die Textdatei ist ein Blob-Download der Titel, ohne Netzanfrage', () => {
  assert.match(appCode, /new Blob\(\[programmTextdatei\(/);
  assert.match(appCode, /URL\.createObjectURL/);
  assert.match(appCode, /download:\s*DATEI_NAME/);
});

test('keine Bewertung von Kindern: keine Ampel, Prozent, Rangliste, Summe oder Stufe', () => {
  // Das Prozentzeichen fehlt absichtlich: width:100% im Eingabefeld ist Layout.
  const verboten = /Ampel|Prozent|Ranglis|Ranking|Punktzahl|Score|Summe|Gesamt|Bewertung|Stufe/i;
  assert.ok(!verboten.test(appCode), 'app.mjs enthält einen Begriff der Bewertung');
  assert.ok(!verboten.test(logikCode), 'logik.mjs enthält einen Begriff der Bewertung');
});

test('der Hinweis steht oben, vor dem Formular und der Zählung', () => {
  const hinweis = appCode.indexOf('hinweisBlock(),');
  const formular = appCode.indexOf('formularBlock(),');
  const zaehlen = appCode.indexOf('zaehllisteBlock(),');
  assert.ok(hinweis > 0 && hinweis < formular && formular < zaehlen, 'der Hinweis muss vor dem Formular stehen');
  assert.match(appCode, /TEXTE\.eigenentwurf/, 'der Hinweis ist nicht als Eigenentwurf gekennzeichnet');
});

test('Anregungen stehen als Anregung auf der Seite, mit Seitenangabe', () => {
  assert.match(appCode, /Anregung aus Praleska S\. \$\{a\.seite\}: \$\{a\.text\}/);
  assert.ok(app.includes('ANREGUNGEN'), 'die Anregungen fehlen auf der Seite');
});

test('Eingaben laufen durch die Logik: Titel, Art, Zählung', () => {
  assert.match(appCode, /neuerVorschlag\(/);
  assert.match(appCode, /zaehleHandzeichen\(/);
  assert.match(appCode, /programmTitel\(/);
});

test('CSP mit default-src self, und der Netzwerk-Wächter läuft beim Start', () => {
  assert.match(index, /default-src 'self'; style-src 'self' 'unsafe-inline'/);
  assert.match(appCode, /installiereNetzwerkWaechter\(\);/);
});

test('keine Modellnamen in den Dateien dieser App', () => {
  const verboten = /claude|anthropic|haiku|sonnet|opus|gpt|gemini/i;
  for (const [d, inhalt] of inhalte) {
    assert.ok(!verboten.test(inhalt), `${d} nennt ein Modell`);
  }
  assert.ok(alleDateien.length >= 6, 'zu wenige Dateien gelesen – greift die Suche noch?');
});

test('keine verbotenen Begriffe in den Dateien dieser App', () => {
  // anonym, Klassen-Koffer und Speicherung sind verboten; „Kinder stimmen ab“
  // darf nie als Aussage der Quelle stehen.
  const verboten = /anonym|Klassen-Koffer|Speicherung|Kinder stimmen ab/i;
  for (const [d, inhalt] of inhalte) {
    assert.ok(!verboten.test(inhalt), `${d} enthält einen verbotenen Begriff`);
  }
});
