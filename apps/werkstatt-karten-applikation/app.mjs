// Werkstatt-Karten: Schneiden, Reissen, Kleben. Werkzeug für Fachkräfte, nicht für Kinder.
// Die Fachkraft wählt Technik- und Themenkarten; „Ausgewählte Karten drucken“ druckt
// nur die gewählten. druck.css macht je Karte ein Blatt A4 quer, ohne Zeichen,
// Kästchen oder Namenszeile. Es gibt keine Eingabefelder, keine Speicherung und
// keine Verbindung nach draußen. Die Karten kommen per JSON-Import.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import daten from './daten/karten.json' with { type: 'json' };
import {
  alleGewaehlt, auswahlKennung, filterKennung, gewaehlteKarten, kannDrucken, sichtbar,
  sichtbareAbwaehlen, sichtbareWaehlen, umschalten, zaehlerText, zeileText,
} from './logik.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
let auswahl = alleGewaehlt(daten);
let filter = { technik: 'alle', gruppe: 'alle' };

function karteDom(karte) {
  const kopfId = `karte-${karte.id}`;
  return el('section', { class: 'k-karte wsk-karte', 'aria-labelledby': kopfId },
    el('h2', { id: kopfId, class: 'wsk-titel' }, karte.titel),
    el('p', { class: 'wsk-quelle' }, karte.quelle),
    ...karte.abschnitte.map((abschnitt) => {
      const inhalt = abschnitt.art === 'schritte'
        ? [el('ol', { class: 'wsk-schritte' },
          ...abschnitt.zeilen.map((z) => el('li', { class: 'wsk-zeile' }, zeileText(z))))]
        : abschnitt.zeilen.map((z) => el('p', { class: 'wsk-zeile' }, zeileText(z)));
      return el('div', { class: 'wsk-abschnitt' },
        el('p', { class: 'wsk-ueberschrift' }, abschnitt.ueberschrift),
        ...inhalt);
    }),
    el('p', { class: 'wsk-fuss' }, karte.fuss));
}

function auswahlKnopf(karte) {
  const gewaehlt = auswahl.has(karte.id);
  return el('button', {
    class: `k-knopf k-knopf--klein ${gewaehlt ? '' : 'k-knopf--neutral'}`,
    'aria-pressed': String(gewaehlt),
    'data-kennung': auswahlKennung(karte.id),
    onclick: () => { auswahl = umschalten(auswahl, karte.id); render(); },
  }, `${karte.titel}: ${gewaehlt ? 'gewählt' : 'nicht gewählt'}`);
}

// Ein Filter ist eine Reihe Knöpfe; genau einer ist gedrückt.
function filterReihe(gruppe, optionen) {
  return el('div', { class: 'wsk-knopfreihe' }, ...optionen.map((o) => {
    const aktiv = filter[gruppe] === o.id;
    return el('button', {
      class: `k-knopf k-knopf--klein ${aktiv ? '' : 'k-knopf--neutral'}`,
      'aria-pressed': String(aktiv),
      'data-kennung': filterKennung(gruppe, o.id),
      onclick: () => { filter = { ...filter, [gruppe]: o.id }; render(); },
    }, o.titel);
  }));
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
  const sichtbareKarten = sichtbar(daten, filter);
  const technikKarten = sichtbareKarten.filter((k) => k.art !== 'thema');
  const themenKarten = sichtbareKarten.filter((k) => k.art === 'thema');
  const sichtbareIds = sichtbareKarten.map((k) => k.id);
  const karten = gewaehlteKarten(daten, auswahl);
  const druckbar = kannDrucken(karten);

  app.replaceChildren(
    el('h1', { class: 'k-titel wsk-nur-bildschirm' }, daten.titel),
    el('p', { class: 'k-untertitel wsk-nur-bildschirm' }, daten.untertitel),

    el('section', { class: 'k-karte wsk-nur-bildschirm' },
      el('p', { class: 'wsk-steuertitel' }, 'Technikkarten'),
      el('p', { class: 'wsk-hinweis' }, 'Der Technik-Filter wirkt nur auf die Technikkarten. Die drei Technikbereiche stehen ohne Reihenfolge.'),
      filterReihe('technik', [{ id: 'alle', titel: 'Alle Techniken' }, ...daten.techniken]),
      el('div', { class: 'wsk-knopfreihe' }, ...technikKarten.map(auswahlKnopf)),

      el('p', { class: 'wsk-steuertitel' }, 'Themenkarten'),
      el('p', { class: 'wsk-hinweis' }, 'Die Themengruppen sind eine Hilfe zum Suchen (Eigenentwurf). Sie stehen nicht auf den Karten.'),
      filterReihe('gruppe', [{ id: 'alle', titel: 'Alle Themen' }, ...daten.gruppen]),
      el('div', { class: 'wsk-knopfreihe' }, ...themenKarten.map(auswahlKnopf)),

      el('div', { class: 'wsk-knopfreihe' },
        el('button', {
          class: 'k-knopf k-knopf--klein k-knopf--neutral',
          'data-kennung': 'alle-sichtbar-waehlen',
          onclick: () => { auswahl = sichtbareWaehlen(auswahl, sichtbareIds); render(); },
        }, 'Alle sichtbaren wählen'),
        el('button', {
          class: 'k-knopf k-knopf--klein k-knopf--neutral',
          'data-kennung': 'alle-sichtbar-abwaehlen',
          onclick: () => { auswahl = sichtbareAbwaehlen(auswahl, sichtbareIds); render(); },
        }, 'Alle sichtbaren abwählen')),

      el('p', { class: 'wsk-zaehler' }, zaehlerText(karten.length, daten.karten.length)),
      el('p', { class: 'wsk-hinweis' }, 'Im Druckdialog die Kopf- und Fußzeilen ausschalten, sonst können Datum, Uhrzeit oder Adresse auf den Blättern erscheinen.'),
      el('div', { class: 'k-antworten' },
        el('button', {
          class: 'k-knopf',
          'data-kennung': 'drucken',
          disabled: !druckbar,
          onclick: () => window.print(),
        }, 'Ausgewählte Karten drucken'))),

    druckbar
      ? el('div', { class: 'wsk-druckbereich', id: 'druckbereich' }, ...karten.map(karteDom))
      : el('p', { class: 'k-karte wsk-nur-bildschirm' },
          'Keine Karte gewählt. Wähle oben mindestens eine Karte.'),

    el('footer', { class: 'k-fuss wsk-nur-bildschirm' },
      el('p', {}, 'Werkzeug für Fachkräfte, kein Bildschirm für Kinder. Nichts wird gespeichert, es gibt keine Verbindung nach draußen.'),
      el('p', {}, 'Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.'),
      el('a', { class: 'wsk-fusslink', href: '../../impressum.html' }, 'Impressum und Datenschutz')));

  fokussiere(merkeKennung);
}

render();
