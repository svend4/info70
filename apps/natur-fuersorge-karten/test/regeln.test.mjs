import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { checklisteInhalt, kartenFuer, kartenInhalt, pruefeDaten } from '../logik.mjs';

// Projektregeln, für diese App geprüft: docs/02 Z. 22–24 (keine Anfragen nach außen),
// docs/02 Z. 79–82 (Druckbögen), docs/02 Z. 141–146 (keine Bewertung von Kindern),
// docs/02 Z. 50 (Knöpfe und Fußlink mindestens 48 px). Die Speicherregel, die Zufallsregel
// und die Altersregel haben keine docs/02-Zeile, sie sind Projektregeln. Die Prüfung liest
// die Dateien der App (ohne test/). Die Testdateien selbst dürfen die verbotenen Wörter nennen.

const APP = new URL('../', import.meta.url);
const daten = JSON.parse(await readFile(new URL('daten/karten.json', APP), 'utf8'));
const CODE_DATEIEN = ['index.html', 'app.mjs', 'logik.mjs', 'druck.css', 'daten/karten.json'];
const ALLE_DATEIEN = [...CODE_DATEIEN, 'package.json', 'README.md', 'GDD.md'];
const PFLICHT = 'Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.';

const lese = (datei) => readFile(new URL(datei, APP), 'utf8');
const code = Object.fromEntries(await Promise.all(CODE_DATEIEN.map(async (d) => [d, await lese(d)])));
const alle = Object.fromEntries(await Promise.all(ALLE_DATEIEN.map(async (d) => [d, await lese(d)])));

// Alle Druckblätter: jede Auswahl (keine Handlung, je eine Handlung). Gedruckt wird der Inhalt
// aus logik.mjs, genau wie app.mjs ihn zeigt.
const auswahlen = [null, 'h1', 'h2', 'h3'];
const blaetter = auswahlen.map((handlung) => [
  ...kartenFuer(daten, { handlung }).map((k) => Object.values(kartenInhalt(daten, k)).join('\n')),
  Object.values(checklisteInhalt(daten)).flat().join('\n'),
]);
const druckText = (blatt) => blatt.join('\n');

test('die Daten sind gültig nach logik.mjs', () => {
  assert.deepEqual(pruefeDaten(daten), []);
});

