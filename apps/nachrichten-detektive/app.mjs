// Nachrichten-Detektive: Quiz zur Nachrichtenkompetenz (8-12 Jahre).
// Politik: keine externen Anfragen, keine Konten, Daten nur in localStorage.
import { el, vorlesen, mischen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';

installiereNetzwerkWaechter();

const REKORD_SCHLUESSEL = 'nd.rekord';
const app = document.getElementById('app');

const daten = await fetch('daten/fragen.json').then((r) => r.json());

let fragen = [];
let index = 0;
let punkte = 0;

function zeige(...knoten) {
  app.replaceChildren(...knoten);
  app.querySelector('button')?.focus();
}

function fuss() {
  return el('footer', { class: 'k-fuss' },
    el('span', {}, 'Werbefrei · ohne Anmeldung · Daten bleiben auf diesem Gerät · '),
    el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz'));
}

function vorlesenKnopf(text) {
  return el('button', {
    class: 'k-knopf k-knopf--neutral k-knopf--klein',
    'aria-label': 'Text vorlesen',
    onclick: () => vorlesen(text),
  }, '🔊 Vorlesen');
}

function startBildschirm() {
  const rekord = Number(localStorage.getItem(REKORD_SCHLUESSEL) ?? 0);
  zeige(
    el('h1', { class: 'k-titel' }, '🕵️ Nachrichten-Detektive'),
    el('p', { class: 'k-untertitel' }, 'Echt oder Fake? Finde es heraus!'),
    el('section', { class: 'k-karte' },
      el('p', {}, `Du bekommst ${daten.fragen.length} Fälle. Prüfe Meldungen, Bilder und Tricks wie ein echter Detektiv.`),
      rekord > 0 ? el('p', {}, `Dein Rekord: ${rekord} von ${daten.fragen.length} ⭐`) : '',
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starteRunde }, '▶️ Ermittlung starten'),
        vorlesenKnopf('Nachrichten-Detektive. Echt oder Fake? Finde es heraus! Drücke auf: Ermittlung starten.'))),
    el('section', { class: 'k-karte' },
      el('p', {}, '🧹 Hier gibt es keine Werbung und keine Anmeldung. Gespeichert wird nur dein Rekord – auf diesem Gerät.'),
      el('button', {
        class: 'k-knopf k-knopf--neutral k-knopf--klein',
        onclick: () => { localStorage.clear(); startBildschirm(); },
      }, 'Meine Daten löschen')),
    fuss());
}

function starteRunde() {
  fragen = mischen(daten.fragen);
  index = 0;
  punkte = 0;
  frageBildschirm();
}

function frageBildschirm() {
  const f = fragen[index];
  const fortschritt = el('div', { class: 'k-fortschritt', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': fragen.length, 'aria-valuenow': index },
    el('div', { style: `width:${(index / fragen.length) * 100}%` }));
  const kopf = el('p', { class: 'k-untertitel' }, `Fall ${index + 1} von ${fragen.length} · ${f.kategorie}`);

  if (f.typ === 'echt-fake') {
    const text = `Meldung: ${f.meldung}. Ist das echt oder fake?`;
    zeige(
      el('h1', { class: 'k-titel' }, '🕵️ Dein Fall'),
      kopf, fortschritt,
      el('section', { class: 'k-karte' },
        el('p', { style: 'font-weight:600' }, `„${f.meldung}“`),
        vorlesenKnopf(text),
        el('div', { class: 'k-antworten' },
          el('button', { class: 'k-knopf', onclick: () => antworte(f, 'echt') }, '✅ Echt'),
          el('button', { class: 'k-knopf', onclick: () => antworte(f, 'fake') }, '❌ Fake'))),
      fuss());
  } else {
    // Antworten mischen, richtige Antwort über ihren Text wiederfinden
    const richtige = f.antworten[f.korrekt];
    const gemischt = mischen(f.antworten);
    const text = `${f.frage} Die Möglichkeiten sind: ${gemischt.join('. Oder: ')}`;
    zeige(
      el('h1', { class: 'k-titel' }, '🕵️ Dein Fall'),
      kopf, fortschritt,
      el('section', { class: 'k-karte' },
        el('p', { style: 'font-weight:600' }, f.frage),
        vorlesenKnopf(text),
        el('div', { class: 'k-antworten' },
          ...gemischt.map((a) =>
            el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => antworte(f, a === richtige) }, a)))),
      fuss());
  }
}

function antworte(f, wahl) {
  const richtig = f.typ === 'echt-fake' ? wahl === f.korrekt : wahl === true;
  if (richtig) punkte++;
  const titel = richtig ? 'Richtig! 🎉' : 'Nicht ganz …';
  zeige(
    el('h1', { class: 'k-titel' }, '🕵️ Auflösung'),
    el('section', { class: 'k-karte' },
      el('div', { class: `k-hinweis ${richtig ? 'k-hinweis--richtig' : 'k-hinweis--falsch'}` },
        el('p', { style: 'font-weight:700;margin-top:0' }, titel),
        el('p', { style: 'margin-bottom:0' }, f.erklaerung)),
      vorlesenKnopf(`${titel} ${f.erklaerung}`),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: weiter }, index + 1 < fragen.length ? 'Nächster Fall ➡️' : 'Zum Ergebnis 🏁'))),
    fuss());
}

function weiter() {
  index++;
  if (index < fragen.length) frageBildschirm();
  else endBildschirm();
}

function endBildschirm() {
  const rekord = Math.max(punkte, Number(localStorage.getItem(REKORD_SCHLUESSEL) ?? 0));
  localStorage.setItem(REKORD_SCHLUESSEL, String(rekord));
  const rang = [...daten.raenge].reverse().find((r) => punkte >= r.ab) ?? daten.raenge[0];
  zeige(
    el('h1', { class: 'k-titel' }, 'Ermittlung abgeschlossen!'),
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, rang.emoji),
      el('p', { class: 'k-untertitel', style: 'font-weight:700' }, rang.titel),
      el('p', { style: 'text-align:center' }, `${punkte} von ${fragen.length} Fällen gelöst · Rekord: ${rekord}`),
      vorlesenKnopf(`Du hast ${punkte} von ${fragen.length} Fällen gelöst. Dein Rang: ${rang.titel}`),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starteRunde }, '🔁 Noch einmal'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: startBildschirm }, '🏠 Zum Start'))),
    fuss());
}

startBildschirm();

// Offline-Fähigkeit nach dem ersten Laden
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
