// Anzeige oder nicht? Influencer-Werbung erkennen (8-12 Jahre).
// Erweiterung des Werbe-Radars (docs/09 Nr. 110). Ablauf aus quiz-kern (inkl.
// Klassen-Modus); hier nur Daten, Texte, Politik. Thema: Kennzeichnungspflicht
// (#anzeige), Merch, Produktplatzierung, Affiliate - und Werbeabsicht von
// echter Meinung trennen.
import { starteQuiz } from '../../packages/quiz-kern/src/quiz.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';

installiereNetzwerkWaechter();

const daten = await fetch('daten/fragen.json').then((r) => r.json());
const RUNDE = 12;

starteQuiz({
  wurzel: document.getElementById('app'),
  daten,
  rekordSchluessel: 'aon.rekord',
  rundenGroesse: RUNDE,
  texte: {
    titel: '🏷️ Anzeige oder nicht?',
    untertitel: 'Echte Empfehlung – oder bezahlte Werbung?',
    intro: `Influencer zeigen ständig Produkte. Aber: Ist das eine ehrliche Meinung oder bezahlte Werbung? Du bekommst ${RUNDE} Fälle aus einem Vorrat von ${daten.fragen.length} – #Anzeige, Merch, Produktplatzierung, Rabattcodes – und lernst, Werbung zu erkennen und zu trennen.`,
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
