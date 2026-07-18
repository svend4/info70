// Plattform-Rechte-Pack 13+ (Jugendliche 13-15). Quiz zu den konkreten
// Rechten auf Plattformen (docs/09 Nr. 147): Moderations-Begründung (DSA
// Art. 17), Widerspruch (Art. 20), Datenauskunft/-löschung (DSGVO Art. 15/17),
// Einwilligungsalter (Art. 8), Werbeverbot für Minderjährige (DSA Art. 28).
// Ablauf kommt aus @info70/quiz-kern; hier nur Daten, Texte, Politik.
import { starteQuiz } from '../../packages/quiz-kern/src/quiz.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';

installiereNetzwerkWaechter();

const daten = await fetch('daten/fragen.json').then((r) => r.json());

starteQuiz({
  wurzel: document.getElementById('app'),
  daten,
  rekordSchluessel: 'pr13.rekord',
  rundenGroesse: 12,
  texte: {
    titel: '⚖️ Plattform-Rechte 13+',
    untertitel: 'Welche Rechte hast du konkret auf Plattformen?',
    intro: 'DSA, DSGVO, AI Act – klingt trocken, gibt dir aber echte Knöpfe und Fristen in die Hand. 12 Fragen aus einem Vorrat von 14: Kenne die Rechte, mit denen du dich auf Plattformen wehren kannst.',
    startKnopf: '▶️ Quiz starten',
    fallWort: 'Frage',
    binaerFrage: 'Stimmt das?',
    binaerJa: '✅ Stimmt',
    binaerNein: '❌ Stimmt nicht',
    weiterKnopf: 'Nächste Frage ➡️',
    fertigTitel: 'Geschafft!',
    ergebnisSatz: (punkte, von, rekord) => `${punkte} von ${von} Rechten gekannt · Rekord: ${rekord}`,
  },
});
