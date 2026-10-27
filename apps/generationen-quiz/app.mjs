// Generationen-Quiz: Tricks & Fallen (Enkel 8-12 + Großeltern, docs/09
// Nr. 221). quiz-kern-Quiz, das Kinderwelt-Maschen (Fake-Gewinnspiel,
// Kettenbrief) und Seniorenwelt-Maschen (Enkeltrick, Phishing) mischt –
// beide raten mit und erkennen: die Tricks funktionieren identisch.
// Ablauf aus @info70/quiz-kern. Politik docs/02: keine externen Anfragen.
import { starteQuiz } from '../../packages/quiz-kern/src/quiz.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';

installiereNetzwerkWaechter();

const daten = await fetch('daten/fragen.json').then((r) => r.json());

starteQuiz({
  wurzel: document.getElementById('app'),
  daten,
  rekordSchluessel: 'genq.rekord',
  rundenGroesse: 12,
  texte: {
    titel: '👵🧒 Generationen-Quiz',
    untertitel: 'Tricks & Fallen – Enkel und Großeltern raten zusammen',
    intro: 'Betrüger tricksen Kinder UND Großeltern aus – oft mit derselben Masche. 12 Fragen aus einem Vorrat von 14, mal aus der Kinderwelt, mal aus der Seniorenwelt. Ratet gemeinsam und erkennt: Der Trick ist immer der gleiche!',
    startKnopf: '▶️ Gemeinsam starten',
    fallWort: 'Frage',
    binaerFrage: 'Stimmt das?',
    binaerJa: '✅ Stimmt',
    binaerNein: '❌ Stimmt nicht',
    weiterKnopf: 'Nächste Frage ➡️',
    fertigTitel: 'Ende der Runde',
  },
});
