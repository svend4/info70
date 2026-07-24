import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TONLEITER, TETRACHORDE, tonFuer, hoehereStufe, richtungVon, folgeRichtig, baueAufgabe, pruefeTonleiter } from '../logik.mjs';

test('Tonleiter ist gültig: 8 Stufen, streng steigend, saubere Oktave, Tetrachorde 1-4/5-8', () => {
  assert.deepEqual(pruefeTonleiter(), []);
  assert.deepEqual(TETRACHORDE.erster, [1, 2, 3, 4]);
  assert.deepEqual(TETRACHORDE.zweiter, [5, 6, 7, 8]);
});

test('Stimmton und Namen stimmen: a = 440 Hz, deutsche Namen c..h..c′, Solmisation Do..Si..Do', () => {
  assert.equal(tonFuer(6).hz, 440);
  assert.equal(tonFuer(6).deutsch, 'a');
  assert.equal(tonFuer(7).deutsch, 'h');
  assert.equal(tonFuer(1).solmisation, 'Do');
  assert.equal(tonFuer(8).solmisation, 'Do');
  assert.equal(tonFuer(9), null);
  assert.equal(tonFuer(0), null);
});

test('hoehereStufe und richtungVon', () => {
  assert.equal(hoehereStufe(3, 7), 7);
  assert.equal(hoehereStufe(5, 2), 5);
  assert.equal(richtungVon([1, 2, 3]), 'rauf');
  assert.equal(richtungVon([8, 7, 6]), 'runter');
  assert.equal(richtungVon([1, 3, 2]), 'gemischt');
  assert.equal(richtungVon([1]), 'gemischt');
});

test('folgeRichtig: exakte Übereinstimmung nötig', () => {
  assert.ok(folgeRichtig([1, 2, 3], [1, 2, 3]));
  assert.ok(!folgeRichtig([1, 2, 3], [1, 2]));
  assert.ok(!folgeRichtig([1, 2, 3], [1, 2, 4]));
  assert.ok(!folgeRichtig([1, 2, 3], null));
});

test('baueAufgabe ist deterministisch mit injiziertem Wähler', () => {
  const erste = (liste) => liste[0];
  const hoeher = baueAufgabe('hoeher', erste);
  assert.deepEqual(hoeher.stufen, [1, 2]);
  assert.equal(hoeher.richtig, 2);
  const richtung = baueAufgabe('richtung', erste);
  assert.deepEqual(richtung.stufen, [1, 2, 3]);
  assert.equal(richtung.richtig, 'rauf');
  const letzte = (liste) => liste[liste.length - 1];
  const runter = baueAufgabe('richtung', letzte);
  assert.equal(runter.richtig, 'runter');
  assert.deepEqual(runter.stufen, [8, 7, 6]);
  const nachbau = baueAufgabe('nachbau', erste, 3);
  assert.deepEqual(nachbau.stufen, [1, 1, 1]);
  assert.equal(richtungVon(nachbau.richtig), 'gemischt');
  assert.equal(baueAufgabe('unbekannt', erste), null);
});

test('Richtungs-Aufgaben bleiben im Tetrachord (kein Sprung über die Fa-Sol-Grenze)', () => {
  for (const kombi of [[0, 0, 0], [0, 0, 1], [0, 1, 0], [1, 0, 0], [1, 1, 1]]) {
    let i = 0;
    const waehler = (liste) => liste[Math.min(kombi[i++] ?? 0, liste.length - 1)];
    const a = baueAufgabe('richtung', waehler);
    const imErsten = a.stufen.every((s) => TETRACHORDE.erster.includes(s));
    const imZweiten = a.stufen.every((s) => TETRACHORDE.zweiter.includes(s));
    assert.ok(imErsten || imZweiten, `Folge ${a.stufen} bleibt in einem Tetrachord`);
    assert.equal(a.stufen.length, 3);
    assert.notEqual(richtungVon(a.stufen), 'gemischt');
  }
});
