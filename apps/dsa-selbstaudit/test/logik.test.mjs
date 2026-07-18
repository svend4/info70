import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { ampelBericht, zaehle, AMPEL, STANDARD } from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/kriterien.json', import.meta.url), 'utf8'));
const alle = daten.bereiche.flatMap((b) => b.kriterien);

test('Katalog: DSA-Bereiche, eindeutige IDs, Ampel-Hinweis', () => {
  assert.ok(daten.bereiche.length >= 4, 'mindestens 4 Bereiche');
  assert.match(daten.quelle, /Digital Services Act|DSA/, 'DSA als Grundlage');
  assert.match(daten.hinweis, /Ampel|kein offizielles|Selbstaudit/i, 'als Selbstaudit gekennzeichnet');
  const ids = alle.map((k) => k.id);
  assert.equal(new Set(ids).size, ids.length, 'doppelte IDs');
  assert.ok(alle.length >= 8, `mindestens 8 Kriterien (ist: ${alle.length})`);
});

test('jedes Kriterium: Aussage, Hilfe, DSA/JuSchG-Bezug', () => {
  for (const k of alle) {
    assert.ok(k.text.length >= 40, `${k.id}: Aussage zu kurz`);
    assert.ok(k.hilfe.length >= 60, `${k.id}: Hilfe zu kurz`);
    assert.match(k.bezug, /DSA|JuSchG|DSGVO/, `${k.id}: Bezug fehlt`);
  }
});

test('inhaltliche Abdeckung der DSA-Minderjährigenschutz-Themen', () => {
  const text = JSON.stringify(alle).toLowerCase();
  assert.match(text, /art\. 28/, 'Art. 28 Minderjährigenschutz');
  assert.match(text, /profiling|targeting/, 'kein Profiling-Werbetargeting');
  assert.match(text, /dark pattern|manipulativ/, 'keine Dark Patterns');
  assert.match(text, /melde/, 'Meldeweg');
  assert.match(text, /beschwerde/, 'Beschwerdeweg');
  assert.match(text, /verständlich|einfache|kindverständlich/, 'AGB kindverständlich');
});

test('Ampel: drei Zustände, Standard ist „offen“', () => {
  assert.deepEqual(Object.keys(AMPEL).sort(), ['grau', 'gruen', 'rot']);
  assert.equal(STANDARD, 'rot');
  const z = zaehle(alle, {}); // nichts bewertet
  assert.equal(z.rot, alle.length, 'ohne Bewertung alles offen');
  assert.equal(z.gruen, 0);
  assert.equal(z.grau, 0);
});

test('zaehle: mischt die Zustände korrekt', () => {
  const status = { [alle[0].id]: 'gruen', [alle[1].id]: 'grau' };
  const z = zaehle(alle, status);
  assert.equal(z.gruen, 1);
  assert.equal(z.grau, 1);
  assert.equal(z.rot, alle.length - 2);
});

test('ampelBericht: nennt Zählung, übernimmt Zustände und listet offene Punkte', () => {
  const status = {};
  status[alle[0].id] = 'gruen';
  status[alle[1].id] = 'grau';
  const bericht = ampelBericht(daten, status);
  assert.match(bericht, /🟢 erfüllt: 1/);
  assert.match(bericht, /⚪ nicht anwendbar: 1/);
  assert.match(bericht, new RegExp(`🔴 offen: ${alle.length - 2}`));
  assert.match(bericht, /Offen – als Nächstes umsetzen/, 'offene Liste vorhanden');
  assert.match(bericht, /DSA Art\. 28/, 'Bezug im Bericht');
  // vollständig grün -> keine Offen-Liste
  const allesGruen = Object.fromEntries(alle.map((k) => [k.id, 'gruen']));
  assert.ok(!/Offen – als Nächstes/.test(ampelBericht(daten, allesGruen)), 'ohne offene Punkte keine Offen-Liste');
});
