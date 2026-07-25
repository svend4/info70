import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PRO_SESSION, TYPEN, waehleAufgaben, richtigeOption, istRichtig, pruefeDaten } from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/woerter.json', import.meta.url), 'utf8'));
const kopie = () => JSON.parse(JSON.stringify(daten));
const vom = (typ) => daten.aufgaben.filter((a) => a.typ === typ);

test('Daten sind gültig', () => {
  assert.deepEqual(pruefeDaten(daten), []);
  assert.ok(daten.aufgaben.length >= 15);
});

test('alle drei Sortierungen sind mit je mindestens vier Aufgaben da', () => {
  for (const typ of TYPEN) assert.ok(vom(typ).length >= 4, `${typ}: nur ${vom(typ).length}`);
  const duenn = kopie();
  duenn.aufgaben = duenn.aufgaben.filter((a) => a.typ !== 'mehrdeutig' || a.id === 's12');
  assert.ok(pruefeDaten(duenn).some((f) => /typ mehrdeutig: nur 1 Aufgaben/.test(f)));
});

test('binäre Typen: beide Antworten kommen vor – sonst lernt das Kind „immer ja“', () => {
  for (const typ of ['oberbegriff', 'mehrdeutig']) {
    const antworten = new Set(vom(typ).map((a) => a.korrekt));
    assert.equal(antworten.size, 2, `${typ}: nur ${[...antworten]}`);
  }
  const einseitig = kopie();
  for (const a of einseitig.aufgaben) if (a.typ === 'mehrdeutig') a.korrekt = 'ja';
  assert.ok(pruefeDaten(einseitig).some((f) => /immer dieselbe Antwort richtig/.test(f)));
});

test('Gegenteil-Aufgaben: genau eine richtige Option, keine doppelten Texte', () => {
  for (const a of vom('gegenteil')) {
    assert.equal(a.optionen.filter((o) => o.richtig).length, 1, `${a.id}`);
    assert.equal(a.optionen.length, 3, `${a.id}`);
    assert.ok(richtigeOption(a).text, `${a.id}`);
    const texte = a.optionen.map((o) => o.text);
    assert.equal(new Set(texte).size, 3, `${a.id}: doppelter Text`);
  }
  const zwei = kopie();
  zwei.aufgaben.find((a) => a.id === 's07').optionen[1].richtig = true;
  assert.ok(pruefeDaten(zwei).some((f) => /genau EINE richtige Option/.test(f)));
});

test('die Ablenker bei Gegenteilen sind aus anderen Wortfeldern', () => {
  // "laut" ist kein Gegenteil von "groß" – aber ein plausibler Ablenker,
  // weil beides Eigenschaften sind. Zwei Gegenteile in einer Aufgabe wären
  // dagegen ein Fehler, den ein Kind zu Recht anfechten könnte.
  const paare = { klein: 'groß', kalt: 'heiß', leise: 'laut', trocken: 'nass', langsam: 'schnell' };
  for (const a of vom('gegenteil')) {
    const richtig = richtigeOption(a).text;
    const treffer = a.frage.match(/Gegenteil von ([^?]+)\?/);
    assert.ok(treffer, `${a.id}: Frage nicht in der erwarteten Form`);
    const gefragt = treffer[1].trim();
    assert.equal(paare[richtig], gefragt, `${a.id}: „${richtig}“ ist nicht das Gegenteil von „${gefragt}“`);
    for (const o of a.optionen.filter((x) => !x.richtig)) {
      assert.notEqual(paare[o.text], gefragt, `${a.id}: „${o.text}“ wäre auch ein Gegenteil`);
    }
  }
});

