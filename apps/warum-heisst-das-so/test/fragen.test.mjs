import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pruefeFragen } from '../../../packages/quiz-kern/src/schema.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/fragen.json', import.meta.url), 'utf8'));
const f = (id) => daten.fragen.find((x) => x.id === id);

test('Fragenbank: Schema gültig (quiz-kern)', () => {
  assert.deepEqual(pruefeFragen(daten, { mindestFragen: 16, mindestErklaerung: 80 }), []);
});

test('Ränge beginnen bei 0 und sind in einer 12er-Runde erreichbar', () => {
  const r = daten.raenge;
  assert.equal(r[0].ab, 0);
  for (let i = 1; i < r.length; i++) assert.ok(r[i].ab > r[i - 1].ab, 'aufsteigend');
  assert.ok(r.at(-1).ab <= 12);
});

test('beide Sorten Namen kommen vor – sonst lernt das Kind, dem Namen blind zu glauben', () => {
  const stimmt = daten.fragen.filter((x) => x.art === 'stimmt');
  const irre = daten.fragen.filter((x) => x.art === 'irrefuehrend');
  assert.equal(stimmt.length + irre.length, daten.fragen.length, 'jede Frage braucht eine art');
  assert.ok(stimmt.length >= 6, 'zu wenige Namen, die halten was sie versprechen');
  assert.ok(irre.length >= 6, 'zu wenige irreführende Namen – gerade die sind der Lernstoff');
  for (const x of daten.fragen) assert.ok(['stimmt', 'irrefuehrend'].includes(x.art), `${x.id}: art unbekannt`);
  assert.match(daten.hinweis, /blind zu glauben/);
});

test('jeder irreführende Name wird in seiner Erklärung ausdrücklich richtiggestellt', () => {
  for (const x of daten.fragen.filter((q) => q.art === 'irrefuehrend')) {
    assert.match(
      x.erklaerung,
      /nicht|kein|keine|Aberglaube|täuscht|in die Irre/,
      `${x.id}: die Erklärung stellt nichts richtig`,
    );
  }
  // und die Kategorie „Namen, die täuschen“ enthält ausschließlich solche
  for (const x of daten.fragen.filter((q) => q.kategorie === 'Namen, die täuschen')) {
    assert.equal(x.art, 'irrefuehrend', `${x.id}: steht in der falschen Kategorie`);
  }
});

test('die sechs klassischen Irrtümer sind einzeln festgenagelt', () => {
  // Tausendfüßer: fast keiner hat tausend Beine
  assert.equal(f('w02').korrekt, 'nein');
  assert.match(f('w02').erklaerung, /dreißig und zweihundert/);
  // Maulwurf: von "Erde werfen", nicht vom Maul
  assert.match(f('w03').antworten[f('w03').korrekt], /Schaufelhänden/);
  assert.match(f('w03').erklaerung, /Erdwerfer/);
  assert.match(f('w03').erklaerung, /nie mit dem Maul/);
  // Ohrwurm: kriecht nicht ins Ohr
  assert.equal(f('w04').korrekt, 'nein');
  assert.match(f('w04').erklaerung, /Aberglaube/);
  // Meerschweinchen: kein Schwein, nicht aus dem Meer
  assert.match(f('w05').antworten[f('w05').korrekt], /über das Meer|übers Meer/);
  assert.match(f('w05').erklaerung, /Nagetiere/);
  // Flusspferd: nächste Verwandte sind Wale
  assert.equal(f('w06').korrekt, 'nein');
  assert.match(f('w06').erklaerung, /Wale/);
  // Fledermaus: keine Maus, einziges wirklich fliegendes Säugetier
  assert.equal(f('w07').korrekt, 'nein');
  assert.match(f('w07').erklaerung, /flattern/);
});

test('die Schlussregel steht ausdrücklich in den Daten', () => {
  // Ohne diese Frage wäre die App eine Sammlung von Anekdoten
  assert.equal(f('w17').korrekt, 'nein');
  assert.match(f('w17').erklaerung, /guter Hinweis, aber kein Beweis/);
});

test('Sicherheit: giftige Pflanzen werden als giftig benannt', () => {
  assert.match(f('w10').erklaerung, /giftig/);
  assert.match(f('w10').erklaerung, /nicht|auf keinen Fall/);
});

test('binäre Fragen: beide Antworten kommen vor, Wahlantworten stehen nicht immer gleich', () => {
  const binaer = daten.fragen.filter((x) => x.typ === 'binaer');
  assert.ok(binaer.length >= 6);
  const antworten = binaer.map((x) => x.korrekt);
  assert.ok(antworten.includes('ja') && antworten.includes('nein'));
  const stellen = new Set(daten.fragen.filter((x) => x.typ === 'wahl').map((x) => x.korrekt));
  assert.ok(stellen.size >= 2, `richtige Antwort steht immer an Stelle ${[...stellen]}`);
});

test('Erklärungen sind eigenständige Sätze mit Substanz', () => {
  for (const x of daten.fragen) {
    assert.ok(x.erklaerung.length >= 150, `${x.id}: Erklärung zu knapp (${x.erklaerung.length})`);
    assert.match(x.erklaerung, /[.!?]$/, `${x.id}: Erklärung endet ohne Satzzeichen`);
  }
  const ids = daten.fragen.map((x) => x.id);
  assert.deepEqual(ids, [...ids].sort(), 'ids in Reihenfolge');
});
