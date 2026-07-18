import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pruefeKatalog, alleIndikatorIds } from '../logik.mjs';

const katalog = JSON.parse(await readFile(new URL('../daten/indikatoren.json', import.meta.url), 'utf8'));

test('Katalog: gültig (genau 3 Stufen, 5 Bereiche × 6 Indikatoren)', () => {
  assert.deepEqual(pruefeKatalog(katalog), []);
  assert.equal(katalog.stufen.length, 3);
  assert.equal(katalog.bereiche.length, 5);
  for (const b of katalog.bereiche) assert.equal(b.indikatoren.length, 6, `${b.id}: 6 Indikatoren`);
  assert.equal(alleIndikatorIds(katalog).length, 30);
});

test('Schulfähigkeit: als Beobachtung/kein Screening-Ersatz gekennzeichnet', () => {
  assert.match(katalog.hinweis, /keine? (Diagnose|Ersatz)|Schuleingangsverfahren/i);
  assert.match(JSON.stringify(katalog.berichtHinweis), /Schuleingangsverfahren|keine Diagnose/i);
  // ausdrücklich KEINE Schulreife-Note / kein Score
  assert.match(katalog.hinweis, /ohne Rangfolge|ohne Schulreife-Note|keine Namen/i);
});

test('inhaltliche Abdeckung der Schulreife-Bereiche', () => {
  const bereichIds = katalog.bereiche.map((b) => b.id).sort();
  assert.deepEqual(bereichIds, ['arbeit', 'mathe', 'motorik', 'sozial', 'sprache']);
  const alles = JSON.stringify(katalog.bereiche).toLowerCase();
  assert.match(alles, /reim|anlaut|silbe/, 'phonologische Bewusstheit');
  assert.match(alles, /menge|zähl|form/, 'frühe Mathematik');
  assert.match(alles, /stift|schere|spurt|graph/, 'Graphomotorik');
  assert.match(alles, /konzentr|regel|aufgabe/, 'Arbeitsverhalten');
  assert.match(alles, /gruppe|konflikt|toilette|trenn/, 'soziale/emotionale Reife & Selbstständigkeit');
});

test('jeder Indikator ist als beobachtbares Verhalten formuliert', () => {
  for (const b of katalog.bereiche) {
    for (const ind of b.indikatoren) {
      assert.ok(ind.text.length >= 25, `${ind.id}: zu kurz`);
      assert.ok(ind.id.startsWith(`${b.id}-`), `${ind.id}: Präfix`);
    }
  }
});
