// Lehrkräfte-Szenariotraining „Ernstfall Pausenhof-Chat“ (für Lehrkräfte,
// docs/09 Nr. 209). Szenario-Trainer (2/1/0): realistische Schulsituationen
// mit je drei Handlungsoptionen, Wertung und rechtlich orientierter Erklärung
// inkl. Verweis auf Meldewege. Cybergrooming nur als Verweis auf Fachstellen,
// keine Fallbearbeitung. Politik docs/02: keine externen Anfragen; nichts
// wird gespeichert.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
// Vor dem Ende gibt es nichts zu drucken; ohne diesen Satz käme eine weiße
// Seite aus dem Drucker.
const lstPlatzhalter = () => el('p', { class: 'lst-nur-druck' }, 'Die Verweise und Meldewege stehen nach dem letzten Szenario – dann lohnt sich der Druck.');
const daten = await fetch('daten/szenarien.json').then((r) => r.json());

let index = 0;
let punkte = 0;

function start() {
  index = 0; punkte = 0;
  app.replaceChildren(
    lstPlatzhalter(),
    el('h1', { class: 'k-titel' }, '🏫 Ernstfall Pausenhof-Chat'),
    el('p', { class: 'k-untertitel' }, 'Szenariotraining für Lehrkräfte: souverän reagieren im digitalen Schulalltag'),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0' }, `${daten.szenarien.length} realistische Situationen, je drei Handlungsoptionen. Wählen Sie – danach folgt eine Einordnung mit Verweis auf Meldewege.`),
      el('p', { style: 'font-size:0.9rem;color:#4b5563' }, 'Bewusst ohne Fallbearbeitung bei Cybergrooming – dort nur der Verweis auf Fachstellen. Keine Rechtsberatung, keine Datenspeicherung.'),
      el('button', { class: 'k-knopf', onclick: frage }, '▶️ Training starten')));
}

function frage() {
  const s = daten.szenarien[index];
  app.replaceChildren(
    lstPlatzhalter(),
    el('h1', { class: 'k-titel' }, '🏫 Ernstfall Pausenhof-Chat'),
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-untertitel', style: 'margin-top:0' }, `Situation ${index + 1} von ${daten.szenarien.length}`),
      el('p', { style: 'font-size:1.1rem;font-weight:600' }, s.situation),
      el('div', { class: 'k-antworten' },
        ...s.optionen.map((o) => el('button', { class: 'k-knopf', onclick: () => aufloesung(s, o) }, o.text)))));
}

function aufloesung(s, gewaehlt) {
  punkte += gewaehlt.wert;
  const symbol = gewaehlt.wert === 2 ? '✅' : gewaehlt.wert === 1 ? '🟡' : '🔴';
  const titel = gewaehlt.wert === 2 ? 'Souverän!' : gewaehlt.wert === 1 ? 'Geht besser' : 'Besser vermeiden';
  app.replaceChildren(
    lstPlatzhalter(),
    el('h1', { class: 'k-titel' }, '🏫 Ernstfall Pausenhof-Chat'),
    el('section', { class: 'k-karte' },
      el('p', { style: 'font-size:1.3rem;margin-top:0' }, `${symbol} ${titel}`),
      el('p', {}, s.erklaerung),
      el('button', { class: 'k-knopf', onclick: () => { index += 1; index < daten.szenarien.length ? frage() : ende(); } },
        index + 1 < daten.szenarien.length ? 'Nächste Situation ➡️' : 'Auswertung ansehen 🏁')));
}

function ende() {
  const max = daten.szenarien.length * 2;
  const anteil = punkte / max;
  const einschaetzung = anteil >= 0.8
    ? 'Sehr souverän – Sie kennen die richtigen Wege. Nutzen Sie das Training als Auffrischung im Kollegium.'
    : anteil >= 0.5
      ? 'Solide Grundhaltung – ein paar Situationen lohnt es, im Team zu besprechen.'
      : 'Gute Gelegenheit, die eigenen Reaktionen und die Meldewege der Schule zu schärfen.';

  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🏫 Auswertung'),
    el('section', { class: 'k-karte' },
      el('p', { style: 'font-size:1.2rem;font-weight:700;margin-top:0' }, `${punkte} von ${max} Punkten`),
      el('p', {}, einschaetzung)),
    // `lst-blatt` ist das, was der Knopf verspricht: die Verweise, nicht die
    // Punktzahl. Alles andere blendet druck.css aus (docs/02).
    el('section', { class: 'k-karte lst-blatt' },
      el('h2', { style: 'margin-top:0;font-size:1.15rem' }, '📇 Wichtige Verweise & Meldewege'),
      el('ul', {}, ...daten.verweise.map((v) => el('li', { style: 'margin:0.35rem 0' }, v)))),
    el('section', { class: 'k-karte' },
      el('button', { class: 'k-knopf', onclick: () => window.print() }, '🖨️ Verweise drucken'),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', style: 'margin-left:0.4rem', onclick: start }, '🔁 Nochmal')),
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werkzeug für Fachkräfte · läuft offline · nichts wird gespeichert · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
}

start();
