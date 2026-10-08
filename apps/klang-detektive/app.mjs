// Klang-Detektive: Hör-Quiz mit lokal erzeugten Klängen (WebAudio) für 3-5
// (Ko-Nutzung) / 5-7. Hoch/tief, laut/leise, schnell/langsam, rauf/runter,
// weich/scharf. Die Klänge werden im Browser synthetisiert – KEINE fremden
// Audiodateien, KEINE externen Requests (CSP self). Praleska docs/10 (Nr. 20).
// Politik docs/02: keine externen Anfragen, nur Rekord in localStorage.
import { el, vorlesen, mischen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { boot as bootAnzeige } from '../../packages/kinder-ui/js/anzeige.mjs';
import { datenKarte } from '../../packages/kinder-ui/js/daten-karte.mjs';
import { pruefeFragen, rangFuer } from './logik.mjs';

installiereNetzwerkWaechter();
bootAnzeige();

const REKORD = 'klang.rekord';
const RUNDE = 8;
const app = document.getElementById('app');
const daten = await fetch('daten/fragen.json').then((r) => r.json());

let audio = null; // AudioContext wird erst bei der ersten Nutzer-Geste erzeugt
let fragen = [];
let index = 0;
let punkte = 0;
let beantwortet = false;

function ctx() {
  if (!audio) audio = new (window.AudioContext || window.webkitAudioContext)();
  if (audio.state === 'suspended') audio.resume();
  return audio;
}

function ton(hz, startAt, dauer, gain = 0.18, wellenform = 'sine') {
  const a = ctx();
  const osc = a.createOscillator();
  const g = a.createGain();
  osc.type = wellenform;
  osc.frequency.value = hz;
  // sanftes Ein-/Ausblenden, damit es nicht knackt
  g.gain.setValueAtTime(0, startAt);
  g.gain.linearRampToValueAtTime(gain, startAt + 0.02);
  g.gain.setValueAtTime(gain, startAt + dauer - 0.05);
  g.gain.linearRampToValueAtTime(0, startAt + dauer);
  osc.connect(g).connect(a.destination);
  osc.start(startAt);
  osc.stop(startAt + dauer + 0.02);
}

function glide(von, bis, startAt, dauer, gain = 0.18) {
  const a = ctx();
  const osc = a.createOscillator();
  const g = a.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(von, startAt);
  osc.frequency.linearRampToValueAtTime(bis, startAt + dauer);
  g.gain.setValueAtTime(0, startAt);
  g.gain.linearRampToValueAtTime(gain, startAt + 0.02);
  g.gain.setValueAtTime(gain, startAt + dauer - 0.05);
  g.gain.linearRampToValueAtTime(0, startAt + dauer);
  osc.connect(g).connect(a.destination);
  osc.start(startAt);
  osc.stop(startAt + dauer + 0.02);
}

function spiele(frage) {
  const a = ctx();
  const t0 = a.currentTime + 0.05;
  if (frage.typ === 'hoch-tief') {
    ton(frage.toene[0].hz, t0, 0.6);
    ton(frage.toene[1].hz, t0 + 0.9, 0.6);
  } else if (frage.typ === 'laut-leise') {
    ton(frage.toene[0].hz, t0, 0.6, frage.toene[0].gain);
    ton(frage.toene[1].hz, t0 + 0.9, 0.6, frage.toene[1].gain);
  } else if (frage.typ === 'schnell-langsam') {
    frage.rhythmen.forEach((r, blk) => {
      const basis = t0 + blk * 2.2;
      const abstand = 1.8 / r.schlaege;
      for (let i = 0; i < r.schlaege; i++) ton(500, basis + i * abstand, 0.09, 0.2, 'square');
    });
  } else if (frage.typ === 'hoch-runter') {
    glide(frage.glide.von, frage.glide.bis, t0, 1.1);
  } else if (frage.typ === 'weich-scharf') {
    ton(frage.klang.hz, t0, 0.9, 0.16, frage.klang.wellenform);
  }
}

function zeige(...knoten) {
  app.replaceChildren(...[
    el('h1', { class: 'k-titel' }, '🎧 Klang-Detektive'),
    el('p', { class: 'k-untertitel' }, 'Spitz die Ohren – was hörst du?'),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · Klänge im Browser erzeugt · Daten bleiben auf diesem Gerät · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')),
  ].filter(Boolean));
  app.querySelector('button')?.focus();
}

function start() {
  const rekord = Number(localStorage.getItem(REKORD) ?? 0);
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '👂'),
      el('p', {}, `Du hörst kleine Klänge und rätst: hoch oder tief? laut oder leise? schnell oder langsam? In ${RUNDE} Rätseln wirst du zum Klang-Detektiv.`),
      el('p', { style: 'font-size:0.9rem;color:#4b5563' }, 'Am besten mit einem großen Menschen zusammen. Nicht zu laut stellen – schütze deine Ohren!'),
      rekord > 0 ? el('p', {}, `Dein Rekord: ${rekord} von ${RUNDE} 🎧`) : null,
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: () => { fragen = mischen(daten.fragen).slice(0, RUNDE); index = 0; punkte = 0; frage(); } }, '▶️ Los geht’s'))),
    datenKarte({ schluessel: REKORD, was: 'dein Rekord', nachLoeschen: start }));
}

