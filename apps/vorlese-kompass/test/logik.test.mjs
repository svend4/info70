import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pruefeKompass, methodeText, naechsterIndex } from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/kompass.json', import.meta.url), 'utf8'));

test('Kompass-Daten gültig: 7 Schritte, Altersstufen, Kanon', () => {
  assert.deepEqual(pruefeKompass(daten), []);
  assert.equal(daten.methode.schritte.length, 7);
  assert.ok(daten.altersstufen.length >= 3);
  assert.ok(daten.kanon.length >= 4);
});

test('inhaltliche Abdeckung: dialogisch, offene Fragen, Mehrsprachigkeit', () => {
  const alles = JSON.stringify(daten).toLowerCase();
  assert.match(alles, /offene frage|warum|was meinst/, 'offene Fragen (dialogisch)');
  assert.match(alles, /wiederhol/, 'Wiederholung');
  assert.match(alles, /familiensprache|mehrsprachig|ukrainisch|russisch/, 'Mehrsprachigkeit');
  assert.match(alles, /bibliothek/, 'Bücher kostenlos aus der Bibliothek');
  // Altersfenster 1-3
  const ids = daten.altersstufen.map((a) => a.id);
  assert.ok(ids.includes('bis1') && ids.includes('2-3'));
});

test('methodeText nummeriert alle 7 Schritte', () => {
  const t = methodeText(daten);
  assert.match(t, /1\./);
  assert.match(t, /7\./);
  assert.match(t, /dialogisch/i);
});

test('naechsterIndex zyklisch', () => {
  assert.equal(naechsterIndex(0, 3), 1);
  assert.equal(naechsterIndex(2, 3), 0);
  assert.equal(naechsterIndex(0, 0), 0);
});
