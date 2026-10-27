import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pruefeFragen } from '../../../packages/quiz-kern/src/schema.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/fragen.json', import.meta.url), 'utf8'));
const RUNDE = 12; // muss zu app.mjs passen

test('Fragenbank: Schema gültig (quiz-kern)', () => {
  assert.deepEqual(pruefeFragen(daten, { mindestFragen: 14, mindestErklaerung: 80 }), []);
  assert.ok(daten.fragen.length >= 14, 'genug Vorrat für Abwechslung über mehrere Runden');
});

test('Kinder werden nicht bewertet: die Daten haben keine Ränge, die 12er-Runde bleibt möglich', () => {
  assert.ok(!('raenge' in daten), 'keine Rang- oder Punkteschwellen in den Daten');
  assert.ok(daten.fragen.length >= RUNDE, `Vorrat (${daten.fragen.length}) reicht für eine ${RUNDE}er-Runde`);
});

test('binäre Fragen: beide Antworten kommen vor', () => {
  const binaer = daten.fragen.filter((f) => f.typ === 'binaer');
  assert.ok(binaer.length >= 5, 'genug binäre Fragen');
  const antworten = binaer.map((f) => f.korrekt);
  assert.ok(antworten.includes('ja') && antworten.includes('nein'), 'sonst lernt das Kind "immer ja"');
  const wahl = daten.fragen.filter((f) => f.typ === 'wahl');
  assert.ok(wahl.length >= 5, 'genug Wahlfragen');
  // Die richtige Antwort darf nicht immer an derselben Stelle stehen: sonst
  // waere die Position eine Abkuerzung. quiz-kern mischt zwar zur Laufzeit,
  // aber die Datei selbst soll die Loesung nicht in einer Spalte stapeln.
  const stellen = new Set(wahl.map((f) => f.korrekt));
  assert.ok(stellen.size >= 2, `richtige Antwort steht immer an Stelle ${[...stellen]}`);
});

test('inhaltliche Abdeckung: alle Lebenszeichen kommen vor', () => {
  const kategorien = new Set(daten.fragen.map((f) => f.kategorie));
  for (const noetig of ['Lebenszeichen', 'Atmen', 'Trinken', 'Essen', 'Bewegen', 'Wachsen', 'Nachwuchs', 'Reagieren', 'Lebendig oder nicht']) {
    assert.ok(kategorien.has(noetig), `Kategorie fehlt: ${noetig}`);
  }
});

test('mindestens drei Fragen vergleichen alle drei: Mensch, Tier und Pflanze', () => {
  const dreier = daten.fragen.filter((f) => {
    const text = `${f.aussage ?? ''} ${f.frage ?? ''} ${(f.antworten ?? []).join(' ')} ${f.erklaerung}`;
    return /Mensch/.test(text) && /Tier/.test(text) && /Pflanze/.test(text);
  });
  assert.ok(dreier.length >= 3, `nur ${dreier.length} Fragen vergleichen alle drei`);
});

test('die typischen Verwechslungen werden ausdrücklich aufgelöst', () => {
  const alles = JSON.stringify(daten.fragen);
  // Atmung ist nicht Fotosynthese: Pflanzen atmen auch nachts
  const atem = daten.fragen.find((f) => f.id === 'm02');
  assert.equal(atem.korrekt, 'nein');
  assert.match(atem.erklaerung, /Tag und Nacht/);
  // Reagieren ohne Gehirn - und ohne Vermenschlichung
  const reagieren = daten.fragen.find((f) => f.id === 'm12');
  assert.equal(reagieren.korrekt, 'nein');
  assert.match(reagieren.erklaerung, /kein Gehirn|Gehirn und Gefühle/);
  // Leitungsbahnen als kindgerechtes Bild
  assert.match(alles, /Trinkhalm/, 'Metapher für die Leitungsbahnen fehlt');
  // "bewegt sich" allein ist kein Lebenszeichen
  assert.match(daten.fragen.find((f) => f.id === 'm11').erklaerung, /Auto/);
});

test('Ton: keine Beschämung, keine Angstmache', () => {
  const alles = JSON.stringify(daten).toLowerCase();
  for (const wort of ['dumm', 'blöd', 'faul', 'falsch gemacht', 'schäm', 'versagt', 'töten', 'sterben musst']) {
    assert.equal(alles.includes(wort), false, `unpassendes Wort: ${wort}`);
  }
});

test('Erklärungen sind eigenständige Sätze mit Substanz', () => {
  for (const f of daten.fragen) {
    assert.ok(f.erklaerung.length >= 120, `${f.id}: Erklärung zu knapp`);
    assert.match(f.erklaerung, /[.!?]$/, `${f.id}: Erklärung endet ohne Satzzeichen`);
  }
  const ids = daten.fragen.map((f) => f.id);
  assert.deepEqual(ids, [...ids].sort(), 'ids in Reihenfolge');
});

test('App-Code und Eltern-Seite: keine Wertung, kein Speicher, keine Karte „Meine Daten löschen“', async () => {
  const code = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');
  const eltern = await readFile(new URL('../eltern.html', import.meta.url), 'utf8');
  assert.doesNotMatch(code, /ergebnisSatz|raenge|Geschafft/, 'kein Ergebnissatz, keine Ränge, kein „Geschafft“');
  assert.doesNotMatch(code, /setItem|datenKarte|daten-karte/, 'die App speichert nichts und hat keine Löschkarte');
  assert.match(code, /^\s*rekordSchluessel: '[^']+',\s*$/m, 'der alte Schlüssel steht nur für die einmalige Entfernung beim Start');
  assert.doesNotMatch(eltern, /Meine Daten löschen|löschbar|löschen/, 'ohne Speicher kein Löschknopf');
});
