// Kettenbrief-Stopper: erlebbare Simulation (8-12 Jahre).
// Eine Kettennachricht rast durch die Klasse; das Kind erlebt den Moment,
// in dem sie es selbst erreicht - und was sein "Stopp" verändert.
// Politik: keine externen Anfragen; diese App speichert GAR NICHTS.
import { el, vorlesen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { erstelleKlasse, simuliere, vergleiche } from './sim.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');

const NACHRICHT = '⛓️😱 ACHTUNG! Schick diese Nachricht noch HEUTE an 2 Freunde weiter, sonst hast du 10 Jahre Pech!!! Ein Junge hat nicht weitergeleitet und dann...';

let klasse;
let erhalten;
let front;
let runde;
let entscheidungGefallen;
let stopper;
let immun;

function zeige(...knoten) {
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🛑 Kettenbrief-Stopper'),
    el('p', { class: 'k-untertitel' }, 'Eine Nachricht rast durch die Klasse. Du kannst sie stoppen!'),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · ohne Anmeldung · diese App speichert nichts · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
  app.querySelector('button')?.focus();
}

function gitter() {
  const zellen = [];
  for (let kind = 0; kind < klasse.groesse; kind++) {
    let gesicht = '🙂';
    if (immun.has(kind)) gesicht = '🛡️';
    else if (erhalten.has(kind)) gesicht = '😨';
    const istSpieler = kind === klasse.spieler;
    if (istSpieler && !erhalten.has(kind) && !immun.has(kind)) gesicht = '🙋';
    zellen.push(el('div', {
      style: `font-size:1.6rem;text-align:center;padding:0.15rem;border-radius:0.5rem;${istSpieler ? 'outline:3px solid var(--k-blau);' : ''}`,
      'aria-label': istSpieler ? 'Das bist du' : undefined,
    }, istSpieler ? `${gesicht}` : gesicht));
  }
  return el('div', { style: 'display:grid;grid-template-columns:repeat(6,1fr);gap:0.25rem' }, ...zellen);
}

function startBildschirm() {
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0' }, 'In der Klasse taucht diese Nachricht auf:'),
      el('div', { class: 'k-hinweis k-hinweis--falsch' }, el('p', { style: 'margin:0;font-weight:600' }, NACHRICHT)),
      el('p', {}, 'Was passiert, wenn alle weiterleiten? Und was, wenn DU stoppst? Finde es im Experiment heraus – Runde für Runde.'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starteExperiment }, '▶️ Experiment starten'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen('In der Klasse taucht eine Kettennachricht auf. Was passiert, wenn alle weiterleiten? Und was, wenn du stoppst? Finde es im Experiment heraus.') }, '🔊 Vorlesen'))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin:0' }, '💡 Gut zu wissen: Diese App speichert nichts – gar nichts. Jedes Experiment startet frisch.')));
}

function starteExperiment() {
  klasse = erstelleKlasse();
  erhalten = new Set([klasse.start]);
  front = [klasse.start];
  runde = 0;
  entscheidungGefallen = false;
  stopper = new Set();
  immun = new Set();
  simulationsBildschirm();
}

function naechsteRunde() {
  const neu = new Set();
  for (const kind of front) {
    if (stopper.has(kind)) continue;
    for (const ziel of klasse.ziele[kind]) {
      if (!erhalten.has(ziel) && !immun.has(ziel)) neu.add(ziel);
    }
  }
  for (const kind of neu) erhalten.add(kind);
  front = [...neu];
  runde++;
  if (neu.has(klasse.spieler) && !entscheidungGefallen) {
    entscheidungsBildschirm();
  } else if (neu.size === 0) {
    endBildschirm();
  } else {
    simulationsBildschirm();
  }
}

function simulationsBildschirm() {
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-untertitel', style: 'margin-top:0' }, `Runde ${runde} · 😨 ${erhalten.size} von ${klasse.groesse} Kindern erschreckt`),
      gitter(),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: naechsteRunde }, '⏩ Nächste Runde'))));
}

function entscheidungsBildschirm() {
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-untertitel', style: 'margin-top:0' }, `Runde ${runde} · Die Nachricht hat DICH erreicht! 📱`),
      el('div', { class: 'k-hinweis k-hinweis--falsch' }, el('p', { style: 'margin:0;font-weight:600' }, NACHRICHT)),
      el('p', { style: 'font-weight:600' }, 'Dein Herz klopft. Was machst du?'),
      el('div', { class: 'k-antworten' },
        el('button', {
          class: 'k-knopf',
          onclick: () => {
            entscheidungGefallen = true;
            simulationsBildschirm();
          },
        }, '😰 An 2 Freunde weiterleiten – sicher ist sicher'),
        el('button', {
          class: 'k-knopf k-knopf--richtig',
          onclick: () => {
            entscheidungGefallen = true;
            stopper.add(klasse.spieler);
            for (const ziel of klasse.ziele[klasse.spieler]) immun.add(ziel);
            for (let kind = 0; kind < klasse.groesse && immun.size < klasse.ziele[klasse.spieler].length + 1; kind++) {
              if (kind !== klasse.spieler && !erhalten.has(kind)) immun.add(kind);
            }
            simulationsBildschirm();
          },
        }, '🛑 STOPP! Löschen und Freund*innen warnen'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`${NACHRICHT}. Dein Herz klopft. Was machst du? Weiterleiten, oder stopp: löschen und Freundinnen und Freunde warnen?`) }, '🔊 Vorlesen'))));
}

function endBildschirm() {
  const { alleLeitenWeiter } = vergleiche(klasse);
  const gestoppt = stopper.has(klasse.spieler);
  const gerettet = Math.max(0, alleLeitenWeiter - erhalten.size);
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, gestoppt ? '🦸' : '⛓️'),
      el('p', { style: 'text-align:center;font-weight:700' },
        gestoppt
          ? `Dein Stopp hat gewirkt: ${erhalten.size} statt ${alleLeitenWeiter} Kinder erschreckt – du hast ${gerettet} Kinder geschützt!`
          : `Alle haben weitergeleitet: ${erhalten.size} von ${klasse.groesse} Kindern erschreckt. Probiere aus, was dein Stopp verändert!`),
      gitter()),
    el('section', { class: 'k-karte' },
      el('p', {}, '🔍 Kettennachrichten arbeiten mit Angst und Zeitdruck – genau daran erkennst du sie.'),
      el('p', {}, '🙅 Es passiert NICHTS, wenn du nicht weiterleitest. Pech kann man nicht verschicken.'),
      el('p', {}, '🛑 Löschen + Bescheid sagen („Das ist ein Kettenbrief, ignorier ihn!“) schützt deine Freund*innen.'),
      el('p', {}, '💬 Macht dir eine Nachricht Angst? Sprich mit Erwachsenen – oder ruf die Nummer gegen Kummer an: 116 111 (kostenlos).'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen('Kettennachrichten arbeiten mit Angst und Zeitdruck. Es passiert nichts, wenn du nicht weiterleitest. Löschen und Bescheid sagen schützt deine Freundinnen und Freunde.') }, '🔊 Vorlesen'),
        el('button', { class: 'k-knopf', onclick: starteExperiment }, '🔁 Noch ein Experiment'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: startBildschirm }, '🏠 Zum Start'))));
}

startBildschirm();
