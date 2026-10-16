import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pruefeKatalog, allePruefpunktIds, AUSWAHL, MIN_TEXTLAENGE } from '../logik.mjs';

const katalog = JSON.parse(await readFile(new URL('../daten/indikatoren.json', import.meta.url), 'utf8'));

const BEREICH_IDS = ['bewegung', 'sprache', 'sozial', 'denken', 'spiel'];

test('Schema: genau 5 Bereiche mit je 6 Prüfpunkten, Pflichtfelder gesetzt', () => {
  assert.deepEqual(pruefeKatalog(katalog), [], 'Katalog muss fehlerfrei sein');
  assert.ok(katalog.stand, 'Stand fehlt');
  assert.deepEqual(katalog.bereiche.map((b) => b.id), BEREICH_IDS, 'Bereichs-Kennungen und Reihenfolge');
  for (const b of katalog.bereiche) {
    assert.ok(b.name && b.emoji && b.fokus, `${b.id}: Pflichtfeld fehlt`);
    assert.equal(b.angebote.length, 6, `${b.id}: genau 6 Prüfpunkte`);
  }
});

test('Prüfpunkt-Kennungen sind global eindeutig, 30 insgesamt, mit Bereichs-Präfix', () => {
  const ids = allePruefpunktIds(katalog);
  assert.equal(ids.length, 30, '5 Bereiche x 6 Prüfpunkte = 30');
  assert.equal(new Set(ids).size, ids.length, 'keine doppelten Prüfpunkt-Ids');
  for (const b of katalog.bereiche) {
    for (const p of b.angebote) {
      assert.ok(p.id.startsWith(`${b.id}-`), `${p.id}: Kennung muss zum Bereich ${b.id} gehören`);
    }
  }
});

test('Auswahl: genau drei Möglichkeiten (umgesetzt / noch offen / trifft nicht zu), keine Stufen', () => {
  assert.deepEqual(katalog.auswahl.map((a) => a.id), [AUSWAHL.umgesetzt, AUSWAHL.offen, AUSWAHL.nichtZu]);
  assert.deepEqual(katalog.auswahl.map((a) => a.text), ['umgesetzt', 'noch offen', 'trifft nicht zu']);
});

test('Prüfpunkte sind ausformulierte Angebots-Sätze (mind. MIN_TEXTLAENGE Zeichen)', () => {
  for (const b of katalog.bereiche) {
    for (const p of b.angebote) {
      assert.ok(p.text.trim().length >= MIN_TEXTLAENGE, `${p.id}: Text zu kurz`);
    }
  }
});

test('Jeder Prüfpunkt trägt eine Merkmal-Kennung aus dem Register, und jedes Merkmal wird genutzt', () => {
  const genutzt = new Set();
  for (const b of katalog.bereiche) {
    for (const p of b.angebote) {
      assert.ok(katalog.merkmale[p.quelleMerkmal], `${p.id}: Merkmal ${p.quelleMerkmal} fehlt im Register`);
      genutzt.add(p.quelleMerkmal);
    }
  }
  for (const kennung of Object.keys(katalog.merkmale)) {
    assert.ok(genutzt.has(kennung), `${kennung}: im Register, aber von keinem Prüfpunkt genutzt`);
  }
});

test('Merkmal-Register: Kennung passt zur Seite (17–19), Wortlaut ist ein russischer Quellauszug', () => {
  for (const [kennung, m] of Object.entries(katalog.merkmale)) {
    assert.match(kennung, /^S1[789]\.\d{1,2}$/, `${kennung}: Kennungsform`);
    assert.ok([17, 18, 19].includes(m.seite), `${kennung}: Seite außerhalb S. 17–19`);
    assert.equal(m.seite, Number(kennung.slice(1, 3)), `${kennung}: Seite passt nicht zur Kennung`);
    assert.match(m.wortlaut, /[а-яё]/i, `${kennung}: Wortlaut ist kein russischer Auszug`);
  }
});

test('Keine Scoring-, Ranking-, Stufen- und Prozent-Sprache im Datensatz', () => {
  const roh = JSON.stringify(katalog).toLowerCase();
  for (const wort of [
    'score', 'ranking', 'rangliste', 'benotung', 'punktzahl', 'punkte', 'prozent',
    'defizit', 'bewertung', 'begabung', 'stufe', 'kürzel', 'ampel',
  ]) {
    assert.ok(!roh.includes(wort), `verbotenes Wort im Datensatz: ${wort}`);
  }
  assert.ok(!roh.includes('%'), 'kein Prozentzeichen im Datensatz');
});
