import { test } from 'node:test';
import assert from 'node:assert/strict';
import { access, readdir, readFile } from 'node:fs/promises';
import daten from '../daten/stationen.json' with { type: 'json' };
import { kartenText } from '../logik.mjs';

// Projektregeln, für diese App geprüft: docs/02 Z. 22–24 (keine Anfragen nach außen),
// docs/02 Z. 79–82 (Druckbögen), docs/02 Z. 141–146 (Release-Regel: keine Bewertung von Kindern);
// die Altersregel und die Speicherregel haben keine docs/02-Zeile, sie sind Projektregeln.
// Die Prüfung liest die Dateien der App (ohne test/). Die Testdateien selbst
// dürfen die verbotenen Wörter nennen, um sie zu verbieten.

const APP = new URL('../', import.meta.url);
const CODE_DATEIEN = ['index.html', 'app.mjs', 'logik.mjs', 'druck.css', 'daten/stationen.json'];
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

test('keine Speicherung: kein localStorage, sessionStorage, IndexedDB, Cookie oder Cache', () => {
  const muster = /localStorage|sessionStorage|indexedDB|document\.cookie|\bcaches\b|navigator\.storage/;
  for (const d of CODE_DATEIEN) {
    assert.ok(!muster.test(code[d]), `${d}: Speicher-Zugriff gefunden`);
  }
});

