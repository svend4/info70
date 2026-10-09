import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

// docs/02, Regel zum Druck: „печатный лист не несёт галочек, баллов,
// звёздочек, полей по дням и строки для имени (это была бы система сравнения
// детей на бумаге)".
//
// Die Namenszeile ist die Stelle, an der diese Regel am leisesten bricht: ein
// Feld „Name: ____" sieht nach Ordnung aus und macht aus einem Arbeitsblatt
// ein Dokument ueber ein bestimmtes Kind, das neben dem eines anderen haengen
// kann. Zwei Apps hatten sie trotzdem (Mini-Gaertner-Begleiter und
// Schwungblatt-Generator); gefunden wurde das erst in Welle 81, lange nach dem
// Bau. Diese Regel haelt sie draussen.
//
// Geprueft werden nur die Dateien, die etwas AUSGEBEN - app.mjs, eltern.html,
// druck.css und die Daten. Tests und Kommentare muessen „Name: ___" nennen
// duerfen, um es zu verbieten; Falle A, einundzwanzigstes Mal.
const NAMENSZEILE = /Name\s*:\s*_{3,}|Name\s*:\s*…{2,}|\bNamensfeld\b|\bNamenszeile\s*:\s*_/i;

const wurzel = new URL('../../../apps/', import.meta.url);
const befunde = [];
let geprueft = 0;

for (const eintrag of await readdir(wurzel, { withFileTypes: true })) {
  if (!eintrag.isDirectory()) continue;
  const appDir = new URL(`${eintrag.name}/`, wurzel);
  for (const datei of await readdir(appDir, { recursive: true })) {
    if (datei.startsWith('test/') || datei.includes('node_modules')) continue;
    if (!/\.(mjs|css|html|json)$/.test(datei)) continue;
    const roh = await readFile(new URL(datei, appDir), 'utf8');
    geprueft += 1;
    // Kommentare leeren, Zeilen aber stehen lassen.
    const code = roh
      .replace(/\/\*[\s\S]*?\*\//g, (t) => t.replace(/[^\n]/g, ' '))
      .replace(/(^|[^:])\/\/[^\n]*/g, (t, vor) => vor + t.slice(vor.length).replace(/[^\n]/g, ' '));
    code.split('\n').forEach((zeile, n) => {
      if (NAMENSZEILE.test(zeile)) {
        befunde.push(`apps/${eintrag.name}/${datei}:${n + 1}: Zeile für den Namen auf einem Blatt – docs/02 verbietet sie`);
      }
    });
  }
}

test('kein Druckblatt trägt eine Zeile für den Namen', () => {
  assert.deepEqual(befunde, [], befunde.join('\n'));
  assert.ok(geprueft > 400, `nur ${geprueft} Dateien gelesen – greift die Suche noch?`);
});

test('die Prüfung findet die Namenszeile wirklich', () => {
  // Ohne Gegenprobe wäre die Regel grün, weil sie nichts sucht.
  for (const schlecht of ["el('p', {}, 'Name: ______________')", 'Name: ____', 'Name:_____']) {
    assert.ok(NAMENSZEILE.test(schlecht), `nicht erkannt: ${schlecht}`);
  }
  // Und das Richtige bleibt frei: ein Feldname, ein Vorname im Text, eine
  // Überschrift „Mein Pflanztagebuch".
  for (const gut of ["el('p', {}, `Mein Pflanztagebuch: ${k.name}`)", 'const name = kind.name;',
    "assert.equal(monatsName(1), 'Januar')", '"name": "Eine Holzfigur"']) {
    assert.ok(!NAMENSZEILE.test(gut), `Fehlalarm: ${gut}`);
  }
});
