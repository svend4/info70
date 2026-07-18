// Arbeitsblatt-Werkstatt in Leichter Sprache (für LEHRKRÄFTE / Inklusion,
// docs/09 Ось E). Zu jedem Stundenentwurf ein Arbeitsblatt in Leichter Sprache:
// große Piktogramme, kurze Sätze, Vorlese-Funktion (Web Speech der kinder-ui)
// und Druckansicht. BFSG/EAA. Speichert nichts, keine externen Anfragen.
import { el, vorlesen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { vorleseText, pruefeLeichteSprache } from './logik.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const daten = await fetch('daten/arbeitsblaetter.json').then((r) => r.json());
// nur regelkonforme Blätter anzeigen (Sicherheitsnetz)
const blaetter = daten.blaetter.filter((b) => pruefeLeichteSprache(b).length === 0);
let aktiv = null;

function uebersicht() {
  return el('section', { class: 'k-karte ls-nur-bildschirm' },
    el('p', { style: 'font-weight:600;margin-top:0' }, 'Wähle ein Arbeitsblatt in Leichter Sprache:'),
    el('div', { class: 'k-antworten' },
      ...blaetter.map((b) => el('button', { class: 'k-knopf', style: 'font-size:1.05rem', onclick: () => { aktiv = b; render(); } },
        `${b.piktogramm} ${b.titel}`))));
}

function blattAnsicht(b) {
  return el('section', { class: 'k-karte' },
    el('div', { style: 'text-align:center' },
      el('p', { style: 'font-size:3rem;margin:0' }, b.piktogramm),
      el('h2', { style: 'margin:0.2rem 0;font-size:1.6rem' }, b.titel)),
    el('div', { style: 'margin-top:0.6rem' },
      ...b.begriffe.map((x) => el('div', { style: 'display:flex;gap:0.6rem;align-items:center;padding:0.4rem 0;border-bottom:1px solid var(--k-rand)' },
        el('span', { style: 'font-size:2rem' }, x.piktogramm),
        el('span', {}, el('strong', {}, x.wort + ': '), x.erklaerung)))),
    el('ul', { style: 'font-size:1.15rem;line-height:1.6;margin-top:0.6rem' },
      ...b.saetze.map((s) => el('li', { style: 'margin:0.35rem 0' }, s))),
    b.aufgabe ? el('p', { style: 'font-size:1.15rem;background:#f1f5f9;border-radius:0.5rem;padding:0.6rem' }, el('strong', {}, '✏️ Aufgabe: '), b.aufgabe) : '',
    el('div', { class: 'ls-nur-bildschirm', style: 'display:flex;gap:0.4rem;flex-wrap:wrap;margin-top:0.6rem' },
      el('button', { class: 'k-knopf', onclick: () => { if (!vorlesen(vorleseText(b))) alert('Vorlesen wird von diesem Browser nicht unterstützt.'); } }, '🔊 Vorlesen'),
      el('button', { class: 'k-knopf k-knopf--klein k-knopf--neutral', onclick: () => window.print() }, '🖨️ Drucken'),
      el('a', { class: 'k-knopf k-knopf--klein k-knopf--neutral', style: 'text-decoration:none', href: `../${b.bezug}/` }, '📖 Zum Stundenentwurf'),
      el('button', { class: 'k-knopf k-knopf--klein k-knopf--neutral', onclick: () => { aktiv = null; render(); } }, '↩️ Zurück')));
}

function render() {
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🧩 Arbeitsblätter in Leichter Sprache'),
    el('p', { class: 'k-untertitel ls-nur-bildschirm' }, 'Kurze Sätze, Bilder und Vorlesen – für alle Kinder (BFSG).'),
    aktiv ? blattAnsicht(aktiv) : uebersicht(),
    el('footer', { class: 'k-fuss ls-nur-bildschirm' },
      el('span', {}, 'für Inklusion · werbefrei · läuft offline · Leichte Sprache & Vorlesen (BFSG) · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
}

render();
