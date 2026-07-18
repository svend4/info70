// Sharenting-Spiegel (für Eltern, docs/09 Nr. 219). Szenario-Selbsttest:
// typische Sharenting-Situationen mit drei Reaktionen (2/1/0), Erklärung mit
// Kinder-Perspektive, am Ende Auswertung plus druckbare Familien-Foto-Regeln.
// Politik docs/02: keine externen Anfragen; nichts wird gespeichert.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const daten = await fetch('daten/szenarien.json').then((r) => r.json());

let index = 0;
let punkte = 0;

function start() {
  index = 0; punkte = 0;
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🪞 Sharenting-Spiegel'),
    el('p', { class: 'k-untertitel' }, 'Ein ehrlicher Selbsttest für Eltern: Wie teile ich Fotos meines Kindes?'),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0' }, `„Sharenting“ ist das Teilen von Kinder-Fotos durch Eltern. In ${daten.szenarien.length} Alltagssituationen wählen Sie eine Reaktion – danach sehen Sie die Wirkung aus Kindersicht. Am Ende gibt es druckbare Familien-Foto-Regeln.`),
      el('p', { style: 'font-size:0.9rem;color:#4b5563' }, 'Kein erhobener Zeigefinger, keine Datenspeicherung – nur zum Nachdenken.'),
      el('button', { class: 'k-knopf', onclick: frage }, '▶️ Selbsttest starten')));
}

function frage() {
  const s = daten.szenarien[index];
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🪞 Sharenting-Spiegel'),
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-untertitel', style: 'margin-top:0' }, `Situation ${index + 1} von ${daten.szenarien.length}`),
      el('p', { style: 'font-size:1.1rem;font-weight:600' }, s.situation),
      el('div', { class: 'k-antworten' },
        ...s.optionen.map((o) => el('button', { class: 'k-knopf', onclick: () => aufloesung(s, o) }, o.text)))));
}

function aufloesung(s, gewaehlt) {
  punkte += gewaehlt.wert;
  const symbol = gewaehlt.wert === 2 ? '✅' : gewaehlt.wert === 1 ? '🟡' : '🔴';
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🪞 Sharenting-Spiegel'),
    el('section', { class: 'k-karte' },
      el('p', { style: 'font-size:1.4rem;margin-top:0' }, `${symbol} ${gewaehlt.wert === 2 ? 'Gut abgewogen!' : gewaehlt.wert === 1 ? 'Geht besser' : 'Lieber nicht'}`),
      el('p', {}, s.erklaerung),
      el('p', { style: 'font-style:italic;color:var(--k-blau-dunkel)' }, `🧒 Aus Kindersicht: ${s.kinderperspektive}`),
      el('button', { class: 'k-knopf', onclick: () => { index += 1; index < daten.szenarien.length ? frage() : ende(); } },
        index + 1 < daten.szenarien.length ? 'Nächste Situation ➡️' : 'Auswertung ansehen 🏁')));
}

function ende() {
  const max = daten.szenarien.length * 2;
  const anteil = punkte / max;
  const einschaetzung = anteil >= 0.8
    ? 'Sie gehen sehr bewusst mit den Fotos Ihres Kindes um. Weiter so!'
    : anteil >= 0.5
      ? 'Eine gute Grundhaltung – an ein paar Stellen lohnt sich noch mehr Zurückhaltung.'
      : 'Ein guter Anlass, die eigenen Gewohnheiten zu überdenken. Die Regeln unten helfen dabei.';

  const regelBlock = el('section', { class: 'k-karte' },
    el('h2', { style: 'margin-top:0;font-size:1.15rem' }, '📋 Unsere Familien-Foto-Regeln'),
    el('ul', {}, ...daten.fotoregeln.map((r) => el('li', { style: 'margin:0.35rem 0' }, r))));

  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🪞 Auswertung'),
    el('section', { class: 'k-karte' },
      el('p', { style: 'font-size:1.2rem;font-weight:700;margin-top:0' }, `${punkte} von ${max} Punkten`),
      el('p', {}, einschaetzung)),
    regelBlock,
    el('section', { class: 'k-karte' },
      el('button', { class: 'k-knopf', onclick: () => window.print() }, '🖨️ Foto-Regeln drucken'),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', style: 'margin-left:0.4rem', onclick: start }, '🔁 Nochmal')),
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werkzeug für Erwachsene · läuft offline · nichts wird gespeichert · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
}

start();
