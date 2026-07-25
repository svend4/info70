// Wörter-Sortierer (4-6, NUR gemeinsam mit einem Erwachsenen):
// Oberbegriffe, Gegensätze und Wörter mit zwei Bedeutungen.
// Praleska docs/10 (Ko-Nutzung Nr. 12).
//
// Ko-Nutzungs-Design: Erwachsenen-Gate, höchstens PRO_SESSION Aufgaben,
// danach zwingend Schluss. Keine Punkte, kein Rekord, nichts gespeichert.
// Politik docs/02: keine externen Anfragen.
import { el, vorlesen, mischen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { PRO_SESSION, waehleAufgaben, richtigeOption, istRichtig, pruefeDaten } from './logik.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const daten = await fetch('daten/woerter.json').then((r) => r.json());

let aufgaben = [];
let index = 0;

function zeige(...knoten) {
  app.replaceChildren(...[
    el('h1', { class: 'k-titel' }, '🗂️ Wörter-Sortierer'),
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
  const intro = 'Diese App spielt ihr zusammen: ein Kind und ein Erwachsener. Ihr sortiert Wörter, sucht Gegenteile und findet Wörter, die zwei Sachen bedeuten. Es gibt keine Punkte.';
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '🧑‍🍼🧒'),
      el('p', { style: 'font-weight:700;text-align:center;font-size:1.2em' }, 'Bitte gemeinsam spielen.'),
      el('p', {}, 'Diese App ist für ein Kind UND einen Erwachsenen zusammen.'),
      el('p', {}, 'Ihr sortiert Wörter, sucht Gegenteile – und findet Wörter, die gleich klingen und zwei Dinge bedeuten.'),
      el('p', {}, 'Es gibt keine Punkte. Nach jeder Frage redet ihr miteinander.'),
      el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => vorlesen(intro) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starteRunde }, '👪 Ein Erwachsener ist dabei – los!'))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin:0' }, `👉 Höchstens ${PRO_SESSION} Wörter – danach sortiert ihr weiter, ohne Bildschirm.`)));
}

function starteRunde() {
  aufgaben = waehleAufgaben(daten.aufgaben);
  index = 0;
  frageBildschirm();
}

function kopfZeile(a) {
  return [
    el('p', { class: 'k-untertitel' }, `Wort ${index + 1} von ${aufgaben.length}`),
    el('div', {
      class: 'k-fortschritt', role: 'progressbar',
      'aria-valuemin': '0', 'aria-valuemax': String(aufgaben.length), 'aria-valuenow': String(index),
    }, el('div', { style: `width:${(index / aufgaben.length) * 100}%` })),
    a.typ === 'mehrdeutig'
      ? el('p', { class: 'k-gross' }, `${a.emoji} ${a.zweitEmoji}`)
      : el('p', { class: 'k-gross' }, a.emoji),
    el('p', { style: 'font-weight:700;font-size:1.3em;text-align:center' }, a.frage),
  ];
}

function frageBildschirm() {
  const a = aufgaben[index];
  const jaNein = a.typ !== 'gegenteil';
  const optionen = jaNein ? null : mischen(a.optionen);
  const vorleseText = jaNein
    ? `${a.frage} Ja oder nein?`
    : `${a.frage} ${optionen.map((o) => o.text).join('. Oder: ')}?`;
  zeige(
    el('section', { class: 'k-karte' },
      ...kopfZeile(a),
      el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => vorlesen(vorleseText) }, '🔊 Frage vorlesen'),
      el('div', { class: 'k-antworten', role: 'group', 'aria-label': 'Antwort wählen' },
        ...(jaNein
          ? [
            el('button', { class: 'k-knopf k-knopf--neutral', style: 'min-height:5rem', onclick: () => waehle(a, 'ja') },
              el('span', { style: 'font-size:2.2em;display:block;line-height:1.1' }, '✅'), el('span', {}, 'Ja')),
            el('button', { class: 'k-knopf k-knopf--neutral', style: 'min-height:5rem', onclick: () => waehle(a, 'nein') },
              el('span', { style: 'font-size:2.2em;display:block;line-height:1.1' }, '❌'), el('span', {}, 'Nein')),
          ]
          : optionen.map((o) => el('button', {
            class: 'k-knopf k-knopf--neutral',
            style: 'min-height:4.5rem',
            onclick: () => waehle(a, o),
          }, o.text))))));
}

function waehle(a, antwort) {
  const richtig = istRichtig(a, antwort);
  const kopf = richtig ? '🌟 Ja, genau!' : '🔎 Schau mal:';
  const loesung = a.typ === 'gegenteil' ? richtigeOption(a).text : a.korrekt === 'ja' ? 'Ja' : 'Nein';
  const satz = richtig ? a.erklaerung : `${loesung}. ${a.erklaerung}`;
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
  const text = `Bildschirm aus – jetzt sortiert ihr selbst! ${ideen.join(' ')}`;
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '🗂️'),
      el('p', { style: 'font-weight:700;font-size:1.3em;text-align:center;margin-bottom:0' }, 'Bildschirm aus –'),
      el('p', { style: 'font-weight:700;font-size:1.3em;text-align:center;margin-top:0' }, 'jetzt sortiert ihr selbst!'),
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
