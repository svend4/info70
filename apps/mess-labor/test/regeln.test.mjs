import { test } from 'node:test';
import assert from 'node:assert/strict';
import { access, readdir, readFile } from 'node:fs/promises';

// Projektregeln, für diese App geprüft: docs/02 Z. 22–24 (keine Anfragen nach außen),
// docs/02 Z. 50 (Knöpfe und Fußlink mindestens 48 px), docs/02 Z. 141–146 (keine Bewertung
// von Kindern); die Speicherregel, die Eingaberegel und die Zufallsregel haben keine
// docs/02-Zeile, sie sind Projektregeln. Die App hat kein Druckblatt; druck.css blendet nur den
// Bildschirm und die Schmuck-Emojis aus (Entscheidung des Nutzers). Die Prüfung liest die Dateien der App (ohne test/).
// Die Testdateien selbst dürfen die verbotenen Wörter nennen, um sie zu verbieten.

const APP = new URL('../', import.meta.url);
const CODE_DATEIEN = ['index.html', 'app.mjs', 'logik.mjs', 'daten/experimente.json'];
const ALLE_DATEIEN = [...CODE_DATEIEN, 'druck.css', 'package.json', 'README.md', 'GDD.md'];

const lese = (datei) => readFile(new URL(datei, APP), 'utf8');
const code = Object.fromEntries(await Promise.all(CODE_DATEIEN.map(async (d) => [d, await lese(d)])));
const alle = Object.fromEntries(await Promise.all(ALLE_DATEIEN.map(async (d) => [d, await lese(d)])));

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

test('keine externen Adressen, keine Netzaufrufe außer dem Laden der eigenen Daten', () => {
  const netz = /XMLHttpRequest|WebSocket|sendBeacon|EventSource|importScripts|new Worker|window\[|globalThis|wss?:/;
  for (const d of CODE_DATEIEN) {
    assert.ok(!/https?:\/\/|(?<![:\w])\/\/[\w-]+\.[a-z]{2,}/i.test(code[d]), `${d}: externe Adresse`);
  }
  for (const d of ['app.mjs', 'logik.mjs']) {
    assert.ok(!netz.test(code[d]), `${d}: Netzaufruf gefunden`);
  }
  // fetch ist nur für die eigene Datei im Ordner daten/ erlaubt.
  const aufrufe = [...code['app.mjs'].matchAll(/fetch\(\s*'([^']+)'/g)].map((m) => m[1]);
  assert.deepEqual(aufrufe, ['daten/experimente.json'], 'fetch nur für die eigene Datenquelle');
});

test('kein Zufall, keine Uhr: Math.random, Date und performance kommen in keiner Datei der App vor', () => {
  for (const d of CODE_DATEIEN) {
    assert.ok(!/Math\.random|crypto|Date\.now|new Date|performance\./.test(code[d]), `${d}: Zufall oder Uhr`);
  }
});

test('kein Druckblatt: keine Druckfunktion; druck.css blendet nur den Bildschirm und die Schmuck-Emojis aus', async () => {
  assert.ok(!/window\.print|\bprint\(/.test(code['app.mjs']), 'app.mjs: Druckaufruf gefunden');
  assert.match(code['index.html'], /<link rel="stylesheet" href="druck\.css" \/>/, 'index.html: druck.css fehlt');
  const druck = (await lese('druck.css')).replace(/\/\*[\s\S]*?\*\//g, '');
  assert.match(druck, /@media print \{\s*#app \{ display: none !important; \}/, 'druck.css: Bildschirm wird im Druck nicht ausgeblendet');
  assert.match(druck, /\.ml-nur-bildschirm \{ display: none !important; \}/, 'druck.css: Klasse ml-nur-bildschirm fehlt');
  assert.ok(!/content\s*:|background|color\s*:|font|margin|padding|border|@page/i.test(druck), 'druck.css: keine Druckfassung');
});

test('Grundgerüst: deutsch, Viewport, CSP exakt, nur das gemeinsame Stylesheet und druck.css, ein Modul-Skript', () => {
  const html = code['index.html'];
  assert.match(html, /<html lang="de">/);
  assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1"/);
  assert.match(html, /<meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline'"/);
  assert.match(html, /<noscript>/);
  assert.match(html, /<title>Mess-Labor 🔬<\/title>/);
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

test('Knöpfe mindestens 48 px hoch: die gemeinsame Klasse .k-knopf hat min-height 3rem (docs/02 Z. 50)', async () => {
  const kinderCss = await readFile(new URL('../../../packages/kinder-ui/css/kinder.css', import.meta.url), 'utf8');
  assert.match(kinderCss, /\.k-knopf\s*\{[^}]*min-height:\s*3rem;/);
});

test('Fußlinks mindestens 48 px hoch: die Links im Fuß tragen min-height 48px inline (docs/02 Z. 50)', () => {
  assert.match(code['app.mjs'], /const FUSS_LINK = '[^']*min-height:48px[^']*';/);
  assert.match(code['app.mjs'], /el\('a', \{ href: 'eltern\.html', style: FUSS_LINK \}/);
  assert.match(code['app.mjs'], /el\('a', \{ href: '\.\.\/\.\.\/impressum\.html', style: FUSS_LINK \}/);
});

test('Fokus: jeder Knopf trägt eine data-kennung, die festen Kennungen sind eindeutig; nach Bildschirmwechsel gehört der Fokus der Überschrift', () => {
  const app = code['app.mjs'];
  const knoepfe = app.match(/el\('button'/g) ?? [];
  const kennungen = app.match(/'data-kennung': /g) ?? [];
  assert.equal(kennungen.length, knoepfe.length, `${knoepfe.length} Knöpfe, aber ${kennungen.length} data-kennung`);
  const feste = [...app.matchAll(/'data-kennung': '([^']+)'/g)].map((m) => m[1]);
  assert.equal(new Set(feste).size, feste.length, 'doppelte data-kennung');
  assert.match(app, /el\('h1', \{ class: 'k-titel', tabindex: -1 \}/, 'Überschrift nicht fokussierbar');
  assert.match(app, /app\.querySelector\('h1'\)\?\.focus\(\);/, 'Fokus nach Bildschirmwechsel fehlt');
});

test('keine uk- und ru-Fassung erfunden: der Vermerk steht im GDD, und die Daten haben keine uk- oder ru-Schlüssel', () => {
  assert.ok(alle['GDD.md'].includes('uk und ru: nicht vorhanden, offen.'), 'GDD.md: Vermerk fehlt');
  assert.ok(!/"(uk|ru)"\s*:/.test(code['daten/experimente.json']), 'Daten: uk- oder ru-Schlüssel');
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
  const muster = /unsicher|Selbstwert|Risiko|Diagnose|\bPunkte?\b|Rangliste|\bRang\b|Einstufung|\bStufe\b|\bPlatz\b|Prozent|\bSterne?\b|\bErgebnis\b|\bNoten?\b/i;
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

test('package.json: privat, ES-Modul, Testskript vorhanden', () => {
  const pkg = JSON.parse(alle['package.json']);
  assert.equal(pkg.private, true);
  assert.equal(pkg.type, 'module');
  assert.match(pkg.scripts?.test ?? '', /node --test/);
});
