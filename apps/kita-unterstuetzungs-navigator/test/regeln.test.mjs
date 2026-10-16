// Prüft die Regeln des Auftrags am Quelltext: keine fremden Adressen, nichts
// gespeichert, keine Eingabe von Kinderdaten, keine Kontaktdaten, keine
// Modellnamen, keine Rechtsnormen, Druckbogen ohne Kästchen und ohne Zeile für
// einen Namen. Gelesen wird der Quelltext, nicht die laufende Seite.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const ordner = new URL('../', import.meta.url);
const lese = (datei) => readFile(new URL(datei, ordner), 'utf8');

/** Kommentare entfernen, damit nur Code und Ausgabetexte geprüft werden. */
function ohneKommentare(text) {
  return text
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:"'`])\/\/[^\n]*/g, '$1');
}

const roh = {
  app: await lese('app.mjs'),
  logik: await lese('logik.mjs'),
  index: await lese('index.html'),
  druck: await lese('druck.css'),
};
const code = {
  app: ohneKommentare(roh.app),
  logik: ohneKommentare(roh.logik),
  index: roh.index,
  druck: ohneKommentare(roh.druck),
};
const dokumente = {
  'README.md': await lese('README.md'),
  'GDD.md': await lese('GDD.md'),
  'package.json': await lese('package.json'),
};

