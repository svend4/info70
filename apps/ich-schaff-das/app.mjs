// Ich schaff das!: Szenario-Trainer fuer Selbstregulation und Dranbleiben (8-12 Jahre).
// Katalog Nr. 2 (docs/10, Praleska-Baukasten): Willenssphaere - Ziele setzen, planen,
// durchhalten, mit Misserfolg umgehen. Drei rote Faeden durch alle Szenarien:
// erst Pause, dann Plan · Grosses in kleine Schritte teilen · Hilfe holen ist stark.
// Wie stark-im-chat hat jedes Szenario eigene Optionen mit Wert 2/1/0 - der
// gemeinsame Szenario-Kern bleibt ein eigenes Refactoring (docs/05, Methode 0).
// Politik: keine externen Anfragen, nur Rekord in localStorage.
import { el, vorlesen, mischen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';

installiereNetzwerkWaechter();

const REKORD_SCHLUESSEL = 'isd.rekord';
const app = document.getElementById('app');
const daten = await fetch('daten/szenarien.json').then((r) => r.json());

let szenarien = [];
let index = 0;
let punkte = 0;

const maxPunkte = () => szenarien.length * 2;

function zeige(...knoten) {
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🧗 Ich schaff das!'),
    el('p', { class: 'k-untertitel' }, 'Erst Pause, dann Plan. Kleine Schritte. Dranbleiben.'),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · ohne Anmeldung · Daten bleiben auf diesem Gerät · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
  app.querySelector('button')?.focus();
}

function startBildschirm() {
  const rekord = Number(localStorage.getItem(REKORD_SCHLUESSEL) ?? 0);
  zeige(
    el('section', { class: 'k-karte' },
      el('p', {}, `Schwere Hausaufgaben, ein riesiges Referat, ein verlorenes Spiel: In ${daten.szenarien.length} Alltagssituationen entscheidest du, ob du hinschmeißt – oder dranbleibst. Kleine Züge, große Wirkung.`),
      rekord > 0 ? el('p', {}, `Dein Rekord: ${rekord} von ${daten.szenarien.length * 2} 🧗`) : '',
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starteRunde }, '▶️ Training starten'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen('Schwere Hausaufgaben, ein riesiges Referat, ein verlorenes Spiel. In zehn Alltagssituationen entscheidest du, ob du hinschmeißt oder dranbleibst. Kleine Züge, große Wirkung.') }, '🔊 Vorlesen'))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0' }, '💛 Wichtig: Niemand muss immer stark sein. Wenn dich etwas lange traurig macht oder überfordert, sprich mit Erwachsenen – oder ruf kostenlos und anonym an: Nummer gegen Kummer 116 111.'),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => { localStorage.clear(); startBildschirm(); } }, 'Meine Daten löschen')));
}

function starteRunde() {
  szenarien = mischen(daten.szenarien);
  index = 0;
  punkte = 0;
  szenarioBildschirm();
}

function szenarioBildschirm() {
  const s = szenarien[index];
  const optionen = mischen(s.optionen);
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-untertitel' }, `Situation ${index + 1} von ${szenarien.length}`),
      el('div', { class: 'k-fortschritt', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': szenarien.length, 'aria-valuenow': index },
        el('div', { style: `width:${(index / szenarien.length) * 100}%` })),
      el('p', { style: 'font-weight:600' }, s.situation),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`${s.situation} Was machst du? ${optionen.map((o) => o.text).join('. Oder: ')}`) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        ...optionen.map((o) =>
          el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => antworte(s, o) }, o.text)))));
}

function antworte(s, option) {
  punkte += option.wert;
  const titel = option.wert === 2 ? 'Starker Zug! 🧗🧗' : option.wert === 1 ? 'Okay – aber da geht mehr! 🧗' : 'So wird es schwerer …';
  const klasse = option.wert === 2 ? 'k-hinweis--richtig' : option.wert === 1 ? '' : 'k-hinweis--falsch';
  const beste = s.optionen.find((o) => o.wert === 2);
  zeige(
    el('section', { class: 'k-karte' },
      el('div', { class: `k-hinweis ${klasse}` },
        el('p', { style: 'font-weight:700;margin-top:0' }, titel),
        el('p', {}, s.erklaerung),
        option.wert < 2 ? el('p', { style: 'margin-bottom:0' }, `Stärkster Zug: ${beste.text}`) : ''),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`${titel} ${s.erklaerung}`) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: weiter }, index + 1 < szenarien.length ? 'Nächste Situation ➡️' : 'Zum Ergebnis 🏁'))));
}

function weiter() {
  index++;
  if (index < szenarien.length) szenarioBildschirm();
  else endBildschirm();
}

function endBildschirm() {
  const rekord = Math.max(punkte, Number(localStorage.getItem(REKORD_SCHLUESSEL) ?? 0));
  localStorage.setItem(REKORD_SCHLUESSEL, String(rekord));
  const rang = [...daten.raenge].reverse().find((r) => punkte >= r.ab) ?? daten.raenge[0];
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, rang.emoji),
      el('p', { class: 'k-untertitel', style: 'font-weight:700' }, rang.titel),
      el('p', { style: 'text-align:center' }, `${punkte} von ${maxPunkte()} Dranbleib-Punkten · Rekord: ${rekord}`),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`Du hast ${punkte} von ${maxPunkte()} Dranbleib-Punkten. Dein Rang: ${rang.titel}`) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starteRunde }, '🔁 Noch einmal'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: startBildschirm }, '🏠 Zum Start'))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin:0' }, '📌 Merk dir drei Züge: Erst Pause, dann Plan · Großes in kleine Schritte teilen · Um Hilfe bitten ist stark.')));
}

startBildschirm();
