// Sport-Schnupper-Stationen: Werkzeug für Fachkräfte, nicht für Kinder.
// Die Fachkraft wählt Karten; „Stationskarten drucken“ druckt nur die gewählten.
// druck.css macht je Karte ein Blatt A4 quer, ohne Zeichen, Kästchen oder
// Namenszeile. Es gibt keine Eingabefelder, keine Speicherung und keine
// Verbindung nach draußen. Die Karten kommen per JSON-Import.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import daten from './daten/stationen.json' with { type: 'json' };
import { alleGewaehlt, gewaehlteKarten, kannDrucken, PFLICHTSATZ, umschalten, zeileText } from './logik.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
let auswahl = alleGewaehlt(daten);

function karteDom(karte) {
  const kopfId = `karte-${karte.id}`;
  return el('section', { class: 'k-karte sss-karte', 'aria-labelledby': kopfId },
    el('h2', { id: kopfId, class: 'sss-titel' }, karte.titel),
    el('p', { class: 'sss-quelle' }, karte.quelle),
    ...karte.abschnitte.map((abschnitt) =>
      el('div', { class: 'sss-abschnitt' },
        el('p', { class: 'sss-ueberschrift' }, abschnitt.ueberschrift),
        ...abschnitt.zeilen.map((zeile) => el('p', { class: 'sss-zeile' }, zeileText(zeile))))),
    el('p', { class: 'sss-fuss' }, karte.fuss),
    el('p', { class: 'sss-pflicht' }, PFLICHTSATZ));
}

function auswahlKnopf(karte) {
  const gewaehlt = auswahl.has(karte.id);
  return el('button', {
    class: `k-knopf k-knopf--klein ${gewaehlt ? '' : 'k-knopf--neutral'}`,
    'aria-pressed': String(gewaehlt),
    'data-kennung': `auswahl-${karte.id}`,
    onclick: () => { auswahl = umschalten(auswahl, karte.id); render(); },
  }, karte.titel);
}

// Nach dem Neuaufbau bekommt der Knopf mit derselben Kennung den Fokus zurück.
// Sonst landet der Fokus nach jedem Klick auf dem Seitenkörper.
function fokussiere(kennung) {
  if (!kennung) return;
  const ziel = [...app.querySelectorAll('button[data-kennung]')]
    .find((b) => b.dataset.kennung === kennung);
  ziel?.focus();
}

function render() {
  const merkeKennung = document.activeElement?.dataset?.kennung;
  const karten = gewaehlteKarten(daten, auswahl);
  const druckbar = kannDrucken(karten);
  app.replaceChildren(
    el('h1', { class: 'k-titel sss-nur-bildschirm' }, daten.titel),
    el('p', { class: 'k-untertitel sss-nur-bildschirm' }, daten.quellenHinweis),

    el('section', { class: 'k-karte sss-nur-bildschirm' },
      el('p', { class: 'sss-steuertitel' }, 'Stationen wählen'),
      el('div', { class: 'sss-knopfreihe' }, ...daten.karten.map(auswahlKnopf)),
      el('div', { class: 'sss-knopfreihe' },
        el('button', {
          class: 'k-knopf k-knopf--klein k-knopf--neutral',
          'data-kennung': 'alle-waehlen',
          onclick: () => { auswahl = alleGewaehlt(daten); render(); },
        }, 'Alle wählen'),
        el('button', {
          class: 'k-knopf k-knopf--klein k-knopf--neutral',
          'data-kennung': 'keine-waehlen',
          onclick: () => { auswahl = new Set(); render(); },
        }, 'Keine wählen')),
      el('p', { class: 'sss-zaehler' },
        `${karten.length} von ${daten.karten.length} Karten gewählt. Jede Karte kommt auf ein eigenes Blatt A4 quer.`),
      el('div', { class: 'k-antworten' },
        el('button', {
          class: 'k-knopf',
          'data-kennung': 'drucken',
          disabled: !druckbar,
          onclick: () => window.print(),
        }, 'Stationskarten drucken'))),

    druckbar
      ? el('div', { class: 'sss-druckbereich', id: 'druckbereich' }, ...karten.map(karteDom))
      : el('p', { class: 'k-karte sss-nur-bildschirm' },
          'Keine Karte gewählt. Wähle oben eine Karte.'),

    el('footer', { class: 'k-fuss sss-nur-bildschirm' },
      el('p', {}, 'Werkzeug für Fachkräfte. Nichts wird gespeichert, es gibt keine Verbindung nach draußen.'),
      el('p', {}, PFLICHTSATZ),
      el('a', { class: 'sss-fusslink', href: '../../impressum.html' }, 'Impressum und Datenschutz')));

  fokussiere(merkeKennung);
}

render();
