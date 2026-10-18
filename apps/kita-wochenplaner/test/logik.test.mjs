import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { TAGE, minutenJeBereich, angeboteFuerTag, pruefePlan, neueId } from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/bereiche.json', import.meta.url), 'utf8'));

let laufnummer = 0;
const angebot = (extra = {}) => ({
  id: `t-${laufnummer++}`,
  tag: 'mo',
  bereich: 'bewegung',
  alter: '3-5',
  dauer: 15,
  titel: 'Testangebot',
  ...extra,
});

test('TAGE: Wochenraster Montag bis Freitag', () => {
  assert.deepEqual(TAGE.map((t) => t.id), ['mo', 'di', 'mi', 'do', 'fr']);
  for (const t of TAGE) assert.ok(t.name.length > 0);
});

test('minutenJeBereich summiert je Bildungsbereich', () => {
  const summen = minutenJeBereich([
    angebot({ bereich: 'bewegung', dauer: 10 }),
    angebot({ bereich: 'bewegung', dauer: 20 }),
    angebot({ bereich: 'sprache', dauer: 15 }),
  ]);
  assert.deepEqual(summen, { bewegung: 30, sprache: 15 });
  assert.deepEqual(minutenJeBereich([]), {});
});

test('angeboteFuerTag filtert nach Wochentag', () => {
  const liste = [angebot({ tag: 'mo' }), angebot({ tag: 'fr' }), angebot({ tag: 'mo' })];
  assert.equal(angeboteFuerTag(liste, 'mo').length, 2);
  assert.equal(angeboteFuerTag(liste, 'mi').length, 0);
});

test('pruefePlan: leerer Plan liefert keine Hinweise', () => {
  assert.deepEqual(pruefePlan([], daten), []);
});

test('pruefePlan: Dauer-Richtwerte 15/20/25 min, Grenze inklusive', () => {
  const genauAnDerGrenze = [
    angebot({ alter: '1-3', dauer: 15 }),
    angebot({ alter: '3-5', dauer: 20 }),
    angebot({ alter: '5-7', dauer: 25 }),
  ];
  assert.ok(!pruefePlan(genauAnDerGrenze, daten).some((h) => h.typ === 'dauer'), 'Grenzwert selbst löst keinen Hinweis aus');

  for (const [alter, dauer] of [['1-3', 16], ['3-5', 21], ['5-7', 26]]) {
    const hinweise = pruefePlan([angebot({ alter, dauer })], daten);
    const treffer = hinweise.filter((h) => h.typ === 'dauer');
    assert.equal(treffer.length, 1, `${alter} mit ${dauer} min muss Hinweis auslösen`);
    assert.match(treffer[0].text, /Empfehlung/, 'als Empfehlung formuliert');
    assert.match(treffer[0].text, /Montag/, 'Tag wird genannt');
  }
});

test('pruefePlan: mehr als 3 Angebote am Tag -> Freispiel-Hinweis', () => {
  const vierAnEinemTag = [1, 2, 3, 4].map(() => angebot({ dauer: 10 }));
  const hinweise = pruefePlan(vierAnEinemTag, daten).filter((h) => h.typ === 'tageslast');
  assert.equal(hinweise.length, 1);
  assert.equal(hinweise[0].tag, 'mo');
  assert.match(hinweise[0].text, /Freispiel/);

  const dreiAnEinemTag = [1, 2, 3].map(() => angebot({ dauer: 10 }));
  assert.ok(!pruefePlan(dreiAnEinemTag, daten).some((h) => h.typ === 'tageslast'), '3 Angebote sind ok');
});

test('pruefePlan: leere Bereiche werden nur bei nicht-leerem Plan gemeldet', () => {
  const hinweise = pruefePlan([angebot({ bereich: 'bewegung', dauer: 10 })], daten);
  const leere = hinweise.filter((h) => h.typ === 'leerer-bereich');
  assert.equal(leere.length, 5, 'alle Bereiche außer bewegung');
  assert.ok(!leere.some((h) => h.bereich === 'bewegung'));
  assert.ok(leere.every((h) => !h.text.includes('{bereich}')), 'Platzhalter ist ersetzt');
});

test('pruefePlan: Wochen-Richtwert je Altersgruppe, Grenze inklusive', () => {
  const genauAnDerGrenze = Array.from({ length: 10 }, (_, i) => angebot({ alter: '1-3', dauer: 10, tag: ['mo', 'di', 'mi'][i % 3] }));
  assert.ok(!pruefePlan(genauAnDerGrenze, daten).some((h) => h.typ === 'wochenlast'), '10 Angebote für 1-3 sind ok');

  const elf = [...genauAnDerGrenze, angebot({ alter: '1-3', dauer: 10, tag: 'fr' })];
  const treffer = pruefePlan(elf, daten).filter((h) => h.typ === 'wochenlast');
  assert.equal(treffer.length, 1, '11 Angebote für 1-3 lösen genau einen Hinweis aus');
  assert.equal(treffer[0].alter, '1-3');
  assert.match(treffer[0].text, /1-3 Jahre/);
  assert.match(treffer[0].text, /11 Angebote/);
  assert.match(treffer[0].text, /bis 10/);
  assert.match(treffer[0].text, /Empfehlung/);
});

test('pruefePlan: unbekannte Altersgruppe löst keinen Dauer-Hinweis aus (defensiv)', () => {
  const hinweise = pruefePlan([angebot({ alter: 'unbekannt', dauer: 90 })], daten);
  assert.ok(!hinweise.some((h) => h.typ === 'dauer'));
});

test('neueId liefert eindeutige Kennungen', () => {
  const ids = new Set(Array.from({ length: 200 }, () => neueId()));
  assert.equal(ids.size, 200);
});
