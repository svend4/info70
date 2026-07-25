import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  GROESSE, KANTEN, felderAnzahl, zeileVon, spalteVon, feldName,
  setzeSymbol, leerePlan, anzahlGelegt, legende, planText, pruefeDaten,
} from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/symbole.json', import.meta.url), 'utf8'));
const kopie = () => JSON.parse(JSON.stringify(daten));

test('Symboldaten sind gültig', () => {
  assert.deepEqual(pruefeDaten(daten), []);
  assert.ok(daten.symbole.length >= 8);
  assert.equal(felderAnzahl(), GROESSE * GROESSE);
  assert.equal(KANTEN.length, 4);
});

test('jedes Zeichen ist nur einmal vergeben – sonst wäre der Plan mehrdeutig', () => {
  const emojis = daten.symbole.map((s) => s.emoji);
  assert.equal(new Set(emojis).size, emojis.length);
  const doppelt = kopie();
  doppelt.symbole[1].emoji = doppelt.symbole[0].emoji;
  assert.ok(pruefeDaten(doppelt).some((f) => /wird schon für etwas anderes benutzt/.test(f)));
});

test('Feldrechnung: Zeile, Spalte und Name', () => {
  assert.equal(zeileVon(0), 0);
  assert.equal(spalteVon(0), 0);
  assert.equal(zeileVon(GROESSE), 1);
  assert.equal(spalteVon(GROESSE), 0);
  assert.equal(zeileVon(felderAnzahl() - 1), GROESSE - 1);
  assert.equal(spalteVon(felderAnzahl() - 1), GROESSE - 1);
  assert.equal(feldName(0), 'Reihe 1, Platz 1');
  assert.equal(feldName(felderAnzahl() - 1), `Reihe ${GROESSE}, Platz ${GROESSE}`);
});

test('setzeSymbol: legen, ersetzen, wieder wegnehmen – und das Original bleibt heil', () => {
  const leer = leerePlan();
  const a = setzeSymbol(leer, 3, 'tuer');
  assert.equal(a[3], 'tuer');
  assert.equal(anzahlGelegt(leer), 0, 'das Original wurde verändert');
  assert.equal(anzahlGelegt(a), 1);
  // anderes Symbol ersetzt
  const b = setzeSymbol(a, 3, 'fenster');
  assert.equal(b[3], 'fenster');
  assert.equal(anzahlGelegt(b), 1);
  // dasselbe Symbol nimmt weg
  const c = setzeSymbol(b, 3, 'fenster');
  assert.equal(c[3], undefined);
  assert.equal(anzahlGelegt(c), 0);
  // frühere Stände bleiben unverändert
  assert.equal(a[3], 'tuer');
  assert.equal(b[3], 'fenster');
});

test('die Zeichenerklärung zeigt nur, was wirklich liegt – mit Anzahl', () => {
  let plan = leerePlan();
  assert.deepEqual(legende(plan, daten.symbole), []);
  plan = setzeSymbol(plan, 0, 'tisch');
  plan = setzeSymbol(plan, 1, 'tisch');
  plan = setzeSymbol(plan, 7, 'tuer');
  const l = legende(plan, daten.symbole);
  assert.deepEqual(l.map((s) => [s.id, s.anzahl]), [['tuer', 1], ['tisch', 2]], 'Reihenfolge folgt der Symbolliste');
  // Nach dem Wegnehmen verschwindet der Eintrag wieder
  plan = setzeSymbol(plan, 7, 'tuer');
  assert.deepEqual(legende(plan, daten.symbole).map((s) => s.id), ['tisch']);
});

test('planText liest den Plan von oben links nach unten rechts vor', () => {
  let plan = leerePlan();
  assert.equal(planText(plan, daten.symbole), 'Der Plan ist noch leer.');
  plan = setzeSymbol(plan, 8, 'tuer');
  plan = setzeSymbol(plan, 2, 'fenster');
  const text = planText(plan, daten.symbole);
  assert.match(text, /Tür \(1×\)/);
  assert.match(text, /Fenster \(1×\)/);
  // Feld 2 kommt vor Feld 8, egal in welcher Reihenfolge gelegt wurde
  assert.ok(text.indexOf('Reihe 1, Platz 3') < text.indexOf('Reihe 2, Platz 3'), 'Reihenfolge stimmt nicht');
  // Ein unbekanntes Symbol im Plan taucht nicht auf, statt zu stören
  const kaputt = { ...plan, 5: 'gibtesnicht' };
  assert.ok(!planText(kaputt, daten.symbole).includes('gibtesnicht'));
});

test('Gesprächsimpulse und Schritte führen zum echten Raum', () => {
  assert.ok(daten.fragen.length >= 4);
  for (const f of daten.fragen) assert.ok(f.trim().endsWith('?'), `kein Fragezeichen: ${f}`);
  assert.ok(daten.schritte.length >= 4);
  // Der erste Schritt schickt in den Raum, nicht auf den Bildschirm
  assert.match(daten.schritte[0], /echten Raum/);
  // Die Himmelsrichtung wird über die Sonne bestimmt, nicht geraten
  assert.match(daten.schritte.join(' '), /Sonne aufgeht/);
  const ohneFrage = kopie();
  ohneFrage.fragen[0] = 'Das war es.';
  assert.ok(pruefeDaten(ohneFrage).some((f) => /soll eine Frage sein/.test(f)));
});

test('Ton: keine Bewertung des Plans', () => {
  const text = JSON.stringify(daten).toLowerCase();
  for (const wort of ['falsch', 'richtig', 'punkte', 'fehler', 'schön gemacht', 'besser']) {
    assert.ok(!text.includes(wort), `unerwünschtes Wort im Datensatz: ${wort}`);
  }
});
