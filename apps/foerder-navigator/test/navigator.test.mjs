import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { filtereProgramme, sortiereNachFrist, istAbgelaufen, anteilsRechnung } from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/programme.json', import.meta.url), 'utf8'));

const BEDARFE = ['digital', 'game', 'film', 'drehbuch', 'sichtbarkeit', 'weiterbildung'];
const SITZE = [null, 'bayern', 'nrw', 'mitteldeutschland'];
const STATI = ['termin', 'erwartet', 'laufend', 'geschlossen'];

test('Programmdaten: Schema vollständig, IDs eindeutig, Quellen verlinkt', () => {
  assert.ok(daten.programme.length >= 12, 'mindestens 12 Programme');
  assert.ok(daten.stand, 'Stand-Datum fehlt');
  const ids = daten.programme.map((p) => p.id);
  assert.equal(new Set(ids).size, ids.length, 'doppelte IDs');
  for (const p of daten.programme) {
    assert.ok(p.name && p.traeger && p.art && p.hoehe && p.wer, `${p.id}: Pflichtfeld fehlt`);
    assert.ok(p.quelle?.startsWith('http'), `${p.id}: Quelle fehlt`);
    assert.ok(STATI.includes(p.fristStatus), `${p.id}: unbekannter fristStatus`);
    assert.ok(Array.isArray(p.passtZu) && p.passtZu.length > 0, `${p.id}: passtZu leer`);
    for (const b of p.passtZu) assert.ok(BEDARFE.includes(b), `${p.id}: unbekannter Bedarf ${b}`);
    assert.ok(SITZE.includes(p.sitz), `${p.id}: unbekannter Sitz ${p.sitz}`);
    if (p.naechsteFrist !== null) {
      assert.match(p.naechsteFrist, /^\d{4}-\d{2}-\d{2}$/, `${p.id}: Frist kein ISO-Datum`);
    }
  }
});

test('jeder Bedarf hat mindestens ein Programm ohne Sitz-Anforderung erreichbar', () => {
  for (const bedarf of ['digital', 'film', 'drehbuch', 'sichtbarkeit']) {
    const treffer = filtereProgramme(daten.programme, { bedarf });
    assert.ok(treffer.length > 0, `kein Programm für ${bedarf}`);
  }
});

test('filtereProgramme: Sitz-Logik (null passt überall, Land nur passend)', () => {
  const nrw = filtereProgramme(daten.programme, { bedarf: 'game', sitz: 'nrw' });
  assert.ok(nrw.some((p) => p.id === 'nrw-games'));
  assert.ok(!nrw.some((p) => p.id === 'fff-games'), 'Bayern-Programm darf bei NRW-Sitz nicht erscheinen');
  const bayern = filtereProgramme(daten.programme, { bedarf: 'game', sitz: 'bayern' });
  assert.ok(bayern.some((p) => p.id === 'fff-games'));
});

test('sortiereNachFrist: Termine zuerst (aufsteigend), dann erwartet, laufend, geschlossen', () => {
  const heute = '2026-07-12';
  const sortiert = sortiereNachFrist(daten.programme, heute);
  const stati = sortiert.map((p) => p.fristStatus);
  const ersteLaufend = stati.indexOf('laufend');
  const letzterTermin = stati.lastIndexOf('termin');
  assert.ok(letzterTermin < ersteLaufend, 'Termine müssen vor laufenden stehen');
  assert.equal(stati[stati.length - 1], 'geschlossen', 'geschlossene ans Ende');
  const termine = sortiert.filter((p) => p.fristStatus === 'termin' && !istAbgelaufen(p, heute)).map((p) => p.naechsteFrist);
  assert.deepEqual(termine, [...termine].sort(), 'Termine aufsteigend sortiert');
});

test('anteilsRechnung: 80/20-Regel der BzKJ', () => {
  assert.deepEqual(anteilsRechnung(100000), { foerderung: 80000, eigenanteil: 20000, quote: 0.8 });
  assert.deepEqual(anteilsRechnung(0), { foerderung: 0, eigenanteil: 0, quote: 0.8 });
  assert.deepEqual(anteilsRechnung(-5), { foerderung: 0, eigenanteil: 0, quote: 0.8 });
  const nrw = anteilsRechnung(50000, 0.5);
  assert.equal(nrw.foerderung, 25000);
});