test('das Bild zeigt genau das gefragte Ding', () => {
  // Bei allen Aufgaben außer den Gegenteilen ist das Emoji die EINZIGE
  // Bebilderung des gefragten Dings. Ob ein Bild zu einem Wort passt, kann
  // kein Validator entscheiden – deshalb steht die Zuordnung hier fest.
  // Wer ein Zeichen tauscht, muss diese Tabelle anfassen und dabei hinsehen.
  const bebilderung = {
    s01: ['Gurke', '🥒'], s02: ['Banane', '🍌'], s03: ['Teller', '🍽️'],
    s04: ['Bett', '🛏️'], s05: ['Mütze', '🧢'], s06: ['Fahrrad', '🚲'],
    s12: ['Bank', '🪑', '🏦'], s13: ['Birne', '🍐', '💡'], s14: ['Maus', '🐭', '🖱️'],
    s15: ['Blatt', '🍃', '📄'], s16: ['Löffel', '🥄', '🚗'], s17: ['Schlüssel', '🔑', '🌳'],
  };
  for (const [id, [wort, emoji, zweit]] of Object.entries(bebilderung)) {
    const a = daten.aufgaben.find((x) => x.id === id);
    assert.ok(a, `${id}: Aufgabe fehlt`);
    assert.ok(a.frage.includes(wort), `${id}: „${wort}“ steht gar nicht in der Frage`);
    assert.equal(a.emoji, emoji, `${id}: das Bild zeigt nicht „${wort}“`);
    if (zweit) assert.equal(a.zweitEmoji, zweit, `${id}: das zweite Bild passt nicht`);
  }
  for (const a of daten.aufgaben) {
    if (a.typ !== 'gegenteil') assert.ok(bebilderung[a.id], `${a.id}: fehlt in der Bebilderungstabelle`);
  }
  // Und kein Zeichen darf für zwei verschiedene Dinge stehen.
  const doppelt = kopie();
  doppelt.aufgaben.find((a) => a.id === 's04').emoji = '🥒';
  assert.ok(pruefeDaten(doppelt).some((f) => /steht schon für etwas anderes/.test(f)));
});

test('istRichtig arbeitet für beide Antwortformen', () => {
  const ober = vom('oberbegriff')[0];
  assert.equal(istRichtig(ober, ober.korrekt), true);
  assert.equal(istRichtig(ober, ober.korrekt === 'ja' ? 'nein' : 'ja'), false);
  const gegen = vom('gegenteil')[0];
  assert.equal(istRichtig(gegen, richtigeOption(gegen)), true);
  assert.equal(istRichtig(gegen, gegen.optionen.find((o) => !o.richtig)), false);
  assert.equal(istRichtig(gegen, undefined), false);
});

test('Mehrdeutigkeit: echte Teekesselchen und ein paar falsche Paare', () => {
  const echte = vom('mehrdeutig').filter((a) => a.korrekt === 'ja');
  const falsche = vom('mehrdeutig').filter((a) => a.korrekt === 'nein');
  assert.ok(echte.length >= 3, 'zu wenige echte Doppelbedeutungen');
  assert.ok(falsche.length >= 2, 'ohne Gegenbeispiele tippt das Kind immer auf ja');
  for (const a of echte) {
    assert.ok(a.wort && a.emoji && a.zweitEmoji, `${a.id}: unvollständig`);
    assert.match(a.frage, new RegExp(`„${a.wort}“`), `${a.id}: das Wort steht nicht in der Frage`);
  }
  // Die deutschen Klassiker sind dabei
  const woerter = echte.map((a) => a.wort);
  for (const w of ['Bank', 'Birne', 'Maus']) assert.ok(woerter.includes(w), `fehlt: ${w}`);
});

test('Sitzungsgrenze: höchstens sechs Aufgaben, ohne Dubletten, mit Rotation', () => {
  assert.ok(PRO_SESSION <= 6);
  const gesehen = new Set();
  for (let i = 0; i < 60; i++) {
    const runde = waehleAufgaben(daten.aufgaben);
    assert.equal(runde.length, PRO_SESSION);
    assert.equal(new Set(runde.map((a) => a.id)).size, PRO_SESSION);
    for (const a of runde) gesehen.add(a.id);
  }
  assert.ok(gesehen.size > PRO_SESSION, 'keine Rotation');
});

test('Ton und Abschluss: kein Tadel, Frage an die Erwachsenen, Schluss offline', () => {
  const text = JSON.stringify(daten).toLowerCase();
  for (const wort of ['dumm', 'blöd', 'leider', 'punkte', 'gewonnen', 'verloren', 'fehler gemacht']) {
    assert.ok(!text.includes(wort), `unerwünschtes Wort: ${wort}`);
  }
  for (const a of daten.aufgaben) {
    assert.ok(a.gespraech.trim().endsWith('?'), `${a.id}: Impuls ist keine Frage`);
    assert.ok(a.erklaerung.length >= 40, `${a.id}: Erklärung zu knapp`);
  }
  assert.ok(daten.schlussIdeen.length >= 3);
  for (const i of daten.schlussIdeen) assert.ok(i.length >= 40, `Schlussidee zu knapp: ${i}`);
  // Die Alltagseinteilung von Obst und Gemüse ist deklariert
  assert.match(daten.hinweis, /Alltagseinteilung/);
});
