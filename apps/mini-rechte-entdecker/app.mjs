// Mini-Rechte-Entdecker: die wichtigsten Kinderrechte für 6-8 (Binaer-Quiz).
// Content-Pack im Binaer-Modus des quiz-kern (docs/09 Nr. 134): sehr kurze
// Ja/Nein-Fragen, komplett vorlesbar (Web Speech), fuer Kinder, die noch nicht
// sicher lesen. Erfuellt zugleich BFSG/EAA (einfache Bedienbarkeit).
// Ergaenzt kinderrechte-entdecker fuer die Kleinen.
import { starteQuiz } from '../../packages/quiz-kern/src/quiz.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';

installiereNetzwerkWaechter();

const daten = await fetch('daten/fragen.json').then((r) => r.json());
const RUNDE = daten.fragen.length; // fuer die Kleinen: alle Fragen, keine Auswahl

starteQuiz({
  wurzel: document.getElementById('app'),
  daten,
  hilfeInsel: true, // Safeguarding-Baustein (docs/09 Ось B Nr. 113)
  rekordSchluessel: 'mre.rekord',
  rundenGroesse: RUNDE,
  texte: {
    titel: '🌟 Mini-Rechte-Entdecker',
    untertitel: 'Deine Rechte – ganz einfach. Zum Zuhören.',
    intro: 'Jedes Kind hat Rechte. Wir schauen sie uns zusammen an. Tippe auf 👍 Ja oder 👎 Nein. Du kannst dir alles vorlesen lassen.',
    startKnopf: '▶️ Los!',
    fallWort: 'Frage',
    binaerFrage: 'Stimmt das?',
    binaerJa: '👍 Ja',
    binaerNein: '👎 Nein',
    weiterKnopf: 'Weiter ➡️',
    fertigTitel: 'Super gemacht! 🎉',
    ergebnisSatz: (punkte, von, rekord) => `${punkte} von ${von} richtig · Bestwert: ${rekord}`,
  },
});
