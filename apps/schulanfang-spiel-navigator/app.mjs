// Schulanfang und Spiel (Praleska docs/10, Nr. 64, Quelle S. 242).
//
// Drei Teile: was rechtlich gilt und wer entscheidet; welche Bereiche die
// gemeinsame Empfehlung von KMK und JFMK nennt und wie sicher das jeweils
// ist; und was Spielen dazu beiträgt – ohne Versprechen. Hier wird kein Kind
// beurteilt, verglichen oder vorhergesagt (siehe logik.mjs). Die App
// speichert nichts. Politik docs/02: keine externen Anfragen.
import { el, vorlesen, lokaleStimme } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { pruefeDaten } from './logik.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const daten = await fetch('daten/navigator.json').then((r) => r.json());

let offeneFrage = null;
let offeneSpielart = null;
let zeigeZiele = false;
let zeigeAusschluss = false;

function vorleseKnopf(text, beschriftung = '🔊 Vorlesen') {
  const stimme = lokaleStimme('de');
  if (stimme === null) {
    return el('p', { class: 'k-hinweis ssn-nur-bildschirm', style: 'margin:0.6rem 0' },
      '🗣️ Auf diesem Gerät gibt es keine deutsche Stimme, die offline arbeitet. Vorlesen ist hier deshalb aus.');
  }
  return el('button', {
    class: 'k-knopf k-knopf--neutral k-knopf--klein ssn-nur-bildschirm',
    onclick: () => vorlesen(text, 'de-DE', stimme),
  }, beschriftung);
}

const hinweisKarte = (titel, ...absaetze) => el('div', { class: 'k-hinweis', style: 'margin-top:0.6rem' },
  el('p', { style: 'font-weight:700;margin-top:0' }, titel),
  ...absaetze.map((t) => el('p', { style: 'margin:0 0 0.3rem' }, t)));

function frageKarte(g) {
  const offen = offeneFrage === g.id;
  return el('div', { class: 'k-karte ssn-frage', style: 'margin:0.5rem 0;padding:0.7rem' },
    el('button', {
      class: 'k-knopf k-knopf--neutral ssn-nur-bildschirm',
      style: 'width:100%;text-align:start;min-height:3.2rem',
      id: `ssn-f-${g.id}`,
      'aria-expanded': String(offen),
      'aria-controls': `ssn-inhalt-${g.id}`,
      onclick: () => { offeneFrage = offen ? null : g.id; render(`ssn-f-${g.id}`); },
    }, `${g.zeichen} ${g.frage} ${offen ? '▲' : '▼'}`),
    el('p', { class: 'ssn-nur-druck', style: 'margin:0 0 0.2rem;font-weight:700' }, `${g.zeichen} ${g.frage}`),
    el('div', { id: `ssn-inhalt-${g.id}`, class: offen ? '' : 'ssn-zu' },
      el('p', { style: 'margin:0.3rem 0' }, g.antwort),
      el('p', { style: 'margin:0.2rem 0 0;font-size:0.85rem;color:#4b5563' }, `📚 ${g.quelle}`),
      offen ? vorleseKnopf(`${g.frage} ${g.antwort}`) : null));
}

