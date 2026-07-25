// Dinge des Alltags (3-5, NUR gemeinsam mit einem Erwachsenen):
// Kategorien, Teile, Materialien, Funktionen, „gemacht oder gewachsen“ und
// Fahrzeuge. Praleska docs/10 (Ko-Nutzung Nr. 2).
//
// Ko-Nutzungs-Design wie in gemeinsam-gesund-essen: Erwachsenen-Gate vor dem
// Start, höchstens PRO_SESSION Aufgaben, danach zwingend Schluss mit Ideen
// für draußen. Keine Punkte, kein Rekord, kein Ranking – richtig und falsch
// bleiben folgenlos und freundlich. Es wird NICHTS gespeichert.
// Politik docs/02: keine externen Anfragen.
import { el, vorlesen, mischen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { PRO_SESSION, waehleAufgaben, richtigeOption, pruefeDaten } from './logik.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const daten = await fetch('daten/aufgaben.json').then((r) => r.json());

let aufgaben = [];
let index = 0;

function zeige(...knoten) {
  app.replaceChildren(...[
    el('h1', { class: 'k-titel' }, '🪑 Dinge des Alltags'),
    el('p', { class: 'k-untertitel' }, 'Für Kind und Erwachsene – zusammen.'),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · ohne Anmeldung · keine Namen · nichts wird gespeichert · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')),
  ].filter(Boolean));
  app.querySelector('button')?.focus();
}

// Erwachsenen-Gate: Diese App ist reine Ko-Nutzung.
function gate() {
  const intro = 'Diese App spielt ihr zusammen: ein Kind und ein Erwachsener. Ihr schaut Dinge an, die es überall gibt, und redet danach darüber. Es gibt keine Punkte.';
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '🧑‍🍼🧒'),
      el('p', { style: 'font-weight:700;text-align:center;font-size:1.2em' }, 'Bitte gemeinsam spielen.'),
      el('p', {}, 'Diese App ist für ein Kind UND einen Erwachsenen zusammen.'),
      el('p', {}, 'Ihr schaut Dinge an, die es überall gibt: Möbel, Geschirr, Kleidung, Fahrzeuge.'),
      el('p', {}, 'Nach jedem Bild kommt eine Frage zum Weiterreden. Es gibt keine Punkte.'),
      el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => vorlesen(intro) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starteRunde }, '👪 Ein Erwachsener ist dabei – los!'))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin:0' }, `👉 Höchstens ${PRO_SESSION} Bilder – danach geht es zusammen weiter, ohne Bildschirm.`)));
}

function starteRunde() {
  aufgaben = waehleAufgaben(daten.aufgaben);
  index = 0;
  aufgabeBildschirm();
}

function aufgabeBildschirm() {
  const a = aufgaben[index];
  const optionen = mischen(a.optionen);
  const vorleseText = `${a.frage} ${optionen.map((o) => o.text).join(' oder ')}?`;
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-untertitel' }, `Bild ${index + 1} von ${aufgaben.length}`),
      el('div', {
        class: 'k-fortschritt', role: 'progressbar',
        'aria-valuemin': '0', 'aria-valuemax': String(aufgaben.length), 'aria-valuenow': String(index),
      }, el('div', { style: `width:${(index / aufgaben.length) * 100}%` })),
      el('p', { style: 'font-weight:700;font-size:1.4em;text-align:center' }, a.frage),
      el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => vorlesen(vorleseText) }, '🔊 Frage vorlesen'),
      el('div', { class: 'k-antworten' },
        ...optionen.map((o) => el('button', {
          class: 'k-knopf k-knopf--neutral',
          style: 'min-height:6rem',
          'aria-label': o.text,
          onclick: () => waehle(a, o),
        },
        el('span', { style: 'font-size:2.8em;display:block;line-height:1.1' }, o.emoji),
        el('span', {}, o.text))))));
}

// Rückmeldung: freundlich und folgenlos. Kein „falsch“, keine Punkte –
// bei einem Fehlgriff zeigt die App einfach, was gemeint war.
function waehle(a, gewaehlt) {
  const richtig = Boolean(gewaehlt.richtig);
  const loesung = richtigeOption(a);
  const kopf = richtig ? '🌟 Ja, genau!' : '🔎 Schau mal:';
  const satz = richtig ? a.erklaerung : `${loesung.emoji} ${loesung.text}. ${a.erklaerung}`;
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
  if (index < aufgaben.length) aufgabeBildschirm();
  else schluss();
}

// Zwingender Schluss: Bildschirm aus, weitersuchen in der echten Wohnung.
function schluss() {
  const ideen = daten.schlussIdeen;
  const text = `Bildschirm aus – jetzt sucht ihr selbst! ${ideen.join(' ')}`;
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '🔍'),
      el('p', { style: 'font-weight:700;font-size:1.3em;text-align:center;margin-bottom:0' }, 'Bildschirm aus –'),
      el('p', { style: 'font-weight:700;font-size:1.3em;text-align:center;margin-top:0' }, 'jetzt sucht ihr selbst!'),
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
