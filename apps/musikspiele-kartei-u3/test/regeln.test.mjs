import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { DRUCK_KARTE_FUSS, DRUCK_KOPF, ALTER_OHNE_ANGABE } from '../logik.mjs';

// Projektregeln für diese App: docs/02 Z. 22–24 (keine Anfragen nach außen), docs/02 Z. 17–30
// (keine Eingabe, keine Speicherung), docs/02 Z. 50 (Knöpfe und Fußlink mindestens 48 px),
// docs/02 Z. 79–82 (Druck ohne Zeichen und Namenszeile), docs/02 Z. 141–146 (keine Bewertung von Kindern),
// Druckregeln aus docs/bauauftraege/KIT-12 (eine Karte je Blatt, keine Seitenangabe auf dem Blatt).
// Die Prüfung liest die Dateien der App (ohne test/).

const APP = new URL('../', import.meta.url);
const CODE_DATEIEN = ['index.html', 'app.mjs', 'logik.mjs', 'druck.css', 'daten/karten.json'];
const ALLE_DATEIEN = [...CODE_DATEIEN, 'package.json', 'README.md', 'GDD.md'];
const PFLICHT = 'Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.';

const lese = (datei) => readFile(new URL(datei, APP), 'utf8');
const code = Object.fromEntries(await Promise.all(CODE_DATEIEN.map(async (d) => [d, await lese(d)])));
const alle = Object.fromEntries(await Promise.all(ALLE_DATEIEN.map(async (d) => [d, await lese(d)])));
const daten = JSON.parse(code['daten/karten.json']);

// Alles, was auf einem Druckblatt stehen kann: feste Zeilen und die Texte der Karten.
const gedruckt = [
  DRUCK_KOPF,
  DRUCK_KARTE_FUSS,
  ALTER_OHNE_ANGABE,
  ...daten.gattungen.flatMap((g) => [g.gattung, g.prinzip, g.altersHinweis ?? '', ...g.beispiele.map((b) => b.titel)]),
];

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

