// Warum heißt das so? (5-7 in Ko-Nutzung, 8-12 eigenständig):
// Quiz zu sprechenden Namen auf dem quiz-kern-Motor. Namen, die halten
// was sie versprechen, stehen neben Namen, die in die Irre führen.
// Praleska docs/10 (Kinder-Apps Nr. 23). Politik docs/02: keine externen
// Anfragen, nichts wird gespeichert, das Kind wird nicht bewertet.
import { starteQuiz } from '../../packages/quiz-kern/src/quiz.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';

installiereNetzwerkWaechter();

const daten = await fetch('daten/fragen.json').then((r) => r.json());
const RUNDE = 12;

starteQuiz({
  wurzel: document.getElementById('app'),
  daten,
  rekordSchluessel: 'warum.rekord',
  rundenGroesse: RUNDE,
  texte: {
    titel: '🔤 Warum heißt das so?',
    untertitel: 'Namen, die etwas verraten – und Namen, die schwindeln',
    intro: `Löwenzahn, Maulwurf, Meerschweinchen: Viele Namen erzählen, wie etwas aussieht oder was es tut. Manche stimmen genau – und manche führen dich aufs Glatteis. ${RUNDE} Fragen, und danach schaust du Wörter anders an.`,
    startKnopf: '▶️ Los geht’s',
    fallWort: 'Frage',
    binaerFrage: 'Stimmt das?',
    binaerJa: '✅ Stimmt',
    binaerNein: '❌ Stimmt nicht',
    weiterKnopf: 'Nächste Frage ➡️',
    fertigTitel: 'Ende der Runde',
  },
});
