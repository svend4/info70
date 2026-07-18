import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MERKMALE, zaehleAktiv, istAn, bewertung, allesAn } from '../logik.mjs';

test('Merkmale: die vier Barrierefreiheits-Dimensionen, eindeutige IDs', () => {
  const ids = MERKMALE.map((m) => m.id);
  assert.deepEqual(ids.sort(), ['bild', 'kontrast', 'schrift', 'vorlesen']);
  for (const m of MERKMALE) {
    assert.ok(m.emoji && m.name, `${m.id}: Meta fehlt`);
    assert.ok(m.aus.length >= 10 && m.ein.length >= 10, `${m.id}: aus/ein-Text fehlt`);
    assert.ok(m.warum.length >= 30, `${m.id}: Begründung zu kurz`);
  }
});

test('zaehleAktiv und istAn', () => {
  assert.equal(zaehleAktiv({}), 0);
  assert.equal(zaehleAktiv({ kontrast: true, schrift: true }), 2);
  assert.equal(zaehleAktiv(allesAn()), MERKMALE.length);
  assert.equal(istAn({ vorlesen: true }, 'vorlesen'), true);
  assert.equal(istAn({}, 'vorlesen'), false);
});

test('bewertung: nichts an → kaum nutzbar', () => {
  const b = bewertung({});
  assert.equal(b.aktiv, 0);
  assert.equal(b.fertig, false);
  assert.match(b.text, /kaum nutzbar/);
});

test('bewertung: teilweise → Fortschritt mit Restzahl', () => {
  const b = bewertung({ kontrast: true });
  assert.equal(b.aktiv, 1);
  assert.equal(b.fertig, false);
  assert.match(b.text, new RegExp(`${MERKMALE.length - 1} Merkmal`));
});

test('bewertung: alles an → für ALLE, mit UN-KRK-Bezug', () => {
  const b = bewertung(allesAn());
  assert.equal(b.aktiv, MERKMALE.length);
  assert.equal(b.fertig, true);
  assert.match(b.text, /ALLE/);
  assert.match(b.text, /Art\. 23/, 'Recht auf Teilhabe genannt');
});

test('Lerninhalt: jedes „warum“ erklärt einen konkreten Nutzen', () => {
  const alles = MERKMALE.map((m) => m.warum).join(' ').toLowerCase();
  assert.match(alles, /sieht|sehen|kontrast/, 'Sehen/Kontrast');
  assert.match(alles, /lesen|liest/, 'Lesen/Vorlesen');
  assert.match(alles, /screenreader|beschreibung/, 'Bildbeschreibung/Screenreader');
});
