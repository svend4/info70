import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { ZUSTAENDE, STANDARD, alleMuster, zaehle, befunde, behobene, bericht } from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/muster.json', import.meta.url), 'utf8'));
const alle = alleMuster(daten);

test('Katalog: Kategorien, Muster mit vollständigen Feldern, eindeutige IDs', () => {
  assert.ok(daten.kategorien.length >= 3, 'mindestens 3 Kategorien');
  assert.ok(alle.length >= 10, `mindestens 10 Muster (ist: ${alle.length})`);
  const ids = alle.map((m) => m.id);
  assert.equal(new Set(ids).size, ids.length, 'doppelte IDs');
  for (const m of alle) {
    assert.ok(m.name.length >= 4, `${m.id}: Name`);
    assert.ok(m.beispiel.length >= 15, `${m.id}: Beispiel`);
    assert.ok(m.kindWirkung.length >= 20, `${m.id}: Kind-Wirkung`);
    assert.ok(m.faireAlternative.length >= 15, `${m.id}: faire Alternative`);
    assert.match(m.bezug, /DSA|JuSchG|JMStV|DSGVO|KRK|GC25/, `${m.id}: Bezug`);
  }
});

test('inhaltliche Abdeckung: zentrale Muster vorhanden', () => {
  const text = JSON.stringify(alle).toLowerCase();
  assert.match(text, /countdown|verknappung/);
  assert.match(text, /versteckte kosten/);
  assert.match(text, /confirmshaming|beschämung/);
  assert.match(text, /endlos|autoplay/);
  assert.match(text, /lootbox|glücksspiel/);
});

test('Zustände: vier Zustände, Standard ungeprüft', () => {
  assert.deepEqual(Object.keys(ZUSTAENDE).sort(), ['behoben', 'frei', 'gefunden', 'ungeprueft']);
  assert.equal(STANDARD, 'ungeprueft');
  const z = zaehle(alle, {});
  assert.equal(z.ungeprueft, alle.length);
  assert.equal(z.gefunden, 0);
});

test('zaehle: mischt Zustände korrekt', () => {
  const status = { [alle[0].id]: 'gefunden', [alle[1].id]: 'behoben', [alle[2].id]: 'frei' };
  const z = zaehle(alle, status);
  assert.equal(z.gefunden, 1);
  assert.equal(z.behoben, 1);
  assert.equal(z.frei, 1);
  assert.equal(z.ungeprueft, alle.length - 3);
});

test('befunde / behobene', () => {
  const status = { [alle[0].id]: 'gefunden', [alle[1].id]: 'behoben' };
  const bef = befunde(daten, status);
  assert.equal(bef.length, 1);
  assert.equal(bef[0].id, alle[0].id);
  const fix = behobene(daten, status);
  assert.equal(fix.length, 1);
  assert.equal(fix[0].id, alle[1].id);
});

test('bericht: Zählung, offene Befunde mit Abstellmaßnahme, behobene', () => {
  const status = { [alle[0].id]: 'gefunden', [alle[1].id]: 'behoben' };
  const b = bericht(daten, status);
  assert.match(b, /Dark-Pattern-Selbstinspektion – Bericht/);
  assert.match(b, /🔴 gefunden: 1/);
  assert.match(b, /Offene Befunde – Abstellmaßnahmen/);
  assert.match(b, new RegExp(alle[0].faireAlternative.slice(0, 12).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.match(b, /## Behoben/);
  assert.match(b, /kein offizielles Ergebnis/);

  // ohne Markierung: Hinweis-Text
  assert.match(bericht(daten, {}), /Noch keine Befunde markiert/);
});
