import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { monatsName, kulturenImMonat, statusImMonat, tagebuchWochen, pruefeGarten } from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/garten.json', import.meta.url), 'utf8'));

test('Garten-Katalog ist gültig (8 Kulturen, 12 Monate, 2 Stufen)', () => {
  assert.deepEqual(pruefeGarten(daten), []);
  assert.equal(daten.kulturen.length, 8);
  assert.equal(daten.stufen.length, 2);
});

test('Sicherheits-Hinweise sind Pflicht: Bohne/Kartoffel giftig, Zucchini bitter, Bohne kochen', () => {
  const je = Object.fromEntries(daten.kulturen.map((k) => [k.id, k]));
  assert.match(je.buschbohne.hinweis, /giftig/i);
  assert.match(je.buschbohne.hinweis, /koch/i);
  assert.match(je.kartoffel.hinweis, /giftig/i);
  assert.match(je.zucchini.hinweis, /bitter/i);
  const kaputt = structuredClone(daten);
  kaputt.kulturen.find((k) => k.id === 'buschbohne').hinweis = 'lecker';
  assert.ok(pruefeGarten(kaputt).some((f) => f.includes('buschbohne')));
});

test('kulturenImMonat: Januar nur Fensterbank-Kresse, Mai volle Pflanzzeit', () => {
  const jan = kulturenImMonat(1, daten.kulturen);
  assert.deepEqual(jan.saeen.map((k) => k.id), ['kresse']);
  assert.deepEqual(jan.ernten.map((k) => k.id), ['kresse']);
  const mai = kulturenImMonat(5, daten.kulturen).saeen.map((k) => k.id);
  for (const id of ['buschbohne', 'kartoffel', 'zucchini', 'kapuzinerkresse']) {
    assert.ok(mai.includes(id), `${id} wird im Mai gesät/gelegt`);
  }
});

test('statusImMonat: Radieschen Juni beides, Kartoffel Januar warten, Erbse April säen', () => {
  const je = Object.fromEntries(daten.kulturen.map((k) => [k.id, k]));
  assert.equal(statusImMonat(6, je.radieschen), 'saeen+ernten');
  assert.equal(statusImMonat(1, je.kartoffel), 'warten');
  assert.equal(statusImMonat(4, je.erbse), 'saeen');
  assert.equal(statusImMonat(8, je.kartoffel), 'ernten');
});

test('tagebuchWochen ist auf 4..8 begrenzt (Kresse min, Kartoffel max)', () => {
  const je = Object.fromEntries(daten.kulturen.map((k) => [k.id, k]));
  assert.equal(tagebuchWochen(je.kresse), 4);
  assert.equal(tagebuchWochen(je.kartoffel), 8);
  assert.equal(tagebuchWochen({ wartezeitWochen: 5 }), 5);
});

test('monatsName: 1 = Januar, 12 = Dezember, 13/0 = null', () => {
  assert.equal(monatsName(1), 'Januar');
  assert.equal(monatsName(12), 'Dezember');
  assert.equal(monatsName(13), null);
  assert.equal(monatsName(0), null);
});

test('BNE steckt in den Monatsaufgaben: Insektenhotel im Herbst, Vogelfutter im Winter, Kompost', () => {
  const alle = Object.values(daten.monatsaufgaben).flat().join(' ');
  assert.match(alle, /Insektenhotel/);
  assert.match(alle, /Kompost/);
  for (const m of ['1', '11', '12']) {
    assert.ok(daten.monatsaufgaben[m].join(' ').match(/Vogelfutter|Futterstelle/), `Monat ${m}: Vogelfutter`);
  }
});
