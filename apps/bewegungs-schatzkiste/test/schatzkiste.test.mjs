import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { filtereSpiele, zaehleJeKategorie } from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/spiele.json', import.meta.url), 'utf8'));

const KATEGORIE_IDS = daten.kategorien.map((k) => k.id);
const ALTERSBAENDER = ['1-3', '3-5', '5-7'];
const ORTE = ['drinnen', 'draussen'];
const PFLICHTFELDER = ['id', 'kategorie', 'titel', 'altersband', 'dauer', 'material', 'anleitung', 'ort', 'variante', 'inklusionsTipp'];

test('genau 7 Bewegungsarten und jede mit genau 4 Spielen (28 gesamt)', () => {
  assert.equal(daten.kategorien.length, 7, 'es müssen 7 Kategorien sein');
  assert.equal(daten.spiele.length, 28, 'es müssen 28 Spiele sein');
  const zaehl = zaehleJeKategorie(daten.spiele);
  for (const id of KATEGORIE_IDS) {
    assert.equal(zaehl[id], 4, `Kategorie ${id} muss genau 4 Spiele haben, hat ${zaehl[id] ?? 0}`);
  }
  // keine Karte in einer unbekannten Kategorie
  for (const s of daten.spiele) {
    assert.ok(KATEGORIE_IDS.includes(s.kategorie), `${s.id}: unbekannte Kategorie ${s.kategorie}`);
  }
});

test('Schema jeder Karte vollständig, IDs eindeutig, Werte gültig', () => {
  const ids = daten.spiele.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length, 'doppelte IDs');
  for (const s of daten.spiele) {
    for (const feld of PFLICHTFELDER) {
      assert.ok(s[feld] !== undefined && s[feld] !== '', `${s.id}: Pflichtfeld ${feld} fehlt`);
    }
    assert.ok(ALTERSBAENDER.includes(s.altersband), `${s.id}: unbekanntes Altersband ${s.altersband}`);
    assert.ok(Array.isArray(s.ort) && s.ort.length > 0, `${s.id}: ort leer`);
    for (const o of s.ort) assert.ok(ORTE.includes(o), `${s.id}: unbekannter Ort ${o}`);
    assert.ok(typeof s.material === 'string' && s.material.length > 0, `${s.id}: Material fehlt`);
  }
});

test('jede Anleitung hat mindestens 3 Schritte (max 5)', () => {
  for (const s of daten.spiele) {
    assert.ok(Array.isArray(s.anleitung), `${s.id}: anleitung ist keine Liste`);
    assert.ok(s.anleitung.length >= 3, `${s.id}: anleitung hat nur ${s.anleitung.length} Schritte`);
    assert.ok(s.anleitung.length <= 5, `${s.id}: anleitung hat ${s.anleitung.length} Schritte (max 5)`);
    for (const schritt of s.anleitung) {
      assert.ok(typeof schritt === 'string' && schritt.trim().length > 0, `${s.id}: leerer Anleitungsschritt`);
    }
  }
});

test('KEIN Feld liedtext (Kreis-/Ordnungsspiele nur als Typ beschrieben)', () => {
  for (const s of daten.spiele) {
    assert.ok(!('liedtext' in s), `${s.id}: verbotenes Feld liedtext`);
    // auch als Teil-String in keinem Textfeld auftauchend
    const alleTexte = JSON.stringify(s).toLowerCase();
    assert.ok(!alleTexte.includes('liedtext'), `${s.id}: enthält das Wort liedtext`);
  }
  // auch auf oberster Datenebene kein liedtext-Schlüssel
  assert.ok(!JSON.stringify(daten.kategorien).toLowerCase().includes('liedtext'));
});

test('alle drei Altersbänder und beide Orte sind vertreten', () => {
  const bands = new Set(daten.spiele.map((s) => s.altersband));
  for (const b of ALTERSBAENDER) assert.ok(bands.has(b), `kein Spiel im Altersband ${b}`);
  const orte = new Set(daten.spiele.flatMap((s) => s.ort));
  for (const o of ORTE) assert.ok(orte.has(o), `kein Spiel für Ort ${o}`);
});

test('filtereSpiele: Kategorie × Altersband × Ort', () => {
  // ohne Filter alle Spiele
  assert.equal(filtereSpiele(daten.spiele, {}).length, 28);
  assert.equal(filtereSpiele(daten.spiele).length, 28);

  // nur Kategorie
  const nurTanz = filtereSpiele(daten.spiele, { kategorie: 'tanz-musik' });
  assert.equal(nurTanz.length, 4);
  assert.ok(nurTanz.every((s) => s.kategorie === 'tanz-musik'));

  // nur Altersband
  const nurKlein = filtereSpiele(daten.spiele, { altersband: '1-3' });
  assert.ok(nurKlein.length > 0 && nurKlein.every((s) => s.altersband === '1-3'));

  // nur Ort - drinnen-Filter trifft auch Spiele, die drinnen UND draußen können
  const drinnen = filtereSpiele(daten.spiele, { ort: 'drinnen' });
  assert.ok(drinnen.every((s) => s.ort.includes('drinnen')));
  const draussen = filtereSpiele(daten.spiele, { ort: 'draussen' });
  assert.ok(draussen.every((s) => s.ort.includes('draussen')));

  // kombiniert
  const kombi = filtereSpiele(daten.spiele, { kategorie: 'fangspiele', ort: 'draussen' });
  assert.ok(kombi.every((s) => s.kategorie === 'fangspiele' && s.ort.includes('draussen')));
});

test('zaehleJeKategorie summiert korrekt', () => {
  const zaehl = zaehleJeKategorie(daten.spiele);
  const summe = Object.values(zaehl).reduce((a, b) => a + b, 0);
  assert.equal(summe, 28);
  assert.equal(Object.keys(zaehl).length, 7);
});
