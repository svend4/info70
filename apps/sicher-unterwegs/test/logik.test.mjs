import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { punkteFuer, maxPunkte, rangFuer, ergebnisSatz } from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/szenarien.json', import.meta.url), 'utf8'));
const szenarien = daten.szenarien;
const RUNDE = 12;

function saetze(text) {
  return text.split(/[.!?]+/).map((t) => t.trim()).filter(Boolean);
}

test('Grundstruktur: Version, ≥12 Szenen, eindeutige IDs, Ränge', () => {
  assert.equal(daten.version, 1);
  assert.ok(szenarien.length >= 12, `mindestens 12 Szenen (ist: ${szenarien.length})`);
  const ids = szenarien.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length, 'IDs eindeutig');
  assert.equal(daten.raenge[0].ab, 0);
});

test('jede Szene: genau 3 Optionen, genau EINE mit Wert 2, Werte 0/1/2', () => {
  for (const s of szenarien) {
    assert.ok(s.emoji?.length >= 1, `${s.id}: Emoji`);
    assert.ok(s.situation?.length >= 15, `${s.id}: Situation`);
    assert.ok(s.frage?.length >= 3, `${s.id}: Frage`);
    assert.ok(s.erklaerung?.length >= 30, `${s.id}: Erklärung (dort passiert das Lernen)`);
    assert.ok(Array.isArray(s.optionen) && s.optionen.length === 3, `${s.id}: genau 3 Optionen`);
    for (const o of s.optionen) {
      assert.ok(o.text?.length >= 5, `${s.id}: Optionstext`);
      assert.ok([0, 1, 2].includes(o.wert), `${s.id}: Wert 0/1/2`);
    }
    assert.equal(s.optionen.filter((o) => o.wert === 2).length, 1, `${s.id}: genau EINE beste Option`);
    assert.ok(s.optionen.some((o) => o.wert === 0), `${s.id}: eine unsichere Option`);
  }
});

test('inhaltliche Abdeckung: Straße, Fremde, Feuer/Notruf 112/110, Gift, Tiere', () => {
  const alles = JSON.stringify(szenarien).toLowerCase();
  assert.match(alles, /ampel|zebrastreifen|straße/, 'Verkehr');
  assert.match(alles, /fremd/, 'fremde Personen');
  assert.match(alles, /112/, 'Notruf 112');
  assert.match(alles, /110/, 'Notruf 110');
  assert.match(alles, /tablette|medikament|giftig/, 'Gift/Medikamente');
  assert.match(alles, /hund/, 'fremde Tiere');
});

test('einfache Sprache: kein Satz länger als 120 Zeichen', () => {
  for (const s of szenarien) {
    const texte = [s.situation, s.frage, s.erklaerung, ...s.optionen.map((o) => o.text)];
    for (const t of texte) for (const satz of saetze(t)) {
      assert.ok(satz.length <= 120, `${s.id}: Satz zu lang (${satz.length}): "${satz}"`);
    }
  }
});

test('Wertung + Rang-Logik', () => {
  assert.equal(punkteFuer({ wert: 2 }), 2);
  assert.equal(punkteFuer(undefined), 0);
  assert.equal(maxPunkte(12), 24);
  assert.equal(rangFuer(daten.raenge, 0).ab, 0);
  assert.equal(rangFuer(daten.raenge, 100).titel, daten.raenge[daten.raenge.length - 1].titel);
  assert.match(ergebnisSatz(daten.raenge, 24, 12), /24 von 24/);
});

test('höchster Rang ist in einer 12er-Runde erreichbar', () => {
  const maxAb = Math.max(...daten.raenge.map((r) => r.ab));
  assert.ok(maxAb <= RUNDE * 2, `höchster Rang (${maxAb}) ≤ ${RUNDE * 2}`);
});
