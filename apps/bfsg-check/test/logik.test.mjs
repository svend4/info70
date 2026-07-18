import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hexZuRgb, leuchtdichte, kontrast, wcagStufe } from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/kriterien.json', import.meta.url), 'utf8'));

test('hexZuRgb: gültige und ungültige Eingaben', () => {
  assert.deepEqual(hexZuRgb('#ffffff'), { r: 255, g: 255, b: 255 });
  assert.deepEqual(hexZuRgb('000000'), { r: 0, g: 0, b: 0 });
  assert.deepEqual(hexZuRgb('#ff8800'), { r: 255, g: 136, b: 0 });
  assert.equal(hexZuRgb('xyz'), null);
  assert.equal(hexZuRgb('#fff'), null, 'Kurzform wird (bewusst) nicht akzeptiert');
});

test('leuchtdichte: Schwarz 0, Weiß 1', () => {
  assert.equal(Math.round(leuchtdichte({ r: 0, g: 0, b: 0 }) * 1000) / 1000, 0);
  assert.equal(Math.round(leuchtdichte({ r: 255, g: 255, b: 255 }) * 1000) / 1000, 1);
});

test('kontrast: bekannte Referenzwerte (WCAG)', () => {
  assert.equal(kontrast('#000000', '#ffffff'), 21, 'Schwarz auf Weiß = 21:1');
  assert.equal(kontrast('#ffffff', '#ffffff'), 1, 'gleiche Farbe = 1:1');
  // Reihenfolge egal (heller/dunkler wird intern sortiert)
  assert.equal(kontrast('#ffffff', '#000000'), 21);
  assert.equal(kontrast('quatsch', '#000'), null, 'ungültig -> null');
  const grau = kontrast('#777777', '#ffffff');
  assert.ok(grau > 4 && grau < 5, `#777 auf Weiß ~4,5:1 (ist: ${grau})`);
});

test('wcagStufe: Grenzen für normale und große Schrift', () => {
  assert.equal(wcagStufe(21).stufe, 'AAA');
  assert.equal(wcagStufe(4.5).stufe, 'AA');
  assert.equal(wcagStufe(4.49).stufe, 'ungenuegend');
  // große Schrift: 3:1 reicht für AA
  assert.equal(wcagStufe(3, true).stufe, 'AA');
  assert.equal(wcagStufe(2.9, true).stufe, 'ungenuegend');
  assert.equal(wcagStufe(null).stufe, 'ungueltig');
});

test('Kriterien: 3 WCAG-Prinzipien, relevante Checks, Bezug', () => {
  assert.equal(daten.bereiche.length, 3, 'Wahrnehmbar/Bedienbar/Verständlich');
  const alle = daten.bereiche.flatMap((b) => b.kriterien);
  assert.ok(alle.length >= 8);
  const ids = alle.map((k) => k.id);
  assert.equal(new Set(ids).size, ids.length, 'eindeutige IDs');
  for (const k of alle) {
    assert.ok(k.text.length >= 20 && k.hilfe.length >= 30, `${k.id}: Text/Hilfe fehlt`);
    assert.match(k.bezug, /WCAG|BFSG/, `${k.id}: Bezug fehlt`);
  }
  const text = JSON.stringify(alle).toLowerCase();
  for (const muster of [/kontrast/, /alternativtext|alt-text/, /tastatur/, /einfache? sprache/, /vorlese/]) {
    assert.match(text, muster, `Kernthema fehlt: ${muster}`);
  }
});
