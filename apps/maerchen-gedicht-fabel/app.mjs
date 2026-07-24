// Märchen, Gedicht oder Fabel? (6-10): Gattungs-Quiz auf dem quiz-kern-Motor.
// Kurze Beispieltexte werden der richtigen Gattung zugeordnet, danach
// erklärt die App das Merkmal, an dem man sie erkennt.
// Praleska docs/10 (Kinder-Apps Nr. 19). Alle Beispieltexte Eigenproduktion,
// die beiden Sprichwörter sind gemeinfreies altes Sprachgut.
// Politik docs/02: keine externen Anfragen, nur der Rekord liegt löschbar
// auf dem Gerät.
import { starteQuiz } from '../../packages/quiz-kern/src/quiz.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';

installiereNetzwerkWaechter();

const daten = await fetch('daten/fragen.json').then((r) => r.json());
const RUNDE = 12;

starteQuiz({
  wurzel: document.getElementById('app'),
  daten,
  rekordSchluessel: 'gattung.rekord',
  rundenGroesse: RUNDE,
  texte: {
    titel: '📚 Märchen, Gedicht oder Fabel?',
    untertitel: 'Woran du erkennst, was du gerade liest',
    intro: `Jede Textsorte hat ihre eigenen Zeichen: „Es war einmal“, eine Lehre am Ende, Zeilen mit Takt, eine versteckte Frage. ${RUNDE} kurze Texte – erkennst du, was sie sind?`,
    startKnopf: '▶️ Los geht’s',
    fallWort: 'Text',
    binaerFrage: 'Stimmt das?',
    binaerJa: '✅ Stimmt',
    binaerNein: '❌ Stimmt nicht',
    weiterKnopf: 'Nächster Text ➡️',
    fertigTitel: 'Geschafft!',
    ergebnisSatz: (punkte, von, rekord) => `${punkte} von ${von} richtig · Rekord: ${rekord}`,
  },
});
