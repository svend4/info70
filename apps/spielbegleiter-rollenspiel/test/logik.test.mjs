import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { aufgabeVon, kartenFuer, pruefeDaten } from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/karten.json', import.meta.url), 'utf8'));
const kopie = (x) => JSON.parse(JSON.stringify(x));

test('die Daten sind in Ordnung', () => {
  assert.deepEqual(pruefeDaten(daten), []);
});

test('sieben Aufgaben, je auf S. 145 oder S. 146 mit russischem Wortlaut', () => {
  assert.equal(daten.aufgaben.length, 7);
  for (const a of daten.aufgaben) {
    assert.match(a.quelle, /^S\. 14[56]$/, a.id);
    assert.ok(a.zitat.length >= 15, a.id);
  }
});

test('die Aufgaben sind keine Lernziele der Kinder', () => {
  assert.doesNotMatch(JSON.stringify(daten.aufgaben), /Kinder (lernen|sollen lernen)|Lernziel des Kindes/);
});

test('drei Fakten mit Seitenangabe: Übergang S. 104, Gruppen S. 104, Alter S. 6', () => {
  assert.deepEqual(daten.fakten.map((f) => f.quelle), ['S. 104', 'S. 104', 'S. 6']);
  assert.match(daten.zielgruppe, /3 bis 5 Jahren/);
});

test('kein Verlauf, keine Notiz, kein Name in den Daten', () => {
  const text = JSON.stringify(daten);
  assert.doesNotMatch(text, /"(name|vorname|kind|kinder|protokoll|verlauf|verlaufsdokumentation|beobachtung|notiz|geburtstag|alter|diagnose)"\s*:/i);
  assert.match(daten.hinweis, /nicht enthalten/);
  assert.match(daten.quelle.abweichung, /Verlaufsdokumentation/);
});

test('der Diagnoseteil der Quelle (S. 146) wird nicht übernommen und das steht in der Abweichung', () => {
  assert.match(daten.quelle.abweichung, /Diagnoseteil/);
  assert.doesNotMatch(JSON.stringify(daten.aufgaben), /emotionalem Unbehagen|Unbehagen/);
});

test('die Checkliste ist Eigenentwurf mit drei oder mehr Fragen', () => {
  assert.equal(daten.checkliste.eigenentwurf, true);
  assert.ok(daten.checkliste.fragen.length >= 3);
});

test('Filter und Einzelaufgabe', () => {
  assert.equal(kartenFuer(daten).length, 7);
  assert.equal(aufgabeVon(daten, 'a2').zitat, 'предметами-заместителями');
  assert.equal(aufgabeVon(daten, 'zz'), null);
});

test('ein Feld „verlauf“ wird abgewiesen', () => {
  const d = kopie(daten);
  d.aufgaben[0].verlauf = 'Mia hat gespielt';
  assert.ok(pruefeDaten(d).some((f) => /verlauf/.test(f)));
});

test('ein Feld „diagnose“ wird abgewiesen', () => {
  const d = kopie(daten);
  d.fakten[1].diagnose = 'auffällig';
  assert.ok(pruefeDaten(d).some((f) => /diagnose/.test(f)));
});

test('eine Aufgabe von S. 100 wird abgewiesen', () => {
  const d = kopie(daten);
  d.aufgaben[0].quelle = 'S. 100';
  assert.ok(pruefeDaten(d).some((f) => /Quelle muss S\. 145 oder S\. 146 sein/.test(f)));
});

test('eine Aufgabe als Lernziel der Kinder wird abgewiesen', () => {
  const d = kopie(daten);
  d.aufgaben[2].text = 'Kinder lernen, gemeinsam zu spielen.';
  assert.ok(pruefeDaten(d).some((f) => /als Lernziel der Kinder/.test(f)));
});

test('eine Abweichung ohne Verlaufsdokumentation wird abgewiesen', () => {
  const d = kopie(daten);
  d.quelle.abweichung = 'Der Katalog hatte Recht.';
  assert.ok(pruefeDaten(d).some((f) => /Verlaufsdokumentation/.test(f)));
});

test('ein Feld „notizen“ in einer Variante wird abgewiesen', () => {
  const d = kopie(daten);
  d.quelle.notizen = 'Mia spielt Küche';
  assert.ok(pruefeDaten(d).some((f) => /notizen/.test(f)));
});

test('ein Text mit „Beobachtung: …“ wird abgewiesen', () => {
  const d = kopie(daten);
  d.aufgaben[0].text = 'Beobachtung: Mia spielt gern Küche.';
  assert.ok(pruefeDaten(d).some((f) => /Eintrag über ein Kind/.test(f)));
});

test('die Checkliste fragt nicht nach einem einzelnen Kind', () => {
  assert.doesNotMatch(daten.checkliste.fragen.join(' '), /wer beginnt|welches Kind/i);
});
