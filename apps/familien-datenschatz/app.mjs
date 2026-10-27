// Familien-Datenschatz (Eltern+Kind 8-12, docs/09 Ось F Nr. 271).
// Szenario-Duett auf einem Gerät: Kind antwortet, dann Eltern (verdeckt),
// dann Vergleich + Erklärung + Gesprächsimpuls. Kein Gewinner – Gesprächsanlass.
// Politik docs/02: keine externen Anfragen, nichts wird gespeichert, keine Punkte.
import { el, vorlesen, mischen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { boot as bootAnzeige } from '../../packages/kinder-ui/js/anzeige.mjs';
import { vergleiche, rundeErgebnis, familienBotschaft } from './logik.mjs';

installiereNetzwerkWaechter();
bootAnzeige();

const RUNDE = 8;
const app = document.getElementById('app');
const daten = await fetch('daten/szenarien.json').then((r) => r.json());
const ANTWORTEN = daten.antworten;

let szenarien = [];
let index = 0;
let kindAntworten = [];
let elternAntworten = [];
let phase = 'start'; // start | kind | eltern | aufloesung | ende

function zeige(...knoten) {
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '👨‍👩‍👧 Familien-Datenschatz'),
    el('p', { class: 'k-untertitel' }, 'Kind und Eltern entscheiden – und vergleichen'),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · ohne Anmeldung · nichts wird hochgeladen · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
  app.querySelector('button')?.focus();
}

function start() {
  phase = 'start';
  zeige(
    el('section', { class: 'k-karte' },
      el('p', {}, `Zusammen durch ${RUNDE} Familien-Situationen: Erst entscheidet das Kind, dann die Eltern (verdeckt) – danach wird verglichen. Auch beim Thema „Überwachung“ gilt: Kinder haben ein eigenes Recht auf Privatsphäre.`),
      el('p', { style: 'font-size:0.9rem;color:#4b5563' }, daten.hinweis),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starteRunde }, '▶️ Los geht’s'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen('Zusammen durch acht Familien-Situationen. Erst entscheidet das Kind, dann die Eltern. Danach vergleicht ihr.') }, '🔊 Vorlesen'))));
}

function starteRunde() {
  szenarien = mischen(daten.szenarien).slice(0, Math.min(RUNDE, daten.szenarien.length));
  index = 0;
  kindAntworten = [];
  elternAntworten = [];
  frageKind();
}

function fortschritt() {
  return el('p', { style: 'text-align:center;color:#6b7280;font-size:0.9rem' }, `Situation ${index + 1} von ${szenarien.length}`);
}

function situationsKarte(spieler, farbe) {
  const s = szenarien[index];
  return el('section', { class: 'k-karte', style: `border-inline-start:6px solid ${farbe}` },
    el('p', { style: 'font-weight:600;margin-top:0' }, spieler),
    el('p', {}, s.situation),
    el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(s.situation) }, '🔊 Vorlesen'));
}

function antwortKnoepfe(onWahl) {
  return el('div', { class: 'k-antworten' },
    ...ANTWORTEN.map((a) => el('button', { class: 'k-knopf', onclick: () => onWahl(a.code) }, a.text)));
}

function frageKind() {
  phase = 'kind';
  zeige(fortschritt(), situationsKarte('🧒 Kind, was machst du?', 'var(--k-blau)'),
    antwortKnoepfe((code) => { kindAntworten[index] = code; frageEltern(); }));
}

function frageEltern() {
  phase = 'eltern';
  zeige(fortschritt(),
    el('section', { class: 'k-karte' }, el('p', { style: 'margin:0' }, '🙈 Die Antwort des Kindes ist verdeckt. Jetzt sind die Eltern dran.')),
    situationsKarte('🧑‍🦰 Eltern, was macht ihr?', 'var(--k-gruen, #16a34a)'),
    antwortKnoepfe((code) => { elternAntworten[index] = code; aufloesung(); }));
}

function textVon(code) {
  return ANTWORTEN.find((a) => a.code === code)?.text ?? code;
}

function aufloesung() {
  phase = 'aufloesung';
  const s = szenarien[index];
  const v = vergleiche(s, kindAntworten[index], elternAntworten[index]);
  const antwortZeile = (name, code) => el('p', { style: 'margin:0.2rem 0' }, `${name}: ${textVon(code)}`);

  zeige(fortschritt(),
    el('section', { class: 'k-karte', style: `background:${v.einig ? '#dcfce7' : '#fef3c7'}` },
      el('p', { style: 'font-weight:700;margin-top:0' }, v.einig ? '🤝 Ihr wart euch einig!' : '💬 Ihr habt unterschiedlich entschieden'),
      antwortZeile('🧒 Kind', kindAntworten[index]),
      antwortZeile('🧑‍🦰 Eltern', elternAntworten[index]),
      el('p', { style: 'margin:0.4rem 0 0' }, `Faire Wahl: ${textVon(s.beste)}`)),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0' }, s.erklaerung),
      el('p', { style: 'margin:0.4rem 0 0;font-style:italic;color:#374151' }, `🗣️ Zum Reden: ${s.gespraech}`),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`${s.erklaerung} Zum Reden: ${s.gespraech}`) }, '🔊 Vorlesen')),
    el('div', { class: 'k-antworten' },
      el('button', { class: 'k-knopf', onclick: weiter }, index + 1 < szenarien.length ? '➡️ Weiter' : '🏁 Ergebnis')));
}

function weiter() {
  index++;
  if (index < szenarien.length) frageKind();
  else ende();
}

function ende() {
  phase = 'ende';
  const r = rundeErgebnis(szenarien, kindAntworten, elternAntworten);
  zeige(
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0' }, '🏁 Euer Familien-Ergebnis'),
      el('p', { style: 'margin:0.4rem 0' }, `🤝 Einig bei ${r.einigCount} von ${r.gesamt} Situationen`),
      el('p', { style: 'margin:0.4rem 0 0;font-weight:600' }, familienBotschaft(r))),
    el('div', { class: 'k-antworten' },
      el('button', { class: 'k-knopf', onclick: starteRunde }, '🔁 Noch eine Runde'),
      el('button', { class: 'k-knopf k-knopf--neutral', onclick: start }, '🏠 Start')));
}

start();
