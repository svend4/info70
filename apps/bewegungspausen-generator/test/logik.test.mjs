import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  ZIEL_MIN, ZIEL_MAX, ABLAUF, pruefeBausteine, bausteineFuer,
  gesamtMinuten, erzeugePause, skriptText,
} from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/bausteine.json', import.meta.url), 'utf8'));

test('Baustein-Bank gültig: 4 Phasen, je ≥2 Bausteine, Verse vorhanden', () => {
  assert.deepEqual(pruefeBausteine(daten), []);
  assert.deepEqual(ABLAUF, ['aufwachen', 'power', 'koordination', 'ruhe']);
  for (const ph of ABLAUF) assert.ok(bausteineFuer(daten, ph).length >= 2, `Phase ${ph}`);
  assert.match(daten.hinweis, /Eigenproduktion|keine übernommenen/i, 'Urheberrechts-Hinweis');
});

test('erzeugePause: Ablauf-Reihenfolge, Dauer im 7–10-Minuten-Korridor', () => {
  // deterministischer Wähler: immer das erste Element
  const erste = (liste) => liste[0];
  const skript = erzeugePause(daten, erste);
  // Phasen in Ablauf-Reihenfolge (power darf doppelt sein)
  const phasen = skript.map((b) => b.phase);
  let letzterIndex = -1;
  for (const ph of phasen) {
    const idx = ABLAUF.indexOf(ph);
    assert.ok(idx >= letzterIndex, `Phase ${ph} in Reihenfolge`);
    letzterIndex = idx;
  }
  const dauer = gesamtMinuten(skript);
  assert.ok(dauer >= ZIEL_MIN && dauer <= ZIEL_MAX, `Dauer ${dauer} im Korridor ${ZIEL_MIN}–${ZIEL_MAX}`);
  // keine doppelten Bausteine
  const ids = skript.map((b) => b.id);
  assert.equal(new Set(ids).size, ids.length, 'keine Dubletten');
});

test('erzeugePause: viele Zufallsläufe bleiben im Korridor', () => {
  for (let i = 0; i < 50; i++) {
    const dauer = gesamtMinuten(erzeugePause(daten));
    assert.ok(dauer >= ZIEL_MIN - 1 && dauer <= ZIEL_MAX, `Lauf ${i}: ${dauer} Min`);
  }
});

test('jede Phase des Ablaufs ist im Skript vertreten', () => {
  const skript = erzeugePause(daten, (l) => l[l.length - 1]);
  const phasen = new Set(skript.map((b) => b.phase));
  for (const ph of ABLAUF) assert.ok(phasen.has(ph), `Phase ${ph} vertreten`);
});

test('skriptText: nummeriert, mit Versen, Minuten und OER-Hinweis', () => {
  const skript = erzeugePause(daten, (l) => l[0]);
  const text = skriptText(daten, skript, '18.07.2026');
  assert.match(text, /Bewegungspause \(\d+ Minuten\) – 18\.07\.2026/);
  assert.match(text, /1\. /);
  assert.match(text, /🎵 „/);
  assert.match(text, /Min ·/);
  assert.match(text, /frei nutzbar/i);
});
