// Kindertänze Europas: Werkzeug für Fachkräfte, nicht für Kinder.
// Die Fachkraft wählt Tanzkarten und filtert nach Tanzart; „Ausgewählte
// Datenkarten drucken“ druckt nur die gewählten. druck.css macht je Karte ein
// Blatt A4 quer, ohne Zeichen, Kästchen oder Namenszeile. Es gibt keine
// Eingabefelder, keine Speicherung und keine Verbindung nach draußen. Die Daten
// kommen per JSON-Import.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import daten from './daten/tanze.json' with { type: 'json' };
import {
  alleGewaehlt, alternativText, ARTEN, auswahlBeschriftung, auswahlKennung, EIGENENTWURF,
  filterKennung, gewaehlteTanze, kannDrucken, melodieText, PFLICHTSATZ, quelleText, sichtbar,
  sichtbareAbwaehlen, sichtbareWaehlen, tanzartText, umschalten, zaehlerText,
} from './logik.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
let auswahl = alleGewaehlt(daten);
let filter = { art: 'alle' };

function abschnitt(ueberschrift, text) {
  return el('div', { class: 'ktz-abschnitt' },
    el('p', { class: 'ktz-ueberschrift' }, ueberschrift),
    el('p', { class: 'ktz-zeile' }, text));
}

// Eine gedruckte Karte. Sie trägt die Pflichtmarkierung im Druck (kein Bildschirm-only).
function karteDom(t) {
  const kopfId = `karte-${t.id}`;
  return el('section', { class: 'k-karte ktz-karte', 'aria-labelledby': kopfId },
    el('h2', { id: kopfId, class: 'ktz-titel' }, t.name_de),
    t.zusatz_de ? el('p', { class: 'ktz-zusatz' }, `Zusatz (${EIGENENTWURF}): ${t.zusatz_de}`) : null,
    el('p', { class: 'ktz-quelle' }, quelleText(t)),
    abschnitt('Tanzart', tanzartText(t)),
    t.art === 'tanz' ? abschnitt('Melodie', melodieText(t)) : null,
    t.alternativ_zitat ? el('p', { class: 'ktz-zeile' }, alternativText(t)) : null,
    abschnitt(`Schrittbeschreibung (${EIGENENTWURF})`, t.schritte),
    abschnitt(`Hinweis zur Bewegung (${EIGENENTWURF})`, t.hinweis),
    el('p', { class: 'ktz-fuss' }, `Altersgruppe: ${daten.altersgruppe}`),
    el('p', { class: 'ktz-fuss' }, `Tanzbezeichnung und Beschreibungen sind ${EIGENENTWURF}. Die Quelle nennt für diesen Tanz nur die Angabe oben.`),
    el('p', { class: 'ktz-fuss' }, daten.sprachhinweis),
    el('p', { class: 'ktz-pflicht' }, PFLICHTSATZ));
}

function filterReihe() {
  return el('div', { class: 'ktz-knopfreihe' }, ...ARTEN.map((a) => {
    const aktiv = filter.art === a.id;
    return el('button', {
      class: `k-knopf k-knopf--klein ${aktiv ? '' : 'k-knopf--neutral'}`,
      'aria-pressed': String(aktiv),
      'data-kennung': filterKennung(a.id),
      onclick: () => { filter = { art: a.id }; render(); },
    }, a.titel);
  }));
}

function auswahlKnopf(t) {
  const gewaehlt = auswahl.has(t.id);
  return el('button', {
    class: `k-knopf k-knopf--klein ${gewaehlt ? '' : 'k-knopf--neutral'}`,
    'aria-pressed': String(gewaehlt),
    'data-kennung': auswahlKennung(t.id),
    onclick: () => { auswahl = umschalten(auswahl, t.id); render(); },
  }, `${auswahlBeschriftung(t)}: ${gewaehlt ? 'gewählt' : 'nicht gewählt'}`);
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
  const sichtbareTanze = sichtbar(daten, filter);
  const sichtbareIds = sichtbareTanze.map((t) => t.id);
  const tanze = gewaehlteTanze(daten, auswahl);
  const druckbar = kannDrucken(tanze);

  app.replaceChildren(
    el('h1', { class: 'k-titel ktz-nur-bildschirm' }, daten.titel),
    el('p', { class: 'k-untertitel ktz-nur-bildschirm' }, daten.untertitel),

    el('section', { class: 'k-karte ktz-nur-bildschirm' },
      el('p', { class: 'ktz-steuertitel' }, 'Tanzart wählen'),
      filterReihe(),
      el('p', { class: 'ktz-steuertitel' }, 'Tanzkarten wählen'),
      el('p', { class: 'ktz-hinweis' }, daten.schrittHinweis),
      el('div', { class: 'ktz-knopfreihe' }, ...sichtbareTanze.map(auswahlKnopf)),
      el('div', { class: 'ktz-knopfreihe' },
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
      el('p', { class: 'ktz-zaehler' }, zaehlerText(tanze.length, daten.tanze.length)),
      el('div', { class: 'k-antworten' },
        el('button', {
          class: 'k-knopf',
          'data-kennung': 'drucken',
          disabled: !druckbar,
          onclick: () => window.print(),
        }, 'Ausgewählte Datenkarten drucken'))),

    el('section', { class: 'k-karte ktz-nur-bildschirm' },
      el('p', { class: 'ktz-steuertitel' }, 'Bewegungsbegriffe aus der Quelle'),
      el('p', { class: 'ktz-hinweis' }, daten.bewegungsHinweis),
      ...daten.bewegungsbegriffe.map((b) => el('p', { class: 'ktz-begriff' }, `«${b.zitat}» (${b.seite})`))),

    druckbar
      ? el('div', { class: 'ktz-druckbereich', id: 'druckbereich' }, ...tanze.map(karteDom))
      : el('p', { class: 'k-karte ktz-nur-bildschirm' },
          'Keine Tanzkarte gewählt. Wähle oben mindestens eine Karte.'),

    el('footer', { class: 'k-fuss ktz-nur-bildschirm' },
      el('p', {}, 'Werkzeug für Fachkräfte, kein Bildschirm für Kinder. Nichts wird gespeichert, es gibt keine Verbindung nach draußen.'),
      el('p', {}, daten.sprachhinweis),
      el('p', {}, PFLICHTSATZ),
      el('a', { class: 'ktz-fusslink', href: '../../impressum.html' }, 'Impressum und Datenschutz')));

  fokussiere(merkeKennung);
}

render();
