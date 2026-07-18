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

test('jedes Szenario: 2/1/0-Muster, Warnung, Erklärung', () => {
  for (const s of daten.szenarien) {
    assert.ok(s.situation?.length >= 30, `${s.id}: Situation fehlt`);
    assert.ok(s.warnung?.length >= 8, `${s.id}: Warnung-Label fehlt`);
    assert.ok(s.erklaerung?.length >= 80, `${s.id}: Erklärung zu kurz`);
    assert.ok(Array.isArray(s.optionen) && s.optionen.length === 3, `${s.id}: genau 3 Optionen`);
    const werte = s.optionen.map((o) => o.wert);
    assert.ok(werte.every((w) => [0, 1, 2].includes(w)), `${s.id}: Werte nur 0/1/2`);
    assert.equal(werte.filter((w) => w === 2).length, 1, `${s.id}: genau EIN sicherer Zug`);
    assert.ok(werte.includes(0), `${s.id}: mindestens eine Fallen-Option`);
  }
});

test('didaktische Balance: auch ein gutes Formular (nur Spitzname) kommt vor', () => {
  const alles = JSON.stringify(daten.szenarien).toLowerCase();
  assert.match(alles, /nur.*spitzname|spitzname und ein passwort/, 'positives Beispiel für Kontrast');
});

test('inhaltliche Abdeckung: die verbotenen Datenabfragen + Warnsignale', () => {
  const alles = JSON.stringify(daten.szenarien).toLowerCase();
  for (const [name, muster] of [
    ['Adresse', /adresse/],
    ['Telefon', /telefon|handynummer/],
    ['Foto', /foto/],
    ['Schule', /schule/],
    ['Pflichtfeld/Sternchen', /sternchen|pflichtfeld|pflicht/],
    ['vorangekreuztes Häkchen', /häkchen|vorangekreuzt/],
    ['versteckte Kosten/Abo', /abo|kostenpflichtig/],
  ]) {
    assert.match(alles, muster, `fehlt: ${name}`);
  }
  assert.match(appQuelle, /hilfeInsel/, 'Hilfe-Insel eingebunden');
});
