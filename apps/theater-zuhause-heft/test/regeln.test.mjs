import { test } from 'node:test';
import assert from 'node:assert/strict';
import { access, readdir, readFile } from 'node:fs/promises';
import daten from '../daten/heft.json' with { type: 'json' };
import { druckSeiten, seiteText } from '../logik.mjs';

// Projektregeln, für diese App geprüft: docs/02 Z. 22–24 (keine Anfragen nach außen),
// docs/02 Z. 79–82 (Druckbögen), docs/02 Z. 141–146 (keine Bewertung von Kindern);
// die Altersregel und die Speicherregel haben keine docs/02-Zeile, sie sind Projektregeln.
// Die Prüfung liest die Dateien der App (ohne test/). Die Testdateien selbst
// dürfen die verbotenen Wörter nennen, um sie zu verbieten.

const APP = new URL('../', import.meta.url);
const CODE_DATEIEN = ['index.html', 'app.mjs', 'logik.mjs', 'druck.css', 'daten/heft.json'];
const ALLE_DATEIEN = [...CODE_DATEIEN, 'package.json', 'README.md', 'GDD.md'];
const PFLICHT = 'Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.';

const lese = (datei) => readFile(new URL(datei, APP), 'utf8');
const code = Object.fromEntries(await Promise.all(CODE_DATEIEN.map(async (d) => [d, await lese(d)])));
const alle = Object.fromEntries(await Promise.all(ALLE_DATEIEN.map(async (d) => [d, await lese(d)])));
const gedruckt = druckSeiten(daten).map((s) => seiteText(daten, s)).join('\n');

