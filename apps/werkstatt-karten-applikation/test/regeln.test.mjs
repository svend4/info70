import { test } from 'node:test';
import assert from 'node:assert/strict';
import { access, readdir, readFile } from 'node:fs/promises';
import daten from '../daten/karten.json' with { type: 'json' };
import { kartenText, PFLICHTSATZ } from '../logik.mjs';

// Projektregeln, für diese App geprüft: docs/02 Z. 22–24 (keine Anfragen nach außen),
// docs/02 Z. 79–82 (Druckbögen), docs/02 Z. 141–146 (keine Bewertung von Kindern).
// Die Altersregel und die Speicherregel haben keine docs/02-Zeile; sie sind Projektregeln.
// Die Prüfung liest die Dateien der App (ohne test/). Die Testdateien selbst
// dürfen die verbotenen Wörter nennen, um sie zu verbieten.

const APP = new URL('../', import.meta.url);
const CODE_DATEIEN = ['index.html', 'app.mjs', 'logik.mjs', 'druck.css', 'daten/karten.json'];
const ALLE_DATEIEN = [...CODE_DATEIEN, 'package.json', 'README.md', 'GDD.md'];

const lese = (datei) => readFile(new URL(datei, APP), 'utf8');
const code = Object.fromEntries(await Promise.all(CODE_DATEIEN.map(async (d) => [d, await lese(d)])));
const alle = Object.fromEntries(await Promise.all(ALLE_DATEIEN.map(async (d) => [d, await lese(d)])));

