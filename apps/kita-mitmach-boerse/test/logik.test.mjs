import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { KOFFER_ART, KOFFER_VERSION, CODE_ZEICHEN, CODE_LAENGE, neuerCode, packeKoffer, pruefeKoffer,
  vereinige, zaehle, alleIds, pruefeDaten } from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/angebote.json', import.meta.url), 'utf8'));
const kopie = (x) => JSON.parse(JSON.stringify(x));

test('die Daten sind in Ordnung', () => {
  assert.deepEqual(pruefeDaten(daten), []);
});

test('dreizehn Formate und sechs Clubs – wie der Text sie nennt', () => {
  assert.equal(daten.formate.length, 13);
  assert.equal(daten.clubs.length, 6);
  assert.equal(alleIds(daten).length, 19);
});

test('kein erfundenes Format: „Näh-Werkstatt“ kommt im Text nicht vor', () => {
  // Nur die Angebote zählen; die Abweichung nennt den Namen absichtlich als Verneinung.
  assert.equal(/Näh-Werkstatt/.test(JSON.stringify([...daten.formate, ...daten.clubs])), false);
  const d = kopie(daten);
  d.formate.push({ id: 'f99', deutsch: 'Näh-Werkstatt', russisch: '–', quelle: 'S. 24' });
  assert.ok(pruefeDaten(d).some((f) => /Näh-Werkstatt/.test(f)));
});

test('jedes Angebot trägt seine Seite und die Quelle im Original', () => {
  for (const a of [...daten.formate, ...daten.clubs]) {
    assert.match(a.quelle, /^S\. 2[45]$/, a.id);
    assert.ok(a.russisch.length > 3, a.id);
  }
});

test('der Code: sechs Zeichen, ohne verwechselbare', () => {
  const bytes = [0, 1, 2, 3, 4, 5, 6, 7];
  const code = neuerCode(bytes);
  assert.equal(code.length, CODE_LAENGE);
  assert.ok([...code].every((c) => CODE_ZEICHEN.includes(c)));
  for (const verboten of ['0', 'O', '1', 'I']) assert.equal(CODE_ZEICHEN.includes(verboten), false, verboten);
  assert.throws(() => neuerCode([1, 2]), /zu wenige/);
});

test('die Datei enthält nur Code und Markierungen – und genau das wird gelesen', () => {
  const text = packeKoffer({ code: 'ABCDEF', stimmen: [{ id: 'f01', interessiert: true, mithilfe: false }] });
  const inhalt = JSON.parse(text);
  assert.deepEqual(Object.keys(inhalt).sort(), ['art', 'code', 'stimmen', 'version']);
  assert.deepEqual(pruefeKoffer(inhalt, daten), []);
});

test('eine Datei mit einem Namensfeld wird abgewiesen', () => {
  const inhalt = { art: KOFFER_ART, version: KOFFER_VERSION, code: 'ABCDEF', stimmen: [], name: 'Müller' };
  assert.ok(pruefeKoffer(inhalt, daten).some((f) => /unbekanntes Feld „name“/.test(f)));
});

test('eine Stimme mit Freitext oder fremder Kennung wird abgewiesen', () => {
  const inhalt = { art: KOFFER_ART, version: KOFFER_VERSION, code: 'ABCDEF',
    stimmen: [{ id: 'f01', interessiert: true, mithilfe: false, talent: 'singen' }, { id: 'x99', interessiert: true, mithilfe: true }] };
  const f = pruefeKoffer(inhalt, daten);
  assert.ok(f.some((x) => /„talent“/.test(x)));
  assert.ok(f.some((x) => /unbekanntes Angebot „x99“/.test(x)));
});

test('nur ja oder nein – kein Text als Stimme', () => {
  const inhalt = { art: KOFFER_ART, version: KOFFER_VERSION, code: 'ABCDEF',
    stimmen: [{ id: 'f01', interessiert: 'ja', mithilfe: false }] };
  assert.ok(pruefeKoffer(inhalt, daten).some((f) => /nur ja\/nein/.test(f)));
});

test('eine fremde Datei oder eine falsche Version wird abgewiesen', () => {
  assert.ok(pruefeKoffer({ art: 'anders', version: 1, code: 'ABCDEF', stimmen: [] }, daten).length > 0);
  assert.ok(pruefeKoffer({ art: KOFFER_ART, version: 9, code: 'ABCDEF', stimmen: [] }, daten).some((f) => /Version/.test(f)));
});

test('dieselbe Familie zweimal zählt einmal – die spätere Datei gilt', () => {
  const a = [{ code: 'ABCDEF', stimmen: [{ id: 'f01', interessiert: true, mithilfe: false }] }];
  const b = [{ code: 'ABCDEF', stimmen: [{ id: 'f01', interessiert: false, mithilfe: true }] }];
  const karte = vereinige([...a, ...b]);
  assert.equal(karte.size, 1);
  const z = zaehle(karte, daten);
  assert.equal(z.familien, 1);
  assert.deepEqual(z.summen.f01, { interessiert: 0, mithilfe: 1 });
});

test('die Summen nennen keine Codes und keine Namen', () => {
  const karte = vereinige([
    { code: 'ABCDEF', stimmen: [{ id: 'f02', interessiert: true, mithilfe: true }] },
    { code: 'GHJKLM', stimmen: [{ id: 'f02', interessiert: true, mithilfe: false }] },
  ]);
  const z = zaehle(karte, daten);
  assert.equal(z.familien, 2);
  assert.deepEqual(z.summen.f02, { interessiert: 2, mithilfe: 1 });
  assert.equal(/ABCDEF|GHJKLM/.test(JSON.stringify(z)), false);
});

test('ein Angebot zweimal in einer Datei wird abgewiesen – sonst zählte es doppelt', () => {
  const inhalt = JSON.parse(packeKoffer({ code: 'ABCDEF', stimmen: [{ id: 'f01', interessiert: true, mithilfe: false }] }));
  inhalt.stimmen.push({ id: 'f01', interessiert: true, mithilfe: false });
  assert.ok(pruefeKoffer(inhalt, daten).some((f) => /mehrfach/.test(f)));
});
