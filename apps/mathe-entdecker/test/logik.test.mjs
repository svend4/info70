import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { erstelleReihe, FOLGEN, folgeZu, merkmal, mitQuellen, neueAufgabe, pruefeMatheFragen, pruefeReihe, THEMEN } from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/fragen.json', import.meta.url), 'utf8'));
const groesse = (...werte) => werte.map((groesse) => ({ groesse, farbe: 2 }));
const farbe = (...werte) => werte.map((farbe) => ({ groesse: 2, farbe }));

test('erstelleReihe: die Reihe ist nach der Regel sortiert, die freie Stelle liegt an der Stelle der Zufallsreihe', () => {
  const aufgabe = erstelleReihe(groesse(3, 1, 2), 'groesse', [4]);
  // Länge 3: 4 mod 3 = Stelle 1 der sortierten Reihe (Größen 1, 2, 3).
  assert.equal(aufgabe.luecke, 1);
  assert.deepEqual(aufgabe.reihe.map((o) => (o === null ? null : o.groesse)), [1, null, 3]);
  assert.equal(aufgabe.richtig.groesse, 2);
  assert.equal(aufgabe.regel, 'groesse');
});

test('erstelleReihe: nach der Regel farbe wird nach der Helligkeit sortiert, die Lücke bleibt an der Zufallsstelle', () => {
  const aufgabe = erstelleReihe(farbe(4, 0, 2, 1), 'farbe', [0]);
  assert.equal(aufgabe.luecke, 0);
  assert.equal(aufgabe.richtig.farbe, 0);
  assert.deepEqual(aufgabe.reihe.map((o) => (o === null ? null : o.farbe)), [null, 1, 2, 4]);
});

test('erstelleReihe: gleiche Zufallsreihe ergibt die gleiche Aufgabe', () => {
  const objekte = groesse(0, 4, 2);
  assert.deepEqual(erstelleReihe(objekte, 'groesse', [7, 1]), erstelleReihe(objekte, 'groesse', [7, 1]));
  assert.notDeepEqual(erstelleReihe(objekte, 'groesse', [0]).luecke, erstelleReihe(objekte, 'groesse', [1]).luecke);
});

test('pruefeReihe: eine Reihe mit steigender Rangzahl ist in Ordnung, eine verdrehte Stelle nennt ihren Index', () => {
  assert.deepEqual(pruefeReihe(groesse(0, 2, 4), 'groesse'), { ok: true, fehlerIndex: null });
  assert.deepEqual(pruefeReihe(groesse(2, 0, 4), 'groesse'), { ok: false, fehlerIndex: 1 });
  assert.deepEqual(pruefeReihe(farbe(1, 3, 2), 'farbe'), { ok: false, fehlerIndex: 2 });
});

test('pruefeReihe: gleiche Rangzahl hintereinander zählt nicht als hinter der vorigen Stelle', () => {
  assert.deepEqual(pruefeReihe(groesse(1, 3, 3), 'groesse'), { ok: false, fehlerIndex: 2 });
});

test('pruefeReihe: Länge außerhalb von 3 bis 5 Objekten ist ein Fehler an Stelle 0', () => {
  assert.deepEqual(pruefeReihe(groesse(0, 1), 'groesse'), { ok: false, fehlerIndex: 0 });
  assert.deepEqual(pruefeReihe(groesse(0, 1, 2, 3, 4, 4), 'groesse'), { ok: false, fehlerIndex: 0 });
});

