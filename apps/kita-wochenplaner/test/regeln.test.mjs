// Prüft die Regeln des Auftrags am Quelltext: keine fremden Adressen, Speicher
// nur für den Plan (docs/02 Z. 25), Eingaben nur im Planungsbereich für Fachkräfte,
// keine Kontaktdaten, keine Modellnamen, keine Rechtsnormen, Druckbogen ohne
// Zeichen, ohne Emojis und ohne Namenszeile. Gelesen wird der Quelltext, nicht
// die laufende Seite (die Browser-Prüfung liest die Seite).
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

/** Ganzer Funktionskörper, bis zur schließenden Klammer in Spalte 0. */
function funktionskoerper(text, name) {
  const treffer = text.match(new RegExp(`function ${name}\\([^)]*\\) \\{[\\s\\S]*?\\n\\}\\n`));
  assert.ok(treffer, `${name} nicht gefunden`);
  return treffer[0];
}

const roh = {
  app: await lese('app.mjs'),
  logik: await lese('logik.mjs'),
  koffer: await lese('koffer.mjs'),
  index: await lese('index.html'),
  druck: await lese('druck.css'),
};
const code = {
  app: ohneKommentare(roh.app),
  logik: ohneKommentare(roh.logik),
  koffer: ohneKommentare(roh.koffer),
  index: roh.index,
  druck: ohneKommentare(roh.druck),
};
const kinderCss = await readFile(new URL('../../../packages/kinder-ui/css/kinder.css', import.meta.url), 'utf8');
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

