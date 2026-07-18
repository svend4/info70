// Vorlese-Kompass 1-3 (für Eltern): dialogisch Vorlesen in 7 Schritten,
// Altersfenster 1–3 und ein Kanon von Buchtypen (keine konkreten Titel).
// Praleska docs/10 (Top-30 Nr. 14). Politik docs/02: keine externen Anfragen.
import { el, vorlesen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { pruefeKompass, methodeText } from './logik.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const daten = await fetch('daten/kompass.json').then((r) => r.json());
let aktivStufe = daten.altersstufen[0].id;

function methodeKarte() {
  return el('section', { class: 'k-karte' },
    el('div', { style: 'display:flex;justify-content:space-between;align-items:center;gap:0.5rem' },
      el('h2', { style: 'margin:0;font-size:1.1rem' }, `📖 ${daten.methode.name}`),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(methodeText(daten)) }, '🔊 Vorlesen')),
    el('ol', { style: 'margin:0.4rem 0 0;padding-inline-start:1.3rem' },
      ...daten.methode.schritte.map((s) => el('li', { style: 'margin:0.25rem 0' }, s))));
}

function stufenKarte() {
  const stufe = daten.altersstufen.find((a) => a.id === aktivStufe) ?? daten.altersstufen[0];
  const tabs = el('div', { class: 'k-antworten', role: 'tablist', 'aria-label': 'Alter wählen' },
    ...daten.altersstufen.map((a) => el('button', {
      class: `k-knopf k-knopf--klein ${a.id === aktivStufe ? '' : 'k-knopf--neutral'}`,
      role: 'tab', 'aria-selected': String(a.id === aktivStufe),
      onclick: () => { aktivStufe = a.id; render(); },
    }, a.name)));
  return el('section', { class: 'k-karte' },
    el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '🗓️ Was passt zu welchem Alter?'),
    tabs,
    el('p', { style: 'margin:0.4rem 0 0.2rem;font-weight:600' }, stufe.name),
    el('p', { style: 'margin:0' }, el('strong', {}, 'Was: '), stufe.was),
    el('p', { style: 'margin:0.2rem 0 0' }, el('strong', {}, 'Tipp: '), stufe.tipp),
    el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', style: 'margin-top:0.4rem', onclick: () => vorlesen(`${stufe.name}. ${stufe.was}. Tipp: ${stufe.tipp}`) }, '🔊 Vorlesen'));
}

function kanonKarte() {
  return el('section', { class: 'k-karte' },
    el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '📚 Welche Bücher? (kostenlos aus der Bibliothek)'),
    ...daten.kanon.map((k) => el('div', { style: 'padding:0.4rem 0;border-top:1px solid var(--k-rand)' },
      el('p', { style: 'margin:0;font-weight:600' }, `${k.emoji} ${k.art}`),
      el('p', { style: 'margin:0.15rem 0 0;font-size:0.92rem;color:#374151' }, k.warum))));
}

function render() {
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🧭 Vorlese-Kompass'),
    el('p', { class: 'k-untertitel' }, 'Gut vorlesen von 1 bis 3 – Sprache und Nähe schenken (für Eltern)'),
    el('section', { class: 'k-karte' }, el('p', { style: 'margin:0;font-size:0.95rem' }, daten.hinweis)),
    methodeKarte(),
    stufenKarte(),
    kanonKarte(),
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werkzeug für Eltern · werbefrei · keine Datenerhebung · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
}

const fehler = pruefeKompass(daten);
if (fehler.length) {
  app.replaceChildren(el('div', { class: 'k-hinweis k-hinweis--falsch' }, el('p', { style: 'margin:0' }, `Datenfehler: ${fehler[0]}`)));
} else {
  render();
}
