// Szenario-Trainer „Elterngespräch“ für Erzieher*innen (Praleska docs/10,
// Kita-Abschnitt, Nr. 73). Eigenentwurf – siehe logik.mjs.
// Keine Gesamtpunktzahl, keine Rangliste, nichts wird gespeichert. Keine
// externen Anfragen (docs/02). Das Druckblatt enthält nur Grundhaltungen und
// Verweise – nie eine Auswertung.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { pruefeDaten, reihenfolge } from './logik.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const daten = await fetch('daten/szenarien.json').then((r) => r.json());

const STUFE = {
  2: { zeichen: '✅', name: 'dialogisch' },
  1: { zeichen: '🟡', name: 'verständlich, aber einseitig' },
  0: { zeichen: '🔴', name: 'Falle' },
};

let index = 0;
let gewaehlt = null;

const hinweisKarte = (titel, ...absaetze) => el('div', { class: 'k-hinweis', style: 'margin-top:0.6rem' },
  el('p', { style: 'font-weight:700;margin-top:0' }, titel),
  ...absaetze.map((t) => el('p', { style: 'margin:0 0 0.3rem' }, t)));

/** Das Blatt zum Mitnehmen: Grundhaltungen und Verweise. Nie eine Auswertung. */
function blatt() {
  return el('section', { class: 'et-blatt' },
    el('h2', {}, '🗣️ Gespräch mit Eltern – Grundhaltungen'),
    el('p', { class: 'et-hinweis' }, daten.hinweis),
    ...daten.grundhaltungen.map((g) => el('div', { class: 'et-punkt' },
      el('p', { class: 'et-titel' }, g.titel),
      el('p', {}, g.text),
      el('p', { class: 'et-quelle' }, `Quelle: ${g.quelle}`))),
    el('h3', {}, 'Verweise'),
    el('ul', {}, ...daten.verweise.map((v) => el('li', {}, v))));
}

function start() {
  gewaehlt = null;
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🗣️ Elterngespräch üben'),
    el('p', { class: 'k-untertitel' }, 'Fünf Gespräche, je drei Antworten – mit Quelle zu jeder Einstufung'),
    el('section', { class: 'k-karte' },
      el('div', { class: 'k-hinweis' }, el('p', { style: 'margin:0;font-weight:600' }, daten.hinweis)),
      el('p', { style: 'margin:0.6rem 0 0' }, daten.wasEsIst),
      hinweisKarte('⚖️ Keine Gesamtwertung', daten.keinePunktesumme),
      el('button', { class: 'k-knopf', id: 'et-start', onclick: () => { index = 0; frage(); } }, '▶️ Üben beginnen')),
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '📖 Grundhaltungen'),
      ...daten.grundhaltungen.map((g) => el('p', { style: 'margin:0.3rem 0' }, el('strong', {}, `${g.titel}: `), g.text, ' ', el('span', { style: 'color:#4b5563;font-size:0.9rem' }, `(${g.quelle})`))),
      el('div', { class: 'k-antworten' }, el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', id: 'et-blatt', onclick: () => window.print() }, '🖨️ Blatt drucken'))),
    blatt(),
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werkzeug für Fachkräfte · läuft offline · nichts wird gespeichert · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
}

function frage() {
  const s = daten.szenarien[index];
  const folge = reihenfolge(index);
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🗣️ Elterngespräch üben'),
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-untertitel', style: 'margin-top:0' }, `Gespräch ${index + 1} von ${daten.szenarien.length}: ${s.titel}`),
      el('p', { style: 'font-size:1.05rem;font-weight:600' }, s.situation),
      el('p', { style: 'margin:0.4rem 0 0;font-size:0.9rem;color:#4b5563' }, 'Welche Antwort würden Sie geben?'),
      el('div', { class: 'k-antworten' },
        ...folge.map((i) => el('button', {
          class: 'k-knopf',
          style: 'text-align:start;min-height:3.2rem',
          id: `et-antwort-${s.id}-${i}`,
          onclick: () => { gewaehlt = s.optionen[i]; aufloesung(); },
        }, s.optionen[i].text)))),
    el('footer', { class: 'k-fuss' }, el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
}

function aufloesung() {
  const s = daten.szenarien[index];
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🗣️ Einordnung'),
    el('section', { class: 'k-karte' },
      el('p', { style: 'font-size:1.1rem;margin-top:0' }, `${STUFE[gewaehlt.wert].zeichen} Ihre Antwort: ${STUFE[gewaehlt.wert].name}`),
      el('p', {}, gewaehlt.text),
      el('h2', { style: 'font-size:1.05rem' }, 'Alle drei Antworten im Vergleich'),
      el('ul', {}, ...s.optionen.map((o) => el('li', { style: 'margin:0.3rem 0' },
        el('strong', {}, `${STUFE[o.wert].zeichen} ${STUFE[o.wert].name}: `), o.text))),
      hinweisKarte('📖 Warum so eingestuft', s.erklaerung),
      el('p', { style: 'font-size:0.9rem;color:#4b5563' }, `Quelle: ${s.quelle}`),
      el('button', { class: 'k-knopf', id: 'et-weiter', onclick: () => { index += 1; index < daten.szenarien.length ? frage() : ende(); } },
        index + 1 < daten.szenarien.length ? 'Nächstes Gespräch ➡️' : 'Zum Abschluss 🏁')));
}

function ende() {
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🏁 Geschafft'),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0' }, 'Sie haben alle fünf Gespräche durchgearbeitet. Es gibt bewusst keine Punktzahl: die Einordnung gilt für jede einzelne Antwort, nicht für Sie.'),
      el('p', { style: 'font-size:0.9rem;color:#4b5563' }, 'Die Gespräche sind Übungsfälle, keine Vorlagen für einen Wortlaut. Im Team lohnt es sich, eine Situation gemeinsam durchzusprechen.'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', id: 'et-blatt-ende', onclick: () => window.print() }, '🖨️ Blatt drucken'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', id: 'et-nochmal', onclick: start }, '🔁 Nochmal'))),
    blatt());
}

const fehler = pruefeDaten(daten);
if (fehler.length) {
  app.replaceChildren(el('div', { class: 'k-hinweis k-hinweis--falsch' },
    el('p', { style: 'margin:0' }, `Datenfehler: ${fehler[0]}`)));
} else {
  start();
}
