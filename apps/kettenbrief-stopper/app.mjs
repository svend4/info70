// Kettenbrief-Stopper: erlebbare Simulation (8-12 Jahre).
// Eine Kettennachricht rast durch die Klasse; das Kind erlebt den Moment,
// in dem sie es selbst erreicht - und was sein "Stopp" verändert.
// Politik: keine externen Anfragen; diese App speichert GAR NICHTS.
import { el, vorlesen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { erstelleKlasse, simuliere, vergleiche } from './sim.mjs';
import { NACHRICHTEN_TYPEN, typNach } from './nachrichten.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');

let aktiverTyp = NACHRICHTEN_TYPEN[0];
let gemeldet = false;
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
      el('p', { style: 'margin-top:0' }, 'Wähle ein Experiment. Beobachte: Was passiert, wenn alle weiterleiten – und was, wenn DU stoppst?'),
      ...NACHRICHTEN_TYPEN.map((typ) => el('div', { style: 'border:1px solid var(--k-rand);border-radius:0.6rem;padding:0.6rem;margin:0.5rem 0' },
        el('p', { style: 'font-weight:700;margin:0 0 0.3rem' }, `${typ.emoji} ${typ.titel}`),
        el('div', { class: 'k-hinweis k-hinweis--falsch' }, el('p', { style: 'margin:0;font-weight:600' }, typ.nachricht)),
        el('div', { class: 'k-antworten' },
          el('button', { class: 'k-knopf', onclick: () => starteExperiment(typ) }, `▶️ ${typ.titel}-Experiment starten`),
          el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`${typ.intro} ${typ.nachricht}`) }, '🔊 Vorlesen'))))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin:0' }, '💡 Gut zu wissen: Diese App speichert nichts – gar nichts. Jedes Experiment startet frisch.')));
}

function starteExperiment(typ = aktiverTyp) {
  aktiverTyp = typ;
  gemeldet = false;
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

function stoppeAusbreitung() {
  stopper.add(klasse.spieler);
  for (const ziel of klasse.ziele[klasse.spieler]) immun.add(ziel);
  for (let kind = 0; kind < klasse.groesse && immun.size < klasse.ziele[klasse.spieler].length + 1; kind++) {
    if (kind !== klasse.spieler && !erhalten.has(kind)) immun.add(kind);
  }
}

function entscheidungsBildschirm() {
  const optionen = [
    el('button', {
      class: 'k-knopf',
      onclick: () => { entscheidungGefallen = true; simulationsBildschirm(); },
    }, aktiverTyp.weiter),
    el('button', {
      class: 'k-knopf k-knopf--richtig',
      onclick: () => { entscheidungGefallen = true; stoppeAusbreitung(); simulationsBildschirm(); },
    }, aktiverTyp.stopp),
  ];
  if (aktiverTyp.melden) {
    optionen.push(el('button', {
      class: 'k-knopf k-knopf--richtig',
      onclick: () => { entscheidungGefallen = true; gemeldet = true; stoppeAusbreitung(); simulationsBildschirm(); },
    }, aktiverTyp.melden));
  }
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-untertitel', style: 'margin-top:0' }, `Runde ${runde} · Die Nachricht hat DICH erreicht! 📱`),
      el('div', { class: 'k-hinweis k-hinweis--falsch' }, el('p', { style: 'margin:0;font-weight:600' }, aktiverTyp.nachricht)),
      aktiverTyp.quellenHinweis ? el('p', { style: 'background:#eff6ff;border-radius:0.5rem;padding:0.5rem;margin:0.4rem 0' }, `🔎 ${aktiverTyp.quellenHinweis}`) : '',
      el('p', { style: 'font-weight:600' }, aktiverTyp.frage),
      el('div', { class: 'k-antworten' },
        ...optionen,
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`${aktiverTyp.nachricht}. ${aktiverTyp.frage}`) }, '🔊 Vorlesen'))));
}

function endBildschirm() {
  const { alleLeitenWeiter } = vergleiche(klasse);
  const gestoppt = stopper.has(klasse.spieler);
  const gerettet = Math.max(0, alleLeitenWeiter - erhalten.size);
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, gestoppt ? (gemeldet ? '📣' : '🦸') : aktiverTyp.emoji),
      el('p', { style: 'text-align:center;font-weight:700' },
        gestoppt
          ? `${gemeldet ? 'Melden und Stoppen' : 'Dein Stopp'} hat gewirkt: ${erhalten.size} statt ${alleLeitenWeiter} Kinder erreicht – du hast ${gerettet} Kinder geschützt!`
          : `Alle haben mitgemacht: ${erhalten.size} von ${klasse.groesse} Kindern erreicht. Probiere aus, was dein Stopp verändert!`),
      gitter()),
    el('section', { class: 'k-karte' },
      gemeldet ? el('p', { style: 'font-weight:600' }, '📣 Stark: Du hast es einer erwachsenen Person / der App gemeldet – das schützt auch die anderen.') : '',
      ...aktiverTyp.lernpunkte.map((p) => el('p', {}, p)),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(aktiverTyp.lernpunkte.join(' ')) }, '🔊 Vorlesen'),
        el('button', { class: 'k-knopf', onclick: () => starteExperiment(aktiverTyp) }, '🔁 Noch ein Experiment'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: startBildschirm }, '🏠 Zum Start'))));
}

startBildschirm();
