// Schulstart-Begleiter: Checkliste mit Angeboten des Erwachsenen für den
// Schulstart. Geprüft werden die ANGEBOTE der Fachkraft (Raum, Material,
// Spiele, eigenes Handeln), nie ein Kind. Politik docs/02: keine externen
// Anfragen (CSP self und Netzwerk-Wächter), keine Speicherung auf dem Gerät;
// der Stand lebt nur im Speicher dieser Seite. Kein Score, keine Rangfolge
// (docs/02, Z. 141-146). Dünner DOM-Layer über der reinen Logik in logik.mjs.
import { el, lokaleStimme, vorlesen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import {
  pruefeKatalog, stand, setzeAuswahl, bilanzBereich, bilanzText, druckMarken,
  eigenentwurfsHinweis, bereinigeAltbestand,
} from './logik.mjs';

installiereNetzwerkWaechter();
bereinigeAltbestand(); // einmal beim Start: Altbestand entfernen, nie schreiben

const app = document.getElementById('app');
const datum = new Date().toLocaleDateString('de-DE');
let katalog = null;

/** Nur im Speicher dieser Seite: angebotId -> auswahlWert. Ohne Eintrag gilt „offen“. */
let auswahl = {};
/** angebotId -> { bereichId, knoepfe: [{el, wert}] } */
const zeilen = new Map();
/** bereichId -> { bereich, bilanzen: [el] } */
const bereiche = new Map();
let meldungEl = null;

function setzeMeldung(text, ok = true) {
  if (!meldungEl) return;
  meldungEl.className = `k-hinweis ${ok ? 'k-hinweis--richtig' : 'k-hinweis--falsch'}`;
  meldungEl.textContent = text;
  meldungEl.hidden = false;
}

// --- Zustand anzeigen (nur betroffene Teile aktualisieren) -------------------

function zeileRegistrieren(angebot, bereichId) {
  if (!zeilen.has(angebot.id)) {
    zeilen.set(angebot.id, { bereichId, knoepfe: [] });
  }
  return zeilen.get(angebot.id);
}

function zeileAktualisieren(id) {
  const z = zeilen.get(id);
  const aktuell = stand(auswahl, id);
  for (const k of z.knoepfe) {
    const gedrueckt = k.wert === aktuell;
    k.el.setAttribute('aria-pressed', String(gedrueckt));
    k.el.classList.toggle('k-knopf--neutral', !gedrueckt);
  }
}

function bilanzAktualisieren(bereichId) {
  const { bereich, bilanzen } = bereiche.get(bereichId);
  const text = bilanzText(bilanzBereich(bereich, auswahl));
  for (const b of bilanzen) b.textContent = text;
}

function waehle(angebotId, wert) {
  auswahl = setzeAuswahl(auswahl, angebotId, wert);
  zeileAktualisieren(angebotId);
  bilanzAktualisieren(zeilen.get(angebotId).bereichId);
}

function vorleseBereich(bereich) {
  // Nur eine Stimme, die auf dem Gerät liegt (localService). Sonst wird nicht vorgelesen,
  // weil die Standardstimme eines Browsers netzbasiert sein kann.
  const stimme = lokaleStimme('de-DE');
  if (stimme === undefined) {
    setzeMeldung('Die Stimmen des Geräts sind (noch) nicht verfügbar. Bitte gleich noch einmal tippen oder selbst vorlesen.', false);
    return;
  }
  if (!stimme) {
    setzeMeldung('Auf diesem Gerät gibt es keine Stimme, die ohne Netz läuft. Bitte selbst vorlesen.', false);
    return;
  }
  const text = `${bereich.name}. ${bereich.angebote.map((p) => p.text).join(' ')}`;
  vorlesen(text, 'de-DE', stimme);
}

// --- Bausteine ----------------------------------------------------------------

function kopfKarte() {
  return el('section', { class: 'k-karte' },
    el('div', { class: 'k-hinweis' },
      el('p', { style: 'margin:0;font-weight:600' }, 'Kein Kind wird erfasst, bewertet oder verglichen.')),
    el('p', { style: 'font-size:0.9rem' },
      'Geprüft werden die Angebote des Erwachsenen für den Schulstart: Raum, Material, Spiele und eigene Handlung. Jedes Angebot wird als ',
      el('strong', {}, 'angeboten'), ', ', el('strong', {}, 'noch offen'), ' oder ',
      el('strong', {}, 'trifft nicht zu'), ' markiert. Ohne Angabe gilt „noch offen“.'),
    el('p', { style: 'font-size:0.9rem' },
      'Je Bereich wird gezählt, wie viele Angebote angeboten sind (z. B. „angeboten: 3 von 6“). Eine Gesamtzahl über alle Bereiche oder Prozentwerte gibt es bewusst nicht.'),
    el('p', { style: 'font-size:0.9rem;margin-bottom:0' },
      'Jede Formulierung ist ein Eigenentwurf nach einem Merkmal. Die Kennung, z. B. sprache-1, steht unter jedem Angebot.'));
}

function angebotZeile(bereich, p) {
  const z = zeileRegistrieren(p, bereich.id);
  return el('div', { role: 'group', 'aria-label': p.text, style: 'padding:0.55rem 0;border-top:1px solid var(--k-rand)' },
    el('p', { style: 'margin:0 0 0.2rem;font-size:0.95rem' }, p.text),
    el('p', { class: 'k-kleingedruckt' }, eigenentwurfsHinweis(p.quelleMerkmal)),
    el('div', { style: 'display:flex;gap:0.4rem;flex-wrap:wrap' },
      ...katalog.auswahl.map((opt) => {
        const knopf = el('button', {
          class: 'k-knopf k-knopf--klein k-knopf--neutral',
          'aria-pressed': 'false',
          'aria-label': `${p.text} – ${opt.text}`,
          onclick: () => waehle(p.id, opt.id),
        }, opt.text);
        z.knoepfe.push({ el: knopf, wert: opt.id });
        return knopf;
      })));
}

function bereichKarte(bereich) {
  const bilanzEl = el('p', { style: 'margin:0.5rem 0 0;font-weight:600;font-size:0.95rem' });
  bereiche.get(bereich.id).bilanzen.push(bilanzEl);
  return el('section', { class: 'k-karte' },
    el('div', { style: 'display:flex;justify-content:space-between;align-items:flex-start;gap:0.5rem;flex-wrap:wrap' },
      el('h2', { style: 'margin:0;font-size:1.1rem' }, `${bereich.emoji} ${bereich.name}`),
      el('button', {
        class: 'k-knopf k-knopf--neutral k-knopf--klein',
        'aria-label': `Angebote im Bereich ${bereich.name} vorlesen`,
        onclick: () => vorleseBereich(bereich),
      }, '🔊 Vorlesen')),
    el('p', { style: 'margin:0.25rem 0 0;font-size:0.85rem;color:#4b5563' }, bereich.fokus),
    bilanzEl,
    ...bereich.angebote.map((p) => angebotZeile(bereich, p)));
}

function aktionenKarte() {
  return el('section', { class: 'k-karte' },
    el('h2', { style: 'margin-top:0;font-size:1.05rem' }, '🖨️ Druckbogen'),
    el('p', { style: 'font-size:0.9rem' },
      'Der Druckbogen zeigt alle Angebote mit ihren Kästchen und die Zählung je Bereich. Er enthält keinen Namen und keine Angaben zu Kindern.'),
    el('div', { class: 'k-antworten' },
      el('button', { class: 'k-knopf k-knopf--klein', onclick: () => window.print() }, '🖨️ Druckbogen drucken')));
}

function datenKarte() {
  return el('section', { class: 'k-karte' },
    el('h2', { style: 'margin-top:0;font-size:1.05rem' }, '🧹 Ihre Daten'),
    el('p', { style: 'font-size:0.9rem;margin-bottom:0' },
      'Diese Seite speichert nichts auf diesem Gerät. Die Angaben bleiben nur im Speicher dieser Seite und sind nach dem Neuladen weg. Eine frühere Fassung hat Angaben zu einzelnen Kindern gespeichert (Schlüssel „ssb.daten“); diese alten Einträge werden beim Öffnen einmal entfernt. Alte Sicherungsdateien (schulstart-begleiter-daten) werden nicht mehr eingelesen.'));
}

// --- Druckbogen (nur beim Drucken sichtbar) -----------------------------------

function druckZeile(p) {
  const marken = el('p', { class: 'k-druck-marken' }, druckMarken(katalog.auswahl, null).join('   '));
  return el('div', { class: 'k-druck-zeile' },
    el('p', { style: 'margin:0;font-size:0.95rem' }, p.text),
    el('p', { class: 'k-kleingedruckt' }, eigenentwurfsHinweis(p.quelleMerkmal)),
    marken);
}

function druckBogen() {
  return el('section', { class: 'k-karte k-nur-druck', 'aria-label': 'Druckbogen: Checkliste Schulstart-Angebote' },
    el('h2', { style: 'margin:0 0 0.3rem;font-size:1.3rem' }, 'Checkliste: Schulstart-Angebote des Erwachsenen'),
    el('p', { style: 'margin:0 0 0.3rem' }, `Stand: ${datum}`),
    el('p', { style: 'margin:0 0 0.6rem' }, 'Geprüft werden Raum, Material, Spiele und die Handlung der Fachkraft. Kein Kind wird erfasst oder bewertet.'),
    ...katalog.bereiche.map((bereich) => {
      return el('section', { class: 'k-druck-bereich' },
        el('h3', { style: 'margin:0;font-size:1.05rem' }, `${bereich.emoji} ${bereich.name}`),
        el('p', { style: 'margin:0;font-size:0.9rem' }, bereich.fokus),
        ...bereich.angebote.map((p) => druckZeile(p)));
    }),
    el('p', { class: 'k-druck-fuss' },
      'Merkmal-Kennungen (z. B. sprache-1) bezeichnen die Merkmale, auf denen die Angebote beruhen. Die Formulierungen sind Eigenentwürfe, keine Zitate.'));
}

// --- Render (einmal beim Start) -----------------------------------------------

function render() {
  meldungEl = el('div', { class: 'k-hinweis', role: 'status', hidden: '' });
  for (const b of katalog.bereiche) bereiche.set(b.id, { bereich: b, bilanzen: [] });
  const bildschirm = el('div', { class: 'k-nur-bildschirm' },
    el('h1', { class: 'k-titel' }, '🎒 Schulstart-Begleiter'),
    el('p', { class: 'k-untertitel' }, 'Schulstart-Angebote für pädagogische Fachkräfte'),
    meldungEl,
    kopfKarte(),
    ...katalog.bereiche.map(bereichKarte),
    aktionenKarte(),
    datenKarte(),
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werkzeug für Fachkräfte · werbefrei · keine Cloud, nichts wird auf dem Gerät gespeichert · '),
      el('a', { href: 'eltern.html' }, '🏛️ Info für Träger & Leitung'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
  app.replaceChildren(bildschirm, druckBogen());
  for (const id of zeilen.keys()) zeileAktualisieren(id);
  for (const id of bereiche.keys()) bilanzAktualisieren(id);
}

// --- Start ----------------------------------------------------------------------

try {
  katalog = await fetch('daten/indikatoren.json').then((r) => r.json());
} catch {
  katalog = null;
}
const katalogFehler = pruefeKatalog(katalog);
if (katalogFehler.length > 0) {
  app.replaceChildren(el('div', { class: 'k-hinweis k-hinweis--falsch' },
    el('p', { style: 'margin:0' }, `Datenfehler im Katalog: ${katalogFehler[0]}`)));
} else {
  render();
}
