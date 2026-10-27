// Der Körper-Entdecker – Was in dir steckt (5-7 in Ko-Nutzung, 8-12 allein):
// Quiz zu innerem Körperbau und Gesundheit auf dem quiz-kern-Motor.
// Praleska docs/10 (Kinder-Apps Nr. 10). Alle Fragen und Erklärungen
// Eigenproduktion. Politik docs/02: keine externen Anfragen, nichts wird
// gespeichert; der Motor entfernt beim Start nur den früheren Schlüssel.
import { starteQuiz } from '../../packages/quiz-kern/src/quiz.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';

installiereNetzwerkWaechter();

const daten = await fetch('daten/fragen.json').then((r) => r.json());
const RUNDE = 12;

starteQuiz({
  wurzel: document.getElementById('app'),
  daten,
  rekordSchluessel: 'koerper.rekord',
  rundenGroesse: RUNDE,
  texte: {
    titel: '🫀 Der Körper-Entdecker',
    untertitel: 'Was in dir steckt',
    intro: `Herz, Lunge, Knochen, Muskeln, Haut: In dir arbeitet gerade ein ganzes Team, ohne dass du daran denken musst. ${RUNDE} Fragen zeigen dir, was da drinnen los ist – und was deinem Körper guttut.`,
    startKnopf: '▶️ Los geht’s',
    fallWort: 'Frage',
    binaerFrage: 'Stimmt das?',
    binaerJa: '✅ Stimmt',
    binaerNein: '❌ Stimmt nicht',
    weiterKnopf: 'Nächste Frage ➡️',
    fertigTitel: 'Ende der Runde',
  },
});
