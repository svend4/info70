import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { istLautgetreu, pruefeMaterial, hoerOptionen, bildOptionen, silbenTeilen } from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/material.json', import.meta.url), 'utf8'));

test('Material gültig: 5 Vokale, 8 Konsonanten, KV-Silben, lautgetreue Wörter', () => {
  assert.deepEqual(pruefeMaterial(daten), []);
  assert.deepEqual(daten.vokale, ['A', 'E', 'I', 'O', 'U']);
  assert.equal(daten.konsonanten.length, 8);
  assert.ok(daten.woerter.length >= 10);
});

test('istLautgetreu: erlaubt OMA/ESEL, verbietet Dehnungs-h und Doppelbuchstaben', () => {
  assert.equal(istLautgetreu('OMA'), true);
  assert.equal(istLautgetreu('ESEL'), true);
  assert.equal(istLautgetreu('TOMATE'), true);
  assert.equal(istLautgetreu('FAHNE'), false, 'Dehnungs-h nach A');
  assert.equal(istLautgetreu('BALL'), false, 'Doppelbuchstabe');
  assert.equal(istLautgetreu('QUARK'), false, 'Q nicht im Anfangs-Alphabet');
  assert.equal(istLautgetreu('HOSE'), true, 'H am Wortanfang ist erlaubt');
});

test('hoerOptionen: 3 eindeutige, richtige an Position 0', () => {
  const erste = (l) => l[0];
  const opt = hoerOptionen('A', daten.vokale, erste);
  assert.equal(opt.length, 3);
  assert.equal(opt[0], 'A');
  assert.equal(new Set(opt).size, 3);
  assert.ok(opt.every((o) => daten.vokale.includes(o)));
});

test('bildOptionen: richtiges Emoji + 2 fremde, keine Duplikate', () => {
  const erste = (l) => l[0];
  const oma = daten.woerter.find((w) => w.wort === 'OMA');
  const opt = bildOptionen(oma, daten.woerter, erste);
  assert.equal(opt.length, 3);
  assert.equal(opt[0].richtig, true);
  assert.equal(opt[0].emoji, '👵');
  assert.equal(opt.filter((o) => o.richtig).length, 1);
  assert.equal(new Set(opt.map((o) => o.emoji)).size, 3);
});

test('silbenTeilen: KV-Silbenbögen (OMA→O-MA, TOMATE→TO-MA-TE, MOND bleibt ganz)', () => {
  assert.deepEqual(silbenTeilen('OMA'), ['O', 'MA']);
  assert.deepEqual(silbenTeilen('MAMA'), ['MA', 'MA']);
  assert.deepEqual(silbenTeilen('TOMATE'), ['TO', 'MA', 'TE']);
  assert.deepEqual(silbenTeilen('BANANE'), ['BA', 'NA', 'NE']);
  assert.deepEqual(silbenTeilen('MOND'), ['MOND']);
  assert.deepEqual(silbenTeilen('ESEL'), ['E', 'SEL']);
});

test('jedes Wort der Bank lässt sich in Silben teilen (nicht leer)', () => {
  for (const w of daten.woerter) {
    const teile = silbenTeilen(w.wort);
    assert.ok(teile.length >= 1, w.wort);
    assert.equal(teile.join(''), w.wort, `${w.wort}: Silben ergeben das Wort`);
  }
});
