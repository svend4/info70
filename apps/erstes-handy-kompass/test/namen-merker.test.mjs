import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { merkeName, gemerkterName, urkundenName, MAX_ZEICHEN, PLATZHALTER } from '../namen-merker.mjs';

// Modul-Ebene ohne DOM: Der Name der Urkunde muss ein Neuzeichnen der Seite überleben
// (render() in app.mjs baut Feld und Urkunde jedes Mal neu auf), ohne gespeichert zu werden.

const APP = new URL('../', import.meta.url);
const lese = (datei) => readFile(new URL(datei, APP), 'utf8');

// Ein Neuaufbau in Worten: Feld und Urkunde werden aus dem Modul gefüllt, nicht aus dem alten DOM.
const neuAufbau = () => ({ feld: gemerkterName(), urkunde: urkundenName() });

test('Name überlebt das Neuzeichnen: Feld und Urkunde zeigen nach jedem Neuaufbau den Wert', () => {
  merkeName('L. M.');
  for (let durchlauf = 1; durchlauf <= 3; durchlauf += 1) {
    assert.deepEqual(neuAufbau(), { feld: 'L. M.', urkunde: 'L. M.' }, `nach Neuaufbau ${durchlauf}`);
  }
});

test('Eingabe überschreibt den Wert; ein leeres Feld ergibt die Linie auf der Urkunde', () => {
  merkeName('J. K.');
  assert.equal(urkundenName(), 'J. K.');
  merkeName('   ');
  assert.equal(gemerkterName(), '   ', 'das Feld zeigt, was eingetippt wurde');
  assert.equal(urkundenName(), PLATZHALTER, 'nur Leerzeichen ergeben die Linie');
});

test('Begrenzung auf 12 Zeichen wie das Feld (maxlength 12)', () => {
  assert.equal(MAX_ZEICHEN, 12);
  merkeName('ABCDEFGHIJKLMNOP');
  assert.equal(gemerkterName(), 'ABCDEFGHIJKL');
});

test('Urkunde zeigt den getrimmten Wert, das Feld den Wert wie eingegeben', () => {
  merkeName('  Mo  ');
  assert.equal(gemerkterName(), '  Mo  ');
  assert.equal(urkundenName(), 'Mo');
});

test('Datenvermeidung: das Modul speichert und verschickt nichts und hat keine Abhängigkeiten', async () => {
  const quelle = await lese('namen-merker.mjs');
  assert.ok(!/localStorage|sessionStorage|indexedDB|document\.cookie|fetch\(|XMLHttpRequest|WebSocket|sendBeacon/.test(quelle),
    'Speicher- oder Netzaufruf im Namens-Modul');
  assert.ok(!/^import\s/m.test(quelle), 'das Modul soll ohne Importe auskommen (kein DOM)');
});

test('Verdrahtung: das Namensfeld startet mit dem gemerkten Wert und meldet jede Eingabe ans Modul', async () => {
  const app = await lese('app.mjs');
  assert.match(app, /from '\.\/namen-merker\.mjs'/, 'app.mjs importiert das Modul nicht');
  assert.ok(app.includes('nameFeld.value = gemerkterName();'), 'Feld startet nicht mit dem gemerkten Wert');
  assert.ok(app.includes('merkeName(nameFeld.value);'), 'Eingabe wird nicht ans Modul gemeldet');
});
