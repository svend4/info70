// Smarte Ohren: Sprachassistent, Smart-Toy, Tablet (6-8 Jahre).
// Leichte-Sprache-Szenarien zu Datensparsamkeit gegenueber sprechenden
// Geraeten. Wie gefuehle-entdecker: KEINE Punkte, kein Ranking, keine Scham -
// jedes Kind kommt bis zum Ende, das Feedback ist immer ermutigend.
// Automatisches Vorlesen jeder Szene (fuer Kinder, die noch nicht lesen).
// Nichts wird gespeichert. Politik docs/02: keine externen Anfragen.
import { el, vorlesen, mischen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { hilfeInsel, hilfeInselKnopf } from '../../packages/kinder-ui/js/hilfe-insel.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const daten = await fetch('daten/szenarien.json').then((r) => r.json());
let szenarien = [];
let index = 0;

function zeige(...knoten) {
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '👂 Smarte Ohren'),
    el('p', { class: 'k-untertitel' }, 'Geräte, die zuhören. Was sagst du – was nicht?'),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · ohne Anmeldung · nichts wird gespeichert · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
  app.querySelector('button')?.focus();
}

function startBildschirm() {
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { style: 'font-size:1.1rem' }, 'Manche Geräte können zuhören. Zum Beispiel Lautsprecher, Tablets oder sprechende Kuscheltiere. Was ist okay? Was sagst du lieber nicht? Wir üben das zusammen.'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starte }, '▶️ Los geht’s'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen('Manche Geräte können zuhören. Zum Beispiel Lautsprecher, Tablets oder sprechende Kuscheltiere. Was ist okay? Was sagst du lieber nicht? Wir üben das zusammen.') }, '🔊 Vorlesen'))),
    el('section', { class: 'k-karte' },
      hilfeInselKnopf(() => zeige(hilfeInsel({ zurueck: startBildschirm })))));
}

function starte() {
  szenarien = mischen(daten.szenarien);
  index = 0;
  szeneBildschirm();
}

function szeneBildschirm() {
  const s = szenarien[index];
  const optionen = mischen(s.optionen);
  zeige(
    el('section', { class: 'k-karte', style: 'text-align:center' },
      el('p', { class: 'k-untertitel' }, `Bild ${index + 1} von ${szenarien.length}`),
      el('p', { style: 'font-size:3rem;margin:0.25rem 0', 'aria-hidden': 'true' }, s.emoji),
      el('p', { style: 'font-size:1.2rem;font-weight:600' }, s.situation),
      el('p', { style: 'font-size:1.1rem' }, s.frage),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`${s.situation} ${s.frage}`) }, '🔊 Nochmal vorlesen')),
    el('section', { class: 'k-karte' },
      el('div', { class: 'k-antworten' },
        ...optionen.map((o) =>
          el('button', { class: 'k-knopf', style: 'font-size:1.05rem;min-height:56px', onclick: () => antworte(s, o) }, o.text)))));
  // Automatisch vorlesen - fuer Kinder, die noch nicht sicher lesen.
  vorlesen(`${s.situation} ${s.frage}`);
}

function antworte(s, option) {
  const lob = option.gut ? s.lobGut : s.lobWeiter;
  const klasse = option.gut ? 'k-hinweis--richtig' : '';
  zeige(
    el('section', { class: 'k-karte', style: 'text-align:center' },
      el('p', { style: 'font-size:2.5rem;margin:0', 'aria-hidden': 'true' }, option.gut ? '🌟' : '💛'),
      el('div', { class: `k-hinweis ${klasse}` },
        el('p', { style: 'font-size:1.1rem;font-weight:600;margin:0' }, lob),
        s.tipp ? el('p', { style: 'margin:0.5rem 0 0' }, `💡 ${s.tipp}`) : ''),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`${lob} ${s.tipp ?? ''}`) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: weiter }, index + 1 < szenarien.length ? 'Weiter ➡️' : 'Fertig 🎉'))));
  vorlesen(`${lob} ${s.tipp ?? ''}`);
}

function weiter() {
  index++;
  if (index < szenarien.length) szeneBildschirm();
  else endeBildschirm();
}

function endeBildschirm() {
  zeige(
    el('section', { class: 'k-karte', style: 'text-align:center' },
      el('p', { style: 'font-size:3rem;margin:0', 'aria-hidden': 'true' }, '🎉'),
      el('p', { style: 'font-size:1.15rem;font-weight:600' }, daten.ende),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(daten.ende) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starte }, '🔁 Nochmal'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: startBildschirm }, '🏠 Start'))));
  vorlesen(daten.ende);
}

startBildschirm();
