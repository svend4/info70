// Deutschland-Kompass (5-7 in Ko-Nutzung, 8-12 eigenständig):
// Plan-Simulator mit den vier Himmelsrichtungen, Karten-Quiz zu
// Deutschland und Welt sowie Länderkarten zum Nachschlagen.
// Praleska docs/10 (Kinder-Apps Nr. 18). Politik docs/02: keine externen
// Anfragen, werbefrei, es wird nichts gespeichert.
import { el, vorlesen, mischen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { boot as bootAnzeige } from '../../packages/kinder-ui/js/anzeige.mjs';
import {
  RICHTUNGEN, MERKSATZ, ortAn, baueAufgabe, aufgabenText, pruefeDaten,
} from './logik.mjs';

installiereNetzwerkWaechter();
bootAnzeige();

const app = document.getElementById('app');
const daten = await fetch('daten/karte.json').then((r) => r.json());
const zufall = (liste) => liste[Math.floor(Math.random() * liste.length)];

let modus = 'plan';
let aufgabe = null;
let planAntwort = null;
let geschafft = 0;
let quizFrage = null;
let quizAntwort = null;
let quizPunkte = 0;

function zeige(...knoten) {
  app.replaceChildren(...[
    el('h1', { class: 'k-titel' }, '🧭 Deutschland-Kompass'),
    el('p', { class: 'k-untertitel' }, 'Vom Plan vor der Haustür bis zur Weltkarte'),
    el('div', { class: 'k-antworten', role: 'group', 'aria-label': 'Modus' },
      ...[['plan', '🗺️ Plan & Kompass'], ['quiz', '❓ Karten-Quiz'], ['laender', '📍 Länder']].map(([id, name]) =>
        el('button', {
          class: `k-knopf k-knopf--klein ${modus === id ? '' : 'k-knopf--neutral'}`,
          'aria-pressed': String(modus === id),
          // Laufende Aufgaben verwerfen, sonst bliebe eine schon gelöste
          // Frage nach dem Moduswechsel erneut anklickbar.
          onclick: () => { modus = id; aufgabe = null; planAntwort = null; quizFrage = null; quizAntwort = null; render(); },
        }, name))),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · ohne Anmeldung · offline · nichts wird gespeichert · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')),
  ].filter(Boolean));
}

// ---------- Modus 1: Plan & Kompass ----------
function windrose() {
  const feld = (r) => el('div', {
    style: 'text-align:center;font-weight:700;padding:0.25rem',
    'aria-label': r ? `${r.name} (${r.kurz})` : undefined,
  }, r ? `${r.emoji} ${r.kurz}` : '🧭');
  const [n, o, s, w] = RICHTUNGEN;
  return el('div', { role: 'img', 'aria-label': `Windrose: oben Norden, rechts Osten, unten Süden, links Westen. ${MERKSATZ}` },
    el('div', { style: 'display:grid;grid-template-columns:repeat(3,1fr);max-width:11rem;margin:0 auto' },
      el('div', {}), feld(n), el('div', {}),
      feld(w), feld(null), feld(o),
      el('div', {}), feld(s), el('div', {})),
    el('p', { style: 'text-align:center;margin:0.3rem 0 0;font-size:0.95em' }, MERKSATZ));
}

function planRaster() {
  const zeilen = [];
  for (let z = 0; z < daten.groesse; z++) {
    const felder = [];
    for (let s = 0; s < daten.groesse; s++) {
      const ort = ortAn(daten.orte, { zeile: z, spalte: s });
      const istStart = aufgabe && ort && ort.id === aufgabe.start.id;
      // Das Startfeld ist nicht nur farbig hinterlegt, sondern trägt einen
      // dicken Rahmen und das Wort „du“ – Farbe allein wäre für Kinder mit
      // Farbsehschwäche kein Unterschied.
      felder.push(el('div', {
        style: 'aspect-ratio:1;display:flex;flex-direction:column;align-items:center;justify-content:center;'
          + `border:${istStart ? '4px double var(--k-tinte)' : '2px solid var(--k-rand)'};border-radius:0.5rem;`
          + `font-size:1.5rem;background:${istStart ? 'var(--k-gelb)' : 'var(--k-karte)'}`,
        'aria-label': ort
          ? `Zeile ${z + 1}, Spalte ${s + 1}: ${ort.name}${istStart ? ' – hier stehst du' : ''}`
          : `Zeile ${z + 1}, Spalte ${s + 1}: leeres Feld`,
      }, ort ? ort.emoji : '·',
      istStart ? el('span', { 'aria-hidden': 'true', style: 'font-size:0.6rem;font-weight:700;line-height:1' }, 'du') : null));
    }
    zeilen.push(...felder);
  }
  return el('div', {
    role: 'group',
    'aria-label': 'Ortsplan, Norden ist oben',
    style: `display:grid;grid-template-columns:repeat(${daten.groesse},1fr);gap:0.3rem;max-width:22rem;margin:0.5rem auto`,
  }, ...zeilen);
}

function neuePlanAufgabe() {
  aufgabe = baueAufgabe(daten, zufall, mischen, aufgabe);
  planAntwort = null;
  render();
}

function antwortePlan(ort) {
  const richtig = ort.id === aufgabe.ziel.id;
  if (richtig) geschafft += 1;
  planAntwort = { ort, richtig };
  render();
}

function planKarten() {
  if (!aufgabe) {
    return [
      el('section', { class: 'k-karte' },
        el('p', { style: 'margin-top:0' }, 'Ein Plan ist die Welt von oben gesehen. Wie auf jeder Landkarte gilt: Norden ist oben, Süden unten, Osten rechts, Westen links.'),
        windrose(),
        planRaster(),
        el('div', { class: 'k-antworten' },
          el('button', { class: 'k-knopf', onclick: neuePlanAufgabe }, '🗺️ Erste Aufgabe'))),
    ];
  }
  const text = aufgabenText(aufgabe);
  return [
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, `${aufgabe.start.emoji} ${aufgabe.richtung.emoji}`),
      el('p', { style: 'font-weight:700;font-size:1.15em;text-align:center;margin:0.2rem 0' }, text),
      planRaster(),
      el('button', {
        class: 'k-knopf k-knopf--neutral k-knopf--klein',
        onclick: () => vorlesen(`${text} ${aufgabe.optionen.map((o) => o.name).join('. Oder: ')}`),
      }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten', role: 'group', 'aria-label': 'Ziel wählen' },
        ...(planAntwort
          ? [el('button', { class: 'k-knopf', onclick: neuePlanAufgabe }, 'Nächste Aufgabe ➡️')]
          : aufgabe.optionen.map((o) => el('button', {
            class: 'k-knopf k-knopf--neutral',
            onclick: () => antwortePlan(o),
          }, `${o.emoji} ${o.name}`)))),
      planAntwort
        ? el('div', { class: `k-hinweis${planAntwort.richtig ? ' k-hinweis--richtig' : ''}` },
          el('p', { style: 'margin:0' }, planAntwort.richtig
            ? `🌟 Genau: ${aufgabe.schritte === 1 ? 'ein Feld' : `${aufgabe.schritte} Felder`} nach ${aufgabe.richtung.name}, und du stehst ${aufgabe.ziel.wo}.`
            : `💭 Nicht ganz: Nach ${aufgabe.richtung.name} geht es ${aufgabe.richtung.emoji}. Von dort aus landest du ${aufgabe.ziel.wo} – bei ${aufgabe.ziel.name}.`))
        : null,
      el('p', { style: 'text-align:center;margin:0.5rem 0 0' }, `Gefundene Wege: ${geschafft}`)),
    el('section', { class: 'k-karte' }, windrose()),
  ];
}

