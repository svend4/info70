// Spielideen-Kartei: Werkzeug für Eltern und Fachkräfte, kein Bildschirm für Kinder.
// Die Erwachsenen filtern nach Gegenstand und Handlung und wählen Karten zum Druck.
// druck.css macht je gewählter Karte ein Blatt A4 hoch, ohne Zeichen, Kästchen oder
// Namenszeile. Es gibt keine Eingabefelder, keine Speicherung und keine Verbindung
// nach draußen. Die Karten kommen per JSON-Import.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import daten from './daten/spielideen.json' with { type: 'json' };
import {
  begriffZeilen, filtern, gegenstandZeilen, gewaehlteKarten, hinzufuegen, kannDrucken, umschalten,
} from './logik.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
let auswahl = new Set();
let filter = { gegenstand: 'alle', handlung: 'alle' };

function abschnitt(ueberschrift, zeilen) {
  return el('div', { class: 'bsk-abschnitt' },
    el('p', { class: 'bsk-ueberschrift' }, ueberschrift),
    ...zeilen.map((z) => el('p', { class: 'bsk-zeile' }, z)));
}

// Der Inhalt einer Karte. Auf dem Bildschirm und im Druck ist es derselbe Text.
function kartenInhalt(karte, praefix) {
  return [
    el('p', { class: 'bsk-kopf' }, 'Handlung (Eigenentwurf)'),
    el('h2', { id: `${praefix}-${karte.id}`, class: 'bsk-titel' }, karte.handlung),
    el('p', { class: 'bsk-quelle' }, `Quelle: ${karte.quelle}`),
    abschnitt('Begriffe in der Quelle', begriffZeilen(karte)),
    abschnitt('Gegenstand (Eigenentwurf nach der Quelle)', gegenstandZeilen(daten, karte)),
    abschnitt('Spielidee (Eigenentwurf)', [karte.spielidee]),
    abschnitt('Sicherheitssatz', [daten.sicherheitssatz]),
    el('p', { class: 'bsk-pflicht' }, daten.pflichtmarkierung),
  ];
}

// Druckkarte: nur im Druck sichtbar, ohne Knöpfe.
function druckKarte(karte) {
  return el('section', { class: 'k-karte bsk-karte', 'aria-labelledby': `druck-${karte.id}` },
    ...kartenInhalt(karte, 'druck'));
}

// Katalogkarte: nur auf dem Bildschirm, mit dem Knopf zur Auswahl für den Druck.
function katalogKarte(karte) {
  const gewaehlt = auswahl.has(karte.id);
  return el('section', {
    class: 'k-karte bsk-karte-bildschirm bsk-nur-bildschirm',
    'aria-labelledby': `karte-${karte.id}`,
  },
  ...kartenInhalt(karte, 'karte'),
  el('button', {
    class: `k-knopf ${gewaehlt ? '' : 'k-knopf--neutral'}`,
    'aria-pressed': String(gewaehlt),
    'data-kennung': `auswahl-${karte.id}`,
    onclick: () => { auswahl = umschalten(auswahl, karte.id); render(); },
  }, gewaehlt ? 'Für den Druck gewählt' : 'Für den Druck wählen'));
}

function filterKnopf(gruppe, wert, text, aktiv) {
  return el('button', {
    class: `k-knopf k-knopf--klein ${aktiv ? '' : 'k-knopf--neutral'}`,
    'aria-pressed': String(aktiv),
    'data-kennung': `filter-${gruppe}-${wert}`,
    onclick: () => { filter = { ...filter, [gruppe]: wert }; render(); },
  }, text);
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
  const sichtbar = filtern(daten, filter);
  const gewaehlt = gewaehlteKarten(daten, auswahl);
  const druckbar = kannDrucken(gewaehlt);
  app.replaceChildren(
    el('h1', { class: 'k-titel bsk-nur-bildschirm' }, daten.titel),
    el('p', { class: 'k-untertitel bsk-nur-bildschirm' }, daten.zielgruppe),

    el('section', { class: 'k-karte bsk-nur-bildschirm' },
      el('p', {}, daten.quellenHinweis),
      el('p', {}, daten.listenHinweis),
      el('p', {}, daten.sprachen)),

    el('section', { class: 'k-karte bsk-nur-bildschirm' },
      el('p', { class: 'bsk-steuertitel' }, 'Gegenstand wählen'),
      el('div', { class: 'bsk-knopfreihe' },
        filterKnopf('gegenstand', 'alle', 'Alle Gegenstände', filter.gegenstand === 'alle'),
        ...daten.gegenstaende.map((g) =>
          filterKnopf('gegenstand', g.id, g.name, filter.gegenstand === g.id))),
      el('p', { class: 'bsk-steuertitel' }, 'Handlung wählen'),
      el('div', { class: 'bsk-knopfreihe' },
        filterKnopf('handlung', 'alle', 'Alle Handlungen', filter.handlung === 'alle'),
        ...daten.karten.map((k) =>
          filterKnopf('handlung', k.id, k.handlung, filter.handlung === k.id)))),

    el('section', { class: 'k-karte bsk-nur-bildschirm' },
      el('p', { class: 'bsk-zaehler' },
        `${sichtbar.length} von ${daten.karten.length} Karten angezeigt. Gewählt zum Drucken: ${gewaehlt.length}.`),
      el('div', { class: 'bsk-knopfreihe' },
        el('button', {
          class: 'k-knopf k-knopf--klein k-knopf--neutral',
          'data-kennung': 'alle-sichtbaren-waehlen',
          onclick: () => { auswahl = hinzufuegen(auswahl, sichtbar.map((k) => k.id)); render(); },
        }, 'Angezeigte zum Drucken wählen'),
        el('button', {
          class: 'k-knopf k-knopf--klein k-knopf--neutral',
          'data-kennung': 'auswahl-leeren',
          onclick: () => { auswahl = new Set(); render(); },
        }, 'Auswahl leeren')),
      el('div', { class: 'k-antworten' },
        el('button', {
          class: 'k-knopf',
          'data-kennung': 'drucken',
          disabled: !druckbar,
          onclick: () => window.print(),
        }, `Gewählte Karten drucken (${gewaehlt.length})`)),
      el('p', { class: 'bsk-zaehler' },
        'Jede gewählte Karte kommt auf ein eigenes Blatt A4 hoch. Der Druck enthält nur die gewählten Karten.')),

    sichtbar.length
      ? el('div', { class: 'bsk-katalog bsk-nur-bildschirm' }, ...sichtbar.map(katalogKarte))
      : el('p', { class: 'k-karte bsk-nur-bildschirm' }, 'Keine Karte passt zu diesem Filter.'),

    el('div', { class: 'bsk-nur-druck', id: 'druckbereich' }, ...gewaehlt.map(druckKarte)),

    el('footer', { class: 'k-fuss bsk-nur-bildschirm' },
      el('p', {}, 'Werkzeug für Eltern und Fachkräfte. Nichts wird gespeichert, es gibt keine Verbindung nach draußen.'),
      el('p', {}, daten.pflichtmarkierung),
      el('a', { href: '../../impressum.html' }, 'Impressum und Datenschutz')));

  fokussiere(merkeKennung);
}

render();
