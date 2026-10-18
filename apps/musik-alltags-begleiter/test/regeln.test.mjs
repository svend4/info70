import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import daten from '../daten/rituale.json' with { type: 'json' };
import { ARTEN, druckBlatt, fensterTage } from '../logik.mjs';

// Projektregeln, für diese App geprüft (Vorlage: apps/puppentheater-werkstatt/test/regeln.test.mjs):
// docs/02 Z. 17–30 (keine Eingabefelder; Speicher nur wie Z. 25), Z. 22–24 (keine Anfragen nach außen),
// Z. 79–82 (Druck), Z. 141–146 (keine Bewertung). Die Prüfung liest die Dateien der App ohne test/.
// Anders als in der Vorlage: der Bildschirm dieser App trägt Emojis und sagt Verbotenes ausdrücklich
// ab („keine Ampel“). Darum prüft der Zeichentest den DRUCKTEXT und die Druck-CSS, nicht den ganzen Quelltext.

const APP = new URL('../', import.meta.url);
const CODE_DATEIEN = ['index.html', 'app.mjs', 'logik.mjs', 'druck.css', 'daten/rituale.json'];
const ALLE_DATEIEN = [...CODE_DATEIEN, 'package.json', 'README.md', 'GDD.md'];
const PFLICHT = 'Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.';
const HEUTE = '2026-10-09';

const lese = (datei) => readFile(new URL(datei, APP), 'utf8');
const code = Object.fromEntries(await Promise.all(CODE_DATEIEN.map(async (d) => [d, await lese(d)])));
const alle = Object.fromEntries(await Promise.all(ALLE_DATEIEN.map(async (d) => [d, await lese(d)])));

// Ein Druckblatt, auf dem jede Gelegenheit mit jeder Art an jedem Tag des Fensters steht.
const alleNotizen = fensterTage(HEUTE).flatMap((tag) => daten.rituale.flatMap((r) => ARTEN.map((art) => ({
  tag, gelegenheit: r.id, art,
}))));
const blatt = druckBlatt(daten, alleNotizen, HEUTE);
const druckText = (b) => [
  b.titel, b.satz,
  ...b.tage.flatMap((t) => [t.tag, ...t.eintraege.flatMap((e) => [e.gelegenheit, e.art])]),
  ...b.schluss,
].join('\n');
const text = druckText(blatt);