function spielKarte(s) {
  const offen = offeneSpielart === s.id;
  return el('div', { class: 'k-karte ssn-spiel', style: 'margin:0.5rem 0;padding:0.7rem' },
    el('button', {
      class: 'k-knopf k-knopf--neutral ssn-nur-bildschirm',
      style: 'width:100%;text-align:start;min-height:3.2rem',
      id: `ssn-s-${s.id}`,
      'aria-expanded': String(offen),
      'aria-controls': `ssn-spiel-${s.id}`,
      onclick: () => { offeneSpielart = offen ? null : s.id; render(`ssn-s-${s.id}`); },
    }, `${s.zeichen} ${s.name} ${offen ? '▲' : '▼'}`),
    el('p', { class: 'ssn-nur-druck', style: 'margin:0 0 0.2rem;font-weight:700' }, `${s.zeichen} ${s.name}`),
    el('div', { id: `ssn-spiel-${s.id}`, class: offen ? '' : 'ssn-zu' },
      el('p', { style: 'margin:0.3rem 0;color:#4b5563' }, s.wasEsIst),
      el('p', { class: 'k-hinweis', style: 'margin:0.4rem 0' }, `👉 ${s.wasSieTun}`),
      el('p', { style: 'margin:0.2rem 0' }, `🛑 ${s.wasEsNichtIst}`),
      el('p', { style: 'margin:0.2rem 0 0;font-size:0.85rem;color:#4b5563' }, `📖 ${s.quellBezug}`),
      offen ? vorleseKnopf([s.wasEsIst, s.wasSieTun, s.wasEsNichtIst].join(' ')) : null));
}

