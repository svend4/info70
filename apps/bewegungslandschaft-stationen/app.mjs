// Bewegungslandschaften-Plakate Krippe: Werkzeug für Fachkräfte, nicht für Kinder.
// Die Fachkraft wählt Karten; „Stationskarten drucken“ druckt nur die gewählten.
// druck.css macht je Karte ein Blatt A4 quer, ohne Zeichen, Kästchen oder
// Namenszeile. Es gibt keine Eingabefelder, keine Speicherung und keine
// Verbindung nach draußen. Die Karten kommen per JSON-Import.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import daten from './daten/stationen.json' with { type: 'json' };
import { alleGewaehlt, gewaehlteKarten, kannDrucken, umschalten, zeileText } from './logik.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
let auswahl = alleGewaehlt(daten);

function karteDom(karte) {
  const kopfId = `karte-${karte.id}`;
  return el('section', { class: 'k-karte bsl-karte', 'aria-labelledby': kopfId },
    el('h2', { id: kopfId, class: 'bsl-titel' }, karte.titel),
    el('p', { class: 'bsl-quelle' }, karte.quelle),
    ...karte.abschnitte.map((abschnitt) =>
      el('div', { class: 'bsl-abschnitt' },
        el('p', { class: 'bsl-ueberschrift' }, abschnitt.ueberschrift),
        ...abschnitt.zeilen.map((zeile) => el('p', { class: 'bsl-zeile' }, zeileText(zeile))))),
    el('p', { class: 'bsl-fuss' }, karte.fuss));
}

function auswahlKnopf(karte) {
  const gewaehlt = auswahl.has(karte.id);
  return el('button', {
    class: `k-knopf k-knopf--klein ${gewaehlt ? '' : 'k-knopf--neutral'}`,
    'aria-pressed': String(gewaehlt),
    onclick: () => { auswahl = umschalten(auswahl, karte.id); render(); },
  }, karte.titel);
}

function render() {
  const karten = gewaehlteKarten(daten, auswahl);
  const druckbar = kannDrucken(karten);
  app.replaceChildren(
    el('h1', { class: 'k-titel bsl-nur-bildschirm' }, daten.titel),
    el('p', { class: 'k-untertitel bsl-nur-bildschirm' }, daten.quellenHinweis),

    el('section', { class: 'k-karte bsl-nur-bildschirm' },
      el('p', { class: 'bsl-steuertitel' }, 'Karten wählen'),
      el('div', { class: 'bsl-knopfreihe' }, ...daten.karten.map(auswahlKnopf)),
      el('div', { class: 'bsl-knopfreihe' },
        el('button', {
          class: 'k-knopf k-knopf--klein k-knopf--neutral',
          onclick: () => { auswahl = alleGewaehlt(daten); render(); },
        }, 'Alle wählen'),
        el('button', {
          class: 'k-knopf k-knopf--klein k-knopf--neutral',
          onclick: () => { auswahl = new Set(); render(); },
        }, 'Keine wählen')),
      el('p', { class: 'bsl-zaehler' },
        `${karten.length} von ${daten.karten.length} Karten gewählt. Jede Karte kommt auf ein eigenes Blatt A4 quer.`),
      el('div', { class: 'k-antworten' },
        el('button', {
          class: 'k-knopf',
          disabled: !druckbar,
          onclick: () => window.print(),
        }, 'Stationskarten drucken'))),

    druckbar
      ? el('div', { class: 'bsl-druckbereich', id: 'druckbereich' }, ...karten.map(karteDom))
      : el('p', { class: 'k-karte bsl-nur-bildschirm' },
          'Keine Karte gewählt. Wähle oben mindestens eine Karte.'),

    el('footer', { class: 'k-fuss bsl-nur-bildschirm' },
      el('span', {}, 'Werkzeug für Fachkräfte. Nichts wird gespeichert, es gibt keine Verbindung nach draußen. '),
      el('a', { href: '../../impressum.html' }, 'Impressum und Datenschutz')));
}

render();
