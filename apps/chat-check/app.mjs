// Chat-Check: Kommunikationsfunktionen bewerten (8-12).
// Szenario-Pack (docs/09 Nr. 49): Kinder beurteilen Chat-/Kommentar-Funktionen
// auf Beispielseiten (moderiertes Gaestebuch vs. offener Fremden-Chat vs.
// Kommentare ohne Aufsicht) und waehlen die sichere Handlung/Einschaetzung.
// Lernziel: die Schutzmerkmale Moderation, Melde-Funktion, Spitzname erkennen -
// OHNE Grooming-Inhalte, rein als Kriterien-Training. Nutzt Hilfe-Insel.
// 2/1/0-Muster: bewertet wird die Antwortoption, nicht das Kind; jede Antwort bekommt eine
// Rueckmeldung mit Erklaerung. Politik: keine externen Anfragen, speichert NICHTS.
import { el, vorlesen, mischen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { hilfeInsel } from '../../packages/kinder-ui/js/hilfe-insel.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';

installiereNetzwerkWaechter();

// Alter Schluessel aus frueheren Versionen: einmal beim Start entfernen.
try { localStorage.removeItem('cc.rekord'); } catch {}

const app = document.getElementById('app');
const daten = await fetch('daten/szenarien.json').then((r) => r.json());

let szenarien = [];
let index = 0;

function zeige(...knoten) {
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🔎 Chat-Check'),
    el('p', { class: 'k-untertitel' }, 'Ist dieser Chat sicher? Erkenne die Schutzmerkmale.'),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · ohne Anmeldung · diese App speichert nichts · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
  app.querySelector('button')?.focus();
}

function startBildschirm() {
  zeige(
    el('section', { class: 'k-karte' },
      el('p', {}, `Moderiertes Gästebuch, offener Fremden-Chat, Kommentare ohne Aufsicht: In ${daten.szenarien.length} Beispielen schaust du dir eine Chat-Funktion an und entscheidest, wie sicher sie ist. Achte auf drei Schutzmerkmale: Moderation, Melde-Knopf und Spitzname statt echtem Namen.`),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starteRunde }, '▶️ Los geht’s'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen('Achte auf drei Schutzmerkmale: Moderation, Melde-Knopf und Spitzname statt echtem Namen.') }, '🔊 Vorlesen'))),
    el('section', { class: 'k-karte' },
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => zeige(hilfeInsel({ zurueck: startBildschirm })) }, '🆘 Ich brauche Hilfe')));
}

function starteRunde() {
  szenarien = mischen(daten.szenarien);
  index = 0;
  szenarioBildschirm();
}

function szenarioBildschirm() {
  const s = szenarien[index];
  const optionen = mischen(s.optionen);
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-untertitel' }, `Beispiel ${index + 1} von ${szenarien.length}`),
      el('div', { class: 'k-fortschritt', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': szenarien.length, 'aria-valuenow': index },
        el('div', { style: `width:${(index / szenarien.length) * 100}%` })),
      el('div', { style: 'background:#e7e3dc;border-radius:0.6rem;padding:0.6rem;margin:0.5rem 0' },
        el('p', { style: 'margin:0;font-weight:600' }, `💬 ${s.situation}`)),
      el('p', { style: 'font-weight:600' }, s.frage),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`${s.situation} ${s.frage} ${optionen.map((o) => o.text).join('. Oder: ')}`) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        ...optionen.map((o) =>
          el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => antworte(s, o) }, o.text)))));
}

function antworte(s, option) {
  const titel = option.wert === 2 ? 'Sicher erkannt! 🔎✨' : option.wert === 1 ? 'Okay – aber schau genauer hin.' : 'Vorsicht – das ist nicht sicher.';
  const klasse = option.wert === 2 ? 'k-hinweis--richtig' : option.wert === 1 ? '' : 'k-hinweis--falsch';
  zeige(
    el('section', { class: 'k-karte' },
      el('div', { class: `k-hinweis ${klasse}` },
        el('p', { style: 'font-weight:700;margin-top:0' }, titel),
        el('p', { style: 'margin:0' }, s.erklaerung)),
      el('div', { class: 'k-hinweis', style: 'margin-top:0.5rem' },
        el('p', { style: 'margin:0;font-size:0.9rem' }, `Merkmal: ${s.schutzmerkmal}`)),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`${titel} ${s.erklaerung}`) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: weiter }, index + 1 < szenarien.length ? 'Nächstes Beispiel ➡️' : 'Zum Schluss 🏁'))));
}

function weiter() {
  index++;
  if (index < szenarien.length) szenarioBildschirm();
  else endBildschirm();
}

function endBildschirm() {
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '🔎'),
      el('p', { class: 'k-untertitel', style: 'font-weight:700' }, 'Ende der Runde'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starteRunde }, '🔁 Noch einmal'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: startBildschirm }, '🏠 Zum Start'))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin:0' }, '📌 Die drei Schutzmerkmale: 1) Moderation – jemand passt auf. 2) Melde-Knopf – du kannst Probleme melden. 3) Spitzname – du brauchst keinen echten Namen. Fehlen sie, sei besonders vorsichtig.')));
}

startBildschirm();
