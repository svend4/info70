// Reim-Radar: phonologische Bewusstheit als Vorlese-Quiz (4-6, mit Erwachsenem).
// Reimpaare, Anlaute, Wortlänge, Silben – der wichtigste Prädiktor für den
// späteren Schriftspracherwerb. Ablauf aus @info70/quiz-kern (inkl. Vorlesen,
// Klassen-/Duett-/Staffel-Modus). Praleska docs/10 (Top-30 Nr. 5).
// Politik docs/02: keine externen Anfragen, nichts gespeichert, keine Wertung;
// der Motor entfernt beim Start nur den früheren Schlüssel.
import { starteQuiz } from '../../packages/quiz-kern/src/quiz.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';

installiereNetzwerkWaechter();

const daten = await fetch('daten/fragen.json').then((r) => r.json());
const RUNDE = 8;

starteQuiz({
  wurzel: document.getElementById('app'),
  daten,
  rekordSchluessel: 'reimradar.rekord',
  rundenGroesse: RUNDE,
  texte: {
    titel: '👂 Reim-Radar',
    untertitel: 'Reime, Laute und Silben hören (zusammen mit einem großen Menschen)',
    intro: `Spielt gemeinsam! Ihr hört ${RUNDE} kleine Aufgaben zu Reimen, Anlauten und Silben. Sprecht die Wörter langsam und laut – am besten klatscht ihr die Silben mit. Tippt dann die Antwort.`,
    startKnopf: '▶️ Los geht’s',
    fallWort: 'Aufgabe',
    binaerFrage: 'Reimt sich das?',
    binaerJa: '✅ Ja, das reimt sich',
    binaerNein: '🚫 Nein, das reimt sich nicht',
    weiterKnopf: 'Nächste Aufgabe ➡️',
    fertigTitel: 'Toll gemacht!',
  },
});
