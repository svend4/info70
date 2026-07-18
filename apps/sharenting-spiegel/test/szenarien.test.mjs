import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const daten = JSON.parse(await readFile(new URL('../daten/szenarien.json', import.meta.url), 'utf8'));

test('Szenarienbank: Grundstruktur, eindeutige IDs, Eltern-Zielgruppe', () => {
  assert.equal(daten.version, 1);
  assert.equal(daten.zielgruppe, 'Eltern');
  assert.ok(daten.szenarien.length >= 6, 'mindestens 6 Situationen');
  const ids = daten.szenarien.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length, 'doppelte IDs');
});

test('jedes Szenario: 2/1/0 mit genau einem stärksten Zug, einer Falle, plus Kinderperspektive', () => {
  for (const s of daten.szenarien) {
    assert.ok(s.situation?.length >= 20, `${s.id}: Situation zu kurz`);
    assert.ok(s.erklaerung?.length >= 40, `${s.id}: Erklärung zu kurz`);
    assert.ok(s.kinderperspektive?.length >= 10, `${s.id}: Kinderperspektive fehlt`);
    assert.equal(s.optionen.length, 3, `${s.id}: genau 3 Optionen`);
    const werte = s.optionen.map((o) => o.wert);
    assert.equal(werte.filter((w) => w === 2).length, 1, `${s.id}: genau EIN stärkster Zug`);
    assert.ok(werte.includes(0), `${s.id}: mindestens eine Falle (wert 0)`);
    for (const o of s.optionen) assert.ok([0, 1, 2].includes(o.wert), `${s.id}: wert 0/1/2`);
  }
});

test('inhaltliche Abdeckung der Sharenting-Themen', () => {
  const alles = JSON.stringify(daten.szenarien).toLowerCase();
  assert.match(alles, /recht am eigenen bild|lösch/, 'Recht am eigenen Bild / Löschwunsch');
  assert.match(alles, /badekleidung/, 'Badekleidung-Fotos');
  assert.match(alles, /hintergrund|adresse|schule/, 'verräterischer Hintergrund');
  assert.match(alles, /fragen|darf ich das/, 'vorher fragen (Einwilligung)');
});

test('druckbare Familien-Foto-Regeln vorhanden', () => {
  assert.ok(Array.isArray(daten.fotoregeln) && daten.fotoregeln.length >= 5, 'mindestens 5 Regeln');
  for (const r of daten.fotoregeln) assert.ok(r.length >= 20, 'Regel zu kurz');
});
