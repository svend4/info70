// Kita-Unterstützungs-Navigator: Oberfläche. Die Seite wird einmal aufgebaut.
// Eine Antwort ändert nur die Knöpfe ihrer Frage, die Zählung ihres Blocks und
// die Berichtsvorschau, nicht die ganze Seite.
//
// Gespeichert wird nichts. Antworten liegen in einer Map im Speicher der Seite,
// die Kontaktzeilen in den Eingabefeldern. Nach dem Neuladen ist alles weg.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import {
  BLOECKE, ANTWORTEN, ANLAUFSTELLEN, QUELLE, zaehlText, berichtText,
} from './logik.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');

/** Antworten je Frage-Kennung. Nur im Speicher der Seite. */
const antworten = new Map();

function knopfKlasse(an) {
  return an ? 'k-knopf' : 'k-knopf k-knopf--neutral';
}

function berichtJetzt() {
  return berichtText(antworten, new Date());
}

/** Nur die Zählung des betroffenen Blocks neu schreiben. */
function aktualisiereZaehlung(block) {
  const anzeige = app.querySelector(`[data-zaehlung="${block.id}"]`);
  if (anzeige) anzeige.textContent = zaehlText(block, antworten);
}

/** Nur die Berichtsvorschau (Bildschirm und Druck) neu schreiben. */
function aktualisiereBericht() {
  const text = berichtJetzt();
  for (const knoten of app.querySelectorAll('[data-bericht]')) knoten.textContent = text;
}

/** Antwort setzen; ein zweiter Druck auf dieselbe Antwort nimmt sie zurück. */
function setzeAntwort(block, aufgabe, wahl) {
  if (antworten.get(aufgabe.id) === wahl) antworten.delete(aufgabe.id);
  else antworten.set(aufgabe.id, wahl);
  const gewaehlt = antworten.get(aufgabe.id);
  for (const knopf of app.querySelectorAll(`[data-frage="${aufgabe.id}"] button`)) {
    const an = knopf.dataset.antwort === gewaehlt;
    knopf.setAttribute('aria-pressed', String(an));
    knopf.className = knopfKlasse(an);
  }
  aktualisiereZaehlung(block);
  aktualisiereBericht();
}

function antwortKnopf(block, aufgabe, wahl) {
  const an = antworten.get(aufgabe.id) === wahl;
  return el('button', {
    type: 'button',
    class: knopfKlasse(an),
    'data-antwort': wahl,
    'aria-pressed': String(an),
    'aria-label': `${wahl}: ${aufgabe.frage}`,
    onclick: () => setzeAntwort(block, aufgabe, wahl),
  }, wahl);
}

function frageKarte(block, aufgabe) {
  return el('fieldset', {
    class: 'k-frage',
    'data-frage': aufgabe.id,
    style: 'border:0;margin:0 0 1.4rem;padding:0;min-width:0',
  },
    el('legend', { style: 'font-weight:600;padding:0;margin:0 0 0.3rem' }, aufgabe.frage),
    el('p', { style: 'font-size:0.8rem;color:#4b5563;margin:0 0 0.4rem' }, `Quelle: S. ${aufgabe.seite}`),
    aufgabe.hinweis ? el('p', { style: 'font-size:0.85rem;color:#374151;margin:0 0 0.5rem' }, aufgabe.hinweis) : null,
    el('div', { class: 'k-antworten' }, ...ANTWORTEN.map((wahl) => antwortKnopf(block, aufgabe, wahl))));
}

function blockKarte(block) {
  return el('section', { class: 'k-karte', 'aria-labelledby': `block-${block.id}` },
    el('h2', { id: `block-${block.id}`, style: 'margin:0 0 0.3rem;font-size:1.1rem' },
      el('span', { lang: 'ru' }, block.quelle), ` (${block.uebersetzung})`),
    el('p', { style: 'font-size:0.85rem;color:#4b5563;margin:0 0 0.5rem' }, `Quelle: S. ${block.seiten}`),
    el('p', {
      'data-zaehlung': block.id,
      style: 'font-size:0.9rem;font-weight:600;margin:0 0 1rem',
    }, zaehlText(block, antworten)),
    ...block.aufgaben.map((aufgabe) => frageKarte(block, aufgabe)));
}

