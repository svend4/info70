// Darf ich das posten? Urheber- und Persoenlichkeitsrecht im Alltag (8-12).
// Ablauf aus @info70/quiz-kern (inkl. Klassen-Modus); hier nur Daten, Texte,
// Politik. Thema: Recht am eigenen Bild, fremde Inhalte/Memes, Musik unter
// Videos, peinliche Fotos - die Rechte der ANDEREN, wenn ICH poste.
import { starteQuiz } from '../../packages/quiz-kern/src/quiz.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';

installiereNetzwerkWaechter();

const daten = await fetch('daten/fragen.json').then((r) => r.json());
const RUNDE = 12;

starteQuiz({
  wurzel: document.getElementById('app'),
  daten,
  hilfeInsel: true, // Safeguarding-Baustein (docs/09 Ось B Nr. 113)
  rekordSchluessel: 'dip.rekord',
  rundenGroesse: RUNDE,
  texte: {
    titel: '📮 Darf ich das posten?',
    untertitel: 'Erlaubt oder nicht? Fair oder unfair?',
    intro: `Fremdes Meme teilen, Foto vom Freund posten, Musik unters Video legen – was ist okay, was nicht? Du bekommst ${RUNDE} Alltagsfälle aus einem Vorrat von ${daten.fragen.length}. Nach jeder Antwort erfährst du die Regel dahinter.`,
    startKnopf: '▶️ Los geht’s',
    fallWort: 'Fall',
    binaerFrage: 'Stimmt das?',
    binaerJa: '✅ Stimmt',
    binaerNein: '❌ Stimmt nicht',
    weiterKnopf: 'Nächster Fall ➡️',
    fertigTitel: 'Geschafft!',
    ergebnisSatz: (punkte, von, rekord) => `${punkte} von ${von} Fällen fair gelöst · Rekord: ${rekord}`,
  },
});
