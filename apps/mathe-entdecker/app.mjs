// Mathe-Entdecker: frühe mathematische Bildung als Vorlese-Quiz (5-7).
// Mengen, Zählen, Formen, Reihen/Muster, Vergleichen, Raumrichtung, Teilen,
// Zeit. Ablauf aus @info70/quiz-kern (inkl. Vorlesen, Klassen-/Duett-/Staffel-
// Modus). Praleska docs/10 (Top-30 Nr. 6). Alle Aufgaben Eigenproduktion.
// Politik docs/02: keine externen Anfragen, nichts gespeichert, keine Wertung.
import { starteQuiz } from '../../packages/quiz-kern/src/quiz.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';

installiereNetzwerkWaechter();

const daten = await fetch('daten/fragen.json').then((r) => r.json());
const RUNDE = 10;

starteQuiz({
  wurzel: document.getElementById('app'),
  daten,
  rekordSchluessel: 'mathe.rekord',
  rundenGroesse: RUNDE,
  texte: {
    titel: '🔢 Mathe-Entdecker',
    untertitel: 'Zahlen, Formen und Muster entdecken (am besten gemeinsam)',
    intro: `Entdecke Mathe im Alltag! Du bekommst ${RUNDE} kleine Aufgaben zu Mengen, Zahlen, Formen und Mustern. Sprich sie ruhig laut mit – tippe dann deine Antwort.`,
    startKnopf: '▶️ Los geht’s',
    fallWort: 'Aufgabe',
    binaerFrage: 'Stimmt das?',
    binaerJa: '✅ Ja, stimmt',
    binaerNein: '🚫 Nein, stimmt nicht',
    weiterKnopf: 'Nächste Aufgabe ➡️',
    fertigTitel: 'Toll gerechnet!',
  },
});
