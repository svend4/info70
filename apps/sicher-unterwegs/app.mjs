// Sicher unterwegs: Szenario-Trainer zu Alltags- und Verkehrssicherheit
// (5-7 Ko-Nutzung, Weiterführung 8-12). 3 Optionen je Szene (2/1/0), Vorlesen.
// Praleska docs/10 (Top-30 Nr. 7). Alle Szenen sind Eigenproduktion.
// Politik docs/02: keine externen Anfragen, nur Rekord in localStorage.
import { el, vorlesen, mischen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { boot as bootAnzeige } from '../../packages/kinder-ui/js/anzeige.mjs';
import { maxPunkte, rangFuer, ergebnisSatz } from './logik.mjs';

installiereNetzwerkWaechter();
bootAnzeige();

const REKORD = 'sicher.rekord';
const RUNDE = 12;
const app = document.getElementById('app');
const daten = await fetch('daten/szenarien.json').then((r) => r.json());

let szenarien = [];
let index = 0;
let punkte = 0;

function zeige(...knoten) {
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🚦 Sicher unterwegs'),
    el('p', { class: 'k-untertitel' }, 'Klug entscheiden – auf der Straße und zu Hause'),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · ohne Anmeldung · Daten bleiben auf diesem Gerät · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
  app.querySelector('button')?.focus();
}

function start() {
  const rekord = Number(localStorage.getItem(REKORD) ?? 0);
  const intro = `In ${RUNDE} Situationen entscheidest du, was am sichersten ist. Am besten spielst du mit einem Erwachsenen und redet darüber.`;
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '🚸'),
      el('p', {}, intro),
      rekord > 0 ? el('p', {}, `Dein Rekord: ${rekord} von ${RUNDE * 2} 🏅`) : '',
      el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => vorlesen(intro) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starteRunde }, '▶️ Los geht’s'))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin:0' }, '👉 Im Notfall gilt: 112 für Feuerwehr und Rettung, 110 für die Polizei.')));
}

function starteRunde() {
  szenarien = mischen(daten.szenarien).slice(0, Math.min(RUNDE, daten.szenarien.length));
  index = 0;
  punkte = 0;
  frage();
}

function frage() {
  const s = szenarien[index];
  const optionen = mischen(s.optionen);
  const vorleseText = `${s.situation} ${s.frage} ${optionen.map((o) => o.text).join('. Oder: ')}`;
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-untertitel' }, `Situation ${index + 1} von ${szenarien.length}`),
      el('p', { class: 'k-gross' }, s.emoji),
      el('p', { style: 'font-weight:700;font-size:1.2em;text-align:center' }, s.situation),
      el('p', { style: 'text-align:center' }, s.frage),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(vorleseText) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        ...optionen.map((o) => el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => antworte(s, o) }, o.text)))));
}

function antworte(s, option) {
  punkte += option.wert;
  const gut = option.wert === 2;
  const emoji = gut ? '🌟' : option.wert === 1 ? '👍' : '💭';
  const titel = gut ? 'Genau richtig!' : option.wert === 1 ? 'Fast!' : 'Denk nochmal mit.';
  const letzte = index + 1 >= szenarien.length;
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, emoji),
      el('div', { class: `k-hinweis${gut ? ' k-hinweis--richtig' : ''}` },
        el('p', { style: 'font-weight:700;margin-top:0' }, titel),
        el('p', { style: 'margin-bottom:0' }, s.erklaerung)),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`${titel} ${s.erklaerung}`) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: weiter }, letzte ? 'Fertig 🏁' : 'Weiter ➡️'))));
}

function weiter() {
  index++;
  if (index < szenarien.length) frage();
  else ende();
}

function ende() {
  const rekordAlt = Number(localStorage.getItem(REKORD) ?? 0);
  if (punkte > rekordAlt) localStorage.setItem(REKORD, String(punkte));
  const rang = rangFuer(daten.raenge, punkte);
  const satz = ergebnisSatz(daten.raenge, punkte, szenarien.length);
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, rang.emoji),
      el('p', { style: 'font-weight:700;font-size:1.2em;text-align:center' }, rang.titel),
      el('p', { style: 'text-align:center' }, `${punkte} von ${maxPunkte(szenarien.length)} Sicherheits-Punkten`),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(satz) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starteRunde }, '🔁 Noch einmal'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: start }, '🏠 Zum Start'))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin:0' }, '👉 Sprich mit einem Erwachsenen über die Situationen, die schwer waren.')));
}

start();
