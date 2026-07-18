// Barriere-Spürnasen (Kinder 8-12, docs/09 Nr. 154). Simulator: dieselbe
// Beispielseite mit/ohne Barrierefreiheits-Merkmale. Kinder schalten Kontrast,
// Schriftgröße, Vorlesen und Bildbeschreibung einzeln ein und sehen den
// Unterschied. Dünne DOM-Schicht über logik.mjs. Politik docs/02: keine
// externen Anfragen, werbefrei, Vorlesen.
import { el, vorlesen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { MERKMALE, istAn, bewertung, zaehleAktiv, allesAn } from './logik.mjs';

installiereNetzwerkWaechter();

const SCHLUESSEL = 'bsp.status';
const app = document.getElementById('app');

const lade = () => JSON.parse(localStorage.getItem(SCHLUESSEL) ?? '{}');
const speichere = (s) => localStorage.setItem(SCHLUESSEL, JSON.stringify(s));

// Der Beispiel-Text, den die Seite zeigt (auch Vorlage fürs Vorlesen).
const BEISPIEL_TITEL = 'Der kleine Igel sucht ein Zuhause';
const BEISPIEL_TEXT = 'Im Herbst sammelt der Igel Blätter für sein Nest. Er sucht einen sicheren Platz, wo er den Winter verschlafen kann.';
const BILD_BESCHREIBUNG = 'Ein Igel läuft durch bunte Herbstblätter.';

function beispielSeite(status) {
  const gutKontrast = istAn(status, 'kontrast');
  const grossSchrift = istAn(status, 'schrift');
  const hatVorlesen = istAn(status, 'vorlesen');
  const hatBild = istAn(status, 'bild');

  const farbe = gutKontrast ? 'color:#111;background:#fff' : 'color:#c9c9c9;background:#eee';
  const schrift = grossSchrift ? 'font-size:1.15rem;line-height:1.6' : 'font-size:0.62rem;line-height:1.15';

  const bild = el('div', { style: 'font-size:2.5rem;text-align:center;margin:0.3rem 0', role: 'img', 'aria-label': hatBild ? BILD_BESCHREIBUNG : '' }, '🦔🍂');
  const bildHinweis = el('p', { style: `${schrift};margin:0.1rem 0;font-style:italic` },
    hatBild ? `Bildbeschreibung: „${BILD_BESCHREIBUNG}“` : '(Dieses Bild hat keine Beschreibung – ein Screenreader würde es überspringen.)');

  const vorleseTaste = hatVorlesen
    ? el('button', { class: 'k-knopf k-knopf--klein', onclick: () => vorlesen(`${BEISPIEL_TITEL}. ${BEISPIEL_TEXT}. ${BILD_BESCHREIBUNG}`) }, '🔊 Vorlesen')
    : el('button', { class: 'k-knopf k-knopf--klein k-knopf--neutral', disabled: true, 'aria-disabled': 'true', title: 'Ohne Vorlese-Funktion' }, '🔇 kein Vorlesen');

  return el('div', { style: `border:2px solid var(--k-rand);border-radius:0.6rem;padding:0.8rem;${farbe}` },
    el('h3', { style: `${schrift};margin:0 0 0.3rem;font-weight:700` }, BEISPIEL_TITEL),
    bild,
    bildHinweis,
    el('p', { style: `${schrift};margin:0.2rem 0` }, BEISPIEL_TEXT),
    el('div', { style: 'margin-top:0.5rem' }, vorleseTaste));
}

function render() {
  const status = lade();
  const b = bewertung(status);

  const schalter = MERKMALE.map((m) => {
    const an = istAn(status, m.id);
    return el('div', { style: 'padding:0.4rem 0;border-top:1px solid var(--k-rand)' },
      el('div', { style: 'display:flex;gap:0.6rem;align-items:center;justify-content:space-between' },
        el('span', { style: 'font-weight:600' }, `${m.emoji} ${m.name}`),
        el('button', {
          class: `k-knopf k-knopf--klein${an ? '' : ' k-knopf--neutral'}`,
          role: 'switch', 'aria-checked': String(an), 'aria-label': `${m.name} ${an ? 'aus' : 'ein'}schalten`,
          onclick: () => { const s = lade(); s[m.id] = !an; speichere(s); render(); },
        }, an ? '✅ an' : '⬜ aus')),
      el('p', { style: 'margin:0.2rem 0 0;font-size:0.9rem;color:#4b5563' }, an ? m.ein : m.aus),
      el('details', { style: 'margin:0.2rem 0 0' },
        el('summary', { style: 'cursor:pointer;font-size:0.85rem;color:var(--k-blau-dunkel)' }, '💡 Warum hilft das?'),
        el('p', { style: 'margin:0.2rem 0 0;font-size:0.9rem' }, m.warum)));
  });

  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🔍 Barriere-Spürnasen'),
    el('p', { class: 'k-untertitel' }, 'Mach die Seite für ALLE Kinder nutzbar – schalte die Merkmale ein!'),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0' }, 'Das ist eine Beispielseite. Probiere die Schalter aus und sieh, wie sie sich verändert:'),
      beispielSeite(status)),
    el('section', { class: 'k-karte' },
      el('p', { style: `margin-top:0;font-weight:700;color:${b.fertig ? 'var(--k-gruen-dunkel, #166534)' : '#374151'}` }, `${b.aktiv} von ${b.gesamt} Merkmalen an`),
      el('div', { class: 'k-fortschritt', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': b.gesamt, 'aria-valuenow': b.aktiv },
        el('div', { style: `width:${Math.round((b.aktiv / b.gesamt) * 100)}%` })),
      el('p', { style: 'margin-bottom:0' }, b.text),
      el('button', { class: 'k-knopf k-knopf--klein k-knopf--neutral', style: 'margin-top:0.4rem', onclick: () => vorlesen(b.text) }, '🔊 Vorlesen')),
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '🔧 Barrierefreiheits-Merkmale'),
      ...schalter),
    el('section', { class: 'k-karte' },
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: () => { speichere(allesAn()); render(); } }, '✨ Alles einschalten'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => { localStorage.removeItem(SCHLUESSEL); render(); } }, '↩️ Zurücksetzen'))),
    el('footer', { class: 'k-fuss' },
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'),
      el('span', {}, ' · werbefrei · läuft offline · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
}

render();