// ---------- Modus 2: Karten-Quiz ----------
function neueQuizFrage() {
  const uebrig = quizFrage ? daten.quiz.filter((q) => q.id !== quizFrage.frage.id) : daten.quiz;
  const q = zufall(uebrig);
  quizFrage = { frage: q, optionen: mischen(q.antworten.map((text, i) => ({ text, richtig: i === q.korrekt }))) };
  quizAntwort = null;
  render();
}

function antworteQuiz(option) {
  if (option.richtig) quizPunkte += 1;
  quizAntwort = option;
  render();
}

const BEREICH_NAME = { deutschland: '🇩🇪 Deutschland', welt: '🌍 Die Welt', himmelsrichtungen: '🧭 Himmelsrichtungen' };

function quizKarten() {
  if (!quizFrage) {
    return [
      el('section', { class: 'k-karte' },
        el('p', { style: 'margin-top:0' }, `${daten.quiz.length} Fragen zu drei Bereichen: den Himmelsrichtungen, der Deutschlandkarte und der Weltkarte. Nach jeder Antwort steht da, warum es so ist.`),
        el('div', { class: 'k-antworten' },
          el('button', { class: 'k-knopf', onclick: neueQuizFrage }, '❓ Erste Frage'))),
    ];
  }
  const q = quizFrage.frage;
  return [
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-untertitel', style: 'margin-top:0' }, BEREICH_NAME[q.bereich]),
      el('p', { style: 'font-weight:700;font-size:1.15em;text-align:center' }, q.frage),
      el('button', {
        class: 'k-knopf k-knopf--neutral k-knopf--klein',
        onclick: () => vorlesen(`${q.frage} ${quizFrage.optionen.map((o) => o.text).join('. Oder: ')}`),
      }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten', role: 'group', 'aria-label': 'Antwort wählen' },
        ...(quizAntwort
          ? [el('button', { class: 'k-knopf', onclick: neueQuizFrage }, 'Nächste Frage ➡️')]
          : quizFrage.optionen.map((o) => el('button', {
            class: 'k-knopf k-knopf--neutral',
            onclick: () => antworteQuiz(o),
          }, o.text)))),
      quizAntwort
        ? el('div', { class: `k-hinweis${quizAntwort.richtig ? ' k-hinweis--richtig' : ''}` },
          el('p', { style: 'font-weight:700;margin-top:0' }, quizAntwort.richtig ? '🌟 Richtig!' : '💭 Schau nochmal:'),
          el('p', { style: 'margin:0' }, q.erklaerung))
        : null,
      quizAntwort
        ? el('button', {
          class: 'k-knopf k-knopf--neutral k-knopf--klein',
          style: 'margin-top:0.5rem',
          onclick: () => vorlesen(q.erklaerung),
        }, '🔊 Erklärung vorlesen')
        : null,
      el('p', { style: 'text-align:center;margin:0.5rem 0 0' }, `Richtig beantwortet: ${quizPunkte}`)),
  ];
}

