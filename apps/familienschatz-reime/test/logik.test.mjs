import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pruefeSchatz, artName, naechsterIndex, normalisiereEintrag, eintragOk } from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/schatz.json', import.meta.url), 'utf8'));

test('Schatz-Daten gültig: Arten + Beispiele passen zusammen', () => {
  assert.deepEqual(pruefeSchatz(daten), []);
  const arten = new Set(daten.arten.map((a) => a.id));
  for (const id of ['kniereiter', 'wiegenlied', 'reim']) assert.ok(arten.has(id), `Art ${id}`);
});

test('Beispiele sind als eigener Text gekennzeichnet (Urheberrecht)', () => {
  for (const b of daten.beispiele) {
    assert.match(b.titel, /eigener Text/i, `${b.id}: als Eigenproduktion gekennzeichnet`);
  }
});

test('jede Art erklärt warum und wie', () => {
  for (const a of daten.arten) {
    assert.ok(a.warum.length >= 20, `${a.id}: warum`);
    assert.ok(a.wie.length >= 15, `${a.id}: wie`);
  }
  assert.match(daten.hinweis, /Familiensprache|Ukrainisch|Russisch/i, 'Mehrsprachigkeit eingeladen');
});

test('artName / naechsterIndex', () => {
  assert.equal(artName(daten, 'wiegenlied'), 'Wiegenlied');
  assert.equal(artName(daten, 'gibt-nicht'), 'gibt-nicht');
  assert.equal(naechsterIndex(0, 4), 1);
  assert.equal(naechsterIndex(3, 4), 0);
  assert.equal(naechsterIndex(0, 0), 0);
});

test('eigene Einträge: Titel Pflicht, Längen begrenzt', () => {
  const e = normalisiereEintrag({ titel: '  Omas Lied  ', text: 'x'.repeat(1000) });
  assert.equal(e.titel, 'Omas Lied');
  assert.equal(e.text.length, 800, 'Text gekappt');
  assert.equal(eintragOk(e), true);
  assert.equal(eintragOk({ titel: '   ' }), false);
  assert.equal(eintragOk({}), false);
});
