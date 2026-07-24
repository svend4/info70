// Mensch-Tier-Pflanze: Was uns verbindet – Vergleichs-Quiz zu den
// gemeinsamen Lebenszeichen (atmen, essen, trinken, wachsen, bewegen,
// reagieren, Nachwuchs). Ablauf aus @info70/quiz-kern (inkl. Vorlesen).
// Praleska docs/10 (Kinder-Apps Nr. 9): 5-7 in Ko-Nutzung, 8-12 allein.
// Politik docs/02: keine externen Anfragen, nur Rekord in localStorage.
import { starteQuiz } from '../../packages/quiz-kern/src/quiz.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';

installiereNetzwerkWaechter();

const daten = await fetch('daten/fragen.json').then((r) => r.json());
const RUNDE = 12;

starteQuiz({
  wurzel: document.getElementById('app'),
  daten,
  rekordSchluessel: 'mtp.rekord',
  rundenGroesse: RUNDE,
  texte: {
    titel: '🧑🐦🌳 Mensch, Tier, Pflanze',
    untertitel: 'Was uns alle verbindet',
    intro: `Ein Kind, eine Amsel und eine Buche sehen völlig verschieden aus. Trotzdem tun alle drei dasselbe: atmen, sich ernähren, trinken, wachsen, auf ihre Umgebung reagieren und für Nachwuchs sorgen. In ${RUNDE} Fragen findest du heraus, was gleich ist – und was jeder auf seine eigene Art macht.`,
    startKnopf: '▶️ Los geht’s',
    fallWort: 'Frage',
    binaerFrage: 'Stimmt das?',
    binaerJa: '✅ Stimmt',
    binaerNein: '❌ Stimmt nicht',
    weiterKnopf: 'Nächste Frage ➡️',
    fertigTitel: 'Geschafft!',
    ergebnisSatz: (punkte, von, rekord) => `${punkte} von ${von} richtig · Rekord: ${rekord}`,
  },
});
