import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SEITE_RE, verweiseInZeile, pruefeZitat, normalisiere, seitenAusText, fundstellen } from '../src/seiten-pruefung.mjs';

// Serie C (Plan 18.10, Abschnitt 7): die maschinelle Prüfung der Seitenangaben gegen die Textkopie.
// Die Tests nutzen kleine Fixtures; die Prüfung der echten Apps läuft mit tools/app-seiten-pruefen.mjs.

test('Seitenangaben: S., Seite, стр. und с. mit Bereich; „Abs. 2 S. 1“ ist kein Seitenverweis', () => {
  const treffer = (s) => [...s.matchAll(SEITE_RE)].map((m) => m[0]);
  assert.deepEqual(treffer('(S. 19)'), ['S. 19']);
  assert.deepEqual(treffer('Buchquelle: S. 267–268 (24'), ['S. 267–268']);
  assert.deepEqual(treffer('Seite 5 und с. 81'), ['Seite 5', 'с. 81']);
  assert.deepEqual(treffer('стр. 12'), ['стр. 12']);
  assert.deepEqual(treffer('Art. 28 Abs. 3 S. 1 SGB VIII'), []);
});

test('Verweise je Zeile: Zitat vor oder nach der Seitenangabe, Bereich in Seiten aufgelöst', () => {
  const [v] = verweiseInZeile('«Познать, чтобы воспитывать», S. 19–20 (Kapitel)');
  assert.deepEqual(v.seiten, [19, 20]);
  assert.deepEqual(v.zitate, ['Познать, чтобы воспитывать']);
  const [w] = verweiseInZeile('Bereich S. 267–268 ohne Zitat');
  assert.deepEqual(w.zitate, []);
});

test('Zitat gegen Seiten: wörtlich, nur mit denselben Wörtern, nicht gefunden, kein Zitat', () => {
  const seiten = seitenAusText('Erste Seite mit dem Satz über die Bewegung.\fZweite Seite: Begabungsarten und Temperament der Kinder.');
  assert.equal(pruefeZitat('Bewegung', seiten, [1]).ergebnis, 'wörtlich');
  assert.equal(pruefeZitat('Temperament, Begabungsarten', seiten, [2]).ergebnis, 'Wörter');
  assert.equal(pruefeZitat('Begabungsarten', seiten, [1]).ergebnis, 'nicht gefunden');
  assert.equal(pruefeZitat('  ', seiten, [1]).ergebnis, 'kein Zitat');
});

test('Fundstellen: die Seite, auf der ein Zitat wörtlich steht (zur Hinweisgabe bei falscher Seite)', () => {
  const seiten = seitenAusText('x\fEine Stelle über Begabungsarten\fmehr Text\fnoch einmal Begabungsarten');
  assert.deepEqual(fundstellen('Begabungsarten', seiten), [2, 4]);
});

test('Normalform: Trennstrich am Zeilenende, Satzzeichen und Groß und Klein fallen weg', () => {
  assert.equal(normalisiere('Be-\ngabungs­ arten, „Temperament“!'), 'begabungs arten temperament');
  assert.equal(seitenAusText('a\fb').length, 2);
});
