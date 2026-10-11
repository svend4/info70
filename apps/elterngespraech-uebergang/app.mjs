// Elterngespraech zum Uebergang Kita-Grundschule (Praleska docs/10, Nr. 66,
// Quelle S. 300-311).
//
// Dieses Werkzeug stellt keine Frage ueber das Kind. Die 141 Merkmale der
// Quelle sind nicht als Punkte zum Ankreuzen uebernommen; umgedreht ist die
// Richtung der Frage (siehe logik.mjs). Werkzeug fuer Erwachsene, darum kein
// Kinderbildschirm und keine eltern.html. Politik docs/02: keine externen
// Anfragen; gespeichert wird nur, welche Fragen Sie mitnehmen wollen.
import { el, vorlesen, lokaleStimme } from '../../packages/kinder-ui/js/komponenten.mjs';
import { datenKarte } from '../../packages/kinder-ui/js/daten-karte.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { MERKMALE_INSGESAMT, merkmaleGezaehlt, pruefeDaten } from './logik.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const daten = await fetch('daten/gespraech.json').then((r) => r.json());
const SCHLUESSEL = 'eub-fragen';

// Der Stand liegt im Arbeitsspeicher, localStorage ist die Kopie (Muster aus
// Nr. 49). Sonst tut bei gesperrtem Speicher - privates Fenster, blockierte
// Website-Daten - jedes Antippen sichtbar nichts (Review Welle 83).
let speicherSperre = false;

/** Welche Fragen Sie mitnehmen - nicht, was Ihr Kind kann. */
function geleseneAuswahl() {
  try {
    const roh = JSON.parse(localStorage.getItem(SCHLUESSEL) ?? 'null');
    if (!Array.isArray(roh)) return [];
    const bekannt = new Set([...daten.gespraechsfelder.map((f) => f.id), ...daten.rechtliches.map((r) => r.id)]);
    // Entdoppeln: sonst widersprechen sich Kopfzeile und Druckknopf.
    return [...new Set(roh.filter((id) => bekannt.has(id)))];
  } catch { return []; }
}

let merkAuswahl = geleseneAuswahl();
const ladeAuswahl = () => merkAuswahl;

function speichereAuswahl(ids) {
  merkAuswahl = [...new Set(ids)];
  try {
    if (!merkAuswahl.length) localStorage.removeItem(SCHLUESSEL);
    else localStorage.setItem(SCHLUESSEL, JSON.stringify(merkAuswahl));
    speicherSperre = false;
  } catch { speicherSperre = true; }
}

let offenesFeld = null;
let offenesRecht = null;
let zeigeWarum = false;
let zeigeVor = false;
let zeigeAusschluss = false;

function vorleseKnopf(text, beschriftung = '🔊 Vorlesen') {
  const stimme = lokaleStimme('de');
  if (stimme === null) {
    return el('p', { class: 'k-hinweis eub-nur-bildschirm', style: 'margin:0.6rem 0' },
      '🗣️ Auf diesem Gerät gibt es keine deutsche Stimme, die offline arbeitet. Vorlesen ist hier deshalb aus.');
  }
  return el('button', {
    class: 'k-knopf k-knopf--neutral k-knopf--klein eub-nur-bildschirm',
    onclick: () => vorlesen(text, 'de-DE', stimme),
  }, beschriftung);
}

const hinweisKarte = (titel, ...absaetze) => el('div', { class: 'k-hinweis', style: 'margin-top:0.6rem' },
  el('p', { style: 'font-weight:700;margin-top:0' }, titel),
  ...absaetze.map((t) => el('p', { style: 'margin:0 0 0.3rem' }, t)));

function waehlKnopf(id, text, auswahl) {
  const an = auswahl.includes(id);
  return el('button', {
    class: `k-knopf k-knopf--klein ${an ? '' : 'k-knopf--neutral'} eub-nur-bildschirm`,
    style: 'display:block;width:100%;text-align:start;min-height:3rem;margin:0.3rem 0',
    id: `eub-w-${id}`,
    'aria-pressed': String(an),
    onclick: () => {
      const neu = an ? auswahl.filter((x) => x !== id) : [...auswahl, id];
      speichereAuswahl(neu);
      render(`eub-w-${id}`);
    },
  }, `${an ? '✔️ mitnehmen' : '▫️ mitnehmen'} · ${text}`);
}

