import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const daten = JSON.parse(await readFile(new URL('../daten/bereiche.json', import.meta.url), 'utf8'));

test('bereiche.json: genau 6 Bildungsbereiche, eindeutig und vollständig', () => {
  assert.equal(daten.bereiche.length, 6);
  const ids = daten.bereiche.map((b) => b.id);
  assert.equal(new Set(ids).size, ids.length, 'doppelte Bereichs-IDs');
  assert.deepEqual(
    new Set(ids),
    new Set(['bewegung', 'sprache', 'musik-kunst', 'natur-umwelt', 'mathe-technik', 'sozial-gefuehle']),
    'die 6 vereinbarten Bereiche',
  );
  for (const b of daten.bereiche) {
    assert.ok(b.name && b.emoji, `${b.id}: Pflichtfeld fehlt`);
    assert.ok(typeof b.beispiele === 'string' && b.beispiele.length >= 10, `${b.id}: Beispiele fehlen`);
  }
});

test('bereiche.json: Altersgruppen mit Richtwerten, als Empfehlung formuliert', () => {
  assert.deepEqual(daten.altersgruppen.map((g) => g.id), ['1-3', '3-5', '5-7']);
  const max = Object.fromEntries(daten.altersgruppen.map((g) => [g.id, g.maxMinutenProAngebot]));
  assert.deepEqual(max, { '1-3': 15, '3-5': 20, '5-7': 25 }, 'Obergrenzen 15/20/25 min (S. 10)');
  const woche = Object.fromEntries(daten.altersgruppen.map((g) => [g.id, g.maxAngeboteProWoche]));
  assert.deepEqual(woche, { '1-3': 10, '3-5': 15, '5-7': 17 }, 'Anzahl je Woche (S. 9-10)');
  for (const g of daten.altersgruppen) {
    assert.ok(Number.isInteger(g.maxMinutenProAngebot) && g.maxMinutenProAngebot > 0, `${g.id}: Richtwert ungültig`);
    assert.ok(typeof g.warntext === 'string' && g.warntext.length >= 40, `${g.id}: Warntext zu kurz`);
    assert.match(g.warntext, /Empfehlung/, `${g.id}: Warntext muss als Empfehlung formuliert sein`);
  }
});

test('bereiche.json: Tageslast-Hinweis (Freispiel-Vorrang) und Wochen-Hinweis', () => {
  assert.equal(daten.tagesHinweis.maxAngeboteProTag, 3);
  assert.match(daten.tagesHinweis.warntext, /Freispiel/, 'Freispiel-Vorrang muss benannt sein');
  assert.ok(daten.tagesHinweis.warntext.length >= 40);
  assert.ok(daten.wochenHinweis.warntext.includes('{bereich}'), 'Platzhalter {bereich} fehlt');
  for (const platz of ['{gruppe}', '{anzahl}', '{max}']) {
    assert.ok(daten.wochenLastHinweis.warntext.includes(platz), `Platzhalter ${platz} fehlt`);
  }
  assert.match(daten.wochenLastHinweis.warntext, /Empfehlung/);
});

test('bereiche.json: keine Bewertungs-Sprache über Kinder (AI-Act-Politik)', () => {
  const text = JSON.stringify(daten).toLowerCase();
  for (const verboten of ['score', 'ranking', 'diagnose', 'defizit', 'leistungsnorm']) {
    assert.ok(!text.includes(verboten), `verbotenes Wort im Datenbestand: ${verboten}`);
  }
});