test('keine externen Adressen und keine Netzaufrufe in den Dateien der App', () => {
  const netz = /\bfetch\s*\(|XMLHttpRequest|WebSocket|sendBeacon|EventSource|importScripts|new Worker/;
  for (const d of CODE_DATEIEN) {
    assert.ok(!/https?:\/\//i.test(code[d]), `${d}: externe Adresse`);
  }
  for (const d of ['app.mjs', 'logik.mjs']) {
    assert.ok(!netz.test(code[d]), `${d}: Netzaufruf gefunden`);
  }
  assert.ok(!/@import/.test(code['druck.css']), 'druck.css: @import');
});

test('die Karten kommen per JSON-Import, die Oberfläche lädt nichts nach', () => {
  assert.match(code['app.mjs'], /^import daten from '\.\/daten\/stationen\.json' with \{ type: 'json' \};$/m);
});

test('Grundgerüst: deutsch, Viewport, CSP exakt, nur eigene Stylesheets und ein Modul-Skript', () => {
  const html = code['index.html'];
  assert.match(html, /<html lang="de">/);
  assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1"/);
  assert.match(html, /<meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline'"/);
  assert.match(html, /<noscript>/);
  assert.match(html, /<title>[^<]+<\/title>/);
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

test('keine Druckzeichen: keine Häkchen, Kästchen, Sterne, Punkte als Zeichen, keine Emojis', () => {
  const zeichen = /[☐☒☑✓✔✗✘✅❌★☆•●○◦·∙‧▪▫◾◽■□]|\p{Extended_Pictographic}/u;
  for (const k of daten.karten) {
    assert.ok(!zeichen.test(kartenText(k)), `${k.id}: Druckzeichen im Drucktext`);
  }
  for (const d of CODE_DATEIEN) {
    assert.ok(!zeichen.test(code[d]), `${d}: Druckzeichen gefunden`);
  }
});

test('Drucktext ohne Namenszeile und ohne Tages- oder Wochentagsfeld', () => {
  const namenUndTage = /\bName\b|Namenszeile|\bDatum\b|Wochentag|\b(Montag|Dienstag|Mittwoch|Donnerstag|Freitag|Samstag|Sonntag)\b|\bTag\b|_{3,}|…{2,}/i;
  for (const k of daten.karten) {
    assert.ok(!namenUndTage.test(kartenText(k)), `${k.id}: Namenszeile oder Tagesfeld im Druck`);
  }
  assert.ok(!/Name\s*:|_{3,}/.test(code['app.mjs'] + code['druck.css']), 'app.mjs oder druck.css: Namenszeile');
});

test('druck.css: A4 quer, Bildschirmelemente nur im Bildschirm, jede Karte auf eigener Seite; Titel bricht um, Fuß-Link 48 px hoch', () => {
  const css = code['druck.css'];
  assert.match(css, /@media print \{/);
  assert.match(css, /@page\s*\{\s*size: A4 landscape;/);
  assert.match(css, /\.sss-nur-bildschirm\s*\{\s*display: none !important;\s*\}/);
  assert.match(css, /break-after: page;/);
  assert.match(css, /page-break-after: always;/);
  assert.match(code['app.mjs'], /onclick: \(\) => window\.print\(\)/);
  // Bei 360 px: die Überschrift bricht innerhalb eines Wortes um.
  assert.match(css, /h1\.k-titel\s*\{[^}]*overflow-wrap:\s*anywhere;[^}]*word-break:\s*normal;/);
  // Footer-Link: mindestens 48 px hoch (docs/02 Checkliste, touch ≥ 48 px), inline-flex, zentriert, 8 px seitlich.
  assert.match(code['app.mjs'], /el\('a', \{ class: 'sss-fusslink'/);
  assert.match(css, /\.sss-fusslink\s*\{[^}]*display:\s*inline-flex;[^}]*align-items:\s*center;[^}]*min-height:\s*48px;[^}]*padding:\s*0 8px;/);
  assert.ok(!/\.sss-fusslink[^}]*min-height:\s*44px/.test(css), 'druck.css: Fuß-Link noch auf 44 px');
});

test('Fokus nach Klick: jeder Knopf trägt eine eindeutige data-kennung; render() merkt sich den Fokus und setzt ihn zurück', () => {
  const app = code['app.mjs'];
  const knoepfe = app.match(/el\('button'/g) ?? [];
  const kennungen = app.match(/'data-kennung': /g) ?? [];
  assert.equal(kennungen.length, knoepfe.length, `${knoepfe.length} Knöpfe, aber ${kennungen.length} data-kennung`);
  const feste = [...app.matchAll(/'data-kennung': '([^']+)'/g)].map((m) => m[1]);
  assert.equal(new Set(feste).size, feste.length, 'doppelte feste data-kennung');
  assert.match(app, /'data-kennung': `auswahl-\$\{karte\.id\}`/, 'Stationsknöpfe ohne Kennung aus der Karten-Id');
  assert.match(app, /function fokussiere\(kennung\)/);
  assert.match(app, /button\[data-kennung\]/, 'fokussiere sucht nur Knöpfe mit data-kennung');
  const merke = app.indexOf('const merkeKennung = document.activeElement?.dataset?.kennung;');
  const neu = app.indexOf('app.replaceChildren(');
  const zurueck = app.indexOf('fokussiere(merkeKennung);');
  assert.ok(merke > -1 && neu > merke && zurueck > neu, 'Fokus muss vor replaceChildren gemerkt und danach gesetzt werden');
});

test('Pflichtmarkierung der Seitenangaben: im Fuß der App, in README und GDD unter „## Offen“; nie „von Hand geprüft“', () => {
  const satz = 'Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.';
  assert.ok(code['logik.mjs'].includes(`export const PFLICHTSATZ = '${satz}';`), 'logik.mjs: Pflichtsatz nicht als gemeinsame Konstante');
  assert.match(code['app.mjs'], /el\('p', \{\}, PFLICHTSATZ\)/, 'app.mjs: Pflichtmarkierung im Fuß fehlt');
  assert.ok(alle['README.md'].includes(satz), 'README.md: Pflichtmarkierung fehlt');
  const gdd = alle['GDD.md'];
  assert.ok(gdd.includes('## Offen'), 'GDD.md: Abschnitt „## Offen“ fehlt');
  assert.ok(gdd.slice(gdd.indexOf('## Offen')).includes(satz), 'GDD.md: Pflichtmarkierung nicht unter „## Offen“');
  for (const [d, inhalt] of Object.entries(alle)) {
    assert.ok(!/von Hand geprüft/i.test(inhalt), `${d}: „von Hand geprüft“ ist nicht belegt`);
  }
});

test('Pflichtmarkierung im Druck: jede gedruckte Karte trägt den Satz im Blatt selbst, nicht nur im Bildschirmfuß', () => {
  const satz = 'Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.';
  for (const k of daten.karten) {
    assert.ok(kartenText(k).includes(satz), `${k.id}: Satz fehlt auf der gedruckten Karte`);
  }
  // Die gedruckte Karte ist karteDom in app.mjs; dort darf nichts als Bildschirm-only markiert sein.
  const karteDom = code['app.mjs'].match(/^function karteDom\(karte\) \{[\s\S]*?^\}/m)?.[0] ?? '';
  assert.ok(karteDom, 'karteDom nicht gefunden');
  assert.match(karteDom, /el\('section', \{ class: 'k-karte sss-karte'/, 'gedruckte Karte ist nicht die Karten-Sektion');
  assert.ok(!/sss-nur-bildschirm/.test(karteDom), 'karteDom: gedruckte Karte als Bildschirm-only markiert');
  assert.match(karteDom, /el\('p', \{ class: 'sss-pflicht' \}, PFLICHTSATZ\)/, 'karteDom: Pflichtsatz fehlt im Blatt');
  // Im Druck wird die Zeile nicht ausgeblendet.
  const druck = code['druck.css'].slice(code['druck.css'].indexOf('@media print'));
  assert.match(druck, /\.sss-pflicht\s*\{[^}]*color:\s*#000;/, 'druck.css: Pflichtsatz nicht für den Druck gestaltet');
  assert.ok(!/\.sss-pflicht[^}]*display:\s*none/.test(code['druck.css']), 'druck.css: Pflichtsatz ausgeblendet');
});

test('Modellnamen-Freiheit: in keiner Datei der App allgemeine KI-Begriffe, keine Modellbezeichnung', () => {
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

test('keine Fremdbegriffe und keine Bilder-Behauptung in den Dateien der App: Piktogramme, Ersatz-Spielnamen, Eishockey, Verbände', () => {
  const muster = /Piktogramm|Wikingerschach|Dosenwerfen|Brennball|Floorball|Eishockey|Team Deutschland|Special Olympics|DOSB/i;
  for (const d of CODE_DATEIEN) {
    assert.ok(!muster.test(code[d]), `${d}: ${code[d].match(muster)?.[0]}`);
  }
  // Die Stationen haben keine Piktogramme; für die ganze Quelle gilt die Aussage nicht.
  assert.ok(alle['README.md'].includes('Die Stationen haben keine Piktogramme; Bilder der Quelle sind nicht übernommen.'), 'README: Piktogramm-Satz fehlt');
  assert.ok(!/die Quelle hat keine Bilder/i.test(alle['README.md']), 'README: Bilder-Behauptung für die ganze Quelle');
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

test('Zufall nur in app.mjs: keine Zufallsquelle und keine Uhr; die Reihenfolge der Karten ist fest', () => {
  // Bauauftrag Abschnitt 5: keine Zufallsquelle nötig. Sollte je eine nötig werden, steht sie nur in app.mjs.
  for (const d of CODE_DATEIEN) {
    assert.ok(!/Math\.random|crypto|Date\.now|new Date|performance\./.test(code[d]), `${d}: Zufall oder Uhr`);
  }
});

test('Knöpfe mindestens 48 px hoch: die gemeinsame Klasse .k-knopf hat min-height 3rem (docs/02, touch ≥ 48 px)', async () => {
  const kinderCss = await readFile(new URL('../../../packages/kinder-ui/css/kinder.css', import.meta.url), 'utf8');
  assert.match(kinderCss, /\.k-knopf\s*\{[^}]*min-height:\s*3rem;/);
});

test('Eigenentwurf-Kennzeichnung: jede Karte trägt den Vermerk im Fuß und im gedruckten Text', () => {
  for (const karte of daten.karten) {
    assert.match(karte.fuss, /Eigenentwurf/, `${karte.id}: Fuß ohne Eigenentwurf-Kennzeichnung`);
    assert.match(kartenText(karte), /Eigenentwurf/, `${karte.id}: Druck ohne Eigenentwurf-Kennzeichnung`);
  }
});

test('uk und ru: nicht vorhanden, offen. Keine Fassung in den Daten, der Vermerk steht im GDD', () => {
  assert.ok(alle['GDD.md'].includes('uk und ru: nicht vorhanden, offen.'), 'GDD.md: Vermerk fehlt');
  assert.ok(!/"(uk|ru)"\s*:/.test(code['daten/stationen.json']), 'Daten: uk- oder ru-Schlüssel');
});

test('keine Bewertung von Kindern im Code und in den Daten: keine Punkte, Stufe, Einstufung, Platz, Ergebnis, Note (docs/02 Z. 141–146)', () => {
  // Verneinungen wie „ohne Punkte“ sind erlaubt; „Rangliste“ ist ein Wettbewerbsbegriff ohne Rangwertung und nicht gesperrt.
  const muster = /(?<!ohne |Keine |keine )\b(Punkte?|Stufe|Einstufung|Platz|Ergebnis|Noten?)\b/;
  for (const d of CODE_DATEIEN) {
    assert.ok(!muster.test(code[d]), `${d}: ${code[d].match(muster)?.[0]}`);
  }
});

test('package.json: privat, ES-Modul, Testskript vorhanden', () => {
  const pkg = JSON.parse(alle['package.json']);
  assert.equal(pkg.private, true);
  assert.equal(pkg.type, 'module');
  assert.match(pkg.scripts?.test ?? '', /node --test/);
});
