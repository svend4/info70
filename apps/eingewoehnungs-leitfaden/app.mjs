// Eingewöhnungs-Leitfaden: vier Phasen der Eingewöhnung (Berliner/Münchener
// Modell), je Phase eine Checkliste eigener Handlungen der Fachkraft.
// Keine Kinderdaten, keine Bewertung von Kindern, nichts wird gespeichert
// (docs/02, Z. 141–146). Der Zustand liegt in einer Variable im Speicher der Seite.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { pruefeConfig, schluessel, bilanz, druckBlatt } from './logik.mjs';

installiereNetzwerkWaechter();

// Altbestand der früheren Fassung: beim Start nur entfernen, nie schreiben.
const ALTER_SCHLUESSEL = 'et.daten';

function bereinigeAltbestand() {
  try {
    localStorage.removeItem(ALTER_SCHLUESSEL);
  } catch {
    // Kein Zugriff auf den Speicher: dann gibt es auch nichts zu entfernen.
  }
}

bereinigeAltbestand();

const app = document.getElementById('app');

// Einziger Zustand der Seite: welche Handlungen abgehakt sind. Nicht gespeichert.
let erledigt = new Set();

async function ladeConfig() {
  const antwort = await fetch('daten/config.json');
  if (!antwort.ok) throw new Error(`HTTP ${antwort.status}`);
  return antwort.json();
}

let config = null;
let fehler = null;
try {
  config = await ladeConfig();
  fehler = pruefeConfig(config)[0] ?? null;
} catch {
  fehler = 'Die Leitfaden-Daten konnten nicht geladen werden.';
}

const knopfKlasse = (an) => `k-knopf ${an ? '' : 'k-knopf--neutral'}`.trim();

function handlungsKnopf(phase, handlung) {
  const s = schluessel(phase.id, handlung.id);
  const an = erledigt.has(s);
  return el('button', {
    type: 'button',
    class: knopfKlasse(an),
    style: 'width:100%;text-align:start;justify-content:flex-start',
    'aria-pressed': String(an),
    'aria-label': handlung.frage,
    'data-frage': s,
    onclick: () => umschalten(phase.id, handlung.id),
  }, `${an ? '☒' : '☐'} ${handlung.frage}`);
}

function druckInhalt(phase) {
  const blatt = druckBlatt(config, phase.id, erledigt);
  return [
    el('h2', {}, blatt.titel),
    el('p', {}, blatt.info),
    el('p', {}, el('strong', {}, 'Handlungen der Fachkraft (Eigenentwurf)')),
    el('ul', {}, ...blatt.punkte.map((p) => el('li', {}, `${p.erledigt ? '☒' : '☐'} ${p.frage}`))),
    el('p', {}, blatt.bilanz),
    el('p', { style: 'font-size:0.85rem' }, 'Der Bogen fragt nach Ihren eigenen Handlungen. Er enthält keine Angaben zu Kindern und bewertet keine Person.'),
  ];
}

// Nur die betroffene Handlung, die Bilanz und der Druckbogen dieser Phase werden
// aktualisiert. Die Seite wird nicht neu aufgebaut, damit der Fokus bleibt.
function aktualisiere(phaseId, handlungId) {
  const phase = config.phasen.find((p) => p.id === phaseId);
  const handlung = phase.handlungen.find((h) => h.id === handlungId);
  const s = schluessel(phaseId, handlungId);
  const an = erledigt.has(s);
  const knopf = app.querySelector(`[data-frage="${s}"]`);
  if (knopf) {
    knopf.setAttribute('aria-pressed', String(an));
    knopf.className = knopfKlasse(an);
    knopf.textContent = `${an ? '☒' : '☐'} ${handlung.frage}`;
  }
  const bilanzFeld = app.querySelector(`[data-bilanz="${phaseId}"]`);
  if (bilanzFeld) bilanzFeld.textContent = bilanz(phase, erledigt);
  const blatt = app.querySelector(`[data-druck="${phaseId}"]`);
  if (blatt) blatt.replaceChildren(...druckInhalt(phase));
}

