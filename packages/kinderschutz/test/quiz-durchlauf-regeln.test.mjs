import { test } from 'node:test';
import assert from 'node:assert/strict';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { appsAusArgs, codeDateien, istEnde, istWeiter, nichtQuizApps, nutztQuizMotor, quelltextAusOrdner } from '../src/quiz-durchlauf-regeln.mjs';

// Alle Apps mit einem echten Import von quiz-kern (Stand: 26). Neue Quiz-App oder eine, die den Motor
// verliert: dieser Test bricht, bis die Liste bewusst angepasst ist. So läuft eine neue Quiz-App nicht still
// am Durchlauf vorbei.
const QUIZ_APPS = [
  'anzeige-oder-nicht', 'app-rechte-quiz', 'darf-ich-posten', 'deepfake-spuernase', 'fachquiz-erstes-lebensjahr',
  'fake-shop-fahnder', 'generationen-quiz', 'herkunftssprachen-bruecke', 'impressum-detektive',
  'jugendschutz-quiz-fachkraefte', 'kinderrechte-entdecker', 'koeder-quiz', 'koerper-entdecker', 'link-kompass',
  'maerchen-gedicht-fabel', 'mathe-entdecker', 'mensch-tier-pflanze', 'mini-rechte-entdecker', 'nachrichten-detektive',
  'nachrichten-detektive-junior', 'nachrichten-detektive-profi', 'plattform-rechte-13', 'reim-radar', 'stark-und-gesund',
  'warum-heisst-das-so', 'wer-dahinter',
];

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

test('Quiz-Motor: ein echter Import zählt, ein Kommentar über den Motor nicht', () => {
  assert.equal(nutztQuizMotor("import { starteQuiz } from '../../packages/quiz-kern/src/quiz.mjs';"), true);
  assert.equal(nutztQuizMotor("import { x } from './logik.mjs';"), false);
  // Kontrolle: die breite Suche nach dem Wort träfe den Kommentar; die Regel darf das nicht.
  const kommentar = "// Bewusst NICHT auf quiz-kern gebaut: Der Motor bringt Punkte.\nexport const x = 1;";
  assert.equal(/quiz-kern/.test(kommentar), true, 'Kontrolle: das Wort steht im Text');
  assert.equal(nutztQuizMotor(kommentar), false);
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

test('Motor-Import in einer Nebendatei zählt: logik.mjs mit quiz-kern macht die App zur Quiz-App', () => {
  const tmp = mkdtempSync(join(tmpdir(), 'quiz-regel-'));
  try {
    const app = join(tmp, 'app');
    mkdirSync(join(app, 'test'), { recursive: true });
    writeFileSync(join(app, 'app.mjs'), "import { x } from './logik.mjs';\n");
    writeFileSync(join(app, 'index.html'), '<p>keine Quiz-Angabe</p>\n');
    writeFileSync(join(app, 'logik.mjs'), "import { starteQuiz } from '../../packages/quiz-kern/src/quiz.mjs';\n");
    writeFileSync(join(app, 'test', 'x.test.mjs'), "import '../../../packages/quiz-kern/src/quiz.mjs';\n");
    // Kontrolle: die alte Regel las nur app.mjs und index.html und übersah die Nebendatei.
    const alt = "import { x } from './logik.mjs';\n<p>keine Quiz-Angabe</p>";
    assert.equal(nutztQuizMotor(alt), false, 'Kontrolle: die alte Regel fand die App nicht');
    assert.equal(codeDateien(app).map((p) => p.split('/').pop()).join(' '), 'app.mjs index.html logik.mjs');
    assert.equal(nutztQuizMotor(quelltextAusOrdner(app)), true);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
});

test('Die Liste der Quiz-Apps ist festgeschrieben: 26 Apps mit echtem Import, keine still dazu oder weg', () => {
  const wurzel = fileURLToPath(new URL('../../../', import.meta.url));
  const gefunden = readdirSync(join(wurzel, 'apps'))
    .filter((a) => { try { return nutztQuizMotor(quelltextAusOrdner(join(wurzel, 'apps', a))); } catch { return false; } })
    .sort();
  assert.equal(QUIZ_APPS.length, 26);
  assert.deepEqual(gefunden, [...QUIZ_APPS].sort(), 'Quiz-Apps haben sich geändert: Liste und Durchlauf prüfen');
});

test('Wirklicher Bestand: Stream-Б-Apps und Apps mit bloßem Kommentar nutzen den Motor nicht', async () => {
  const wurzel = fileURLToPath(new URL('../../../', import.meta.url));
  for (const slug of ['chat-rechte', 'daten-schatz', 'notruf-held', 'wer-wohnt-wo']) {
    assert.equal(nutztQuizMotor(quelltextAusOrdner(join(wurzel, 'apps', slug))), false, `${slug} ist keine quiz-kern-App`);
  }
  // farb-labor erwähnt quiz-kern nur in einem Kommentar in logik.mjs.
  assert.equal(nutztQuizMotor(quelltextAusOrdner(join(wurzel, 'apps', 'farb-labor'))), false, 'farb-labor: nur ein Kommentar');
  for (const slug of ['mathe-entdecker', 'koeder-quiz', 'wer-dahinter']) {
    assert.equal(nutztQuizMotor(quelltextAusOrdner(join(wurzel, 'apps', slug))), true, `${slug} ist eine quiz-kern-App`);
  }
});
