// Sog-Maschine: Bindungs-Mechaniken erleben und benennen (8-12 Jahre).
// Ein harmloser Demo-Feed - aber mit zuschaltbarem Autoplay, Endlos-Scroll,
// Streak und Zufalls-Belohnung. Ein Live-Panel benennt den Trick, der gerade
// wirkt; am Ende schaetzt das Kind die verbrachte Zeit (der Sog laesst sie
// schrumpfen). Politik docs/02: keine externen Anfragen, speichert NICHTS.
import { el, vorlesen, mischen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { boot as bootAnzeige } from '../../packages/kinder-ui/js/anzeige.mjs';
import { MECHANIKEN, mechanik, bewerteSchaetzung, formatSekunden, VIDEOS } from './sog.mjs';

installiereNetzwerkWaechter();
bootAnzeige(); // Anzeige-Einstellung (Kontrast/Schrift) anwenden (BFSG)

const app = document.getElementById('app');
const OHNE_SOG_ENDE = 6;

let aktiv = {};
let reihe = [];
let angeschaut = 0;
let streak = 0;
let startZeit = 0;
let autoplayTimer = null;
let panelText = null;

function zeige(...knoten) {
  clearTimeout(autoplayTimer);
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🌀 Sog-Maschine'),
    el('p', { class: 'k-untertitel' }, 'Spür den Sog – und schau ihm dabei auf die Finger.'),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · ohne Anmeldung · diese App speichert nichts · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
}

function startBildschirm() {
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0' }, 'Video-Apps benutzen Sog-Tricks, damit du länger bleibst: Autoplay, Endlos-Scroll, Streaks und Überraschungs-Belohnungen. Hier kannst du sie GEFAHRLOS erleben – ein Panel verrät dir live, welcher Trick gerade an dir zieht.'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: () => starte(true) }, '🌀 Mit vollem Sog starten'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => starte(false) }, '🧘 Ohne Sog starten (zum Vergleich)'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen('Video-Apps benutzen Sog-Tricks, damit du länger bleibst. Hier kannst du sie gefahrlos erleben. Ein Panel verrät dir, welcher Trick gerade an dir zieht.') }, '🔊 Vorlesen'))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin:0' }, '💡 Die „Videos“ hier sind nur Karten mit Fantasie-Titeln – es wird nichts geladen, nichts gemessen, nichts gespeichert.')));
}

function starte(mitSog) {
  aktiv = Object.fromEntries(MECHANIKEN.map((m) => [m.code, mitSog]));
  reihe = mischen(VIDEOS);
  angeschaut = 0;
  streak = 0;
  panelText = null;
  startZeit = Date.now();
  feedBildschirm();
}

function naechstesVideo() {
  angeschaut++;
  streak++;
  if (aktiv.glitzer && Math.random() < 0.4) {
    panelText = `✨ BONUS-Sterne! ${mechanik('glitzer').panel}`;
  } else if (aktiv.autoplay) {
    panelText = `🤖 ${mechanik('autoplay').panel}`;
  } else {
    panelText = null;
  }
  if (!aktiv.endlos && angeschaut >= OHNE_SOG_ENDE) return endeErreicht();
  feedBildschirm();
}

function feedBildschirm() {
  const video = reihe[angeschaut % reihe.length];
  const sogAn = Object.values(aktiv).some(Boolean);
  if (aktiv.autoplay) {
    autoplayTimer = setTimeout(naechstesVideo, 2600);
  }
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-untertitel', style: 'margin-top:0' }, `${sogAn ? '🌀 Voller Sog' : '🧘 Ohne Sog'} · Video ${angeschaut + 1}`),
      aktiv.streak && streak > 0 ? el('p', { style: 'font-weight:700;color:#b45309' }, `🔥 Serie: ${streak}! Nicht abreißen lassen!`) : '',
      el('div', { class: 'k-hinweis', style: 'text-align:center' },
        el('p', { style: 'margin:0;font-size:1.3rem;font-weight:600' }, video),
        el('p', { style: 'margin:0.25rem 0 0;font-size:0.85rem;color:#4b5563' }, '▶️ läuft …')),
      panelText ? el('div', { class: 'k-hinweis k-hinweis--falsch', style: 'margin-top:0.5rem' },
        el('p', { style: 'margin:0;font-size:0.9rem' }, `🔍 Sog-Panel: ${panelText}`)) : '',
      el('div', { class: 'k-antworten' },
        aktiv.autoplay
          ? el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => { clearTimeout(autoplayTimer); naechstesVideo(); } }, '⏭️ Gleich weiter (Autoplay läuft sowieso …)')
          : el('button', { class: 'k-knopf', onclick: naechstesVideo }, '▶️ Nächstes Video'),
        el('button', { class: 'k-knopf k-knopf--richtig', onclick: ausstieg }, '🚪 Ich steige aus'))));
}

function endeErreicht() {
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '🏁'),
      el('p', { style: 'text-align:center;font-weight:700' }, `Ende erreicht: ${angeschaut} Videos – das war's!`),
      el('p', { style: 'text-align:center' }, 'So fühlt sich eine ehrliche App an: Sie sagt dir, wann Schluss ist. Mit Endlos-Scroll hättest du diesen Bildschirm NIE gesehen.'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: ausstieg }, 'Weiter zur Auswertung ➡️'))));
}

function ausstieg() {
  const echtSek = Math.round((Date.now() - startZeit) / 1000);
  const optionen = [
    { text: 'unter einer halben Minute', sek: 20 },
    { text: 'ungefähr 1 Minute', sek: 60 },
    { text: 'ungefähr 2 Minuten', sek: 120 },
    { text: '3 Minuten oder mehr', sek: 200 },
  ];
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { style: 'font-weight:700;margin-top:0' }, '⏱️ Ohne auf eine Uhr zu schauen: Wie lange warst du gerade im Feed?'),
      el('div', { class: 'k-antworten' },
        ...optionen.map((o) =>
          el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => auswertung(o.sek, echtSek) }, o.text)))));
}

function auswertung(geschaetztSek, echtSek) {
  const ergebnis = bewerteSchaetzung(geschaetztSek, echtSek);
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, ergebnis.urteil === 'unterschaetzt' ? '🌀' : '🧭'),
      el('p', { style: 'text-align:center;font-weight:700' }, `Echte Zeit: ${formatSekunden(echtSek)} · ${angeschaut} Videos`),
      el('p', { style: 'text-align:center' }, ergebnis.satz)),
    el('section', { class: 'k-karte' },
      el('p', { style: 'font-weight:600;margin-top:0' }, 'Die 4 Sog-Tricks zum Merken:'),
      ...MECHANIKEN.map((m) => el('p', { style: 'margin:0.4rem 0' }, `${m.emoji} ${m.name}: ${m.lehre}`)),
      el('p', {}, '🚦 Und dein Gegen-Trick: Takt vorher planen – probier unsere Takt-Pause!'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(MECHANIKEN.map((m) => `${m.name}: ${m.lehre}`).join(' ')) }, '🔊 Vorlesen'),
        el('button', { class: 'k-knopf', onclick: startBildschirm }, '🔁 Nochmal (andere Einstellung probieren)'))));
}

startBildschirm();
