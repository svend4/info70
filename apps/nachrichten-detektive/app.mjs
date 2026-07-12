// Nachrichten-Detektive: Quiz zur Nachrichtenkompetenz (8-12 Jahre).
// Ablauf kommt aus @info70/quiz-kern; hier bleiben nur Daten, Texte, Politik.
import { starteQuiz } from '../../packages/quiz-kern/src/quiz.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';

installiereNetzwerkWaechter();

const daten = await fetch('daten/fragen.json').then((r) => r.json());
const RUNDE = 12;

starteQuiz({
  wurzel: document.getElementById('app'),
  daten,
  rekordSchluessel: 'nd.rekord',
  rundenGroesse: RUNDE,
  texte: {
    titel: '🕵️ Nachrichten-Detektive',
    untertitel: 'Echt oder Fake? Finde es heraus!',
    intro: `Du bekommst ${RUNDE} Fälle aus einem Vorrat von ${daten.fragen.length} – jede Runde ist anders. Prüfe Meldungen, Werbung und Tricks wie ein echter Detektiv.`,
    startKnopf: '▶️ Ermittlung starten',
    fallWort: 'Fall',
    binaerFrage: 'Echt oder Fake?',
    binaerJa: '✅ Echt',
    binaerNein: '❌ Fake',
    weiterKnopf: 'Nächster Fall ➡️',
    fertigTitel: 'Ermittlung abgeschlossen!',
    ergebnisSatz: (punkte, von, rekord) => `${punkte} von ${von} Fällen gelöst · Rekord: ${rekord}`,
  },
});

// Offline-Fähigkeit nach dem ersten Laden
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
