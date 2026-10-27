// Freunde in der Gruppe: Sozial-Trainer zu Konfliktlösung und Peer-Kompetenz
// (5-7 Ko-Nutzung, Weiterführung 8-12). 3 Optionen je Szene (2/1/0), Vorlesen.
// Praleska docs/10 (Top-30 Nr. 10). Alle Szenen sind Eigenproduktion.
// Politik docs/02: keine externen Anfragen, die App speichert nichts. Das Kind wird nicht bewertet:
// zu jeder Antwort gibt es eine Rückmeldung mit Erklärung, am Ende „Ende der Runde“.
import { el, vorlesen, mischen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { boot as bootAnzeige } from '../../packages/kinder-ui/js/anzeige.mjs';
import { hilfeInsel, hilfeInselKnopf } from '../../packages/kinder-ui/js/hilfe-insel.mjs';
import { rueckmeldungFuer } from './logik.mjs';

installiereNetzwerkWaechter();
bootAnzeige();

try { localStorage.removeItem('freunde.rekord'); } catch {}
const RUNDE = 12;
const app = document.getElementById('app');
const daten = await fetch('daten/szenarien.json').then((r) => r.json());

let szenarien = [];
let index = 0;

function zeige(...knoten) {
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🤝 Freunde in der Gruppe'),
    el('p', { class: 'k-untertitel' }, 'Zusammen spielen, teilen und Streit fair lösen'),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · ohne Anmeldung · diese App speichert nichts · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
  app.querySelector('button')?.focus();
}

function start() {
  const intro = `In ${RUNDE} Situationen aus der Kindergruppe entscheidest du, was ein guter Freund oder eine gute Freundin macht. Am besten redet ihr zusammen darüber.`;
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '🧒🧒🧒'),
      el('p', {}, intro),
      el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => vorlesen(intro) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starteRunde }, '▶️ Los geht’s'))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin:0' }, '👉 Es gibt keine Blamage – über Situationen zu reden ist schon das Wichtigste.')),
    el('section', { class: 'k-karte' },
      hilfeInselKnopf(() => zeige(hilfeInsel({ zurueck: start })))));
}

function starteRunde() {
  szenarien = mischen(daten.szenarien).slice(0, Math.min(RUNDE, daten.szenarien.length));
  index = 0;
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
  const { gut, emoji, titel } = rueckmeldungFuer(option);
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
  const satz = 'Ende der Runde. Sprecht über die Situationen, die schwer waren.';
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '🤝'),
      el('p', { style: 'font-weight:700;font-size:1.2em;text-align:center' }, 'Ende der Runde'),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(satz) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starteRunde }, '🔁 Noch einmal'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: start }, '🏠 Zum Start'))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin:0' }, '👉 Sprecht über die Situationen, die schwer waren – zu Hause oder in der Gruppe.')));
}

start();