test('keine Anfrage nach außen: einziger fetch ist die eigene Datendatei, keine anderen Netzwege', () => {
  const aufrufe = code.app.match(/fetch\(/g) ?? [];
  assert.equal(aufrufe.length, 1, 'genau ein fetch erwartet');
  assert.match(code.app, /fetch\('daten\/bereiche\.json'\)/);
  for (const [datei, inhalt] of Object.entries(code)) {
    assert.ok(!/XMLHttpRequest|WebSocket|sendBeacon|new Worker|importScripts/.test(inhalt), `${datei} nutzt einen Netzweg`);
  }
});

test('Speicher: nur der Plan unter dem Schlüssel kwp.plan, kein anderer Speicher (docs/02 Z. 25)', () => {
  assert.match(code.app, /const PLAN_SCHLUESSEL = 'kwp\.plan';/);
  for (const zeile of code.app.split('\n').filter((z) => z.includes('localStorage.'))) {
    assert.ok(zeile.includes('PLAN_SCHLUESSEL'), `localStorage ohne den Plan-Schlüssel: ${zeile.trim()}`);
  }
  const verboten = /sessionStorage|indexedDB|document\.cookie|caches\b|openDatabase/;
  for (const [datei, inhalt] of Object.entries(code)) {
    assert.ok(!verboten.test(inhalt), `${datei} greift auf anderen Speicher zu`);
  }
  for (const [datei, inhalt] of Object.entries({ logik: code.logik, koffer: code.koffer })) {
    assert.ok(!/localStorage/.test(inhalt), `${datei} speichert selbst`);
  }
});

test('Löschknopf für den gespeicherten Plan ist vorhanden', () => {
  assert.match(code.app, /localStorage\.removeItem\(PLAN_SCHLUESSEL\)/);
  assert.match(code.app, /Alle Daten löschen/);
});

test('Eingaben nur im Planungsbereich für Fachkräfte: Wochenname, Angebot, Datei-Import; kein Textfeld', () => {
  assert.equal((code.app.match(/el\('input'/g) ?? []).length, 4, 'vier Eingabefelder erwartet (Woche, Dauer, Titel, Datei)');
  assert.equal((code.app.match(/el\('select'/g) ?? []).length, 1, 'eine Auswahl erwartet (über auswahlFeld)');
  assert.ok(!/el\(\s*'(textarea)'/.test(code.app), 'app.mjs erzeugt ein Textfeld');
  assert.ok(!/<input|<textarea|<select/i.test(roh.index), 'index.html enthält ein Eingabefeld');
  assert.match(code.app, /Bitte keine Kindernamen/, 'Hinweis gegen Kindernamen fehlt');
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
  const verboten = /\bLLM\b|Sprachmodell|Modellname|KI-Modell/i;
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

test('keine Ampel, keine Punkte, keine Rangbildung in Oberfläche und Logik', () => {
  const verboten = /Ampel|Score|Punkt|Rang|Gesamt|Summe|Burnout|Stufe|Kinderkarte|Wochenansicht|Serie/;
  for (const [datei, inhalt] of Object.entries({ app: code.app, logik: code.logik, index: roh.index, druck: code.druck })) {
    assert.ok(!verboten.test(inhalt), `${datei} enthält einen verbotenen Begriff`);
  }
  // Das Prozentzeichen steht nur als CSS-Breite (width:…%) der Fortschrittsbalken, nie als Anzeige.
  for (const zeile of code.app.split('\n').filter((z) => z.includes('%'))) {
    assert.ok(zeile.includes('width:'), `app.mjs zeigt ein Prozentzeichen: ${zeile.trim()}`);
  }
  assert.ok(!code.logik.includes('%'), 'logik.mjs enthält ein Prozentzeichen');
});

test('Feldnamen: keine Beschriftung „Kinder“, „Eltern“, „Team“ oder „Prävention/Burnout“', () => {
  for (const [datei, inhalt] of Object.entries({ app: code.app, logik: code.logik })) {
    assert.ok(!/['"`](Kinder|Eltern|Team|Prävention\/Burnout|Burnout)['"`]/.test(inhalt), `${datei} nutzt eine verbotene Beschriftung`);
  }
});

test('Druck: keine Kästchen, Häkchen oder Sterne im Quelltext der Ausgabe', () => {
  for (const [datei, inhalt] of Object.entries({ app: code.app, logik: code.logik, index: roh.index, druck: code.druck })) {
    assert.ok(!/[☐☒☑✓✔✗✘★☆✶]/.test(inhalt), `${datei} enthält Kästchen, Häkchen oder Sterne`);
  }
});

test('Druck: Emojis nur auf dem Bildschirm. Im Titel, in der Tagesliste und im Leerhinweis trägt jede Zeile mit Emoji die Klasse kwp-nur-bildschirm', () => {
  const emoji = /\p{Extended_Pictographic}/u;
  assert.ok(!emoji.test(roh.index), 'index.html enthält ein Emoji (der Seitentitel wird im Druckkopf gezeigt)');
  for (const name of ['render', 'tagesKarte']) {
    const zeilen = funktionskoerper(code.app, name).split('\n');
    zeilen.forEach((zeile, i) => {
      if (!emoji.test(zeile)) return;
      // Ein Knopf, der nur auf dem Bildschirm steht, trägt die Klasse in seinem Anfang (el('button', {…})).
      const anfang = zeilen.slice(0, i).findLastIndex((z) => z.includes("el('button'"));
      const block = zeilen.slice(Math.max(anfang, 0), i + 1).join('\n');
      assert.ok(block.includes('kwp-nur-bildschirm'), `${name}: Emoji ohne Bildschirm-Klasse: ${zeile.trim()}`);
    });
  }
});

test('keine Namenszeile auf einem Blatt, in keiner Datei der App', () => {
  const verboten = /Name\s*:\s*_{3,}|Namensfeld|Namenszeile/i;
  for (const [datei, inhalt] of Object.entries({ ...roh, ...dokumente })) {
    assert.ok(!verboten.test(inhalt), `${datei} enthält eine Namenszeile`);
  }
});

test('der Druckkopf liest nicht den Bildschirmzustand: Woche und Hinweis kommen aus dem Plan, nicht aus Entwurf oder Meldung', () => {
  const druckzeilen = funktionskoerper(code.app, 'render').split('\n').filter((z) => z.includes("'kwp-nur-druck'"));
  assert.ok(druckzeilen.length >= 2, 'Druckkopf fehlt');
  for (const zeile of druckzeilen) {
    assert.ok(!/entwurf|meldung/.test(zeile), `Druckkopf liest den Bildschirmzustand: ${zeile.trim()}`);
  }
});

test('Druck: eigenes druck.css mit @media print, blendet den Bildschirm aus, eingebunden, genau ein Druckaufruf', () => {
  assert.match(roh.druck, /@media\s+print/);
  assert.match(roh.druck, /\.kwp-nur-bildschirm\s*\{\s*display:\s*none\s*!important;?\s*\}/);
  assert.match(roh.druck, /\.kwp-nur-druck\s*\{\s*display:\s*none;?\s*\}/);
  assert.match(roh.index, /href="druck\.css"/);
  assert.equal((code.app.match(/window\.print\(\)/g) ?? []).length, 1, 'genau ein window.print() erwartet');
});

test('Fokus nach Klick: jeder Knopf trägt eine data-kennung, die Kennungen sind eindeutig', () => {
  const knoepfe = code.app.match(/el\('button'/g) ?? [];
  const kennungen = code.app.match(/'data-kennung': /g) ?? [];
  assert.equal(kennungen.length, knoepfe.length, `${knoepfe.length} Knöpfe, aber ${kennungen.length} data-kennung`);
  const feste = [...code.app.matchAll(/'data-kennung': '([^']+)'/g)].map((m) => m[1]);
  assert.equal(new Set(feste).size, feste.length, 'doppelte feste data-kennung');
});

test('Fokus nach Bildschirmwechsel: Überschrift ist fokussierbar und render() setzt den Fokus', () => {
  assert.match(code.app, /el\('h1', \{ class: 'k-titel', tabindex: '-1' \}/);
  const koerper = funktionskoerper(code.app, 'render');
  assert.match(koerper, /if \(fokus\) \(app\.querySelector\(`\[data-kennung="\$\{fokus\}"\]`\) \?\? app\.querySelector\('h1'\)\)\.focus\(\);/);
});

test('Knopfhöhe: Knöpfe 3rem, Fußlinks mindestens 48 px', () => {
  assert.match(kinderCss, /\.k-knopf\s*\{[^}]*min-height:\s*3rem;/);
  assert.match(code.app, /const FUSS_LINK = '[^']*min-height:48px;/);
});

test('Netzwerk-Wächter wird beim Start aufgerufen', () => {
  assert.match(code.app, /^installiereNetzwerkWaechter\(\);$/m);
});

test('index.html: Sprache, Zeichensatz, Ansicht, CSP, Titel, Beschreibung, Stylesheets und Skript', () => {
  assert.match(roh.index, /<html lang="de">/);
  assert.match(roh.index, /<meta charset="utf-8" \/>/);
  assert.match(roh.index, /name="viewport"/);
  assert.match(roh.index, /http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline'"/);
  assert.match(roh.index, /<title>Kita-Wochenplaner<\/title>/);
  assert.match(roh.index, /<meta name="description"/);
  assert.match(roh.index, /<main class="k-app" id="app" aria-live="polite">/);
  assert.match(roh.index, /<noscript>/);
  assert.match(roh.index, /<script type="module" src="app\.mjs"><\/script>/);
  assert.ok(!/<script(?![^>]*\bsrc=)|\bon[a-z]+=/i.test(roh.index), 'Inline-Skript oder Ereignis-Attribut in index.html');
});

test('Logik ohne DOM und ohne Browser-Objekte', () => {
  assert.ok(!/document\.|window\./.test(code.logik), 'logik.mjs greift auf den Browser zu');
  assert.ok(!/document\.|window\./.test(code.koffer), 'koffer.mjs greift auf den Browser zu');
});
