// Meilenstein-Begleiter 1. Lebensjahr (für Eltern, docs/10 Praleska Nr. 4).
// Beobachtungshilfe angelehnt an U3–U6: Meilensteine abhaken, Gesprächs-
// Vorbereitung fürs Arzt-Gespräch erzeugen. KEINE Diagnose, KEINE Kind-Daten,
// keine Namen. Politik docs/02: keine externen Anfragen; nur localStorage.
import { el, vorlesen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { pruefeKatalog, zaehleFenster, bericht } from './logik.mjs';

installiereNetzwerkWaechter();

const SCHLUESSEL = 'mb.beobachtet';
const app = document.getElementById('app');
const katalog = await fetch('daten/meilensteine.json').then((r) => r.json());

let aktivFenster = katalog.fenster[0].id;

const lade = () => JSON.parse(localStorage.getItem(SCHLUESSEL) ?? '{}');
const speichere = (b) => localStorage.setItem(SCHLUESSEL, JSON.stringify(b));

function toggle(id) {
  const b = lade();
  if (b[id]) delete b[id]; else b[id] = true;
  speichere(b);
  render();
}

function render() {
  const beobachtet = lade();
  const fenster = katalog.fenster.find((f) => f.id === aktivFenster) ?? katalog.fenster[0];

  const tabs = el('div', { class: 'k-antworten', role: 'tablist', 'aria-label': 'U-Untersuchung wählen', style: 'margin-bottom:0.4rem' },
    ...katalog.fenster.map((f) => {
      const z = zaehleFenster(f, beobachtet);
      return el('button', {
        class: `k-knopf k-knopf--klein ${f.id === aktivFenster ? '' : 'k-knopf--neutral'}`,
        role: 'tab', 'aria-selected': String(f.id === aktivFenster),
        onclick: () => { aktivFenster = f.id; render(); },
      }, `${f.name.split(' · ')[0]} (${z.beobachtet}/${z.gesamt})`);
    }));

  const liste = fenster.meilensteine.map((m) => {
    const an = !!beobachtet[m.id];
    return el('div', { style: 'padding:0.5rem 0;border-top:1px solid var(--k-rand)' },
      el('button', {
        class: `k-knopf k-knopf--klein ${an ? '' : 'k-knopf--neutral'}`,
        role: 'checkbox', 'aria-checked': String(an), style: 'text-align:start;width:100%',
        onclick: () => toggle(m.id),
      }, `${an ? '☑' : '☐'} ${m.text}`),
      el('small', { style: 'color:#4b5563' }, m.bereich));
  });

  const berichtsFeld = el('textarea', {
    readonly: true,
    style: 'width:100%;min-height:12rem;font-family:monospace;font-size:0.8rem;border:2px solid var(--k-rand);border-radius:0.5rem;padding:0.5rem',
    'aria-label': 'Vorbereitung fürs Arzt-Gespräch',
  });
  berichtsFeld.value = bericht(katalog, beobachtet);

  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🍼 Meilenstein-Begleiter'),
    el('p', { class: 'k-untertitel' }, 'Entwicklung im 1. Lebensjahr beobachten – für Eltern'),
    el('section', { class: 'k-karte' },
      el('div', { class: 'k-hinweis' }, el('p', { style: 'margin:0;font-weight:600' }, 'Keine Diagnose und kein Ersatz für die U-Untersuchungen. Zeitangaben sind Richtwerte – jedes Kind ist anders.')),
      el('p', { style: 'font-size:0.9rem;margin-bottom:0' }, 'Haken Sie ab, was Sie schon beobachtet haben. Daraus entsteht eine Gesprächs-Vorbereitung für die Kinderärztin bzw. den Kinderarzt (gelbes U-Heft). Es werden keine Namen oder Daten des Kindes gespeichert.')),
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '🗓️ U-Untersuchung'),
      tabs,
      el('p', { style: 'margin:0.2rem 0 0;font-weight:600' }, fenster.name),
      el('div', { class: 'k-antworten', style: 'margin-top:0.3rem' },
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`${fenster.name}. ${fenster.meilensteine.map((m) => m.text).join(' ')}`) }, '🔊 Vorlesen')),
      ...liste),
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '📝 Vorbereitung fürs Arzt-Gespräch'),
      berichtsFeld,
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf k-knopf--klein', onclick: (ev) => { berichtsFeld.select(); navigator.clipboard?.writeText(berichtsFeld.value); ev.target.textContent = '✔️ Kopiert!'; } }, '📋 Kopieren'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => { if (globalThis.confirm?.('Alle Haken auf diesem Gerät löschen?')) { localStorage.removeItem(SCHLUESSEL); render(); } } }, '🧹 Zurücksetzen'))),
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werkzeug für Eltern · keine Diagnose · Daten bleiben auf diesem Gerät · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
}

const fehler = pruefeKatalog(katalog);
if (fehler.length) {
  app.replaceChildren(el('div', { class: 'k-hinweis k-hinweis--falsch' }, el('p', { style: 'margin:0' }, `Datenfehler: ${fehler[0]}`)));
} else {
  render();
}
