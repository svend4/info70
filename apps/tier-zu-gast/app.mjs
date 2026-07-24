// Ein Tier zu Gast – Verantwortungs-Trainer (5-7 und 8-12): Szenario-Trainer
// 2/1/0 rund um Meerschweinchen, Hamster, Kaninchen und Wellensittich –
// leise sein, richtig füttern, Ruhe lassen, Verantwortung übernehmen.
// Praleska docs/10 (Kinder-Apps Nr. 4). Alle Szenen Eigenproduktion,
// Botschaften nach deutschem Tierschutz-Alltagswissen. Politik docs/02:
// keine externen Anfragen, nur Rekord in localStorage (löschbar).
import { el, vorlesen, mischen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { boot as bootAnzeige } from '../../packages/kinder-ui/js/anzeige.mjs';
import { maxPunkte, rangFuer, ergebnisSatz, pruefeSzenarien } from './logik.mjs';

installiereNetzwerkWaechter();
bootAnzeige();

const REKORD = 'tier.rekord';
const RUNDE = 10;
const app = document.getElementById('app');
const daten = await fetch('daten/szenarien.json').then((r) => r.json());

let szenarien = [];
let index = 0;
let punkte = 0;

function zeige(...knoten) {
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🐹 Ein Tier zu Gast'),
    el('p', { class: 'k-untertitel' }, 'Verantwortung lernen – so geht es deinem Tier gut'),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · ohne Anmeldung · Daten bleiben auf diesem Gerät · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
  app.querySelector('button')?.focus();
}

function start() {
  const rekord = Number(localStorage.getItem(REKORD) ?? 0);
  const intro = `Ein Tier ist kein Spielzeug – es ist ein Gast, der sich auf dich verlässt. In ${RUNDE} Situationen entscheidest du, was für das Tier am besten ist.`;
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '🐇'),
      el('p', {}, intro),
      rekord > 0 ? el('p', {}, `Dein Rekord: ${rekord} von ${maxPunkte(RUNDE)} 🏅`) : '',
      el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => vorlesen(intro) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starteRunde }, '▶️ Los geht’s'),
        rekord > 0 ? el('button', { class: 'k-knopf k-knopf--klein k-knopf--neutral', onclick: () => { localStorage.removeItem(REKORD); start(); } }, '🗑️ Rekord löschen') : '')),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin:0' }, '👉 Wichtigste Regel: Meerschweinchen, Kaninchen und Wellensittiche nie allein halten – sie brauchen Artgenossen.')));
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
  const titel = gut ? 'Genau richtig!' : option.wert === 1 ? 'Fast!' : 'Denk ans Tier.';
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
      el('p', { style: 'text-align:center' }, `${punkte} von ${maxPunkte(szenarien.length)} Tierfreund-Punkten`),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(satz) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starteRunde }, '🔁 Noch einmal'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: start }, '🏠 Zum Start'))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin:0' }, '👉 Sprich mit einem Erwachsenen darüber, welches Tier zu eurer Familie passen würde – und was es jeden Tag braucht.')));
}

const fehler = pruefeSzenarien(daten, RUNDE);
if (fehler.length) {
  app.replaceChildren(el('div', { class: 'k-hinweis k-hinweis--falsch' }, el('p', { style: 'margin:0' }, `Datenfehler: ${fehler[0]}`)));
} else {
  start();
}
