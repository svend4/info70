// Spiral-Stopper: erlebbare Eskalations-/Deeskalationsdynamik (8-12 Jahre).
// Ein Kommentar-Thread wird Runde fuer Runde gemeiner oder ruhiger - je
// nachdem, wie das Kind reagiert. Die sichtbare Temperatur-Kurve macht die
// Wirkung von Gegenrede und Melden erfahrbar statt belehrend.
// Politik docs/02: keine externen Anfragen; diese App speichert NICHTS.
import { el, vorlesen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { hilfeInsel, hilfeInselKnopf } from '../../packages/kinder-ui/js/hilfe-insel.mjs';
import { REAKTIONEN, stufe, reagiere, bewertung } from './eskalation.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const daten = await fetch('daten/kommentare.json').then((r) => r.json());

let runde = 0;
let temperatur = 30;
let verlauf = [];
let letzteLehre = null;

function zeige(...knoten) {
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🧯 Spiral-Stopper'),
    el('p', { class: 'k-untertitel' }, 'Ein Thread heizt sich auf. Du entscheidest, wohin er kippt.'),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · ohne Anmeldung · diese App speichert nichts · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
  app.querySelector('button')?.focus();
}

function thermometer() {
  const s = stufe(temperatur);
  const farbe = s.name === 'ruhig' ? 'var(--k-gruen)' : s.name === 'gereizt' ? '#f59e0b' : 'var(--k-rot)';
  return el('div', {},
    el('p', { style: 'font-weight:600;margin-bottom:0.25rem' }, `${s.emoji} Thread-Temperatur: ${temperatur} von 100 (${s.name})`),
    el('div', { class: 'k-fortschritt', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': temperatur },
      el('div', { style: `width:${temperatur}%;background:${farbe}` })));
}

function startBildschirm() {
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0' }, daten.szene),
      el('p', {}, 'In 6 Runden erscheinen Kommentare. Deine Reaktion verändert die Temperatur des Threads – und damit, wie gemein die nächsten Kommentare ausfallen. Schaffst du es, die Spirale zu stoppen?'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starteRunde }, '▶️ Thread öffnen'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`${daten.szene} Deine Reaktion verändert die Temperatur des Threads. Schaffst du es, die Spirale zu stoppen?`) }, '🔊 Vorlesen'))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin:0' }, '💡 Diese App speichert nichts – jedes Experiment startet frisch.')),
    el('section', { class: 'k-karte' },
      hilfeInselKnopf(() => zeige(hilfeInsel({ zurueck: startBildschirm })))));
}

function starteRunde() {
  runde = 0;
  temperatur = 30;
  verlauf = [];
  letzteLehre = null;
  rundenBildschirm();
}

function rundenBildschirm() {
  if (runde >= daten.runden.length) return endBildschirm();
  const eintrag = daten.runden[runde];
  const kommentar = eintrag[stufe(temperatur).name];
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-untertitel', style: 'margin-top:0' }, `Runde ${runde + 1} von ${daten.runden.length}`),
      thermometer(),
      el('div', { class: 'k-hinweis', style: 'margin-top:0.75rem' },
        el('p', { style: 'margin:0;font-weight:600' }, `💬 ${kommentar}`)),
      letzteLehre ? el('p', { style: 'font-size:0.9rem;color:#374151' }, `📎 ${letzteLehre}`) : '',
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`${kommentar}. Wie reagierst du?`) }, '🔊 Vorlesen'),
      el('p', { style: 'font-weight:600' }, 'Wie reagierst du?'),
      el('div', { class: 'k-antworten' },
        ...REAKTIONEN.map((r) =>
          el('button', {
            class: 'k-knopf k-knopf--neutral',
            onclick: () => {
              temperatur = reagiere(temperatur, r.code);
              verlauf.push(temperatur);
              letzteLehre = r.lehre;
              runde++;
              rundenBildschirm();
            },
          }, r.text)))));
}

function endBildschirm() {
  const ergebnis = bewertung(verlauf);
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, ergebnis.emoji),
      el('p', { class: 'k-untertitel', style: 'font-weight:700' }, ergebnis.titel),
      el('p', { style: 'text-align:center' }, ergebnis.satz),
      thermometer(),
      el('p', { style: 'font-weight:600;margin-bottom:0.25rem' }, 'Dein Temperatur-Verlauf:'),
      el('div', { style: 'display:flex;gap:0.3rem;align-items:flex-end;height:4rem' },
        ...verlauf.map((tw, i) => {
          const farbe = tw >= 70 ? 'var(--k-rot)' : tw >= 35 ? '#f59e0b' : 'var(--k-gruen)';
          return el('div', {
            style: `flex:1;height:${Math.max(8, tw)}%;background:${farbe};border-radius:0.25rem 0.25rem 0 0`,
            'aria-label': `Runde ${i + 1}: ${tw} von 100`,
          });
        }))),
    el('section', { class: 'k-karte' },
      ...daten.lektionen.map((l) => el('p', {}, l)),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(daten.lektionen.join(' ')) }, '🔊 Vorlesen'),
        el('button', { class: 'k-knopf', onclick: starteRunde }, '🔁 Noch ein Thread'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: startBildschirm }, '🏠 Zum Start'))));
}

startBildschirm();
