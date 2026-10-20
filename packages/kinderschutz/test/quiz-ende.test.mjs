import { test } from 'node:test';
import assert from 'node:assert/strict';
import { druckSymbole, pruefeEndeText } from '../src/quiz-ende.mjs';

// Gegenprobe: der alte Endbildschirm muss scheitern, der neue muss bestehen.
const alt = 'Wer steckt hinter dieser Seite?\n\n🕵️\nImpressum-Späher*in\n\n5 von 12 Fällen geknackt · Rekord: 5';
const altRichtig = 'Jugendschutz-Wissens-Quiz\n\n🧭\nKundig\n\n6 von 12 richtig · Rekord: 6 ⭐ 🏆';
const neu = 'Wer steckt hinter dieser Seite?\n\nFall gelöst!\nDu hast alle Fragen durchgearbeitet.\n\n🔊 Vorlesen\n🔁 Noch einmal\n🏠 Zum Start';

test('Gegenprobe: alter Endbildschirm mit Zahl von Zahl und Rekord scheitert', () => {
  const p = pruefeEndeText(alt);
  assert.equal(p.zahlVonZahl, false);
  assert.equal(p.rekord, false);
});

test('Gegenprobe: alter Endbildschirm mit richtig, Stern und Pokal scheitert', () => {
  const p = pruefeEndeText(altRichtig);
  assert.equal(p.richtig, false);
  assert.equal(p.sterneOderPokal, false);
  assert.equal(p.rekord, false);
});

test('neuer Endbildschirm besteht alle Textprüfungen', () => {
  const p = pruefeEndeText(neu);
  assert.deepEqual(Object.entries(p).filter(([, ok]) => !ok), [], 'keine Regel schlägt an');
  assert.ok(Object.keys(p).length >= 5);
});

test('Druck: Zeichen aus der Liste werden gefunden, Emoji nicht', () => {
  assert.deepEqual(druckSymbole('Ergebnis ★ ✓ ☐ und ☒'), ['★', '✓', '☐', '☒']);
  assert.deepEqual(druckSymbole(neu), []);
});
