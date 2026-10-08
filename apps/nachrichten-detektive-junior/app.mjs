// Nachrichten-Detektive junior (Kinder 6-8, docs/09 Nr. 257). quiz-kern-
// Variante mit Bildpaaren-Idee (per Emoji beschrieben) statt Textmeldungen:
// „Echt oder ausgedacht?“. Für die Kleinen alle Fragen (keine Auswahl),
// komplett vorlesbar. Ränge und Rekord bleiben erhalten. Politik docs/02:
// keine externen Anfragen, werbefrei.
import { starteQuiz } from '../../packages/quiz-kern/src/quiz.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';

installiereNetzwerkWaechter();

const daten = await fetch('daten/fragen.json').then((r) => r.json());
const RUNDE = daten.fragen.length; // für die Kleinen: alle Fragen

starteQuiz({
  wurzel: document.getElementById('app'),
  daten,
  hilfeInsel: true, // Safeguarding-Baustein (docs/09 Ось B Nr. 113)
  rekordSchluessel: 'ndj.rekord',
  rundenGroesse: RUNDE,
  texte: {
    titel: '🕵️ Nachrichten-Detektive junior',
    untertitel: 'Echt oder ausgedacht? Werde Bild-Detektiv! (6–8, zum Zuhören)',
    intro: 'Manche Bilder zeigen Sachen, die es wirklich gibt. Andere sind ausgedacht oder mit dem Computer gemacht. Schau genau hin und frag dich: Kann das wirklich sein? Du kannst dir alles vorlesen lassen.',
    startKnopf: '▶️ Los!',
    fallWort: 'Bild',
    binaerFrage: 'Echt oder ausgedacht?',
    binaerJa: '✅ Echt',
    binaerNein: '🤔 Ausgedacht',
    weiterKnopf: 'Weiter ➡️',
    fertigTitel: 'Super gemacht! 🎉',
    ergebnisSatz: (punkte, von, rekord) => `${punkte} von ${von} richtig · Bestwert: ${rekord}`,
  },
});
