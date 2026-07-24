import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pruefeFragen } from '../../../packages/quiz-kern/src/schema.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/fragen.json', import.meta.url), 'utf8'));

test('Fragenbank: Schema gültig (quiz-kern)', () => {
  assert.deepEqual(pruefeFragen(daten, { mindestFragen: 16, mindestErklaerung: 80 }), []);
});

test('Ränge beginnen bei 0 und sind in einer 12er-Runde erreichbar', () => {
  const raenge = daten.raenge;
  assert.equal(raenge[0].ab, 0);
  for (let i = 1; i < raenge.length; i++) assert.ok(raenge[i].ab > raenge[i - 1].ab, 'aufsteigend');
  assert.ok(raenge.at(-1).ab <= 12, 'höchster Rang muss in einer Runde erreichbar sein');
});

test('binäre Fragen: beide Antworten kommen vor, Wahlantworten stehen nicht immer gleich', () => {
  const binaer = daten.fragen.filter((f) => f.typ === 'binaer');
  assert.ok(binaer.length >= 6, 'genug binäre Fragen');
  const antworten = binaer.map((f) => f.korrekt);
  assert.ok(antworten.includes('ja') && antworten.includes('nein'), 'sonst lernt das Kind "immer ja"');
  const wahl = daten.fragen.filter((f) => f.typ === 'wahl');
  assert.ok(wahl.length >= 6, 'genug Wahlfragen');
  const stellen = new Set(wahl.map((f) => f.korrekt));
  assert.ok(stellen.size >= 2, `richtige Antwort steht immer an Stelle ${[...stellen]}`);
});

test('inhaltliche Abdeckung: die Organsysteme des Katalogs kommen vor', () => {
  const kategorien = new Set(daten.fragen.map((f) => f.kategorie));
  for (const noetig of ['Herz', 'Atmen', 'Verdauung', 'Skelett', 'Muskeln', 'Gehirn', 'Haut', 'Wachsen', 'Gut für den Körper']) {
    assert.ok(kategorien.has(noetig), `Kategorie fehlt: ${noetig}`);
  }
});

test('Zahlenangaben sind die belegten und werden nicht stillschweigend verändert', () => {
  const f = (id) => daten.fragen.find((x) => x.id === id);
  // Herz etwa faustgroß (Katalogvorgabe) und schlägt lebenslang ohne Pause
  assert.equal(f('k01').korrekt, 'ja');
  assert.match(f('k01').aussage, /Faust/);
  assert.equal(f('k03').korrekt, 'nein');
  // Ruhepuls Kind 80-100, Skelett 206, Babys mehr als Erwachsene, Schlaf 9-11
  assert.match(f('k02').antworten[f('k02').korrekt], /80.*100/);
  assert.match(f('k09').antworten[f('k09').korrekt], /206/);
  assert.equal(f('k10').korrekt, 'nein');
  assert.match(f('k10').erklaerung, /300/);
  assert.match(f('k13').antworten[f('k13').korrekt], /9 bis 11/);
  // Dünndarm fünf bis sechs Meter (GDD/README nennen genau diesen Wert)
  assert.equal(f('k08').korrekt, 'ja');
  assert.match(f('k08').erklaerung, /fünf bis sechs Meter/);
});

test('die typischen Irrtümer werden ausdrücklich aufgelöst', () => {
  const f = (id) => daten.fragen.find((x) => x.id === id);
  // Die Lunge hat keinen eigenen Muskel – das Zwerchfell bewegt sie
  assert.match(f('k06').antworten[f('k06').korrekt], /Zwerchfell/);
  assert.match(f('k06').erklaerung, /kein(en)? eigenen Muskel/);
  // Muskeln können nur ziehen, nie schieben
  assert.match(f('k11').erklaerung, /nur ziehen/);
  // Verdauung beginnt im Mund, nicht erst im Magen
  assert.match(f('k07').antworten[f('k07').korrekt], /Mund/);
  // Milchzähne sind nicht egal
  assert.equal(f('k18').korrekt, 'nein');
  assert.match(f('k18').erklaerung, /Platz/);
  // „Wachstumsschmerzen“: Wachsen an der Wachstumsfuge ist nicht spürbar.
  // Die Erklärung darf den Volksglauben nicht bestätigen, sondern muss ihn
  // ausdrücklich zurückweisen.
  assert.match(f('k17').erklaerung, /kommt nicht vom Wachsen/);
  assert.ok(!/spürt man das sogar/.test(f('k17').erklaerung));
});

test('Ton: Gesundheitsbotschaft ohne Beschämung, Angst oder Körperbewertung', () => {
  const text = JSON.stringify(daten).toLowerCase();
  for (const wort of ['dick', 'übergewicht', 'abnehmen', 'diät', 'kalorien', 'dumm', 'faul', 'schäm', 'krank machst', 'stirbst', 'zu fett']) {
    assert.ok(!text.includes(wort), `unerwünschtes Wort im Datensatz: ${wort}`);
  }
  // keine Diagnosen und keine Medikamenten-Tipps
  for (const wort of ['diagnose', 'medikament', 'tablette', 'therapie']) {
    assert.ok(!text.includes(wort), `App darf nicht medizinisch beraten: ${wort}`);
  }
});

test('Erklärungen sind eigenständige Sätze mit Substanz', () => {
  for (const f of daten.fragen) {
    assert.ok(f.erklaerung.length >= 120, `${f.id}: Erklärung zu knapp (${f.erklaerung.length})`);
    assert.match(f.erklaerung, /[.!?]$/, `${f.id}: Erklärung endet ohne Satzzeichen`);
  }
  const ids = daten.fragen.map((f) => f.id);
  assert.deepEqual(ids, [...ids].sort(), 'ids in Reihenfolge');
});
