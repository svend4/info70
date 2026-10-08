// Nachrichten-Detektive Profi (13-15, docs/09 Ось A / Nr. 164). quiz-kern-
// Variante mit schwereren Fällen: Deepfake-Merkmale, KI-generierte Texte,
// systematischer Quellencheck (Wer? Wo noch? Wie alt?). Ränge und Rekord wie
// üblich. Politik docs/02: keine externen Anfragen, werbefrei.
import { starteQuiz } from '../../packages/quiz-kern/src/quiz.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';

installiereNetzwerkWaechter();

const daten = await fetch('daten/fragen.json').then((r) => r.json());

starteQuiz({
  wurzel: document.getElementById('app'),
  daten,
  hilfeInsel: true, // Safeguarding-Baustein (docs/09 Ось B Nr. 113)
  rekordSchluessel: 'ndp.rekord',
  rundenGroesse: 12,
  texte: {
    titel: '🕵️ Nachrichten-Detektive Profi',
    untertitel: 'Deepfakes, KI-Texte & Quellencheck – die Profi-Stufe (13–15)',
    intro: 'Fälschungen werden immer besser. Hier trainierst du die Profi-Routine: Wer sagt das? Wo steht es noch? Wie alt ist es? Dazu Deepfake-Merkmale und KI-Texte erkennen. 12 Fälle pro Runde.',
    startKnopf: '▶️ Ermittlung starten',
    fallWort: 'Fall',
    fertigTitel: 'Ermittlung abgeschlossen! 🎉',
    ergebnisSatz: (punkte, von, rekord) => `${punkte} von ${von} geknackt · Bestwert: ${rekord}`,
  },
});
