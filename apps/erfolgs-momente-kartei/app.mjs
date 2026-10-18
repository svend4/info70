// Erfolgs-Momente-Kartei (für Fachkräfte): Karten wählen, gewählte drucken.
// Gedruckt wird nur die Vorschau; sie zeigt den Text aus logik.mjs.
// Politik docs/02: keine externen Anfragen (NetzwerkWaechter), keine Speicherung,
// keine Eingabefelder, keine Namenszeile auf dem Papier.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { pruefeKarten, auswahlUmschalten, druckKarten } from './logik.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
let daten = null;
let auswahl = [];

const alleKarten = () => [...daten.karten, daten.quelle];
const alleIds = () => alleKarten().map((k) => k.id);

function auswahlKnopf(karte) {
  const an = auswahl.includes(karte.id);
  return el('button', {
    class: `k-knopf k-knopf--klein ${an ? '' : 'k-knopf--neutral'}`,
    role: 'checkbox',
    'aria-checked': String(an),
    onclick: () => { auswahl = auswahlUmschalten(auswahl, karte.id); render(); },
  }, `${an ? '✓ ' : ''}${karte.titel}`);
}

// Jede Zeile der Karte ist ein Text aus logik.mjs; hier wird nichts ergänzt.
function karteElement(k) {
  if (k.art === 'quelle') {
    return el('article', { class: 'k-karte ek-karte' },
      el('h2', { class: 'ek-kartentitel' }, k.titel),
      ...k.eintraege.map((e) => el('section', { class: 'ek-eintrag' },
        el('p', { class: 'ek-kopf' }, e.kopf),
        el('p', { class: 'ek-text' }, e.text),
        ...e.zitate.map((z) => el('p', { class: 'ek-zitat' }, z)),
        el('p', { class: 'ek-fuss' }, e.uebertragung))),
      el('p', { class: 'ek-fuss' }, k.fuss));
  }
  return el('article', { class: 'k-karte ek-karte' },
    el('h2', { class: 'ek-kartentitel' }, k.titel),
    el('p', { class: 'ek-label' }, k.rollenLabel),
    el('p', { class: 'ek-text' }, k.rolle),
    el('p', { class: 'ek-label' }, k.impulsLabel),
    ...k.impulse.map((t) => el('p', { class: 'ek-impuls' }, t)),
    el('p', { class: 'ek-fuss' }, k.fuss));
}

function druckBereich() {
  const karten = druckKarten(daten, auswahl);
  if (!karten.length) {
    return el('p', { class: 'k-hinweis ek-nur-bildschirm' },
      'Noch keine Karte ausgewählt. Die Vorschau erscheint, sobald eine Karte gewählt ist.');
  }
  return el('section', { class: 'ek-druckbereich', 'aria-label': 'Druckvorschau' },
    el('h2', { class: 'ek-nur-bildschirm' }, 'Vorschau: so wird gedruckt'),
    ...karten.map(karteElement));
}

function render() {
  const keineAuswahl = auswahl.length === 0;
  app.replaceChildren(
    el('h1', { class: 'k-titel ek-nur-bildschirm' }, 'Erfolgs-Momente-Kartei'),
    el('p', { class: 'k-untertitel ek-nur-bildschirm' },
      'Druckkarten für Fachkräfte: gemeinsame Tätigkeiten der ganzen Gruppe'),
    el('section', { class: 'k-karte ek-nur-bildschirm' },
      el('p', { style: 'margin-top:0;font-size:0.92rem' }, daten.hinweis),
      el('h2', { style: 'margin:0.4rem 0 0.2rem;font-size:1rem' }, 'Karten auswählen'),
      el('div', { class: 'k-antworten', role: 'group', 'aria-label': 'Karten zum Drucken' },
        ...alleKarten().map(auswahlKnopf)),
      el('div', { style: 'display:flex;gap:0.5rem;flex-wrap:wrap;margin-top:0.6rem' },
        el('button', {
          class: 'k-knopf k-knopf--neutral k-knopf--klein',
          onclick: () => { auswahl = alleIds(); render(); },
        }, 'Alle auswählen'),
        el('button', {
          class: 'k-knopf k-knopf--neutral k-knopf--klein',
          onclick: () => { auswahl = []; render(); },
        }, 'Auswahl leeren')),
      el('div', { class: 'k-antworten' },
        el('button', {
          class: 'k-knopf',
          disabled: keineAuswahl ? '' : null,
          onclick: () => window.print(),
        }, 'Ausgewählte Karten drucken')),
      keineAuswahl ? el('p', { style: 'margin:0.4rem 0 0;font-size:0.9rem' }, 'Bitte mindestens eine Karte auswählen.') : null),
    druckBereich(),
    el('footer', { class: 'k-fuss ek-nur-bildschirm' },
      el('span', {}, 'Werkzeug für Fachkräfte · nichts wird gespeichert · keine Anmeldung · keine Verbindung nach außen · '),
      el('a', { href: '../../impressum.html' }, 'Impressum und Datenschutz')),
  );
}

async function start() {
  try {
    const antwort = await fetch('daten/karten.json');
    if (!antwort.ok) throw new Error(`HTTP ${antwort.status}`);
    daten = await antwort.json();
  } catch {
    app.replaceChildren(el('div', { class: 'k-hinweis k-hinweis--falsch' },
      el('p', { style: 'margin:0' }, 'Die Karten konnten nicht geladen werden. Bitte die Seite neu laden.')));
    return;
  }
  const fehler = pruefeKarten(daten);
  if (fehler.length) {
    app.replaceChildren(el('div', { class: 'k-hinweis k-hinweis--falsch' },
      el('p', { style: 'margin:0' }, `Datenfehler: ${fehler[0]}`)));
    return;
  }
  render();
}

start();
