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

test('jedes Szenario: 2/1/0-Muster, Recht-Bezug, Merksatz, Erklärung', () => {
  for (const s of daten.szenarien) {
    assert.ok(s.situation?.length >= 25, `${s.id}: Situation fehlt`);
    assert.ok(s.recht?.length >= 6, `${s.id}: Rechtsbezug fehlt`);
    assert.ok(s.merksatz?.length >= 10, `${s.id}: Merksatz fehlt`);
    assert.ok(s.erklaerung?.length >= 80, `${s.id}: Erklärung zu kurz`);
    assert.ok(Array.isArray(s.optionen) && s.optionen.length === 3, `${s.id}: genau 3 Optionen`);
    const werte = s.optionen.map((o) => o.wert);
    assert.ok(werte.every((w) => [0, 1, 2].includes(w)), `${s.id}: Werte nur 0/1/2`);
    assert.equal(werte.filter((w) => w === 2).length, 1, `${s.id}: genau EIN stärkster Zug`);
    assert.ok(werte.includes(0), `${s.id}: mindestens eine Option, die es schlimmer macht`);
  }
});

test('Doppel-Natur der Rechte: Meinungsfreiheit UND ihre Grenze, Melden-Recht, Verantwortung', () => {
  const alles = JSON.stringify(daten.szenarien);
  assert.match(alles, /Art\. 13/, 'Meinungsfreiheit');
  assert.match(alles, /Beleidigung|beleidigen/, 'Grenze der Meinungsfreiheit');
  assert.match(alles, /DSA Art\. (16|20)/, 'Melderecht nach DSA');
  assert.match(alles, /Petzen/, 'Melden ≠ Petzen');
  assert.match(alles, /Verantwortung/, 'Freiheit + Verantwortung');
  assert.match(alles, /Art\. 12/, 'gehört werden');
});

test('Artikel-Breite: mehrere Beteiligungsrechte, Hilfe-Insel eingebunden', () => {
  const rechte = new Set(daten.szenarien.map((s) => s.recht.match(/Art\. \d+/)?.[0]).filter(Boolean));
  assert.ok(rechte.size >= 3, `mindestens 3 verschiedene KRK-Artikel (ist: ${rechte.size})`);
  assert.match(appQuelle, /hilfeInsel/, 'Hilfe-Insel-Baustein eingebunden');
});
