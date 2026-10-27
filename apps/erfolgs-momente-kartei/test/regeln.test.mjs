import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { druckKarten, druckTexte } from '../logik.mjs';

// Die Regeln des Projekts als Prüfung. Fundstellen in docs/02 stehen bei den Tests.
// Geprüft wird der Quelltext der App ohne den Ordner test/; die Prüfung selbst nennt
// die verbotenen Wörter und ist davon ausgenommen.
const appDir = new URL('../', import.meta.url);
const daten = JSON.parse(await readFile(new URL('daten/karten.json', appDir), 'utf8'));
const html = await readFile(new URL('index.html', appDir), 'utf8');
const app = await readFile(new URL('app.mjs', appDir), 'utf8');
const css = await readFile(new URL('druck.css', appDir), 'utf8');
const readme = await readFile(new URL('README.md', appDir), 'utf8');
const gdd = await readFile(new URL('GDD.md', appDir), 'utf8');

const quellen = new Map();
for (const datei of await readdir(appDir, { recursive: true })) {
  if (datei.startsWith('test/') || datei.includes('node_modules')) continue;
  if (!/\.(mjs|html|css|json|md)$/.test(datei)) continue;
  quellen.set(datei, await readFile(new URL(datei, appDir), 'utf8'));
}
// README.md und GDD.md sind Dokumentation, nicht ausgeliefert. Sie zitieren den Katalog,
// um dessen Gruppierung abzulehnen (docs/10 Nr. 2); darum gilt die Wortliste dort nicht.
const ausgeliefert = [...quellen].filter(([datei]) => datei !== 'README.md' && datei !== 'GDD.md');

const alleIds = [...daten.karten, daten.quelle].map((k) => k.id);
const gedruckt = () => druckTexte(druckKarten(daten, alleIds));

