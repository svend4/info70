// Kinderrechte-Entdecker: Quiz zu den Rechten von Kindern (8-12 Jahre).
// Ablauf kommt aus @info70/quiz-kern; hier bleiben nur Daten, Texte, Politik.
import { starteQuiz } from '../../packages/quiz-kern/src/quiz.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';

installiereNetzwerkWaechter();

const daten = await fetch('daten/fragen.json').then((r) => r.json());

starteQuiz({
  wurzel: document.getElementById('app'),
  daten,
  hilfeInsel: true, // Safeguarding-Baustein (docs/09 Ось B Nr. 113)
  rekordSchluessel: 'kre.rekord',
  rundenGroesse: 12,
  texte: {
    titel: '🕊️ Kinderrechte-Entdecker',
    untertitel: 'Du hast Rechte. Kennst du sie?',
    intro: 'Fast alle Länder der Welt haben Kindern eigene Rechte versprochen – auf Papier und im Internet. Entdecke 12 Fragen aus einem Vorrat von 51, was dir zusteht: Schutz, Förderung, Beteiligung und deine Rechte im Netz!',
    startKnopf: '▶️ Entdeckungsreise starten',
    fallWort: 'Frage',
    binaerFrage: 'Stimmt das?',
    binaerJa: '✅ Stimmt',
    binaerNein: '❌ Stimmt nicht',
    weiterKnopf: 'Nächste Frage ➡️',
    fertigTitel: 'Entdeckungsreise geschafft!',
  },
});

// Kein Service Worker mehr: Registrierungen und Caches früherer Versionen entfernen, damit nichts Altes ausgeliefert wird.
if ('serviceWorker' in navigator) navigator.serviceWorker.getRegistrations().then((rs) => rs.forEach((r) => r.unregister())).catch(() => {});
if ('caches' in globalThis) caches.keys().then((ks) => ks.forEach((k) => caches.delete(k))).catch(() => {});
