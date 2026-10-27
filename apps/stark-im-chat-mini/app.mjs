// Stark im Chat Mini (6-8, docs/09 Ось A / Nr. 163). Leichte-Sprache-Variante
// von stark-im-chat: große Piktogramme, automatisches Vorlesen, nur ZWEI
// Antworten. Erste Regeln gegen Gemeinheiten im Chat: Stopp sagen, nett sein,
// Erwachsene holen. Das Kind wird nicht bewertet: keine Punkte, kein Rekord, keine
// Ränge; jede Antwort bekommt eine Rückmeldung mit Erklärung.
// Politik docs/02: keine externen Anfragen, speichert NICHTS.
import { el, vorlesen, mischen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { boot as bootAnzeige } from '../../packages/kinder-ui/js/anzeige.mjs';
import { hilfeInsel, hilfeInselKnopf } from '../../packages/kinder-ui/js/hilfe-insel.mjs';

installiereNetzwerkWaechter();
bootAnzeige();

// Alter Schlüssel aus früheren Versionen: einmal beim Start entfernen.
try { localStorage.removeItem('scm.rekord'); } catch {}

const app = document.getElementById('app');
const daten = await fetch('daten/szenarien.json').then((r) => r.json());

let runde = [];
let index = 0;

function zeige(...knoten) {
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '💪 Stark im Chat Mini'),
    el('p', { class: 'k-untertitel' }, 'Nett sein im Chat. Und Hilfe holen.'),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Ohne Werbung · ohne Anmeldung · diese App speichert nichts · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
  app.querySelector('button')?.focus();
}

function start() {
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '💬💛'),
      el('p', {}, 'Im Chat kann jemand gemein sein. Du kannst helfen. Was machst du? Wähle eine Antwort. Alles wird vorgelesen.'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starteRunde }, '▶️ Los geht’s!'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen('Im Chat kann jemand gemein sein. Du kannst helfen. Was machst du? Alles wird vorgelesen.') }, '🔊 Vorlesen'))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin:0' }, '🧹 Hier gibt es keine Werbung. Du musst dich nicht anmelden.')),
    el('section', { class: 'k-karte' },
      hilfeInselKnopf(() => zeige(hilfeInsel({ zurueck: start })))));
}

function starteRunde() {
  runde = mischen(daten.szenarien);
  index = 0;
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
  vorlesen('Ende der Runde. Du kannst noch einmal spielen.');
  zeige(
    el('section', { class: 'k-karte', style: 'text-align:center' },
      el('p', { class: 'k-gross' }, '💬💛'),
      el('p', { style: 'font-weight:700' }, 'Ende der Runde'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starteRunde }, '🔁 Noch einmal'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: start }, '🏠 Zum Start'))));
}

start();
