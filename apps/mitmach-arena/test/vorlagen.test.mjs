import { test } from 'node:test';
import assert from 'node:assert/strict';
import { KLASSENRAT_VORLAGEN, ausVorlage } from '../vorlagen.mjs';
import { packeKoffer, pruefeKoffer } from '../koffer.mjs';

test('Mindestens vier Klassenrat-Vorlagen, jede mit Frage und ≥2 Optionen', () => {
  assert.ok(KLASSENRAT_VORLAGEN.length >= 4);
  const titel = new Set();
  for (const v of KLASSENRAT_VORLAGEN) {
    assert.ok(v.titel && v.frage, `Vorlage unvollständig: ${v.titel}`);
    assert.ok(v.optionen.length >= 2, `zu wenige Optionen: ${v.titel}`);
    titel.add(v.titel);
  }
  assert.equal(titel.size, KLASSENRAT_VORLAGEN.length, 'Titel eindeutig');
});

test('Themen decken Klassenrat-Kernbereiche ab', () => {
  const titel = KLASSENRAT_VORLAGEN.map((v) => v.titel).join(' | ');
  for (const kern of ['Klassenregeln', 'Pausenhof', 'Projektwoche', 'Digitale Klassenregeln']) {
    assert.match(titel, new RegExp(kern), `Bereich fehlt: ${kern}`);
  }
});

test('ausVorlage: startbereite Umfrage mit Zählern auf 0', () => {
  const u = ausVorlage(KLASSENRAT_VORLAGEN[0]);
  assert.equal(u.frage, KLASSENRAT_VORLAGEN[0].frage);
  assert.deepEqual(u.stimmen, u.optionen.map(() => 0));
  // verändert die Vorlage nicht
  assert.notEqual(u.optionen, KLASSENRAT_VORLAGEN[0].optionen);
});

test('Vorlagen sind Klassen-Koffer-kompatibel (Export/Prüfung)', () => {
  for (const v of KLASSENRAT_VORLAGEN) {
    const koffer = JSON.parse(packeKoffer(ausVorlage(v)));
    assert.deepEqual(pruefeKoffer(koffer), [], `Vorlage nicht koffer-kompatibel: ${v.titel}`);
  }
});
