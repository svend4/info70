// Impressum-Detektive: Wer steckt hinter einer Webseite? (8-12 Jahre).
// Ablauf kommt aus @info70/quiz-kern (inkl. Klassen-Modus); hier bleiben nur
// Daten, Texte, Politik. Thema: Impressumspflicht (DDG § 5, MStV § 18),
// Impressum finden, echtes vs. Fake-Impressum, Transparenz als Schutz.
import { starteQuiz } from '../../packages/quiz-kern/src/quiz.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';

installiereNetzwerkWaechter();

const daten = await fetch('daten/fragen.json').then((r) => r.json());
const RUNDE = 12;

starteQuiz({
  wurzel: document.getElementById('app'),
  daten,
  hilfeInsel: true, // Safeguarding-Baustein (docs/09 Ось B Nr. 113)
  rekordSchluessel: 'imp.rekord',
  rundenGroesse: RUNDE,
  texte: {
    titel: '🕵️ Impressum-Detektive',
    untertitel: 'Wer steckt hinter dieser Seite?',
    intro: `Jede seriöse Seite verrät, wer sie betreibt – im Impressum. Du bekommst ${RUNDE} Fälle aus einem Vorrat von ${daten.fragen.length}: Ist ein echtes Impressum da? Wo versteckt es sich? Und woran erkennst du einen Fake? Werd zum Transparenz-Detektiv!`,
    startKnopf: '▶️ Ermittlung starten',
    fallWort: 'Fall',
    binaerFrage: 'Stimmt das?',
    binaerJa: '✅ Stimmt',
    binaerNein: '❌ Stimmt nicht',
    weiterKnopf: 'Nächster Fall ➡️',
    fertigTitel: 'Fall gelöst!',
    ergebnisSatz: (punkte, von, rekord) => `${punkte} von ${von} Fällen geknackt · Rekord: ${rekord}`,
  },
});
