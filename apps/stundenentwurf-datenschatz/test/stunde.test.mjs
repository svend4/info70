import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';

const stunde = JSON.parse(await readFile(new URL('../daten/stunde.json', import.meta.url), 'utf8'));

test('Ablauf: Doppelstunde von 90 Minuten, Einstieg → … → Abschluss', () => {
  const summe = stunde.ablauf.reduce((s, a) => s + a.minuten, 0);
  assert.equal(summe, 90, `90-Minuten-Format (ist: ${summe} min)`);
  assert.equal(stunde.ablauf[0].phase, 'Einstieg', 'beginnt mit Einstieg');
  assert.equal(stunde.ablauf.at(-1).phase, 'Abschluss', 'endet mit Abschluss');
  for (const a of stunde.ablauf) {
    assert.ok(Number.isInteger(a.minuten) && a.minuten > 0, 'Minutenangabe ungültig');
    assert.ok(a.text.length >= 40, `Ablauftext zu dünn: ${a.phase}`);
    assert.ok(a.phase && a.phase.length >= 3, 'Phase benannt');
  }
});

test('Lernziele, Arbeitsblatt und Hinweise sind vorhanden und substanziell', () => {
  assert.ok(stunde.lernziele.length >= 2, 'mindestens zwei Lernziele');
  for (const z of stunde.lernziele) assert.ok(z.length >= 60, 'Lernziel zu dünn');
  assert.ok(stunde.arbeitsblatt.length >= 2, 'Arbeitsblatt-Impulse fehlen');
  for (const x of stunde.arbeitsblatt) assert.ok(x.length >= 20, 'Arbeitsblatt-Punkt zu dünn');
  assert.ok(stunde.hinweise.length >= 2, 'Lehrkraft-Hinweise fehlen');
  for (const x of stunde.hinweise) assert.ok(x.length >= 20, 'Hinweis zu dünn');
});

test('Bezug, Titel und Zielgruppe benannt', () => {
  assert.ok(stunde.titel && stunde.titel.length >= 3, 'Titel fehlt');
  assert.ok(stunde.untertitel && stunde.untertitel.length >= 5, 'Untertitel fehlt');
  assert.ok(stunde.zielgruppe && /Klasse/.test(stunde.zielgruppe), 'Zielgruppe (Klasse) fehlt');
  assert.match(stunde.bezug, /(UN-KRK|DSGVO)/, 'Lehrplan-/Rechte-Bezug fehlt');
});

test('Referenzierte App existiert wirklich im Monorepo', async () => {
  assert.ok(stunde.app && stunde.appName, 'App-Bezug fehlt');
  await assert.doesNotReject(
    access(new URL(`../../${stunde.app}/index.html`, import.meta.url)),
    `App fehlt: apps/${stunde.app}/`);
});

test('Schutz-Standards: Hilfeadresse 116 111, Schulsozialarbeit-Verweis, keine externen Links', () => {
  const text = JSON.stringify(stunde);
  assert.ok(text.includes('116 111'), 'Hilfeadresse für belastende Vorfälle');
  assert.match(text, /Schulsozialarbeit/, 'Verweis auf Schulsozialarbeit statt Fallbearbeitung in der App');
  assert.ok(!/https?:\/\//.test(text), 'keine externen Links im Stundenentwurf');
});
