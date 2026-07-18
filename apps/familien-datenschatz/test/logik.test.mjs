import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { CODES, bewerte, vergleiche, rundeErgebnis, familienBotschaft } from '../logik.mjs';

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

test('bewerte: beste=2, auchOk=1, sonst 0', () => {
  const s = { beste: 'ablehnen', auchOk: ['fragen'] };
  assert.equal(bewerte(s, 'ablehnen'), 2);
  assert.equal(bewerte(s, 'fragen'), 1);
  assert.equal(bewerte(s, 'geben'), 0);
  assert.equal(bewerte(s, undefined), 0);
});

test('vergleiche: Punkte beider + einig-Flag', () => {
  const s = { beste: 'fragen', auchOk: ['geben'] };
  const v = vergleiche(s, 'fragen', 'geben');
  assert.equal(v.kindPunkte, 2);
  assert.equal(v.elternPunkte, 1);
  assert.equal(v.einig, false);
  assert.equal(v.beste, 'fragen');
  assert.equal(vergleiche(s, 'geben', 'geben').einig, true);
});

test('rundeErgebnis: Summen, Einigkeit, Maximum', () => {
  const drei = szenarien.slice(0, 3);
  const kind = drei.map((s) => s.beste);          // alles beste
  const eltern = drei.map((s) => s.beste);
  const r = rundeErgebnis(drei, kind, eltern);
  assert.equal(r.kindGesamt, 6);
  assert.equal(r.elternGesamt, 6);
  assert.equal(r.einigCount, 3);
  assert.equal(r.gesamt, 3);
  assert.equal(r.maxPunkte, 6);

  // Uneinigkeit
  const eltern2 = drei.map((s) => (s.beste === 'geben' ? 'ablehnen' : 'geben'));
  const r2 = rundeErgebnis(drei, kind, eltern2);
  assert.ok(r2.einigCount < 3);
});

test('familienBotschaft: kein Gewinner, Gesprächsanlass', () => {
  assert.match(familienBotschaft({ einigCount: 3, gesamt: 3 }), /einig/);
  assert.match(familienBotschaft({ einigCount: 1, gesamt: 3 }), /verloren|Gespräch/);
  assert.match(familienBotschaft({ einigCount: 0, gesamt: 0 }), /Noch keine/);
});
