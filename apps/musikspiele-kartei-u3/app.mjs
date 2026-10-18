// Musikspiele-Kartei U3 – Praleska docs/10, Kita-Abschnitt, Nr. 78.
// Werkzeug für Fachkräfte mit Kindern von 1 bis 3 Jahren. Die Karten folgen den
// Gattungen der Quelle (S. 81–86); Beispiele sind Titel mit Seite, ohne Texte und
// Noten. Nichts wird gespeichert, keine externen Anfragen (docs/02). Der Druck zeigt nur die Karten,
// eine je Blatt, ohne Seitenangaben (die stehen nur auf dem Bildschirm).
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { ALTER_OHNE_ANGABE, DRUCK_KARTE_FUSS, DRUCK_KOPF, kartenFuer, pruefeDaten, quelleTextVon } from './logik.mjs';

installiereNetzwerkWaechter();

const PFLICHT = 'Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.';
const app = document.getElementById('app');
const daten = await fetch('daten/karten.json').then((r) => r.json());

// Der einzige Zustand: die gewählte Gattung. Im Speicher, nicht auf der Platte.
let gattung = null;

function knopf(text, aktiv, onklick, id) {
  return el('button', {
    class: `k-knopf k-knopf--klein${aktiv ? '' : ' k-knopf--neutral'}`,
    id,
    'aria-pressed': String(aktiv),
    onclick: onklick,
  }, text);
}

function karteBild(g) {
  return el('article', { class: 'k-karte mk-karte', id: `mk-${g.id}` },
    el('h2', { class: 'mk-kartentitel' }, g.gattung),
    el('p', {}, g.prinzip),
    el('p', { class: 'mk-alter' }, `Alter: ${g.altersHinweis ?? ALTER_OHNE_ANGABE}`),
    g.beispiele.length > 0
      ? el('div', { class: 'mk-beispiele' },
        el('p', { class: 'mk-quelle', style: 'margin-top:0' }, 'Beispiele (nur Titel):'),
        el('ul', { class: 'mk-liste' }, ...g.beispiele.map((b) => el('li', {},
          b.titel,
          el('span', { class: 'mk-nur-bildschirm' }, ` (${b.seite})`)))))
      : el('p', { class: 'mk-quelle' }, 'Keine Titelbeispiele in dieser Gattung; das Prinzip genügt.'),
    el('p', { class: 'mk-quelle' }, DRUCK_KARTE_FUSS),
    el('p', { class: 'mk-quelle mk-nur-bildschirm' }, quelleTextVon(g)));
}

function zeichne() {
  // Der Bildschirm wird neu aufgebaut. Der Fokus bleibt auf dem Knopf, der den Neuaufbau ausgelöst hat.
  const merkeKnopf = document.activeElement?.id ?? '';
  const karten = kartenFuer(daten, { gattung });
  app.replaceChildren(
    el('h1', { class: 'k-titel mk-nur-bildschirm' }, `🎵 ${daten.titel}`),
    el('p', { class: 'k-untertitel mk-nur-bildschirm' }, 'Spielgattungen für Kinder von 1 bis 3 Jahren – nach Gattungen gegliedert, die die Quelle zusammenfasst'),
    el('section', { class: 'k-karte mk-nur-bildschirm' },
      el('p', { style: 'margin-top:0;font-weight:600' }, daten.hinweis),
      el('p', {}, daten.wasEsIst),
      el('p', { class: 'mk-quelle' }, `Quelle: ${daten.quelle.werk}`),
      el('p', { class: 'mk-quelle' }, daten.nichtInDerQuelle),
      el('p', { class: 'mk-quelle' }, PFLICHT)),
    el('section', { class: 'k-karte mk-nur-bildschirm' },
      el('p', { style: 'font-weight:600;margin-top:0' }, 'Gattung wählen'),
      el('div', { class: 'k-antworten' },
        knopf('Alle Gattungen', gattung === null, () => { gattung = null; zeichne(); }, 'mk-filter-alle'),
        ...daten.gattungen.map((g) => knopf(g.gattung, gattung === g.id, () => {
          gattung = gattung === g.id ? null : g.id;
          zeichne();
        }, `mk-filter-${g.id}`)))),
    el('section', { class: 'mk-nur-bildschirm', style: 'margin-top:1rem' },
      el('p', { style: 'font-weight:600' }, `${karten.length} ${karten.length === 1 ? 'Karte' : 'Karten'} in dieser Auswahl`),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', id: 'mk-drucken', onclick: () => window.print() }, '🖨️ Diese Karten drucken'))),
    el('section', { class: 'mk-nur-druck' },
      el('p', { style: 'font-weight:600' }, `${daten.titel} – Karten`),
      el('p', {}, DRUCK_KOPF)),
    ...karten.map(karteBild),
    el('footer', { class: 'k-fuss mk-nur-bildschirm' },
      el('span', {}, 'Werkzeug für Fachkräfte – läuft offline – nichts wird gespeichert – '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
  if (merkeKnopf) document.getElementById(merkeKnopf)?.focus();
}

const fehler = pruefeDaten(daten);
if (fehler.length) {
  app.replaceChildren(el('div', { class: 'k-hinweis k-hinweis--falsch' },
    el('p', { style: 'margin:0' }, `Datenfehler: ${fehler[0]}`)));
} else {
  zeichne();
}
