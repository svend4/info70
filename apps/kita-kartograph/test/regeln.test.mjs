import { test } from 'node:test';
import assert from 'node:assert/strict';
import { access, readdir, readFile } from 'node:fs/promises';
import daten from '../daten/symbole.json' with { type: 'json' };
import { druckInhalt, leerePlan, setzeSymbol, PFLICHTMARKIERUNG } from '../logik.mjs';

// Projektregeln für diese App, nach der Vorlage der Puppentheater-Werkstatt
// (apps/puppentheater-werkstatt/test/regeln.test.mjs), mit den Abweichungen aus dem Bauauftrag
// GEM-10 (docs/bauauftraege, Abschnitt 6 und 9):
//  - Speicherung: nur der letzte Plan unter `kartograph.plan`, löschbar (docs/02 Z. 25).
//  - Druck: ein eigenes Druckblatt mit druck.css; Zeichen als Nummern, keine Emojis, keine
//    Namenszeile; die Pflichtmarkierung steht auf dem Blatt, weil die Daten Seitenangaben tragen.
// Die Prüfung liest die Dateien der App (ohne test/). Die Testdateien selbst dürfen die verbotenen
// Wörter nennen, um sie zu verbieten.

const APP = new URL('../', import.meta.url);
const CODE_DATEIEN = ['index.html', 'app.mjs', 'logik.mjs', 'druck.css', 'daten/symbole.json'];
const ALLE_DATEIEN = [...CODE_DATEIEN, 'eltern.html', 'package.json', 'README.md', 'GDD.md'];
const PFLICHT = 'Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.';

const lese = (datei) => readFile(new URL(datei, APP), 'utf8');
const code = Object.fromEntries(await Promise.all(CODE_DATEIEN.map(async (d) => [d, await lese(d)])));
const alle = Object.fromEntries(await Promise.all(ALLE_DATEIEN.map(async (d) => [d, await lese(d)])));

// Druckblätter: leer, ein Zeichen, alle Felder mit wechselnden Symbolen (Mehrfachanzahl),
// und zwei Nordkanten. So kommt jedes Symbol auf mindestens einem Blatt vor.
const alleBelegt = (() => {
  let plan = leerePlan();
  for (let i = 0; i < 36; i++) plan = setzeSymbol(plan, i, daten.symbole[i % daten.symbole.length].id, daten.symbole);
  return plan;
})();
const blaetter = [
  druckInhalt(leerePlan(), daten.symbole, 'oben'),
  druckInhalt(setzeSymbol(leerePlan(), 0, daten.symbole[0].id, daten.symbole), daten.symbole, 'oben'),
  druckInhalt(alleBelegt, daten.symbole, 'rechts'),
  druckInhalt(alleBelegt, daten.symbole, 'links'),
];
// Alles, was auf dem Blatt gedruckt wird, als Text.
const druckText = (d) => [
  d.kopf, d.titel, d.norden, ...d.felder.map(String),
  ...d.legende.map((s) => `${s.nummer} ${s.name} ${s.anzahl}`),
  d.pflicht,
].join('\n');

