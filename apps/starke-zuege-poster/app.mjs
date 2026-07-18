// Poster „Drei starke Züge“ (docs/09 Ось H). Pro Themenfeld die beste
// Handlungsfolge aus den Szenario-Trainern, verdichtet auf drei Züge – als
// großes Poster (A3) für die Klassenzimmerwand. Das Gelernte bleibt sichtbar,
// auch wenn kein Gerät läuft. Politik docs/02: keine externen Anfragen,
// speichert nichts.
import { el, vorlesen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { posterText } from './poster.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const daten = await fetch('daten/poster.json').then((r) => r.json());
let aktiv = null;

function auswahl() {
  return el('section', { class: 'k-karte sz-nur-bildschirm' },
    el('p', { style: 'font-weight:600;margin-top:0' }, 'Poster wählen:'),
    el('div', { class: 'k-antworten' }, ...daten.poster.map((p) =>
      el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => { aktiv = p; render(); } }, `${p.emoji} ${p.titel}`))));
}

function posterEl(p) {
  return el('section', { class: 'k-karte sz-poster' },
    el('p', { class: 'sz-emoji' }, p.emoji),
    el('h2', { class: 'sz-titel' }, p.titel),
    el('p', { class: 'sz-unter' }, 'Drei starke Züge'),
    ...p.schritte.map((s) => el('div', { class: 'sz-zug' },
      el('div', { class: 'sz-nr' }, s.nr),
      el('div', {},
        el('p', { class: 'sz-zug-titel' }, s.zug),
        el('p', { class: 'sz-zug-text' }, s.text)))),
    el('p', { class: 'sz-merk' }, `„${p.merksatz}“`));
}

function render() {
  app.replaceChildren(
    el('h1', { class: 'k-titel sz-nur-bildschirm' }, '🖼️ Poster „Drei starke Züge“'),
    el('p', { class: 'k-untertitel sz-nur-bildschirm' }, 'Ein Poster pro Themenfeld für die Klassenwand – auf A3 drucken.'),
    auswahl(),
    aktiv ? posterEl(aktiv) : el('section', { class: 'k-karte sz-nur-bildschirm' }, el('p', { style: 'margin:0;color:#4b5563' }, 'Wähle oben ein Poster.')),
    aktiv ? el('section', { class: 'k-karte sz-nur-bildschirm' },
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: () => window.print() }, '🖨️ Poster drucken (A3)'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(posterText(aktiv)) }, '🔊 Vorlesen'))) : '',
    el('footer', { class: 'k-fuss sz-nur-bildschirm' },
      el('span', {}, 'für die Klasse · werbefrei · läuft offline · speichert nichts · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
}

render();
