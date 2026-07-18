import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const daten = JSON.parse(await readFile(new URL('../daten/szenarien.json', import.meta.url), 'utf8'));
const appQuelle = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');

test('Szenarienbank: Grundstruktur, IDs, erreichbare Ränge', () => {
  assert.equal(daten.version, 1);
  assert.ok(daten.szenarien.length >= 8);
  const ids = daten.szenarien.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(daten.raenge[0].ab, 0);
  assert.ok(Math.max(...daten.raenge.map((r) => r.ab)) <= daten.szenarien.length * 2);
});

test('jedes Szenario: 2/1/0-Muster, Schutzmerkmal-Label, Erklärung', () => {
  for (const s of daten.szenarien) {
    assert.ok(s.situation?.length >= 30, `${s.id}: Situation fehlt`);
    assert.ok(s.schutzmerkmal?.length >= 5, `${s.id}: Schutzmerkmal-Label fehlt`);
    assert.ok(s.erklaerung?.length >= 80, `${s.id}: Erklärung zu kurz`);
    assert.ok(Array.isArray(s.optionen) && s.optionen.length === 3, `${s.id}: genau 3 Optionen`);
    const werte = s.optionen.map((o) => o.wert);
    assert.ok(werte.every((w) => [0, 1, 2].includes(w)), `${s.id}: Werte nur 0/1/2`);
    assert.equal(werte.filter((w) => w === 2).length, 1, `${s.id}: genau EIN sicherer Zug`);
    assert.ok(werte.includes(0), `${s.id}: mindestens eine unsichere Option`);
  }
});

test('die drei Schutzmerkmale + Gegenbeispiele kommen vor', () => {
  const alles = JSON.stringify(daten.szenarien).toLowerCase();
  assert.match(alles, /moderation|moderiert/, 'Moderation');
  assert.match(alles, /melde/, 'Melde-Funktion');
  assert.match(alles, /spitzname/, 'Spitzname statt echtem Namen');
  assert.match(alles, /offener.*chat|ohne aufsicht/, 'Gegenbeispiel: unmoderiert');
});

test('kein Grooming-Inhalt: reines Kriterien-Training, Hilfe-Insel eingebunden', () => {
  // Warnzeichen werden benannt (Foto-Aufforderung), aber keine Täter-Dialoge/Details.
  const alles = JSON.stringify(daten.szenarien);
  assert.ok(!/treffen wir uns|wo genau wohnst|unser geheimnis/i.test(alles), 'keine Grooming-Dialoge');
  assert.match(alles, /116 111/, 'Hilfeadresse bei Foto-Aufforderung');
  assert.match(appQuelle, /hilfeInsel/, 'Hilfe-Insel-Baustein eingebunden');
});
