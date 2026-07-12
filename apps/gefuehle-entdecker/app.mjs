// Gefühle-Entdecker: Reaktions-Wahl-Spiel zu sozialen Emotionen (5-7 Jahre).
// Konzept aus dem Praleska-Baukasten (docs/10, Idee 9: sozial-emotionale
// Bildung) - alle Szenen, Texte und Gefühle sind neu formuliert.
// Sehr einfache Sprache, große Emojis, alles vorlesbar - für Vorschulkinder,
// die noch nicht sicher lesen. Bewusst OHNE Punkte, ohne Ranking, ohne
// "richtig/falsch"-Scham: jedes Kind kommt bis zum Ende, das Feedback ist
// immer ermutigend. NICHTS wird gespeichert (kein localStorage).
// Politik docs/02: keine externen Anfragen (CSP + Netzwerk-Wächter).
import { el, vorlesen, mischen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const daten = await fetch('daten/szenarien.json').then((r) => r.json());

let szenarien = [];
let index = 0;
const gesammelt = [];

function zeige(...knoten) {
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🌈 Gefühle-Entdecker'),
    el('p', { class: 'k-untertitel' }, 'Sei lieb. Hilf mit. Entdecke Gefühle.'),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · ohne Anmeldung · nichts wird gespeichert · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
  app.querySelector('button')?.focus();
}

function startBildschirm() {
  const intro = 'Hier entdeckst du Gefühle. In 8 kleinen Bildern hilfst du anderen Kindern. Es gibt keine Fehler. Tippe zum Starten.';
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '🌈'),
      el('p', {}, 'Hier entdeckst du Gefühle.'),
      el('p', {}, 'In 8 kleinen Bildern hilfst du anderen Kindern.'),
      el('p', {}, 'Es gibt keine Fehler. Du schaffst das!'),
      el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => vorlesen(intro) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starteRunde }, '▶️ Los geht’s'))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin:0' }, '👉 Am besten spielst du das mit einem Erwachsenen zusammen.')));
}

function starteRunde() {
  szenarien = mischen(daten.szenarien);
  index = 0;
  gesammelt.length = 0;
  szenarioBildschirm();
}

function szenarioBildschirm() {
  const s = szenarien[index];
  const optionen = mischen(s.optionen);
  const vorleseText = `${s.situation} ${s.frage} ${optionen.map((o) => o.text).join(' Oder: ')}`;
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-untertitel' }, `Bild ${index + 1} von ${szenarien.length}`),
      el('div', { class: 'k-fortschritt', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': szenarien.length, 'aria-valuenow': index },
        el('div', { style: `width:${(index / szenarien.length) * 100}%` })),
      el('p', { class: 'k-gross' }, s.emoji),
      el('p', { style: 'font-weight:700;font-size:1.3em;text-align:center' }, s.situation),
      el('p', { style: 'text-align:center' }, s.frage),
      el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => vorlesen(vorleseText) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        ...optionen.map((o) =>
          el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => antworte(s, o) }, o.text)))));
}

function antworte(s, option) {
  gesammelt.push(s.emoji);
  const richtig = option.wert === 2;
  const titel = richtig ? 'Wie lieb von dir! 💛' : 'Danke, dass du überlegst!';
  const lob = richtig ? s.lobRichtig : s.lobFalsch;
  const klasse = richtig ? 'k-hinweis--richtig' : '';
  const vorleseText = `${lob} ${s.tipp}`;
  const letzte = index + 1 >= szenarien.length;
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, richtig ? '🌟' : '💭'),
      el('div', { class: `k-hinweis ${klasse}` },
        el('p', { style: 'font-weight:700;margin-top:0' }, titel),
        el('p', {}, lob),
        el('p', { style: 'margin-bottom:0' }, `💡 ${s.tipp}`)),
      el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => vorlesen(vorleseText) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: weiter }, letzte ? 'Fertig 🏁' : 'Weiter ➡️'))));
}

function weiter() {
  index++;
  if (index < szenarien.length) szenarioBildschirm();
  else endBildschirm();
}

function endBildschirm() {
  const schluss = 'Super gemacht! Du hast viele Gefühle entdeckt. Gib das Gerät einem Erwachsenen und erzähl, was du entdeckt hast!';
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '🎉'),
      el('p', { style: 'font-size:1.6em;text-align:center' }, gesammelt.join(' ')),
      el('p', { style: 'font-weight:700;text-align:center' }, 'Super gemacht! Du hast viele Gefühle entdeckt.'),
      el('p', { style: 'text-align:center' }, '👉 Gib das Gerät einem Erwachsenen.'),
      el('p', { style: 'text-align:center' }, 'Erzähl, was du entdeckt hast!'),
      el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => vorlesen(schluss) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starteRunde }, '🔁 Noch einmal'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: startBildschirm }, '🏠 Zum Start'))));
}

startBildschirm();
