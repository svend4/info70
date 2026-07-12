import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pruefeKatalog, alleIndikatorIds, alleStufenIds } from '../logik.mjs';

const katalog = JSON.parse(await readFile(new URL('../daten/indikatoren.json', import.meta.url), 'utf8'));

const BEREICH_IDS = ['bewegung', 'sprache', 'sozial', 'denken', 'spiel'];
const STUFEN_IDS = ['noch-nicht', 'manchmal', 'sicher'];

test('Schema: genau 5 Bereiche mit je 6 beobachtbaren Indikatoren', () => {
  assert.deepEqual(pruefeKatalog(katalog), [], 'Katalog muss fehlerfrei sein');
  assert.ok(katalog.stand, 'Stand fehlt');
  assert.equal(katalog.bereiche.length, 5, 'genau 5 Bereiche');
  assert.deepEqual(katalog.bereiche.map((b) => b.id), BEREICH_IDS, 'Bereichs-Kennungen und Reihenfolge');
  for (const b of katalog.bereiche) {
    assert.ok(b.name && b.emoji && b.fokus, `${b.id}: Pflichtfeld fehlt`);
    assert.equal(b.indikatoren.length, 6, `${b.id}: genau 6 Indikatoren`);
  }
});

test('Indikator-Kennungen sind global eindeutig und tragen das Bereichs-Präfix', () => {
  const ids = alleIndikatorIds(katalog);
  assert.equal(ids.length, 30, '5 Bereiche x 6 Indikatoren = 30');
  assert.equal(new Set(ids).size, ids.length, 'keine doppelten Indikator-Ids');
  for (const b of katalog.bereiche) {
    for (const ind of b.indikatoren) {
      assert.ok(ind.id.startsWith(`${b.id}-`), `${ind.id}: Kennung muss zum Bereich ${b.id} gehören`);
    }
  }
});

test('Stufen: genau 3 (noch nicht / manchmal / sicher), eindeutig', () => {
  assert.equal(katalog.stufen.length, 3, 'genau 3 Stufen');
  assert.deepEqual(alleStufenIds(katalog), STUFEN_IDS, 'Stufen-Kennungen');
  assert.equal(new Set(alleStufenIds(katalog)).size, 3, 'Stufen eindeutig');
  for (const s of katalog.stufen) assert.ok(s.text.length > 0, `Stufe ${s.id}: Text fehlt`);
});

test('Indikator-Texte sind neu formulierte, beobachtbare Sätze (mind. 20 Zeichen)', () => {
  for (const b of katalog.bereiche) {
    for (const ind of b.indikatoren) {
      assert.ok(typeof ind.text === 'string' && ind.text.trim().length >= 20,
        `${ind.id}: Text fehlt oder ist kürzer als 20 Zeichen`);
    }
  }
});

test('Keine Scoring-/Ranking-Sprache im Datensatz (Beobachtung, kein Score/Ranking)', () => {
  const roh = JSON.stringify(katalog).toLowerCase();
  for (const wort of ['score', 'ranking', 'rangliste', 'benotung', 'punktzahl', 'punkte', 'defizit', 'bewertung', 'begabung']) {
    assert.ok(!roh.includes(wort), `verbotenes Wort im Datensatz: ${wort}`);
  }
});

test('pruefeKatalog erkennt kaputte Kataloge', () => {
  assert.ok(pruefeKatalog(null).length > 0);
  assert.ok(pruefeKatalog({}).length > 0);
  assert.ok(pruefeKatalog({ bereiche: [], stufen: [] }).some((f) => f.includes('5 Bereiche')));

  const zuWenigInd = structuredClone(katalog);
  zuWenigInd.bereiche[0].indikatoren.pop();
  assert.ok(pruefeKatalog(zuWenigInd).some((f) => f.includes('6 beobachtbare Indikatoren')));

  const zuVieleStufen = structuredClone(katalog);
  zuVieleStufen.stufen.push({ id: 'extra', text: 'zu viel' });
  assert.ok(pruefeKatalog(zuVieleStufen).some((f) => f.includes('3 Stufen')));

  const doppelteId = structuredClone(katalog);
  doppelteId.bereiche[1].indikatoren[0].id = doppelteId.bereiche[0].indikatoren[0].id;
  assert.ok(pruefeKatalog(doppelteId).some((f) => f.includes('doppelt') || f.includes('gehören')));

  const falschesPraefix = structuredClone(katalog);
  falschesPraefix.bereiche[2].indikatoren[0].id = 'fremd-1';
  assert.ok(pruefeKatalog(falschesPraefix).some((f) => f.includes('gehören')));
});
