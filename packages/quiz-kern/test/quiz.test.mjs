import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const quelle = await readFile(new URL('../src/quiz.mjs', import.meta.url), 'utf8');
// Kommentare raus: sie erwähnen localStorage.clear() ausdrücklich als das,
// was hier NICHT passieren soll – ein Test darf daran nicht hängenbleiben.
const code = quelle.replace(/^\s*\/\/.*$/gm, '');

test('elternSeite: der Eltern-Link ist abschaltbar – ein Fachkräfte-Quiz hat keine eltern.html', () => {
  // Der Fuß entsteht im DOM; in Node steht kein DOM, geprüft wird deshalb die
  // Quelle. Entscheidend ist, dass der Link an der Option hängt statt fest
  // verdrahtet zu sein – sonst zeigt ein Quiz ohne eltern.html ins Nichts.
  assert.match(quelle, /elternSeite = true/, 'Standard bleibt: Eltern-Link an');
  assert.match(quelle, /elternSeite \? el\('a', \{ href: 'eltern\.html' \}/, 'Link hängt an der Option');
  assert.match(quelle, /\.filter\(Boolean\)/, 'null-Knoten müssen gefiltert werden – el() tut das nicht');
});

test('der Fuß trägt immer Impressum und den Datenschutz-Hinweis', () => {
  assert.match(quelle, /impressum\.html/, 'Impressum ist Pflicht (docs/02 §5)');
  assert.match(quelle, /Daten bleiben auf diesem Gerät/);
  assert.match(quelle, /Werbefrei/);
});

test('kein Löschknopf: der Engine hat keine Datenkarte mehr; nichts wird gespeichert, also gibt es nichts zu löschen', () => {
  // Die Karte mit dem Datenhinweis und der Knopf „Meine Daten löschen“ sind entfernt (Entscheidung Max).
  assert.doesNotMatch(code, /loescheDaten|datenLoeschen|datenHinweis|daten-karte/, 'keine Datenkarte im Motor');
  // Der frühere Schlüssel wird beim Start einmal entfernt (siehe unten), nie mehr.
});

test('Staffel-Endbildschirm: ohne Zahl je Kind, ohne Sieger, ohne Punkte', () => {
  const anfang = code.indexOf('function staffelErgebnis()');
  const ende = code.indexOf('start();', anfang);
  assert.ok(anfang > 0 && ende > anfang, 'Staffel-Endbildschirm gefunden');
  const ergebnis = code.slice(anfang, ende);
  assert.match(ergebnis, /t\.staffelFertigSatz/, 'neutraler Satz');
  assert.match(ergebnis, /Zusammen seid ihr stark/, 'der Satz bleibt');
  assert.doesNotMatch(ergebnis, /punkt|rekord|rang|richtig|jüngere|ältere|Team:|gewinnt|liegt vorn|unentschieden|fragen\.length|\bvon\b/i);
});

test('Staffel: die Antworten werden nicht mehr je Kind gesammelt', () => {
  assert.doesNotMatch(code, /staffelEintraege|staffelWertung|staffelSatz/);
});

test('Einzel-Modus: kein Rekord, keine Punkte, keine Ränge, nichts wird gespeichert', () => {
  // Einzel-Abschnitt: von start() bis zum Duett-Abschnitt. Duett und Staffel sind bis zur Entscheidung unverändert.
  const anfang = code.indexOf('function start()');
  const ende = code.indexOf('function starteDuett()');
  assert.ok(anfang > 0 && ende > anfang, 'Einzel-Abschnitt gefunden');
  const einzel = code.slice(anfang, ende);
  assert.doesNotMatch(einzel, /\brekord\b|\bpunkt|\brang\b|\braenge\b|localStorage\.setItem/i);
});

test('Endbildschirm: Geschafft, ohne Zahl, ohne richtig, ohne Stern, Pokal oder Rang', () => {
  const anfang = code.indexOf('function ergebnis()');
  const ende = code.indexOf('function starteDuett()');
  const ergebnis = code.slice(anfang, ende);
  assert.match(ergebnis, /t\.fertigTitel/, 'Titel ist Geschafft!');
  assert.doesNotMatch(ergebnis, /fragen\.length|punkt|rekord|rang|richtig|⭐|🏆|🥇|🎖|🏅|🌟/i);
});

test('Duett-Endbildschirm: ohne Punkte, Pokal, „liegt vorn“, Unentschieden und Zahlen je Person', () => {
  const anfang = code.indexOf('function duettErgebnis()');
  const ende = code.indexOf('const staffelName');
  assert.ok(anfang > 0 && ende > anfang, 'Duett-Endbildschirm gefunden');
  const duett = code.slice(anfang, ende);
  assert.match(duett, /t\.fertigTitel/, 'Titel ist Geschafft!');
  assert.doesNotMatch(duett, /punkt|rekord|rang|richtig|liegt vorn|unentschieden|🏆|⭐|✅|⬜|fragen\.length/i);
});

test('Duett: Antworten werden nicht mehr je Person gesammelt', () => {
  assert.doesNotMatch(code, /antwortenA|antwortenB|duettWertung|duettSatz/);
});

test('Start: der frühere Schlüssel wird einmal entfernt, nie clear()', () => {
  assert.match(code, /localStorage\.removeItem\(rekordSchluessel\)/);
  assert.ok(!/localStorage\.clear\(/.test(code));
});
