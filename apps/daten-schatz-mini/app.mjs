// Daten-Schatz Mini (6-8, docs/09 Ось A / Nr. 165). Einfache 6-8-Variante:
// große Piktogramme, Vorlesen, nur zwei Antworten. Das Kind sortiert: „Darf
// jeder wissen“ oder „Bleibt geheim“. Erste Datensparsamkeit. Politik docs/02:
// keine externen Anfragen, nur Bestwert lokal.
import { el, vorlesen, mischen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { boot as bootAnzeige } from '../../packages/kinder-ui/js/anzeige.mjs';
import { loescheDaten } from '../../packages/kinder-ui/js/daten-karte.mjs';
import { hilfeInsel, hilfeInselKnopf } from '../../packages/kinder-ui/js/hilfe-insel.mjs';

installiereNetzwerkWaechter();
bootAnzeige();

const REKORD = 'dsm.rekord';
const app = document.getElementById('app');
const daten = await fetch('daten/sachen.json').then((r) => r.json());

let runde = [];
let index = 0;
let punkte = 0;

function zeige(...knoten) {
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🗝️ Daten-Schatz Mini'),
    el('p', { class: 'k-untertitel' }, 'Was darf jeder wissen? Was bleibt geheim?'),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Ohne Werbung · ohne Anmeldung · alles bleibt auf diesem Gerät · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
  app.querySelector('button')?.focus();
}

function start() {
  const rekord = Number(localStorage.getItem(REKORD) ?? 0);
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '🔒🌍'),
      el('p', {}, 'Manche Sachen darf jeder wissen. Zum Beispiel deine Lieblings-Farbe. Andere Sachen bleiben geheim. Zum Beispiel dein Passwort. Sortiere mit!'),
      rekord > 0 ? el('p', {}, `Dein Bestwert: ${rekord} von ${daten.sachen.length} ⭐`) : '',
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starteRunde }, '▶️ Los geht’s!'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen('Manche Sachen darf jeder wissen. Andere Sachen bleiben geheim. Sortiere mit!') }, '🔊 Vorlesen'))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin:0' }, '🧹 Hier gibt es keine Werbung. Du musst dich nicht anmelden.'),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => { loescheDaten(REKORD); start(); } }, 'Meine Daten löschen')),
    el('section', { class: 'k-karte' },
      hilfeInselKnopf(() => zeige(hilfeInsel({ zurueck: start })))));
}

function starteRunde() {
  runde = mischen(daten.sachen);
  index = 0;
  punkte = 0;
  frage();
}

function frage() {
  const s = runde[index];
  vorlesen(`${s.sache}. Darf das jeder wissen? Oder bleibt es geheim?`);
  zeige(
    el('section', { class: 'k-karte', style: 'text-align:center' },
      el('p', { class: 'k-untertitel' }, `${index + 1} von ${runde.length}`),
      el('p', { style: 'font-size:4rem;margin:0.3rem 0' }, s.piktogramm),
      el('p', { style: 'font-weight:700;font-size:1.3rem' }, s.sache),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`${s.sache}. Darf das jeder wissen? Oder bleibt es geheim?`) }, '🔊 Nochmal vorlesen')),
    el('section', { class: 'k-karte' },
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: () => antworte(s, false) }, '🌍 Darf jeder wissen'),
        el('button', { class: 'k-knopf', onclick: () => antworte(s, true) }, '🔒 Bleibt geheim'))));
}

function antworte(s, geheimGewaehlt) {
  const richtig = geheimGewaehlt === s.geheim;
  if (richtig) punkte++;
  const titel = richtig ? 'Richtig! 🎉' : 'Fast! Schau mal:';
  vorlesen(`${titel} ${s.erklaerung}`);
  zeige(
    el('section', { class: 'k-karte', style: 'text-align:center' },
      el('p', { style: 'font-size:3rem;margin:0.2rem 0' }, s.piktogramm),
      el('div', { class: `k-hinweis ${richtig ? 'k-hinweis--richtig' : 'k-hinweis--falsch'}` },
        el('p', { style: 'font-weight:700;margin-top:0' }, titel),
        el('p', { style: 'margin-bottom:0' }, s.erklaerung)),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(s.erklaerung) }, '🔊 Nochmal vorlesen'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: weiter }, index + 1 < runde.length ? 'Weiter ➡️' : 'Fertig 🏁'))));
}

function weiter() {
  index++;
  if (index < runde.length) frage();
  else ende();
}

function ende() {
  const rekord = Math.max(punkte, Number(localStorage.getItem(REKORD) ?? 0));
  localStorage.setItem(REKORD, String(rekord));
  const alle = punkte === runde.length;
  vorlesen(`Super gemacht! Du hast ${punkte} von ${runde.length} richtig sortiert.`);
  zeige(
    el('section', { class: 'k-karte', style: 'text-align:center' },
      el('p', { class: 'k-gross' }, alle ? '🏆' : '🌟'),
      el('p', { style: 'font-weight:700' }, `Super gemacht! Du hast ${punkte} von ${runde.length} richtig sortiert.`),
      el('p', {}, `Bestwert: ${rekord}`),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starteRunde }, '🔁 Noch einmal'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: start }, '🏠 Zum Start'))));
}

start();
