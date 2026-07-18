import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';

const d = JSON.parse(await readFile(new URL('../daten/stationen.json', import.meta.url), 'utf8'));

test('Vier Stationen (Schutz, Förderung, Beteiligung, digital), je vollständig', () => {
  assert.equal(d.stationen.length, 4, 'genau vier Stationen');
  assert.deepEqual(d.stationen.map((s) => s.nr), [1, 2, 3, 4]);
  for (const s of d.stationen) {
    assert.ok(s.bereich && s.titel && s.artikel, `Station ${s.nr}: Kopf fehlt`);
    assert.ok(s.aufgabe.length >= 40, `Station ${s.nr}: Aufgabe zu dünn`);
    assert.ok(Array.isArray(s.apps) && s.apps.length >= 1, `Station ${s.nr}: keine App`);
  }
  const bereiche = d.stationen.map((s) => s.bereich).join(' ');
  assert.match(bereiche, /Schutz/); assert.match(bereiche, /Förderung/);
  assert.match(bereiche, /Beteiligung/); assert.match(bereiche, /Netz|digital/i);
});

test('Lernziele, Plakat-Sicherung, Kompetenzbezug und Hinweise vorhanden', () => {
  assert.ok(d.lernziele.length >= 2, 'Lernziele fehlen');
  for (const z of d.lernziele) assert.ok(z.length >= 60, 'Lernziel zu dünn');
  assert.ok(/Plakat/.test(d.plakat), 'Rechte-Plakat als Sicherung');
  assert.match(d.kompetenzen, /(Medienkompetenzrahmen NRW|KMK)/);
  assert.match(d.kompetenzen, /UN-KRK|General Comment 25/);
  assert.ok(d.hinweise.length >= 2, 'Hinweise fehlen');
});

test('Alle referenzierten Apps existieren wirklich im Monorepo', async () => {
  const alle = [...new Set(d.stationen.flatMap((s) => s.apps))];
  assert.ok(alle.length >= 5, 'die Einheit soll mehrere Apps nutzen');
  for (const a of alle) {
    await assert.doesNotReject(access(new URL(`../../${a}/index.html`, import.meta.url)), `App fehlt: apps/${a}/`);
  }
});

test('Schutz-Station verweist auf Hilfe (116 111) und keine externen Links', () => {
  const text = JSON.stringify(d);
  assert.ok(text.includes('116 111'), 'Hilfeadresse genannt');
  assert.ok(!/https?:\/\//.test(text), 'keine externen Links');
});
