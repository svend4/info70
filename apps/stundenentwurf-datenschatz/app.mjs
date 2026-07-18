// Stundenentwurf (für LEHRKRÄFTE): druckbare Doppelstunde (90 Min) rund um
// eine App des Baukastens – Lernziele, Ablauf mit Phasen und Zeiten,
// Arbeitsblatt-Impulse und Lehrkraft-Hinweise. Reines Nachschlage-/Druck-
// werkzeug, speichert NICHTS. Politik docs/02: keine externen Anfragen.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const stunde = await fetch('daten/stunde.json').then((r) => r.json());
const gesamt = stunde.ablauf.reduce((s, a) => s + a.minuten, 0);

function render() {
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, `📖 ${stunde.titel}`),
    el('p', { class: 'k-untertitel' }, `${stunde.untertitel} · ${stunde.zielgruppe} · ${gesamt} Minuten`),
    el('section', { class: 'k-karte st-nur-bildschirm' },
      el('p', { style: 'margin:0' }, 'Druckfertige Doppelstunde für Lehrkräfte. Nutzt die App '),
      el('a', { class: 'k-knopf k-knopf--klein', style: 'text-decoration:none', href: `../${stunde.app}/` }, stunde.appName),
      el('button', { class: 'k-knopf k-knopf--klein k-knopf--neutral', style: 'margin-left:0.4rem', onclick: () => window.print() }, '🖨️ Stundenentwurf drucken')),
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '🎯 Lernziele'),
      el('ul', {}, ...stunde.lernziele.map((z) => el('li', { style: 'margin:0.3rem 0' }, z)))),
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '🕒 Ablauf (90 Minuten)'),
      ...stunde.ablauf.map((a) => el('div', { style: 'padding:0.4rem 0;border-bottom:1px solid var(--k-rand)' },
        el('div', { style: 'display:flex;justify-content:space-between;gap:0.5rem' },
          el('span', { style: 'font-weight:600' }, `${a.phase}`),
          el('span', { style: 'color:#4b5563' }, `${a.minuten} min`)),
        el('p', { style: 'margin:0.2rem 0 0' }, a.text)))),
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '📝 Arbeitsblatt / Sicherung'),
      el('ul', {}, ...stunde.arbeitsblatt.map((x) => el('li', { style: 'margin:0.3rem 0' }, x)))),
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '⚠️ Hinweise für die Lehrkraft'),
      el('ul', {}, ...stunde.hinweise.map((x) => el('li', { style: 'margin:0.3rem 0' }, x)))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin:0;font-size:0.9rem;color:#4b5563' }, `Bezug: ${stunde.bezug}. Offen lizenziert (AGPL/OER-tauglich), komplett offline, keine Datenspeicherung.`)),
    el('footer', { class: 'k-fuss st-nur-bildschirm' },
      el('span', {}, 'für Lehrkräfte · werbefrei · läuft offline · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
}

render();
