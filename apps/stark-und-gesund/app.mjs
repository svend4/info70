// Stark und gesund: Quiz zu gesundem Lebensstil (8-12 Jahre).
// Ablauf kommt aus @info70/quiz-kern; hier bleiben nur Daten, Texte, Politik.
import { starteQuiz } from '../../packages/quiz-kern/src/quiz.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';

installiereNetzwerkWaechter();

const daten = await fetch('daten/fragen.json').then((r) => r.json());

starteQuiz({
  wurzel: document.getElementById('app'),
  daten,
  rekordSchluessel: 'sug.rekord',
  rundenGroesse: 12,
  texte: {
    titel: '💪 Stark und gesund',
    untertitel: 'Was tut deinem Körper gut?',
    intro: 'Dein Körper ist dein Zuhause – ein Leben lang. In 12 Fragen findest du heraus, was dich fit, wach und stark macht: Bewegung, Schlaf, gutes Essen und kluge Pausen. Kein Punkt zählt für deine Gesundheit mehr als der nächste kleine Schritt!',
    startKnopf: '▶️ Los geht’s!',
    fallWort: 'Frage',
    binaerFrage: 'Stimmt das?',
    binaerJa: '✅ Stimmt',
    binaerNein: '❌ Stimmt nicht',
    weiterKnopf: 'Nächste Frage ➡️',
    fertigTitel: 'Geschafft!',
    ergebnisSatz: (punkte, von, rekord) => `${punkte} von ${von} richtig · Rekord: ${rekord}`,
  },
});

// Kein Service Worker mehr: Registrierungen und Caches früherer Versionen entfernen, damit nichts Altes ausgeliefert wird.
if ('serviceWorker' in navigator) navigator.serviceWorker.getRegistrations().then((rs) => rs.forEach((r) => r.unregister())).catch(() => {});
if ('caches' in globalThis) caches.keys().then((ks) => ks.forEach((k) => caches.delete(k))).catch(() => {});
