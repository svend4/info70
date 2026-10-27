// Erste-Wörter-Lesewerkstatt (5-7): kurze Lese-Sessions in drei Stufen –
// Vokale hören, Silben hören, lautgetreue Wörter lesen (Bild-Selbstkontrolle
// mit Silbenbögen). Runde ist bewusst kurz (Zeitbegrenzung), danach Pause.
// Praleska docs/10 (Top-30 Nr. 25). Das Kind wird nicht bewertet. Politik docs/02:
// keine Texteingabe, keine externen Anfragen, speichert NICHTS.
import { el, vorlesen, mischen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { boot as bootAnzeige } from '../../packages/kinder-ui/js/anzeige.mjs';
import { pruefeMaterial, hoerOptionen, bildOptionen, silbenTeilen } from './logik.mjs';

installiereNetzwerkWaechter();
bootAnzeige();

// Alter Schlüssel aus früheren Fassungen: einmal beim Start entfernen.
try { localStorage.removeItem('lese.rekord'); } catch {}

const app = document.getElementById('app');
const daten = await fetch('daten/material.json').then((r) => r.json());

let aufgaben = [];
let index = 0;
let beantwortet = false;

function sprich(text) {
  vorlesen(text, 'de-DE');
}

function baueRunde() {
  const vokale = mischen(daten.vokale).slice(0, 2).map((v) => ({ typ: 'vokal', ziel: v }));
  const silben = mischen(daten.silben).slice(0, 3).map((s) => ({ typ: 'silbe', ziel: s }));
  const woerter = mischen(daten.woerter).slice(0, 3).map((w) => ({ typ: 'wort', wort: w }));
  return [...vokale, ...silben, ...woerter]; // Stufen-Reihenfolge: leicht → schwer
}

function zeige(...knoten) {
  app.replaceChildren(...[
    el('h1', { class: 'k-titel' }, '🔤 Lesewerkstatt'),
    el('p', { class: 'k-untertitel' }, 'Erste Buchstaben, Silben und Wörter'),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · kurze Runden · nichts wird gespeichert · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')),
  ].filter(Boolean));
  app.querySelector('button')?.focus();
}

function start() {
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '🔤'),
      el('p', {}, 'Eine kleine Lese-Runde: erst Buchstaben hören, dann Silben, dann echte Wörter lesen. Acht Aufgaben – dann ist Pause!'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: () => { aufgaben = baueRunde(); index = 0; frage(); } }, '▶️ Los geht’s'))));
}

function frage() {
  beantwortet = false;
  const a = aufgaben[index];
  const kopf = el('p', { class: 'k-untertitel' }, `Aufgabe ${index + 1} von ${aufgaben.length}`);

  if (a.typ === 'vokal' || a.typ === 'silbe') {
    const vorrat = a.typ === 'vokal' ? daten.vokale : daten.silben;
    const optionen = mischen(hoerOptionen(a.ziel, vorrat).map((text, i) => ({ text, richtig: i === 0 })));
    zeige(
      el('section', { class: 'k-karte' },
        kopf,
        el('p', { class: 'k-gross' }, '👂'),
        el('p', { style: 'font-weight:700;font-size:1.2em;text-align:center' },
          a.typ === 'vokal' ? 'Welchen Buchstaben hörst du?' : 'Welche Silbe hörst du?'),
        el('div', { class: 'k-antworten' },
          el('button', { class: 'k-knopf', onclick: () => sprich(a.ziel) }, '🔊 Anhören')),
        el('p', { style: 'text-align:center;font-size:0.85rem;color:#4b5563' }, 'Du kannst so oft hören, wie du magst.'),
        el('div', { class: 'k-antworten' },
          ...optionen.map((o) => el('button', { class: 'k-knopf k-knopf--neutral', style: 'font-size:1.6rem;letter-spacing:2px', onclick: () => antworte(a, o.richtig) }, o.text)))));
  } else {
    const optionen = mischen(bildOptionen(a.wort, daten.woerter));
    const silben = silbenTeilen(a.wort.wort);
    zeige(
      el('section', { class: 'k-karte' },
        kopf,
        el('p', { style: 'text-align:center;font-size:2.2rem;font-weight:800;letter-spacing:4px;margin:0.4rem 0 0' }, a.wort.wort),
        el('p', { style: 'text-align:center;font-size:1rem;color:#1e40af;margin:0 0 0.4rem', 'aria-label': `In Silben: ${silben.join(', ')}` }, silben.join(' ⌣ ')),
        el('p', { style: 'font-weight:700;text-align:center' }, 'Lies das Wort. Welches Bild passt?'),
        el('div', { class: 'k-antworten' },
          ...optionen.map((o) => el('button', { class: 'k-knopf k-knopf--neutral', style: 'font-size:2.2rem', 'aria-label': o.richtig ? 'richtiges Bild' : 'Bild', onclick: () => antworte(a, o.richtig) }, o.emoji))),
        el('div', { class: 'k-antworten' },
          el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => sprich(silben.join(', ')) }, '🔊 Silben anhören'))));
  }
}

function antworte(a, richtig) {
  if (beantwortet) return;
  beantwortet = true;
  const letzte = index + 1 >= aufgaben.length;
  const loesung = a.typ === 'wort' ? `${a.wort.wort} – ${a.wort.emoji}` : a.ziel;
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, richtig ? '👍' : '💭'),
      el('div', { class: `k-hinweis${richtig ? ' k-hinweis--richtig' : ''}` },
        el('p', { style: 'font-weight:700;margin-top:0' }, richtig ? 'Super gelesen!' : 'Fast!'),
        el('p', { style: 'margin-bottom:0;font-size:1.3rem;text-align:center' }, loesung)),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => sprich(a.typ === 'wort' ? a.wort.wort : a.ziel) }, '🔊 Nochmal hören'),
        el('button', { class: 'k-knopf', onclick: () => { index++; if (index < aufgaben.length) frage(); else ende(); } }, letzte ? 'Fertig 🏁' : 'Weiter ➡️'))));
}

function ende() {
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '🏁'),
      el('p', { style: 'font-weight:700;font-size:1.2em;text-align:center' }, 'Ende der Runde'),
      el('p', { style: 'text-align:center' }, '👉 Jetzt ist Lese-Pause. Deine Augen haben gut gearbeitet – erzähl jemandem, welche Wörter du gelesen hast!'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: start }, '🏠 Zum Start'))));
}

const fehler = pruefeMaterial(daten);
if (fehler.length) {
  app.replaceChildren(el('div', { class: 'k-hinweis k-hinweis--falsch' }, el('p', { style: 'margin:0' }, `Datenfehler: ${fehler[0]}`)));
} else {
  start();
}
