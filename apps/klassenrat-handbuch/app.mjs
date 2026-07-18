// Klassenrat-Handbuch (für LEHRKRÄFTE, docs/09 Ось B / Nr. 187). Schritt-für-
// Schritt-Anleitung, mit Mitmach-Arena und Kinderrat einen wöchentlichen
// Klassenrat zu führen: Rollenkarten, Ablaufplan, Klassen-Koffer-Workflow für
// Protokolle ohne Server. Druckbar, speichert NICHTS. Politik docs/02: keine
// externen Anfragen.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const d = await fetch('daten/handbuch.json').then((r) => r.json());

function karte(titel, ...kinder) {
  return el('section', { class: 'k-karte' }, el('h2', { style: 'margin-top:0;font-size:1.1rem' }, titel), ...kinder);
}

function render() {
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, `🏛️ ${d.titel}`),
    el('p', { class: 'k-untertitel' }, `${d.untertitel} · ${d.zielgruppe}`),
    el('section', { class: 'k-karte kh-nur-bildschirm' },
      el('p', { style: 'margin:0' }, 'Druckfertige Anleitung für den Klassenrat. '),
      el('button', { class: 'k-knopf k-knopf--klein', style: 'margin-top:0.4rem', onclick: () => window.print() }, '🖨️ Handbuch drucken')),
    karte('🎯 Wozu ein Klassenrat?', el('p', { style: 'margin:0' }, d.zweck)),
    karte('👥 Rollenkarten',
      ...d.rollen.map((r) => el('p', { style: 'margin:0.35rem 0' },
        el('strong', {}, `${r.emoji} ${r.rolle}: `), r.aufgabe))),
    karte('🕒 Ablauf einer Sitzung',
      ...d.ablauf.map((a) => el('div', { style: 'padding:0.35rem 0;border-bottom:1px solid var(--k-rand)' },
        el('p', { style: 'font-weight:700;margin:0' }, `${a.nr}. ${a.phase}`),
        el('p', { style: 'margin:0.15rem 0 0' }, a.text)))),
    karte('🧳 Protokolle ohne Server (Klassen-Koffer)',
      el('p', { style: 'margin:0' }, d.koffer),
      el('div', { class: 'k-antworten kh-nur-bildschirm', style: 'margin-top:0.4rem' },
        ...d.apps.map((a) => el('a', { class: 'k-knopf k-knopf--klein k-knopf--neutral', style: 'text-decoration:none', href: `../${a}/` }, `▶️ ${a}`)))),
    karte('💡 Tipps aus der Praxis', el('ul', {}, ...d.tipps.map((t) => el('li', { style: 'margin:0.3rem 0' }, t)))),
    karte('🎓 Bezug', el('p', { style: 'margin:0;font-size:0.95rem' }, d.bezug)),
    el('footer', { class: 'k-fuss kh-nur-bildschirm' },
      el('span', {}, 'für Lehrkräfte · OER (AGPL) · werbefrei · läuft offline · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
}

render();
