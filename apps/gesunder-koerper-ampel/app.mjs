// Gesunder-Körper-Ampel (8-12 eigenständig, 5-7 in Ko-Nutzung):
// tägliche Selbstbeobachtung nach den Katalog-Faktoren Bewegung, Ruhe,
// Essen und Trinken, frische Luft, Sauberkeit – mit Wochenrückblick.
// Praleska docs/10 (Kinder-Apps Nr. 14). Bewusst ohne Punkte, Summen,
// Serien und Ränge: Das Kind beschreibt seinen Tag, es wird nicht
// bewertet. Politik docs/02: keine externen Anfragen, nur die letzten
// sieben Tage liegen löschbar auf dem Gerät.
//
// Die Seite wird nach einem Klick NICHT neu aufgebaut, sondern gezielt
// aktualisiert: #app ist eine aria-live-Region, ein Komplettaustausch
// würde dem Screenreader bei jedem Tipp die ganze Seite vorlesen.
import { el, vorlesen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { boot as bootAnzeige } from '../../packages/kinder-ui/js/anzeige.mjs';
import {
  TAGE_IM_RUECKBLICK, datumsSchluessel, letzteTage, beschneide,
  zaehleStufen, alleBeantwortet, pruefeFaktoren,
} from './logik.mjs';

installiereNetzwerkWaechter();
bootAnzeige();

const SPEICHER = 'koerper.ampel';
const LOESCH_KNOPF = 'alles-loeschen';
const app = document.getElementById('app');
const daten = await fetch('daten/faktoren.json').then((r) => r.json());
const stufeVon = (id) => daten.stufen.find((s) => s.id === id);
const faktorVon = (id) => daten.faktoren.find((f) => f.id === id);

let zustand = lade();
// Verweise auf die Knoten, die sich ändern können – je Render neu gefüllt.
let stufenKnoepfe = new Map();
let zellen = new Map();
let zaehlZeilen = new Map();
let vorhabenKnoepfe = new Map();
let statusZeile = null;
let vorhabenBox = null;
let fenster = [];

function lade() {
  try {
    const roh = JSON.parse(localStorage.getItem(SPEICHER) || '{}');
    return { tage: beschneide(roh.tage, new Date()), vorhaben: roh.vorhaben ?? null };
  } catch {
    return { tage: {}, vorhaben: null };
  }
}

function sichere() {
  zustand.tage = beschneide(zustand.tage, new Date());
  localStorage.setItem(SPEICHER, JSON.stringify(zustand));
}

function heutigerEintrag() {
  return zustand.tage[datumsSchluessel(new Date())] || {};
}

function setzeStufe(faktorId, stufeId) {
  const heute = datumsSchluessel(new Date());
  const eintrag = { ...(zustand.tage[heute] || {}) };
  // Nochmal derselbe Knopf = Eintrag zurücknehmen.
  if (eintrag[faktorId] === stufeId) delete eintrag[faktorId];
  else eintrag[faktorId] = stufeId;
  zustand.tage = { ...zustand.tage, [heute]: eintrag };
  sichere();
  aktualisiereFaktor(faktorId);
}

function setzeVorhaben(faktorId) {
  zustand.vorhaben = zustand.vorhaben === faktorId ? null : faktorId;
  sichere();
  aktualisiereVorhaben();
}

/** Nur die Knoten anfassen, die sich durch diesen einen Klick ändern. */
function aktualisiereFaktor(faktorId) {
  const eintrag = heutigerEintrag();
  const gewaehlt = eintrag[faktorId];
  for (const [stufeId, knopf] of stufenKnoepfe.get(faktorId)) {
    const an = gewaehlt === stufeId;
    knopf.className = `k-knopf k-knopf--klein ${an ? '' : 'k-knopf--neutral'}`;
    knopf.setAttribute('aria-pressed', String(an));
  }
  const heute = datumsSchluessel(new Date());
  const zelle = zellen.get(`${faktorId}|${heute}`);
  if (zelle) schreibeZelle(zelle, faktorVon(faktorId), heute);
  const zeile = zaehlZeilen.get(faktorId);
  if (zeile) zeile.textContent = zaehlText(faktorVon(faktorId));
  if (statusZeile) statusZeile.textContent = statusText(eintrag);
}

function aktualisiereVorhaben() {
  for (const [faktorId, knopf] of vorhabenKnoepfe) {
    const an = zustand.vorhaben === faktorId;
    knopf.className = `k-knopf k-knopf--klein ${an ? '' : 'k-knopf--neutral'}`;
    knopf.setAttribute('aria-pressed', String(an));
  }
  vorhabenBox.replaceChildren(...vorhabenInhalt().filter(Boolean));
}

function statusText(eintrag) {
  return alleBeantwortet(eintrag, daten.faktoren)
    ? '✅ Für heute hast du alles eingetragen.'
    : `Noch offen: ${daten.faktoren.filter((f) => !eintrag[f.id]).map((f) => f.name).join(', ')}`;
}

function zaehlText(f) {
  const z = zaehleStufen(zustand.tage, f.id, fenster);
  return `${f.emoji} ${f.name}: 🟢 ${z.viel}× · 🟡 ${z.etwas}× · ⚪ ${z.nochNicht}× · ohne Eintrag ${z.offen}×`;
}

function schreibeZelle(zelle, f, tag) {
  const stufe = stufeVon(zustand.tage?.[tag]?.[f.id]);
  zelle.textContent = stufe ? stufe.emoji : '·';
  zelle.setAttribute('aria-label', `${f.name} am ${tag}: ${stufe ? stufe.text : 'nichts eingetragen'}`);
}

function heuteKarte() {
  const eintrag = heutigerEintrag();
  statusZeile = el('p', { 'aria-live': 'polite', style: 'text-align:center;margin:0.6rem 0 0;font-weight:700' }, statusText(eintrag));
  return el('section', { class: 'k-karte' },
    el('h2', { style: 'margin-top:0' }, '📅 Heute'),
    el('p', { style: 'margin-top:0' }, 'Wie war dein Tag bis jetzt? Tippe an, was passt. Du kannst alles jederzeit wieder ändern.'),
    ...daten.faktoren.map((f) => {
      const proFaktor = new Map();
      stufenKnoepfe.set(f.id, proFaktor);
      return el('div', { style: 'margin:0.9rem 0;padding-top:0.6rem;border-top:1px solid var(--k-rand)' },
        el('p', { style: 'font-weight:700;margin:0' }, `${f.emoji} ${f.name}`),
        el('p', { style: 'margin:0.2rem 0 0.5rem' }, f.frage),
        el('div', { class: 'k-antworten', role: 'group', 'aria-label': `${f.name}: heute` },
          ...daten.stufen.map((s) => {
            const an = eintrag[f.id] === s.id;
            const knopf = el('button', {
              class: `k-knopf k-knopf--klein ${an ? '' : 'k-knopf--neutral'}`,
              'aria-pressed': String(an),
              'aria-label': `${f.name}: ${s.text}`,
              onclick: () => setzeStufe(f.id, s.id),
            }, `${s.emoji} ${s.text}`);
            proFaktor.set(s.id, knopf);
            return knopf;
          }),
          el('button', {
            class: 'k-knopf k-knopf--klein k-knopf--neutral',
            'aria-label': `Tipp zu ${f.name} vorlesen`,
            onclick: () => vorlesen(`${f.name}. ${f.impuls}`),
          }, '🔊 Tipp')));
    }),
    statusZeile);
}

function wochenKarte() {
  const kurz = (schluessel) => `${schluessel.slice(8)}.`;
  return el('section', { class: 'k-karte' },
    el('h2', { style: 'margin-top:0' }, '🗓️ Deine letzten sieben Tage'),
    el('p', { style: 'margin-top:0' }, 'Hier siehst du deinen eigenen Verlauf – keine Note, keine Punkte, kein Vergleich mit anderen.'),
    el('div', { style: 'overflow-x:auto' },
      el('table', { style: 'border-collapse:collapse;width:100%;min-width:20rem' },
        el('thead', {}, el('tr', {},
          el('th', { scope: 'col', style: 'text-align:left;padding:0.3rem' }, 'Tag'),
          ...fenster.map((s) => el('th', { scope: 'col', style: 'padding:0.3rem;font-weight:400' }, kurz(s))))),
        el('tbody', {}, ...daten.faktoren.map((f) => el('tr', {},
          el('th', { scope: 'row', style: 'text-align:left;padding:0.3rem;font-weight:700' }, `${f.emoji} ${f.name}`),
          ...fenster.map((tag) => {
            const zelle = el('td', { style: 'padding:0.3rem;text-align:center;font-size:1.2rem' });
            schreibeZelle(zelle, f, tag);
            zellen.set(`${f.id}|${tag}`, zelle);
            return zelle;
          })))))),
    el('div', {}, ...daten.faktoren.map((f) => {
      const zeile = el('p', { style: 'margin:0.2rem 0' }, zaehlText(f));
      zaehlZeilen.set(f.id, zeile);
      return zeile;
    })));
}

function vorhabenInhalt() {
  const gewaehlt = faktorVon(zustand.vorhaben);
  if (!gewaehlt) return [];
  return [el('div', { class: 'k-hinweis', style: 'margin-top:0.7rem' },
    el('p', { style: 'margin:0 0 0.4rem;font-weight:700' }, `Morgen: ${gewaehlt.emoji} ${gewaehlt.name}`),
    el('p', { style: 'margin:0' }, gewaehlt.impuls),
    el('button', {
      class: 'k-knopf k-knopf--klein k-knopf--neutral',
      style: 'margin-top:0.5rem',
      onclick: () => vorlesen(`Morgen: ${gewaehlt.name}. ${gewaehlt.impuls}`),
    }, '🔊 Vorlesen'))];
}

function vorhabenKarte() {
  vorhabenBox = el('div', {}, ...vorhabenInhalt().filter(Boolean));
  return el('section', { class: 'k-karte' },
    el('h2', { style: 'margin-top:0' }, '🎯 Was nimmst du dir für morgen vor?'),
    el('p', { style: 'margin-top:0' }, 'Such dir selbst etwas aus. Die App schlägt dir nichts vor – du weißt am besten, worauf du morgen achten willst.'),
    el('div', { class: 'k-antworten', role: 'group', 'aria-label': 'Vorhaben für morgen' },
      ...daten.faktoren.map((f) => {
        const an = zustand.vorhaben === f.id;
        const knopf = el('button', {
          class: `k-knopf k-knopf--klein ${an ? '' : 'k-knopf--neutral'}`,
          'aria-pressed': String(an),
          onclick: () => setzeVorhaben(f.id),
        }, `${f.emoji} ${f.name}`);
        vorhabenKnoepfe.set(f.id, knopf);
        return knopf;
      })),
    vorhabenBox);
}

function datenKarte() {
  return el('section', { class: 'k-karte' },
    el('h2', { style: 'margin-top:0' }, '🔒 Deine Daten'),
    el('p', { style: 'margin-top:0' }, 'Diese Ampel bewertet dich nicht: Es gibt keine Punkte, keine Serie, die reißen kann, und niemanden, mit dem du verglichen wirst. Ein ruhiger Tag ist kein Fehler – deshalb ist das dritte Feld weiß und nicht rot.'),
    el('p', {}, `Gespeichert werden nur deine letzten ${TAGE_IM_RUECKBLICK} Tage, und zwar nur hier auf diesem Gerät. Ältere Tage verschwinden von allein.`),
    el('div', { class: 'k-antworten' },
      el('button', {
        id: LOESCH_KNOPF,
        class: 'k-knopf k-knopf--neutral',
        onclick: () => {
          localStorage.removeItem(SPEICHER);
          zustand = { tage: {}, vorhaben: null };
          // Der einzige Pfad, der die Seite komplett neu aufbaut – dabei
          // würde der gerade gedrückte Knopf zerstört und der Fokus fiele
          // auf <body>. Deshalb hier zurücksetzen.
          render();
          document.getElementById(LOESCH_KNOPF)?.focus();
        },
      }, '🗑️ Alles löschen')));
}

function render() {
  stufenKnoepfe = new Map();
  zellen = new Map();
  zaehlZeilen = new Map();
  vorhabenKnoepfe = new Map();
  fenster = letzteTage(TAGE_IM_RUECKBLICK, new Date());
  app.replaceChildren(...[
    el('h1', { class: 'k-titel' }, '🚥 Gesunder-Körper-Ampel'),
    el('p', { class: 'k-untertitel' }, 'Dein Tag, von dir selbst beschrieben – ohne Noten'),
    heuteKarte(),
    wochenKarte(),
    vorhabenKarte(),
    datenKarte(),
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · ohne Anmeldung · Daten bleiben auf diesem Gerät · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')),
  ].filter(Boolean));
}

const fehler = pruefeFaktoren(daten);
if (fehler.length) {
  app.replaceChildren(el('div', { class: 'k-hinweis k-hinweis--falsch' }, el('p', { style: 'margin:0' }, `Datenfehler: ${fehler[0]}`)));
} else {
  render();
}