test('keine Eingabefelder für Kinder: kein input, textarea, select, form, contenteditable', () => {
  const muster = /<\s*(input|textarea|select|form)\b|contenteditable|(el|createElement)\(\s*['"](input|textarea|select|form)['"]/i;
  for (const d of ['index.html', 'app.mjs']) {
    assert.ok(!muster.test(code[d]), `${d}: Eingabeelement gefunden`);
  }
});

test('keine Speicherung: kein localStorage, sessionStorage, IndexedDB, Cookie oder Cache', () => {
  const muster = /localStorage|sessionStorage|indexedDB|document\.cookie|\bcaches\b|navigator\.storage/;
  for (const d of CODE_DATEIEN) {
    assert.ok(!muster.test(code[d]), `${d}: Speicher-Zugriff gefunden`);
  }
});

test('keine externen Adressen; der einzige Abruf holt die eigene Datei daten/karten.json', () => {
  for (const d of CODE_DATEIEN) {
    assert.ok(!/https?:\/\/|(?<![:\w])\/\/[\w-]+\.[a-z]{2,}/i.test(code[d]), `${d}: externe Adresse`);
  }
  const abrufe = [...code['app.mjs'].matchAll(/fetch\(\s*([^)]*)\)/g)].map((m) => m[1]);
  assert.deepEqual(abrufe, ["'daten/karten.json'"]);
  for (const d of ['app.mjs', 'logik.mjs']) {
    assert.ok(!/XMLHttpRequest|WebSocket|sendBeacon|EventSource|importScripts|new Worker|window\[|globalThis|wss?:/.test(code[d]), `${d}: Netzaufruf gefunden`);
  }
  assert.ok(!/@import/.test(code['druck.css']), 'druck.css: @import');
});

test('keine Zufallsquelle und keine Uhr im Code: die Auswahl ist deterministisch', () => {
  for (const d of CODE_DATEIEN) {
    assert.ok(!/Math\.random|crypto|Date\.now|new Date|performance\./.test(code[d]), `${d}: Zufall oder Uhr`);
  }
});

test('Grundgerüst: deutsch, Viewport, CSP exakt, nur eigene Stylesheets und ein Modul-Skript', () => {
  const html = code['index.html'];
  assert.match(html, /<html lang="de">/);
  assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1"/);
  assert.match(html, /<meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline'"/);
  assert.match(html, /<noscript>/);
  assert.match(html, /<title>Natur-Fürsorge-Karten 🌱<\/title>/);
  const links = [...html.matchAll(/<link[^>]*href="([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(links, ['../../packages/kinder-ui/css/kinder.css', 'druck.css']);
  const skripte = [...html.matchAll(/<script[^>]*src="([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(skripte, ['app.mjs']);
  assert.match(html, /<script type="module" src="app\.mjs"><\/script>/);
});

test('aria-live="polite" auf dem Hauptbereich #app', () => {
  const tag = code['index.html'].match(/<main[^>]*id="app"[^>]*>/)?.[0];
  assert.ok(tag, '<main id="app"> fehlt');
  assert.match(tag, /aria-live="polite"/);
});

test('Netzwerk-Wächter: aus packages/kinderschutz importiert und aufgerufen', () => {
  assert.match(code['app.mjs'], /import \{ installiereNetzwerkWaechter \} from '\.\.\/\.\.\/packages\/kinderschutz\/src\/index\.mjs';/);
  assert.match(code['app.mjs'], /^installiereNetzwerkWaechter\(\);$/m);
});

test('keine Druckzeichen: keine Häkchen, Kästchen, Sterne, Punkte als Zeichen, keine Emojis im Druckinhalt', () => {
  // Zeichenblöcke statt Aufzählung: Pfeile, Math-Zeichen, Dingbats, geometrische Formen, Emojis.
  // Der Mittelpunkt „·“ ist Satzzeichen im Fließtext und gilt hier nicht als Druckzeichen.
  const zeichen = /[☐☒☑✓✔✗✘✅❌★☆•●○◦∙‧▪▫◾◽■□]|[←-⋿⌀-➿⦀-⧿⬀-⯿■-◿・]|\p{Extended_Pictographic}/u;
  for (const [i, blatt] of blaetter.entries()) {
    assert.ok(!zeichen.test(druckText(blatt)), `Blatt ${i}: Druckzeichen im Drucktext`);
  }
});

test('keine Druckzeichen im Code, außer den Emojis des Bildschirms (Titel, Druckknopf)', () => {
  const zeichen = /[☐☒☑✓✔✗✘✅❌★☆•●○◦∙‧▪▫◾◽■□]|[←-⋿⌀-➿⦀-⧿⬀-⯿■-◿・]/;
  for (const d of CODE_DATEIEN) {
    assert.ok(!zeichen.test(code[d]), `${d}: Druckzeichen gefunden`);
  }
});

test('Druckblatt ohne Namenszeile, ohne Tages- oder Wochentagsfeld und ohne Seitenangabe', () => {
  // „Name“ auch in Zusammensetzungen; „Namen“ im Fließtext bleibt erlaubt.
  const namenUndTage = /Name(?!n\b)|Datum|Wochentag|\b(Montag|Dienstag|Mittwoch|Donnerstag|Freitag|Samstag|Sonntag)\b|\bTage?\b|_{3,}|…{2,}/i;
  for (const [i, blatt] of blaetter.entries()) {
    assert.ok(!namenUndTage.test(druckText(blatt)), `Blatt ${i}: Namenszeile oder Tagesfeld im Druck`);
    assert.ok(!/S\. \d/.test(druckText(blatt)), `Blatt ${i}: Seitenangabe im Druck (A18: keine auf Karten)`);
  }
  assert.ok(!/Name\s*:|_{3,}/.test(code['app.mjs'] + code['druck.css']), 'app.mjs oder druck.css: Namenszeile');
});

test('jedes Druckblatt kennzeichnet seine Anregungen und die Fragen als Eigenentwurf', () => {
  for (const [i, blatt] of blaetter.entries()) {
    assert.match(druckText(blatt), /Eigenentwurf/, `Blatt ${i}: ohne Kennzeichnung`);
  }
});

test('Pflichtmarkierung: steht auf dem Bildschirm bei den Seitenangaben und in den Daten', () => {
  assert.equal(daten.pflichtmarkierung, PFLICHT);
  assert.match(code['app.mjs'], /daten\.pflichtmarkierung/, 'app.mjs zeigt die Pflichtmarkierung nicht');
  assert.ok(alle['README.md'].includes(PFLICHT), 'README.md: Pflichtmarkierung fehlt');
  assert.ok(alle['GDD.md'].includes(PFLICHT), 'GDD.md: Pflichtmarkierung fehlt');
});

test('druck.css: A4 hoch, Bildschirmteile nur auf dem Bildschirm, Karten werden nicht zerrissen', () => {
  const css = code['druck.css'];
  assert.match(css, /@media print \{/);
  assert.match(css, /@page\s*\{\s*size: A4 portrait;/);
  assert.match(css, /\.nf-nur-bildschirm\s*\{\s*display: none !important;\s*\}/);
  assert.match(css, /\.nf-nur-druck\s*\{\s*display: block !important;\s*\}/);
  assert.match(css, /\.nf-nur-druck\s*\{\s*display: none;\s*\}/);
  assert.match(css, /break-inside: avoid;/);
});

test('Druckbereich: die Druckteile sind im Quelltext markiert, der Druckknopf ruft window.print auf', () => {
  const app = code['app.mjs'];
  assert.match(app, /el\('section', \{ class: 'nf-nur-druck' \}/);
  assert.match(app, /class: 'k-karte nf-karte'/);
  assert.match(app, /onclick: \(\) => window\.print\(\)/);
});

test('Knöpfe mindestens 48 px hoch: die gemeinsame Klasse .k-knopf hat min-height 3rem (docs/02, touch ≥ 48 px)', async () => {
  const kinderCss = await readFile(new URL('../../../packages/kinder-ui/css/kinder.css', import.meta.url), 'utf8');
  assert.match(kinderCss, /\.k-knopf\s*\{[^}]*min-height:\s*3rem;/);
});

test('Fußlink mindestens 48 px hoch', () => {
  assert.match(code['druck.css'], /\.k-fuss a\s*\{[^}]*min-height:\s*48px;/);
});

test('Fokus nach Klick: die Oberfläche wird neu gezeichnet und der Fokus geht auf dieselbe Kennung', () => {
  const app = code['app.mjs'];
  assert.match(app, /function zeichne\(fokus = null\)/);
  assert.match(app, /if \(fokus\) document\.getElementById\(fokus\)\?\.focus\(\);/);
  for (const h of daten.handlungen) {
    assert.match(app, new RegExp(`zeichne\\(\`nf-filter-\\$\\{h\\.id\\}\`\\)`), 'Filter ohne Fokus-Kennung');
  }
  assert.match(app, /zeichne\('nf-filter-alle'\)/);
});

test('keine uk- und ru-Fassung erfunden: der Vermerk steht in der GDD, die Daten haben keine uk- oder ru-Schlüssel', () => {
  const vermerk = 'uk und ru: nicht vorhanden, offen.';
  assert.ok(alle['GDD.md'].includes(vermerk), 'GDD.md: Vermerk fehlt');
  assert.ok(!/"(uk|ru)"\s*:/.test(code['daten/karten.json']), 'Daten: uk- oder ru-Schlüssel');
});

// Modellnamen sind Entscheidung A1 (docs/offene-punkte-kita.md), hier bewusst nicht geprüft.
test('keine KI-Begriffe in den Dateien der App', () => {
  const muster = /\bKI\b|LLM|Sprachmodell|Chatbot|künstliche Intelligenz/i;
  for (const [d, inhalt] of Object.entries(alle)) {
    assert.ok(!muster.test(inhalt), `${d}: ${inhalt.match(muster)?.[0]}`);
  }
});

test('keine Bewertung von Kindern im Code und in den Daten: keine Punkte, Stufe, Rang, Einstufung, Note (docs/02 Z. 141–146)', () => {
  // Dokumente dürfen solche Wörter verneinen („keine Punkte“), Oberfläche und Daten nicht.
  // logik.mjs ist ausgenommen: dort steht die Liste der verbotenen Feldnamen selbst (pruefeDaten).
  const muster = /unsicher|Selbstwert|Risiko|Diagnose|\bPunkte?\b|Rangliste|\bRang\b|Einstufung|\bStufe\b|\bPlatz\b|Prozent|\bSterne?\b|\bErgebnis\b|\bNoten?\b/i;
  for (const d of CODE_DATEIEN.filter((x) => x !== 'logik.mjs')) {
    assert.ok(!muster.test(code[d]), `${d}: ${code[d].match(muster)?.[0]}`);
  }
});

test('KIT-14: die Überschrift der vier Aufgaben steht im Quelltext vor der Hinweis-Box (DOM-Reihenfolge)', () => {
  // Die Aufgaben-Sektion und die Hinweis-Box werden in einem Aufruf von replaceChildren übergeben:
  // die Reihenfolge im Quelltext ist die Reihenfolge im DOM.
  const app = code['app.mjs'];
  const aufgaben = app.search(/el\('h2'[^\n]*'Die vier Aufgaben \(S\. 96\)'\)/);
  const hinweis = app.search(/el\('p', \{ style: 'margin-top:0;font-weight:600' \}, daten\.hinweis\)/);
  assert.ok(aufgaben >= 0, 'Überschrift „Die vier Aufgaben (S. 96)“ fehlt in app.mjs');
  assert.ok(hinweis >= 0, 'Hinweis-Box (daten.hinweis) fehlt in app.mjs');
  assert.ok(aufgaben < hinweis, 'die Aufgaben-Überschrift steht nach der Hinweis-Box');
});

test('Testzahl: README und GDD nennen die Zahl der Tests, die in test/ tatsächlich stehen', async () => {
  const dateien = (await readdir(new URL('test/', APP))).filter((d) => d.endsWith('.test.mjs'));
  let echt = 0;
  for (const d of dateien) {
    const quelle = await readFile(new URL(`test/${d}`, APP), 'utf8');
    echt += (quelle.match(/^test\(/gm) ?? []).length;
  }
  assert.ok(echt >= 15, `nur ${echt} Tests gefunden`);
  for (const doc of ['README.md', 'GDD.md']) {
    const nennungen = [...alle[doc].matchAll(/(?<![\d,.])(\d+)\s+Tests?(?![\wäöüß])/g)].map((m) => Number(m[1]));
    assert.ok(nennungen.length >= 1, `${doc} nennt keine Testzahl`);
    for (const n of nennungen) {
      assert.equal(n, echt, `${doc} nennt ${n} Tests, es sind ${echt}`);
    }
  }
});

test('package.json: privat, ES-Modul, Testskript vorhanden', () => {
  const pkg = JSON.parse(alle['package.json']);
  assert.equal(pkg.private, true);
  assert.equal(pkg.type, 'module');
  assert.match(pkg.scripts?.test ?? '', /node --test/);
});