test('Keine Felder über Kinder: kein Eingabefeld, kein Kinder- oder Namensfeld in den Daten (docs/02 Z. 141–146)', () => {
  const eingabe = /<(?:input|textarea|select)[\s>]|['"`](?:input|textarea|select)['"`]/i;
  assert.ok(!eingabe.test(html), 'index.html hat ein Eingabefeld');
  assert.ok(!eingabe.test(app), 'app.mjs erzeugt ein Eingabefeld');
  const schluessel = [];
  const sammle = (o) => {
    if (Array.isArray(o)) o.forEach(sammle);
    else if (o && typeof o === 'object') {
      for (const [k, v] of Object.entries(o)) { schluessel.push(k); sammle(v); }
    }
  };
  sammle(daten);
  assert.deepEqual(schluessel.filter((k) => /name|kind|geburt/i.test(k)), []);
});

test('Nichts wird gespeichert: kein Speicher, kein Cookie, kein Cache im Quelltext', () => {
  const speicher = /localStorage|sessionStorage|indexedDB|document\.cookie|\.setItem\(|caches\./;
  for (const [datei, text] of quellen) assert.ok(!speicher.test(text), `${datei} speichert`);
});

test('Keine Anfragen nach außen: kein http(s), Abrufe nur relativ, Ressourcen nur eigene (docs/02 Z. 22–24)', () => {
  for (const [datei, text] of quellen) {
    assert.ok(!/https?:\/\//.test(text), `${datei}: http(s)-Verweis`);
    assert.ok(!/XMLHttpRequest|WebSocket|sendBeacon/.test(text), `${datei}: Netzwerk-API`);
  }
  const abrufe = [...quellen.values()].join('\n').match(/\bfetch\s*\(/g) ?? [];
  assert.equal(abrufe.length, 1, 'genau ein fetch erwartet');
  assert.match(app, /fetch\('daten\/karten\.json'\)/, 'fetch nur für die eigenen Daten');
  const eingebunden = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(eingebunden.sort(),
    ['../../packages/kinder-ui/css/kinder.css', '../../packages/kinder-ui/img/favicon.svg', 'app.mjs', 'druck.css'].sort());
});

test('Netzwerk-Wächter: eingebunden und beim Start aufgerufen (docs/02 Z. 22–24)', () => {
  assert.match(app, /import \{ installiereNetzwerkWaechter \} from '\.\.\/\.\.\/packages\/kinderschutz\/src\/index\.mjs';/);
  assert.match(app, /^installiereNetzwerkWaechter\(\);/m);
});

test('CSP im index.html ist die Vorgabe des Projekts, nichts mehr', () => {
  assert.match(html,
    /<meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline'" \/>/);
});

test('Auf dem Papier kein Häkchen, Kästchen, Punkt, Stern und kein Emoji (docs/02 Z. 79–82)', () => {
  const zeichen = /[☐☒☑✓✔✗✘★☆•●○◦□■▢▪▫◆◇]|\p{Extended_Pictographic}|\p{Emoji_Presentation}/u;
  assert.ok(zeichen.test('Morgenkreis ☐'), 'Gegenprobe: das Muster greift nicht');
  for (const t of gedruckt()) assert.ok(!zeichen.test(t), `Druckzeichen in „${t}“`);
  for (const [datei, text] of quellen) {
    if (datei.endsWith('.json')) assert.ok(!zeichen.test(text), `${datei}: Druckzeichen in den Daten`);
  }
});

test('Auf dem Papier keine Namenszeile und keine Tages- oder Wochentagsfelder (docs/02 Z. 79–82)', () => {
  const verboten = /Name\s*:|_{3,}|Namens|Wochentag|Datum|Montag|Dienstag|Mittwoch|Donnerstag|Freitag|Samstag|Sonntag/i;
  assert.ok(verboten.test('Name: ____'), 'Gegenprobe: das Muster greift nicht');
  for (const t of gedruckt()) assert.ok(!verboten.test(t), `verbotenes Feld auf dem Papier: „${t}“`);
});

test('Markierung: jede gedruckte Karte trägt Eigenentwurf und eine Seitenangabe; die Quellenkarte trägt die Prüfangabe', () => {
  for (const karte of druckKarten(daten, alleIds)) {
    const text = druckTexte([karte]).join(' ');
    assert.match(text, /Eigenentwurf/, `${karte.titel}: ohne Markierung`);
    assert.match(text, /S\. \d+/, `${karte.titel}: ohne Seitenangabe`);
  }
  const pruefangabe = 'Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.';
  assert.ok(app.includes(pruefangabe), 'Footer ohne Prüfangabe');
  assert.ok(gdd.includes(pruefangabe), 'GDD ohne Prüfangabe');
  assert.ok(druckTexte(druckKarten(daten, ['quelle'])).some((t) => t.includes(pruefangabe)), 'Quellenkarte ohne Prüfangabe');
  for (const [datei, text] of quellen) assert.ok(!/von Hand geprüft/i.test(text), `${datei}: „von Hand geprüft“`);
});

test('druck.css blendet die Bildschirmteile aus, bindet das Blatt ein und gibt dem Footer-Link 48 px Höhe', () => {
  assert.match(css, /@media print/);
  assert.match(css, /\.ek-nur-bildschirm\s*\{\s*display:\s*none/);
  assert.match(html, /href="druck\.css"/);
  const markiert = (app.match(/ek-nur-bildschirm/g) ?? []).length;
  assert.ok(markiert >= 4, `nur ${markiert} Bildschirmteile markiert`);
  assert.match(css, /\.ek-link\s*\{[^}]*display:\s*inline-flex;[^}]*align-items:\s*center;[^}]*min-height:\s*48px;[^}]*padding:\s*0 8px;/);
  assert.match(app, /class: 'ek-link'/, 'Footer-Link ohne Klasse ek-link');
});

test('Live-Region und Fokus: #app meldet Änderungen, jeder Knopf trägt eine data-kennung, der Fokus kehrt nach dem Neuaufbau zurück', () => {
  assert.match(html, /<main class="k-app" id="app" aria-live="polite">/);
  const knoepfe = (app.match(/el\('button',/g) ?? []).length;
  const kennungen = (app.match(/'data-kennung':/g) ?? []).length;
  assert.ok(knoepfe >= 4, `nur ${knoepfe} Knöpfe gefunden`);
  assert.equal(kennungen, knoepfe, 'ein Knopf ohne data-kennung');
  const feste = [...app.matchAll(/'data-kennung': '([^']+)'/g)].map((m) => m[1]);
  assert.equal(new Set(feste).size, feste.length, 'feste Kennungen doppelt');
  assert.match(app, /'data-kennung': `karte-\$\{karte\.id\}`/, 'Kartenknopf ohne Kennung aus der Karten-ID');
  assert.match(app, /const merken = document\.activeElement\?\.dataset\?\.kennung;/);
  assert.match(app, /n\.dataset\.kennung === merken\);\s*ziel\?\.focus\(\);/);
});

test('Wortliste: „unsicher“, „Selbstwert“, „Risiko“, „Diagnose“ und „Offline“ kommen in den ausgelieferten Dateien nicht vor', () => {
  const verboten = /unsicher|Selbstwert|Risiko|Diagnos|Offline/i;
  assert.ok(verboten.test('Diagnose'), 'Gegenprobe: das Muster greift nicht');
  for (const [datei, text] of ausgeliefert) assert.ok(!verboten.test(text), `${datei}: verbotenes Wort`);
});

test('Modellnamen: geprüft wird nur über allgemeine KI-Begriffe, und keiner kommt in den Dateien vor', () => {
  const allgemein = /\bKI\b|LLM|Sprachmodell|Chatbot|künstliche Intelligenz/i;
  assert.ok(allgemein.test('künstliche Intelligenz'), 'Gegenprobe: das Muster greift nicht');
  for (const [datei, text] of quellen) assert.ok(!allgemein.test(text), `${datei}: KI-Begriff`);
});

test('Testzahl: README und GDD nennen die Zahl der Tests genau', async () => {
  let n = 0;
  for (const d of (await readdir(new URL('test/', appDir))).filter((x) => x.endsWith('.test.mjs'))) {
    n += ((await readFile(new URL(`test/${d}`, appDir), 'utf8')).match(/^test\(/gm) ?? []).length;
  }
  for (const [name, text] of [['README.md', readme], ['GDD.md', gdd]]) {
    const genannt = [...text.matchAll(/(\d+)\s+Tests?(?![\wäöüß])/g)].map((m) => Number(m[1]));
    assert.ok(genannt.length >= 1, `${name} nennt keine Testzahl`);
    for (const z of genannt) assert.equal(z, n, `${name} nennt ${z}, es sind ${n}`);
  }
});
