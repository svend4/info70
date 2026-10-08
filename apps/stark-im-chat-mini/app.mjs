// Stark im Chat Mini (6-8, docs/09 Ось A / Nr. 163). Leichte-Sprache-Variante
// von stark-im-chat: große Piktogramme, automatisches Vorlesen, nur ZWEI
// Antworten. Erste Regeln gegen Gemeinheiten im Chat: Stopp sagen, nett sein,
// Erwachsene holen. Politik docs/02: keine externen Anfragen, nur Bestwert lokal.
import { el, vorlesen, mischen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { boot as bootAnzeige } from '../../packages/kinder-ui/js/anzeige.mjs';
import { loescheDaten } from '../../packages/kinder-ui/js/daten-karte.mjs';
import { hilfeInsel, hilfeInselKnopf } from '../../packages/kinder-ui/js/hilfe-insel.mjs';

installiereNetzwerkWaechter();
bootAnzeige();

const REKORD = 'scm.rekord';
const app = document.getElementById('app');
const daten = await fetch('daten/szenarien.json').then((r) => r.json());

let runde = [];
let index = 0;
let punkte = 0;
const maxPunkte = () => runde.length * 2;

function zeige(...knoten) {
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '💪 Stark im Chat Mini'),
    el('p', { class: 'k-untertitel' }, 'Nett sein im Chat. Und Hilfe holen.'),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Ohne Werbung · ohne Anmeldung · alles bleibt auf diesem Gerät · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
  app.querySelector('button')?.focus();
}

function start() {
  const rekord = Number(localStorage.getItem(REKORD) ?? 0);
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '💬💛'),
      el('p', {}, 'Im Chat kann jemand gemein sein. Du kannst helfen. Was machst du? Wähle eine Antwort. Alles wird vorgelesen.'),
      rekord > 0 ? el('p', {}, `Dein Bestwert: ${rekord} von ${daten.szenarien.length * 2} ⭐`) : '',
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starteRunde }, '▶️ Los geht’s!'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen('Im Chat kann jemand gemein sein. Du kannst helfen. Was machst du? Alles wird vorgelesen.') }, '🔊 Vorlesen'))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin:0' }, '🧹 Hier gibt es keine Werbung. Du musst dich nicht anmelden.'),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => { loescheDaten(REKORD); start(); } }, 'Meine Daten löschen')),
    el('section', { class: 'k-karte' },
      hilfeInselKnopf(() => zeige(hilfeInsel({ zurueck: start })))));
}

function starteRunde() {
  runde = mischen(daten.szenarien);
  index = 0;
  punkte = 0;
  frage();
}

function frage() {
  const s = runde[index];
  const opt = mischen(s.optionen);
  vorlesen(`${s.situation} Was machst du?`);
  zeige(
    el('section', { class: 'k-karte', style: 'text-align:center' },
      el('p', { class: 'k-untertitel' }, `${index + 1} von ${runde.length}`),
      el('p', { style: 'font-size:4rem;margin:0.3rem 0' }, s.piktogramm),
      el('p', { style: 'font-weight:700;font-size:1.2rem' }, s.situation),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`${s.situation} Was machst du?`) }, '🔊 Nochmal vorlesen')),
    el('section', { class: 'k-karte' },
      el('div', { class: 'k-antworten' },
        ...opt.map((o) => el('button', { class: 'k-knopf', onclick: () => antworte(s, o) }, o.text)))));
}

function antworte(s, o) {
  punkte += o.wert;
  const gut = o.wert === 2;
  const titel = gut ? 'Stark! 💪' : 'Schau mal:';
  vorlesen(`${titel} ${s.erklaerung}`);
  zeige(
    el('section', { class: 'k-karte', style: 'text-align:center' },
      el('p', { style: 'font-size:3rem;margin:0.2rem 0' }, s.piktogramm),
      el('div', { class: `k-hinweis ${gut ? 'k-hinweis--richtig' : 'k-hinweis--falsch'}` },
        el('p', { style: 'font-weight:700;margin-top:0' }, titel),
        el('p', { style: 'margin-bottom:0' }, s.erklaerung)),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(s.erklaerung) }, '🔊 Nochmal vorlesen'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: weiter }, index + 1 < runde.length ? 'Weiter ➡️' : 'Fertig 🏁'))));
}

function weiter() {
  index++;
  if (index < runde.length) frage();
  else ende();
}

function ende() {
  const rekord = Math.max(punkte, Number(localStorage.getItem(REKORD) ?? 0));
  localStorage.setItem(REKORD, String(rekord));
  const alle = punkte === maxPunkte();
  vorlesen(`Super gemacht! Du hast ${punkte} von ${maxPunkte()} Stark-Punkten.`);
  zeige(
    el('section', { class: 'k-karte', style: 'text-align:center' },
      el('p', { class: 'k-gross' }, alle ? '🏆' : '🌟'),
      el('p', { style: 'font-weight:700' }, `Super gemacht! Du hast ${punkte} von ${maxPunkte()} Stark-Punkten.`),
      el('p', {}, `Bestwert: ${rekord}`),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starteRunde }, '🔁 Noch einmal'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: start }, '🏠 Zum Start'))));
}

start();
