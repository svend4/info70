// Quiz-Kartenspiel-Druck (docs/09 Ось H). Aus den vorhandenen Quiz-JSON-Daten
// entsteht im Browser ein druckbares Kartendeck: Vorderseite Frage, Rückseite
// Antwort + Erklärung. Klassen ohne Tablets spielen dieselben Fälle analog.
// Politik docs/02: keine externen Anfragen; diese App speichert nichts.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { baueKarten, pruefeFragenListe } from './karten.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const DECKS = [
  { id: 'app-rechte-quiz', name: '📱 App-Rechte-Quiz', thema: 'App-Berechtigungen' },
  { id: 'kinderrechte-entdecker', name: '⚖️ Kinderrechte-Entdecker', thema: 'Kinderrechte' },
  { id: 'koeder-quiz', name: '🎣 Köder-Quiz', thema: 'Abzocke & Köder' },
  { id: 'darf-ich-posten', name: '📷 Darf ich das posten?', thema: 'Fotos & Posten' },
];

let karten = null;
let deckName = '';

async function ladeDeck(deck) {
  try {
    const daten = await fetch(`../${deck.id}/daten/fragen.json`).then((r) => r.json());
    const fragen = daten.fragen ?? daten;
    if (pruefeFragenListe(fragen).length) { alert('Dieses Deck kann nicht gelesen werden.'); return; }
    karten = baueKarten(fragen);
    deckName = deck.name;
    render();
  } catch (e) { alert('Deck konnte nicht geladen werden.'); }
}

function karteEl(k) {
  return el('div', { class: 'qk-karte' },
    el('div', { class: 'qk-vorne' },
      el('p', { class: 'qk-nr' }, `Nr. ${k.nr} · ${k.kategorie}`),
      el('p', { class: 'qk-frage' }, k.vorne)),
    el('div', { class: 'qk-hinten' },
      el('p', { class: 'qk-antwort' }, k.hinten)));
}

function render() {
  app.replaceChildren(
    el('h1', { class: 'k-titel qk-nur-bildschirm' }, '🃏 Quiz-Kartenspiel drucken'),
    el('p', { class: 'k-untertitel qk-nur-bildschirm' }, 'Wähle ein Quiz – daraus wird ein Kartendeck zum Ausdrucken, Ausschneiden und Spielen.'),
    el('section', { class: 'k-karte qk-nur-bildschirm' },
      el('p', { style: 'font-weight:600;margin-top:0' }, 'Deck wählen'),
      el('div', { class: 'k-antworten' }, ...DECKS.map((d) =>
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => ladeDeck(d) }, d.name))),
      karten ? el('button', { class: 'k-knopf', style: 'margin-top:0.6rem', onclick: () => window.print() }, '🖨️ Kartendeck drucken') : '',
      el('p', { style: 'font-size:0.85rem;color:#4b5563' }, 'Tipp: Karten an der durchgezogenen Linie ausschneiden, an der gestrichelten Linie falten – vorne die Frage, hinten die Antwort. Es wird nichts gespeichert.')),
    karten ? el('div', { class: 'qk-blatt' },
      el('p', { class: 'qk-decktitel' }, `${deckName} – ${karten.length} Karten`),
      el('div', { class: 'qk-gitter' }, ...karten.map(karteEl))) :
      el('section', { class: 'k-karte qk-nur-bildschirm' }, el('p', { style: 'margin:0;color:#4b5563' }, 'Noch kein Deck gewählt.')),
    el('footer', { class: 'k-fuss qk-nur-bildschirm' },
      el('span', {}, 'für die Klasse · werbefrei · läuft offline · speichert nichts · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
}

render();