function frage() {
  beantwortet = false;
  const q = fragen[index];
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-untertitel' }, `Rätsel ${index + 1} von ${fragen.length}`),
      el('p', { class: 'k-gross' }, '🎵'),
      el('p', { style: 'font-weight:700;font-size:1.2em;text-align:center' }, q.frage),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: () => spiele(q) }, '🔊 Klang anhören')),
      el('p', { style: 'text-align:center;font-size:0.85rem;color:#4b5563' }, 'Du kannst so oft hören, wie du magst.'),
      el('div', { class: 'k-antworten' },
        ...q.optionen.map((o, i) => el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => antworte(q, i) }, o)))));
}

function antworte(q, wahl) {
  if (beantwortet) return;
  beantwortet = true;
  const richtig = wahl === q.korrekt;
  if (richtig) punkte++;
  const letzte = index + 1 >= fragen.length;
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, richtig ? '🌟' : '💭'),
      el('div', { class: `k-hinweis${richtig ? ' k-hinweis--richtig' : ''}` },
        el('p', { style: 'font-weight:700;margin-top:0' }, richtig ? 'Richtig gehört!' : 'Fast! Hör nochmal genau hin.'),
        el('p', { style: 'margin-bottom:0' }, q.erklaerung)),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => spiele(q) }, '🔊 Nochmal hören'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(q.erklaerung) }, '📖 Vorlesen')),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: () => { index++; if (index < fragen.length) frage(); else ende(); } }, letzte ? 'Fertig 🏁' : 'Weiter ➡️'))));
}

function ende() {
  const rekordAlt = Number(localStorage.getItem(REKORD) ?? 0);
  if (punkte > rekordAlt) localStorage.setItem(REKORD, String(punkte));
  const rang = rangFuer(daten.raenge, punkte);
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, rang.emoji),
      el('p', { style: 'font-weight:700;font-size:1.2em;text-align:center' }, rang.titel),
      el('p', { style: 'text-align:center' }, `${punkte} von ${fragen.length} richtig gehört`),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: () => { fragen = mischen(daten.fragen).slice(0, RUNDE); index = 0; punkte = 0; frage(); } }, '🔁 Noch einmal'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: start }, '🏠 Start'))));
}

const fehler = pruefeFragen(daten);
if (fehler.length) {
  app.replaceChildren(el('div', { class: 'k-hinweis k-hinweis--falsch' }, el('p', { style: 'margin:0' }, `Datenfehler: ${fehler[0]}`)));
} else {
  start();
}
