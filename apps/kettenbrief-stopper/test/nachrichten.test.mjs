import { test } from 'node:test';
import assert from 'node:assert/strict';
import { NACHRICHTEN_TYPEN, typNach } from '../nachrichten.mjs';

test('Es gibt mindestens Kettenbrief und Mutprobe', () => {
  const ids = NACHRICHTEN_TYPEN.map((t) => t.id);
  assert.ok(ids.includes('kettenbrief'));
  assert.ok(ids.includes('mutprobe'));
});

test('Jeder Typ ist vollständig (Text, Optionen, Lernpunkte)', () => {
  for (const t of NACHRICHTEN_TYPEN) {
    assert.ok(t.titel && t.emoji && t.intro, `${t.id}: Kopf fehlt`);
    assert.ok(t.nachricht.length > 20, `${t.id}: Nachricht zu kurz`);
    assert.ok(t.frage && t.weiter && t.stopp, `${t.id}: Entscheidungsoptionen fehlen`);
    assert.ok(Array.isArray(t.lernpunkte) && t.lernpunkte.length >= 3, `${t.id}: zu wenige Lernpunkte`);
    assert.ok(JSON.stringify(t).includes('116 111'), `${t.id}: Hilfeadresse fehlt`);
  }
});

test('Mutprobe hat die Melden-Option, Kettenbrief nicht', () => {
  assert.ok(typNach('mutprobe').melden, 'Mutprobe braucht Melden-Option');
  assert.equal(typNach('kettenbrief').melden, null, 'Kettenbrief ohne Melden');
});

test('Mutprobe thematisiert Gruppendruck, nicht nur Pech', () => {
  const t = typNach('mutprobe');
  assert.match(JSON.stringify(t), /Gruppendruck|Nein|Feigling/);
});

test('typNach: unbekannte id -> erster Typ (Fallback)', () => {
  assert.equal(typNach('gibtsnicht').id, NACHRICHTEN_TYPEN[0].id);
});
