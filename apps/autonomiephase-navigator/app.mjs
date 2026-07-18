// Autonomiephase-Navigator (für Eltern, docs/10 Praleska Top-30 Nr. 11).
// Szenario-Selbsttraining zur „Trotzphase“: pro Situation 3 Elternreaktionen
// (2/1/0) nach der Balance aus Anforderung UND Zuwendung, mit Erklärung.
// Werkzeug für Erwachsene (kein Kinder-Screen). Politik docs/02: keine
// externen Anfragen, nur Fortschritt/Rekord lokal.
import { el, vorlesen, mischen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { boot as bootAnzeige } from '../../packages/kinder-ui/js/anzeige.mjs';
import { maxPunkte, rangFuer, ergebnisSatz } from './logik.mjs';

installiereNetzwerkWaechter();
bootAnzeige();

const REKORD = 'autonomie.rekord';
const RUNDE = 10;
const app = document.getElementById('app');
const daten = await fetch('daten/szenarien.json').then((r) => r.json());

let szenarien = [];
let index = 0;
let punkte = 0;

function zeige(...knoten) {
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🧭 Autonomiephase-Navigator'),
    el('p', { class: 'k-untertitel' }, 'Die „Trotzphase“ klar und zugewandt begleiten (für Eltern)'),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werkzeug für Erwachsene · kein Rezept, keine Bewertung des Kindes · Daten bleiben auf diesem Gerät · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
  app.querySelector('button')?.focus();
}

function start() {
  const rekord = Number(localStorage.getItem(REKORD) ?? 0);
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0' }, `Ein kurzes Selbsttraining für die Autonomiephase (ca. 1,5–4 Jahre). In ${RUNDE} Alltagssituationen überlegen Sie, welche Reaktion die Balance aus klarer Anforderung UND liebevoller Zuwendung am besten trifft.`),
      el('p', { style: 'font-size:0.9rem;color:#4b5563' }, daten.hinweis),
      rekord > 0 ? el('p', {}, `Ihr bisher bester Durchgang: ${rekord} von ${RUNDE * 2}`) : '',
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starteRunde }, '▶️ Los geht’s'))));
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
      el('p', { style: 'font-weight:700;font-size:1.15em' }, s.situation),
      el('p', {}, s.frage),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(vorleseText) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        ...optionen.map((o) => el('button', { class: 'k-knopf k-knopf--neutral', style: 'text-align:start', onclick: () => antworte(s, o) }, o.text)))));
}

function antworte(s, option) {
  punkte += option.wert;
  const gut = option.wert === 2;
  const emoji = gut ? '🌟' : option.wert === 1 ? '👍' : '💭';
  const titel = gut ? 'Klar und zugewandt.' : option.wert === 1 ? 'Geht in die Richtung.' : 'Da lohnt ein zweiter Blick.';
  const letzte = index + 1 >= szenarien.length;
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, emoji),
      el('div', { class: `k-hinweis${gut ? ' k-hinweis--richtig' : ''}` },
        el('p', { style: 'font-weight:700;margin-top:0' }, titel),
        el('p', { style: 'margin-bottom:0' }, s.erklaerung)),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`${titel} ${s.erklaerung}`) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: weiter }, letzte ? 'Auswertung 🏁' : 'Weiter ➡️'))));
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
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, rang.emoji),
      el('p', { style: 'font-weight:700;font-size:1.2em' }, rang.titel),
      el('p', {}, `${punkte} von ${maxPunkte(szenarien.length)} Punkten in Richtung „klar und zugewandt“.`),
      el('p', { style: 'font-size:0.9rem;color:#4b5563' }, 'Das ist eine Selbstreflexion – kein Urteil über Sie oder Ihr Kind. Jede Familie ist anders.'),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(ergebnisSatz(daten.raenge, punkte, szenarien.length)) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starteRunde }, '🔁 Noch einmal'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: start }, '🏠 Zum Start'))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin:0' }, 'Bei anhaltender Belastung: Familienberatung vor Ort oder „Nummer gegen Kummer“ für Eltern, 0800 111 0 550 (kostenlos, anonym).')));
}

start();
