import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { ARTEN, EINTRAG_SCHLUESSEL, eintraegeFuer, pruefeDaten } from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/richtwerte.json', import.meta.url), 'utf8'));
const kopie = (x) => JSON.parse(JSON.stringify(x));

test('die Daten sind in Ordnung', () => {
  assert.deepEqual(pruefeDaten(daten), []);
});

test('Angaben mit Maß für das vierte und das fünfte Lebensjahr, je mit Seite 129–132', () => {
  assert.ok(daten.eintraege.some((e) => e.jahr === 4));
  assert.ok(daten.eintraege.some((e) => e.jahr === 5));
  for (const e of daten.eintraege) assert.match(e.seite, /^S\. 1(29|3[012])$/, e.id);
});

test('jeder Eintrag hat genau die erlaubten Felder', () => {
  for (const e of daten.eintraege) assert.deepEqual(Object.keys(e).sort(), [...EINTRAG_SCHLUESSEL].sort(), e.id);
});

test('keine Normsprache, keine Pflicht, kein „jedes Kind“ in den Texten', () => {
  const text = daten.eintraege.map((e) => e.text).join(' ') + daten.hinweis;
  assert.doesNotMatch(text, /\bmuss\b|jedes Kind|Norm erreichen|Pflicht/i);
});

test('Balancieren erscheint nicht als messbare Angabe', () => {
  assert.ok(!daten.eintraege.some((e) => /Balancieren|Gleichgewicht/i.test(e.art + e.text)));
  assert.match(daten.hinweis, /Balancieren/);
});

test('der Hinweis sagt: keine Norm, keine Bewertung einzelner Kinder', () => {
  assert.match(daten.hinweis, /keine Norm/);
  assert.match(daten.hinweis, /keine Bewertung/);
});

test('die Abweichung nennt die 32, die Norm und den Kriterien-Check', () => {
  assert.match(daten.quelle.abweichung, /32/);
  assert.match(daten.quelle.abweichung, /Norm/);
  assert.match(daten.quelle.abweichung, /Kriterien/);
});

test('Filter nach Lebensjahr und nach Bewegungsart', () => {
  assert.equal(eintraegeFuer(daten).length, daten.eintraege.length);
  assert.ok(eintraegeFuer(daten, { jahr: 4 }).every((e) => e.jahr === 4));
  assert.ok(eintraegeFuer(daten, { art: 'Springen' }).every((e) => e.art === 'Springen'));
  assert.ok(eintraegeFuer(daten, { jahr: 5, art: 'Springen' }).length >= 1);
  assert.ok(ARTEN.length === 4);
});

test('ein Eintrag mit Normsprache wird abgewiesen', () => {
  const d = kopie(daten);
  d.eintraege[0].text = 'Jedes Kind muss 10 m laufen.';
  assert.ok(pruefeDaten(d).some((f) => /Normsprache/.test(f)));
});

test('ein Eintrag mit einem Feld nach Kind wird abgewiesen', () => {
  const d = kopie(daten);
  d.eintraege[3].bewertung = 'erreicht';
  assert.ok(pruefeDaten(d).some((f) => /bewertung/.test(f)));
});

test('eine Seite außerhalb von 128–134 wird abgewiesen', () => {
  const d = kopie(daten);
  d.eintraege[5].seite = 'S. 96';
  assert.ok(pruefeDaten(d).some((f) => /außerhalb von S\. 128–134/.test(f)));
});

test('Balancieren als Eintrag wird abgewiesen', () => {
  const d = kopie(daten);
  d.eintraege[0].art = 'Balancieren';
  assert.ok(pruefeDaten(d).some((f) => /Balancieren/.test(f)));
});

test('der Hinweis ohne „keine Norm“ wird abgewiesen', () => {
  const d = kopie(daten);
  d.hinweis = d.hinweis.replace('keine Norm', 'eine Vorgabe');
  assert.ok(pruefeDaten(d).some((f) => /keine Norm/.test(f)));
});

test('Normsprache mit „müssen“ oder „sollen“ in einem angezeigten Titel wird abgewiesen', () => {
  const d = kopie(daten);
  d.titel = 'Kinder müssen 10 m laufen';
  assert.ok(pruefeDaten(d).some((f) => /Normsprache/.test(f)));
  const e = kopie(daten);
  e.eintraege[0].text = 'Alle Kinder sollen schnell laufen.';
  assert.ok(pruefeDaten(e).some((f) => /Normsprache/.test(f)));
});

test('ein Lebensjahr 5 mit einer Seite des vierten Jahres wird abgewiesen', () => {
  const d = kopie(daten);
  const e = d.eintraege.find((x) => x.jahr === 5);
  e.seite = 'S. 129';
  assert.ok(pruefeDaten(d).some((f) => /passt nicht zur Seite/.test(f)));
});

test('der Hinweis ohne Aufnahmeregel wird abgewiesen', () => {
  const d = kopie(daten);
  d.hinweis = 'Die Angaben stehen auf S. 128–134. Keine Norm, keine Bewertung einzelner Kinder.';
  assert.ok(pruefeDaten(d).some((f) => /Aufnahmeregel/.test(f)));
});

test('die Auswahl umfasst fünfundzwanzig Angaben, siebzehn davon für das fünfte Jahr', () => {
  assert.equal(daten.eintraege.length, 25);
  assert.equal(daten.eintraege.filter((e) => e.jahr === 5).length, 17);
  assert.equal(daten.eintraege.filter((e) => e.jahr === 4).length, 8);
});