test('neueAufgabe: gleiche Zahlenreihe, gleiche Aufgabe; 3 bis 5 Objekte; die feste Folge deckt Regeln, Anzahlen und Lagen ab', () => {
  for (const zufall of [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [7, 2, 9, 0, 1, 3, 4, 5, 6, 8], [4, 0, 5, 9, 2, 1, 3, 8, 6, 7]]) {
    const a = neueAufgabe(zufall);
    assert.deepEqual(a, neueAufgabe(zufall));
    assert.ok(a.objekte.length >= 3 && a.objekte.length <= 5, `Länge ${a.objekte.length}`);
    const werte = a.objekte.map((o) => merkmal(o, a.regel));
    assert.equal(new Set(werte).size, werte.length, 'Rangzahlen müssen verschieden sein');
    assert.ok(a.luecke >= 0 && a.luecke < a.reihe.length);
    assert.equal(a.reihe[a.luecke], null);
    assert.equal(a.reihe.length, a.objekte.length);
  }
  const erste = neueAufgabe([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  assert.equal(erste.regel, 'groesse');
  assert.equal(erste.objekte.length, 4);
  assert.equal(erste.luecke, 2);
  assert.equal(erste.richtig.groesse, 2);
  // Die feste Folge: jede Nummer hat eine Anordnung von 0 bis 9, sie wiederholt sich nach 12 Aufgaben (ohne Zufall).
  const aufgaben = FOLGEN.map((_, n) => neueAufgabe(folgeZu(n)));
  for (let n = 0; n < 2 * FOLGEN.length; n++) {
    assert.equal(folgeZu(n).slice().sort((a, b) => a - b).join(), '0,1,2,3,4,5,6,7,8,9', `Folge ${n} ist keine Anordnung von 0 bis 9`);
    assert.deepEqual(folgeZu(n), folgeZu(n + FOLGEN.length));
  }
  assert.deepEqual(new Set(aufgaben.map((a) => a.regel)), new Set(['groesse', 'farbe']));
  assert.deepEqual(new Set(aufgaben.map((a) => a.objekte.length)), new Set([3, 4, 5]));
  assert.deepEqual(new Set(aufgaben.map((a) => a.luecke)), new Set([0, 1, 2, 3, 4]));
});

test('pruefeMatheFragen: die Fragenbank ist vollständig (alle Themen, Seitenangabe, Eigenentwurf, Vorrat)', () => {
  assert.deepEqual(pruefeMatheFragen(mitQuellen(daten)), []);
  assert.ok(THEMEN.includes('linien') && THEMEN.includes('wochentage') && THEMEN.includes('jahreszeiten'));
});

test('pruefeMatheFragen: fehlen die Themen linien, wochentage oder jahreszeiten, ist das je Thema ein Fehler', () => {
  for (const thema of ['linien', 'wochentage', 'jahreszeiten']) {
    const ohne = mitQuellen(daten).filter((f) => f.thema !== thema);
    assert.ok(pruefeMatheFragen(ohne).includes(`Thema ohne Frage: ${thema}`), `Fehler für ${thema} fehlt`);
  }
});

test('pruefeMatheFragen: eine Frage ohne Seitenangabe ist ein Fehler mit ihrer Kennung', () => {
  const ohneSeite = mitQuellen(daten).map((f) => (f.id === 'm01' ? { ...f, quelle: undefined } : f));
  assert.deepEqual(pruefeMatheFragen(ohneSeite), ['m01: Seitenangabe fehlt']);
});

test('pruefeMatheFragen: unter 12 Fragen ist ein Fehler (Mindestvorrat)', () => {
  assert.ok(pruefeMatheFragen(mitQuellen(daten).slice(0, 11)).includes('weniger als 12 Fragen'));
  assert.equal(pruefeMatheFragen(mitQuellen(daten).slice(0, 12)).filter((e) => e === 'weniger als 12 Fragen').length, 0);
});

test('Daten: jede Frage hat Thema, Seitenangabe „S. n“ und eigenentwurf: true; die Seitenmarkierung steht in der Datei', () => {
  const markierung = 'Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.';
  assert.equal(daten.pflichtmarkierung, markierung);
  assert.deepEqual(Object.keys(daten.quellen).sort(), daten.fragen.map((f) => f.id).sort(), 'quellen und fragen haben dieselben Kennungen');
  for (const f of mitQuellen(daten)) {
    assert.match(f.quelle.seite, /^S\. \d+$/, `${f.id}: Seitenangabe`);
    assert.equal(f.eigenentwurf, true, `${f.id}: eigenentwurf`);
    assert.ok(THEMEN.includes(f.thema), `${f.id}: Thema`);
  }
});