test('keine Eingabefelder für Kinder: kein input, textarea, select, form, contenteditable', () => {
  const muster = /<\s*(input|textarea|select|form)\b|contenteditable|el\(\s*['"](input|textarea|select|form)['"]/i;
  for (const d of ['index.html', 'app.mjs']) {
    assert.ok(!muster.test(code[d]), `${d}: Eingabeelement gefunden`);
  }
});

test('keine Speicherung: kein localStorage, sessionStorage, IndexedDB, Cookie, Cache oder Storage-Manager', () => {
  const muster = /localStorage|sessionStorage|indexedDB|document\.cookie|\bcaches\b|navigator\.storage/;
  for (const d of CODE_DATEIEN) {
    assert.ok(!muster.test(code[d]), `${d}: Speicher-Zugriff gefunden`);
  }
});

test('keine externen Adressen in allen Dateien; keine Netzaufrufe, kein @import und kein url() in den Dateien der App', () => {
  const netz = /\bfetch\s*\(|XMLHttpRequest|WebSocket|sendBeacon|EventSource|importScripts|new Worker/;
  for (const [d, inhalt] of Object.entries(alle)) {
    assert.ok(!/https?:\/\//i.test(inhalt), `${d}: externe Adresse`);
  }
  for (const d of ['app.mjs', 'logik.mjs']) {
    assert.ok(!netz.test(code[d]), `${d}: Netzaufruf gefunden`);
  }
  assert.ok(!/@import|url\(/.test(code['druck.css']), 'druck.css: @import oder url()');
});

test('Importe: nur relative Pfade oder das eigene Monorepo-Paket; die Karten kommen per JSON-Import mit Typangabe', () => {
  for (const d of ['app.mjs', 'logik.mjs']) {
    for (const [, pfad] of code[d].matchAll(/from '([^']+)'/g)) {
      assert.ok(pfad.startsWith('.'), `${d}: Import ohne relativen Pfad: ${pfad}`);
    }
  }
  assert.match(code['app.mjs'], /^import daten from '\.\/daten\/karten\.json' with \{ type: 'json' \};$/m);
});

test('Grundgerüst: deutsch, Viewport, CSP exakt, noscript, Titel, nur eigene Stylesheets und ein Modul-Skript', () => {
  const html = code['index.html'];
  assert.match(html, /<html lang="de">/);
  assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1"/);
  assert.match(html, /<meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline'"/);
  assert.match(html, /<noscript>/);
  assert.match(html, /<title>[^<]+<\/title>/);
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

test('Netzwerk-Wächter: aus packages/kinderschutz importiert, aufgerufen, und die Quelldatei ist vorhanden', async () => {
  assert.match(code['app.mjs'], /import \{ installiereNetzwerkWaechter \} from '\.\.\/\.\.\/packages\/kinderschutz\/src\/index\.mjs';/);
  assert.match(code['app.mjs'], /^installiereNetzwerkWaechter\(\);$/m);
  await access(new URL('../../../packages/kinderschutz/src/index.mjs', import.meta.url));
});

test('keine Druckzeichen: keine Häkchen, Kästchen, Sterne, Punkte als Zeichen, keine Emojis, weder auf den Karten noch im Code', () => {
  const zeichen = /[☐☒☑✓✔✗✘✅❌★☆•●○◦·∙‧▪▫◾◽■□‣⁃∘⦁]|\p{Extended_Pictographic}/u;
  for (const k of daten.karten) {
    assert.ok(!zeichen.test(kartenText(k)), `${k.id}: Druckzeichen im Drucktext`);
  }
  for (const d of CODE_DATEIEN) {
    assert.ok(!zeichen.test(code[d]), `${d}: Druckzeichen gefunden`);
  }
});

test('Drucktext ohne Namenszeile und ohne Tages- oder Wochentagsfeld; app.mjs und druck.css ohne Namenszeile', () => {
  const namenUndTage = /\bName\b|Namenszeile|\bDatum\b|Wochentag|\b(Montag|Dienstag|Mittwoch|Donnerstag|Freitag|Samstag|Sonntag)\b|\bTag\b|_{3,}|…{2,}/i;
  for (const k of daten.karten) {
    assert.ok(!namenUndTage.test(kartenText(k)), `${k.id}: Namenszeile oder Tagesfeld im Druck`);
  }
  assert.ok(!/Name\s*:|_{3,}/.test(code['app.mjs'] + code['druck.css']), 'app.mjs oder druck.css: Namenszeile');
});

test('druck.css: A4 quer, Bildschirmelemente nur im Bildschirm, jede Karte auf eigener Seite, Schritte nummeriert; Titel bricht um, Fuß-Link 44 px hoch', () => {
  const css = code['druck.css'];
  assert.match(css, /@media print \{/);
  assert.match(css, /@page\s*\{\s*size: A4 landscape;/);
  assert.match(css, /\.wsk-nur-bildschirm\s*\{\s*display: none !important;\s*\}/);
  assert.match(css, /break-after: page;/);
  assert.match(css, /page-break-after: always;/);
  assert.ok(!/list-style/.test(css), 'druck.css: Listenmarkierung wird verändert');
  assert.match(code['app.mjs'], /el\('ol', \{ class: 'wsk-schritte' \}/, 'Schrittfolge ist keine nummerierte Liste');
  assert.match(code['app.mjs'], /onclick: \(\) => window\.print\(\)/);
  // Bei 360 px: die Überschrift bricht innerhalb eines Wortes um.
  assert.match(css, /h1\.k-titel\s*\{[^}]*overflow-wrap:\s*anywhere;[^}]*word-break:\s*normal;/);
  // Fuß-Link: mindestens 44 px hoch, inline-flex, zentriert, 8 px seitlich.
  assert.match(code['app.mjs'], /el\('a', \{ class: 'wsk-fusslink'/);
  assert.match(css, /\.k-fuss a, \.wsk-fusslink\s*\{[^}]*display:\s*inline-flex;[^}]*align-items:\s*center;[^}]*min-height:\s*44px;[^}]*padding:\s*0 8px;/);
});

test('Fokus: jeder Knopf trägt eine data-kennung; render() merkt sich den Fokus, baut neu auf und setzt ihn zurück', () => {
  const app = code['app.mjs'];
  const knoepfe = app.match(/el\('button'/g) ?? [];
  const kennungen = app.match(/'data-kennung': /g) ?? [];
  assert.equal(kennungen.length, knoepfe.length, `${knoepfe.length} Knöpfe, aber ${kennungen.length} data-kennung`);
  assert.match(app, /function fokussiere\(kennung\)/);
  assert.match(app, /button\[data-kennung\]/, 'fokussiere sucht nur Knöpfe mit data-kennung');
  const merke = app.indexOf('const merkeKennung = document.activeElement?.dataset?.kennung;');
  const neu = app.indexOf('app.replaceChildren(');
  const zurueck = app.indexOf('fokussiere(merkeKennung);');
  assert.ok(merke > -1 && neu > merke && zurueck > neu, 'Fokus muss vor replaceChildren gemerkt und danach gesetzt werden');
});

test('Pflichtmarkierung: jede gedruckte Karte trägt den Satz im Druck (nicht nur im Bildschirmfuß); README und GDD unter „## Offen“; nie „von Hand geprüft“', () => {
  assert.equal(PFLICHTSATZ, 'Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.');
  for (const k of daten.karten) {
    assert.ok(kartenText(k).includes(PFLICHTSATZ), `${k.id}: die gedruckte Karte trägt den Satz nicht`);
  }
  // Der Druckpfad: karten.map(karteDom) baut jede gedruckte Karte; karteDom hängt den Satz an, nicht ausgeblendet.
  const app = code['app.mjs'];
  const dom = app.slice(app.indexOf('function karteDom'), app.indexOf('function auswahlKnopf'));
  assert.match(dom, /el\('p', \{ class: 'wsk-pflicht' \}, PFLICHTSATZ\)/, 'karteDom: Pflichtmarkierung fehlt');
  assert.ok(!/wsk-nur-bildschirm/.test(dom), 'karteDom: Pflichtmarkierung ist als Bildschirmteil markiert');
  assert.match(app, /karten\.map\(karteDom\)/, 'die gedruckten Karten kommen nicht alle aus karteDom');
  assert.match(code['druck.css'], /\.wsk-pflicht\s*\{/, 'druck.css: keine Regel für die Pflichtmarkierung');
  assert.ok(!/wsk-pflicht[^}]*display:\s*none/.test(code['druck.css']), 'druck.css: Pflichtmarkierung im Druck ausgeblendet');
  assert.ok(alle['README.md'].includes(PFLICHTSATZ), 'README.md: Pflichtmarkierung fehlt');
  const gdd = alle['GDD.md'];
  assert.ok(gdd.includes('## Offen'), 'GDD.md: Abschnitt „## Offen“ fehlt');
  assert.ok(gdd.slice(gdd.indexOf('## Offen')).includes(PFLICHTSATZ), 'GDD.md: Pflichtmarkierung nicht unter „## Offen“');
  for (const [d, inhalt] of Object.entries(alle)) {
    assert.ok(!/von Hand geprüft/i.test(inhalt), `${d}: „von Hand geprüft“ ist nicht belegt`);
  }
});

test('docs/02: jeder Verweis nennt eine der drei belegten Zeilenangaben (22–24, 79–82, 141–146); keine „Regel 3/4/5“', () => {
  const erlaubt = ['22–24', '79–82', '141–146'];
  for (const d of ['README.md', 'GDD.md', 'app.mjs']) {
    for (const m of alle[d]?.matchAll(/docs\/02(?: Z\. (\d+–\d+))?/g) ?? []) {
      assert.ok(m[1] && erlaubt.includes(m[1]), `${d}: Verweis „${m[0]}“ ist keine belegte Zeile`);
    }
    assert.ok(!/Regel [345]\b/.test(alle[d] ?? ''), `${d}: Verweis auf „Regel 3/4/5“`);
  }
});

test('Modellnamen-Freiheit: in keiner Datei der App allgemeine KI-Begriffe', () => {
  const muster = /\bKI\b|LLM|Sprachmodell|Chatbot|künstliche Intelligenz/i;
  for (const [d, inhalt] of Object.entries(alle)) {
    assert.ok(!muster.test(inhalt), `${d}: ${inhalt.match(muster)?.[0]}`);
  }
});

test('keine Wörter der Bewertung (unsicher, Selbstwert, Risiko, Diagnose), keine Stufen-Begriffe und keine Gruppenziel-Aussage in der App', () => {
  const muster = /unsicher|Selbstwert|Risiko|Diagnose|Stufe|Gruppenziel|Ergebnis der Gruppe/i;
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
