import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';

const d = JSON.parse(await readFile(new URL('../daten/handbuch.json', import.meta.url), 'utf8'));

test('Rollenkarten: mindestens Leitung, Zeit, Protokoll', () => {
  assert.ok(d.rollen.length >= 3, 'mindestens drei Rollen');
  const rollen = d.rollen.map((r) => r.rolle).join(' | ');
  assert.match(rollen, /Leitung/);
  assert.match(rollen, /Zeit/);
  assert.match(rollen, /Protokoll/);
  for (const r of d.rollen) assert.ok(r.emoji && r.aufgabe.length >= 20, `Rolle ${r.rolle} unvollständig`);
});

test('Ablaufplan: nummerierte Phasen mit Text', () => {
  assert.ok(d.ablauf.length >= 4, 'mindestens vier Phasen');
  assert.deepEqual(d.ablauf.map((a) => a.nr), d.ablauf.map((_, i) => i + 1));
  for (const a of d.ablauf) assert.ok(a.phase && a.text.length >= 30, `Phase ${a.nr} zu dünn`);
});

test('Klassen-Koffer-Workflow und Demokratiebildungs-Bezug', () => {
  assert.match(d.koffer, /Klassen-Koffer/);
  assert.match(d.koffer, /kein Server|ohne Server|keine Konten/);
  assert.match(d.bezug, /Demokratie/);
  assert.match(d.bezug, /UN-KRK|KMK/);
});

test('Referenzierte Apps (mitmach-arena, kinderrat) existieren', async () => {
  assert.ok(d.apps.includes('mitmach-arena'));
  for (const a of d.apps) {
    await assert.doesNotReject(access(new URL(`../../${a}/index.html`, import.meta.url)), `App fehlt: apps/${a}/`);
  }
});
