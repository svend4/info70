import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { druckKarten, druckTexte } from '../logik.mjs';

// Die Regeln aus docs/02 als Prüfung. Geprüft wird der Quelltext der App ohne
// den Ordner test/; die Prüfung selbst nennt die verbotenen Wörter und ist
// davon ausgenommen.
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

const alleIds = [...daten.karten, daten.quelle].map((k) => k.id);
const gedruckt = () => druckTexte(druckKarten(daten, alleIds));

test('Regel 3: keine Felder über Kinder – kein Eingabefeld, kein Kinder- oder Namensfeld in den Daten', () => {
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

test('Regel 2: nichts wird gespeichert – kein Speicher, kein Cookie, kein Cache im Quelltext', () => {
  const speicher = /localStorage|sessionStorage|indexedDB|document\.cookie|\.setItem\(|caches\./;
  for (const [datei, text] of quellen) assert.ok(!speicher.test(text), `${datei} speichert`);
});

test('Regel 1: keine Adresse außerhalb der App – kein http(s), Abrufe nur relativ, Ressourcen nur eigene', () => {
  for (const [datei, text] of quellen) {
    assert.ok(!/https?:\/\//.test(text), `${datei}: http(s)-Verweis`);
    assert.ok(!/XMLHttpRequest|WebSocket|sendBeacon/.test(text), `${datei}: Netzwerk-API`);
  }
  const abrufe = [...quellen.values()].join('\n').match(/\bfetch\s*\(/g) ?? [];
  assert.equal(abrufe.length, 1, 'genau ein fetch erwartet');
  assert.match(app, /fetch\('daten\/karten\.json'\)/, 'fetch nur für die eigenen Daten');
  const eingebunden = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map((m) => m[1]);
  assert.deepEqual(eingebunden.sort(),
    ['../../packages/kinder-ui/css/kinder.css', 'app.mjs', 'druck.css'].sort());
});

test('Regel 1: der Netzwerk-Wächter ist eingebunden und wird beim Start aufgerufen', () => {
  assert.match(app, /import \{ installiereNetzwerkWaechter \} from '\.\.\/\.\.\/packages\/kinderschutz\/src\/index\.mjs';/);
  assert.match(app, /^installiereNetzwerkWaechter\(\);/m);
});

test('Regel 1: die CSP im index.html ist die Vorgabe des Projekts, nichts mehr', () => {
  assert.match(html,
    /<meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline'" \/>/);
});

test('Regel 4: auf dem Papier kein Häkchen, Kästchen, Punkt, Stern und kein Emoji', () => {
  const zeichen = /[☐☒☑✓✔✗✘★☆•●○◦□■▢▪▫◆◇]|\p{Extended_Pictographic}|\p{Emoji_Presentation}/u;
  assert.ok(zeichen.test('Morgenkreis ☐'), 'Gegenprobe: das Muster greift nicht');
  for (const t of gedruckt()) assert.ok(!zeichen.test(t), `Druckzeichen in „${t}“`);
  for (const [datei, text] of quellen) {
    if (datei.endsWith('.json')) assert.ok(!zeichen.test(text), `${datei}: Druckzeichen in den Daten`);
  }
});

test('Regel 4: der Druck trägt keine Namenszeile und keine Tages- oder Wochentagsfelder', () => {
  const verboten = /Name\s*:|_{3,}|Namens|Wochentag|Datum|Montag|Dienstag|Mittwoch|Donnerstag|Freitag|Samstag|Sonntag/i;
  assert.ok(verboten.test('Name: ____'), 'Gegenprobe: das Muster greift nicht');
  for (const t of gedruckt()) assert.ok(!verboten.test(t), `verbotenes Feld auf dem Papier: „${t}“`);
});

test('Regel 7: jede gedruckte Karte trägt ihre Quelle oder die Markierung Eigenentwurf und eine Seitenangabe', () => {
  for (const karte of druckKarten(daten, alleIds)) {
    const text = druckTexte([karte]).join(' ');
    assert.match(text, /Eigenentwurf/, `${karte.titel}: ohne Markierung`);
    assert.match(text, /S\. \d+/, `${karte.titel}: ohne Seitenangabe`);
  }
});

test('Regel 4: druck.css blendet die Bildschirmteile aus, und das Blatt bindet es ein', () => {
  assert.match(css, /@media print/);
  assert.match(css, /\.ek-nur-bildschirm\s*\{\s*display:\s*none/);
  assert.match(html, /href="druck\.css"/);
  const markiert = (app.match(/ek-nur-bildschirm/g) ?? []).length;
  assert.ok(markiert >= 4, `nur ${markiert} Bildschirmteile markiert`);
});

test('Live-Region: die App-Wurzel #app meldet Änderungen (aria-live)', () => {
  assert.match(html, /<main class="k-app" id="app" aria-live="polite">/);
});

test('Wortliste: „unsicher“, „Selbstwert“, „Risiko“, „Diagnose“ kommen im Quelltext nicht vor', () => {
  const verboten = /unsicher|Selbstwert|Risiko|Diagnos/i;
  assert.ok(verboten.test('Diagnose'), 'Gegenprobe: das Muster greift nicht');
  for (const [datei, text] of quellen) assert.ok(!verboten.test(text), `${datei}: verbotenes Wort`);
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
