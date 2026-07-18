// Link-Kompass: Links und Buttons einordnen (8-12 Jahre).
// Ablauf aus @info70/quiz-kern (inkl. Klassen-Modus); hier nur Daten, Texte,
// Politik. Thema: Link-Arten (intern, gekennzeichnet extern, Download,
// App-Store, Werbelink) an URL/Symbolen/Hinweisen erkennen und vor dem
// Klicken pruefen. Warum gute Kinderseiten externe Links kennzeichnen.
import { starteQuiz } from '../../packages/quiz-kern/src/quiz.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';

installiereNetzwerkWaechter();

const daten = await fetch('daten/fragen.json').then((r) => r.json());
const RUNDE = 12;

starteQuiz({
  wurzel: document.getElementById('app'),
  daten,
  rekordSchluessel: 'lk.rekord',
  rundenGroesse: RUNDE,
  texte: {
    titel: '🧭 Link-Kompass',
    untertitel: 'Wohin führt dieser Link – und darfst du klicken?',
    intro: `Interner Link, externe Seite, Download, App-Store, Werbe-Falle: Nicht jeder Link ist gleich. Du bekommst ${RUNDE} Fälle aus einem Vorrat von ${daten.fragen.length} und lernst, Links an Adresse, Symbolen und Hinweisen einzuordnen – und vor dem Klicken zu prüfen.`,
    startKnopf: '▶️ Los geht’s',
    fallWort: 'Link',
    binaerFrage: 'Stimmt das?',
    binaerJa: '✅ Stimmt',
    binaerNein: '❌ Stimmt nicht',
    weiterKnopf: 'Nächster Link ➡️',
    fertigTitel: 'Geschafft!',
    ergebnisSatz: (punkte, von, rekord) => `${punkte} von ${von} Links richtig eingeordnet · Rekord: ${rekord}`,
  },
});
