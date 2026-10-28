// Fachquiz „Entwicklung im ersten Lebensjahr“ (Praleska docs/10, Kita-Abschnitt,
// Nr. 76). quiz-kern-Quiz für Auszubildende und Tagespflegepersonen. Lernwerkzeug,
// kein Test für ein Kind: es geht um Quellenwissen, nicht um Einschätzung.
// Jede Antwort nennt die Seite der Quelle; wo die Quelle sich widerspricht,
// sagt die Erklärung das. Keine externen Anfragen (docs/02).
import { starteQuiz } from '../../packages/quiz-kern/src/quiz.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';

installiereNetzwerkWaechter();

const daten = await fetch('daten/fragen.json').then((r) => r.json());

starteQuiz({
  wurzel: document.getElementById('app'),
  daten,
  rekordSchluessel: 'fqel.rekord',
  rundenGroesse: 10,
  // Reines Fachkräfte-Werkzeug: keine eltern.html, der Eltern-Link im Fuß wäre tot.
  elternSeite: false,
  texte: {
    titel: '🍼 Fachquiz: erstes Lebensjahr',
    // Ehrliche Marke an Seitenangaben (docs/02, Entscheidung Max 22а): kein Mensch hat die Seiten geprüft. Die Seitenangaben
    // stehen in den Erklärungen der Auflösung (daten/fragen.json); quiz-kern gibt der Auflösung keine eigene Zeile für die Marke.
    // Der Untertitel steht auf jedem Bildschirm des Quiz, auch gleich über der Auflösung.
    untertitel: 'Für Ausbildung und Praxis – mit Seitenangabe zu jeder Antwort. Seitenangaben nicht von einem Menschen geprüft.',
    intro: 'Wie gut kennen Sie die Quelle zur Entwicklung im ersten Lebensjahr? 10 Fragen aus einem Vorrat von 13 – mit Erklärung und Seite. Es geht um Quellenwissen, nicht um die Einschätzung eines Kindes.',
    startKnopf: '▶️ Quiz starten',
    fallWort: 'Frage',
    binaerFrage: 'Stimmt das?',
    binaerJa: '✅ Stimmt',
    binaerNein: '❌ Stimmt nicht',
    weiterKnopf: 'Nächste Frage ➡️',
    fertigTitel: 'Ende der Runde',
  },
});
