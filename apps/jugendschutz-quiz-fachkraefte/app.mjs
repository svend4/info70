// Jugendschutz-Wissens-Quiz für Fachkräfte (docs/09 Nr. 188). quiz-kern-Quiz
// für Lehrkräfte, OGS- und Medienpädagogik-Fachkräfte: USK/FSK, warum ein
// „ab 6“-Spiel wegen Chat/Lootboxen riskant sein kann, Plattform-Pflichten.
// Jede Antwort mit Erklärung und Praxis-Tipp für den Elternabend.
// Politik docs/02: keine externen Anfragen.
import { starteQuiz } from '../../packages/quiz-kern/src/quiz.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';

installiereNetzwerkWaechter();

const daten = await fetch('daten/fragen.json').then((r) => r.json());

starteQuiz({
  wurzel: document.getElementById('app'),
  daten,
  rekordSchluessel: 'jsqf.rekord',
  rundenGroesse: 12,
  // Reines Fachkräfte-Werkzeug: es gibt hier keine eltern.html, der
  // Eltern-Link im Fuß wäre ein toter Link.
  elternSeite: false,
  texte: {
    titel: '🏫 Jugendschutz-Wissens-Quiz',
    untertitel: 'Für Lehrkräfte & Fachkräfte: USK/FSK, Risiken, Plattform-Pflichten',
    intro: 'Wie sicher sind Sie beim Jugendmedienschutz? 12 Fragen aus einem Vorrat von 14 – mit Erklärung und Praxis-Tipp für den nächsten Elternabend. Auch als Klassen-/Team-Modus am Beamer.',
    startKnopf: '▶️ Quiz starten',
    fallWort: 'Frage',
    binaerFrage: 'Stimmt das?',
    binaerJa: '✅ Stimmt',
    binaerNein: '❌ Stimmt nicht',
    weiterKnopf: 'Nächste Frage ➡️',
    fertigTitel: 'Geschafft!',
  },
});
