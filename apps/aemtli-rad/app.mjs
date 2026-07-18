// Ämtli-Rad für Klassendienste (Schule, 6-8 und 8-12, docs/09 Nr. 204). Ein
// nachvollziehbar fairer Rotationsalgorithmus verteilt die Klassendienste
// wöchentlich neu und gibt einen druckbaren Wochenplan aus. Der Algorithmus
// wird kindgerecht erklärt (Transparenz). Politik docs/02: keine externen
// Anfragen; die Klassenliste bleibt lokal und ist löschbar.
import { el, vorlesen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { STANDARD_DIENSTE, zuteilung, baueWochenplan } from './logik.mjs';

installiereNetzwerkWaechter();

const SCHLUESSEL = 'aemtli.cfg';
const app = document.getElementById('app');

const lade = () => ({ kinder: [], dienste: [...STANDARD_DIENSTE], woche: 0, ...JSON.parse(localStorage.getItem(SCHLUESSEL) ?? '{}') });
const speichere = (c) => localStorage.setItem(SCHLUESSEL, JSON.stringify(c));

function render() {
  const cfg = lade();
  const zt = zuteilung(cfg.kinder, cfg.dienste, cfg.woche);

  const kinderFeld = el('textarea', { style: 'width:100%;min-height:4rem;padding:0.5rem;border:2px solid var(--k-rand);border-radius:0.5rem', 'aria-label': 'Kinder (Vornamen/Spitznamen, eine pro Zeile)', placeholder: 'Ada\nBo\nCem\n…' });
  kinderFeld.value = cfg.kinder.join('\n');
  kinderFeld.addEventListener('input', () => { const c = lade(); c.kinder = kinderFeld.value.split('\n').map((s) => s.trim()).filter(Boolean); speichere(c); render(); });

  const diensteFeld = el('textarea', { style: 'width:100%;min-height:4rem;padding:0.5rem;border:2px solid var(--k-rand);border-radius:0.5rem', 'aria-label': 'Dienste (einer pro Zeile)' });
  diensteFeld.value = cfg.dienste.join('\n');
  diensteFeld.addEventListener('input', () => { const c = lade(); c.dienste = diensteFeld.value.split('\n').map((s) => s.trim()).filter(Boolean); speichere(c); render(); });

  const planKarten = el('div', {},
    ...zt.map(({ dienst, kind }) => el('div', { class: 'aemtli-zeile', style: 'display:flex;justify-content:space-between;gap:0.5rem;padding:0.4rem 0.2rem;border-bottom:1px solid var(--k-rand)' },
      el('span', { style: 'font-weight:600' }, dienst),
      el('span', {}, kind ?? '—'))));

  const woche = () => lade().woche;
  const setzeWoche = (w) => { const c = lade(); c.woche = ((w % Math.max(1, c.kinder.length)) + Math.max(1, c.kinder.length)) % Math.max(1, c.kinder.length); if (!c.kinder.length) c.woche = Math.max(0, w); speichere(c); render(); };

  app.replaceChildren(
    el('h1', { class: 'k-titel aemtli-nur-bildschirm' }, '🎡 Ämtli-Rad'),
    el('p', { class: 'k-untertitel aemtli-nur-bildschirm' }, 'Klassendienste fair verteilen – jede Woche rückt das Rad weiter'),
    el('section', { class: 'k-karte aemtli-nur-bildschirm' },
      el('p', { style: 'font-weight:600;margin-top:0' }, '👧 Kinder (Vornamen oder Spitznamen, eine pro Zeile)'),
      kinderFeld,
      el('p', { style: 'font-weight:600' }, '🧹 Dienste (einer pro Zeile)'),
      diensteFeld,
      el('p', { style: 'font-size:0.85rem;color:#4b5563;margin-bottom:0' }, 'Nur Spitznamen/Vornamen verwenden. Die Liste bleibt auf diesem Gerät und ist unten löschbar.')),
    el('section', { class: 'k-karte' },
      el('div', { class: 'aemtli-nur-bildschirm', style: 'display:flex;gap:0.4rem;align-items:center;justify-content:center;margin-bottom:0.5rem' },
        el('button', { class: 'k-knopf k-knopf--klein k-knopf--neutral', onclick: () => setzeWoche(woche() - 1) }, '◀︎'),
        el('span', { style: 'font-weight:700' }, `Woche ${cfg.woche + 1}`),
        el('button', { class: 'k-knopf k-knopf--klein k-knopf--neutral', onclick: () => setzeWoche(woche() + 1) }, '▶︎ nächste')),
      el('h2', { style: 'margin:0 0 0.3rem;font-size:1.1rem;text-align:center' }, `🎡 Klassendienste – Woche ${cfg.woche + 1}`),
      cfg.kinder.length ? planKarten : el('p', { style: 'color:#4b5563;text-align:center' }, 'Trage oben Kinder ein, dann verteilt das Rad die Dienste.')),
    el('section', { class: 'k-karte aemtli-nur-bildschirm' },
      el('details', {},
        el('summary', { style: 'cursor:pointer;font-weight:600' }, '🤔 Wie ist das fair?'),
        el('p', { style: 'margin:0.4rem 0 0' }, 'Das Rad würfelt nicht: Jede Woche rückt jeder Dienst um ein Kind weiter. Nach einer Runde hatte jede*r jeden Dienst genau einmal. Weil die Regel klar ist, kann jede*r nachrechnen – so ist Fairness eine Regel, kein Zufall.'),
        el('button', { class: 'k-knopf k-knopf--klein k-knopf--neutral', style: 'margin-top:0.4rem', onclick: () => vorlesen('Das Rad würfelt nicht. Jede Woche rückt jeder Dienst um ein Kind weiter. Nach einer Runde hatte jedes Kind jeden Dienst. Fairness ist eine Regel, kein Zufall.') }, '🔊 Vorlesen'))),
    el('section', { class: 'k-karte aemtli-nur-bildschirm' },
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: () => window.print() }, '🖨️ Wochenplan drucken'),
        el('button', { class: 'k-knopf k-knopf--klein', onclick: (ev) => { navigator.clipboard?.writeText(baueWochenplan(cfg.kinder, cfg.dienste, cfg.woche)); ev.target.textContent = '✔️'; } }, '📋 Kopieren'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => { localStorage.removeItem(SCHLUESSEL); render(); } }, '🧹 Klassenliste löschen'))),
    el('footer', { class: 'k-fuss aemtli-nur-bildschirm' },
      el('span', {}, 'für die Schule · werbefrei · läuft offline · Liste bleibt auf diesem Gerät · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
}

render();
