import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const daten = JSON.parse(await readFile(new URL('../daten/szenarien.json', import.meta.url), 'utf8'));
const appQuelle = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');

test('Szenarienbank: Grundstruktur, IDs, erreichbare Ränge', () => {
  assert.equal(daten.version, 1);
  assert.ok(daten.szenarien.length >= 10, 'mindestens 10 Szenarien');
  const ids = daten.szenarien.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(daten.raenge[0].ab, 0);
  assert.ok(Math.max(...daten.raenge.map((r) => r.ab)) <= daten.szenarien.length * 2);
});

test('jedes Szenario: 2/1/0-Muster mit genau einem stärksten Zug und einer Falle', () => {
  for (const s of daten.szenarien) {
    assert.ok(s.situation?.length >= 30, `${s.id}: Situation fehlt/zu kurz`);
    assert.ok(s.erklaerung?.length >= 80, `${s.id}: Erklärung zu kurz (dort passiert das Lernen!)`);
    assert.ok(Array.isArray(s.optionen) && s.optionen.length === 3, `${s.id}: genau 3 Optionen`);
    const werte = s.optionen.map((o) => o.wert).sort();
    assert.deepEqual(werte, [0, 1, 2], `${s.id}: Werte müssen genau 0, 1 und 2 sein`);
    for (const o of s.optionen) assert.ok(o.text?.length >= 10, `${s.id}: Optionstext fehlt`);
  }
});

test('Kern-Idee: jedes Szenario nennt KRK-Artikel und schenkt einen Mut-Satz', () => {
  for (const s of daten.szenarien) {
    assert.ok(Number.isInteger(s.artikel) && s.artikel >= 1 && s.artikel <= 54, `${s.id}: KRK hat Artikel 1-54`);
    assert.ok(s.artikelName?.length >= 10, `${s.id}: Artikel braucht einen verständlichen Namen`);
    assert.ok(s.satz?.length >= 15, `${s.id}: Mut-Satz fehlt`);
    assert.ok(!/verklagen|Anwalt|Polizei/.test(s.satz), `${s.id}: Mut-Satz ist Selbstvertretung, keine Drohung`);
  }
});

test('Artikel-Breite: mehrere Rechte, Pflichtartikel 12 (Gehör), 16 (Privatsphäre), 31 (Spiel)', () => {
  const artikel = new Set(daten.szenarien.map((s) => s.artikel));
  assert.ok(artikel.size >= 5, `mindestens 5 verschiedene KRK-Artikel (ist: ${artikel.size})`);
  for (const pflicht of [12, 16, 31]) assert.ok(artikel.has(pflicht), `Artikel ${pflicht} fehlt`);
});

test('Didaktik: Rechte gegen NAHE Menschen (Eltern/Familie) UND Institutionen; Hilfe 116 111', () => {
  const alles = JSON.stringify(daten.szenarien);
  assert.ok(/Mama|Papa|Eltern|Bruder|Schwester/.test(alles), 'auch Familien-Situationen (schwerster Fall!)');
  assert.ok(/Schule|Rathaus|Gericht|Ärztin|Arzt/.test(alles), 'auch Institutionen-Situationen');
  assert.ok(/Sharenting/.test(alles), 'Sharenting benannt (Gefährdungsatlas)');
  assert.ok(appQuelle.includes('116 111'), 'Hilfeadresse in der App');
});
