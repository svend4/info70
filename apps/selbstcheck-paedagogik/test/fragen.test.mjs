import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { STUFEN_REIHENFOLGE } from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/fragen.json', import.meta.url), 'utf8'));

const BEREICH_IDS = ['kinder', 'eltern', 'balance', 'stil'];

test('Schema: genau 4 Bereiche mit je 6 Aussagen, IDs eindeutig', () => {
  assert.ok(daten.stand, 'Stand-Datum fehlt');
  assert.equal(daten.bereiche.length, 4, 'genau 4 Bereiche');
  assert.deepEqual(daten.bereiche.map((b) => b.id), BEREICH_IDS, 'Bereichs-Kennungen');
  for (const b of daten.bereiche) {
    assert.ok(b.name && b.emoji && b.fokus, `${b.id}: Pflichtfeld fehlt`);
    assert.equal(b.aussagen.length, 6, `${b.id}: genau 6 Aussagen`);
  }
  const ids = daten.bereiche.flatMap((b) => b.aussagen.map((a) => a.id));
  assert.equal(new Set(ids).size, ids.length, 'doppelte Aussage-IDs');
  for (const b of daten.bereiche) {
    for (const a of b.aussagen) {
      assert.ok(a.id.startsWith(`${b.id}-`), `${a.id}: Kennung muss zum Bereich ${b.id} gehören`);
    }
  }
});

test('Texte: Aussage, Stärke und Impuls je mindestens 20 Zeichen', () => {
  for (const b of daten.bereiche) {
    assert.ok(typeof b.impulsWennStark === 'string' && b.impulsWennStark.length >= 20,
      `${b.id}: impulsWennStark zu kurz`);
    for (const a of b.aussagen) {
      for (const feld of ['text', 'staerke', 'impuls']) {
        assert.ok(typeof a[feld] === 'string' && a[feld].length >= 20,
          `${a.id}: Feld "${feld}" fehlt oder ist kürzer als 20 Zeichen`);
      }
    }
  }
});

test('Stufen: 4-stufige Selbsteinschätzung, eindeutig, passend zur Logik', () => {
  assert.equal(daten.stufen.length, 4, 'genau 4 Stufen');
  const ids = daten.stufen.map((s) => s.id);
  assert.equal(new Set(ids).size, 4, 'Stufen-Kennungen eindeutig');
  for (const s of daten.stufen) {
    assert.ok(Object.hasOwn(STUFEN_REIHENFOLGE, s.id), `Stufe ${s.id} ist der Logik unbekannt`);
    assert.ok(s.text.startsWith('trifft'), `Stufe ${s.id}: Text muss eine "trifft ..."-Formulierung sein`);
  }
});

test('Keine Bewertungs-/Diagnose-Sprache im Datensatz (Selbstreflexion, kein Scoring)', () => {
  const roh = JSON.stringify(daten).toLowerCase();
  for (const wort of ['score', 'ranking', 'rangliste', 'diagnose', 'benotung', 'bewertung', 'defizit', 'punktzahl']) {
    assert.ok(!roh.includes(wort), `verbotenes Wort im Datensatz: ${wort}`);
  }
});
