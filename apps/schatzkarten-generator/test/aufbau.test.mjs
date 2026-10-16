import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const appDir = new URL('../', import.meta.url);
const lesen = (datei) => readFile(new URL(datei, appDir), 'utf8');

test('index.html: Sprache, Zeichensatz, CSP, Stylesheets, Hauptbereich und Skript als Modul', async () => {
  const html = await lesen('index.html');
  assert.match(html, /<html lang="de">/);
  assert.match(html, /<meta charset="utf-8" \/>/);
  assert.match(html, /<meta name="viewport" content="width=device-width, initial-scale=1" \/>/);
  assert.match(html, /http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline'"/);
  assert.match(html, /<title>[^<]+<\/title>/);
  assert.match(html, /<meta name="description" content="[^"]+" \/>/);
  assert.match(html, /<link rel="stylesheet" href="\.\.\/\.\.\/packages\/kinder-ui\/css\/kinder\.css" \/>/);
  assert.match(html, /<link rel="stylesheet" href="druck\.css" \/>/);
  assert.match(html, /<main class="k-app" id="app" aria-live="polite">/);
  assert.match(html, /<noscript>/);
  assert.match(html, /<script type="module" src="app\.mjs"><\/script>/);
  // Kein Skript ohne Quelle, also keines, das im Seitentext steht.
  assert.equal((html.match(/<script\b/g) ?? []).length, 1);
});

test('druck.css: Bildschirmteile fallen im Druck weg, die Lösung nur im Lösungsmodus', async () => {
  const css = await lesen('druck.css');
  assert.match(css, /@media print/);
  assert.match(css, /\.sg-nur-bildschirm\s*\{[^}]*display:\s*none/);
  assert.match(css, /body\[data-druck="karten"\] \[data-teil="loesung"\]/);
  assert.match(css, /body\[data-druck="loesung"\] \[data-teil="karten"\]/);
  assert.match(css, /body:not\(\[data-druck="loesung"\]\) \[data-teil="loesung"\]/);
});

test('Quelltext: keine fremden Adressen, kein Speicher, Netzwächter an, Zufall nur über rng', async () => {
  for (const datei of ['app.mjs', 'logik.mjs', 'index.html', 'druck.css']) {
    const quelle = await lesen(datei);
    assert.doesNotMatch(quelle, /https?:\/\//, `${datei}: fremde Adresse`);
    assert.doesNotMatch(quelle, /localStorage|sessionStorage|indexedDB|document\.cookie/, `${datei}: Speicher`);
  }
  const app = await lesen('app.mjs');
  assert.match(app, /installiereNetzwerkWaechter\(\);/);
  assert.match(app, /window\.print\(\)/);
  assert.doesNotMatch(app, /[☐☒☑✓✔□]/, 'Kästchen oder Häkchen im Druck');
  const logik = await lesen('logik.mjs');
  assert.doesNotMatch(logik, /Math\.random/, 'die Logik darf den Zufall nur über rng nehmen');
});

test('keine Verweise auf KI, Modelle oder fremde Begründungen in den Dateien der App', async () => {
  const verboten = /BZgA|BIÖG|bildschirmarm nach|KI-bereit|KI[ -]|Claude|Anthropic|GPT|Gemini|Haiku|Sonnet|Opus/;
  for (const datei of ['app.mjs', 'logik.mjs', 'index.html', 'druck.css', 'README.md', 'GDD.md', 'package.json']) {
    assert.doesNotMatch(await lesen(datei), verboten, `${datei} enthält einen verbotenen Begriff`);
  }
});

test('Quellenhinweis: S. 246 und die zwei verwendeten Spielnamen, beide als eigene Übersetzung gekennzeichnet', async () => {
  const logik = await lesen('logik.mjs');
  assert.match(logik, /S\. 246/);
  assert.match(logik, /„Mit der Karte unterwegs“/);
  assert.match(logik, /„Versteck den Gegenstand und beschreibe den Weg“/);
  assert.match(logik, /eigene Übersetzung/);
});