function feldAnsicht(f, auswahl) {
  const offen = offenesFeld === f.id;
  return el('div', { class: 'k-karte eub-feld', style: 'margin:0.5rem 0;padding:0.7rem' },
    el('button', {
      class: 'k-knopf k-knopf--neutral eub-nur-bildschirm',
      style: 'width:100%;text-align:start;min-height:3.2rem',
      id: `eub-f-${f.id}`,
      'aria-expanded': String(offen),
      'aria-controls': `eub-i-${f.id}`,
      onclick: () => { offenesFeld = offen ? null : f.id; render(`eub-f-${f.id}`); },
    }, `${f.zeichen} ${f.name} · ${f.quellPunkte} Merkmale ${offen ? '▲' : '▼'}`),
    el('div', { id: `eub-i-${f.id}`, class: offen ? '' : 'eub-zu' },
      el('p', { style: 'margin:0.4rem 0 0.2rem;color:#4b5563' }, `📖 Was die Liste prüft: ${f.quellFrage}`),
      el('p', { style: 'margin:0.2rem 0' }, `🚫 Nicht übernommen: ${f.nichtUebernommen}`),
      el('div', { class: 'k-hinweis', style: 'margin:0.4rem 0' },
        el('p', { style: 'margin:0;font-weight:600' }, `💬 Ihre Frage: „${f.ihreFrage}“`),
        el('p', { style: 'margin:0.3rem 0 0;font-size:0.95rem' }, `🏠 Was Sie erzählen können: ${f.wasSieErzaehlen}`)),
      el('p', { style: 'margin:0.2rem 0 0;font-size:0.95rem;color:#4b5563' }, `📍 ${f.wohinEsGehoert}`),
      waehlKnopf(f.id, f.ihreFrage, auswahl),
      vorleseKnopf([f.name, f.nichtUebernommen, f.ihreFrage, f.wasSieErzaehlen].join(' '))));
}

function rechtAnsicht(r, auswahl) {
  const offen = offenesRecht === r.id;
  return el('div', { class: 'k-karte eub-recht', style: 'margin:0.5rem 0;padding:0.7rem' },
    el('button', {
      class: 'k-knopf k-knopf--neutral eub-nur-bildschirm',
      style: 'width:100%;text-align:start;min-height:3.2rem',
      id: `eub-r-${r.id}`,
      'aria-expanded': String(offen),
      'aria-controls': `eub-ri-${r.id}`,
      onclick: () => { offenesRecht = offen ? null : r.id; render(`eub-r-${r.id}`); },
    }, `${r.zeichen} ${r.frage} ${offen ? '▲' : '▼'}`),
    el('div', { id: `eub-ri-${r.id}`, class: offen ? '' : 'eub-zu' },
      el('p', { style: 'margin:0.4rem 0 0.2rem' }, r.antwort),
      el('p', { style: 'margin:0.2rem 0 0;font-size:0.85rem;color:#4b5563' }, `📚 ${r.quelle}`),
      waehlKnopf(r.id, r.frage, auswahl),
      vorleseKnopf(`${r.frage} ${r.antwort}`)));
}

