import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';

const v = JSON.parse(await readFile(new URL('../daten/vorlage.json', import.meta.url), 'utf8'));

test('Blueprint: alle Kern-Abschnitte vorhanden', () => {
  const felder = v.abschnitte.map((a) => a.feld).join(' | ');
  for (const pflicht of ['Lernziele', 'Ablauf', 'Arbeitsblatt', 'Differenzierung', 'Kompetenz-Mapping', 'Bezug']) {
    assert.match(felder, new RegExp(pflicht), `Abschnitt ${pflicht} fehlt`);
  }
  for (const a of v.abschnitte) assert.ok(a.hinweis.length >= 20, `Hinweis zu dünn: ${a.feld}`);
});

test('Phasenraster: Einstieg … Abschluss mit Minuten und Zweck', () => {
  assert.equal(v.phasen[0].phase, 'Einstieg');
  assert.equal(v.phasen.at(-1).phase, 'Abschluss');
  for (const p of v.phasen) {
    assert.ok(/\d/.test(p.minuten), `Minutenangabe fehlt: ${p.phase}`);
    assert.ok(p.zweck.length >= 20, `Zweck zu dünn: ${p.phase}`);
  }
});

test('Kompetenz-Mapping: NRW und KMK mit je 6 Bereichen', () => {
  const namen = v.kompetenzrahmen.map((k) => k.name).join(' | ');
  assert.match(namen, /Medienkompetenzrahmen NRW/);
  assert.match(namen, /KMK/);
  for (const k of v.kompetenzrahmen) assert.ok(k.bereiche.length >= 6, `${k.name}: zu wenige Bereiche`);
});

test('Lizenz ist CC-BY (OER) und Schema ist dokumentiert', () => {
  assert.match(v.lizenz, /CC-BY/, 'OER-Lizenz CC-BY fehlt');
  assert.equal(v.schema.datei, 'daten/stunde.json');
  for (const f of ['titel', 'lernziele[]', 'ablauf[{minuten,phase,text}]', 'bezug']) {
    assert.ok(v.schema.felder.includes(f), `Schemafeld ${f} fehlt`);
  }
  assert.ok(v.schema.regeln.some((r) => /Einstieg/.test(r) && /Abschluss/.test(r)), 'Phasenregel fehlt');
  assert.ok(v.schema.regeln.some((r) => /keine externen Links/.test(r)), 'Offline-Regel fehlt');
});

test('Alle Beispiel-Stundenentwürfe existieren wirklich im Monorepo', async () => {
  assert.ok(v.beispiele.length >= 4, 'zu wenige Beispiele');
  for (const b of v.beispiele) {
    await assert.doesNotReject(
      access(new URL(`../../${b.app}/index.html`, import.meta.url)),
      `App fehlt: apps/${b.app}/`);
  }
});
