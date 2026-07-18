import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const daten = JSON.parse(await readFile(new URL('../daten/checkliste.json', import.meta.url), 'utf8'));
const appQuelle = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');

test('Checkliste: genug Punkte, eindeutige Codes, Urkunden-Text', () => {
  assert.ok(daten.punkte.length >= 6);
  const codes = daten.punkte.map((p) => p.code);
  assert.equal(new Set(codes).size, codes.length, 'doppelte Codes');
  assert.ok(daten.urkundeText?.length >= 30, 'Urkunden-Text fehlt');
});

test('jeder Punkt: Titel, Warum, konkrete Anleitung', () => {
  for (const p of daten.punkte) {
    assert.ok(p.emoji && p.titel, `${p.code}: Titel/Emoji fehlt`);
    assert.ok(p.warum?.length >= 40, `${p.code}: Begründung zu kurz`);
    assert.ok(p.wie?.length >= 40, `${p.code}: konkrete Anleitung fehlt`);
  }
});

test('inhaltliche Abdeckung: die Übergabe-Essentials', () => {
  const codes = daten.punkte.map((p) => p.code);
  for (const pflicht of ['jugendschutz', 'standort', 'kaufsperre', 'notfall', 'apps']) {
    assert.ok(codes.includes(pflicht), `Pflicht-Punkt fehlt: ${pflicht}`);
  }
  const alles = JSON.stringify(daten.punkte);
  assert.match(alles, /116 111/, 'Nummer gegen Kummer als Notfallkontakt');
  assert.match(alles, /Nicht-Ärger|ohne Ärger|ohne Handyverbot/, 'Vertrauens-/Nicht-Ärger-Pakt');
  assert.match(alles, /fragFINN/, 'kindgerechte Angebote benannt');
});

test('Datenvermeidung: der Kindername wird nur gedruckt, nicht gespeichert', () => {
  // Der Name-Input darf nirgends in localStorage landen.
  assert.match(appQuelle, /nur für den Druck|NICHT gespeichert|wird nicht gespeichert/i, 'Zusage im Code/Text');
  assert.ok(!/speichere\([^)]*name/i.test(appQuelle), 'Name darf nicht gespeichert werden');
});
