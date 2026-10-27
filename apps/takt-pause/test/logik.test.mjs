import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import * as logik from '../logik.mjs';
import { taktPhase, formatZeit, tagesSchluessel, aktualisiereTag } from '../logik.mjs';

const appMitKommentar = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');
// Kommentare erklären, was die App nicht tut; geprüft wird der Code.
const appQuelle = appMitKommentar.split('\n').filter((z) => !/^\s*\/\//.test(z)).join('\n');
const indexSeite = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const elternSeite = await readFile(new URL('../eltern.html', import.meta.url), 'utf8');
const readme = await readFile(new URL('../README.md', import.meta.url), 'utf8');
const paket = await readFile(new URL('../package.json', import.meta.url), 'utf8');

test('taktPhase: neutrale Zeitphasen (läuft, fast um, um), keine Farbe und keine Wertung', () => {
  assert.equal(taktPhase(0), 'laeuft');
  assert.equal(taktPhase(0.79), 'laeuft');
  assert.equal(taktPhase(0.8), 'fastUm');
  assert.equal(taktPhase(0.99), 'fastUm');
  assert.equal(taktPhase(1), 'um');
  assert.equal(taktPhase(1.5), 'um');
});

test('formatZeit: M:SS, negative Werte werden 0:00', () => {
  assert.equal(formatZeit(0), '0:00');
  assert.equal(formatZeit(59), '0:59');
  assert.equal(formatZeit(60), '1:00');
  assert.equal(formatZeit(605), '10:05');
  assert.equal(formatZeit(-5), '0:00');
});

test('tagesSchluessel: lokales Datum als JJJJ-MM-TT', () => {
  assert.equal(tagesSchluessel(new Date(2026, 6, 12)), '2026-07-12');
  assert.equal(tagesSchluessel(new Date(2026, 0, 3)), '2026-01-03');
});

test('aktualisiereTag: addiert am selben Tag, setzt bei Datumswechsel zurück', () => {
  const tag1 = aktualisiereTag(null, { geplantMin: 30 }, '2026-07-12');
  assert.deepEqual(tag1, { datum: '2026-07-12', geplantMin: 30, pausen: 0 });
  const tag2 = aktualisiereTag(tag1, { pausen: 1 }, '2026-07-12');
  assert.deepEqual(tag2, { datum: '2026-07-12', geplantMin: 30, pausen: 1 });
  const tag3 = aktualisiereTag(tag2, { geplantMin: 15 }, '2026-07-13');
  assert.deepEqual(tag3, { datum: '2026-07-13', geplantMin: 15, pausen: 0 });
});

test('Kinder werden nicht bewertet: logik.mjs hat keine Ampel, keine Wochen-Historie, keine Wochen-Kennzahlen', () => {
  assert.equal(logik.ampelFarbe, undefined, 'keine Ampel-Funktion mehr');
  assert.equal(logik.mergeWoche, undefined, 'keine Wochen-Historie mehr');
  assert.equal(logik.wochenStatistik, undefined, 'keine Wochen-Kennzahlen mehr');
});

test('Kinder werden nicht bewertet: app.mjs ohne Ampelfarben, Pokal, Lob- und Erfolgstexte, Wochenübersicht', () => {
  assert.doesNotMatch(appQuelle, /\b(?:ampel\w*|gruen|gelb|rot)\b|FARBEN|#15803d|#f59e0b|#b91c1c/i, 'keine Ampelfarben, keine Farbe mit Bedeutung');
  assert.doesNotMatch(appQuelle, /🚦|🟡|🔴|🟢|🏆|💪/, 'kein Ampel- oder Pokal-Symbol');
  assert.doesNotMatch(appQuelle, /gefeiert|geschafft|schaffst|stark|Rekord|Punkte|Rang\b|Serie|in Folge/i, 'keine Bewertungstexte');
  assert.doesNotMatch(appQuelle, /rueckblick|Rückblick|Wochen|ladeWoche|mergeWoche|wochenStatistik/, 'keine Wochenübersicht');
  assert.doesNotMatch(appQuelle, /k-knopf--richtig|k-knopf--falsch/, 'kein Knopf im Richtig-Grün');
  assert.match(appQuelle, /Zeit-Anzeiger/, 'der Anzeiger heißt neutral Zeit-Anzeiger');
  assert.match(appQuelle, /pausen\} Pause\$\{tag\.pausen === 1 \? '' : 'n'\} gemacht/, 'die Tageszeile zählt nur die gemachten Pausen von heute');
});

test('Alter Schlüssel tp.woche: eine einzige Zeile removeItem mit Literal, nie geschrieben oder gelesen', () => {
  const zeilen = appQuelle.split('\n').filter((z) => z.includes('tp.woche') && !/^\s*\/\//.test(z));
  assert.deepEqual(zeilen, ["try { localStorage.removeItem('tp.woche'); } catch {}"], 'nur die Migration nennt den Schlüssel');
  assert.doesNotMatch(appQuelle, /setItem\(\s*'tp\.woche'|getItem\(\s*'tp\.woche'/, 'tp.woche wird weder geschrieben noch gelesen');
});

test('Speicherregel: die App speichert (setItem), darum hat sie den Löschknopf; er löscht genau Tageszeile und laufende Zeit', () => {
  assert.match(appQuelle, /localStorage\.setItem\(TAG_SCHLUESSEL/, 'die Tageszeile wird gespeichert');
  assert.match(appQuelle, /localStorage\.setItem\(LAUFEND_SCHLUESSEL/, 'die laufende Zeit wird gespeichert');
  assert.match(appQuelle, /loescheDaten\(\[TAG_SCHLUESSEL, LAUFEND_SCHLUESSEL\]\)/, 'der Löschknopf löscht beide Schlüssel');
  assert.match(appQuelle, /'Meine Daten löschen'/, 'der Löschknopf ist beschriftet');
  const gespeichert = [...appQuelle.matchAll(/setItem\((\w+)/g)].map((m) => m[1]);
  assert.deepEqual([...new Set(gespeichert)].sort(), ['LAUFEND_SCHLUESSEL', 'TAG_SCHLUESSEL'], 'sonst wird nichts gespeichert');
  assert.match(elternSeite, /Meine Daten löschen/, 'die Eltern-Seite nennt den Weg zum Löschen');
});

test('Texte: Name ohne Ampel, nichts über Punkte, Rekord oder Ränge außer verneint, Eltern-Seite nennt den Speicher', () => {
  for (const [name, text] of [['index.html', indexSeite], ['eltern.html', elternSeite], ['README.md', readme], ['package.json', paket]]) {
    assert.doesNotMatch(text, /\bampel|🚦/i, `${name}: das Wort Ampel steht nicht im Namen`);
    assert.doesNotMatch(text, /geschafft|geschaffte|gefeiert|🏆|80 ?%|80-%/i, `${name}: keine Erfolgstexte, kein Prozentwert`);
  }
  assert.match(elternSeite, /keine Punkte, keinen Rekord, keine Ränge/, 'die Eltern-Seite sagt verneint, was die App nicht kennt');
  assert.match(elternSeite, /Tageszeile/, 'die Eltern-Seite nennt, was gespeichert wird');
  assert.doesNotMatch(elternSeite, /Wochenstatistik|Wochen-Rückblick/, 'keine Wochenübersicht');
});
