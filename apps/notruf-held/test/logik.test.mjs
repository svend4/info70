import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  NOTRUFNUMMERN, nurZiffern, istNotrufnummer, pruefeAnruf, rueckmeldung, bewerteRunde,
} from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/situationen.json', import.meta.url), 'utf8'));
const situationen = daten.situationen;

test('Daten: Situationen mit gültiger Notrufnummer, Warum, Schritte', () => {
  assert.ok(situationen.length >= 6, `mindestens 6 Situationen (ist: ${situationen.length})`);
  const ids = situationen.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length, 'IDs eindeutig');
  for (const s of situationen) {
    assert.ok(NOTRUFNUMMERN.includes(s.nummer), `${s.id}: gültige Nummer`);
    assert.ok(s.situation?.length >= 15, `${s.id}: Situation`);
    assert.ok(s.warum?.length >= 20, `${s.id}: Warum`);
    assert.ok(s.emoji?.length >= 1, `${s.id}: Emoji`);
  }
  // beide Nummern kommen vor
  const nummern = new Set(situationen.map((s) => s.nummer));
  assert.ok(nummern.has('112') && nummern.has('110'), 'sonst lernt das Kind nur eine Nummer');
  assert.ok(Array.isArray(daten.notrufSchritte) && daten.notrufSchritte.length >= 4, 'Notruf-Schritte');
  assert.equal(daten.nummern['112'], 'Feuerwehr und Rettungsdienst');
  assert.equal(daten.nummern['110'], 'Polizei');
});

test('nurZiffern: säubert Eingaben', () => {
  assert.equal(nurZiffern('1 1 2'), '112');
  assert.equal(nurZiffern('11a2'), '112');
  assert.equal(nurZiffern(''), '');
});

test('istNotrufnummer', () => {
  assert.equal(istNotrufnummer('112'), true);
  assert.equal(istNotrufnummer('110'), true);
  assert.equal(istNotrufnummer('911'), false);
  assert.equal(istNotrufnummer('11'), false);
});

test('pruefeAnruf: ok / andere Notrufnummer / keine', () => {
  const a = pruefeAnruf('112', '112');
  assert.equal(a.ok, true);
  assert.equal(a.istNotruf, true);
  assert.equal(a.andereNotruf, false);

  const b = pruefeAnruf('110', '112');
  assert.equal(b.ok, false);
  assert.equal(b.andereNotruf, true);

  const c = pruefeAnruf('123', '112');
  assert.equal(c.ok, false);
  assert.equal(c.istNotruf, false);
});

test('rueckmeldung: passende Texte', () => {
  assert.match(rueckmeldung('112', '112', daten.nummern), /Richtig/);
  assert.match(rueckmeldung('110', '112', daten.nummern), /Fast/);
  assert.match(rueckmeldung('999', '112', daten.nummern), /keine Notrufnummer/);
});

test('bewerteRunde: zählt richtige Wahlen', () => {
  const eingaben = {};
  for (const s of situationen) eingaben[s.id] = s.nummer;
  assert.deepEqual(bewerteRunde(situationen, eingaben), { richtig: situationen.length, gesamt: situationen.length });
  assert.equal(bewerteRunde(situationen, {}).richtig, 0);
});
