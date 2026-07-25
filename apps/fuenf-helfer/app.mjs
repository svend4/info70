// Meine fünf Helfer (3-5, NUR gemeinsam mit einem Erwachsenen):
// Augen, Nase, Ohren, Zunge, Haut – was jeder Helfer kann, wie man ihn
// schützt, und dass manche Menschen dafür Hilfsmittel benutzen.
// Praleska docs/10 (Ko-Nutzung Nr. 4).
//
// Ko-Nutzungs-Design: Erwachsenen-Gate, höchstens PRO_SESSION Aufgaben,
// danach zwingend Schluss. Keine Punkte, kein Rekord, kein Ranking.
// Es wird NICHTS gespeichert. Politik docs/02: keine externen Anfragen.
import { el, vorlesen, mischen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { PRO_SESSION, waehleAufgaben, baueAufgabe, istRichtig, pruefeDaten } from './logik.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const daten = await fetch('daten/helfer.json').then((r) => r.json());

let aufgaben = [];
let index = 0;
let frage = null;
let offenerHelfer = null;

function zeige(...knoten) {
  app.replaceChildren(...[
    el('h1', { class: 'k-titel' }, '🖐️ Meine fünf Helfer'),
    el('p', { class: 'k-untertitel' }, 'Für Kind und Erwachsene – zusammen.'),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · ohne Anmeldung · keine Namen · nichts wird gespeichert · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')),
  ].filter(Boolean));
  app.querySelector('button')?.focus();
}

function gate() {
  const intro = 'Diese App spielt ihr zusammen: ein Kind und ein Erwachsener. Fünf Helfer hat jeder Mensch dabei: Augen, Nase, Ohren, Zunge und Haut. Es gibt keine Punkte.';
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '🧑‍🍼🧒'),
      el('p', { style: 'font-weight:700;text-align:center;font-size:1.2em' }, 'Bitte gemeinsam spielen.'),
      el('p', {}, 'Diese App ist für ein Kind UND einen Erwachsenen zusammen.'),
      el('p', {}, 'Fünf Helfer hat jeder Mensch immer dabei: Augen, Nase, Ohren, Zunge und Haut.'),
      el('p', {}, 'Es gibt keine Punkte. Nach jeder Frage redet ihr miteinander.'),
      el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => vorlesen(intro) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starteRunde }, '👪 Ein Erwachsener ist dabei – los!'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: helferBildschirm }, '🔍 Erst die Helfer anschauen'))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin:0' }, `👉 Höchstens ${PRO_SESSION} Fragen – danach probiert ihr die Helfer selbst aus.`)));
}

// Entdeck-Ansicht: die fünf Helfer zum Anschauen, ohne Aufgabe.
function helferBildschirm() {
  const h = offenerHelfer ? daten.helfer.find((x) => x.id === offenerHelfer) : null;
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0' }, 'Tippt einen Helfer an.'),
      el('div', { class: 'k-antworten', role: 'group', 'aria-label': 'Helfer wählen' },
        ...daten.helfer.map((x) => el('button', {
          class: `k-knopf ${offenerHelfer === x.id ? '' : 'k-knopf--neutral'}`,
          style: 'min-height:5rem',
          'aria-pressed': String(offenerHelfer === x.id),
          'aria-label': x.name,
          onclick: () => { offenerHelfer = offenerHelfer === x.id ? null : x.id; helferBildschirm(); },
        },
        el('span', { style: 'font-size:2.2em;display:block;line-height:1.1' }, x.emoji),
        el('span', {}, x.name))))),
    h
      ? el('section', { class: 'k-karte' },
        el('p', { class: 'k-gross' }, h.emoji),
        el('h2', { style: 'text-align:center;margin:0.2rem 0' }, h.name),
        el('p', {}, h.kann),
        el('div', { class: 'k-hinweis' },
          el('p', { style: 'font-weight:700;margin-top:0' }, '🧼 So bleibt der Helfer gesund:'),
          el('p', { style: 'margin-bottom:0' }, h.pflege)),
        el('div', { class: 'k-hinweis', style: 'margin-top:0.6rem' },
          el('p', { style: 'font-weight:700;margin-top:0' }, '👪 Probiert es zusammen aus:'),
          el('p', { style: 'margin-bottom:0' }, h.spiel)),
        el('button', {
          class: 'k-knopf k-knopf--neutral',
          onclick: () => vorlesen(`${h.name}. ${h.kann} ${h.pflege} ${h.spiel}`),
        }, '🔊 Vorlesen'))
      : null,
    el('section', { class: 'k-karte' },
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starteRunde }, '▶️ Fragen spielen'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: hilfenBildschirm }, '👓 Hilfen kennenlernen'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: gate }, '🏠 Zum Start'))));
}

