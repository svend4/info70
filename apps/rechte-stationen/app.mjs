// Stationenlernen „Deine Rechte, dein Netz“ (für LEHRKRÄFTE, docs/09 Ось B /
// Nr. 186). Druckbare Unterrichtseinheit (2 Doppelstunden) mit vier Stationen
// (Schutz, Förderung, Beteiligung, digital) rund um die Apps des Baukastens.
// Reines Nachschlage-/Druckwerkzeug, speichert NICHTS. Politik docs/02: keine
// externen Anfragen.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const d = await fetch('daten/stationen.json').then((r) => r.json());

function karte(titel, ...kinder) {
  return el('section', { class: 'k-karte' }, el('h2', { style: 'margin-top:0;font-size:1.1rem' }, titel), ...kinder);
}

function render() {
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, `🗺️ ${d.titel}`),
    el('p', { class: 'k-untertitel' }, `${d.zielgruppe} · ${d.dauer}`),
    el('section', { class: 'k-karte rs-nur-bildschirm' },
      el('p', { style: 'margin:0' }, 'Druckfertige Stationen-Einheit für Lehrkräfte. '),
      el('button', { class: 'k-knopf k-knopf--klein', style: 'margin-top:0.4rem', onclick: () => window.print() }, '🖨️ Einheit drucken')),
    karte('🎯 Lernziele', el('ul', {}, ...d.lernziele.map((z) => el('li', { style: 'margin:0.3rem 0' }, z)))),
    karte('🧭 Vier Stationen',
      ...d.stationen.map((s) => el('div', { style: 'padding:0.5rem 0;border-bottom:1px solid var(--k-rand)' },
        el('p', { style: 'font-weight:700;margin:0' }, `Station ${s.nr}: ${s.bereich} – ${s.titel}`),
        el('p', { style: 'margin:0.2rem 0;font-size:0.9rem;color:#4b5563' }, `Apps: ${s.apps.join(', ')} · ${s.artikel}`),
        el('p', { style: 'margin:0.2rem 0 0' }, s.aufgabe),
        el('div', { class: 'k-antworten rs-nur-bildschirm', style: 'margin-top:0.3rem' },
          ...s.apps.map((a) => el('a', { class: 'k-knopf k-knopf--klein k-knopf--neutral', style: 'text-decoration:none', href: `../${a}/` }, `▶️ ${a}`)))))),
    karte('🖼️ Sicherung: Rechte-Plakat', el('p', { style: 'margin:0' }, d.plakat)),
    karte('🎓 Kompetenz-Bezug', el('p', { style: 'margin:0' }, d.kompetenzen)),
    karte('⚠️ Hinweise für die Lehrkraft', el('ul', {}, ...d.hinweise.map((h) => el('li', { style: 'margin:0.3rem 0' }, h)))),
    el('footer', { class: 'k-fuss rs-nur-bildschirm' },
      el('span', {}, 'für Lehrkräfte · OER (AGPL) · werbefrei · läuft offline · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
}

render();
