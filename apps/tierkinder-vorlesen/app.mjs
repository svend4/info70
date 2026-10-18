// Tierkinder – Vorlesen: Werkzeug für Erwachsene, nicht für Kinder.
// Die Erwachsene wählt Tierart, Ort und Jungtier-Thema. Die App setzt daraus einen
// Vorlesetext aus festen eigenen Bausteinen zusammen. „Vorlesetext drucken“ druckt
// nur diesen einen Text auf ein Blatt, ohne Namenszeile. Es gibt keine Eingabefelder,
// keine Speicherung und keine Verbindung nach draußen. Die Bausteine kommen per JSON-Import.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import daten from './daten/bausteine.json' with { type: 'json' };
import {
  PFLICHTMARKIERUNG, orteFuer, startzustand, vollstaendig, vorlesetext,
  waehleJungtier, waehleOrt, waehleTierart, zustandsText,
} from './logik.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
let zustand = startzustand();

// Ein Knopf für eine Wahl. Die Kennung ist eindeutig, damit der Fokus nach dem Neuaufbau zurückkehrt.
function wahlKnopf(kennung, beschriftung, gewaehlt, aktion) {
  return el('button', {
    class: `k-knopf k-knopf--klein ${gewaehlt ? '' : 'k-knopf--neutral'}`,
    'aria-pressed': String(gewaehlt),
    'data-kennung': kennung,
    onclick: () => { zustand = aktion(zustand); render(); },
  }, beschriftung);
}

function tierartKnoepfe() {
  return daten.tierarten.map((t) => wahlKnopf(
    `tierart-${t.id}`, `${t.name} (${t.seite})`, zustand.tierart === t.id,
    (z) => waehleTierart(daten, z, t.id)));
}

function ortKnoepfe() {
  const orte = orteFuer(daten, zustand.tierart);
  if (!orte.length) return [el('p', { class: 'bsl-hinweis' }, 'Zuerst eine Tierart wählen.')];
  return orte.map((o) => wahlKnopf(
    `ort-${o.id}`, `${o.name} (${o.seite})`, zustand.ort === o.id,
    (z) => waehleOrt(daten, z, o.id)));
}

function jungtierKnoepfe() {
  return daten.jungtiere.map((j) => wahlKnopf(
    `jungtier-${j.id}`, `${j.name} (${j.seite})`, zustand.jungtier === j.id,
    (z) => waehleJungtier(daten, z, j.id)));
}

// Der Vorlesetext. Derselbe Inhalt steht auf dem Bildschirm und auf dem Blatt;
// auf dem Blatt verschwinden nur die Bildschirm-Teile (.bsl-nur-bildschirm).
function druckbereich(text) {
  return el('section', { class: 'bsl-druckbereich', id: 'druckbereich', 'aria-labelledby': 'vl-titel' },
    el('h2', { class: 'bsl-nur-druck bsl-druckkopf' }, text.kopf),
    el('h2', { id: 'vl-titel', class: 'bsl-nur-bildschirm bsl-steuertitel' }, 'Vorlesetext'),
    el('p', { class: 'bsl-bezeichnung' }, text.bezeichnung),
    ...text.absaetze.map((a) => el('div', { class: 'bsl-absatz' },
      el('p', { class: 'bsl-text' }, a.text),
      el('p', { class: 'bsl-kennzeichnung' }, a.kennzeichnung))),
    el('div', { class: 'bsl-fuss' },
      el('p', {}, text.hinweis),
      el('p', {}, text.quelle),
      el('p', { class: 'bsl-pflicht' }, text.pflicht)));
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
  const text = vorlesetext(daten, zustand);
  app.replaceChildren(
    el('h1', { class: 'k-titel bsl-nur-bildschirm' }, daten.titel),
    el('p', { class: 'k-untertitel bsl-nur-bildschirm' }, daten.untertitel),

    el('section', { class: 'k-karte bsl-nur-bildschirm', 'aria-labelledby': 'wahl-titel' },
      el('h2', { id: 'wahl-titel', class: 'bsl-steuertitel' }, 'Auswahl'),
      el('p', { class: 'bsl-schritt' }, '1. Tierart wählen'),
      el('div', { class: 'bsl-knopfreihe' }, ...tierartKnoepfe()),
      el('p', { class: 'bsl-schritt' }, '2. Ort wählen (passt zur Tierart)'),
      el('div', { class: 'bsl-knopfreihe' }, ...ortKnoepfe()),
      el('p', { class: 'bsl-schritt' }, '3. Jungtier-Thema wählen'),
      el('div', { class: 'bsl-knopfreihe' }, ...jungtierKnoepfe()),
      el('p', { class: 'bsl-zaehler' }, zustandsText(zustand)),
      el('div', { class: 'k-antworten' },
        el('button', {
          class: 'k-knopf',
          'data-kennung': 'drucken',
          disabled: !vollstaendig(daten, zustand),
          onclick: () => window.print(),
        }, 'Vorlesetext drucken'),
        el('button', {
          class: 'k-knopf k-knopf--neutral',
          'data-kennung': 'zuruecksetzen',
          onclick: () => { zustand = startzustand(); render(); },
        }, 'Auswahl zurücksetzen'))),

    text
      ? druckbereich(text)
      : el('section', { class: 'k-karte bsl-nur-bildschirm' },
          el('p', {}, 'Noch kein Vorlesetext. Bitte oben Tierart, Ort und Jungtier-Thema wählen.')),

    el('footer', { class: 'k-fuss bsl-nur-bildschirm' },
      el('p', {}, 'Werkzeug für Erwachsene. Nichts wird gespeichert, es gibt keine Verbindung nach draußen.'),
      el('p', {}, daten.sprachen),
      el('p', {}, PFLICHTMARKIERUNG),
      el('a', { class: 'bsl-fusslink', href: '../../impressum.html' }, 'Impressum und Datenschutz')));

  fokussiere(merkeKennung);
}

render();
