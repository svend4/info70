import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const daten = JSON.parse(await readFile(new URL('../daten/sachen.json', import.meta.url), 'utf8'));
const sachen = daten.sachen;

test('Zielgruppe 6-8, genug Karten, jede vollständig', () => {
  assert.equal(daten.zielgruppe, '6-8');
  assert.ok(sachen.length >= 8, `mindestens 8 Karten (ist: ${sachen.length})`);
  const ids = new Set();
  for (const s of sachen) {
    assert.ok(s.id && s.piktogramm && s.sache, `unvollständig: ${s.id}`);
    assert.equal(typeof s.geheim, 'boolean', `${s.id}: geheim muss true/false sein`);
    assert.ok(s.erklaerung && s.erklaerung.length >= 20, `${s.id}: Erklärung zu kurz`);
    ids.add(s.id);
  }
  assert.equal(ids.size, sachen.length, 'IDs eindeutig');
});

test('Balance: beide Sorten (geheim / darf jeder wissen) kommen vor', () => {
  const geheim = sachen.filter((s) => s.geheim).length;
  const offen = sachen.filter((s) => !s.geheim).length;
  assert.ok(geheim >= 3, 'genug geheime Sachen');
  assert.ok(offen >= 3, 'genug offene Sachen');
});

test('Leichte Sprache: kurze Sätze, kein Fachwort-Wust', () => {
  for (const s of sachen) {
    assert.ok(s.sache.length <= 60, `${s.id}: Sache-Text für 6-8 zu lang`);
    // Erklärung in kurzen Sätzen (kein Satz über ~90 Zeichen)
    for (const satz of s.erklaerung.split(/(?<=[.!?])\s+/)) {
      assert.ok(satz.length <= 90, `${s.id}: Satz zu lang für Leichte Sprache: ${satz}`);
    }
  }
});

test('Kern-Schutzsachen sind als geheim markiert (Passwort, Adresse)', () => {
  const alles = JSON.stringify(sachen);
  assert.match(alles, /Passwort/);
  assert.match(alles, /Adresse/);
  const passwort = sachen.find((s) => /Passwort/.test(s.sache));
  const adresse = sachen.find((s) => /Adresse/.test(s.sache));
  assert.equal(passwort.geheim, true, 'Passwort muss geheim sein');
  assert.equal(adresse.geheim, true, 'Adresse muss geheim sein');
});
