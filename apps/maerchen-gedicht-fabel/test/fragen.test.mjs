import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pruefeFragen } from '../../../packages/quiz-kern/src/schema.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/fragen.json', import.meta.url), 'utf8'));
const f = (id) => daten.fragen.find((x) => x.id === id);
const GATTUNGEN = ['Märchen', 'Erzählung', 'Gedicht', 'Fabel', 'Rätsel', 'Sprichwort', 'Zungenbrecher'];

test('Fragenbank: Schema gültig (quiz-kern)', () => {
  assert.deepEqual(pruefeFragen(daten, { mindestFragen: 16, mindestErklaerung: 80 }), []);
});

test('Kinder werden nicht bewertet: die Daten haben keine Ränge, die 12er-Runde bleibt möglich', () => {
  assert.ok(!('raenge' in daten), 'keine Rang- oder Punkteschwellen in den Daten');
  assert.ok(daten.fragen.length >= 12, 'genug Fragen für eine 12er-Runde');
});

test('App-Code und Eltern-Seite: keine Wertung, kein Speicher, keine Karte „Meine Daten löschen“', async () => {
  const code = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');
  const eltern = await readFile(new URL('../eltern.html', import.meta.url), 'utf8');
  assert.doesNotMatch(code, /ergebnisSatz|raenge|Geschafft/, 'kein Ergebnissatz, keine Ränge, kein „Geschafft“');
  assert.doesNotMatch(code, /setItem|datenKarte|daten-karte/, 'die App speichert nichts und hat keine Löschkarte');
  assert.match(code, /^\s*rekordSchluessel: 'gattung\.rekord',\s*$/m, 'der alte Schlüssel wird nur über die Migrationszeile genannt');
  assert.doesNotMatch(eltern, /Meine Daten löschen|löschbar per Knopf|in der App löschen/, 'ohne Speicher kein Löschknopf');
});

test('alle sieben Gattungen des Katalogs kommen vor', () => {
  const kategorien = new Set(daten.fragen.map((x) => x.kategorie));
  for (const g of GATTUNGEN) assert.ok(kategorien.has(g), `Gattung fehlt: ${g}`);
  assert.equal(kategorien.size, GATTUNGEN.length, 'keine Kategorien außerhalb der sieben Gattungen');
});

test('zu jeder Gattung gibt es mindestens einen echten Beispieltext', () => {
  const mitText = daten.fragen.filter((x) => x.typ === 'wahl');
  const abgedeckt = new Set(mitText.map((x) => x.kategorie));
  for (const g of GATTUNGEN) assert.ok(abgedeckt.has(g), `kein Beispieltext für: ${g}`);
  for (const x of mitText) {
    // Der Beispieltext steht in Anführungszeichen vor der Frage.
    // Untergrenze bewusst niedrig: ein Sprichwort ist von Natur aus kurz.
    assert.match(x.frage, /^„[^]{20,}“ Was ist das\?$/, `${x.id}: Beispieltext fehlt oder Frage falsch gebaut`);
    // Die richtige Antwort nennt die Gattung der Kategorie
    assert.ok(x.antworten[x.korrekt].includes(x.kategorie), `${x.id}: richtige Antwort passt nicht zur Kategorie`);
    // Die falschen Antworten nennen andere Gattungen – nie dieselbe
    x.antworten.forEach((a, i) => {
      if (i !== x.korrekt) assert.ok(!a.includes(x.kategorie), `${x.id}: Ablenker nennt dieselbe Gattung`);
    });
  }
});

test('binäre Fragen: beide Antworten kommen vor, Wahlantworten stehen nicht immer gleich', () => {
  const binaer = daten.fragen.filter((x) => x.typ === 'binaer');
  assert.ok(binaer.length >= 6);
  const antworten = binaer.map((x) => x.korrekt);
  assert.ok(antworten.includes('ja') && antworten.includes('nein'));
  const stellen = new Set(daten.fragen.filter((x) => x.typ === 'wahl').map((x) => x.korrekt));
  assert.ok(stellen.size >= 2, `richtige Antwort steht immer an Stelle ${[...stellen]}`);
});

test('die vier klassischen Verwechslungen sind aufgelöst', () => {
  // 1. Ein Gedicht muss sich NICHT reimen – dafür gibt es auch ein reimloses Beispiel
  assert.equal(f('g11').korrekt, 'nein');
  assert.equal(f('g05').kategorie, 'Gedicht');
  assert.ok(!/reim/i.test(f('g05').frage), 'g05 soll ein Gedicht ohne Reim zeigen');
  assert.match(f('g05').erklaerung, /ohne Reim|nichts reimt/);
  // 2. Nicht jede Tiergeschichte ist eine Fabel
  assert.equal(f('g18').korrekt, 'nein');
  assert.equal(f('g09').kategorie, 'Erzählung');
  assert.match(f('g09').erklaerung, /keine Fabel/);
  // 3. Zur Fabel gehört die Lehre
  assert.equal(f('g12').korrekt, 'ja');
  assert.match(f('g03').erklaerung, /Lehre/);
  // 4. Märchen vs. Erzählung: das Wunder entscheidet, nicht das sprechende Tier
  assert.equal(f('g13').korrekt, 'nein');
  assert.match(f('g10').erklaerung, /Lehre/);
  assert.match(f('g10').erklaerung, /Zauber|Wunder|Gold/);
});

test('Herkunft der Texte ist deklariert und die Sprichwörter sind als alt gekennzeichnet', () => {
  assert.match(daten.hinweis, /Eigenproduktion/);
  assert.match(daten.hinweis, /gemeinfrei/);
  // Das Sprichwort-Beispiel erklärt, dass Sprichwörter keinen bekannten Verfasser haben
  assert.match(f('g07').erklaerung, /niemand weiß mehr, wer sie erfunden hat|sehr alt/);
});

test('Erklärungen sind eigenständige Sätze mit Substanz', () => {
  for (const x of daten.fragen) {
    assert.ok(x.erklaerung.length >= 150, `${x.id}: Erklärung zu knapp (${x.erklaerung.length})`);
    assert.match(x.erklaerung, /[.!?]$/, `${x.id}: Erklärung endet ohne Satzzeichen`);
  }
  const ids = daten.fragen.map((x) => x.id);
  assert.deepEqual(ids, [...ids].sort(), 'ids in Reihenfolge');
});