test('keine externen Adressen und keine Netzaufrufe in den Dateien der App; kein @import', () => {
  const netz = /\bfetch\s*\(|XMLHttpRequest|WebSocket|sendBeacon|EventSource|importScripts|new Worker|window\[|globalThis|wss?:/;
  for (const d of CODE_DATEIEN) {
    assert.ok(!/https?:\/\/|(?<![:\w])\/\/[\w-]+\.[a-z]{2,}/i.test(code[d]), `${d}: externe Adresse`);
  }
  // fetch lädt nur die eigene Datei daten/karten.json; das ist der einzige erlaubte Aufruf.
  assert.equal(code['app.mjs'].match(/fetch\(/g)?.length, 1, 'app.mjs: genau ein fetch erlaubt');
  assert.match(code['app.mjs'], /fetch\('daten\/karten\.json'\)/);
  assert.ok(!netz.test(code['logik.mjs']), 'logik.mjs: Netzaufruf gefunden');
  assert.ok(!/@import/.test(code['druck.css']), 'druck.css: @import');
});

test('Zufall nur in app.mjs; logik.mjs, Daten, HTML und CSS haben keine Zufallsquelle und keine Uhr', () => {
  for (const d of ['logik.mjs', 'daten/karten.json', 'index.html', 'druck.css']) {
    assert.ok(!/Math\.random|crypto|Date\.now|new Date|performance\./.test(code[d]), `${d}: Zufall oder Uhr`);
  }
  assert.ok(!/Math\.random/.test(code['app.mjs']), 'app.mjs: Zufall, die Kartei braucht keinen');
});

test('Grundgerüst: deutsch, Viewport, CSP exakt, nur eigene Stylesheets und ein Modul-Skript, Titel ohne Emoji', () => {
  const html = code['index.html'];
  assert.match(html, /<html lang="de">/);
  assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1"/);
  assert.match(html, /<meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline'"/);
  assert.match(html, /<noscript>/);
  assert.match(html, /<title>Musikspiele U3<\/title>/);
  assert.ok(!/\p{Extended_Pictographic}/u.test(html.match(/<title>.*?<\/title>/)?.[0] ?? ''), 'Titel mit Emoji: der Druck zeigt ihn als Kopfzeile');
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

test('Netzwerk-Wächter: aus packages/kinderschutz importiert und aufgerufen', () => {
  assert.match(code['app.mjs'], /import \{ installiereNetzwerkWaechter \} from '\.\.\/\.\.\/packages\/kinderschutz\/src\/index\.mjs';/);
  assert.match(code['app.mjs'], /^installiereNetzwerkWaechter\(\);$/m);
});

test('keine Druckzeichen: keine Häkchen, Kästchen, Sterne, Punkte als Zeichen, keine Emojis im Druck', () => {
  // Zeichenblöcke: Pfeile, Math-Zeichen, Dingbats, geometrische Formen, Emojis.
  const zeichen = /[☐☒☑✓✔✗✘✅❌★☆•●○◦·∙‧▪▫◾◽■□]|[←-⋿⌀-➿⦀-⧿⬀-⯿■-◿・]|\p{Extended_Pictographic}/u;
  for (const [i, text] of gedruckt.entries()) {
    assert.ok(!zeichen.test(text), `Druckzeile ${i}: Druckzeichen „${text}“`);
  }
  for (const d of ['logik.mjs', 'druck.css', 'daten/karten.json']) {
    assert.ok(!zeichen.test(code[d]), `${d}: Druckzeichen gefunden`);
  }
});

test('Druckblatt ohne Namenszeile und ohne Tages- oder Wochentagsfeld', () => {
  // „Name“ auch in Zusammensetzungen; „Namen“ im Fließtext bleibt erlaubt.
  const namenUndTage = /Name(?!n\b)|Datum|Wochentag|\b(Montag|Dienstag|Mittwoch|Donnerstag|Freitag|Samstag|Sonntag)\b|\bTage?\b|_{3,}|…{2,}/i;
  for (const [i, text] of gedruckt.entries()) {
    assert.ok(!namenUndTage.test(text), `Druckzeile ${i}: Namenszeile oder Tagesfeld`);
  }
  assert.ok(!/Name\s*:|_{3,}/.test(code['app.mjs'] + code['druck.css']), 'app.mjs oder druck.css: Namenszeile');
});

test('Druckblatt ohne Seitenangabe: kein „S. n“ im Druck; die Seiten stehen nur auf dem Bildschirm', () => {
  for (const [i, text] of gedruckt.entries()) {
    assert.doesNotMatch(text, /S\. ?\d/, `Druckzeile ${i}: Seitenangabe im Druck`);
  }
  // Auf dem Bildschirm stehen Seitenangaben: dann gilt die Pflichtmarkierung dort.
  assert.match(code['app.mjs'], /class: 'mk-nur-bildschirm' \}, ` \(\$\{b\.seite\}\)`/, 'Seite der Beispiele nicht nur auf dem Bildschirm');
  assert.match(code['app.mjs'], /quelleTextVon\(g\)\)\)/);
  assert.match(code['app.mjs'], /class: 'mk-quelle mk-nur-bildschirm' \}, quelleTextVon/);
  assert.match(code['app.mjs'], /el\('p', \{ class: 'mk-quelle' \}, PFLICHT\)/);
});

test('Pflichtmarkierung: auf dem Bildschirm dort, wo Seiten stehen, in README und GDD unter „## Offen“; nie „von Hand geprüft“', () => {
  assert.ok(code['app.mjs'].includes(`'${PFLICHT}'`), 'app.mjs: Pflichtmarkierung fehlt');
  assert.ok(alle['README.md'].includes(PFLICHT), 'README.md: Pflichtmarkierung fehlt');
  const gdd = alle['GDD.md'];
  assert.ok(gdd.includes('## Offen'), 'GDD.md: Abschnitt „## Offen“ fehlt');
  assert.ok(gdd.slice(gdd.indexOf('## Offen')).includes(PFLICHT), 'GDD.md: Pflichtmarkierung nicht unter „## Offen“');
  for (const [d, inhalt] of Object.entries(alle)) {
    assert.ok(!/von Hand geprüft/i.test(inhalt), `${d}: „von Hand geprüft“ ist nicht belegt`);
  }
});

test('Eigenentwurf-Kennzeichnung: Druckkopf und jede gedruckte Karte nennen das Prinzip als Eigenentwurf', () => {
  assert.match(DRUCK_KOPF, /Prinzipien: Eigenentwurf/);
  assert.match(DRUCK_KARTE_FUSS, /Prinzip: Eigenentwurf/);
  assert.match(code['app.mjs'], /el\('p', \{ class: 'mk-quelle' \}, DRUCK_KARTE_FUSS\)/);
});

test('jeder Titel eines Beispiels hat höchstens 6 Wörter (Zitatgrenze docs/10)', () => {
  for (const g of daten.gattungen) {
    for (const b of g.beispiele) {
      assert.ok(b.titel.trim().split(/\s+/).length <= 6, `${g.id}: „${b.titel}“ hat mehr als 6 Wörter`);
    }
  }
});

test('druck.css: A4 hoch, Bildschirmelemente nur im Bildschirm, eine Karte je Blatt; Titel bricht um, Fußlink 48 px hoch', () => {
  const css = code['druck.css'];
  assert.match(css, /@media print \{/);
  assert.match(css, /@page\s*\{\s*size: A4 portrait;/);
  assert.match(css, /\.mk-nur-bildschirm\s*\{\s*display: none !important;\s*\}/);
  assert.match(css, /\.mk-nur-druck\s*\{\s*display: block !important;\s*\}/);
  assert.match(css, /break-inside: avoid;/);
  assert.match(css, /\.mk-karte\s*\{[^}]*break-after: page;/, 'jede Karte braucht einen Seitenumbruch danach');
  assert.match(css, /h1\.k-titel\s*\{[^}]*overflow-wrap:\s*anywhere;[^}]*word-break:\s*normal;/);
  assert.match(css, /\.k-fuss a\s*\{[^}]*min-height:\s*48px;/);
  assert.doesNotMatch(css, /\.k-fuss a\s*\{[^}]*min-height:\s*44px;/);
  assert.match(code['app.mjs'], /el\('a', \{ href: '\.\.\/\.\.\/impressum\.html' \}, 'Impressum & Datenschutz'\)/);
});

test('Knöpfe mindestens 48 px hoch: .k-knopf und .k-knopf--klein haben min-height 3rem (docs/02, touch ≥ 48 px)', async () => {
  const kinderCss = await readFile(new URL('../../../packages/kinder-ui/css/kinder.css', import.meta.url), 'utf8');
  assert.match(kinderCss, /\.k-knopf\s*\{[^}]*min-height:\s*3rem;/);
  assert.match(kinderCss, /\.k-knopf--klein\s*\{[^}]*min-height:\s*3rem;/);
});

test('Fokus nach Klick: der Filterknopf bekommt den Fokus zurück; jeder Filterknopf trägt eine eigene Kennung', () => {
  const app = code['app.mjs'];
  const merke = app.indexOf('const merkeKnopf = document.activeElement?.id');
  const neu = app.indexOf('app.replaceChildren(');
  const zurueck = app.indexOf("document.getElementById(merkeKnopf)?.focus();");
  assert.ok(merke > -1 && neu > merke && zurueck > neu, 'Fokus muss vor replaceChildren gemerkt und danach gesetzt werden');
  assert.match(app, /`mk-filter-\$\{g\.id\}`/);
  assert.match(app, /'mk-filter-alle'/);
  const ids = daten.gattungen.map((g) => g.id);
  assert.equal(new Set(ids).size, ids.length, 'doppelte Gattungs-Kennung');
});

test('keine uk- und ru-Fassung erfunden: der Vermerk steht in der GDD', () => {
  assert.ok(alle['GDD.md'].includes('uk und ru: nicht vorhanden, offen.'), 'GDD.md: Vermerk fehlt');
  assert.ok(!/"(uk|ru)"\s*:/.test(code['daten/karten.json']), 'Daten: uk- oder ru-Schlüssel');
});

test('keine KI-Begriffe in den Dateien der App', () => {
  const muster = /\bKI\b|LLM|Sprachmodell|Chatbot|künstliche Intelligenz/i;
  for (const [d, inhalt] of Object.entries(alle)) {
    assert.ok(!muster.test(inhalt), `${d}: ${inhalt.match(muster)?.[0]}`);
  }
});

test('keine Bewertung von Kindern im Code und in den Daten: keine Punkte, Stufe, Rang, Einstufung, Note (docs/02 Z. 141–146)', () => {
  const muster = /unsicher|Selbstwert|Risiko|Diagnose|\bPunkte?\b|Rangliste|\bRang\b|Einstufung|\bStufe\b|\bPlatz\b|Prozent|\bSterne?\b|\bErgebnis\b|\bNote\b/i;
  for (const d of CODE_DATEIEN) {
    assert.ok(!muster.test(code[d]), `${d}: ${code[d].match(muster)?.[0]}`);
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

test('package.json: privat, ES-Modul, Testskript führt beide Testdateien aus', () => {
  const pkg = JSON.parse(alle['package.json']);
  assert.equal(pkg.private, true);
  assert.equal(pkg.type, 'module');
  assert.match(pkg.scripts?.test ?? '', /node --test test\/logik\.test\.mjs test\/regeln\.test\.mjs/);
});
