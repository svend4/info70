import { test } from 'node:test';
import assert from 'node:assert/strict';
import { access, readdir, readFile } from 'node:fs/promises';
import daten from '../daten/bausteine.json' with { type: 'json' };
import {
  PFLICHTMARKIERUNG, alleKombinationen, vorlesetext, vorlesetextAlsText,
} from '../logik.mjs';

// Projektregeln, für diese App geprüft: docs/02 Z. 22–24 (keine Anfragen nach außen),
// docs/02 Z. 79–82 (Druckbögen), docs/02 Z. 141–146 (keine Bewertung von Kindern);
// die Altersregel und die Speicherregel haben keine docs/02-Zeile, sie sind Projektregeln.
// Die Prüfung liest die Dateien der App (ohne test/). Die Testdateien selbst
// dürfen die verbotenen Wörter nennen, um sie zu verbieten.

const APP = new URL('../', import.meta.url);
const CODE_DATEIEN = ['index.html', 'app.mjs', 'logik.mjs', 'druck.css', 'daten/bausteine.json'];
const ALLE_DATEIEN = [...CODE_DATEIEN, 'package.json', 'README.md', 'GDD.md'];

const lese = (datei) => readFile(new URL(datei, APP), 'utf8');
const code = Object.fromEntries(await Promise.all(CODE_DATEIEN.map(async (d) => [d, await lese(d)])));
const alle = Object.fromEntries(await Promise.all(ALLE_DATEIEN.map(async (d) => [d, await lese(d)])));
const gedrucktAlle = alleKombinationen(daten).map((k) => vorlesetextAlsText(vorlesetext(daten, k)));

function schluessel(obj, acc = []) {
  if (Array.isArray(obj)) obj.forEach((x) => schluessel(x, acc));
  else if (obj && typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj)) { acc.push(k); schluessel(v, acc); }
  }
  return acc;
}

