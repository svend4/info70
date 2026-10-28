import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { appsOhneMarke, hatMarke, hatSeitenangabe, vergleiche } from '../src/seitenmarke.mjs';

// Seitenangaben brauchen eine ehrliche Marke (Entscheidung Max 22а). Der Stand docs/seitenmarke-stand.json führt die Apps,
// die Seitenangaben ohne Marke zeigen; er schrumpft nur.
const WURZEL = fileURLToPath(new URL('../../../', import.meta.url));

test('Seitenangabe: S. n, S. n–m, Seite n und стр. n werden erkannt, andere Zahlen nicht', () => {
  for (const t of ['Praleska, S. 36', '(S. 12–14)', 'siehe Seite 7', 'стр. 101', 'с. 274–276', 'S.5']) assert.equal(hatSeitenangabe(t), true, t);
  for (const t of ['Frage 3 von 12', 'Art. 23 Abs. 2', 'Schritt 5', 'ab 3 Jahren', 'Sicherheit', 'DSGVO Art. 28 Abs. 3 S. 1', 'Abs. 2 S. 4', 'Ausgabe 13 Seiten']) assert.equal(hatSeitenangabe(t), false, t);
  assert.equal(hatSeitenangabe('Abs. 2 und S. 14'), true, 'Kontrolle: eine echte Seite nach einem Absatz bleibt Seitenangabe');
});

test('Marke: die gebräuchlichen Formen werden erkannt, ein bloßes „geprüft“ nicht', () => {
  for (const t of [
    'maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.',
    'Wortlaut maschinell nachgelesen, nicht durch Menschen geprüft',
    'Seitenangaben nicht von einem Menschen geprüft.',
  ]) assert.equal(hatMarke(t), true, t);
  for (const t of ['von einem Menschen geprüft', 'geprüft', 'maschinell geprüft']) assert.equal(hatMarke(t), false, `Kontrolle: ${t}`);
});

test('Vergleich: eine neue App ohne Marke ist ein Fehler, eine erledigte muss aus dem Stand, eine Ausnahme zählt nicht', () => {
  assert.match(vergleiche({}, { x: ['index.html'] })[0], /x: Seitenangaben ohne Marke/);
  assert.match(vergleiche({ y: ['index.html'] }, {})[0], /^y: Marke vorhanden/);
  assert.deepEqual(vergleiche({ z: ['a'] }, { z: ['a'] }), []);
  assert.deepEqual(vergleiche({}, { w: ['daten/q.json'] }, { w: 'nirgends angezeigt' }), [], 'eine genannte Ausnahme ist kein Fehler');
  assert.match(vergleiche({}, {}, { v: 'Grund' })[0], /^Ausnahme v: /, 'Kontrolle: eine gegenstandslose Ausnahme wird gemeldet');
});

test('Alle Apps: keine neue App mit Seitenangaben ohne Marke gegenüber docs/seitenmarke-stand.json', async () => {
  const datei = JSON.parse(await readFile(join(WURZEL, 'docs', 'seitenmarke-stand.json'), 'utf8'));
  assert.deepEqual(vergleiche(datei.apps, await appsOhneMarke(WURZEL), datei.ausnahmen ?? {}), []);
});