test('keine Eingabefelder für Kinder: kein input, textarea, select, form, contenteditable', () => {
  const muster = /<\s*(input|textarea|select|form)\b|contenteditable|el\(\s*['"](input|textarea|select|form)['"]/i;
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

test('keine externen Adressen, keine Netzaufrufe in den Dateien der App, kein @import', () => {
  const netz = /\bfetch\s*\(|XMLHttpRequest|WebSocket|sendBeacon|EventSource|importScripts|new Worker/;
  for (const d of CODE_DATEIEN) {
    assert.ok(!/https?:\/\//i.test(code[d]), `${d}: externe Adresse`);
  }
  for (const d of ['app.mjs', 'logik.mjs']) {
    assert.ok(!netz.test(code[d]), `${d}: Netzaufruf gefunden`);
  }
  assert.ok(!/@import/.test(code['druck.css']), 'druck.css: @import');
});

test('die Inhalte kommen per JSON-Import mit Typangabe, die Oberfläche lädt nichts nach', () => {
  assert.match(code['app.mjs'], /^import daten from '\.\/daten\/heft\.json' with \{ type: 'json' \};$/m);
});

test('Grundgerüst: deutsch, Viewport, CSP exakt, nur eigene Stylesheets und ein Modul-Skript', () => {
  const html = code['index.html'];
  assert.match(html, /<html lang="de">/);
  assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1"/);
  assert.match(html, /<meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline'"/);
  assert.match(html, /<noscript>/);
  assert.match(html, /<title>Theater zuhause – Bastel- und Spielheft<\/title>/);
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

test('Netzwerk-Wächter: aus packages/kinderschutz importiert und aufgerufen', async () => {
  assert.match(code['app.mjs'], /import \{ installiereNetzwerkWaechter \} from '\.\.\/\.\.\/packages\/kinderschutz\/src\/index\.mjs';/);
  assert.match(code['app.mjs'], /^installiereNetzwerkWaechter\(\);$/m);
  await access(new URL('../../../packages/kinderschutz/src/index.mjs', import.meta.url));
});

test('keine Druckzeichen: keine Häkchen, Kästchen, Sterne, Punkte als Zeichen, keine Emojis', () => {
  const zeichen = /[☐☒☑✓✔✗✘✅❌★☆•●○◦·∙‧▪▫◾◽■□]|\p{Extended_Pictographic}/u;
  assert.ok(!zeichen.test(gedruckt), 'Druckzeichen im gedruckten Text');
  for (const d of CODE_DATEIEN) {
    assert.ok(!zeichen.test(code[d]), `${d}: Druckzeichen gefunden`);
  }
});

test('gedruckter Text ohne Namenszeile und ohne Tages- oder Wochentagsfeld', () => {
  const namenUndTage = /\bName\b|Namenszeile|\bDatum\b|Wochentag|\b(Montag|Dienstag|Mittwoch|Donnerstag|Freitag|Samstag|Sonntag)\b|\bTag\b|_{3,}|…{2,}/i;
  assert.ok(!namenUndTage.test(gedruckt), `Namenszeile oder Tagesfeld im Druck: ${gedruckt.match(namenUndTage)?.[0]}`);
  assert.ok(!/Name\s*:|_{3,}/.test(code['app.mjs'] + code['druck.css']), 'app.mjs oder druck.css: Namenszeile');
});

test('Pflichtmarkierung: auf jeder gedruckten Seite, im Fuß, in README und GDD unter „## Offen“; nie „von Hand geprüft“', () => {
  assert.equal(daten.pflichtmarkierung, PFLICHT);
  for (const seite of druckSeiten(daten)) {
    assert.ok(seiteText(daten, seite).includes(PFLICHT), `${seite.id}: Pflichtmarkierung fehlt im Druck`);
  }
  assert.ok(code['app.mjs'].includes('el(\'p\', {}, daten.pflichtmarkierung)'), 'Pflichtmarkierung fehlt im Fuß');
  assert.ok(code['app.mjs'].includes("class: 'bsk-pflicht'"), 'Pflichtmarkierung ohne eigene Klasse');
  assert.ok(alle['README.md'].includes(PFLICHT), 'README.md: Pflichtmarkierung fehlt');
  const gdd = alle['GDD.md'];
  assert.ok(gdd.includes('## Offen'), 'GDD.md: Abschnitt „## Offen“ fehlt');
  assert.ok(gdd.slice(gdd.indexOf('## Offen')).includes(PFLICHT), 'GDD.md: Pflichtmarkierung nicht unter „## Offen“');
  for (const [d, inhalt] of Object.entries(alle)) {
    assert.ok(!/von Hand geprüft/i.test(inhalt), `${d}: „von Hand geprüft“ ist nicht belegt`);
  }
});

test('Eigenentwurf-Kennzeichnung: jede Übertragung, Beschreibung, Szene und Bastelschritt ist als Eigenentwurf benannt', () => {
  const logik = code['logik.mjs'];
  const beschriftungen = [
    'Hinweis für Eltern (Eigenentwurf)', 'Beschreibung (Eigenentwurf)', 'Material (Eigenentwurf)',
    'Passende Szenen (Eigenentwurf)', 'Gespielt mit (Eigenentwurf)', 'Rollen (Eigenentwurf)',
    'Text (Eigenentwurf)', 'Offenes Ende (Eigenentwurf)', 'Spielszene (Eigenentwurf)',
    '(Eigenentwurf)`',
  ];
  for (const b of beschriftungen) {
    assert.ok(logik.includes(b), `logik.mjs: Kennzeichnung fehlt: ${b}`);
  }
  assert.ok(daten.sicherheitssatz.includes('(Eigenentwurf)'), 'Sicherheitssatz ohne Eigenentwurf');
  assert.ok(daten.sprachen.includes('Eigenentwurf'), 'Sprachenvermerk ohne Eigenentwurf');
});

test('druck.css: A4 hoch, Bildschirmelemente nur im Bildschirm, jede Seite auf eigenem Blatt; Titel bricht um, Fuß-Link 48 px hoch', () => {
  const css = code['druck.css'];
  assert.match(css, /@media print \{/);
  assert.match(css, /@page\s*\{\s*size: A4 portrait;/);
  assert.match(css, /\.bsk-nur-bildschirm\s*\{\s*display: none !important;\s*\}/);
  assert.match(css, /\.bsk-nur-druck\s*\{\s*display: none;\s*\}/);
  assert.match(css, /\.bsk-nur-druck\s*\{\s*display: block;\s*\}/);
  assert.match(css, /break-after: page;/);
  assert.match(css, /page-break-after: always;/);
  assert.match(css, /h1\.k-titel\s*\{[^}]*overflow-wrap:\s*anywhere;[^}]*word-break:\s*normal;/);
  assert.match(css, /\.k-fuss a\s*\{[^}]*min-height:\s*48px;/);
  assert.doesNotMatch(css, /\.k-fuss a\s*\{[^}]*min-height:\s*44px;/);
  assert.match(code['app.mjs'], /el\('a', \{ href: '\.\.\/\.\.\/impressum\.html' \}, 'Impressum und Datenschutz'\)/);
});

test('Druckbereich: alle Seiten des Heftes in fester Reihenfolge, der Katalog ist nur auf dem Bildschirm', () => {
  const app = code['app.mjs'];
  assert.match(app, /el\('div', \{ class: 'bsk-nur-druck', id: 'druckbereich' \}, \.\.\.alle\.map\(druckSeite\)\)/);
  assert.match(app, /el\('div', \{ class: 'bsk-katalog bsk-nur-bildschirm' \}/);
  assert.match(app, /class: 'k-karte bsk-nur-bildschirm'/);
  assert.match(app, /onclick: \(\) => window\.print\(\)/);
  assert.match(code['logik.mjs'], /export function druckSeiten\(daten\)/);
});

test('Fokus nach Klick: jeder Knopf trägt eine data-kennung, die festen Kennungen sind eindeutig; render() merkt sich den Fokus und setzt ihn zurück', () => {
  const app = code['app.mjs'];
  const knoepfe = app.match(/el\('button'/g) ?? [];
  const kennungen = app.match(/'data-kennung': /g) ?? [];
  assert.equal(kennungen.length, knoepfe.length, `${knoepfe.length} Knöpfe, aber ${kennungen.length} data-kennung`);
  const feste = [...app.matchAll(/'data-kennung': '([^']+)'/g)].map((m) => m[1]);
  assert.equal(new Set(feste).size, feste.length, 'doppelte feste data-kennung');
  assert.match(app, /'data-kennung': `filter-\$\{wert\}`/, 'Filterknöpfe ohne Kennung');
  assert.match(app, /function fokussiere\(kennung\)/);
  assert.match(app, /button\[data-kennung\]/, 'fokussiere sucht nur Knöpfe mit data-kennung');
  const merke = app.indexOf('const merkeKennung = document.activeElement?.dataset?.kennung;');
  const neu = app.indexOf('app.replaceChildren(');
  const zurueck = app.indexOf('fokussiere(merkeKennung);');
  assert.ok(merke > -1 && neu > merke && zurueck > neu, 'Fokus muss vor replaceChildren gemerkt und danach gesetzt werden');
});

test('keine uk- und ru-Fassung im Quelltext erfunden: der Vermerk steht im Quelltext, in den Daten und im GDD', () => {
  const vermerk = 'uk und ru: nicht vorhanden, offen.';
  assert.ok(code['index.html'].includes(vermerk), 'index.html: Vermerk fehlt');
  assert.ok(daten.sprachen.includes(vermerk), 'Daten: Vermerk fehlt');
  assert.ok(alle['GDD.md'].includes(vermerk), 'GDD.md: Vermerk fehlt');
  assert.ok(alle['README.md'].includes(vermerk), 'README.md: Vermerk fehlt');
  assert.ok(!/"(uk|ru)"\s*:/.test(code['daten/heft.json']), 'Daten: uk- oder ru-Schlüssel');
});

test('Modellnamen-Freiheit: in keiner Datei der App allgemeine KI-Begriffe und keine Modellbezeichnung', () => {
  const muster = /\bKI\b|LLM|Sprachmodell|Chatbot|künstliche Intelligenz/i;
  for (const [d, inhalt] of Object.entries(alle)) {
    assert.ok(!muster.test(inhalt), `${d}: ${inhalt.match(muster)?.[0]}`);
  }
});

test('keine Wörter der Bewertung (unsicher, Selbstwert, Risiko, Diagnose) in der App', () => {
  const muster = /unsicher|Selbstwert|Risiko|Diagnose/i;
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
  assert.equal(pkg.name, '@info70/theater-zuhause-heft');
  assert.equal(pkg.scripts?.test, 'node --test test/logik.test.mjs test/regeln.test.mjs');
});
