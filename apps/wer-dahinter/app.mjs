// Wer steckt dahinter? Transparenz-Merkmale in Beitraegen (8-12 Jahre).
// Ergaenzung zu nachrichten-detektive (docs/09 Nr. 51). Ablauf aus quiz-kern
// (inkl. Klassen-Modus); hier nur Daten, Texte, Politik. Thema: die drei
// Transparenz-Merkmale Autor, Datum, Quelle finden und entscheiden, ob ein
// Beitrag nachpruefbar ist.
import { starteQuiz } from '../../packages/quiz-kern/src/quiz.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';

installiereNetzwerkWaechter();

const daten = await fetch('daten/fragen.json').then((r) => r.json());
const RUNDE = 12;

starteQuiz({
  wurzel: document.getElementById('app'),
  daten,
  rekordSchluessel: 'wd.rekord',
  rundenGroesse: RUNDE,
  texte: {
    titel: '🔎 Wer steckt dahinter?',
    untertitel: 'Wer schreibt? Wann? Woher weiß er das?',
    intro: `Eine gute Kinderseite sagt immer, WER schreibt und WOHER die Info stammt. Du bekommst ${RUNDE} Fälle aus einem Vorrat von ${daten.fragen.length} und suchst die drei Transparenz-Merkmale: Autor, Datum, Quelle. Ist der Beitrag nachprüfbar – oder nicht?`,
    startKnopf: '▶️ Ermittlung starten',
    fallWort: 'Fall',
    binaerFrage: 'Stimmt das?',
    binaerJa: '✅ Stimmt',
    binaerNein: '❌ Stimmt nicht',
    weiterKnopf: 'Nächster Fall ➡️',
    fertigTitel: 'Fall gelöst!',
    ergebnisSatz: (punkte, von, rekord) => `${punkte} von ${von} Fällen durchschaut · Rekord: ${rekord}`,
  },
});
