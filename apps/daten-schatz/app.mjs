// Daten-Schatz: Szenario-Trainer zum Datenschutz (8-12 Jahre).
// Das Kind hütet seinen "Datenschatz" und entscheidet in Alltagssituationen:
// erlauben, ablehnen oder erst Erwachsene fragen. Punkte: beste Antwort 2,
// akzeptable 1. Politik: keine externen Anfragen, nur Rekord in localStorage.
import { el, vorlesen, mischen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';

installiereNetzwerkWaechter();

const REKORD_SCHLUESSEL = 'ds.rekord';
const app = document.getElementById('app');
const daten = await fetch('daten/szenarien.json').then((r) => r.json());

const ANTWORTEN = [
  { code: 'geben', text: '✅ Okay, erlauben' },
  { code: 'ablehnen', text: '🚫 Nein danke!' },
  { code: 'fragen', text: '🧑‍🦱 Erst Erwachsene fragen' },
];

let szenarien = [];
let index = 0;
let punkte = 0;

const maxPunkte = () => szenarien.length * 2;

function zeige(...knoten) {
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🗝️ Daten-Schatz'),
    el('p', { class: 'k-untertitel' }, 'Deine Daten sind ein Schatz. Bewache sie!'),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · ohne Anmeldung · Daten bleiben auf diesem Gerät · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
  app.querySelector('button')?.focus();
}

function startBildschirm() {
  const rekord = Number(localStorage.getItem(REKORD_SCHLUESSEL) ?? 0);
  zeige(
    el('section', { class: 'k-karte' },
      el('p', {}, `Apps und Websites fragen ständig nach deinen Daten. In ${daten.szenarien.length} Situationen entscheidest du: erlauben, ablehnen – oder erst Erwachsene fragen?`),
      rekord > 0 ? el('p', {}, `Dein Rekord: ${rekord} von ${daten.szenarien.length * 2} 💎`) : '',
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starteRunde }, '▶️ Wache übernehmen'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen('Apps und Websites fragen ständig nach deinen Daten. Du entscheidest: erlauben, ablehnen, oder erst Erwachsene fragen?') }, '🔊 Vorlesen'))),
    el('section', { class: 'k-karte' },
      el('p', {}, '🧹 Hier gibt es keine Werbung und keine Anmeldung. Gespeichert wird nur dein Rekord – auf diesem Gerät.'),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => { localStorage.clear(); startBildschirm(); } }, 'Meine Daten löschen')));
}

function starteRunde() {
  szenarien = mischen(daten.szenarien);
  index = 0;
  punkte = 0;
  szenarioBildschirm();
}

function szenarioBildschirm() {
  const s = szenarien[index];
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-untertitel' }, `Situation ${index + 1} von ${szenarien.length}`),
      el('div', { class: 'k-fortschritt', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': szenarien.length, 'aria-valuenow': index },
        el('div', { style: `width:${(index / szenarien.length) * 100}%` })),
      el('p', { style: 'font-weight:600' }, s.situation),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`${s.situation} Was machst du? ${ANTWORTEN.map((a) => a.text.slice(2)).join('. Oder: ')}`) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        ...ANTWORTEN.map((a) =>
          el('button', { class: 'k-knopf', onclick: () => antworte(s, a.code) }, a.text)))));
}

function antworte(s, code) {
  const wert = code === s.beste ? 2 : s.auchOk.includes(code) ? 1 : 0;
  punkte += wert;
  const titel = wert === 2 ? 'Starke Entscheidung! 💎💎' : wert === 1 ? 'Auch okay! 💎' : 'Vorsicht, Falle!';
  const klasse = wert === 2 ? 'k-hinweis--richtig' : wert === 1 ? '' : 'k-hinweis--falsch';
  const besteAntwort = ANTWORTEN.find((a) => a.code === s.beste).text;
  zeige(
    el('section', { class: 'k-karte' },
      el('div', { class: `k-hinweis ${klasse}` },
        el('p', { style: 'font-weight:700;margin-top:0' }, titel),
        el('p', {}, s.erklaerung),
        el('p', { style: 'margin-bottom:0' }, `Beste Antwort: ${besteAntwort}`)),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`${titel} ${s.erklaerung}`) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: weiter }, index + 1 < szenarien.length ? 'Nächste Situation ➡️' : 'Zum Ergebnis 🏁'))));
}

function weiter() {
  index++;
  if (index < szenarien.length) szenarioBildschirm();
  else endBildschirm();
}

function endBildschirm() {
  const rekord = Math.max(punkte, Number(localStorage.getItem(REKORD_SCHLUESSEL) ?? 0));
  localStorage.setItem(REKORD_SCHLUESSEL, String(rekord));
  const rang = [...daten.raenge].reverse().find((r) => punkte >= r.ab) ?? daten.raenge[0];
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, rang.emoji),
      el('p', { class: 'k-untertitel', style: 'font-weight:700' }, rang.titel),
      el('p', { style: 'text-align:center' }, `${punkte} von ${maxPunkte()} Schatz-Punkten · Rekord: ${rekord}`),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`Du hast ${punkte} von ${maxPunkte()} Schatz-Punkten. Dein Rang: ${rang.titel}`) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starteRunde }, '🔁 Noch einmal'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: startBildschirm }, '🏠 Zum Start'))));
}

startBildschirm();
