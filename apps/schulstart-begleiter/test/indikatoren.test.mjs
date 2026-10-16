import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pruefeKatalog, alleAngebotIds, AUSWAHL, MIN_TEXTLAENGE } from '../logik.mjs';

const roh = await readFile(new URL('../daten/indikatoren.json', import.meta.url), 'utf8');
const katalog = JSON.parse(roh);

const BEREICH_IDS = ['sprache', 'mathe', 'motorik', 'arbeit', 'sozial'];
const BEREICH_NAMEN = [
  'Sprache & phonologische Bewusstheit',
  'Mengen & frühe Mathematik',
  'Fein- & Graphomotorik',
  'Konzentration & Arbeitsverhalten',
  'Soziale & emotionale Reife / Selbstständigkeit',
];
// Verben aus der Vorgängerfassung, mit denen ein Satz ÜBER EIN KIND beschrieben wurde.
// Ein Angebot beschreibt, was die Fachkraft tut; kein Wort davon darf im Angebot stehen.
const KIND_VERBEN = [
  'zählt', 'hört', 'erkennt', 'bildet', 'spricht', 'malt', 'schneidet', 'hält', 'bittet',
  'fädelt', 'benennt', 'vergleicht', 'löst', 'bleibt', 'führt', 'verfügt', 'zerlegt', 'spurt',
  'zeichnet', 'findet', 'beruhigt', 'setzt', 'ordnet', 'trennt', 'zieht', 'kann', 'geht',
  'wartet', 'nennt', 'gibt', 'erzählt',
];

test('Schema: genau 5 Bereiche in fester Reihenfolge mit je 6 Angeboten, Pflichtfelder gesetzt', () => {
  assert.deepEqual(pruefeKatalog(katalog), [], 'Katalog muss fehlerfrei sein');
  assert.ok(katalog.stand, 'Stand fehlt');
  assert.deepEqual(katalog.bereiche.map((b) => b.id), BEREICH_IDS, 'Bereichs-Kennungen und Reihenfolge');
  assert.deepEqual(katalog.bereiche.map((b) => b.name), BEREICH_NAMEN, 'die fünf Bereichsnamen sind unverändert');
  for (const b of katalog.bereiche) {
    assert.ok(b.emoji && b.fokus, `${b.id}: Emoji oder Fokus fehlt`);
    assert.equal(b.angebote.length, 6, `${b.id}: genau 6 Angebote`);
  }
});

test('Angebots-Kennungen sind global eindeutig, 30 insgesamt, mit Bereichs-Präfix', () => {
  const ids = alleAngebotIds(katalog);
  assert.equal(ids.length, 30, '5 Bereiche x 6 Angebote = 30');
  assert.equal(new Set(ids).size, ids.length, 'keine doppelten Angebots-Ids');
  for (const b of katalog.bereiche) {
    for (const p of b.angebote) {
      assert.ok(p.id.startsWith(`${b.id}-`), `${p.id}: Kennung muss zum Bereich ${b.id} gehören`);
    }
  }
});

test('Auswahl: genau drei Möglichkeiten (angeboten / noch offen / trifft nicht zu), keine Stufen', () => {
  assert.deepEqual(katalog.auswahl.map((a) => a.id), [AUSWAHL.angeboten, AUSWAHL.offen, AUSWAHL.nichtZu]);
  assert.deepEqual(katalog.auswahl.map((a) => a.text), ['angeboten', 'noch offen', 'trifft nicht zu']);
});

test('Jedes Angebot nennt genau ein Merkmal des eigenen Bereichs, und alle 30 Merkmale sind verschieden', () => {
  const merkmale = [];
  for (const b of katalog.bereiche) {
    for (const p of b.angebote) {
      assert.match(p.quelleMerkmal, new RegExp(`^${b.id}-[1-6]$`), `${p.id}: Merkmal ${p.quelleMerkmal} gehört nicht zu ${b.id}`);
      merkmale.push(p.quelleMerkmal);
    }
  }
  assert.equal(new Set(merkmale).size, 30, 'jedes Merkmal genau einmal');
});

test('Angebote sind ausformulierte Handlungen des Erwachsenen (mind. MIN_TEXTLAENGE Zeichen)', () => {
  for (const b of katalog.bereiche) {
    for (const p of b.angebote) {
      assert.ok(p.text.trim().length >= MIN_TEXTLAENGE, `${p.id}: Text zu kurz`);
    }
  }
});

test('Kein Angebot beschreibt ein Kind: keine Beobachtungs-Verben aus der Vorgängerfassung', () => {
  const befunde = [];
  for (const b of katalog.bereiche) {
    for (const p of b.angebote) {
      const worte = p.text.toLowerCase().split(/[^\p{L}-]+/u);
      for (const verb of KIND_VERBEN) {
        if (worte.includes(verb)) befunde.push(`${p.id}: „${verb}“`);
      }
    }
  }
  assert.deepEqual(befunde, [], befunde.join(' | '));
});

test('Keine Bewertungs-, Ranking-, Stufen-, Prozent- und Kürzel-Sprache im Datensatz', () => {
  const klein = roh.toLowerCase();
  for (const wort of [
    'score', 'ranking', 'rangliste', 'benotung', 'punktzahl', 'prozent', 'defizit',
    'bewertung', 'begabung', 'stufe', 'kürzel', 'ampel', 'schulreife-note',
  ]) {
    assert.ok(!klein.includes(wort), `verbotenes Wort im Datensatz: ${wort}`);
  }
  assert.ok(!klein.includes('%'), 'kein Prozentzeichen im Datensatz');
});
