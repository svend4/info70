// Chat-Rechte: Chat-Situationen als Rechtsfragen (8-12).
// Content-Pack-Idee aus docs/09 Nr. 35: rahmt Chat-Situationen als
// Beteiligungsrechte - Meinung sagen ist Art. 13, beleidigen nicht; Melden ist
// mein Recht (DSA Art. 20), kein Petzen. Doppel-Natur: Freiheit + Verantwortung.
// 2/1/0-Muster wie rechte-kompass/stark-im-chat. Nutzt Hilfe-Insel (kinder-ui).
// Politik: keine externen Anfragen, nur Rekord in localStorage.
import { el, vorlesen, mischen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { hilfeInsel } from '../../packages/kinder-ui/js/hilfe-insel.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';

installiereNetzwerkWaechter();

const REKORD_SCHLUESSEL = 'cr.rekord';
const app = document.getElementById('app');
const daten = await fetch('daten/szenarien.json').then((r) => r.json());

let szenarien = [];
let index = 0;
let punkte = 0;
let merksaetze = [];

const maxPunkte = () => szenarien.length * 2;

function zeige(...knoten) {
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '⚖️ Chat-Rechte'),
    el('p', { class: 'k-untertitel' }, 'Im Chat gilt: Freiheit UND Verantwortung.'),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · ohne Anmeldung · Daten bleiben auf diesem Gerät · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
  app.querySelector('button')?.focus();
}

function startBildschirm() {
  const rekord = Number(localStorage.getItem(REKORD_SCHLUESSEL) ?? 0);
  zeige(
    el('section', { class: 'k-karte' },
      el('p', {}, `Darf ich das sagen? Ist Melden Petzen? Muss meine Idee gewinnen? In ${daten.szenarien.length} Chat-Situationen entscheidest du – und lernst das Recht dahinter. Denn Beteiligungsrechte haben zwei Seiten: Freiheit und Verantwortung.`),
      rekord > 0 ? el('p', {}, `Dein Rekord: ${rekord} von ${daten.szenarien.length * 2} ⚖️`) : '',
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starteRunde }, '▶️ Los geht’s'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen('Beteiligungsrechte haben zwei Seiten: Freiheit und Verantwortung. In acht Chat-Situationen entscheidest du und lernst das Recht dahinter.') }, '🔊 Vorlesen'))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0' }, 'Mehr zu deinen Rechten? Spiel den ', el('a', { href: '../rechte-kompass/' }, '🧭 Rechte-Kompass'), ' oder ', el('a', { href: '../stark-im-chat/' }, '💪 Stark im Chat'), '.'),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => zeige(hilfeInsel({ zurueck: startBildschirm })) }, '🆘 Ich brauche Hilfe')));
}

function starteRunde() {
  szenarien = mischen(daten.szenarien);
  index = 0;
  punkte = 0;
  merksaetze = [];
  szenarioBildschirm();
}

function szenarioBildschirm() {
  const s = szenarien[index];
  const optionen = mischen(s.optionen);
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-untertitel' }, `Situation ${index + 1} von ${szenarien.length}`),
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
  punkte += option.wert;
  if (option.wert === 2) merksaetze.push(s.merksatz);
  const titel = option.wert === 2 ? 'Genau! ⚖️✨' : option.wert === 1 ? 'Okay – aber da geht mehr.' : 'Nicht ganz …';
  const klasse = option.wert === 2 ? 'k-hinweis--richtig' : option.wert === 1 ? '' : 'k-hinweis--falsch';
  zeige(
    el('section', { class: 'k-karte' },
      el('div', { class: `k-hinweis ${klasse}` },
        el('p', { style: 'font-weight:700;margin-top:0' }, titel),
        el('p', { style: 'margin:0' }, s.erklaerung)),
      el('div', { class: 'k-hinweis', style: 'margin-top:0.5rem' },
        el('p', { style: 'margin:0 0 0.25rem;font-size:0.85rem' }, `📜 Dein Recht: ${s.recht}`),
        el('p', { style: 'margin:0;font-weight:700' }, `💡 Merksatz: „${s.merksatz}“`)),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`${titel} ${s.erklaerung} Merksatz: ${s.merksatz}`) }, '🔊 Vorlesen'),
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
      el('p', { style: 'text-align:center' }, `${punkte} von ${maxPunkte()} Rechte-Punkten · Rekord: ${rekord}`),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starteRunde }, '🔁 Noch einmal'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: startBildschirm }, '🏠 Zum Start'))),
    merksaetze.length ? el('section', { class: 'k-karte' },
      el('p', { style: 'font-weight:700;margin-top:0' }, `💡 Deine Merksätze (${merksaetze.length}):`),
      ...merksaetze.map((m) => el('p', { style: 'margin:0.3rem 0' }, `„${m}“`))) : '');
}

startBildschirm();
