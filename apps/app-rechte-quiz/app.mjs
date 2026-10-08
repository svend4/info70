// App-Rechte-Quiz: Berechtigungen mit dem Zweck der App abgleichen (8-12).
// Ablauf aus @info70/quiz-kern (inkl. Klassen-Modus); hier nur Daten, Texte,
// Politik. Thema: Passt eine Berechtigung (Kamera, Mikrofon, Standort,
// Kontakte) zur Aufgabe der App? Wenn nicht: Nein sagen. Ergaenzt die
// Berechtigungs-Safari (Familie) um ein Kinder-Quiz.
import { starteQuiz } from '../../packages/quiz-kern/src/quiz.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';

installiereNetzwerkWaechter();

const daten = await fetch('daten/fragen.json').then((r) => r.json());
const RUNDE = 12;

starteQuiz({
  wurzel: document.getElementById('app'),
  daten,
  hilfeInsel: true, // Safeguarding-Baustein (docs/09 Ось B Nr. 113)
  rekordSchluessel: 'arq.rekord',
  rundenGroesse: RUNDE,
  texte: {
    titel: '🔑 App-Rechte-Quiz',
    untertitel: 'Braucht die App das wirklich?',
    intro: `Apps fragen nach Berechtigungen: Kamera, Mikrofon, Standort, Kontakte. Du bekommst ${RUNDE} Fälle aus einem Vorrat von ${daten.fragen.length} und entscheidest: Passt die Berechtigung zur Aufgabe der App – oder solltest du „Nein“ sagen?`,
    startKnopf: '▶️ Los geht’s',
    fallWort: 'Fall',
    binaerFrage: 'Passt das?',
    binaerJa: '✅ Passt',
    binaerNein: '🚫 Passt nicht',
    weiterKnopf: 'Nächster Fall ➡️',
    fertigTitel: 'Geschafft!',
    ergebnisSatz: (punkte, von, rekord) => `${punkte} von ${von} richtig geprüft · Rekord: ${rekord}`,
  },
});
