import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { appsAusArgs, istEnde, istWeiter, nichtQuizApps, nutztQuizMotor } from '../src/quiz-durchlauf-regeln.mjs';

// Jede Erkennung hat einen Fall, der vorher falsch war, und ein Gegenbeispiel, das weiter richtig bleibt.
// Die alten Muster stehen als Kontrolle daneben: sie müssen den Fehlfall tatsächlich treffen.
const ALT_WEITER = /➡|^(Weiter|Zum Ergebnis|Fertig|Ergebnis)\b/;
const ALT_ENDE = /🏠|Zum Start|Noch einmal|Noch eine|Neue Runde|Neue Klassen|Nochmal/;

test('Weiter: „Zum Abschluss“ führt weiter und ist keine Antwort', () => {
  assert.equal(ALT_WEITER.test('Zum Abschluss 🚩'), false, 'Kontrolle: das alte Muster erkannte den Knopf nicht');
  assert.equal(istWeiter('Zum Abschluss 🚩'), true);
});

test('Weiter: eine Antwort mit „Ergebnis“ im Text bleibt Antwort', () => {
  assert.equal(istWeiter('Die Antwort war das Ergebnis'), false);
  assert.equal(istWeiter('➡️ Nächste Frage'), true);
  assert.equal(istWeiter('Weiter'), true);
});

test('Ende: „Nochmal vorlesen“ ist kein Endknopf, „Nochmal“ als Neustart schon', () => {
  assert.equal(ALT_ENDE.test('🔊 Nochmal vorlesen'), true, 'Kontrolle: das alte Muster hielt auf jeder Karte für das Ende');
  assert.equal(istEnde('🔊 Nochmal vorlesen'), false);
  assert.equal(istEnde('🔁 Nochmal spielen'), true);
  assert.equal(istEnde('Nochmal'), true);
});

test('Ende: die bekannten Endknöpfe bleiben erkannt', () => {
  for (const t of ['🏠 Zum Start', 'Noch einmal', 'Noch eine Runde', 'Neue Runde', 'Neue Klassen-Runde']) {
    assert.equal(istEnde(t), true, t);
  }
});

test('Quiz-Motor: eine App mit dem Import zählt, eine ohne nicht', () => {
  assert.equal(nutztQuizMotor("import { starteQuiz } from '../../packages/quiz-kern/src/quiz.mjs';"), true);
  assert.equal(nutztQuizMotor("import { x } from './logik.mjs';"), false);
});

test('Nicht-Quiz-Apps werden abgelehnt, statt falsch gemessen', () => {
  const eintraege = [
    { slug: 'quiz-app', quelltext: "import '../../packages/quiz-kern/src/quiz.mjs';" },
    { slug: 'karten-app', quelltext: 'export const karten = [];' },
  ];
  assert.deepEqual(nichtQuizApps(eintraege), ['karten-app']);
});

test('Aufruf: ohne --modus geht der erste App-Name nicht verloren', () => {
  // Kontrolle: die alte Filterung nahm bei fehlendem --modus den Index -1 + 1 = 0, also den ersten Namen.
  const alt = (args, modIdx) => args.filter((_, i) => ![modIdx, modIdx + 1].includes(i));
  assert.deepEqual(alt(['chat-rechte', '--ausgabe', 'x'], -1), ['--ausgabe', 'x'], 'Kontrolle: der alte Fehler');
  assert.deepEqual(appsAusArgs(['chat-rechte', '--ausgabe', 'x']), ['chat-rechte']);
});

test('Aufruf: Optionen fallen samt Wert weg, Namen bleiben in der Reihenfolge', () => {
  assert.deepEqual(appsAusArgs(['a', '--modus', 'einzel', 'b']), ['a', 'b']);
  assert.deepEqual(appsAusArgs(['--ausgabe', 'ordner', 'a', 'b']), ['a', 'b']);
  assert.deepEqual(appsAusArgs(['a', '--modus', 'alle', '--ausgabe', 'o']), ['a']);
  assert.deepEqual(appsAusArgs(['--modus', 'duett']), []);
});

test('Wirklicher Bestand: Stream-Б-Apps nutzen den Motor nicht, bekannte Quiz-Apps schon', async () => {
  const wurzel = fileURLToPath(new URL('../../../', import.meta.url));
  const lesen = async (slug) => {
    const teile = await Promise.all(['app.mjs', 'index.html'].map((f) => readFile(join(wurzel, 'apps', slug, f), 'utf8').catch(() => '')));
    return teile.join('\n');
  };
  for (const slug of ['chat-rechte', 'daten-schatz', 'notruf-held', 'wer-wohnt-wo']) {
    assert.equal(nutztQuizMotor(await lesen(slug)), false, `${slug} ist keine quiz-kern-App`);
  }
  for (const slug of ['mathe-entdecker', 'koeder-quiz', 'wer-dahinter']) {
    assert.equal(nutztQuizMotor(await lesen(slug)), true, `${slug} ist eine quiz-kern-App`);
  }
});
