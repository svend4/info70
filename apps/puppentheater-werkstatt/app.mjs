// Puppentheater-Werkstatt: Werkzeug für Fachkräfte, kein Bildschirm für Kinder.
// Ein Vorschlag besteht aus einem Gestaltungsauftrag aus der Praleska (mit Seite) und
// einem Stückanfang aus eigenen Bausteinen. „Neuer Vorschlag“ zieht neu. druck.css macht
// den Vorschlag zu einem Blatt A4 hoch, ohne Zeichen, Kästchen oder Namenszeile.
// Es gibt keine Eingabefelder, keine Speicherung und keine Verbindung nach draußen.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import daten from './daten/werkstatt.json' with { type: 'json' };
import { kartenZeilen, neuerVorschlag } from './logik.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
// Der einzige Zufall der App steht in dieser Datei; logik.mjs bekommt ihn als Parameter.
const zufall = () => Math.random();
let vorschlag = neuerVorschlag(daten, zufall);

function abschnitt(ueberschrift, inhalt) {
  return el('div', { class: 'bsk-abschnitt' },
    el('p', { class: 'bsk-ueberschrift' }, ueberschrift),
    ...inhalt);
}

// Der Inhalt des Blatts. Auf dem Bildschirm und im Druck ist es derselbe Text.
function kartenInhalt(praefix) {
  const z = kartenZeilen(daten, vorschlag);
  const b = daten.beschriftung;
  return [
    el('p', { class: 'bsk-kopf' }, z.kopf),
    el('p', { class: 'bsk-kopf' }, z.gestaltungKopf),
    el('h2', { id: `${praefix}-titel`, class: 'bsk-titel' }, z.titel),
    el('p', { class: 'bsk-quelle' }, z.quelle),
    abschnitt(b.auftrag, [el('p', { class: 'bsk-text' }, z.auftrag)]),
    abschnitt(b.begriffe, z.begriffe.map((zeile) => el('p', { class: 'bsk-zeile' }, zeile))),
    abschnitt(b.stueckanfang, [el('p', { class: 'bsk-text' }, z.stueckanfang)]),
    el('p', { class: 'bsk-pflicht' }, z.pflicht),
  ];
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
  app.replaceChildren(
    el('h1', { class: 'k-titel bsk-nur-bildschirm' }, daten.titel),
    el('p', { class: 'k-untertitel bsk-nur-bildschirm' }, daten.zielgruppe),

    el('section', { class: 'k-karte bsk-nur-bildschirm' },
      el('p', {}, daten.auftragHinweis),
      el('p', {}, daten.gruppenHinweis),
      el('p', {}, daten.quellenHinweis),
      el('p', {}, daten.sprachen)),

    el('section', { class: 'k-karte bsk-nur-bildschirm' },
      el('p', { class: 'bsk-steuertitel' }, 'Vorschlag'),
      el('div', { class: 'k-antworten' },
        el('button', {
          class: 'k-knopf',
          'data-kennung': 'neuer-vorschlag',
          onclick: () => { vorschlag = neuerVorschlag(daten, zufall); render(); },
        }, 'Neuer Vorschlag'),
        el('button', {
          class: 'k-knopf k-knopf--neutral',
          'data-kennung': 'drucken',
          onclick: () => window.print(),
        }, 'Blatt drucken')),
      el('p', { class: 'bsk-zaehler' },
        'Gedruckt wird der Vorschlag, ein Blatt A4 hoch. Der Druck enthält nur diesen Vorschlag: kein Eingabefeld und kein Feld für ein Kind.')),

    el('section', {
      class: 'k-karte bsk-karte-bildschirm bsk-nur-bildschirm',
      'aria-labelledby': 'karte-titel',
    }, ...kartenInhalt('karte')),

    el('div', { class: 'bsk-nur-druck', id: 'druckbereich' },
      el('section', { class: 'k-karte bsk-karte', 'aria-labelledby': 'druck-titel' },
        ...kartenInhalt('druck'))),

    el('footer', { class: 'k-fuss bsk-nur-bildschirm' },
      el('p', {}, 'Werkzeug für Fachkräfte. Nichts wird gespeichert, es gibt keine Verbindung nach draußen.'),
      el('p', {}, daten.pflichtmarkierung),
      el('a', { href: '../../impressum.html' }, 'Impressum und Datenschutz')));

  fokussiere(merkeKennung);
}

render();
