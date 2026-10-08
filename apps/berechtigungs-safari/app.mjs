// Berechtigungs-Safari: Familien-Schnitzeljagd durch die App-Rechte auf dem
// ECHTEN Handy (Eltern + Kind, 8-12). Zu jeder Berechtigung (Mikrofon,
// Standort, Kontakte ...) erklaert die App kindgerecht, was sie bedeutet;
// die Familie schaut selbst in den Einstellungen nach und entscheidet
// "Braucht die App das wirklich?" - mit Detektiv-Punkten fuer entdeckte
// Datenkraken. Diese App liest NICHTS vom Geraet aus (reine Anleitung).
// Politik docs/02: keine externen Anfragen; Fortschritt nur lokal.
import { el, vorlesen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { hilfeInsel, hilfeInselKnopf } from '../../packages/kinder-ui/js/hilfe-insel.mjs';

installiereNetzwerkWaechter();

const SCHLUESSEL = 'safari.fund';
const app = document.getElementById('app');
const daten = await fetch('daten/berechtigungen.json').then((r) => r.json());

const lade = () => JSON.parse(localStorage.getItem(SCHLUESSEL) ?? '{}');
const speichere = (f) => localStorage.setItem(SCHLUESSEL, JSON.stringify(f));
const punkte = () => Object.values(lade()).reduce((s, n) => s + (Number(n) || 0), 0);

function zeige(...knoten) {
  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🧭 Berechtigungs-Safari'),
    el('p', { class: 'k-untertitel' }, 'Auf Daten-Safari durch dein echtes Handy – gemeinsam mit einem Erwachsenen.'),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Für Familien · liest nichts vom Gerät · Daten bleiben auf diesem Gerät · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
  app.querySelector('button')?.focus();
}

function render() {
  const fund = lade();
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0' }, 'Apps fragen nach „Berechtigungen“: Mikrofon, Standort, Kontakte … Manche brauchen das – manche gar nicht (das sind die „Datenkraken“). Geht die Safari zusammen durch und schaut auf einem echten Handy in den Einstellungen nach.'),
      el('div', { class: 'k-hinweis', style: 'margin:0' },
        el('p', { style: 'margin:0;font-size:0.9rem' }, `🔎 ${daten.findenHinweis}`)),
      el('p', { style: 'margin:0.75rem 0 0;font-weight:700' }, `🏆 Datenkraken gefunden: ${punkte()}`)),
    ...daten.stationen.map((s) => stationKarte(s, fund[s.code] ?? 0)),
    el('section', { class: 'k-karte k-hinweis--richtig' },
      el('p', { style: 'margin:0' }, `✅ ${daten.abschluss}`)),
    el('section', { class: 'k-karte' },
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => { localStorage.removeItem(SCHLUESSEL); render(); } }, '🧹 Safari zurücksetzen')),
    el('section', { class: 'k-karte' },
      hilfeInselKnopf(() => zeige(hilfeInsel({ zurueck: render })))));
}

function stationKarte(s, gefunden) {
  const setze = (n) => { const f = lade(); f[s.code] = Math.max(0, n); speichere(f); render(); };
  return el('section', { class: 'k-karte' },
    el('h2', { style: 'margin-top:0;font-size:1.15rem' }, `${s.emoji} ${s.name}`),
    el('p', { style: 'margin:0.25rem 0' }, el('strong', {}, 'Was heißt das? '), s.was),
    el('p', { style: 'margin:0.25rem 0;color:#15803d' }, s.brauchtWer),
    el('p', { style: 'margin:0.25rem 0;color:#b91c1c' }, s.verdaechtig),
    el('p', { style: 'margin:0.5rem 0 0.25rem;font-weight:600' }, `🕵️ ${s.frage}`),
    el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => vorlesen(`${s.name}. ${s.was} ${s.frage}`) }, '🔊 Vorlesen'),
    el('div', { style: 'display:flex;align-items:center;gap:0.5rem;margin-top:0.5rem' },
      el('span', { style: 'font-size:0.9rem' }, 'Wie viele Apps hatten das unnötig?'),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', 'aria-label': 'weniger', onclick: () => setze(gefunden - 1) }, '➖'),
      el('span', { style: 'min-width:1.5rem;text-align:center;font-weight:700' }, String(gefunden)),
      el('button', { class: 'k-knopf k-knopf--klein', 'aria-label': 'eine gefundene Datenkrake', onclick: () => setze(gefunden + 1) }, '➕')));
}

render();
