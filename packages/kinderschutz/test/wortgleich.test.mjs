import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fensterAusSeiten, wortgleich, normalisiere, FENSTER } from '../../../tools/wortgleich-pruefen.mjs';

// Rechtsrahmen docs/10, Punkt 1: kein wörtlicher Text aus dem Buch. Die Prüfung findet Folgen von sieben Wörtern.
const quelle = ['Erste Seite mit anderem Text.', 'Hier steht ein Satz mit genau sieben gleichen Wörtern hintereinander.\fx'];

test('Normalform: Trennstrich am Zeilenende und Satzzeichen fallen weg', () => {
  assert.equal(normalisiere('Ein Wort-\nteil, „Zitat“!'), 'ein wortteil zitat');
});

test('Eine Folge von sieben gleichen Wörtern wird mit ihrer Seite gefunden', () => {
  const fenster = fensterAusSeiten(quelle);
  assert.equal(FENSTER, 7);
  assert.equal(wortgleich('steht ein Satz mit genau sieben gleichen Wörtern', fenster), 2);
});

test('Sechs Wörter reichen nicht; eine Paraphrase wird nicht gefunden', () => {
  const fenster = fensterAusSeiten(quelle);
  assert.equal(wortgleich('ein Satz mit genau sieben gleichen', fenster), null);
  assert.equal(wortgleich('Ein Text mit sieben übereinstimmenden Begriffen', fenster), null);
});