function anlaufstellenKarte() {
  return el('section', { class: 'k-karte', 'aria-labelledby': 'anlaufstellen' },
    el('h2', { id: 'anlaufstellen', style: 'margin:0 0 0.3rem;font-size:1.1rem' }, 'Anlaufstellen (Kategorien)'),
    el('p', { style: 'font-size:0.9rem;margin:0 0 0.8rem' },
      'Diese Stellen sind Kategorien. Die App kennt keine Adresse und keine Telefonnummer. Die Zeilen werden von Hand eingetragen. Nichts davon wird gespeichert oder in den Bericht übernommen.'),
    ...ANLAUFSTELLEN.map((name) => el('div', { style: 'margin:0 0 0.9rem' },
      el('p', { style: 'font-weight:600;margin:0 0 0.2rem' }, name),
      el('label', { style: 'display:block;font-size:0.85rem' },
        'Kontakt (von Hand eintragen)',
        el('input', {
          type: 'text',
          autocomplete: 'off',
          style: 'display:block;width:100%;min-height:3rem;margin-top:0.2rem;font-size:1rem;border:2px solid #6b7280;border-radius:0.5rem;padding:0.4rem;box-sizing:border-box',
        })))));
}

function berichtKarte() {
  return el('section', { class: 'k-karte', 'aria-labelledby': 'bericht' },
    el('h2', { id: 'bericht', style: 'margin:0 0 0.3rem;font-size:1.1rem' }, 'Bericht'),
    el('p', { style: 'font-size:0.9rem;margin:0 0 0.8rem' },
      'Der Bericht zählt je Block und nennt die Fragen mit „nicht geregelt“. Er enthält keine Namen und keine Angaben zu einzelnen Kindern, Familien oder Personen.'),
    el('pre', {
      'data-bericht': '',
      style: 'white-space:pre-wrap;overflow-wrap:anywhere;font-family:inherit;font-size:0.9rem;background:#f3f4f6;padding:0.8rem;border-radius:0.5rem;margin:0 0 1rem',
    }, berichtJetzt()),
    el('button', {
      class: 'k-knopf',
      type: 'button',
      onclick: () => druckeMit('bericht'),
    }, 'Bericht drucken'),
    el('button', {
      class: 'k-knopf k-knopf--neutral',
      type: 'button',
      onclick: speichereBericht,
    }, 'Bericht als Textdatei speichern'));
}

function druckKarte() {
  return el('section', { class: 'k-karte', 'aria-labelledby': 'druck' },
    el('h2', { id: 'druck', style: 'margin:0 0 0.3rem;font-size:1.1rem' }, 'Leerer Druckbogen'),
    el('p', { style: 'font-size:0.9rem;margin:0 0 0.8rem' },
      'Der Bogen enthält alle Fragen und Linien zum Eintragen von Hand. Er zeigt keine Antworten vom Bildschirm.'),
    el('button', {
      class: 'k-knopf k-knopf--neutral',
      type: 'button',
      onclick: () => druckeMit('bogen'),
    }, 'Leeren Druckbogen drucken'));
}

/** Druckt genau ein Blatt: body[data-druck] bestimmt, welches druck.css zeigt. */
function druckeMit(modus) {
  document.body.dataset.druck = modus;
  window.addEventListener('afterprint', () => { delete document.body.dataset.druck; }, { once: true });
  window.print();
}

/** Bericht als Textdatei auf das Gerät laden. Nur auf Knopfdruck, nichts wird gespeichert. */
function speichereBericht() {
  const blob = new Blob([berichtJetzt()], { type: 'text/plain;charset=utf-8' });
  const adresse = URL.createObjectURL(blob);
  const link = el('a', { href: adresse, download: 'kita-unterstuetzung-bericht.txt', hidden: true });
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(adresse), 1000);
}

