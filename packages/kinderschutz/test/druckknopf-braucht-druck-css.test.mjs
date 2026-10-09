import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';

// docs/02: „Кнопка печати есть → есть и свой `druck.css` c `@media print`, и в
// нём скрыта экранная обвязка."
//
// Ohne eigenes Druck-CSS druckt der Knopf die Bildschirmseite: Kopfzeile,
// Knöpfe, Fortschrittsbalken, Fußzeile. Das sieht aus wie ein Versehen und ist
// eines. Sechs Apps hatten den Knopf ohne CSS - gefunden wurde das erst in
// Welle 82, lange nach ihrem Bau. Diese Regel hält die Lücke geschlossen.
//
// Geprüft wird dreierlei: die Datei gibt es, sie enthält `@media print`, und
// sie ist in index.html eingebunden (eine Datei, die niemand lädt, wirkt nicht).
const appsDir = new URL('../../../apps/', import.meta.url);
const vorhanden = async (url) => { try { await access(url); return true; } catch { return false; } };

const befunde = [];
let mitKnopf = 0;

for (const eintrag of await readdir(appsDir, { withFileTypes: true })) {
  if (!eintrag.isDirectory()) continue;
  const appDir = new URL(`${eintrag.name}/`, appsDir);
  const dateien = (await readdir(appDir)).filter((d) => d.endsWith('.mjs'));
  let druckt = false;
  for (const d of dateien) {
    if (/window\.print\(\)/.test(await readFile(new URL(d, appDir), 'utf8'))) druckt = true;
  }
  if (!druckt) continue;
  mitKnopf += 1;
  const css = new URL('druck.css', appDir);
  if (!(await vorhanden(css))) {
    befunde.push(`apps/${eintrag.name}: Druckknopf ohne eigenes druck.css`);
    continue;
  }
  const inhalt = await readFile(css, 'utf8');
  if (!/@media\s+print/.test(inhalt)) befunde.push(`apps/${eintrag.name}/druck.css: kein @media print`);
  // Irgendetwas muss ausgeblendet werden, sonst ist das CSS Zierde.
  if (!/display:\s*none/.test(inhalt)) befunde.push(`apps/${eintrag.name}/druck.css: blendet nichts aus`);
  const seite = new URL('index.html', appDir);
  if (await vorhanden(seite)) {
    if (!/href="druck\.css"/.test(await readFile(seite, 'utf8'))) {
      befunde.push(`apps/${eintrag.name}/index.html: druck.css ist nicht eingebunden`);
    }
  }
}

test('jede App mit Druckknopf hat ihr eigenes druck.css', () => {
  assert.deepEqual(befunde, [], befunde.join('\n'));
  // Plausibilität: die Regel darf nicht grün werden, weil sie nichts findet.
  assert.ok(mitKnopf >= 20, `nur ${mitKnopf} Apps mit Druckknopf gefunden – greift das Muster noch?`);
});
