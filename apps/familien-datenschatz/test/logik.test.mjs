import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import * as logik from '../logik.mjs';

const { CODES, vergleiche, rundeErgebnis, familienBotschaft } = logik;

const daten = JSON.parse(await readFile(new URL('../daten/szenarien.json', import.meta.url), 'utf8'));
const szenarien = daten.szenarien;

test('Daten: Familien-Szenarien mit gültiger bester Antwort und Feldern', () => {
  assert.ok(szenarien.length >= 10, `mindestens 10 Szenarien (ist: ${szenarien.length})`);
  const ids = szenarien.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length, 'doppelte IDs');
  assert.deepEqual(daten.antworten.map((a) => a.code).sort(), [...CODES].sort());
  for (const s of szenarien) {
    assert.ok(CODES.includes(s.beste), `${s.id}: beste gültig`);
    assert.ok(Array.isArray(s.auchOk) && s.auchOk.every((c) => CODES.includes(c)), `${s.id}: auchOk gültig`);
    assert.ok(!s.auchOk.includes(s.beste), `${s.id}: beste nicht in auchOk`);
    assert.ok(s.situation.length >= 25, `${s.id}: Situation`);
    assert.ok(s.erklaerung.length >= 30, `${s.id}: Erklärung`);
    assert.ok(s.gespraech.length >= 15, `${s.id}: Gesprächsimpuls`);
  }
});

test('inhaltliche Abdeckung: Überwachung als Privatsphäre-Frage', () => {
  const text = JSON.stringify(szenarien).toLowerCase();
  assert.match(text, /art\. 16|privatsphäre/, 'Recht auf Privatsphäre thematisiert');
  assert.match(text, /ort(en|ung)/, 'Ortung/Überwachung');
  assert.match(text, /mitlesen|chat/, 'Chat-Privatsphäre');
  assert.match(text, /sharenting|posten|foto/, 'Sharenting');
});

test('Abwesenheit: bewerte gibt es nicht mehr, der Bildschirm zeigt keine Edelsteine und keine Punktfelder', async () => {
  assert.equal('bewerte' in logik, false, 'bewerte entfernt');
  assert.deepEqual(Object.keys(logik).sort(), ['CODES', 'familienBotschaft', 'rundeErgebnis', 'vergleiche']);
  const quelle = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');
  assert.doesNotMatch(quelle, /💎/, 'kein Edelstein-Symbol');
  assert.doesNotMatch(quelle, /kindPunkte|elternPunkte|kindGesamt|elternGesamt|maxPunkte/, 'keine Punktfelder');
  assert.match(quelle, /Ihr wart euch einig/, 'Satz für gleiche Antworten bleibt');
  assert.match(quelle, /Ihr habt unterschiedlich entschieden/, 'Satz für verschiedene Antworten bleibt');
  assert.match(quelle, /Faire Wahl/, 'faire Wahl bleibt');
});

test('vergleiche: nur einig-Flag und faire Wahl, keine Punkte von Kind oder Eltern', () => {
  const s = { beste: 'fragen', auchOk: ['geben'] };
  const v = vergleiche(s, 'fragen', 'geben');
  assert.equal(v.einig, false);
  assert.equal(v.beste, 'fragen');
  assert.deepEqual(Object.keys(v).sort(), ['beste', 'einig'], 'sonst nichts');
  assert.equal('kindPunkte' in v, false);
  assert.equal('elternPunkte' in v, false);
  assert.equal(vergleiche(s, 'geben', 'geben').einig, true);
});

test('rundeErgebnis: nur Zahl der einigen Situationen und Gesamtzahl, keine Summen', () => {
  const drei = szenarien.slice(0, 3);
  const kind = drei.map((s) => s.beste);
  const eltern = drei.map((s) => s.beste);
  const r = rundeErgebnis(drei, kind, eltern);
  assert.equal(r.einigCount, 3);
  assert.equal(r.gesamt, 3);
  assert.deepEqual(Object.keys(r).sort(), ['einigCount', 'gesamt']);

  // Uneinigkeit
  const eltern2 = drei.map((s) => (s.beste === 'geben' ? 'ablehnen' : 'geben'));
  const r2 = rundeErgebnis(drei, kind, eltern2);
  assert.equal(r2.einigCount, 0);
  assert.equal(r2.gesamt, 3);
});

test('familienBotschaft: kein Gewinner, Gesprächsanlass', () => {
  assert.match(familienBotschaft({ einigCount: 3, gesamt: 3 }), /einig/);
  assert.match(familienBotschaft({ einigCount: 1, gesamt: 3 }), /verloren|Gespräch/);
  assert.match(familienBotschaft({ einigCount: 0, gesamt: 0 }), /Noch keine/);
});
