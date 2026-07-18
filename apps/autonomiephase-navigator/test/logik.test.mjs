import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { punkteFuer, maxPunkte, rangFuer, ergebnisSatz } from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/szenarien.json', import.meta.url), 'utf8'));
const szenarien = daten.szenarien;
const RUNDE = 10;

test('Grundstruktur: Version, ≥10 Szenen, eindeutige IDs, Eltern-Hinweis', () => {
  assert.equal(daten.version, 1);
  assert.ok(szenarien.length >= 10, `mindestens 10 Szenen (ist: ${szenarien.length})`);
  const ids = szenarien.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length, 'IDs eindeutig');
  assert.match(daten.hinweis, /kein.*Rezept|Beratung|Nummer gegen Kummer|keine Bewertung/i, 'Eltern-Hinweis ohne Urteil');
  assert.match(JSON.stringify(daten), /0800 111 0 550/, 'Hilfe-Nummer für Eltern');
});

test('jede Szene: genau 3 Optionen, genau EINE mit Wert 2, Werte 0/1/2', () => {
  for (const s of szenarien) {
    assert.ok(s.situation?.length >= 20, `${s.id}: Situation`);
    assert.ok(s.frage?.length >= 3, `${s.id}: Frage`);
    assert.ok(s.erklaerung?.length >= 40, `${s.id}: Erklärung`);
    assert.ok(Array.isArray(s.optionen) && s.optionen.length === 3, `${s.id}: genau 3 Optionen`);
    for (const o of s.optionen) {
      assert.ok(o.text?.length >= 5, `${s.id}: Optionstext`);
      assert.ok([0, 1, 2].includes(o.wert), `${s.id}: Wert 0/1/2`);
    }
    assert.equal(s.optionen.filter((o) => o.wert === 2).length, 1, `${s.id}: genau EINE beste Option`);
    assert.ok(s.optionen.some((o) => o.wert === 0), `${s.id}: eine ungünstige Option`);
  }
});

test('inhaltliche Abdeckung: Balance Anforderung/Zuwendung, typische Trotz-Themen', () => {
  const alles = JSON.stringify(szenarien).toLowerCase();
  assert.match(alles, /grenze/, 'klare Grenzen (Anforderung)');
  assert.match(alles, /gefühl|zuwendung|nähe/, 'Zuwendung/Gefühle');
  assert.match(alles, /wut|wütend/, 'Wutanfall');
  assert.match(alles, /wahl|entscheid/, 'begrenzte Wahl / Autonomie');
  assert.match(alles, /selbst.*machen|allein/, 'Selber-machen-Wunsch');
});

test('Wertung + Rang-Logik', () => {
  assert.equal(punkteFuer({ wert: 2 }), 2);
  assert.equal(punkteFuer(undefined), 0);
  assert.equal(maxPunkte(10), 20);
  assert.equal(rangFuer(daten.raenge, 0).ab, 0);
  assert.equal(rangFuer(daten.raenge, 100).titel, daten.raenge[daten.raenge.length - 1].titel);
  assert.match(ergebnisSatz(daten.raenge, 20, 10), /20 von 20/);
});

test('höchster Rang ist in einer 10er-Runde erreichbar', () => {
  const maxAb = Math.max(...daten.raenge.map((r) => r.ab));
  assert.ok(maxAb <= RUNDE * 2, `höchster Rang (${maxAb}) ≤ ${RUNDE * 2}`);
});
