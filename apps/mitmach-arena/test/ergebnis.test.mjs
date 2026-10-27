import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { meisteStimmen, meisteStimmenText } from '../ergebnis.mjs';

const umfrage = (stimmen) => ({ frage: 'Wohin?', optionen: ['Zoo', 'Museum', 'Wald'], stimmen });

test('meisteStimmen: eine Möglichkeit vorn, bei Gleichstand alle vorn, ohne Stimmen keine', () => {
  assert.deepEqual(meisteStimmen(umfrage([3, 1, 5])), ['Wald']);
  assert.deepEqual(meisteStimmen(umfrage([4, 1, 4])), ['Zoo', 'Wald']);
  assert.deepEqual(meisteStimmen(umfrage([0, 0, 0])), []);
});

test('meisteStimmenText: neutrale Zeile „Meiste Stimmen: …“, ohne Stimmen leer', () => {
  assert.equal(meisteStimmenText(umfrage([3, 1, 5])), 'Meiste Stimmen: Wald');
  assert.equal(meisteStimmenText(umfrage([4, 1, 4])), 'Meiste Stimmen: Zoo · Wald');
  assert.equal(meisteStimmenText(umfrage([0, 0, 0])), '');
});

test('Abwesenheit: kein Pokal-Symbol und keine Siegerformulierung im Code der Abstimmung', async () => {
  const pokal = String.fromCodePoint(0x1f3c6);
  for (const datei of ['../app.mjs', '../ergebnis.mjs']) {
    const text = await readFile(new URL(datei, import.meta.url), 'utf8');
    assert.ok(!text.includes(pokal), `${datei}: kein Pokal-Symbol`);
    assert.ok(!/gewonnen|gewinner|sieger/i.test(text), `${datei}: keine Siegerformulierung`);
  }
});
