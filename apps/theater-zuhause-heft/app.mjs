// Theater zuhause: Werkzeug für Erwachsene, kein Bildschirm für Kinder.
// Die Erwachsene wählt auf dem Bildschirm, welche Seiten sie sieht. Der Druck enthält
// immer das ganze Heft in fester Reihenfolge; druck.css macht je Seite ein Blatt A4 hoch,
// ohne Zeichen, Kästchen oder Namenszeile. Es gibt keine Eingabefelder, keine Speicherung
// und keine Verbindung nach draußen. Die Inhalte kommen per JSON-Import.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import daten from './daten/heft.json' with { type: 'json' };
import { druckSeiten, filterName, filterWerte, filtern, seiteBloecke } from './logik.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
let filter = 'alle';

function abschnitt(ueberschrift, zeilen) {
  return el('div', { class: 'bsk-abschnitt' },
    el('p', { class: 'bsk-ueberschrift' }, ueberschrift),
    ...zeilen.map((z) => el('p', { class: 'bsk-zeile' }, z)));
}

function schritteListe(ueberschrift, schritte) {
  return el('div', { class: 'bsk-abschnitt' },
    el('p', { class: 'bsk-ueberschrift' }, ueberschrift),
    el('ol', { class: 'bsk-schritte' }, ...schritte.map((s) => el('li', {}, s))));
}

// Der Inhalt einer Seite. Auf dem Bildschirm und im Druck ist es derselbe Text.
function seiteInhalt(seite, praefix) {
  return seiteBloecke(daten, seite).map((b) => {
    switch (b.typ) {
      case 'kopf': return el('p', { class: 'bsk-kopf' }, b.text);
      case 'titel': return el('h2', { id: `${praefix}-${seite.id}`, class: 'bsk-titel' }, b.text);
      case 'text': return el('p', { class: 'bsk-text' }, b.text);
      case 'quelle': return el('p', { class: 'bsk-quelle' }, b.text);
      case 'abschnitt': return abschnitt(b.ueberschrift, b.zeilen);
      case 'schritte': return schritteListe(b.ueberschrift, b.schritte);
      case 'klein': return el('p', { class: 'bsk-klein' }, b.text);
      case 'pflicht': return el('p', { class: 'bsk-pflicht' }, b.text);
      default: return null;
    }
  });
}

// Bildschirmseite: nur auf dem Bildschirm sichtbar.
function bildschirmSeite(seite) {
  return el('section', {
    class: 'k-karte bsk-nur-bildschirm',
    'aria-labelledby': `karte-${seite.id}`,
  }, ...seiteInhalt(seite, 'karte'));
}

// Druckseite: jede Seite des Heftes, in fester Reihenfolge, nur im Druck sichtbar.
function druckSeite(seite) {
  return el('section', {
    class: 'k-karte bsk-seite',
    'aria-labelledby': `druck-${seite.id}`,
  }, ...seiteInhalt(seite, 'druck'));
}

function filterKnopf(wert, aktiv) {
  return el('button', {
    class: `k-knopf k-knopf--klein ${aktiv ? '' : 'k-knopf--neutral'}`,
    'aria-pressed': String(aktiv),
    'data-kennung': `filter-${wert}`,
    onclick: () => { filter = wert; render(); },
  }, filterName(daten, wert));
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
  const alle = druckSeiten(daten);
  const sichtbar = filtern(daten, filter);
  app.replaceChildren(
    el('h1', { class: 'k-titel bsk-nur-bildschirm' }, daten.titel),
    el('p', { class: 'k-untertitel bsk-nur-bildschirm' }, daten.zielgruppe),

    el('section', { class: 'k-karte bsk-nur-bildschirm' },
      el('p', {}, daten.quellenHinweis),
      el('p', {}, daten.sprachen)),

    el('section', { class: 'k-karte bsk-nur-bildschirm' },
      el('p', { class: 'bsk-steuertitel' }, 'Seiten wählen'),
      el('div', { class: 'bsk-knopfreihe' },
        ...filterWerte(daten).map((w) => filterKnopf(w, w === filter))),
      el('p', { class: 'bsk-zaehler' }, `${sichtbar.length} von ${alle.length} Seiten angezeigt.`)),

    el('section', { class: 'k-karte bsk-nur-bildschirm' },
      el('p', {}, 'Der Druck enthält immer das ganze Heft, in dieser Reihenfolge. Jede Seite kommt auf ein eigenes Blatt A4 hoch.'),
      el('p', { class: 'bsk-zaehler' }, 'Im Druckdialog Kopf- und Fußzeilen ausschalten; sonst können Datum, Uhrzeit oder die Adresse der Seite auf den Blättern erscheinen. Die App setzt selbst kein Datum und keine Adresse.'),
      el('div', { class: 'k-antworten' },
        el('button', {
          class: 'k-knopf',
          'data-kennung': 'drucken',
          onclick: () => window.print(),
        }, 'Heft drucken'))),

    sichtbar.length
      ? el('div', { class: 'bsk-katalog bsk-nur-bildschirm' }, ...sichtbar.map(bildschirmSeite))
      : el('p', { class: 'k-karte bsk-nur-bildschirm' }, 'Keine Seite passt zu dieser Auswahl.'),

    el('div', { class: 'bsk-nur-druck', id: 'druckbereich' }, ...alle.map(druckSeite)),

    el('footer', { class: 'k-fuss bsk-nur-bildschirm' },
      el('p', {}, 'Werkzeug für Erwachsene. Nichts wird gespeichert, es gibt keine Verbindung nach draußen.'),
      el('p', {}, daten.pflichtmarkierung),
      el('a', { href: '../../impressum.html' }, 'Impressum und Datenschutz')));

  fokussiere(merkeKennung);
}

render();
