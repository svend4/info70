// Köder-Quiz: Phishing- und Betrugsnachrichten erkennen (8-12 Jahre).
// Ablauf kommt aus @info70/quiz-kern; hier bleiben nur Daten, Texte, Politik.
import { starteQuiz } from '../../packages/quiz-kern/src/quiz.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';

installiereNetzwerkWaechter();

const daten = await fetch('daten/fragen.json').then((r) => r.json());
const RUNDE = 12;

starteQuiz({
  wurzel: document.getElementById('app'),
  daten,
  hilfeInsel: true, // Safeguarding-Baustein (docs/09 Ось B Nr. 113)
  rekordSchluessel: 'kq.rekord',
  rundenGroesse: RUNDE,
  texte: {
    titel: '🎣 Köder-Quiz',
    untertitel: 'Echt oder Köder? Beiß nicht an!',
    intro: `Betrüger werfen Köder aus: falsche Paket-SMS, erfundene Gewinne, Gratis-Skins. Du bekommst ${RUNDE} Nachrichten aus einem Vorrat von ${daten.fragen.length} – jede Runde ist anders. Durchschaue die Tricks und schwimm vorbei!`,
    startKnopf: '▶️ Köder-Check starten',
    fallWort: 'Nachricht',
    binaerFrage: 'Echt oder Köder?',
    binaerJa: '✅ Echt',
    binaerNein: '🎣 Köder',
    weiterKnopf: 'Nächste Nachricht ➡️',
    fertigTitel: 'Köder-Check geschafft!',
    ergebnisSatz: (punkte, von, rekord) => `${punkte} von ${von} Nachrichten durchschaut · Rekord: ${rekord}`,
  },
});

// Kein Service Worker mehr: Registrierungen und Caches früherer Versionen entfernen, damit nichts Altes ausgeliefert wird.
if ('serviceWorker' in navigator) navigator.serviceWorker.getRegistrations().then((rs) => rs.forEach((r) => r.unregister())).catch(() => {});
if ('caches' in globalThis) caches.keys().then((ks) => ks.forEach((k) => caches.delete(k))).catch(() => {});
