import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { FIGUREN, KARTEN_SCHLUESSEL, kartenFuer, pruefeDaten, quelleTextVon, zielVon } from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/karten.json', import.meta.url), 'utf8'));
const kopie = (x) => JSON.parse(JSON.stringify(x));

test('die Daten sind in Ordnung', () => {
  assert.deepEqual(pruefeDaten(daten), []);
});

test('sechs Aufgaben der Quelle, je mit Seite 68 oder 69 und russischem Wortlaut', () => {
  assert.equal(daten.ziele.length, 6);
  for (const z of daten.ziele) {
    assert.match(z.quelle, /^S\. 6[89]$/, z.id);
    assert.ok(z.zitat.length >= 10, z.id);
  }
});

test('die Ziele sind Aufgaben für die Fachkraft, keine Lernziele der Kinder', () => {
  const text = JSON.stringify(daten.ziele);
  assert.doesNotMatch(text, /Lernziel des Kindes|Kinder lernen|Kinder sollen lernen/);
  assert.match(daten.quelle.abweichung, /Aufgaben für die Fachkraft/);
});

test('der Titel nennt kein „Rollenspiel“; die Altersangaben stehen mit Seite da', () => {
  assert.doesNotMatch(daten.titel, /Rollenspiel/);
  assert.equal(daten.faktenZumSpiel.quelleAlter, 'S. 99–100');
  assert.equal(daten.faktenZumSpiel.quelleRollenspiel, 'S. 104');
  assert.match(daten.faktenZumSpiel.altersBereich, /dritten Lebensjahr/);
});

test('keine Karte hat ein Feld für eine Lösung des Erwachsenen', () => {
  for (const k of daten.karten) {
    assert.ok(Object.keys(k).every((s) => KARTEN_SCHLUESSEL.includes(s)), k.id);
    assert.equal('loesung' in k, false, k.id);
  }
});

test('jede Karte ist Eigenentwurf oder trägt eine Seite der Quelle', () => {
  for (const k of daten.karten) {
    if (k.eigenentwurf === false) assert.match(k.quelle, /^S\. \d+/, k.id);
    else assert.equal(typeof k.eigenentwurf, 'boolean', k.id);
  }
  const beispiel = daten.karten.find((k) => k.id === 'k06');
  assert.equal(beispiel.eigenentwurf, false);
  assert.equal(beispiel.quelle, 'S. 100');
});

test('jede Aufgabe hat mindestens eine Karte und jede Karte eine gültige Figur', () => {
  for (const z of daten.ziele) assert.ok(daten.karten.some((k) => k.ziel === z.id), z.id);
  for (const k of daten.karten) assert.ok(FIGUREN.includes(k.figur), k.id);
  assert.deepEqual(daten.figuren.map((f) => f.id), FIGUREN);
});

test('der Filter nach Aufgabe und nach Figur liefert nur passende Karten', () => {
  const z2 = kartenFuer(daten, { ziel: 'z2' });
  assert.ok(z2.length >= 1);
  assert.ok(z2.every((k) => k.ziel === 'z2'));
  const puppen = kartenFuer(daten, { figur: 'puppe' });
  assert.ok(puppen.every((k) => k.figur === 'puppe'));
  assert.equal(kartenFuer(daten).length, daten.karten.length);
  assert.deepEqual(kartenFuer(daten, { ziel: 'z2', figur: 'puppe' }).map((k) => k.id), ['k01', 'k08']);
});

test('die Quellenzeile sagt, was Quelle und was Eigenentwurf ist', () => {
  const beispiel = daten.karten.find((k) => k.id === 'k06');
  assert.match(quelleTextVon(beispiel), /S\. 100/);
  const eigen = daten.karten.find((k) => k.id === 'k01');
  assert.equal(quelleTextVon(eigen), 'Eigenentwurf');
});

test('zielVon findet eine Aufgabe und liefert null bei unbekannter Kennung', () => {
  assert.equal(zielVon(daten, 'z3').quelle, 'S. 69');
  assert.equal(zielVon(daten, 'zz'), null);
});

test('eine Karte mit Lösungsfeld wird abgewiesen', () => {
  const d = kopie(daten);
  d.karten[0].loesung = 'Die Fachkraft gibt einen Teller.';
  assert.ok(pruefeDaten(d).some((f) => /loesung|Lösung/.test(f)));
});

test('eine Lösung im Situationstext wird abgewiesen', () => {
  const d = kopie(daten);
  d.karten[0].situation = 'Die Fachkraft löst das Problem, indem sie einen Teller gibt.';
  assert.ok(pruefeDaten(d).some((f) => /Lösung für die Fachkraft/.test(f)));
});

test('eine Karte ohne Eigenentwurf-Markierung und ohne Seite wird abgewiesen', () => {
  const d = kopie(daten);
  d.karten[0].eigenentwurf = false;
  delete d.karten[0].quelle;
  assert.ok(pruefeDaten(d).some((f) => /Seite der Quelle/.test(f)));
});

test('der Titel „Rollenspiel“ wird abgewiesen', () => {
  const d = kopie(daten);
  d.titel = 'Rollenspiel-Impulskarten';
  assert.ok(pruefeDaten(d).some((f) => /Rollenspiel/.test(f)));
});

test('eine Aufgabe ohne Karte wird gemeldet', () => {
  const d = kopie(daten);
  d.karten = d.karten.filter((k) => k.ziel !== 'z6');
  assert.ok(pruefeDaten(d).some((f) => /z6: keine Karte/.test(f)));
});

test('eine Aufgabe mit Seite außerhalb 68–69 wird abgewiesen', () => {
  const d = kopie(daten);
  d.ziele[0].quelle = 'S. 81';
  assert.ok(pruefeDaten(d).some((f) => /z1: Quelle muss S\. 68 oder S\. 69 sein/.test(f)));
});

test('ein Lernziel-Satz für Kinder wird abgewiesen', () => {
  const d = kopie(daten);
  d.ziele[1].text = 'Kinder lernen, Spielhandlungen zu planen.';
  assert.ok(pruefeDaten(d).some((f) => /als Lernziel der Kinder/.test(f)));
});
