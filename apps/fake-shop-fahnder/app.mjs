// Fake-Shop-Fahnder: echter Shop oder Fake? (8-12 Jahre).
// Ablauf aus @info70/quiz-kern (inkl. Klassen-Modus); hier nur Daten, Texte,
// Politik. Thema: Warnsignale von Fake-Shops (zu billig, kein Impressum, nur
// Vorkasse, Fantasie-Siegel, Countdown-Druck) und richtiges Handeln.
import { starteQuiz } from '../../packages/quiz-kern/src/quiz.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';

installiereNetzwerkWaechter();

const daten = await fetch('daten/fragen.json').then((r) => r.json());
const RUNDE = 12;

starteQuiz({
  wurzel: document.getElementById('app'),
  daten,
  hilfeInsel: true, // Safeguarding-Baustein (docs/09 Ось B Nr. 113)
  rekordSchluessel: 'fsf.rekord',
  rundenGroesse: RUNDE,
  texte: {
    titel: '🕵️ Fake-Shop-Fahnder',
    untertitel: 'Echter Shop oder böse Falle?',
    intro: `Manche Online-Shops wollen nur dein Geld – und schicken nie Ware. Du bekommst ${RUNDE} Fälle aus einem Vorrat von ${daten.fragen.length}: Prüfe die Warnsignale (zu billig, kein Impressum, nur Vorkasse, Fantasie-Siegel, Countdown) und entlarve die Fakes!`,
    startKnopf: '▶️ Ermittlung starten',
    fallWort: 'Fall',
    binaerFrage: 'Echt oder Fake?',
    binaerJa: '✅ Echter Shop',
    binaerNein: '🚨 Fake-Shop',
    weiterKnopf: 'Nächster Fall ➡️',
    fertigTitel: 'Fall gelöst!',
    ergebnisSatz: (punkte, von, rekord) => `${punkte} von ${von} Shops durchschaut · Rekord: ${rekord}`,
  },
});