function render(fokusElement = null) {
  const auswahl = ladeAuswahl();
  const gewaehlteFragen = [
    ...daten.gespraechsfelder.filter((f) => auswahl.includes(f.id)).map((f) => ({ zeichen: f.zeichen, text: f.ihreFrage })),
    ...daten.rechtliches.filter((r) => auswahl.includes(r.id)).map((r) => ({ zeichen: r.zeichen, text: r.frage })),
  ];
  // Ein leeres Blatt waere kein Blatt: ohne Auswahl stehen alle Fragen darauf.
  const zuDrucken = gewaehlteFragen.length ? gewaehlteFragen : [
    ...daten.gespraechsfelder.map((f) => ({ zeichen: f.zeichen, text: f.ihreFrage })),
    ...daten.rechtliches.map((r) => ({ zeichen: r.zeichen, text: r.frage })),
  ];

  app.replaceChildren(...[
    el('div', { class: 'eub-nur-bildschirm' },
      el('h1', { class: 'k-titel' }, '🗣️ Das Gespräch vor der Schule'),
      el('p', { class: 'k-untertitel' }, 'Fragen, die SIE stellen – keine Liste über Ihr Kind')),

    el('section', { class: 'k-karte eub-nur-bildschirm' },
      el('div', { class: 'k-hinweis' }, el('p', { style: 'margin:0;font-weight:600' }, daten.hinweis)),
      el('p', { style: 'margin:0.6rem 0 0' }, daten.wasEsIst),
      el('div', { class: 'k-antworten' },
        el('button', {
          class: 'k-knopf k-knopf--neutral k-knopf--klein', id: 'eub-warum',
          'aria-expanded': String(zeigeWarum),
          onclick: () => { zeigeWarum = !zeigeWarum; render('eub-warum'); },
        }, zeigeWarum ? '▲ zuklappen' : '▼ Warum keine Checkliste?')),
      zeigeWarum ? hinweisKarte('📋 Warum die Liste hier nicht steht:', daten.warumKeineCheckliste, daten.staerkenblick) : null,
      vorleseKnopf(`${daten.hinweis} ${daten.wasEsIst}`, '🔊 Das Wichtigste vorlesen')),

    el('section', { class: 'k-karte eub-felder' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' },
        `💬 ${daten.gespraechsfelder.length} Felder${auswahl.length ? ` · ${auswahl.length} Fragen gewählt` : ''}`),
      el('p', { class: 'eub-nur-bildschirm', style: 'margin:0 0 0.4rem;font-size:0.9rem;color:#4b5563' },
        'Zu jedem Feld der Quelle steht hier, was ihre Liste prüft, warum das nicht übernommen ist – und eine Frage, die Sie stellen können.'),
      speicherSperre
        ? el('p', { class: 'k-hinweis eub-nur-bildschirm', style: 'margin:0 0 0.4rem' },
          '🔒 Dieses Gerät lässt gerade nichts speichern – privates Fenster oder blockierte Website-Daten. Die Auswahl gilt, solange die Seite offen ist; nach dem Schließen ist sie weg. Drucken Sie das Blatt, dann haben Sie es auf Papier.')
        : null,
      ...daten.gespraechsfelder.map((f) => feldAnsicht(f, auswahl))),

    el('section', { class: 'k-karte eub-nur-bildschirm' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '⚖️ Was gilt – mit Quelle'),
      el('p', { style: 'margin:0 0 0.4rem;font-size:0.9rem;color:#4b5563' },
        'Einschulung ist Landesrecht. Hier steht, was in mehreren Bundesländern gilt und wo es nachzulesen ist – nicht, was bei Ihnen gilt.'),
      ...daten.rechtliches.map((r) => rechtAnsicht(r, auswahl))),

    el('section', { class: 'k-karte eub-nur-bildschirm' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' },
        `📐 Die ${daten.lernvoraussetzungen.length} Vorbedingungen der Quelle – und was hier gilt`),
      el('p', { style: 'margin:0 0 0.4rem' }, daten.lernvoraussetzungenHinweis),
      el('div', { class: 'k-antworten' },
        el('button', {
          class: 'k-knopf k-knopf--neutral k-knopf--klein', id: 'eub-vor',
          'aria-expanded': String(zeigeVor),
          onclick: () => { zeigeVor = !zeigeVor; render('eub-vor'); },
        }, zeigeVor ? '▲ zuklappen' : '▼ Alle acht lesen')),
      zeigeVor
        ? el('ol', { style: 'margin:0.5rem 0 0;padding-left:1.3rem' },
          ...daten.lernvoraussetzungen.map((v) => el('li', { style: 'margin-bottom:0.7rem' },
            el('span', { style: 'color:#4b5563' }, `„${v.kurz}“`), el('br'),
            el('strong', {}, '👉 '), el('span', {}, v.wasHierGilt),
            v.quelle ? el('span', {}, el('br'), el('span', { style: 'font-size:0.85rem;color:#4b5563' }, `📚 ${v.quelle}`)) : null)))
        : null),

    el('section', { class: 'k-karte eub-nur-bildschirm' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '🧭 Was dieses Werkzeug nicht tut'),
      hinweisKarte('📄 Kein Bericht:', daten.keinBericht),
      hinweisKarte('🌍 Nur deutsch:', daten.dreiSprachen),
      hinweisKarte('📍 Wohin mit Fragen:', daten.wohinMitFragen)),

    el('section', { class: 'k-karte eub-druckknopf' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '🖨️ Das Blatt für das Gespräch'),
      el('p', { style: 'margin:0 0 0.4rem' }, daten.vorbereitung),
      el('div', { class: 'k-antworten eub-nur-bildschirm' },
        el('button', { class: 'k-knopf k-knopf--klein', id: 'eub-druck', onclick: () => window.print() },
          `🖨️ ${zuDrucken.length} ${zuDrucken.length === 1 ? 'Frage' : 'Fragen'} drucken`))),

    // Das Blatt: Ihre Fragen und Platz fuer die Antworten. Keine Haken, keine
    // Punkte, keine Namenszeile (docs/02) - und nichts ueber das Kind.
    el('section', { class: 'eub-nur-druck eub-blatt' },
      el('h2', { style: 'margin:0 0 2mm' }, '🗣️ Meine Fragen für das Gespräch'),
      ...zuDrucken.map((q) => el('div', { class: 'eub-blatt-frage' },
        el('p', { style: 'margin:0 0 1mm;font-weight:700' }, `${q.zeichen} ${q.text}`),
        el('p', { class: 'eub-linien', style: 'margin:0 0 3mm' }, ' '))),
      el('p', { style: 'margin:4mm 0 0;font-size:9pt' }, daten.vorbereitung)),

    el('div', { class: 'eub-nur-bildschirm' },
      datenKarte({
        schluessel: SCHLUESSEL,
        was: 'die Fragen, die Sie mitnehmen wollen (nur dieses Gerät, keine Angaben über Ihr Kind)',
        nachLoeschen: () => { merkAuswahl = []; render(); },
        knopfId: 'eub-loeschen',
        klasse: 'eub-nur-bildschirm',
      })),

    el('section', { class: 'k-karte eub-nur-bildschirm' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '🚫 Was hier nicht drinsteht – und warum'),
      el('div', { class: 'k-antworten' },
        el('button', {
          class: 'k-knopf k-knopf--neutral k-knopf--klein', id: 'eub-aus',
          'aria-expanded': String(zeigeAusschluss),
          onclick: () => { zeigeAusschluss = !zeigeAusschluss; render('eub-aus'); },
        }, zeigeAusschluss ? '▲ Liste zuklappen' : '▼ Die Ausschlussliste lesen')),
      zeigeAusschluss
        ? el('div', {},
          el('ul', { style: 'margin:0.5rem 0 0;padding-left:1.2rem' },
            ...daten.ausgeschlossen.map((a) => el('li', { style: 'margin-bottom:0.5rem' },
              el('strong', {}, a.was), el('br'), el('span', {}, a.warum)))),
          el('p', { style: 'margin:0.6rem 0 0;font-size:0.9rem' }, daten.quelle.werk),
          el('p', { style: 'margin:0.2rem 0 0;font-size:0.9rem' }, daten.quelle.rechte),
          el('p', { style: 'margin:0.2rem 0 0;font-size:0.9rem' }, daten.quelle.nachgezaehlt),
          el('p', { style: 'margin:0.2rem 0 0;font-size:0.9rem' }, daten.quelle.abweichung),
          el('p', { style: 'margin:0.4rem 0 0;font-size:0.9rem' },
            `Nachgezählt: ${merkmaleGezaehlt(daten)} Merkmale, und die Quelle trägt ${MERKMALE_INSGESAMT}.`))
        : null),

    el('section', { class: 'k-karte eub-nur-bildschirm' },
      el('p', { style: 'margin:0;font-size:0.9rem' },
        'Vor der Einschulung: ', el('a', { href: '../schulanfang-spiel-navigator/' }, 'Schulanfang und Spiel'),
        ' · Beobachtung durch Fachkräfte: ', el('a', { href: '../schulstart-begleiter/' }, 'Schulstart-Begleiter'),
        ' · Brief an die Kita: ', el('a', { href: '../eltern-rechtebriefe/' }, 'Eltern-Rechtebriefe')),
      el('p', { style: 'margin:0.5rem 0 0;font-size:0.9rem' }, `☎️ ${daten.elterntelefon}`)),

    el('footer', { class: 'k-fuss eub-nur-bildschirm' },
      el('span', {}, 'Werkzeug für Erwachsene · keine Frage über Ihr Kind · kein Bericht · '),
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
