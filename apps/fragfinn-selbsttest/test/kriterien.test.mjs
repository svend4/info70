import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const daten = JSON.parse(await readFile(new URL('../daten/kriterien.json', import.meta.url), 'utf8'));
const alle = daten.bereiche.flatMap((b) => b.kriterien);

test('Katalog: fragFINN-Bereiche, eindeutige IDs, Selbsttest-Hinweis', () => {
  assert.ok(daten.bereiche.length >= 4);
  assert.match(daten.quelle, /fragFINN/, 'fragFINN als Grundlage');
  assert.match(daten.hinweis, /kein offizielles|Selbsttest/i, 'als Selbsttest gekennzeichnet');
  const bIds = daten.bereiche.map((b) => b.id);
  assert.equal(new Set(bIds).size, bIds.length, 'doppelte Bereichs-IDs');
  const ids = alle.map((k) => k.id);
  assert.equal(new Set(ids).size, ids.length, 'doppelte Kriterien-IDs');
  assert.ok(alle.length >= 10, `mindestens 10 Kriterien (ist: ${alle.length})`);
});

test('jedes Kriterium: Aussage, Hilfe (was fragFINN erwartet), Bezug', () => {
  for (const k of alle) {
    assert.ok(k.text.length >= 40, `${k.id}: Aussage zu kurz`);
    assert.ok(k.hilfe.length >= 60, `${k.id}: Hilfe zu kurz`);
    assert.match(k.bezug, /fragFINN|JMStV|JuSchG|DSGVO|DSA|DDG|UWG/, `${k.id}: Bezug fehlt`);
  }
});

test('inhaltliche Abdeckung der fragFINN-Aufnahmethemen', () => {
  const text = JSON.stringify(alle).toLowerCase();
  assert.match(text, /kinder|zielgruppe/, 'Kindeignung');
  assert.match(text, /moderiert|interaktion|fremdkontakt/, 'Interaktion/Sicherheit');
  assert.match(text, /link/, 'Verlinkungen kindgeeignet');
  assert.match(text, /werbung.*getrennt|gekennzeichnet/, 'Werbetrennung');
  assert.match(text, /datensparsam|wenige personenbezogene/, 'Datensparsamkeit');
  assert.match(text, /impressum/, 'Impressum/Transparenz');
});
