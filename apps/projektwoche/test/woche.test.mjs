import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';

const woche = JSON.parse(await readFile(new URL('../daten/woche.json', import.meta.url), 'utf8'));

test('Woche: 5 Tage, Rahmen und Technik-Hinweis (Klassen-Modus) benannt', () => {
  assert.equal(woche.tage.length, 5);
  assert.deepEqual(woche.tage.map((t) => t.nr), [1, 2, 3, 4, 5]);
  assert.match(woche.rahmen, /Medienkompetenzrahmen NRW/, 'Lehrplan-Anschluss');
  assert.match(woche.technik, /Klassen-Modus/, 'Ein-Beamer-Machbarkeit muss benannt sein');
  assert.match(woche.technik, /keine Daten/, 'Datensparsamkeit als Zusage');
});

test('Jeder Tag: 90 Minuten, Einstieg→…→Abschluss, Lernziel, Material, Transfer', () => {
  for (const tag of woche.tage) {
    const summe = tag.ablauf.reduce((s, a) => s + a.minuten, 0);
    assert.equal(summe, 90, `Tag ${tag.nr}: Doppelstunden-Format (ist: ${summe} min)`);
    assert.equal(tag.ablauf[0].phase, 'Einstieg', `Tag ${tag.nr}: beginnt mit Einstieg`);
    assert.equal(tag.ablauf.at(-1).phase, 'Abschluss', `Tag ${tag.nr}: endet mit Abschluss`);
    assert.ok(tag.lernziel.length >= 60, `Tag ${tag.nr}: Lernziel zu dünn`);
    assert.ok(tag.material.length >= 2, `Tag ${tag.nr}: Materialliste fehlt`);
    assert.ok(tag.transfer.length >= 30, `Tag ${tag.nr}: Transfer in den Alltag fehlt`);
    assert.ok(tag.apps.length >= 1, `Tag ${tag.nr}: keine App zugeordnet`);
    for (const a of tag.ablauf) {
      assert.ok(Number.isInteger(a.minuten) && a.minuten > 0, `Tag ${tag.nr}: Minutenangabe ungültig`);
      assert.ok(a.text.length >= 40, `Tag ${tag.nr}/${a.phase}: Ablauftext zu dünn zum Unterrichten`);
    }
  }
});

test('Alle referenzierten Apps existieren wirklich im Monorepo', async () => {
  const alleApps = [...new Set(woche.tage.flatMap((t) => t.apps))];
  assert.ok(alleApps.length >= 8, 'die Woche soll die Breite des Baukastens nutzen');
  for (const ordner of alleApps) {
    await assert.doesNotReject(
      access(new URL(`../../${ordner}/index.html`, import.meta.url)),
      `App fehlt: apps/${ordner}/`);
  }
});

test('Roter Faden: Charta als demokratisches Ergebnis, Eltern-Anschluss, Hilfe 116 111', () => {
  const text = JSON.stringify(woche);
  assert.match(text, /Netz-Charta/, 'Klassen-Netz-Charta als Wochenergebnis');
  assert.match(text, /mitmach-arena/, 'Charta wird demokratisch abgestimmt');
  assert.match(text, /familien-medienvertrag/, 'Anschluss nach Hause');
  assert.ok(text.includes('116 111'), 'Hilfeadresse für belastende Vorfälle');
  assert.ok(!/Hausaufgabe(?!n-frei)/i.test(text) || /Hausideen|Mini-Auftrag|Experiment/.test(text),
    'Transfer als Einladung, nicht als Pflicht-Hausaufgabe');
});
