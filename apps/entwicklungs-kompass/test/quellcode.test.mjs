import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const ordner = new URL('../', import.meta.url);
const lese = (name) => readFile(new URL(name, ordner), 'utf8');

const CODE_DATEIEN = ['app.mjs', 'logik.mjs'];
const SEITEN_DATEIEN = ['index.html', 'druck.css'];
const ALLE_DATEIEN = [
  'app.mjs', 'logik.mjs', 'index.html', 'druck.css', 'eltern.html',
  'README.md', 'GDD.md', 'package.json', 'daten/indikatoren.json',
];

test('Keine Speicher-Schreibwege: kein setItem, sessionStorage, IndexedDB oder Cookies', async () => {
  for (const datei of CODE_DATEIEN) {
    const text = await lese(datei);
    for (const wort of ['setItem', 'sessionStorage', 'indexedDB', 'document.cookie']) {
      assert.ok(!text.includes(wort), `${datei}: ${wort}`);
    }
  }
});

test('Keine externen Anfragen: keine Adressen im Quelltext, nur eigene Module importiert', async () => {
  for (const datei of [...CODE_DATEIEN, ...SEITEN_DATEIEN]) {
    const text = await lese(datei);
    assert.ok(!/https?:\/\//.test(text), `${datei}: Adresse im Quelltext`);
  }
  const app = await lese('app.mjs');
  const importe = [...app.matchAll(/from '([^']+)'/g)].map((m) => m[1]);
  assert.ok(importe.length > 0, 'Importe gefunden');
  for (const pfad of importe) {
    assert.ok(pfad === './logik.mjs' || pfad.startsWith('../../packages/'), `fremder Import: ${pfad}`);
  }
});

test('Keine Eingabefelder und keine Kinder-Begriffe im Code', async () => {
  const app = await lese('app.mjs');
  assert.ok(!app.includes("'input'"), 'kein Eingabefeld im Code');
  for (const datei of CODE_DATEIEN) {
    const text = (await lese(datei)).toLowerCase();
    for (const wort of ['kürzel', 'stufe', 'kompass.mjs', 'koffer', 'clipboard', 'zwischenablage', 'ampel', '%']) {
      assert.ok(!text.includes(wort), `${datei}: ${wort}`);
    }
  }
});

test('Seite: lang de, CSP self, Stylesheets, Hauptbereich mit aria-live, Modul-Skript, Titel', async () => {
  const html = await lese('index.html');
  assert.ok(html.includes('<html lang="de">'));
  assert.ok(html.includes(`default-src 'self'; style-src 'self' 'unsafe-inline'`));
  assert.ok(html.includes('href="../../packages/kinder-ui/css/kinder.css"'));
  assert.ok(html.includes('href="druck.css"'));
  assert.ok(html.includes('<main class="k-app" id="app" aria-live="polite">'));
  assert.ok(html.includes('<script type="module" src="app.mjs">'));
  assert.match(html, /<title>[^<]+<\/title>/);
});

test('Start: Netzwerk-Wächter aktiv und Altbestand-Bereinigung verdrahtet', async () => {
  const app = await lese('app.mjs');
  assert.ok(app.includes('installiereNetzwerkWaechter();'));
  assert.ok(app.includes('bereinigeAltbestand();'));
});

test('Eltern-Seite: lang de, eine h1, Karten im main-Bereich (Sammelband liest diese Struktur)', async () => {
  const html = await lese('eltern.html');
  assert.ok(html.includes('<html lang="de">'));
  assert.match(html, /<title>[^<]+<\/title>/);
  assert.equal((html.match(/<h1[\s>]/g) ?? []).length, 1, 'genau eine h1');
  assert.ok(html.includes('<main class="k-app">'));
  assert.ok((html.match(/<section class="k-karte">/g) ?? []).length >= 3, 'Karten im main-Bereich');
});

test('Keine Modellnamen in den Dateien des Ordners', async () => {
  for (const datei of ALLE_DATEIEN) {
    const text = await lese(datei);
    assert.ok(!/claude|anthropic|haiku|opus|sonnet|gpt/i.test(text), `${datei}: Modellname`);
  }
});

test('Der Koffer ist entfernt: kompass.mjs und sein Test existieren nicht mehr', () => {
  assert.equal(existsSync(new URL('kompass.mjs', ordner)), false);
  assert.equal(existsSync(new URL('test/kompass.test.mjs', ordner)), false);
});