function render(fokusElement = null) {
  app.replaceChildren(...[
    el('div', { class: 'ssn-nur-bildschirm' },
      el('h1', { class: 'k-titel' }, '🎒 Schulanfang und Spiel'),
      el('p', { class: 'k-untertitel' }, 'Wer entscheidet, was bekannt ist – und was Spielen damit zu tun hat')),

    el('section', { class: 'k-karte ssn-nur-bildschirm' },
      el('div', { class: 'k-hinweis' }, el('p', { style: 'margin:0;font-weight:600' }, daten.hinweis)),
      el('p', { style: 'margin:0.6rem 0 0' }, daten.wasEsIst),
      hinweisKarte('📘 Warum hier nicht „schulreif“ steht:', daten.warumNichtSchulreif),
      vorleseKnopf(`${daten.wasEsIst} ${daten.warumNichtSchulreif}`, '🔊 Das Wichtigste vorlesen')),

    el('section', { class: 'k-karte ssn-gilt' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '⚖️ Was gilt – und wer entscheidet'),
      ...daten.wasGilt.map(frageKarte),
      el('p', { class: 'k-hinweis', style: 'margin:0.6rem 0 0' }, `📍 ${daten.wohinMitFragen}`)),

    el('section', { class: 'k-karte ssn-bereiche' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '🧩 Die drei Bereiche – und wie sicher das jeweils ist'),
      ...daten.bereiche.map((b) => el('div', { style: 'margin:0.5rem 0' },
        el('p', { style: 'margin:0;font-weight:700' }, `${b.zeichen} ${b.name}`),
        el('p', { style: 'margin:0.2rem 0 0' }, b.wasGemeintIst),
        el('p', { style: 'margin:0.2rem 0 0' }, `🔎 ${b.wasBekanntIst}`),
        el('p', { style: 'margin:0.2rem 0 0;font-size:0.9rem;color:#4b5563' }, `⚖️ Stand: ${b.sicherheit}`),
        el('p', { class: 'ssn-nur-bildschirm', style: 'margin:0.2rem 0 0;font-size:0.85rem;color:#4b5563' }, `📚 ${b.quelle}`))),
      el('p', { class: 'k-hinweis', style: 'margin:0.6rem 0 0' }, daten.bereicheHinweis)),

    el('section', { class: 'k-karte ssn-spielarten' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '🎲 Vier Arten zu spielen'),
      ...daten.spielarten.map(spielKarte),
      el('p', { style: 'margin:0.6rem 0 0;font-size:0.9rem;color:#4b5563' }, daten.spielHinweis),
      el('div', { class: 'k-antworten ssn-nur-bildschirm' },
        el('button', { class: 'k-knopf k-knopf--klein', onclick: () => window.print() }, '🖨️ Blatt drucken'))),

    el('section', { class: 'k-karte ssn-nur-bildschirm' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '🧭 Was diese App nicht tut'),
      hinweisKarte('🚫 Keine Beurteilung, keine Vorhersage:', daten.keineBeurteilung),
      hinweisKarte('🔍 Kein Spiel als Diagnose:', daten.quellZielAbgelehnt)),

    el('section', { class: 'k-karte ssn-nur-bildschirm' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '📖 Die fünf Ziele der Quelle – und was daraus wurde'),
      el('div', { class: 'k-antworten' },
        el('button', {
          class: 'k-knopf k-knopf--neutral k-knopf--klein', 'aria-expanded': String(zeigeZiele),
          id: 'ssn-ziele',
          onclick: () => { zeigeZiele = !zeigeZiele; render('ssn-ziele'); },
        }, zeigeZiele ? '▲ Zuklappen' : '▼ Die fünf Ziele lesen')),
      zeigeZiele
        ? el('ol', { style: 'margin:0.5rem 0 0;padding-left:1.2rem;font-size:0.95rem' },
          ...daten.ziele.map((z) => el('li', { style: 'margin-bottom:0.45rem' },
            el('span', {}, z.kurz), el('br'),
            el('span', { style: 'color:#4b5563' },
              `${z.einordnung === 'gebaut' ? '→ gebaut' : z.einordnung === 'zurueckgewiesen' ? '→ zurückgewiesen' : '→ betrifft die Einrichtung'}: ${z.warum}`))))
        : null),

    el('section', { class: 'k-karte ssn-nur-bildschirm' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '🚫 Was hier nicht drinsteht – und warum'),
      el('div', { class: 'k-antworten' },
        el('button', {
          class: 'k-knopf k-knopf--neutral k-knopf--klein', 'aria-expanded': String(zeigeAusschluss),
          id: 'ssn-aus',
          onclick: () => { zeigeAusschluss = !zeigeAusschluss; render('ssn-aus'); },
        }, zeigeAusschluss ? '▲ Liste zuklappen' : '▼ Die Ausschlussliste lesen')),
      zeigeAusschluss
        ? el('div', {},
          el('ul', { style: 'margin:0.5rem 0 0;padding-left:1.2rem' },
            ...daten.ausgeschlossen.map((a) => el('li', { style: 'margin-bottom:0.5rem' },
              el('strong', {}, a.was), el('br'), el('span', {}, a.warum)))),
          el('p', { style: 'margin:0.6rem 0 0;font-size:0.9rem' }, daten.quelle.werk),
          el('p', { style: 'margin:0.2rem 0 0;font-size:0.9rem' }, daten.quelle.rechte),
          el('p', { style: 'margin:0.2rem 0 0;font-size:0.9rem' }, daten.quelle.abweichung))
        : null),

    el('section', { class: 'k-karte ssn-nur-bildschirm' },
      el('p', { style: 'margin:0;font-size:0.9rem' },
        'Für Fachkräfte, mit Beobachtungsbogen: ', el('a', { href: '../schulstart-begleiter/' }, 'Schulstart-Begleiter'),
        ' · Spielideen für zwischendurch: ', el('a', { href: '../bewegungs-schatzkiste/' }, 'Bewegungs-Schatzkiste'),
        ' · Vorlesen: ', el('a', { href: '../vorlese-kompass/' }, 'Vorlese-Kompass')),
      el('p', { style: 'margin:0.5rem 0 0;font-size:0.9rem' }, `☎️ ${daten.elterntelefon}`)),

    el('footer', { class: 'k-fuss ssn-nur-bildschirm' },
      el('span', {}, 'Werkzeug für Erwachsene · speichert nichts · beurteilt kein Kind · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')),
  ].filter(Boolean));

  if (fokusElement) document.getElementById(fokusElement)?.focus();
}

const fehler = pruefeDaten(daten);
if (fehler.length) {
  app.replaceChildren(el('div', { class: 'k-hinweis k-hinweis--falsch' },
    el('p', { style: 'margin:0' }, `Datenfehler: ${fehler[0]}`)));
} else {
  render();
  if ('speechSynthesis' in globalThis) {
    speechSynthesis.addEventListener?.('voiceschanged', () => render(), { once: true });
  }
}
