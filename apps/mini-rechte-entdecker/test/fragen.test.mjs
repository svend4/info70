import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pruefeFragen } from '../../../packages/quiz-kern/src/schema.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/fragen.json', import.meta.url), 'utf8'));

test('Fragenbank: Schema gültig (quiz-kern)', () => {
  assert.deepEqual(pruefeFragen(daten, { mindestFragen: 8, mindestErklaerung: 20 }), []);
});

test('für die Kleinen (6-8): NUR binaer, keine Wahl-Fragen', () => {
  assert.ok(daten.fragen.every((f) => f.typ === 'binaer'), 'ab 6 nur Ja/Nein');
});

test('didaktische Balance: beide Antworten kommen vor', () => {
  const antworten = new Set(daten.fragen.map((f) => f.korrekt));
  assert.ok(antworten.has('ja') && antworten.has('nein'), 'sonst lernt das Kind "immer ja"');
});

test('kurze, ermutigende Erklärungen (Leichte Sprache), keine Scham', () => {
  for (const f of daten.fragen) {
    assert.ok(f.aussage.length <= 90, `${f.id}: Aussage zu lang für 6-8`);
    const saetze = f.erklaerung.split(/(?<=[.!?])\s+/).filter((s) => /\w/.test(s));
    const maxWorte = Math.max(...saetze.map((s) => s.split(/\s+/).length));
    assert.ok(maxWorte <= 12, `${f.id}: Erklärungs-Satz zu lang (${maxWorte} Wörter)`);
    assert.ok(!/dumm|falsch gemacht/i.test(f.erklaerung), `${f.id}: kein Scham-Ton`);
  }
});

test('die wichtigsten Rechte sind abgedeckt', () => {
  const kats = new Set(daten.fragen.map((f) => f.kategorie));
  for (const pflicht of ['Schutz', 'Privat', 'Spiel', 'Meinung']) {
    assert.ok(kats.has(pflicht), `Recht fehlt: ${pflicht}`);
  }
  const alles = JSON.stringify(daten.fragen).toLowerCase();
  assert.match(alles, /hilfe|erwachsene/, 'Hilfe holen ist stark');
});

test('Ränge sind erreichbar (kein Rang über der Fragenzahl)', () => {
  const maxAb = Math.max(...daten.raenge.map((r) => r.ab));
  assert.ok(maxAb <= daten.fragen.length);
});
