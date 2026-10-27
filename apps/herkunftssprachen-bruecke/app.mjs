// Herkunftssprachen-Brücke uk/ru: Sprachvergleich als Vorlese-Quiz (8-12,
// auch Eltern). Brücken-Wörter (Kognate/Internationalismen) UND falsche Freunde
// zwischen Deutsch, Russisch und Ukrainisch – die Herkunftssprache als Schatz.
// Ablauf aus @info70/quiz-kern. Praleska docs/10 (Top-30 Nr. 12).
// Politik docs/02: keine externen Anfragen, nichts gespeichert.
import { starteQuiz } from '../../packages/quiz-kern/src/quiz.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';

installiereNetzwerkWaechter();

const daten = await fetch('daten/fragen.json').then((r) => r.json());
const RUNDE = 11;

starteQuiz({
  wurzel: document.getElementById('app'),
  daten,
  rekordSchluessel: 'herkunft.rekord',
  rundenGroesse: RUNDE,
  texte: {
    titel: '🌉 Herkunftssprachen-Brücke',
    untertitel: 'Deutsch, Russisch, Ukrainisch – Brücken-Wörter und falsche Freunde entdecken',
    intro: `Viele Wörter reisen zwischen den Sprachen: „Telefon“, „Musik“, „Doktor“ klingen fast überall gleich. Andere sind „falsche Freunde“ – sie klingen gleich, meinen aber Verschiedenes. In ${RUNDE} Fällen wirst du zum Sprach-Detektiv. Deine Sprache ist ein Schatz!`,
    startKnopf: '▶️ Los geht’s',
    fallWort: 'Fall',
    binaerFrage: 'Stimmt das?',
    binaerJa: '✅ Ja, stimmt',
    binaerNein: '🚫 Nein, falscher Freund',
    weiterKnopf: 'Nächster Fall ➡️',
    fertigTitel: 'Super gebrückt!',
  },
});
