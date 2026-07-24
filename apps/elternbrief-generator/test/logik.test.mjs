import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pruefeBausteine, normalisiereName, baueBrief } from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/bausteine.json', import.meta.url), 'utf8'));

test('Baustein-Bank gültig: 2 Altersbänder × ≥4 Themen, je Lern-Text + Spielidee', () => {
  assert.deepEqual(pruefeBausteine(daten), []);
  assert.ok(daten.themen.length >= 4);
  assert.equal(daten.monate.length, 12);
  assert.match(daten.hinweis, /keine Namen|keine Angaben zu einzelnen/i, 'Gruppen- statt Kind-Bezug');
  assert.match(daten.hinweis, /eigenes Tempo|Richtwert/i, 'Entwicklungs-Streuung benannt');
});

test('Spielideen sind bildschirmfrei formuliert', () => {
  const spielideen = daten.themen.flatMap((t) => Object.values(t.spielidee)).join(' ').toLowerCase();
  assert.ok(!/\bapp\b|tablet|video|fernseh|handy/.test(spielideen), 'keine Bildschirm-Spielideen');
});

test('normalisiereName: trimmt und kappt auf 60 Zeichen', () => {
  assert.equal(normalisiereName('  Kita Sonnenblume  '), 'Kita Sonnenblume');
  assert.equal(normalisiereName('x'.repeat(100)).length, 60);
  assert.equal(normalisiereName(null), '');
});

test('baueBrief: Kopf, Themenblöcke, Schluss – nur gewählte Themen', () => {
  const brief = baueBrief(daten, {
    monat: 'März', altersband: '2-3',
    themenIds: ['bewegung', 'sprache'],
    kitaName: 'Kita Sonnenblume', gruppenName: 'Igel',
  });
  assert.match(brief, /Kita Sonnenblume · Igel/);
  assert.match(brief, /Elternbrief März – Altersgruppe 2–3 Jahre/);
  assert.match(brief, /Liebe Eltern,/);
  assert.match(brief, /🤸 Bewegung/);
  assert.match(brief, /💬 Sprache/);
  assert.ok(!/🧦 Selbstständigkeit/.test(brief), 'nicht gewähltes Thema fehlt');
  assert.match(brief, /Was Ihr Kind jetzt lernt:/);
  assert.match(brief, /Spielidee für zu Hause \(ohne Bildschirm\):/);
  assert.match(brief, /eigenen Tempo/);
  assert.match(brief, /Ihr Team der Gruppe Igel/);
});

test('baueBrief: Altersband wählt die passenden Texte', () => {
  const jung = baueBrief(daten, { monat: 'Mai', altersband: '1-2', themenIds: ['sprache'] });
  const alt = baueBrief(daten, { monat: 'Mai', altersband: '2-3', themenIds: ['sprache'] });
  assert.notEqual(jung, alt, 'unterschiedliche Texte je Altersband');
  assert.match(jung, /Zwei-Wort-Sätze/);
  assert.match(alt, /Warum-Fragen/);
});

test('baueBrief: ohne Themen leer, ohne Namen ohne Kopf', () => {
  assert.equal(baueBrief(daten, { monat: 'Juni', altersband: '1-2', themenIds: [] }), '');
  const ohne = baueBrief(daten, { monat: 'Juni', altersband: '1-2', themenIds: ['sinne'] });
  assert.match(ohne, /^Elternbrief Juni/, 'beginnt ohne Kopfzeile direkt mit dem Titel');
  assert.match(ohne, /Ihr Team$/m);
});