test('keine Eingabefelder: kein input, textarea, select, form, contenteditable in Seite und App', () => {
  const muster = /<\s*(input|textarea|select|form)\b|contenteditable|(el|createElement)\(\s*['"](input|textarea|select|form)['"]/i;
  for (const d of ['index.html', 'app.mjs']) {
    assert.ok(!muster.test(code[d]), `${d}: Eingabeelement gefunden`);
  }
});

test('Speicher: localStorage nur in der App, nur mit dem Schlüssel mab.notizen; kein anderer Speicher', () => {
  const anderer = /sessionStorage|indexedDB|document\.cookie|\bcaches\b|navigator\.storage/;
  for (const d of CODE_DATEIEN) {
    assert.ok(!anderer.test(code[d]), `${d}: anderer Speicher gefunden`);
  }
  for (const d of ['index.html', 'logik.mjs', 'druck.css', 'daten/rituale.json']) {
    assert.ok(!/localStorage/.test(code[d]), `${d}: localStorage`);
  }
  const schluessel = [...code['app.mjs'].matchAll(/localStorage\.\w+\(([^,)]+)/g)].map((m) => m[1].trim());
  assert.ok(schluessel.length > 0);
  assert.ok(schluessel.every((s) => s === 'SCHLUESSEL'), `fremder Schlüssel: ${schluessel}`);
  assert.match(code['app.mjs'], /const SCHLUESSEL = 'mab\.notizen';/);
});

test('keine externen Adressen, keine Netzaufrufe, kein @import; die Daten kommen per JSON-Import', () => {
  const netz = /\bfetch\s*\(|XMLHttpRequest|WebSocket|sendBeacon|EventSource|importScripts|new Worker|window\[|globalThis|wss?:/;
  for (const d of CODE_DATEIEN) {
    assert.ok(!/https?:\/\/|(?<![:\w])\/\/[\w-]+\.[a-z]{2,}/i.test(code[d]), `${d}: externe Adresse`);
  }
  for (const d of ['app.mjs', 'logik.mjs']) {
    assert.ok(!netz.test(code[d]), `${d}: Netzaufruf gefunden`);
  }
  assert.ok(!/@import/.test(code['druck.css']), 'druck.css: @import');
  assert.match(code['app.mjs'], /^import daten from '\.\/daten\/rituale\.json' with \{ type: 'json' \};$/m);
});

test('Zufall: keine Zufallsquelle im Projekt; logik.mjs hat keine Uhr ohne Zeitangabe', () => {
  for (const d of CODE_DATEIEN) {
    assert.ok(!/Math\.random|crypto\.|Date\.now|performance\./.test(code[d]), `${d}: Zufall`);
  }
  assert.ok(!/new Date\(\)/.test(code['logik.mjs']), 'logik.mjs: Uhr ohne Argument');
});

test('Grundgerüst: deutsch, Viewport, CSP exakt, nur zwei Stylesheets und ein Modul-Skript', () => {
  const html = code['index.html'];
  assert.match(html, /<html lang="de">/);
  assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1"/);
  assert.match(html, /<meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline'"/);
  assert.match(html, /<noscript>/);
  const links = [...html.matchAll(/<link[^>]*href="([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(links, ['../../packages/kinder-ui/css/kinder.css', 'druck.css']);
  const skripte = [...html.matchAll(/<script[^>]*src="([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(skripte, ['app.mjs']);
  assert.match(html, /<script type="module" src="app\.mjs"><\/script>/);
  assert.match(html, /<main[^>]*id="app"[^>]*aria-live="polite"/);
});

test('Netzwerk-Wächter: aus packages/kinderschutz importiert und aufgerufen', async () => {
  assert.match(code['app.mjs'], /import \{ installiereNetzwerkWaechter \} from '\.\.\/\.\.\/packages\/kinderschutz\/src\/index\.mjs';/);
  assert.match(code['app.mjs'], /^installiereNetzwerkWaechter\(\);$/m);
  await readFile(new URL('../../../packages/kinderschutz/src/index.mjs', import.meta.url), 'utf8');
});

test('keine Druckzeichen: der DruckText ist frei von Häkchen, Kästchen, Sternen, Punkten als Zeichen und Emojis', () => {
  // Zeichenblöcke statt Aufzählung: Pfeile, Math-Zeichen, Dingbats, geometrische Formen, Emojis;
  // dazu die Punkte, die als Trennzeichen in der Bildschirmliste stehen (·, •).
  const zeichen = /[☐☒☑✓✔✗✘★☆•●○◦·■□]|[←-⋿⌀-➿⦀-⧿⬀-⯿■-◿・]|\p{Extended_Pictographic}/u;
  for (const [i, tag] of fensterTage(HEUTE).entries()) {
    const einTag = druckText(druckBlatt(daten, alleNotizen.filter((n) => n.tag === tag), HEUTE));
    assert.ok(!zeichen.test(einTag), `Tag ${i}: Druckzeichen im Druckblatt`);
  }
  assert.ok(!zeichen.test(text), 'Druckblatt: Druckzeichen');
  // Die Druck-CSS und der Seitentitel (den der Browser auf jede Seite druckt) sind ebenfalls frei.
  assert.ok(!zeichen.test(code['druck.css']), 'druck.css: Druckzeichen');
  assert.ok(!zeichen.test(code['index.html'].match(/<title>[^<]*<\/title>/)?.[0] ?? ''), 'Seitentitel: Emoji');
  // Die Druckfunktion in app.mjs enthält kein Emoji; der Bildschirm darf welche haben.
  const druckFunktion = code['app.mjs'].match(/function druckKarte\([\s\S]*?\n\}\n/)?.[0] ?? '';
  assert.ok(druckFunktion.length > 0, 'druckKarte fehlt in app.mjs');
  assert.ok(!/\p{Extended_Pictographic}/u.test(druckFunktion), 'druckKarte: Emoji im Druckcode');
  assert.match(code['app.mjs'], /druckKarte\(druckBlatt\(daten, notizen, heute\)\)/);
});

test('Druckblatt ohne Namenszeile und ohne Felder', () => {
  // „Name“ auch in Zusammensetzungen; „Namen“ im Fließtext bleibt erlaubt.
  const namen = /Name(?!n\b)|Datum|Wochentag|Name\s*:|_{3,}|…{2,}/i;
  assert.ok(!namen.test(text), 'Druckblatt: Namenszeile oder Feld');
  assert.ok(!/Name\s*:|_{3,}/.test(druckFunktionText()), 'druckKarte: Namenszeile');
});

function druckFunktionText() {
  return code['app.mjs'].match(/function druckKarte\([\s\S]*?\n\}\n/)?.[0] ?? '';
}

test('Druck über alle Einträge: jede Gelegenheit und jede Art steht im Blatt', () => {
  for (const r of daten.rituale) assert.ok(text.includes(r.name), `Gelegenheit fehlt im Blatt: ${r.name}`);
  for (const a of daten.arten) assert.ok(text.includes(a.name), `Art fehlt im Blatt: ${a.name}`);
  assert.equal(blatt.tage.length, 7);
  assert.equal(blatt.tage.reduce((s, t) => s + t.eintraege.length, 0), alleNotizen.length);
});

test('Blatt ohne Seitenangabe: keine Seitenzahl, keine Pflichtmarkierung (A18); steht eine Angabe drauf, steht die Markierung dabei', () => {
  const seitenangabe = /S\.\s?\d|Seite\s?\d/.test(text);
  assert.equal(seitenangabe, false, 'Druckblatt trägt eine Seitenangabe (A18)');
  assert.equal(text.includes(PFLICHT), false, 'Pflichtmarkierung ohne Seitenangabe');
  for (const d of ALLE_DATEIEN) {
    assert.ok(!/von Hand geprüft/i.test(alle[d] ?? ''), `${d}: „von Hand geprüft“ ist nicht belegt`);
  }
});

test('Druckbereich: nur das Blatt druckt, Bildschirmteile sind im Druck ausgeblendet', () => {
  const css = code['druck.css'];
  assert.match(css, /@media print \{/);
  assert.match(css, /@page\s*\{\s*size: A4 portrait;/);
  assert.match(css, /\.mab-nur-bildschirm \{ display: none !important; \}/);
  assert.match(css, /\.mab-nur-druck \{ display: block !important; \}/);
  assert.match(css, /\.mab-nur-druck \{ display: none; \}/);
  assert.match(css, /break-inside: avoid;/);
  assert.match(code['app.mjs'], /class: 'k-karte mab-block mab-nur-druck'/);
  assert.match(code['app.mjs'], /window\.print\(\)/);
});

test('Knöpfe und Links mindestens 48 px hoch: .k-knopf und Links haben min-height 3rem (docs/02, touch ≥ 48 px)', async () => {
  const kinderCss = await readFile(new URL('../../../packages/kinder-ui/css/kinder.css', import.meta.url), 'utf8');
  assert.match(kinderCss, /\.k-knopf\s*\{[^}]*min-height:\s*3rem;/);
  assert.match(code['druck.css'], /#app a, \.k-fuss a \{[^}]*min-height:\s*3rem;/);
});

test('Fokus nach Klick: jeder Knopf trägt eine data-kennung; die Kennungen sind eindeutig', () => {
  const app = code['app.mjs'];
  const knoepfe = app.match(/el\('button'/g) ?? [];
  const kennungen = app.match(/'data-kennung': /g) ?? [];
  assert.equal(kennungen.length, knoepfe.length, `${knoepfe.length} Knöpfe, aber ${kennungen.length} data-kennung`);
  const feste = [...app.matchAll(/'data-kennung': '([^']+)'/g)].map((m) => m[1]);
  assert.equal(new Set(feste).size, feste.length, 'doppelte data-kennung');
  // Der Fokus geht über die id, die dieselbe Kennung trägt (render(fokusElement)).
  assert.match(app, /render\(`mab-a-\$\{art\}`\)/);
});

test('keine Bewertung im Druckblatt und in den Daten (docs/02 Z. 141–146)', () => {
  // Die Absagen auf dem Blatt nennen „kein Soll“ und „keine Reaktion“ – das ist erlaubt. Bewertung nicht.
  const muster = /Punkte?\b|Rangliste|\bRang\b|Stufe|Prozent|\bSterne?\b|\bNoten?\b|Ergebnis|\bAmpel\b|\bSerie\b|in Folge|\d+\s*von\s*\d+|\d+\s*%/i;
  assert.ok(!muster.test(text), `Druckblatt: ${text.match(muster)?.[0]}`);
  // Die Absagefelder (keineAmpel …) nennen das Verbotene, darum nur die Zeilen prüfen.
  assert.ok(!muster.test(JSON.stringify([daten.rituale, daten.arten])), 'Zeilen der Daten: Bewertung');
});

test('keine KI-Begriffe in den Dateien der App', () => {
  // Modellnamen sind Entscheidung A1 (docs/offene-punkte-kita.md), hier bewusst nicht geprüft.
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
    const nennungen = [...alle[doc].matchAll(/(?<![\d,.])(\d+)\s+(?:Tests?|тест\w*)(?![\wäöüß])/giu)].map((m) => Number(m[1]));
    assert.ok(nennungen.length >= 1, `${doc} nennt keine Testzahl`);
    for (const n of nennungen) {
      assert.equal(n, echt, `${doc} nennt ${n} Tests, es sind ${echt}`);
    }
  }
});

test('package.json: privat, ES-Modul, Testskript führt beide Dateien aus', () => {
  const pkg = JSON.parse(alle['package.json']);
  assert.equal(pkg.private, true);
  assert.equal(pkg.type, 'module');
  assert.match(pkg.scripts?.test ?? '', /test\/logik\.test\.mjs/);
  assert.match(pkg.scripts?.test ?? '', /test\/regeln\.test\.mjs/);
});
