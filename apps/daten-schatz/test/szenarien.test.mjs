import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const daten = JSON.parse(await readFile(new URL('../daten/szenarien.json', import.meta.url), 'utf8'));
const CODES = ['geben', 'ablehnen', 'fragen'];

test('Szenarienbank: Grundstruktur und eindeutige IDs', () => {
  assert.equal(daten.version, 1);
  assert.ok(daten.szenarien.length >= 10, 'mindestens 10 Szenarien');
  const ids = daten.szenarien.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(daten.raenge[0].ab, 0, 'erster Rang beginnt bei 0');
  const maxAb = Math.max(...daten.raenge.map((r) => r.ab));
  assert.ok(maxAb <= daten.szenarien.length * 2, 'höchster Rang ist erreichbar');
});

test('jedes Szenario: vollständig, beste/auchOk konsistent', () => {
  for (const s of daten.szenarien) {
    assert.ok(s.situation?.length >= 20, `${s.id}: Situation fehlt/zu kurz`);
    assert.ok(s.erklaerung?.length >= 30, `${s.id}: Erklärung fehlt/zu kurz (dort passiert das Lernen!)`);
    assert.ok(CODES.includes(s.beste), `${s.id}: beste muss ${CODES.join('/')} sein`);
    assert.ok(Array.isArray(s.auchOk), `${s.id}: auchOk fehlt`);
    for (const code of s.auchOk) {
      assert.ok(CODES.includes(code), `${s.id}: unbekannter auchOk-Code ${code}`);
      assert.notEqual(code, s.beste, `${s.id}: beste darf nicht in auchOk stehen`);
    }
  }
});

test('didaktische Balance: alle drei Antworttypen kommen als beste Antwort vor', () => {
  const beste = new Set(daten.szenarien.map((s) => s.beste));
  for (const code of CODES) {
    assert.ok(beste.has(code), `"${code}" ist nie die beste Antwort - Kinder lernen sonst ein starres Muster statt Abwägen`);
  }
});

test('Kostenfallen-Paket vorhanden (Pipeline-Idee 11, Gefährdungsatlas-Kapitel)', () => {
  const kostenfallen = daten.szenarien.filter((s) => /€|abo|juwel|lootbox|truhe|kauf/i.test(JSON.stringify(s)));
  assert.ok(kostenfallen.length >= 5, 'mindestens 5 Kostenfallen-Szenarien');
  const alles = JSON.stringify(daten.szenarien);
  assert.ok(/lootbox/i.test(alles), 'Lootbox-Mechanik muss vorkommen');
  assert.ok(/abo/i.test(alles), 'Abo-Trick muss vorkommen');
});
