// Sprachbrücken-Impulskarten (für Kita-Teams, docs/10 Top-30 Nr. 18).
// Dreisprachige Gesprächs-Impulskarten (de/uk/ru + Aussprachehilfe) für
// alltagsintegrierte Sprachbildung – filterbar nach Situation, druckbar zum
// Aufhängen an Garderobe, Esstisch & Bauecke. Politik docs/02: keine externen
// Anfragen, nichts wird gespeichert.
import { el, vorlesen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { pruefeKarten, kartenFuer, vorleseText } from './logik.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const daten = await fetch('daten/karten.json').then((r) => r.json());
const situationVon = new Map(daten.situationen.map((s) => [s.id, s]));

let filter = null; // null = alle

function kartenKarte(k) {
  const s = situationVon.get(k.situation);
  return el('section', { class: 'k-karte sbi-karte' },
    el('p', { style: 'margin:0 0 0.2rem;font-size:0.8rem;color:#4b5563' }, `${s.emoji} ${s.name}`),
    el('p', { style: 'margin:0;font-weight:700;font-size:1.25rem' }, k.de),
    el('p', { style: 'margin:0.4rem 0 0', lang: 'uk' }, `🇺🇦 ${k.uk} `, el('small', { style: 'color:#4b5563' }, `(${k.ukLat})`)),
    el('p', { style: 'margin:0.2rem 0 0', lang: 'ru' }, `🕊️ ${k.ru} `, el('small', { style: 'color:#4b5563' }, `(${k.ruLat})`)),
    el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein sbi-nur-bildschirm', style: 'margin-top:0.4rem', onclick: () => vorlesen(vorleseText(k)) }, '🔊 Vorlesen'));
}

function render() {
  const karten = kartenFuer(daten, filter);
  const tippVon = filter ? situationVon.get(filter)?.tipp : null;

  app.replaceChildren(...[
    el('h1', { class: 'k-titel' }, '🗣️ Sprachbrücken-Impulskarten'),
    el('p', { class: 'k-untertitel sbi-nur-bildschirm' }, 'Alltagsintegrierte Sprachbildung – dreisprachig de/uk/ru, zum Aufhängen'),
    el('section', { class: 'k-karte sbi-nur-bildschirm' },
      el('p', { style: 'margin-top:0;font-size:0.92rem' }, daten.methode),
      el('p', { style: 'margin:0;font-size:0.85rem;color:#4b5563' }, daten.hinweis)),
    el('section', { class: 'k-karte sbi-nur-bildschirm' },
      el('h2', { style: 'margin-top:0;font-size:1.05rem' }, 'Situation wählen'),
      el('div', { class: 'k-antworten', role: 'radiogroup', 'aria-label': 'Situation' },
        el('button', { class: `k-knopf k-knopf--klein ${filter === null ? '' : 'k-knopf--neutral'}`, role: 'radio', 'aria-checked': String(filter === null), onclick: () => { filter = null; render(); } }, '⭐ Alle'),
        ...daten.situationen.map((s) => el('button', {
          class: `k-knopf k-knopf--klein ${filter === s.id ? '' : 'k-knopf--neutral'}`,
          role: 'radio', 'aria-checked': String(filter === s.id),
          onclick: () => { filter = s.id; render(); },
        }, `${s.emoji} ${s.name}`))),
      el('div', { class: 'k-antworten', style: 'margin-top:0.4rem' },
        el('button', { class: 'k-knopf k-knopf--klein', onclick: () => window.print() }, `🖨️ ${karten.length} Karte${karten.length === 1 ? '' : 'n'} drucken`))),
    tippVon ? el('section', { class: 'k-karte sbi-nur-bildschirm', style: 'background:#eff6ff' },
      el('p', { style: 'margin:0;font-size:0.92rem' }, `💡 ${tippVon}`)) : null,
    ...karten.map(kartenKarte),
    el('footer', { class: 'k-fuss sbi-nur-bildschirm' },
      el('span', {}, 'Werkzeug für Kita-Teams · werbefrei · nichts wird gespeichert · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')),
  ].filter(Boolean));
}

const fehler = pruefeKarten(daten);
if (fehler.length) {
  app.replaceChildren(el('div', { class: 'k-hinweis k-hinweis--falsch' }, el('p', { style: 'margin:0' }, `Datenfehler: ${fehler[0]}`)));
} else {
  render();
}