function umschalten(phaseId, handlungId) {
  const s = schluessel(phaseId, handlungId);
  if (erledigt.has(s)) erledigt.delete(s);
  else erledigt.add(s);
  aktualisiere(phaseId, handlungId);
}

function phasenKarte(phase, nummer) {
  return el('section', { class: 'k-karte', 'aria-labelledby': `titel-${phase.id}` },
    el('h2', { id: `titel-${phase.id}`, style: 'margin-top:0;font-size:1.15rem' }, `${nummer}. ${phase.name}`),
    el('p', { style: 'margin:0.25rem 0 0.75rem' }, phase.info),
    el('p', { style: 'font-size:0.9rem;margin:0 0 0.4rem' }, el('strong', {}, 'Eigene Handlungen der Fachkraft (Eigenentwurf):')),
    el('ul', { style: 'list-style:none;margin:0;padding:0;display:grid;gap:0.4rem' },
      ...phase.handlungen.map((h) => el('li', {}, handlungsKnopf(phase, h)))),
    el('p', { 'data-bilanz': phase.id, style: 'font-size:0.95rem;font-weight:600;margin:0.75rem 0 0' }, bilanz(phase, erledigt)));
}

function hinweisKarte() {
  return el('section', { class: 'k-karte' },
    el('div', { class: 'k-hinweis' },
      el('p', { style: 'margin:0;font-weight:600' }, 'Der Leitfaden fragt nach Ihren eigenen Handlungen als Fachkraft – nicht nach einem Kind.')),
    el('p', { style: 'font-size:0.9rem;margin-bottom:0' }, 'Keine Bewertung, kein Vergleich. Die Haken werden nirgends gespeichert: Sie gelten nur, bis die Seite neu geladen oder geschlossen wird. Bitte keine Namen notieren.'));
}

function herkunftKarte() {
  return el('section', { class: 'k-karte' },
    el('h2', { style: 'margin-top:0;font-size:1.05rem' }, 'Herkunft'),
    el('p', { style: 'font-size:0.9rem;margin-bottom:0' }, config.herkunft));
}

function render() {
  const inhalt = [
    el('div', { class: 'k-bildschirm' },
      el('h1', { class: 'k-titel' }, '🌱 Eingewöhnungs-Leitfaden'),
      el('p', { class: 'k-untertitel' }, 'Vier Phasen, je eine Checkliste eigener Handlungen – für pädagogische Fachkräfte'),
      hinweisKarte(),
      ...config.phasen.map((p, i) => phasenKarte(p, i + 1)),
      herkunftKarte(),
      el('div', { class: 'k-antworten', style: 'margin:0.5rem 0' },
        el('button', { type: 'button', class: 'k-knopf k-knopf--neutral', onclick: () => globalThis.print?.() }, '🖨️ Vier Bogen drucken')),
      el('footer', { class: 'k-fuss' },
        el('span', {}, 'Werkzeug für Fachkräfte · werbefrei · keine Cloud – nichts wird gespeichert · '),
        el('a', { href: 'eltern.html' }, '🏛️ Info für Eltern, Träger & Leitung'), el('span', {}, ' · '),
        el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz'))),
    el('section', { class: 'k-druck', 'aria-label': 'Druckbogen: vier Checklisten' },
      ...config.phasen.map((p) => el('article', { class: 'k-druckbogen', 'data-druck': p.id }, ...druckInhalt(p)))),
  ];
  app.replaceChildren(...inhalt.filter(Boolean));
}

if (fehler) {
  app.replaceChildren(el('div', { class: 'k-hinweis k-hinweis--falsch' }, el('p', { style: 'margin:0' }, `Konfigurationsfehler: ${fehler}`)));
} else {
  render();
}
