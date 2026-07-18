// Deepfake-Spürnase: KI-Bilder und -Videos durchschauen (8-12 Jahre).
// Ablauf aus @info70/quiz-kern (inkl. Klassen-Modus); hier nur Daten, Texte,
// Politik. Thema: konkrete Pruefmerkmale fuer KI-Faelschungen (Haende, Licht,
// Text, fehlende Quelle) und dass KI-Inhalte gekennzeichnet sein muessen.
// Ergaenzt nachrichten-detektive (docs/09 Nr. 109/213).
import { starteQuiz } from '../../packages/quiz-kern/src/quiz.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';

installiereNetzwerkWaechter();

const daten = await fetch('daten/fragen.json').then((r) => r.json());
const RUNDE = 12;

starteQuiz({
  wurzel: document.getElementById('app'),
  daten,
  rekordSchluessel: 'dfs.rekord',
  rundenGroesse: RUNDE,
  texte: {
    titel: '🐽 Deepfake-Spürnase',
    untertitel: 'Echt oder von der KI gemacht?',
    intro: `KI kann täuschend echte Bilder und Videos erzeugen – aber sie macht Fehler. Du bekommst ${RUNDE} Fälle aus einem Vorrat von ${daten.fragen.length} und lernst die Prüfmerkmale: Hände, Licht, Text, Quelle. Werd zur Deepfake-Spürnase!`,
    startKnopf: '▶️ Los geht’s',
    fallWort: 'Fall',
    binaerFrage: 'Stimmt das?',
    binaerJa: '✅ Stimmt',
    binaerNein: '❌ Stimmt nicht',
    weiterKnopf: 'Nächster Fall ➡️',
    fertigTitel: 'Geschafft!',
    ergebnisSatz: (punkte, von, rekord) => `${punkte} von ${von} Fällen durchschaut · Rekord: ${rekord}`,
  },
});
