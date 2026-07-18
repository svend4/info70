import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const daten = JSON.parse(await readFile(new URL('../daten/szenarien.json', import.meta.url), 'utf8'));

test('Szenarienbank: Grundstruktur, eindeutige IDs, Lehrkräfte-Zielgruppe', () => {
  assert.equal(daten.version, 1);
  assert.equal(daten.zielgruppe, 'Lehrkraefte');
  assert.ok(daten.szenarien.length >= 6, 'mindestens 6 Situationen');
  const ids = daten.szenarien.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length, 'doppelte IDs');
});

test('jedes Szenario: 2/1/0 mit genau einem stärksten Zug und einer Falle', () => {
  for (const s of daten.szenarien) {
    assert.ok(s.situation?.length >= 20, `${s.id}: Situation zu kurz`);
    assert.ok(s.erklaerung?.length >= 40, `${s.id}: Erklärung zu kurz`);
    assert.equal(s.optionen.length, 3, `${s.id}: genau 3 Optionen`);
    const werte = s.optionen.map((o) => o.wert);
    assert.equal(werte.filter((w) => w === 2).length, 1, `${s.id}: genau EIN stärkster Zug`);
    assert.ok(werte.includes(0), `${s.id}: mindestens eine Falle (wert 0)`);
    for (const o of s.optionen) assert.ok([0, 1, 2].includes(o.wert), `${s.id}: wert 0/1/2`);
  }
});

test('inhaltliche Abdeckung der Katalog-Themen (Kettenbrief, Mobbing, Chat-Eskalation, Lootbox)', () => {
  const alles = JSON.stringify(daten.szenarien).toLowerCase();
  assert.match(alles, /kettenbrief/, 'Kettenbrief');
  assert.match(alles, /mobbing/, 'Mobbing-Screenshot');
  assert.match(alles, /klassenchat|chat/, 'Chat-Eskalation');
  assert.match(alles, /lootbox/, 'Lootbox-Schulden');
});

test('Cybergrooming: nur Verweis auf Fachstellen, keine Selbstermittlung als beste Antwort', () => {
  const grooming = daten.szenarien.find((s) => /grooming/i.test(JSON.stringify(s)));
  assert.ok(grooming, 'Grooming-Szenario vorhanden');
  const beste = grooming.optionen.find((o) => o.wert === 2);
  assert.match(beste.text, /nicht selbst|fachstelle|polizei|schulleitung|beratung/i, 'beste Option verweist an Fachstellen');
  assert.match(grooming.erklaerung, /nicht selbst ermitteln|fachstelle|polizei/i, 'Erklärung mahnt zur Übergabe an Fachstellen');
});

test('Verweise/Meldewege vorhanden (jugendschutz.net, 116 111)', () => {
  assert.ok(Array.isArray(daten.verweise) && daten.verweise.length >= 3);
  const alles = daten.verweise.join(' ');
  assert.match(alles, /jugendschutz\.net/);
  assert.match(alles, /116 111/);
});
