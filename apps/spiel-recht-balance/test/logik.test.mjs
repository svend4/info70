import { test } from 'node:test';
import assert from 'node:assert/strict';
import { RECHTE, STUFEN, zuKurz, auswertung, vorschlag, LEKTIONEN } from '../logik.mjs';

test('Rechte: genau drei, jedes mit Art.-31-Bezug', () => {
  assert.deepEqual(RECHTE.map((r) => r.code), ['medien', 'ruhe', 'draussen']);
  for (const r of RECHTE) {
    assert.ok(r.name && r.emoji, `${r.code}: Feld fehlt`);
    assert.match(r.artikel, /Art\. 31/, `${r.code}: Kinderrechts-Bezug fehlt`);
  }
  assert.deepEqual(STUFEN.map((s) => s.wert), [0, 1, 2, 3]);
});

test('zuKurz: gar nicht/wenig zählt als zu kurz, genug/viel nicht', () => {
  assert.ok(zuKurz(0));
  assert.ok(zuKurz(1));
  assert.ok(!zuKurz(2));
  assert.ok(!zuKurz(3));
});

test('auswertung: alles genug = Gleichgewicht', () => {
  const a = auswertung({ medien: 2, ruhe: 2, draussen: 2 });
  assert.equal(a.imGleichgewicht, true);
  assert.deepEqual(a.zuKurz, []);
  assert.match(a.satz, /Balance/);
});

test('auswertung: viel Medien, wenig Ruhe/Draußen -> gezielter Hinweis, kein Verbot', () => {
  const a = auswertung({ medien: 3, ruhe: 0, draussen: 1 });
  assert.equal(a.imGleichgewicht, false);
  assert.ok(a.zuKurz.includes('ruhe') && a.zuKurz.includes('draussen'));
  assert.ok(a.viel.includes('medien'));
  assert.match(a.satz, /Recht/, 'als Recht gerahmt, nicht als Verbot');
  // Keine Verbots-/Schuld-Sprache
  assert.ok(!/verboten|zu viel|schlecht|schäm/i.test(a.satz), 'kein Verbots-/Scham-Ton');
});

test('auswertung: einzelnes zu kurz gekommenes Recht wird benannt', () => {
  const a = auswertung({ medien: 2, ruhe: 2, draussen: 0 });
  assert.deepEqual(a.zuKurz, ['draussen']);
  assert.match(a.satz, /Draußen & Freunde/);
});

test('vorschlag: jeder Code liefert einen konkreten, selbstbestimmten Plan', () => {
  for (const r of RECHTE) {
    const v = vorschlag(r.code);
    assert.ok(v.length >= 30, `${r.code}: Vorschlag fehlt`);
    assert.match(v, /morgen|Plane|Nimm|Verabrede|geh/i, `${r.code}: als Selbst-Plan formuliert`);
  }
});

test('Lektionen: drei Rechte statt Bildschirmzeit, Art. 31, Selbstregulation', () => {
  const text = LEKTIONEN.join(' ');
  assert.match(text, /drei Rechte/);
  assert.match(text, /Artikel 31|Art\. 31/);
  assert.match(text, /selbst/i, 'Selbstregulation statt Fremdverbot');
});
