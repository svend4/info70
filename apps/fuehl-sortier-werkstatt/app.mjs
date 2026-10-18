// Fühl- und Sortier-Werkstatt: Werkzeug für Fachkräfte und Eltern, kein Bildschirm für Kinder.
// Die Erwachsenen filtern nach Material oder Sortierauftrag und wählen Karten für den Druck.
// druck.css macht je gewählter Karte ein Blatt A4 hoch, ohne Zeichen, Kästchen oder
// Namenszeile. Es gibt keine Eingabefelder, keine Speicherung und keine Verbindung
// nach draußen. Die Karten kommen per JSON-Import.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import daten from './daten/werkstatt.json' with { type: 'json' };
import {
  filtern, gewaehlteKarten, hinzufuegen, kannDrucken, kartenAufbau, umschalten,
} from './logik.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
let auswahl = new Set();
let filter = { material: 'alle', sortierung: 'alle' };

function abschnitt(ueberschrift, zeilen) {
  return el('div', { class: 'fsw-abschnitt' },
    el('p', { class: 'fsw-ueberschrift' }, ueberschrift),
    ...zeilen.map((z) => el('p', { class: 'fsw-zeile' }, z)));
}

// Der Inhalt einer Karte. Auf dem Bildschirm und im Druck ist es derselbe Aufbau.
function kartenInhalt(karte, praefix) {
  const a = kartenAufbau(daten, karte);
  return [
    el('p', { class: 'fsw-kopf' }, a.kopf),
    el('h2', { id: `${praefix}-${karte.id}`, class: 'fsw-titel' }, a.titel),
    el('p', { class: 'fsw-quelle' }, a.quelle),
    ...a.abschnitte.map(([ueberschrift, zeilen]) => abschnitt(ueberschrift, zeilen)),
    el('p', { class: 'fsw-pflicht' }, a.pflicht),
  ];
}

// Druckkarte: nur im Druck sichtbar, ohne Knöpfe.
function druckKarte(karte) {
  return el('section', { class: 'k-karte fsw-karte', 'aria-labelledby': `druck-${karte.id}` },
    ...kartenInhalt(karte, 'druck'));
}

// Katalogkarte: nur auf dem Bildschirm, mit dem Knopf zur Auswahl für den Druck.
function katalogKarte(karte) {
  const gewaehlt = auswahl.has(karte.id);
  return el('section', {
    class: 'k-karte fsw-katalogkarte fsw-nur-bildschirm',
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
    el('h1', { class: 'k-titel fsw-nur-bildschirm' }, daten.titel),
    el('p', { class: 'k-untertitel fsw-nur-bildschirm' }, daten.zielgruppe),

    el('section', { class: 'k-karte fsw-nur-bildschirm' },
      el('p', {}, 'Werkzeug für Fachkräfte und Eltern. Das Kind braucht dafür keinen Bildschirm.'),
      el('p', {}, daten.quellenHinweis),
      el('p', {}, daten.altersHinweis),
      el('p', {}, daten.sprachen)),

    el('section', { class: 'k-karte fsw-nur-bildschirm' },
      el('p', { class: 'fsw-steuertitel' }, 'Material wählen'),
      el('div', { class: 'fsw-knopfreihe' },
        filterKnopf('material', 'alle', 'Alle Materialien', filter.material === 'alle'),
        ...daten.materialien.map((m) =>
          filterKnopf('material', m.id, m.name, filter.material === m.id))),
      el('p', { class: 'fsw-steuertitel' }, 'Sortierauftrag wählen'),
      el('div', { class: 'fsw-knopfreihe' },
        filterKnopf('sortierung', 'alle', 'Alle Aufträge', filter.sortierung === 'alle'),
        ...daten.sortierungen.map((s) =>
          filterKnopf('sortierung', s.id, s.name, filter.sortierung === s.id)))),

    el('section', { class: 'k-karte fsw-nur-bildschirm' },
      el('p', { class: 'fsw-zaehler' },
        `${sichtbar.length} von ${daten.karten.length} Karten angezeigt. Gewählt zum Drucken: ${gewaehlt.length}.`),
      el('div', { class: 'fsw-knopfreihe' },
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
      el('p', { class: 'fsw-zaehler' },
        druckbar
          ? 'Jede gewählte Karte kommt auf ein eigenes Blatt A4 hoch. Der Druck enthält nur die gewählten Karten.'
          : 'Keine Karte gewählt. Zum Drucken zuerst Karten für den Druck wählen.')),

    sichtbar.length
      ? el('div', { class: 'fsw-katalog fsw-nur-bildschirm' }, ...sichtbar.map(katalogKarte))
      : el('p', { class: 'k-karte fsw-nur-bildschirm' }, 'Keine Karte passt zu diesem Filter.'),

    el('div', { class: 'fsw-nur-druck', id: 'druckbereich' }, ...gewaehlt.map(druckKarte)),

    el('footer', { class: 'k-fuss fsw-nur-bildschirm' },
      el('p', {}, 'Werkzeug für Fachkräfte und Eltern. Nichts wird gespeichert, es gibt keine Verbindung nach draußen.'),
      el('p', {}, daten.pflichtmarkierung),
      el('a', { href: '../../impressum.html' }, 'Impressum und Datenschutz')));

  fokussiere(merkeKennung);
}

render();
