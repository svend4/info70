import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const ordner = new URL('../', import.meta.url);
const lese = (name) => readFile(new URL(name, ordner), 'utf8');

const CODE_DATEIEN = ['app.mjs', 'logik.mjs'];
const SEITEN_DATEIEN = ['index.html', 'eltern.html', 'druck.css'];
const DATEN_DATEIEN = ['daten/indikatoren.json', 'package.json'];
const ALLE_DATEIEN = [...CODE_DATEIEN, ...SEITEN_DATEIEN, ...DATEN_DATEIEN, 'README.md', 'GDD.md'];
// Dateien, die etwas ausgeben oder anzeigen: dort darf keine Zeile für den Namen stehen.
const AUSGABE_DATEIEN = [...CODE_DATEIEN, ...SEITEN_DATEIEN, 'daten/indikatoren.json'];

test('Keine Speicher-Schreibwege: kein setItem, sessionStorage, IndexedDB oder Cookies', async () => {
  for (const datei of CODE_DATEIEN) {
    const text = await lese(datei);
    for (const wort of ['setItem', 'sessionStorage', 'indexedDB', 'document.cookie']) {
      assert.ok(!text.includes(wort), `${datei}: ${wort}`);
    }
  }
});

test('localStorage wird nur zum Entfernen des Altbestands angefasst', async () => {
  for (const datei of CODE_DATEIEN) {
    const text = await lese(datei);
    for (const m of text.matchAll(/localStorage\.(\w+)/g)) {
      assert.equal(m[1], 'removeItem', `${datei}: localStorage.${m[1]} ist nicht erlaubt`);
    }
  }
});

test('Keine externen Anfragen: keine Adressen in Code, Seiten und Daten', async () => {
  for (const datei of [...CODE_DATEIEN, ...SEITEN_DATEIEN, ...DATEN_DATEIEN]) {
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

test('Keine Kinder-, Bewertungs- oder Koffer-Begriffe im Code', async () => {
  const app = await lese('app.mjs');
  assert.ok(!app.includes("'input'"), 'kein Eingabefeld im Code');
  for (const datei of CODE_DATEIEN) {
    const text = (await lese(datei)).toLowerCase();
    for (const wort of ['kürzel', 'stufe', 'kompass.mjs', 'koffer', 'clipboard', 'zwischenablage', 'ampel', 'kopieren', '%']) {
      assert.ok(!text.includes(wort), `${datei}: ${wort}`);
    }
  }
});

test('Der Koffer und der Kinderbericht sind entfernt: kompass.mjs und sein Test fehlen, der Katalog hat keine Stufen', async () => {
  assert.equal(existsSync(new URL('kompass.mjs', ordner)), false);
  assert.equal(existsSync(new URL('test/kompass.test.mjs', ordner)), false);
  const katalog = JSON.parse(await lese('daten/indikatoren.json'));
  assert.equal(katalog.stufen, undefined, 'keine Stufen im Katalog');
  assert.equal(katalog.berichtKopf, undefined, 'kein Berichtskopf im Katalog');
});

test('Seite: lang de, CSP self, Stylesheets, Hauptbereich mit aria-live, Modul-Skript, Titel', async () => {
  const html = await lese('index.html');
  assert.ok(html.includes('<html lang="de">'));
  assert.ok(html.includes(`default-src 'self'; style-src 'self' 'unsafe-inline'`));
  assert.ok(html.includes('href="../../packages/kinder-ui/css/kinder.css"'));
  assert.ok(html.includes('href="druck.css"'));
  assert.ok(html.includes('<main class="k-app" id="app" aria-live="polite">'));
  assert.ok(html.includes('<noscript>'));
  assert.ok(html.includes('<script type="module" src="app.mjs">'));
  assert.match(html, /<title>[^<]+<\/title>/);
});

test('Druckbogen: druck.css mit @media print blendet die Bedienteile aus; der Knopf ruft window.print()', async () => {
  const css = await lese('druck.css');
  assert.match(css, /@media\s+print/);
  assert.match(css, /\.k-nur-bildschirm\s*\{\s*display:\s*none/);
  const app = await lese('app.mjs');
  assert.ok(app.includes('window.print()'), 'Druckknopf ruft window.print() auf');
});

test('Keine Zeile für den Namen auf einem Blatt oder einer Seite', async () => {
  for (const datei of AUSGABE_DATEIEN) {
    const text = await lese(datei);
    assert.ok(!/Name\s*:\s*_{3,}|Namensfeld|Namenszeile\s*:/i.test(text), `${datei}: Zeile für den Namen`);
  }
});

test('Start: Netzwerk-Wächter aktiv, Altbestand wird beim Start entfernt, Footer verweist auf eltern.html', async () => {
  const app = await lese('app.mjs');
  assert.ok(app.includes('installiereNetzwerkWaechter();'));
  assert.ok(app.includes('bereinigeAltbestand();'));
  assert.ok(app.includes("href: 'eltern.html'"), 'Footer-Link zu eltern.html');
  assert.ok(existsSync(new URL('eltern.html', ordner)), 'eltern.html liegt im Ordner');
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
