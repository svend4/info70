import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  MAX_KUERZEL, normalisiereKuerzel, kuerzelOk,
  alleStufenIds, zaehleDokumentiert, berichtFuerKind,
} from '../logik.mjs';

const katalog = JSON.parse(await readFile(new URL('../daten/indikatoren.json', import.meta.url), 'utf8'));

test('Kürzel: max 3 Zeichen, keine Namen', () => {
  assert.equal(MAX_KUERZEL, 3);
  assert.equal(normalisiereKuerzel('  ABCDEF '), 'ABC');
  assert.equal(kuerzelOk('AB'), true);
  assert.equal(kuerzelOk(''), false);
  assert.equal(kuerzelOk('ABCD'), false);
  assert.equal(kuerzelOk(42), false);
});

test('zaehleDokumentiert: nur gültige Stufen zählen', () => {
  const ids = katalog.bereiche.flatMap((b) => b.indikatoren.map((i) => i.id));
  const stufe = alleStufenIds(katalog)[0];
  assert.equal(zaehleDokumentiert(katalog, {}), 0);
  assert.equal(zaehleDokumentiert(katalog, { [ids[0]]: stufe, [ids[1]]: 'quatsch' }), 1);
  const alle = Object.fromEntries(ids.map((id) => [id, stufe]));
  assert.equal(zaehleDokumentiert(katalog, alle), 30);
});

test('berichtFuerKind: Kopf/Hinweis aus Katalog, keine Zahlenwertung', () => {
  const ids = katalog.bereiche.flatMap((b) => b.indikatoren.map((i) => i.id));
  const stufe = alleStufenIds(katalog)[2]; // "sicher"
  const bericht = berichtFuerKind(katalog, 'AB', { [ids[0]]: stufe }, '18.07.2026');
  assert.match(bericht, /Schulstart-Begleiter/);
  assert.match(bericht, /Kürzel\): AB/);
  assert.match(bericht, /Stand: 18\.07\.2026/);
  assert.match(bericht, /Schuleingangsverfahren/);
  // dokumentierte Stufe erscheint, offene als (offen)/offen
  assert.match(bericht, /\[sicher\]/);
  assert.match(bericht, /\[offen\]/);
  // KEINE Zahlenwertung: kein Prozent, keine Punkte, kein "X/Y"-Score im Bericht
  assert.ok(!/%|Punkte|\d+\s*\/\s*\d+/.test(bericht), 'kein Score/Prozent/Zähler');
  // alle Bereiche vertreten
  for (const b of katalog.bereiche) assert.ok(bericht.includes(b.name), `Bereich ${b.name} im Bericht`);
});
