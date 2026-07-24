import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pruefeKarten, kartenFuer, vorleseText } from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/karten.json', import.meta.url), 'utf8'));

test('Karten-Bank gültig: Situationen mit je ≥2 Karten, alle Sprachfelder', () => {
  assert.deepEqual(pruefeKarten(daten), []);
  assert.ok(daten.situationen.length >= 4);
  assert.ok(daten.karten.length >= 8);
});

test('jede Karte: de + kyrillisch uk/ru + lateinische Aussprachehilfe', () => {
  for (const k of daten.karten) {
    assert.ok(/[Ѐ-ӿ]/.test(k.uk), `${k.id}: uk kyrillisch`);
    assert.ok(/[Ѐ-ӿ]/.test(k.ru), `${k.id}: ru kyrillisch`);
    assert.ok(!/[Ѐ-ӿ]/.test(k.ukLat), `${k.id}: ukLat lateinisch`);
    assert.ok(!/[Ѐ-ӿ]/.test(k.ruLat), `${k.id}: ruLat lateinisch`);
  }
});

test('inhaltliche Abdeckung: Kern-Situationen des Kita-Alltags', () => {
  const ids = new Set(daten.situationen.map((s) => s.id));
  for (const s of ['ankommen', 'essen', 'anziehen', 'spielen', 'troesten', 'abschied']) {
    assert.ok(ids.has(s), `Situation ${s}`);
  }
  assert.match(daten.methode, /anknüpfen|offene Impulse|erweitern/i, 'Methode alltagsintegriert');
  assert.match(daten.hinweis, /Annäherung|kein Ersatz/i, 'ehrlicher Aussprachehilfe-Hinweis');
});

test('kartenFuer filtert nach Situation', () => {
  assert.equal(kartenFuer(daten).length, daten.karten.length);
  const essen = kartenFuer(daten, 'essen');
  assert.ok(essen.length >= 2);
  assert.ok(essen.every((k) => k.situation === 'essen'));
});

test('vorleseText nennt de + beide Aussprachehilfen', () => {
  const t = vorleseText(daten.karten[0]);
  assert.match(t, /Ukrainisch:/);
  assert.match(t, /Russisch:/);
  assert.ok(t.startsWith(daten.karten[0].de));
});