// ---------- Modus 3: Länder ----------
function laenderKarten() {
  return [
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0' }, 'Zum Nachschlagen und Zeigen: Wo liegt was, und was fließt wohin? Sucht die Länder danach zusammen auf einer richtigen Karte oder einem Globus.')),
    ...daten.laender.map((l) => el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0' }, `${l.emoji} ${l.name}`),
      el('p', { style: 'margin-top:0' }, l.einleitung),
      el('ul', { style: 'margin:0;padding-left:1.2rem' }, ...l.fakten.map((f) => el('li', {}, f))),
      el('button', {
        class: 'k-knopf k-knopf--neutral k-knopf--klein',
        style: 'margin-top:0.6rem',
        onclick: () => vorlesen(`${l.name}. ${l.einleitung} ${l.fakten.join(' ')}`),
      }, '🔊 Vorlesen'))),
  ];
}

function render() {
  const karten = modus === 'plan' ? planKarten() : modus === 'quiz' ? quizKarten() : laenderKarten();
  zeige(...karten.filter(Boolean));
}

const fehler = pruefeDaten(daten);
if (fehler.length) {
  app.replaceChildren(el('div', { class: 'k-hinweis k-hinweis--falsch' }, el('p', { style: 'margin:0' }, `Datenfehler: ${fehler[0]}`)));
} else {
  render();
}