test('keine Eingabefelder für Kinder: kein input, textarea, select, form, contenteditable; keine Kinderfelder in den Daten', () => {
  const muster = /<\s*(input|textarea|select|form)\b|contenteditable|el\(\s*['"](input|textarea|select|form)['"]/i;
  for (const d of ['index.html', 'app.mjs']) {
    assert.ok(!muster.test(code[d]), `${d}: Eingabeelement gefunden`);
  }
  const kinderfeld = /kind|vorname|nachname|geburt|alter|diagnos|bewert|note$/i;
  const fehler = schluessel(daten).filter((k) => kinderfeld.test(k));
  assert.deepEqual(fehler, [], `verdächtige Felder in den Daten: ${fehler.join(', ')}`);
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

test('die Bausteine kommen per JSON-Import mit Typangabe; kein fetch im Quelltext', () => {
  assert.match(code['app.mjs'], /^import daten from '\.\/daten\/bausteine\.json' with \{ type: 'json' \};$/m);
  assert.ok(!/fetch/.test(code['app.mjs'] + code['logik.mjs']), 'fetch im Quelltext');
});

test('Grundgerüst: deutsch, Viewport, CSP exakt, nur eigene Stylesheets und ein Modul-Skript', () => {
  const html = code['index.html'];
  assert.match(html, /<html lang="de">/);
  assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1"/);
  assert.match(html, /<meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline'"/);
  assert.match(html, /<noscript>/);
  assert.match(html, /<title>Tierkinder – Vorlesen<\/title>/);
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

test('Netzwerk-Wächter: aus packages/kinderschutz importiert, aufgerufen und die Datei ist vorhanden', async () => {
  assert.match(code['app.mjs'], /import \{ installiereNetzwerkWaechter \} from '\.\.\/\.\.\/packages\/kinderschutz\/src\/index\.mjs';/);
  assert.match(code['app.mjs'], /^installiereNetzwerkWaechter\(\);$/m);
  await access(new URL('../../../packages/kinderschutz/src/index.mjs', import.meta.url));
});

test('keine Druckzeichen: keine Häkchen, Kästchen, Sterne, Punkte als Zeichen, keine Emojis, im Vorlesetext wie im Quelltext', () => {
  const zeichen = /[☐☒☑✓✔✗✘✅❌★☆•●○◦·∙‧▪▫◾◽■□]|\p{Extended_Pictographic}/u;
  for (const [i, t] of gedrucktAlle.entries()) {
    assert.ok(!zeichen.test(t), `Vorlesetext ${i}: Druckzeichen`);
  }
  for (const d of CODE_DATEIEN) {
    assert.ok(!zeichen.test(code[d]), `${d}: Druckzeichen gefunden`);
  }
});

test('Druckblatt ohne Namenszeile und ohne Tages- oder Wochentagsfeld; Stil wie in docs/02 Z. 79–82', () => {
  const namenUndTage = /\bName\b|Namenszeile|\bDatum\b|Wochentag|\b(Montag|Dienstag|Mittwoch|Donnerstag|Freitag|Samstag|Sonntag)\b|\bTag\b|_{3,}|…{2,}/i;
  for (const [i, t] of gedrucktAlle.entries()) {
    assert.ok(!namenUndTage.test(t), `Vorlesetext ${i}: Namenszeile oder Tagesfeld`);
  }
  assert.ok(!/Name\s*:|_{3,}/.test(code['app.mjs'] + code['druck.css']), 'app.mjs oder druck.css: Namenszeile');
});

test('druck.css: A4 hoch, Bildschirmelemente nur im Bildschirm, Vorlesetext nur im Druck; Titel bricht um, Fuß-Link 48 px hoch (Touch-Ziel), keine alte Höhe mehr', () => {
  const css = code['druck.css'];
  assert.match(css, /@media print \{/);
  assert.match(css, /@page\s*\{\s*size: A4 portrait;/);
  assert.match(css, /\.bsl-nur-bildschirm\s*\{\s*display: none !important;\s*\}/);
  assert.match(css, /\.bsl-nur-druck\s*\{\s*display: block !important;\s*\}/);
  assert.match(css, /break-inside: avoid/);
  assert.match(code['app.mjs'], /onclick: \(\) => window\.print\(\)/);
  assert.match(code['app.mjs'], /id: 'druckbereich'|id: 'druckbereich',/);
  assert.match(css, /h1\.k-titel\s*\{[^}]*overflow-wrap:\s*anywhere;[^}]*word-break:\s*normal;/);
  assert.match(code['app.mjs'], /el\('a', \{ class: 'bsl-fusslink'/);
  assert.match(css, /\.bsl-fusslink\s*\{[^}]*display:\s*inline-flex;[^}]*align-items:\s*center;[^}]*min-height:\s*48px;[^}]*padding:\s*0 8px;/);
  assert.ok(!/\b44 ?px\b/.test(css + alle['README.md'] + alle['GDD.md']), 'alte Höhe 44 px steht noch in druck.css, README.md oder GDD.md');
});

test('Fokus nach Klick: jeder Knopf trägt eine eindeutige data-kennung; render() merkt sich den Fokus und setzt ihn zurück', () => {
  const app = code['app.mjs'];
  const knoepfe = app.match(/el\('button'/g) ?? [];
  const kennungen = app.match(/'data-kennung': /g) ?? [];
  assert.equal(kennungen.length, knoepfe.length, `${knoepfe.length} Knöpfe, aber ${kennungen.length} data-kennung`);
  const feste = [...app.matchAll(/'data-kennung': '([^']+)'/g)].map((m) => m[1]);
  assert.equal(new Set(feste).size, feste.length, 'doppelte feste data-kennung');
  for (const muster of ['`tierart-${t.id}`', '`ort-${o.id}`', '`jungtier-${j.id}`']) {
    assert.ok(app.includes(muster), `Knopfkennung fehlt: ${muster}`);
  }
  assert.match(app, /function fokussiere\(kennung\)/);
  assert.match(app, /button\[data-kennung\]/, 'fokussiere sucht nur Knöpfe mit data-kennung');
  const merke = app.indexOf('const merkeKennung = document.activeElement?.dataset?.kennung;');
  const neu = app.indexOf('app.replaceChildren(');
  const zurueck = app.indexOf('fokussiere(merkeKennung);');
  assert.ok(merke > -1 && neu > merke && zurueck > neu, 'Fokus muss vor replaceChildren gemerkt und danach gesetzt werden');
});

test('Pflichtmarkierung auf jedem gedruckten Blatt mit Seitenangabe, im Fuß, in README und GDD unter „## Offen“; nie „von Hand geprüft“', () => {
  const satz = 'Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.';
  assert.ok(code['logik.mjs'].includes(`export const PFLICHTMARKIERUNG = '${satz}';`), 'logik.mjs: Pflichtmarkierung fehlt');
  assert.match(code['app.mjs'], /function druckbereich\(text\)[\s\S]*text\.pflicht/, 'druckbereich druckt die Pflichtmarkierung nicht');
  assert.ok(PFLICHTMARKIERUNG === satz, 'Konstante weicht ab');
  for (const t of gedrucktAlle) assert.ok(t.includes(satz), 'gedrucktes Blatt ohne Pflichtmarkierung');
  assert.ok(alle['README.md'].includes(satz), 'README.md: Pflichtmarkierung fehlt');
  const gdd = alle['GDD.md'];
  assert.ok(gdd.includes('## Offen'), 'GDD.md: Abschnitt „## Offen“ fehlt');
  assert.ok(gdd.slice(gdd.indexOf('## Offen')).includes(satz), 'GDD.md: Pflichtmarkierung nicht unter „## Offen“');
  for (const [d, inhalt] of Object.entries(alle)) {
    assert.ok(!/von Hand geprüft/i.test(inhalt), `${d}: „von Hand geprüft“ ist nicht belegt`);
  }
});

test('keine KI-Begriffe und keine Modellbezeichnung in den Dateien der App', () => {
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

test('uk und ru: nur der Vermerk „uk und ru: nicht vorhanden, offen.“; keine uk- oder ru-Felder, keine ukrainischen Buchstaben', () => {
  const vermerk = 'uk und ru: nicht vorhanden, offen.';
  assert.equal(daten.sprachen, vermerk);
  assert.ok(alle['README.md'].includes(vermerk), 'README.md: Vermerk fehlt');
  assert.ok(alle['GDD.md'].includes(vermerk), 'GDD.md: Vermerk fehlt');
  const felder = schluessel(daten).filter((k) => /^(uk|ru)$|_(uk|ru)$|^(uk|ru)_/.test(k));
  assert.deepEqual(felder, [], 'uk- oder ru-Felder gefunden');
  const ukrainisch = /[іїєґІЇЄҐ]/;
  assert.ok(!ukrainisch.test(JSON.stringify(daten) + code['app.mjs'] + code['logik.mjs']), 'ukrainische Buchstaben gefunden');
});

test('Docs-Verweise nur auf die echten Stellen: docs/02 Z. 22–24, Z. 79–82, Z. 141–146', () => {
  const erlaubt = ['22–24', '79–82', '141–146'];
  for (const [d, inhalt] of Object.entries(alle)) {
    for (const m of inhalt.matchAll(/docs\/02(?: Z\. ([\d–]+))?/g)) {
      assert.ok(m[1] && erlaubt.includes(m[1]), `${d}: unzulässiger Verweis „${m[0]}“`);
    }
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