function linie() {
  return el('div', { class: 'k-linie' });
}

/** Leerer Druckbogen: Fragen, Antwortzeilen und Linien für die Anlaufstellen. Keine Kästchen. */
function druckBogen() {
  return el('section', { class: 'k-druck k-druck-bogen', 'aria-label': 'Leerer Druckbogen' },
    el('h1', {}, 'Kita-Unterstützungs-Navigator: Checkliste'),
    el('p', {}, `Grundlage: ${QUELLE}. Fragen und Hinweise sind Eigenentwurf.`),
    el('p', {}, 'Antwort von Hand eintragen: geregelt, teilweise, nicht geregelt oder Träger oder extern.'),
    el('p', {}, 'Datum'),
    linie(),
    ...BLOECKE.map((block) => el('section', {},
      el('h2', {}, el('span', { lang: 'ru' }, block.quelle), ` (${block.uebersetzung}), S. ${block.seiten}`),
      ...block.aufgaben.map((aufgabe) => el('div', { class: 'k-druck-frage' },
        el('p', {}, `S. ${aufgabe.seite}: ${aufgabe.frage}`),
        aufgabe.hinweis ? el('p', { class: 'k-druck-hinweis' }, aufgabe.hinweis) : null,
        el('p', { class: 'k-druck-optionen' }, `Antwort: ${ANTWORTEN.join(' · ')}`),
        linie(),
        linie())))),
    el('section', {},
      el('h2', {}, 'Anlaufstellen (Kategorien)'),
      ...ANLAUFSTELLEN.map((name) => el('div', { class: 'k-druck-frage' },
        el('p', {}, name),
        el('p', { class: 'k-druck-hinweis' }, 'Kontakt (von Hand eintragen)'),
        linie()))),
    el('p', { class: 'k-druck-hinweis' },
      'Dieser Bogen enthält keine Namen und keine Bewertung von Kindern, Familien oder Personen.'));
}

/** Bericht zum Drucken. Der Text wird bei jeder Antwort mit aktualisiert. */
function druckBericht() {
  return el('section', { class: 'k-druck k-druck-bericht', 'aria-label': 'Bericht zum Drucken' },
    el('pre', { class: 'k-druck-pre', 'data-bericht': '' }, berichtJetzt()));
}

function render() {
  app.replaceChildren(
    el('div', { class: 'k-bildschirm' },
      el('h1', { class: 'k-titel' }, 'Kita-Unterstützungs-Navigator'),
      el('p', { class: 'k-untertitel' }, 'Checkliste für Fachkraft und Träger: Welche Unterstützungsaufgaben deckt die Einrichtung ab?'),

      el('section', { class: 'k-karte' },
        el('p', { style: 'margin:0;font-size:0.95rem' },
          'Gegenstand sind die Einrichtung, das Team, die Gruppen und die Eltern insgesamt. Einzelne Kinder, einzelne Familien und einzelne Personen kommen hier nicht vor. Es werden keine Namen erfasst und niemand wird bewertet.'),
        el('p', { style: 'margin:0.6rem 0 0;font-size:0.9rem' },
          `Grundlage: ${QUELLE}. Fragen und Hinweise sind Eigenentwurf. Die deutschen Übersetzungen in Klammern sind Eigenentwurf.`),
        el('p', { style: 'margin:0.6rem 0 0;font-size:0.9rem' },
          'Nichts wird gespeichert. Antworten bleiben nur, solange diese Seite offen ist.')),

      ...BLOECKE.map(blockKarte),
      anlaufstellenKarte(),
      berichtKarte(),
      druckKarte(),

      el('footer', { class: 'k-fuss' },
        'Werkzeug für Fachkräfte und Träger · ohne Konto · nichts wird gespeichert · keine Verbindung nach außen')),

    druckBogen(),
    druckBericht());
}

render();
