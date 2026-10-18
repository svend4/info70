// Kleine Forscher ohne Bildschirm: Werkzeug für Fachkräfte und Eltern, kein Bildschirm für Kinder.
// Die Fachkraft wählt Versuchskarten. „Blätter drucken“ druckt jede gewählte Karte als ein Blatt A4
// hoch; druck.css blendet alle Bildschirmteile aus. Es gibt keine Eingabefelder, keine Speicherung
// und keine Verbindung nach draußen.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import daten from './daten/karten.json' with { type: 'json' };
import { druckBlaetter, kartenFuerThemen } from './logik.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const ALLE_IDS = daten.karten.map((k) => k.id);
let auswahl = new Set();

function abschnitt(ueberschrift, inhalt) {
  return el('div', { class: 'bsk-abschnitt' },
    el('p', { class: 'bsk-ueberschrift' }, ueberschrift),
    ...inhalt);
}

// Der Inhalt eines Blatts. Auf dem Bildschirm und im Druck ist es derselbe Text.
function blattInhalt(praefix, blatt) {
  const z = blatt.zeilen;
  const b = daten.beschriftung;
  return [
    el('p', { class: 'bsk-kopf' }, z.kopf),
    el('p', { class: 'bsk-kopf' }, z.gestaltungKopf),
    el('h2', { id: `${praefix}-${blatt.id}`, class: 'bsk-titel' }, z.titel),
    el('p', { class: 'bsk-quelle' }, z.quelle),
    z.begriffe.length
      ? abschnitt(b.begriffe, z.begriffe.map((zeile) => el('p', { class: 'bsk-zeile' }, zeile)))
      : null,
    abschnitt(b.material, [el('p', { class: 'bsk-text' }, z.material)]),
    abschnitt(b.lernziel, [el('p', { class: 'bsk-text' }, z.lernziel)]),
    abschnitt(b.sicherheit, [el('p', { class: 'bsk-text' }, z.sicherheit)]),
    z.pflicht ? el('p', { class: 'bsk-pflicht' }, z.pflicht) : null,
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

function umschalten(id) {
  if (auswahl.has(id)) auswahl.delete(id);
  else auswahl.add(id);
  render();
}

function render() {
  const merkeKennung = document.activeElement?.dataset?.kennung;
  const gewaehlt = kartenFuerThemen(daten.karten, ALLE_IDS.filter((id) => auswahl.has(id)));
  const blaetter = druckBlaetter(daten, gewaehlt);

  app.replaceChildren(
    el('h1', { class: 'k-titel bsk-nur-bildschirm' }, daten.titel),
    el('p', { class: 'k-untertitel bsk-nur-bildschirm' }, daten.zielgruppe),

    el('section', { class: 'k-karte bsk-nur-bildschirm' },
      el('p', {}, daten.hinweis),
      el('p', {}, daten.sprachen)),

    el('section', { class: 'k-karte bsk-nur-bildschirm' },
      el('p', { class: 'bsk-steuertitel' }, 'Auswahl'),
      el('div', { class: 'bsk-knopfreihe' },
        ...daten.karten.map((k) => el('button', {
          class: 'k-knopf k-knopf--neutral',
          'data-kennung': `auswahl-${k.id}`,
          'aria-pressed': String(auswahl.has(k.id)),
          onclick: () => umschalten(k.id),
        }, k.titel))),
      el('div', { class: 'k-antworten' },
        el('button', {
          class: 'k-knopf k-knopf--neutral',
          'data-kennung': 'keine',
          onclick: () => { auswahl = new Set(); render(); },
        }, 'Keine wählen'),
        el('button', {
          class: 'k-knopf k-knopf--neutral',
          'data-kennung': 'alle',
          onclick: () => { auswahl = new Set(ALLE_IDS); render(); },
        }, 'Alle wählen'),
        el('button', {
          class: 'k-knopf',
          'data-kennung': 'drucken',
          disabled: blaetter.length === 0,
          onclick: () => window.print(),
        }, 'Blätter drucken')),
      el('p', { class: 'bsk-zaehler' },
        `${blaetter.length} von ${daten.karten.length} Karten gewählt. Jede Karte wird ein Blatt A4 hoch.`)),

    ...blaetter.map((blatt) => el('section', {
      class: 'k-karte bsk-karte-bildschirm bsk-nur-bildschirm',
      'aria-labelledby': `karte-${blatt.id}`,
    }, ...blattInhalt('karte', blatt))),

    el('div', { class: 'bsk-nur-druck', id: 'druckbereich' },
      ...blaetter.map((blatt) => el('section', {
        class: 'k-karte bsk-karte',
        'aria-labelledby': `druck-${blatt.id}`,
      }, ...blattInhalt('druck', blatt)))),

    el('footer', { class: 'k-fuss bsk-nur-bildschirm' },
      el('p', {}, 'Werkzeug für Fachkräfte. Nichts wird gespeichert, es gibt keine Verbindung nach draußen.'),
      el('p', {}, daten.pflichtmarkierung),
      el('a', { href: '../../impressum.html' }, 'Impressum und Datenschutz')));

  fokussiere(merkeKennung);
}

render();