test('keine Eingabefelder für Kinder: kein input, textarea, select, form, contenteditable', () => {
  const muster = /<\s*(input|textarea|select|form)\b|contenteditable|(el|createElement)\(\s*['"](input|textarea|select|form)['"]/i;
  for (const d of ['index.html', 'app.mjs']) {
    assert.ok(!muster.test(code[d]), `${d}: Eingabeelement gefunden`);
  }
});

test('Speicherung: nur localStorage, nur unter kartograph.plan, jeder Zugriff in try, und die Löschung räumt den Schlüssel', () => {
  const app = code['app.mjs'];
  const verboten = /sessionStorage|indexedDB|document\.cookie|\bcaches\b|navigator\.storage/;
  for (const d of CODE_DATEIEN) {
    assert.ok(!verboten.test(code[d]), `${d}: Speicher außer localStorage gefunden`);
  }
  for (const d of ['index.html', 'logik.mjs', 'daten/symbole.json', 'druck.css']) {
    assert.ok(!/localStorage/.test(code[d]), `${d}: localStorage gehört nur in app.mjs`);
  }
  assert.equal(app.match(/localStorage\./g)?.length ?? 0, 3, 'app.mjs: genau drei Zugriffe erwartet (lesen, schreiben, löschen)');
  assert.match(app, /const SPEICHER = 'kartograph\.plan';/);
  assert.match(app, /try \{\s*return localStorage\.getItem\(SPEICHER\);/);
  assert.match(app, /try \{\s*localStorage\.setItem\(SPEICHER,/);
  assert.match(app, /try \{\s*localStorage\.removeItem\(SPEICHER\);/);
});

test('keine externen Adressen, keine Netzaufrufe in den Dateien der App, kein @import', () => {
  const netz = /\bfetch\s*\(|XMLHttpRequest|WebSocket|sendBeacon|EventSource|importScripts|new Worker|window\[|globalThis|wss?:/;
  for (const d of CODE_DATEIEN) {
    assert.ok(!/https?:\/\/|(?<![:\w])\/\/[\w-]+\.[a-z]{2,}/i.test(code[d]), `${d}: externe Adresse`);
  }
  for (const d of ['app.mjs', 'logik.mjs']) {
    assert.ok(!netz.test(code[d]), `${d}: Netzaufruf gefunden`);
  }
  assert.ok(!/@import/.test(code['druck.css']), 'druck.css: @import');
});

test('Daten kommen per JSON-Import mit Typangabe, nicht per fetch', () => {
  assert.match(code['app.mjs'], /^import daten from '\.\/daten\/symbole\.json' with \{ type: 'json' \};$/m);
});

test('Zufall und Uhr: keine Stelle im Code; die Logik bleibt rein', () => {
  for (const d of CODE_DATEIEN) {
    assert.ok(!/Math\.random|crypto|Date\.now|new Date|performance\./.test(code[d]), `${d}: Zufall oder Uhr`);
  }
});

test('Grundgerüst: deutsch, Viewport, CSP exakt, nur Bibliotheks- und eigenes Stylesheet, ein Modul-Skript', () => {
  const html = code['index.html'];
  assert.match(html, /<html lang="de">/);
  assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1"/);
  assert.match(html, /<meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline'"/);
  assert.match(html, /<noscript>/);
  // Der Titel darf das Emoji tragen: Er gehört nicht zum Druck.
  assert.match(html, /<title>Kita-Kartograph 🗺️<\/title>/);
  const links = [...html.matchAll(/<link rel="stylesheet"[^>]*href="([^"]+)"/g)].map((m) => m[1]);
  // Jeder andere Link ist genau das gemeinsame Favicon (gleicher Ursprung, Entscheidung Max 21а): nichts Fremdes.
  const andereLinks = [...html.matchAll(/<link(?![^>]*rel="stylesheet")[^>]*>/g)].map((m) => m[0]);
  assert.ok(andereLinks.every((l) => /^<link rel="icon" type="image\/svg\+xml" href="(?:\.\.\/\.\.\/)?packages\/kinder-ui\/img\/favicon\.svg" \/>$/.test(l)), `index.html: fremder Link ${andereLinks.join(' ')}`);
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

test('Netzwerk-Wächter: aus packages/kinderschutz importiert und aufgerufen', async () => {
  assert.match(code['app.mjs'], /import \{ installiereNetzwerkWaechter \} from '\.\.\/\.\.\/packages\/kinderschutz\/src\/index\.mjs';/);
  assert.match(code['app.mjs'], /^installiereNetzwerkWaechter\(\);$/m);
  await access(new URL('../../../packages/kinderschutz/src/index.mjs', import.meta.url));
});

test('Knöpfe mindestens 48 px hoch: .k-knopf hat min-height 3rem, der Fußlink 48 px', async () => {
  const kinderCss = await readFile(new URL('../../../packages/kinder-ui/css/kinder.css', import.meta.url), 'utf8');
  assert.match(kinderCss, /\.k-knopf\s*\{[^}]*min-height:\s*3rem;/);
  assert.match(code['app.mjs'], /const FUSS_LINK = '[^']*min-height:48px;/);
});

test('Fokus nach Klick: jeder Knopf trägt eine data-kennung, die Kennungen sind eindeutig', () => {
  const app = code['app.mjs'];
  const knoepfe = app.match(/el\('button'/g) ?? [];
  const kennungen = app.match(/'data-kennung': /g) ?? [];
  assert.equal(kennungen.length, knoepfe.length, `${knoepfe.length} Knöpfe, aber ${kennungen.length} data-kennung`);
  const feste = [...app.matchAll(/'data-kennung': '([^']+)'/g)].map((m) => m[1]);
  assert.equal(new Set(feste).size, feste.length, 'doppelte feste data-kennung');
});

test('Himmelsrichtung wird in place umgefärbt: waehleNorden und markiereNorden bauen die Seite nicht neu auf', () => {
  const app = code['app.mjs'];
  for (const name of ['waehleNorden', 'markiereNorden']) {
    const koerper = app.match(new RegExp(`function ${name}\\([\\s\\S]*?\\n\\}`))?.[0] ?? '';
    assert.ok(koerper.length > 0, `${name} fehlt`);
    assert.doesNotMatch(koerper, /render\(|replaceChildren/, `${name} baut neu auf`);
  }
});

test('Druckblatt: eigenes Blatt mit druck.css und @media print; Bildschirmteile tragen nur-bildschirm, das Blatt steht außerhalb von #app', () => {
  const app = code['app.mjs'];
  const css = code['druck.css'];
  assert.match(css, /@media print \{/);
  assert.match(css, /@page\s*\{\s*size: A4 portrait;/);
  assert.match(css, /\.nur-bildschirm\s*\{\s*display: none !important;\s*\}/);
  assert.match(css, /\.nur-druck\s*\{\s*display: block;/);
  assert.match(css, /\.nur-druck\s*\{\s*display: none;\s*\}/);
  assert.match(app, /el\('div', \{ class: 'nur-bildschirm' \}, \.\.\.\[/, 'Bildschirmteile nicht in nur-bildschirm');
  assert.match(app, /const druckBox = el\('div', \{ class: 'nur-druck', id: 'druckbereich' \}\);\s*app\.after\(druckBox\);/);
  assert.equal(app.match(/window\.print\(\)/g)?.length ?? 0, 1, 'window.print genau einmal (Knopf „Plan drucken“)');
});

test('Druckinhalt ohne Emoji und ohne Druckzeichen: nur Text und Nummern', () => {
  // Zeichenblöcke wie in der Puppentheater-Prüfung; \p{Extended_Pictographic} fängt alle Emojis.
  const zeichen = /[☐☒☑✓✔✗✘✅❌★☆•●○◦·∙■□]|[←-⋿⌀-➿⦀-⧿⬀-⯿■-◿・]|\p{Extended_Pictographic}/u;
  for (const [i, d] of blaetter.entries()) {
    assert.ok(!zeichen.test(druckText(d)), `Blatt ${i}: Emoji oder Druckzeichen im Druckinhalt`);
  }
});

test('im Quelltext: die Funktion, die das Druckblatt baut, enthält kein Emoji', () => {
  const app = code['app.mjs'];
  const start = app.indexOf('function druckKinder()');
  assert.ok(start > -1, 'druckKinder() fehlt');
  const ende = app.indexOf('\n}\n', start);
  const funktion = app.slice(start, ende);
  assert.ok(!/\p{Extended_Pictographic}/u.test(funktion), 'druckKinder(): Emoji im Druckblatt');
});

test('Pflichtmarkierung auf jedem Druckblatt, und sie ist die vorgeschriebene Zeile', () => {
  assert.equal(PFLICHTMARKIERUNG, PFLICHT);
  for (const [i, d] of blaetter.entries()) {
    assert.ok(druckText(d).includes(PFLICHT), `Blatt ${i}: Pflichtmarkierung fehlt im Druck`);
  }
  assert.match(code['app.mjs'], /el\('p', \{ class: 'druck-pflicht' \}, d\.pflicht\)/, 'Pflichtzeile fehlt im Druckblatt');
  for (const [d, inhalt] of Object.entries(alle)) {
    assert.ok(!/von Hand geprüft/i.test(inhalt), `${d}: „von Hand geprüft“ ist nicht belegt`);
  }
});

test('Druckblatt ohne Namenszeile und ohne Tages- oder Wochentagsfeld', () => {
  // „Name“ auch in Zusammensetzungen; „Namen“ im Fließtext bleibt erlaubt.
  const namenUndTage = /Name(?!n\b)|Datum|Wochentag|\b(Montag|Dienstag|Mittwoch|Donnerstag|Freitag|Samstag|Sonntag)\b|\bTage?\b|_{3,}|…{2,}/i;
  for (const [i, d] of blaetter.entries()) {
    assert.ok(!namenUndTage.test(druckText(d)), `Blatt ${i}: Namenszeile oder Tagesfeld im Druck`);
  }
});

test('Keine Bewertung von Kindern im Code und in den Daten: keine Punkte, Stufe, Rang, Einstufung, Note', () => {
  // Dokumente dürfen solche Wörter verneinen („keine Punkte“), Oberfläche und Daten nicht.
  // „Platz“ kommt nicht vor: die Felder heißen Reihe und Spalte, ein Rangplatz ist das nicht.
  const muster = /unsicher|Selbstwert|Risiko|Diagnose|\bPunkte?\b|Rangliste|\bRang\b|Einstufung|\bStufe\b|Prozent|\bSterne?\b|\bErgebnis\b|\bNoten?\b/i;
  for (const d of CODE_DATEIEN) {
    assert.ok(!muster.test(code[d]), `${d}: ${code[d].match(muster)?.[0]}`);
  }
});

test('Jedes Zeichen trägt die Seitenangabe und die Eigenentwurf-Kennzeichnung', () => {
  for (const s of daten.symbole) {
    assert.match(s.quelle?.seite ?? '', /^S\. \d+$/, `${s.id}: Seitenangabe fehlt`);
    assert.equal(s.eigenentwurf, true, `${s.id}: Eigenentwurf nicht gekennzeichnet`);
  }
});

// Modellnamen sind Entscheidung A1 (docs/offene-punkte-kita.md), hier bewusst nicht geprüft.
test('keine KI-Begriffe in den Dateien der App', () => {
  const muster = /\bKI\b|LLM|Sprachmodell|Chatbot|künstliche Intelligenz/i;
  for (const [d, inhalt] of Object.entries(alle)) {
    assert.ok(!muster.test(inhalt), `${d}: ${inhalt.match(muster)?.[0]}`);
  }
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