test('keine fremde Adresse: kein http(s) in irgendeiner Datei der App', () => {
  for (const [datei, inhalt] of Object.entries(roh)) {
    assert.ok(!/https?:\/\//i.test(inhalt), `${datei} enthält eine externe Adresse`);
  }
});

test('nur eigene Dateien werden geladen: Stylesheets und Skript liegen im Repo', () => {
  for (const wert of [...roh.index.matchAll(/(?:src|href)="([^"]*)"/g)].map((m) => m[1])) {
    assert.ok(/^(\.\.\/)*[\w][\w./-]*$/.test(wert), `index.html lädt nicht Eigenes: ${wert}`);
  }
});

test('nichts wird gespeichert: kein Zugriff auf Browser-Speicher, Cookies oder Datenbanken', () => {
  const verboten = /localStorage|sessionStorage|indexedDB|document\.cookie|setItem|getItem|removeItem|caches\b|openDatabase/;
  for (const [datei, inhalt] of Object.entries(code)) {
    assert.ok(!verboten.test(inhalt), `${datei} greift auf Speicher zu`);
  }
});

test('Eingaben: genau ein Eingabefeld, und zwar in den Anlaufstellen; sonst keines', () => {
  const eingaben = code.app.match(/el\(\s*'input'/g) ?? [];
  assert.equal(eingaben.length, 1, 'genau ein Eingabefeld erwartet');
  const funktion = code.app.match(/function anlaufstellenKarte\(\) \{[\s\S]*?\n\}\n/);
  assert.ok(funktion, 'anlaufstellenKarte nicht gefunden');
  assert.ok(funktion[0].includes("'input'"), 'das Eingabefeld steht nicht bei den Anlaufstellen');
  assert.ok(!/<input|<textarea|<select/i.test(roh.index), 'index.html enthält ein Eingabefeld');
  assert.ok(!/el\(\s*'(textarea|select)'/.test(code.app), 'app.mjs erzeugt ein Textfeld oder eine Auswahl');
});

test('keine Kontaktdaten im Quelltext: keine Mailadresse, keine Telefonnummer, keine Postleitzahl', () => {
  for (const [datei, inhalt] of Object.entries({ app: code.app, logik: code.logik, index: roh.index })) {
    assert.ok(!/[\w.+-]+@[\w-]+\.[a-z]{2,}/i.test(inhalt), `${datei}: Mailadresse`);
    assert.ok(!/\+\d{2}/.test(inhalt), `${datei}: Telefon mit Landesvorwahl`);
    assert.ok(!/(?<!\d)\d{5}(?!\d)/.test(inhalt), `${datei}: fünfstellige Zahl (Postleitzahl)`);
    assert.ok(!/(?<![\d.,])0\d{3,}/.test(inhalt), `${datei}: Telefonnummer-Muster`);
  }
});

test('keine Modellnamen in Dateien der App', () => {
  const verboten = /claude|anthropic|haiku|sonnet|opus|gpt|openai|gemini|llm/i;
  for (const [datei, inhalt] of Object.entries({ ...roh, ...dokumente })) {
    assert.ok(!verboten.test(inhalt), `${datei} nennt ein Modell`);
  }
});

test('keine Rechtsnorm im Text: nichts davon ist geprüft', () => {
  const verboten = /§|\bSGB\b|\bBGB\b|DSGVO|Paragra|Gesetz|\bArt\.\s*\d/;
  for (const [datei, inhalt] of Object.entries({ app: code.app, logik: code.logik, index: roh.index })) {
    assert.ok(!verboten.test(inhalt), `${datei} nennt eine Rechtsnorm`);
  }
});

test('keine Ampel, keine Prozentzahl, keine Summe und keine Rangbildung in Oberfläche und Logik', () => {
  const verboten = /Ampel|Prozent|Score|Punkt|Rang|Gesamt|Summe|Kürzel|Burnout|Stufe|Kinderkarte|Kontext|Koffer|Wochenansicht|Serie/;
  for (const [datei, inhalt] of Object.entries({ app: code.app, logik: code.logik, index: roh.index, druck: code.druck })) {
    assert.ok(!verboten.test(inhalt), `${datei} enthält einen verbotenen Begriff`);
  }
  // Das Prozentzeichen steht nur als CSS-Breite (width:100%) am Eingabefeld, nie als Anzeige.
  const anzeige = code.app.replace(/style:\s*'[^']*'/g, '');
  assert.ok(!anzeige.includes('%'), 'app.mjs zeigt ein Prozentzeichen');
  assert.ok(!code.logik.includes('%'), 'logik.mjs enthält ein Prozentzeichen');
});

test('Feldnamen: keine Beschriftung „Kinder“, „Eltern“, „Team“ oder „Prävention/Burnout“', () => {
  for (const [datei, inhalt] of Object.entries({ app: code.app, logik: code.logik })) {
    assert.ok(!/['"`](Kinder|Eltern|Team|Prävention\/Burnout|Burnout)['"`]/.test(inhalt), `${datei} nutzt eine verbotene Beschriftung`);
  }
});

test('keine Kästchen, Häkchen, Sterne und keine Emojis in Ausgabe und Druck', () => {
  for (const [datei, inhalt] of Object.entries({ app: code.app, logik: code.logik, index: roh.index, druck: code.druck })) {
    assert.ok(!/[☐☒☑✓✔✗✘★☆✶*]/.test(inhalt), `${datei} enthält Kästchen, Häkchen oder Sterne`);
    assert.ok(!/\p{Extended_Pictographic}/u.test(inhalt), `${datei} enthält einen Emoji`);
  }
});

test('keine Namenszeile auf einem Blatt, in keiner Datei der App', () => {
  const verboten = /Name\s*:\s*_{3,}|Namensfeld|Namenszeile/i;
  for (const [datei, inhalt] of Object.entries({ ...roh, ...dokumente })) {
    assert.ok(!verboten.test(inhalt), `${datei} enthält eine Namenszeile`);
  }
});

test('der Druckbogen liest nicht den Bildschirmzustand', () => {
  const funktion = code.app.match(/function druckBogen\(\) \{[\s\S]*?\n\}\n/);
  assert.ok(funktion, 'druckBogen nicht gefunden');
  assert.ok(!/antworten|berichtJetzt|data-antwort|aria-pressed/.test(funktion[0]), 'der Druckbogen liest Antworten vom Bildschirm');
});

test('Druck: eigenes druck.css mit @media print, blendet den Bildschirm aus, zwei Blätter, eingebunden', () => {
  assert.match(roh.druck, /@media\s+print/);
  assert.match(roh.druck, /\.k-bildschirm\s*\{[^}]*display:\s*none/);
  assert.match(roh.druck, /body\[data-druck="bogen"\]/);
  assert.match(roh.druck, /body\[data-druck="bericht"\]/);
  assert.match(roh.index, /href="druck\.css"/);
  assert.equal((code.app.match(/window\.print\(\)/g) ?? []).length, 1, 'genau ein window.print() erwartet');
  assert.match(code.app, /druckeMit\('bericht'\)/);
  assert.match(code.app, /druckeMit\('bogen'\)/);
});

test('Netzwerk-Wächter wird beim Start aufgerufen', () => {
  assert.match(code.app, /^installiereNetzwerkWaechter\(\);$/m);
});

test('index.html: Sprache, Zeichensatz, Ansicht, CSP, Titel, Beschreibung, Stylesheets und Skript', () => {
  assert.match(roh.index, /<html lang="de">/);
  assert.match(roh.index, /<meta charset="utf-8" \/>/);
  assert.match(roh.index, /name="viewport"/);
  assert.match(roh.index, /http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline'"/);
  assert.match(roh.index, /<title>Kita-Unterstützungs-Navigator<\/title>/);
  assert.match(roh.index, /<meta name="description"/);
  assert.match(roh.index, /href="\.\.\/\.\.\/packages\/kinder-ui\/css\/kinder\.css"/);
  assert.match(roh.index, /<main class="k-app" id="app" aria-live="polite">/);
  assert.match(roh.index, /<noscript>/);
  assert.match(roh.index, /<script type="module" src="app\.mjs"><\/script>/);
  assert.ok(!/<script(?![^>]*\bsrc=)|\bon[a-z]+=/i.test(roh.index), 'Inline-Skript oder Ereignis-Attribut in index.html');
});

test('Umschalter: aria-pressed, und das aria-label beginnt mit dem sichtbaren Text', () => {
  assert.match(code.app, /'aria-pressed'/);
  assert.match(code.app, /'aria-label': `\$\{wahl\}: /);
});

test('Kontaktzeilen: je Anlaufstelle eine Zeile „Kontakt (von Hand eintragen)“ auf Bildschirm und Druckbogen', () => {
  assert.ok((code.app.match(/Kontakt \(von Hand eintragen\)/g) ?? []).length >= 2, 'Kontaktzeile fehlt auf einem der beiden Blätter');
  assert.ok((code.app.match(/ANLAUFSTELLEN\.map/g) ?? []).length === 2, 'Anlaufstellen nicht auf beiden Blättern');
});

test('Logik ohne DOM und ohne Browser-Objekte', () => {
  assert.ok(!/document\.|window\./.test(code.logik), 'logik.mjs greift auf den Browser zu');
});
