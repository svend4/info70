import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  GROESSE, KANTEN, felderAnzahl, zeileVon, spalteVon, feldName,
  setzeSymbol, setzeNorden, ladeZustand, leerePlan, anzahlGelegt, legende, planText, pruefeDaten, druckInhalt,
} from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/symbole.json', import.meta.url), 'utf8'));
const kopie = () => JSON.parse(JSON.stringify(daten));
const S = daten.symbole;

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

test('Feldrechnung an den vier Ecken: Zeile, Spalte und Name', () => {
  const ecken = [0, GROESSE - 1, felderAnzahl() - GROESSE, felderAnzahl() - 1];
  assert.deepEqual(ecken.map((i) => [zeileVon(i), spalteVon(i)]), [[0, 0], [0, 5], [5, 0], [5, 5]]);
  assert.equal(zeileVon(GROESSE), 1);
  assert.equal(spalteVon(GROESSE), 0);
  assert.equal(feldName(0), 'Reihe 1, Spalte 1');
  assert.equal(feldName(felderAnzahl() - 1), `Reihe ${GROESSE}, Spalte ${GROESSE}`);
});

test('setzeSymbol: legen, ersetzen, wieder wegnehmen – und das Original bleibt heil', () => {
  const leer = leerePlan();
  const a = setzeSymbol(leer, 3, 'tuer', S);
  assert.equal(a[3], 'tuer');
  assert.equal(anzahlGelegt(leer), 0, 'das Original wurde verändert');
  assert.equal(anzahlGelegt(a), 1);
  // anderes Symbol ersetzt
  const b = setzeSymbol(a, 3, 'fenster', S);
  assert.equal(b[3], 'fenster');
  assert.equal(anzahlGelegt(b), 1);
  // dasselbe Symbol nimmt weg
  const c = setzeSymbol(b, 3, 'fenster', S);
  assert.equal(c[3], undefined);
  assert.equal(anzahlGelegt(c), 0);
  // frühere Stände bleiben unverändert
  assert.equal(a[3], 'tuer');
  assert.equal(b[3], 'fenster');
});

test('setzeSymbol: ungültiges Feld oder unbekanntes Symbol lässt den Plan unverändert', () => {
  const plan = setzeSymbol(leerePlan(), 0, 'tuer', S);
  for (const feld of [-1, felderAnzahl(), 1.5, 'x', undefined]) {
    assert.equal(setzeSymbol(plan, feld, 'tisch', S), plan, `Feld ${feld} wurde angenommen`);
  }
  assert.equal(setzeSymbol(plan, 1, 'gibtesnicht', S), plan);
});

test('die Zeichenerklärung zeigt nur, was wirklich liegt – mit Anzahl', () => {
  let plan = leerePlan();
  assert.deepEqual(legende(plan, S), []);
  plan = setzeSymbol(plan, 0, 'tisch', S);
  plan = setzeSymbol(plan, 1, 'tisch', S);
  plan = setzeSymbol(plan, 7, 'tuer', S);
  const l = legende(plan, S);
  assert.deepEqual(l.map((s) => [s.id, s.anzahl]), [['tuer', 1], ['tisch', 2]], 'Reihenfolge folgt der Symbolliste');
  // Nach dem Wegnehmen verschwindet der Eintrag wieder
  plan = setzeSymbol(plan, 7, 'tuer', S);
  assert.deepEqual(legende(plan, S).map((s) => s.id), ['tisch']);
});

test('planText liest den Plan von oben links nach unten rechts vor', () => {
  let plan = leerePlan();
  assert.equal(planText(plan, S), 'Der Plan ist noch leer.');
  plan = setzeSymbol(plan, 8, 'tuer', S);
  plan = setzeSymbol(plan, 2, 'fenster', S);
  const text = planText(plan, S);
  assert.match(text, /Tür \(1×\)/);
  assert.match(text, /Fenster \(1×\)/);
  // Feld 2 kommt vor Feld 8, egal in welcher Reihenfolge gelegt wurde
  assert.ok(text.indexOf('Reihe 1, Spalte 3') < text.indexOf('Reihe 2, Spalte 3'), 'Reihenfolge stimmt nicht');
  // Ein unbekanntes Symbol im Plan taucht nicht auf, statt zu stören
  const kaputt = { ...plan, 5: 'gibtesnicht' };
  assert.ok(!planText(kaputt, S).includes('gibtesnicht'));
});

test('setzeNorden: Kante setzen gibt einen neuen Zustand, der alte bleibt', () => {
  const zustand = { plan: setzeSymbol(leerePlan(), 4, 'tisch', S), norden: 'oben' };
  for (const k of KANTEN) {
    const neu = setzeNorden(zustand, k.id);
    assert.equal(neu.norden, k.id);
    assert.equal(neu.plan[4], 'tisch', 'der Plan ging verloren');
  }
  assert.equal(zustand.norden, 'oben', 'das Original wurde verändert');
  assert.throws(() => setzeNorden(zustand, 'nordost'), /Unbekannte Kante/);
});

test('ladeZustand: gespeicherter Zustand kommt unverändert zurück, Müll wird verworfen', () => {
  const gut = { plan: { 0: 'tuer', 35: 'musik' }, norden: 'links' };
  assert.deepEqual(ladeZustand(JSON.stringify(gut), S), gut);

  const verfaelscht = JSON.stringify({
    plan: { 0: 'tuer', 36: 'tisch', '-1': 'tisch', 2: 'gibtesnicht', 3: 'fenster', x: 'tisch' },
    norden: 'nordost',
  });
  assert.deepEqual(ladeZustand(verfaelscht, S), { plan: { 0: 'tuer', 3: 'fenster' }, norden: 'oben' });
});

test('ladeZustand: nichts gespeichert oder kaputter Text ergibt einen leeren Plan', () => {
  const leer = { plan: {}, norden: 'oben' };
  assert.deepEqual(ladeZustand(null, S), leer);
  assert.deepEqual(ladeZustand('', S), leer);
  assert.deepEqual(ladeZustand('{kaputt', S), leer);
  assert.deepEqual(ladeZustand('null', S), leer);
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

test('Druckbogen: jedes Feld zeigt die Nummer seines Symbols, die Erklärung nennt dieselbe Nummer', () => {
  let plan = leerePlan();
  plan = setzeSymbol(plan, 0, 'fenster', S);
  plan = setzeSymbol(plan, 35, 'tuer', S);
  plan = setzeSymbol(plan, 6, 'tuer', S);
  const d = druckInhalt(plan, S, 'links');
  // In der Symbolliste stehen Tür und Fenster vorn: Tür = 1, Fenster = 2.
  assert.equal(d.felder.length, felderAnzahl());
  assert.equal(d.felder[0], 2);
  assert.equal(d.felder[1], '');
  assert.equal(d.felder[35], 1);
  assert.deepEqual(d.legende.map((l) => [l.nummer, l.anzahl]), [[1, 2], [2, 1]]);
  assert.equal(d.norden, 'Norden ist links.');
});

test('Ton: keine Bewertung des Plans', () => {
  const text = JSON.stringify(daten).toLowerCase();
  for (const wort of ['falsch', 'richtig', 'punkte', 'fehler', 'schön gemacht', 'besser']) {
    assert.ok(!text.includes(wort), `unerwünschtes Wort im Datensatz: ${wort}`);
  }
});