// Inklusionsteil: Hilfsmittel als selbstverständlich, mit der Regel
// „fragen statt starren“.
function hilfenBildschirm() {
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0' }, 'Nicht bei allen Menschen arbeiten alle fünf Helfer gleich. Dafür gibt es Hilfen – die gehören einfach dazu.'),
      ...daten.hilfen.map((h) => el('div', { style: 'margin:0.7rem 0;padding-top:0.5rem;border-top:1px solid var(--k-rand)' },
        el('p', { style: 'font-weight:700;margin:0' }, `${h.emoji} ${h.name}`),
        el('p', { style: 'margin:0.2rem 0 0' }, h.text)))),
    el('section', { class: 'k-karte' },
      el('div', { class: 'k-hinweis' },
        el('p', { style: 'font-weight:700;margin-top:0' }, '👀 Die wichtigste Regel:'),
        el('p', { style: 'margin-bottom:0' }, daten.hilfenRegel)),
      el('button', {
        class: 'k-knopf k-knopf--neutral',
        onclick: () => vorlesen(`${daten.hilfen.map((h) => `${h.name}. ${h.text}`).join(' ')} ${daten.hilfenRegel}`),
      }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: helferBildschirm }, '⬅️ Zurück zu den Helfern'))));
}

function starteRunde() {
  aufgaben = waehleAufgaben(daten.aufgaben);
  index = 0;
  frageBildschirm();
}

function frageBildschirm() {
  frage = baueAufgabe(daten, aufgaben[index], mischen);
  const a = frage.aufgabe;
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-untertitel' }, `Frage ${index + 1} von ${aufgaben.length}`),
      el('div', {
        class: 'k-fortschritt', role: 'progressbar',
        'aria-valuemin': '0', 'aria-valuemax': String(aufgaben.length), 'aria-valuenow': String(index),
      }, el('div', { style: `width:${(index / aufgaben.length) * 100}%` })),
      el('p', { style: 'font-weight:700;font-size:1.35em;text-align:center' }, a.frage),
      el('button', {
        class: 'k-knopf k-knopf--neutral',
        onclick: () => vorlesen(`${a.frage} ${frage.optionen.map((o) => o.name).join('. Oder: ')}?`),
      }, '🔊 Frage vorlesen'),
      el('div', { class: 'k-antworten', role: 'group', 'aria-label': 'Helfer wählen' },
        ...frage.optionen.map((o) => el('button', {
          class: 'k-knopf k-knopf--neutral',
          style: 'min-height:5.5rem',
          'aria-label': o.name,
          onclick: () => waehle(o),
        },
        el('span', { style: 'font-size:2.4em;display:block;line-height:1.1' }, o.emoji),
        el('span', {}, o.name))))));
}

function waehle(gewaehlt) {
  const richtig = istRichtig(frage, gewaehlt.id);
  const a = frage.aufgabe;
  const kopf = richtig ? '🌟 Ja, genau!' : '🔎 Schau mal:';
  const satz = richtig ? a.erklaerung : `${frage.loesung.emoji} ${frage.loesung.name}. ${a.erklaerung}`;
  const letzte = index + 1 >= aufgaben.length;
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, richtig ? '🌟' : '🔎'),
      el('div', { class: `k-hinweis${richtig ? ' k-hinweis--richtig' : ''}` },
        el('p', { style: 'font-weight:700;margin-top:0' }, kopf),
        el('p', { style: 'margin-bottom:0' }, satz)),
      el('div', { class: 'k-hinweis', style: 'margin-top:0.6rem' },
        el('p', { style: 'font-weight:700;margin-top:0' }, '👪 Für Erwachsene – redet zusammen:'),
        el('p', { style: 'margin-bottom:0' }, a.gespraech)),
      el('button', {
        class: 'k-knopf k-knopf--neutral',
        onclick: () => vorlesen(`${kopf} ${satz} Für Erwachsene: ${a.gespraech}`),
      }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: weiter }, letzte ? 'Fertig 🏁' : 'Weiter ➡️'))));
}

function weiter() {
  index++;
  if (index < aufgaben.length) frageBildschirm();
  else schluss();
}

function schluss() {
  const ideen = daten.schlussIdeen;
  const text = `Bildschirm aus – jetzt probiert ihr die Helfer selbst aus! ${ideen.join(' ')}`;
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '🖐️'),
      el('p', { style: 'font-weight:700;font-size:1.3em;text-align:center;margin-bottom:0' }, 'Bildschirm aus –'),
      el('p', { style: 'font-weight:700;font-size:1.3em;text-align:center;margin-top:0' }, 'jetzt probiert ihr sie selbst aus!'),
      el('p', { style: 'text-align:center' }, 'Drei Ideen für euch beide:'),
      el('ul', {}, ...ideen.map((i) => el('li', { style: 'margin-bottom:0.5rem' }, i))),
      el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => vorlesen(text) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starteRunde }, '🔁 Noch einmal'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: gate }, '🏠 Zum Start'))));
}

const fehler = pruefeDaten(daten);
if (fehler.length) {
  app.replaceChildren(el('div', { class: 'k-hinweis k-hinweis--falsch' }, el('p', { style: 'margin:0' }, `Datenfehler: ${fehler[0]}`)));
} else {
  gate();
}
