// Wetter- und Jahreszeiten-Forscher (5-7, auch als Kita-Morgenkreis):
// tägliches Wetterprotokoll mit Wenn-dann-Beobachtung, Rückblick über vier
// Wochen und Jahreszeiten-Merkmalen zum Suchen.
// Praleska docs/10 (Ko-Nutzung Nr. 5).
//
// Die Planer-Engine dient hier als Naturbeobachtungs-Tagebuch: Gezählt wird
// das Wetter, nie das Kind. Deshalb sind Statistiken erlaubt – sie sagen
// etwas über den Himmel aus, nicht über Verhalten. Gespeichert werden nur
// die letzten 28 Tage, löschbar. Politik docs/02: keine externen Anfragen.
//
// Ein Klick baut die Seite NICHT neu auf: #app ist eine aria-live-Region,
// ein Komplettaustausch würde dem Screenreader alles erneut vorlesen.
import { el, vorlesen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { boot as bootAnzeige } from '../../packages/kinder-ui/js/anzeige.mjs';
import {
  TAGE_IM_RUECKBLICK, datumsSchluessel, letzteTage, beschneide,
  jahreszeitFuer, zaehleWetter, haeufigstesWetter, anzahlEintraege, pruefeDaten,
} from './logik.mjs';

installiereNetzwerkWaechter();
bootAnzeige();

const SPEICHER = 'wetter.tagebuch';
const LOESCH_KNOPF = 'alles-loeschen';
const app = document.getElementById('app');
const daten = await fetch('daten/wetter.json').then((r) => r.json());
const wetterVon = (id) => daten.wetter.find((w) => w.id === id) ?? null;

let tage = lade();
let wetterKnoepfe = new Map();
let zellen = new Map();
let beobachtungBox = null;
let statusZeile = null;
let bilanzBox = null;
let fenster = [];

function lade() {
  try {
    return beschneide(JSON.parse(localStorage.getItem(SPEICHER) || '{}'), new Date());
  } catch {
    return {};
  }
}

function sichere() {
  tage = beschneide(tage, new Date());
  localStorage.setItem(SPEICHER, JSON.stringify(tage));
}

const heuteSchluessel = () => datumsSchluessel(new Date());
const heutigesWetter = () => tage[heuteSchluessel()]?.wetter ?? null;

function setzeWetter(id) {
  const heute = heuteSchluessel();
  // Nochmal derselbe Knopf = Eintrag zurücknehmen.
  if (tage[heute]?.wetter === id) {
    const { [heute]: weg, ...rest } = tage;
    tage = rest;
  } else {
    tage = { ...tage, [heute]: { wetter: id } };
  }
  sichere();
  aktualisiere();
}

/** Nur die Knoten anfassen, die sich durch den Klick ändern. */
function aktualisiere() {
  const gewaehlt = heutigesWetter();
  for (const [id, knopf] of wetterKnoepfe) {
    const an = gewaehlt === id;
    knopf.className = `k-knopf ${an ? '' : 'k-knopf--neutral'}`;
    knopf.setAttribute('aria-pressed', String(an));
  }
  const zelle = zellen.get(heuteSchluessel());
  if (zelle) schreibeZelle(zelle, heuteSchluessel());
  if (statusZeile) statusZeile.textContent = statusText();
  if (beobachtungBox) beobachtungBox.replaceChildren(...beobachtungInhalt().filter(Boolean));
  if (bilanzBox) bilanzBox.replaceChildren(...bilanzInhalt().filter(Boolean));
}

function statusText() {
  const w = wetterVon(heutigesWetter());
  return w ? `Heute eingetragen: ${w.emoji} ${w.name}.` : 'Für heute ist noch nichts eingetragen.';
}

function schreibeZelle(zelle, schluessel) {
  const w = wetterVon(tage?.[schluessel]?.wetter);
  zelle.textContent = w ? w.emoji : '·';
  zelle.setAttribute('aria-label', `${schluessel}: ${w ? w.name : 'nichts eingetragen'}`);
}

function beobachtungInhalt() {
  const w = wetterVon(heutigesWetter());
  if (!w) return [];
  return [el('div', { class: 'k-hinweis' },
    el('p', { style: 'font-weight:700;margin-top:0' }, `${w.emoji} Geht raus und schaut nach:`),
    el('p', { style: 'margin:0' }, w.beobachtung),
    el('button', {
      class: 'k-knopf k-knopf--neutral k-knopf--klein',
      style: 'margin-top:0.5rem',
      onclick: () => vorlesen(`${w.name}. ${w.beobachtung}`),
    }, '🔊 Vorlesen'))];
}

function heuteKarte() {
  const gewaehlt = heutigesWetter();
  statusZeile = el('p', { 'aria-live': 'polite', style: 'text-align:center;font-weight:700;margin:0.6rem 0 0' }, statusText());
  beobachtungBox = el('div', { style: 'margin-top:0.6rem' }, ...beobachtungInhalt().filter(Boolean));
  return el('section', { class: 'k-karte' },
    el('h2', { style: 'margin-top:0' }, '📅 Wie ist das Wetter heute?'),
    el('p', { style: 'margin-top:0' }, 'Schaut aus dem Fenster oder geht kurz vor die Tür. Tippt an, was ihr seht.'),
    el('div', { class: 'k-antworten', role: 'group', 'aria-label': 'Wetter heute' },
      ...daten.wetter.map((w) => {
        const an = gewaehlt === w.id;
        const knopf = el('button', {
          class: `k-knopf ${an ? '' : 'k-knopf--neutral'}`,
          style: 'min-height:5.5rem',
          'aria-pressed': String(an),
          'aria-label': w.name,
          onclick: () => setzeWetter(w.id),
        },
        el('span', { style: 'font-size:2.4em;display:block;line-height:1.1' }, w.emoji),
        el('span', {}, w.name));
        wetterKnoepfe.set(w.id, knopf);
        return knopf;
      })),
    statusZeile,
    beobachtungBox);
}

function bilanzInhalt() {
  const z = zaehleWetter(tage, fenster, daten.wetter);
  const haeufig = haeufigstesWetter(tage, fenster, daten.wetter);
  const eingetragen = anzahlEintraege(tage, fenster, daten.wetter);
  return [
    el('p', { style: 'margin:0.2rem 0' },
      ...daten.wetter.map((w) => el('span', { style: 'display:inline-block;margin-right:0.8rem;white-space:nowrap' },
        `${w.emoji} ${z[w.id]}×`))),
    el('p', { style: 'margin:0.4rem 0 0' },
      haeufig
        ? `An ${eingetragen} von ${fenster.length} Tagen habt ihr geforscht. Am häufigsten war: ${haeufig.emoji} ${haeufig.name}.`
        : 'Noch kein Tag eingetragen. Fangt heute an!'),
  ];
}

function rueckblickKarte() {
  const kurz = (s) => s.slice(8);
  bilanzBox = el('div', {}, ...bilanzInhalt().filter(Boolean));
  return el('section', { class: 'k-karte' },
    el('h2', { style: 'margin-top:0' }, '🗓️ Eure letzten vier Wochen'),
    el('div', {
      role: 'group',
      'aria-label': 'Wetter-Rückblick',
      style: 'display:grid;grid-template-columns:repeat(7,1fr);gap:0.25rem;max-width:22rem;margin:0.5rem 0',
    }, ...fenster.map((s) => {
      // role="img" ist hier nötig, nicht Zierrat: Ein div ohne Rolle ist
      // role=generic, und für generic verbietet ARIA einen Namen. Chromium
      // trägt das aria-label zwar trotzdem in seinen Baum ein, aber
      // spezifikationstreue Screenreader ignorieren es – das Datum wäre für
      // sie verloren, und die sichtbare Tageszahl ist aria-hidden. Gleiche
      // Lösung wie in wohlfuehl-ampel und uhr-und-kalender-kind.
      const feld = el('div', {
        role: 'img',
        style: 'aspect-ratio:1;display:flex;flex-direction:column;align-items:center;justify-content:center;'
          + 'border:1px solid var(--k-rand);border-radius:0.4rem;font-size:1.2rem',
      });
      schreibeZelle(feld, s);
      const zelle = el('div', { style: 'text-align:center' }, feld,
        el('span', { style: 'font-size:0.7rem', 'aria-hidden': 'true' }, kurz(s)));
      zellen.set(s, feld);
      return zelle;
    })),
    bilanzBox);
}

function jahreszeitKarte() {
  const jetzt = jahreszeitFuer(new Date());
  const eintrag = daten.jahreszeiten.find((j) => j.id === jetzt.id);
  return el('section', { class: 'k-karte' },
    el('h2', { style: 'margin-top:0' }, `${jetzt.emoji} Gerade ist ${jetzt.name}`),
    el('p', { style: 'margin-top:0' }, 'Das könnt ihr draußen suchen:'),
    el('ul', { style: 'margin:0;padding-left:1.2rem' }, ...eintrag.merkmale.map((m) => el('li', {}, m))),
    el('div', { class: 'k-hinweis', style: 'margin-top:0.6rem' },
      el('p', { style: 'font-weight:700;margin-top:0' }, '👪 Für Erwachsene – redet zusammen:'),
      el('p', { style: 'margin-bottom:0' }, eintrag.impuls)),
    el('button', {
      class: 'k-knopf k-knopf--neutral k-knopf--klein',
      style: 'margin-top:0.5rem',
      onclick: () => vorlesen(`Gerade ist ${jetzt.name}. ${eintrag.merkmale.join(' ')} ${eintrag.impuls}`),
    }, '🔊 Vorlesen'));
}

function datenKarte() {
  return el('section', { class: 'k-karte' },
    el('h2', { style: 'margin-top:0' }, '🔒 Eure Daten'),
    el('p', { style: 'margin-top:0' }, 'Hier wird nur das Wetter gezählt – nie das Kind. Es gibt keine Punkte und keine Note.'),
    el('p', {}, `Gespeichert werden die letzten ${TAGE_IM_RUECKBLICK} Tage, und zwar nur hier auf diesem Gerät. Ältere Tage verschwinden von allein.`),
    el('div', { class: 'k-antworten' },
      el('button', {
        id: LOESCH_KNOPF,
        class: 'k-knopf k-knopf--neutral',
        onclick: () => {
          localStorage.removeItem(SPEICHER);
          tage = {};
          render();
          document.getElementById(LOESCH_KNOPF)?.focus();
        },
      }, '🗑️ Alles löschen')));
}

function render() {
  wetterKnoepfe = new Map();
  zellen = new Map();
  fenster = letzteTage(TAGE_IM_RUECKBLICK, new Date());
  app.replaceChildren(...[
    el('h1', { class: 'k-titel' }, '🌦️ Wetter-Forscher'),
    el('p', { class: 'k-untertitel' }, 'Jeden Tag hinsehen – und merken, wie sich das Jahr dreht'),
    heuteKarte(),
    jahreszeitKarte(),
    rueckblickKarte(),
    datenKarte(),
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · ohne Anmeldung · keine Namen · Daten bleiben auf diesem Gerät · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')),
  ].filter(Boolean));
}

const fehler = pruefeDaten(daten);
if (fehler.length) {
  app.replaceChildren(el('div', { class: 'k-hinweis k-hinweis--falsch' }, el('p', { style: 'margin:0' }, `Datenfehler: ${fehler[0]}`)));
} else {
  render();
}
